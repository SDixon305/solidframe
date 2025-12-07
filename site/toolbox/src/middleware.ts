import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
    // 1. Update session (Auth)
    let response = await updateSession(request)

    // 2. Subdomain Logic
    const url = request.nextUrl
    const hostname = request.headers.get('host') || ''
    const searchParams = request.nextUrl.searchParams.toString()
    const path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ''}`

    // Skip public files and API routes
    if (path.includes('.') || path.startsWith('/_next') || path.startsWith('/api') || path.startsWith('/status')) {
        return response
    }

    // Determine the "Pillar" based on hostname
    // Prod: 
    //   toolbox.solidframe.ai -> Admin
    //   client-toolbox.solidframe.ai -> Demo
    //   *.toolbox.solidframe.ai -> Portal
    // Local:
    //   localhost:3000 -> Admin (Default)

    // Logic:
    // If it's the Admin dashboard (toolbox.solidframe.ai or localhost)
    if (hostname === 'toolbox.solidframe.ai' || hostname.includes('localhost')) {
        if (path === '/') {
            return NextResponse.rewrite(new URL('/admin', request.url))
        }
    }
    // If it's the Demo site (client-toolbox.solidframe.ai)
    else if (hostname === 'client-toolbox.solidframe.ai') {
        if (path === '/') {
            return NextResponse.rewrite(new URL('/afterhours-agent', request.url))
        }
    }
    // Otherwise, it's a Client Portal (e.g. trinity.toolbox.solidframe.ai)
    else {
        if (path === '/') {
            return NextResponse.rewrite(new URL('/portal', request.url))
        }
    }

    return response
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
