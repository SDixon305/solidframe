import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import type { MagicLinkResponse } from '@/types/auth'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { email, password, redirectTo } = body

        if (!email) {
            return NextResponse.json<MagicLinkResponse>(
                { success: false, message: 'Email is required', error: 'Email is required' },
                { status: 400 }
            )
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json<MagicLinkResponse>(
                { success: false, message: 'Invalid email format', error: 'Invalid email format' },
                { status: 400 }
            )
        }

        const supabase = await createClient()

        // Check if password is provided for password authentication
        if (password) {
            // Password login
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) {
                console.error('Password login error:', error)
                return NextResponse.json<MagicLinkResponse>(
                    { success: false, message: 'Invalid email or password', error: error.message },
                    { status: 401 }
                )
            }

            return NextResponse.json<MagicLinkResponse>({
                success: true,
                message: 'Signed in successfully',
            })
        } else {
            // Magic link login
            // Build the callback URL
            const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
            const callbackUrl = new URL('/api/auth/callback', origin)

            // Add redirect parameter if provided
            if (redirectTo) {
                callbackUrl.searchParams.set('redirect', redirectTo)
            }

            // Send magic link via Supabase Auth
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: callbackUrl.toString(),
                },
            })

            if (error) {
                console.error('Magic link error:', error)
                return NextResponse.json<MagicLinkResponse>(
                    { success: false, message: 'Failed to send magic link', error: error.message },
                    { status: 500 }
                )
            }

            return NextResponse.json<MagicLinkResponse>({
                success: true,
                message: 'Check your email for the login link',
            })
        }
    } catch (error) {
        console.error('Login route error:', error)
        return NextResponse.json<MagicLinkResponse>(
            { success: false, message: 'An unexpected error occurred', error: 'Internal server error' },
            { status: 500 }
        )
    }
}
