'use server'

import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient } from '@/utils/supabase/server'

// Server action to send magic link (alternative to API route)
export async function sendMagicLink(formData: FormData) {
    const supabase = await createClient()
    const email = formData.get('email') as string

    if (!email) {
        return redirect('/login?error=Email is required')
    }

    // Get the origin from headers
    const headersList = await headers()
    const origin = headersList.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const callbackUrl = `${origin}/api/auth/callback`

    const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
            emailRedirectTo: callbackUrl,
        },
    })

    if (error) {
        console.error('Magic link error:', error)
        return redirect(`/login?error=${encodeURIComponent('Failed to send magic link. Please try again.')}`)
    }

    // Redirect to login page with success message
    return redirect(`/login?success=${encodeURIComponent('Check your email for the login link')}`)
}

// Server action for logout
export async function logout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
}
