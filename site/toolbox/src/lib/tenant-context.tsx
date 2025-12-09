'use client'

import { createContext, useContext, ReactNode, useMemo } from 'react'
import { DbTenant } from '@/types/auth'
import { ClientTool, generateClientTools, ToolSlug, CLIENT_TOOLS } from './fake-data'

// Tenant with tools context
export interface TenantContextValue {
    // Tenant info
    tenant: DbTenant
    // Tools available to this tenant
    tools: ClientTool[]
    // Helper to get a specific tool
    getTool: (slug: ToolSlug) => ClientTool | undefined
    // Onboarding status
    onboardingComplete: boolean
    onboardingStep: number
}

const TenantContext = createContext<TenantContextValue | null>(null)

export function useTenantContext(): TenantContextValue {
    const context = useContext(TenantContext)
    if (!context) {
        throw new Error('useTenantContext must be used within a TenantProvider')
    }
    return context
}

// Safe hook that returns null if not in context
export function useTenantContextSafe(): TenantContextValue | null {
    return useContext(TenantContext)
}

interface TenantProviderProps {
    children: ReactNode
    tenant: DbTenant
    // Optional: active tool slugs (defaults to all)
    activeTools?: ToolSlug[]
    // Optional: onboarding progress
    onboardingProgress?: {
        completed: boolean
        currentStep: number
    }
}

export function TenantProvider({
    children,
    tenant,
    activeTools,
    onboardingProgress,
}: TenantProviderProps) {
    // Generate tools with metrics based on tenant creation date
    const tools = useMemo(() => {
        const createdAt = new Date(tenant.created_at)
        const activeSlugs = activeTools || CLIENT_TOOLS.map(t => t.slug)
        return generateClientTools(createdAt, tenant.id, activeSlugs)
    }, [tenant.id, tenant.created_at, activeTools])

    const value = useMemo<TenantContextValue>(() => ({
        tenant,
        tools,
        getTool: (slug: ToolSlug) => tools.find(t => t.slug === slug),
        onboardingComplete: onboardingProgress?.completed ?? false,
        onboardingStep: onboardingProgress?.currentStep ?? 0,
    }), [tenant, tools, onboardingProgress])

    return (
        <TenantContext.Provider value={value}>
            {children}
        </TenantContext.Provider>
    )
}

// Mock tenant data for development/demo
export function createMockTenant(slug: string, name: string): DbTenant {
    const now = new Date()
    // Set created_at to 45 days ago for realistic metrics
    const createdAt = new Date(now)
    createdAt.setDate(createdAt.getDate() - 45)

    return {
        id: `tenant-${slug}`,
        name,
        slug,
        logo_url: null,
        status: 'active',
        stripe_customer_id: null,
        created_at: createdAt.toISOString(),
        updated_at: now.toISOString(),
    }
}

// Known demo tenants
export const DEMO_TENANTS: Record<string, DbTenant> = {
    'acme-hvac': createMockTenant('acme-hvac', 'Acme HVAC Services'),
    'trinity-cooling': createMockTenant('trinity-cooling', 'Trinity Cooling Co.'),
    'demo': createMockTenant('demo', 'Demo Company'),
}
