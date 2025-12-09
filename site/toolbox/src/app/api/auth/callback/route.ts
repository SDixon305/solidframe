import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { syncUserRecord } from '@/lib/supabase-server'

export async function GET(request: Request) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const redirect = requestUrl.searchParams.get('redirect') || '/admin'
    const origin = requestUrl.origin

    if (code) {
        const supabase = await createClient()

        // Exchange the code for a session
        const { data: { user }, error: authError } = await supabase.auth.exchangeCodeForSession(code)

        if (authError) {
            console.error('Auth callback error:', authError)
            return NextResponse.redirect(
                new URL(`/login?error=${encodeURIComponent('Failed to authenticate. Please try again.')}`, origin)
            )
        }

        if (user) {
            // Sync the user record in the database
            const { user: dbUser, error: syncError } = await syncUserRecord(
                user.id,
                user.email || ''
            )

            if (syncError) {
                console.warn('User sync warning:', syncError)
                // Don't block login, but the user may have limited access
                // This happens when a user logs in but doesn't have a pre-created record
            }

            // If we have a dbUser, check their role for proper redirect
            if (dbUser) {
                // super_admin goes to /admin
                if (dbUser.role === 'super_admin') {
                    return NextResponse.redirect(new URL('/admin', origin))
                }

                // client_user goes to their tenant portal (or fallback)
                if (dbUser.role === 'client_user' || dbUser.role === 'admin') {
                    // TODO: Get tenant slug and redirect to /{tenant-slug}
                    // For now, redirect to the requested page or home
                    return NextResponse.redirect(new URL(redirect, origin))
                }
            }
        }
    }

    // Default redirect
    return NextResponse.redirect(new URL(redirect, origin))
}
