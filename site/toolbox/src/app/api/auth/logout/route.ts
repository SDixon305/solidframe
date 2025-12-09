import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    const supabase = await createClient()
    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    // Sign out the user
    const { error } = await supabase.auth.signOut()

    if (error) {
        console.error('Logout error:', error)
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        )
    }

    // Redirect to login page
    return NextResponse.redirect(new URL('/login', origin), { status: 303 })
}

export async function GET(request: Request) {
    // Also support GET for simple logout links
    return POST(request)
}
