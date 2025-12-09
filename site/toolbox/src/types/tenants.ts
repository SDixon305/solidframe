// Tenant/Client types for the admin portal

import type { DbTenant } from './auth'
import type { DbTool, DbTenantTool, DbTenantToolConfig } from './tools'

// Extended tenant status
export type TenantStatus = 'active' | 'suspended' | 'pending' | 'cancelled'

// Business types
export type BusinessType = 'hvac' | 'plumbing' | 'electrical' | 'roofing' | 'general' | 'other'

// Extended tenant for admin views
export interface TenantWithStats extends DbTenant {
    tool_count?: number
    active_tool_count?: number
    user_count?: number
    last_activity?: string | null
    business_type?: BusinessType
    owner_name?: string | null
    owner_email?: string | null
    business_address?: string | null
}

// Tenant with tools for detail view
export interface TenantWithTools extends TenantWithStats {
    tools: TenantToolWithInfo[]
}

// Tool info combined with tenant activation
export interface TenantToolWithInfo extends DbTenantTool {
    tool: DbTool
    config?: DbTenantToolConfig | null
}

// Create tenant request
export interface CreateTenantRequest {
    name: string
    slug?: string // Auto-generated if not provided
    owner_name?: string
    owner_email: string // Required for magic link login
    business_type?: BusinessType
    business_address?: string
    logo_url?: string
}

// Update tenant request
export interface UpdateTenantRequest {
    name?: string
    slug?: string
    status?: TenantStatus
    logo_url?: string | null
    owner_name?: string
    owner_email?: string
    business_type?: BusinessType
    business_address?: string
}

// Tool activation request
export interface ToolActivationRequest {
    tool_id: string
    is_active: boolean
    version_id?: string // Optional: pin to specific version
}

// Tenant list filters
export interface TenantFilters {
    search?: string
    status?: TenantStatus | 'all'
    business_type?: BusinessType | 'all'
    sort_by?: 'name' | 'created_at' | 'last_activity'
    sort_order?: 'asc' | 'desc'
}

// Tenant usage stats for the usage tab
export interface TenantUsageStats {
    period: string
    calls_handled: number
    sms_sent: number
    appointments_scheduled: number
    leads_captured: number
    reviews_requested: number
}

// Tool config for the config tab
export interface ToolConfigEntry {
    tool_id: string
    tool_name: string
    tool_slug: string
    config: Record<string, unknown>
    updated_at: string
}
