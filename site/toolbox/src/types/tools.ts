// Tool types for the SolidFrame platform

// Tool categories
export type ToolCategory = 'voice' | 'messaging' | 'scheduling' | 'marketing' | 'automation'

// Tool version statuses (deployment pipeline: draft → staging → production → deprecated)
export type ToolVersionStatus = 'draft' | 'staging' | 'production' | 'deprecated'

// Tool definition from the database (tools table)
export interface DbTool {
    id: string
    slug: string
    name: string
    description: string | null
    icon: string | null
    category: ToolCategory
    is_real: boolean
    created_at: string
}

// Tool version from the database (tool_versions table)
export interface DbToolVersion {
    id: string
    tool_id: string
    version: string
    config_schema: Record<string, unknown> | null
    status: ToolVersionStatus
    rollout_pct: number
    changelog: string | null
    created_at: string
}

// Tenant tool activation (tenant_tools table)
export interface DbTenantTool {
    id: string
    tenant_id: string
    tool_id: string
    is_active: boolean
    version_id: string | null  // Pinned version (null = use latest production)
    activated_at: string | null
    deactivated_at: string | null
    created_at: string
    updated_at: string
}

// Tenant tool configuration (tenant_tool_configs table)
export interface DbTenantToolConfig {
    id: string
    tenant_id: string
    tool_id: string
    config: Record<string, unknown>
    created_at: string
    updated_at: string
}

// Tool with its active version (for API responses)
export interface ToolWithVersion extends DbTool {
    active_version: DbToolVersion | null
    staging_version: DbToolVersion | null
}

// Tool version with tool info (for API responses)
export interface ToolVersionWithTool extends DbToolVersion {
    tool: DbTool
}

// Request/Response types for API routes

// Create tool request
export interface CreateToolRequest {
    slug: string
    name: string
    description?: string
    icon?: string
    category: ToolCategory
    is_real?: boolean
}

// Update tool request
export interface UpdateToolRequest {
    name?: string
    description?: string
    icon?: string
    category?: ToolCategory
    is_real?: boolean
}

// Create version request
export interface CreateVersionRequest {
    tool_id: string
    version: string
    config_schema?: Record<string, unknown>
    changelog?: string
}

// Update version request
export interface UpdateVersionRequest {
    config_schema?: Record<string, unknown>
    changelog?: string
    rollout_pct?: number
}

// Deploy version request
export interface DeployVersionRequest {
    target: 'staging' | 'production'
    rollout_pct?: number  // Only for production deploys
}

// Rollback request (rollback to previous production version)
export interface RollbackRequest {
    reason?: string
}

// Tool configuration for a tenant (resolved from version + tenant config)
export interface ResolvedToolConfig {
    tool: DbTool
    version: DbToolVersion
    config: Record<string, unknown>
    is_pinned: boolean  // Whether tenant is on a pinned version
}

// API response wrapper
export interface ApiResponse<T = unknown> {
    success: boolean
    data?: T
    error?: string
    message?: string
}

// List response with pagination
export interface ListResponse<T> {
    items: T[]
    total: number
    offset: number
    limit: number
}
