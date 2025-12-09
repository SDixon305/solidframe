'use client'

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import type { AuthUser, AuthState, DbUser, DbTenant, UserRole } from '@/types/auth'
import type { User } from '@supabase/supabase-js'

interface AuthContextValue extends AuthState {
    login: (email: string, redirectTo?: string) => Promise<{ success: boolean; error?: string }>
    logout: () => Promise<void>
    refresh: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

// Safe version that returns null if not in provider
export function useAuthSafe() {
    return useContext(AuthContext)
}

interface AuthProviderProps {
    children: ReactNode
    initialUser?: AuthUser | null
}

export function AuthProvider({ children, initialUser = null }: AuthProviderProps) {
    const [state, setState] = useState<AuthState>({
        user: initialUser,
        isLoading: !initialUser, // If we have initial user, no need to load
        error: null,
    })

    const supabase = createClient()

    // Fetch user data from database
    const fetchUserData = useCallback(async (authUser: User): Promise<AuthUser | null> => {
        try {
            // Get the user's database record
            const { data: dbUser, error: dbError } = await supabase
                .from('users')
                .select('*')
                .eq('auth_id', authUser.id)
                .single()

            if (dbError || !dbUser) {
                // User is authenticated but doesn't have a database record
                return {
                    id: '',
                    authId: authUser.id,
                    email: authUser.email || '',
                    role: 'client_user' as UserRole,
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
        } catch (error) {
            console.error('Error fetching user data:', error)
            return null
        }
    }, [supabase])

    // Refresh user data
    const refresh = useCallback(async () => {
        setState(prev => ({ ...prev, isLoading: true, error: null }))

        try {
            const { data: { user: authUser } } = await supabase.auth.getUser()

            if (!authUser) {
                setState({ user: null, isLoading: false, error: null })
                return
            }

            const userData = await fetchUserData(authUser)
            setState({ user: userData, isLoading: false, error: null })
        } catch (error) {
            console.error('Error refreshing auth:', error)
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: 'Failed to refresh authentication',
            }))
        }
    }, [supabase, fetchUserData])

    // Login with magic link
    const login = async (email: string, redirectTo?: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, redirectTo }),
            })

            const data = await response.json()
            return { success: data.success, error: data.error }
        } catch (error) {
            console.error('Login error:', error)
            return { success: false, error: 'Failed to send magic link' }
        }
    }

    // Logout
    const logout = async () => {
        try {
            await supabase.auth.signOut()
            setState({ user: null, isLoading: false, error: null })
            // Redirect to login page
            window.location.href = '/login'
        } catch (error) {
            console.error('Logout error:', error)
        }
    }

    // Initialize auth state and listen for changes
    useEffect(() => {
        // Get initial session
        const initAuth = async () => {
            const { data: { user: authUser } } = await supabase.auth.getUser()

            if (authUser) {
                const userData = await fetchUserData(authUser)
                setState({ user: userData, isLoading: false, error: null })
            } else {
                setState({ user: null, isLoading: false, error: null })
            }
        }

        // Only init if we don't have an initial user
        if (!initialUser) {
            initAuth()
        }

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (event === 'SIGNED_IN' && session?.user) {
                    const userData = await fetchUserData(session.user)
                    setState({ user: userData, isLoading: false, error: null })
                } else if (event === 'SIGNED_OUT') {
                    setState({ user: null, isLoading: false, error: null })
                } else if (event === 'TOKEN_REFRESHED' && session?.user) {
                    // Optionally refresh user data on token refresh
                    const userData = await fetchUserData(session.user)
                    setState({ user: userData, isLoading: false, error: null })
                }
            }
        )

        return () => {
            subscription.unsubscribe()
        }
    }, [supabase, initialUser, fetchUserData])

    const value: AuthContextValue = {
        ...state,
        login,
        logout,
        refresh,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

// Utility hook to require authentication
export function useRequireAuth(requiredRole?: UserRole) {
    const auth = useAuth()

    useEffect(() => {
        if (!auth.isLoading && !auth.user) {
            // Store current path for redirect after login
            const currentPath = window.location.pathname
            window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`
        }

        if (!auth.isLoading && auth.user && requiredRole) {
            // Check role
            if (auth.user.role !== 'super_admin' && auth.user.role !== requiredRole) {
                window.location.href = `/login?error=${encodeURIComponent('Access denied')}`
            }
        }
    }, [auth.isLoading, auth.user, requiredRole])

    return auth
}
