import { createClient } from '@/utils/supabase/server'
import type { AuthUser, DbUser, DbTenant, UserRole } from '@/types/auth'

// Get the current authenticated user with their database record and tenant
export async function getAuthUser(): Promise<AuthUser | null> {
    const supabase = await createClient()

    // Get the Supabase Auth user
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()

    if (authError || !authUser) {
        return null
    }

    // Get the user's database record
    const { data: dbUser, error: dbError } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', authUser.id)
        .single()

    if (dbError || !dbUser) {
        // User is authenticated but doesn't have a database record yet
        // This happens on first login - return minimal auth info
        return {
            id: '', // Will be set after user record is created
            authId: authUser.id,
            email: authUser.email || '',
            role: 'client_user' as UserRole, // Default role for new users
            firstName: null,
            lastName: null,
            tenantId: null,
            tenant: null,
        }
    }

    const user = dbUser as DbUser

    // Get the tenant if the user has one
    let tenant: DbTenant | null = null
    if (user.tenant_id) {
        const { data: tenantData } = await supabase
            .from('tenants')
            .select('*')
            .eq('id', user.tenant_id)
            .single()

        tenant = tenantData as DbTenant | null
    }

    return {
        id: user.id,
        authId: authUser.id,
        email: user.email,
        role: user.role as UserRole,
        firstName: user.first_name,
        lastName: user.last_name,
        tenantId: user.tenant_id,
        tenant,
    }
}

// Create or update the user record on login
export async function syncUserRecord(
    authId: string,
    email: string,
    options?: {
        tenantId?: string
        role?: UserRole
        firstName?: string
        lastName?: string
    }
): Promise<{ user: DbUser | null; created: boolean; error: string | null }> {
    const supabase = await createClient()

    // Check if user record already exists
    const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', authId)
        .single()

    if (existingUser) {
        // Update the existing user record if needed
        const { data: updated, error: updateError } = await supabase
            .from('users')
            .update({ updated_at: new Date().toISOString() })
            .eq('id', existingUser.id)
            .select()
            .single()

        return {
            user: (updated || existingUser) as DbUser,
            created: false,
            error: updateError?.message || null,
        }
    }

    // For new users, check if they're in the allowed list or create with defaults
    // Super admins are created manually in the database
    // Client users should be pre-created by an admin with their tenant assignment

    // Check if there's a pre-created user record with this email (without auth_id)
    const { data: preCreatedUser } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .is('auth_id', null)
        .single()

    if (preCreatedUser) {
        // Link the pre-created user to this auth account
        const { data: linkedUser, error: linkError } = await supabase
            .from('users')
            .update({ auth_id: authId, updated_at: new Date().toISOString() })
            .eq('id', preCreatedUser.id)
            .select()
            .single()

        return {
            user: linkedUser as DbUser,
            created: false,
            error: linkError?.message || null,
        }
    }

    // No pre-created user - this is either:
    // 1. A super_admin being set up (should be done manually in DB)
    // 2. An unauthorized login attempt
    // For now, don't auto-create users to prevent unauthorized access
    return {
        user: null,
        created: false,
        error: 'No user record found. Please contact an administrator.',
    }
}

// Check if the current user has a specific role
export async function hasRole(requiredRole: UserRole): Promise<boolean> {
    const user = await getAuthUser()
    if (!user) return false

    // super_admin has access to everything
    if (user.role === 'super_admin') return true

    return user.role === requiredRole
}

// Check if the current user belongs to a specific tenant
export async function belongsToTenant(tenantId: string): Promise<boolean> {
    const user = await getAuthUser()
    if (!user) return false

    // super_admin can access any tenant
    if (user.role === 'super_admin') return true

    return user.tenantId === tenantId
}

// Get tenant by slug
export async function getTenantBySlug(slug: string): Promise<DbTenant | null> {
    const supabase = await createClient()

    const { data } = await supabase
        .from('tenants')
        .select('*')
        .eq('slug', slug)
        .single()

    return data as DbTenant | null
}

// Require authentication - throws if not authenticated
export async function requireAuth(): Promise<AuthUser> {
    const user = await getAuthUser()
    if (!user || !user.id) {
        throw new Error('Authentication required')
    }
    return user
}

// Require specific role - throws if not authorized
export async function requireRole(role: UserRole): Promise<AuthUser> {
    const user = await requireAuth()

    if (user.role !== 'super_admin' && user.role !== role) {
        throw new Error(`Role '${role}' required`)
    }

    return user
}
