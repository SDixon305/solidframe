// Auth types for the SolidFrame platform

export type UserRole = 'super_admin' | 'admin' | 'client_user'

// User record from the database (users table)
export interface DbUser {
    id: string
    tenant_id: string | null  // null for super_admin who may not be tied to a tenant
    email: string
    role: UserRole
    auth_id: string | null
    first_name: string | null
    last_name: string | null
    created_at: string
    updated_at: string
}

// Tenant record from the database
export interface DbTenant {
    id: string
    name: string
    slug: string
    logo_url: string | null
    status: 'active' | 'suspended' | 'pending'
    stripe_customer_id: string | null
    created_at: string
    updated_at: string
}

// Combined auth state used in the app
export interface AuthUser {
    id: string              // users.id
    authId: string          // auth.users.id (Supabase Auth)
    email: string
    role: UserRole
    firstName: string | null
    lastName: string | null
    tenantId: string | null
    tenant: DbTenant | null // Loaded tenant data
}

// Auth context state
export interface AuthState {
    user: AuthUser | null
    isLoading: boolean
    error: string | null
}

// Magic link request
export interface MagicLinkRequest {
    email: string
    redirectTo?: string
}

// Magic link response
export interface MagicLinkResponse {
    success: boolean
    message: string
    error?: string
}

// Route protection configuration
export interface RouteConfig {
    public: boolean
    requiredRole?: UserRole
    requireTenantMatch?: boolean
}

// Protected routes configuration
export const ROUTE_CONFIG: Record<string, RouteConfig> = {
    '/admin': { public: false, requiredRole: 'super_admin' },
    '/login': { public: true },
    '/api/auth': { public: true },
    '/api/webhooks': { public: true },
    '/client-demo': { public: true },
    '/tools': { public: true },  // ROI projector etc are public
}

// Check if a user can access a route
export function canAccessRoute(
    user: AuthUser | null,
    pathname: string
): { allowed: boolean; reason?: string } {
    // Check each route config
    for (const [route, config] of Object.entries(ROUTE_CONFIG)) {
        if (pathname.startsWith(route)) {
            if (config.public) {
                return { allowed: true }
            }

            if (!user) {
                return { allowed: false, reason: 'Authentication required' }
            }

            if (config.requiredRole) {
                // super_admin can access everything
                if (user.role === 'super_admin') {
                    return { allowed: true }
                }

                // Check specific role requirement
                if (user.role !== config.requiredRole) {
                    return { allowed: false, reason: `Role '${config.requiredRole}' required` }
                }
            }

            return { allowed: true }
        }
    }

    // Default: require authentication
    if (!user) {
        return { allowed: false, reason: 'Authentication required' }
    }

    // Check tenant-specific routes (e.g., /acme-hvac/*)
    // These require the user to belong to that tenant
    const tenantSlugMatch = pathname.match(/^\/([a-z0-9-]+)\//)
    if (tenantSlugMatch && user.tenant) {
        const routeTenantSlug = tenantSlugMatch[1]
        // super_admin can access any tenant
        if (user.role === 'super_admin') {
            return { allowed: true }
        }
        // Regular users can only access their own tenant
        if (user.tenant.slug !== routeTenantSlug) {
            return { allowed: false, reason: 'Access denied to this tenant' }
        }
    }

    return { allowed: true }
}
