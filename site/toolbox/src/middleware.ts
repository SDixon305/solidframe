import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'
import { createServerClient } from '@supabase/ssr'

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
    '/login',
    '/api/auth',
    '/api/webhooks',
    '/client-demo',
    '/tools',
    '/status',
]

// Routes that require super_admin role
const ADMIN_ROUTES = ['/admin']

export async function middleware(request: NextRequest) {
    // 1. Update session (Auth)
    let response = await updateSession(request)

    // 2. Path and hostname extraction
    const url = request.nextUrl
    const hostname = request.headers.get('host') || ''
    const searchParams = request.nextUrl.searchParams.toString()
    const path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ''}`
    const pathname = url.pathname

    // Skip public files
    if (path.includes('.') || path.startsWith('/_next')) {
        return response
    }

    // 3. Check if this is a public route
    const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route))

    // 4. Auth protection for non-public routes
    if (!isPublicRoute) {
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll()
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) => {
                            response.cookies.set(name, value, options)
                        })
                    },
                },
            }
        )

        const { data: { user } } = await supabase.auth.getUser()

        // Check admin routes - require super_admin role
        const isAdminRoute = ADMIN_ROUTES.some(route => pathname.startsWith(route))
        if (isAdminRoute) {
            if (!user) {
                const loginUrl = new URL('/login', request.url)
                loginUrl.searchParams.set('redirect', pathname)
                return NextResponse.redirect(loginUrl)
            }

            // Get the user's database record to check role
            const { data: dbUser } = await supabase
                .from('users')
                .select('role')
                .eq('auth_id', user.id)
                .single()

            if (!dbUser || dbUser.role !== 'super_admin') {
                // Not authorized - redirect to login with error
                const loginUrl = new URL('/login', request.url)
                loginUrl.searchParams.set('error', 'Access denied. Super admin role required.')
                return NextResponse.redirect(loginUrl)
            }
        }
    }

    // 5. Subdomain Logic (after auth checks)
    // Prod:
    //   toolbox.solidframe.ai -> Admin
    //   client-toolbox.solidframe.ai -> Demo
    //   *.toolbox.solidframe.ai -> Portal
    // Local:
    //   localhost:3000 -> Admin (Default)

    // If it's the Admin dashboard (toolbox.solidframe.ai or localhost)
    if (hostname === 'toolbox.solidframe.ai' || hostname.includes('localhost')) {
        if (pathname === '/') {
            return NextResponse.rewrite(new URL('/admin', request.url))
        }
    }
    // If it's the Demo site (client-toolbox.solidframe.ai)
    else if (hostname === 'client-toolbox.solidframe.ai') {
        if (pathname === '/') {
            return NextResponse.rewrite(new URL('/afterhours-agent', request.url))
        }
    }
    // Otherwise, it's a Client Portal (e.g. trinity.toolbox.solidframe.ai)
    else {
        if (pathname === '/') {
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
