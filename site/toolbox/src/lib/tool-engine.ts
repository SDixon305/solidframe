// Tool versioning engine for SolidFrame
// Pure TypeScript functions for managing tool versions and deployments

import type {
    DbTool,
    DbToolVersion,
    DbTenantTool,
    DbTenantToolConfig,
    ToolVersionStatus,
    ResolvedToolConfig,
} from '@/types/tools'

/**
 * Deployment pipeline validation
 * Versions must follow: draft → staging → production
 * Cannot skip stages
 */
export function canTransitionTo(
    currentStatus: ToolVersionStatus,
    targetStatus: ToolVersionStatus
): { allowed: boolean; reason?: string } {
    const transitions: Record<ToolVersionStatus, ToolVersionStatus[]> = {
        draft: ['staging'],
        staging: ['production', 'draft'],  // Can go back to draft or forward to production
        production: ['deprecated'],
        deprecated: [],  // Terminal state
    }

    const allowedTransitions = transitions[currentStatus]
    if (allowedTransitions.includes(targetStatus)) {
        return { allowed: true }
    }

    return {
        allowed: false,
        reason: `Cannot transition from '${currentStatus}' to '${targetStatus}'. Allowed: ${allowedTransitions.join(', ') || 'none'}`,
    }
}

/**
 * Check if a version can be deployed to production
 * Must be in staging first
 */
export function canDeployToProduction(version: DbToolVersion): { allowed: boolean; reason?: string } {
    if (version.status !== 'staging') {
        return {
            allowed: false,
            reason: 'Version must be in staging before deploying to production',
        }
    }
    return { allowed: true }
}

/**
 * Check if a version can be deployed to staging
 * Must be in draft
 */
export function canDeployToStaging(version: DbToolVersion): { allowed: boolean; reason?: string } {
    if (version.status !== 'draft') {
        return {
            allowed: false,
            reason: 'Only draft versions can be deployed to staging',
        }
    }
    return { allowed: true }
}

/**
 * Determine if a tenant should receive a new version based on canary rollout
 * Uses deterministic hashing so the same tenant always gets consistent results
 */
export function isInRollout(tenantId: string, rolloutPct: number): boolean {
    if (rolloutPct >= 100) return true
    if (rolloutPct <= 0) return false

    // Use a simple hash of the tenant ID for deterministic rollout
    const hash = hashString(tenantId)
    const bucket = hash % 100  // 0-99

    return bucket < rolloutPct
}

/**
 * Simple string hash function for deterministic rollout
 */
function hashString(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
        hash = hash & hash  // Convert to 32bit integer
    }
    return Math.abs(hash)
}

/**
 * Resolve which version a tenant should use for a tool
 * Priority:
 * 1. Tenant-pinned version (if set and active)
 * 2. Production version with rollout check
 * 3. Previous production version (now deprecated) as fallback
 */
export function resolveVersionForTenant(
    tenantId: string,
    tenantTool: DbTenantTool | null,
    versions: DbToolVersion[]
): DbToolVersion | null {
    if (versions.length === 0) return null

    // Sort versions by created_at descending to get most recent first
    const sortedVersions = [...versions].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )

    // 1. Check for pinned version
    if (tenantTool?.version_id) {
        const pinnedVersion = versions.find(v => v.id === tenantTool.version_id)
        if (pinnedVersion && pinnedVersion.status !== 'deprecated') {
            return pinnedVersion
        }
        // Pinned version is deprecated or missing, fall through to production logic
    }

    // 2. Find production version with rollout check
    const productionVersion = sortedVersions.find(v => v.status === 'production')
    if (productionVersion) {
        // Check if tenant is in the rollout bucket
        if (isInRollout(tenantId, productionVersion.rollout_pct)) {
            return productionVersion
        }
    }

    // 3. Fall back to most recent deprecated version (previous production)
    // This handles the case where tenant is not in rollout
    const fallbackVersion = sortedVersions.find(v => v.status === 'deprecated')
    if (fallbackVersion) {
        return fallbackVersion
    }

    // 4. If no deprecated version, use production anyway (shouldn't happen normally)
    return productionVersion || null
}

/**
 * Get the full resolved configuration for a tenant's tool
 * Merges default config from version with tenant-specific overrides
 */
export function resolveToolConfig(
    tool: DbTool,
    version: DbToolVersion,
    tenantConfig: DbTenantToolConfig | null,
    isPinned: boolean
): ResolvedToolConfig {
    // Start with default config from version schema
    const defaultConfig = version.config_schema?.default as Record<string, unknown> || {}

    // Merge with tenant-specific config (tenant config overrides defaults)
    const mergedConfig = {
        ...defaultConfig,
        ...(tenantConfig?.config || {}),
    }

    return {
        tool,
        version,
        config: mergedConfig,
        is_pinned: isPinned,
    }
}

/**
 * Find the previous production version for rollback
 * Returns the most recently deprecated version that was production
 */
export function findPreviousProductionVersion(
    versions: DbToolVersion[],
    currentProductionId: string
): DbToolVersion | null {
    // Sort by created_at descending
    const sortedVersions = [...versions].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )

    // Find deprecated versions (these were previously production)
    const deprecatedVersions = sortedVersions.filter(
        v => v.status === 'deprecated' && v.id !== currentProductionId
    )

    return deprecatedVersions[0] || null
}

/**
 * Validate rollout percentage
 */
export function validateRolloutPct(pct: number): { valid: boolean; reason?: string } {
    if (!Number.isInteger(pct)) {
        return { valid: false, reason: 'Rollout percentage must be an integer' }
    }
    if (pct < 0 || pct > 100) {
        return { valid: false, reason: 'Rollout percentage must be between 0 and 100' }
    }
    return { valid: true }
}

/**
 * Validate semantic version format (simplified)
 * Accepts formats like: 1.0.0, 1.0, v1.0.0, 2024.01.15
 */
export function validateVersion(version: string): { valid: boolean; reason?: string } {
    // Allow various version formats
    const versionRegex = /^v?\d+(\.\d+)*(-[a-zA-Z0-9.-]+)?(\+[a-zA-Z0-9.-]+)?$/
    if (!versionRegex.test(version)) {
        return {
            valid: false,
            reason: 'Version must be in format like 1.0.0, v1.0.0, or 2024.01.15',
        }
    }
    return { valid: true }
}

/**
 * Compare semantic versions
 * Returns: -1 if a < b, 0 if a === b, 1 if a > b
 */
export function compareVersions(a: string, b: string): number {
    // Remove 'v' prefix if present
    const cleanA = a.replace(/^v/, '')
    const cleanB = b.replace(/^v/, '')

    // Split by dots and compare each segment
    const partsA = cleanA.split('.').map(p => parseInt(p, 10) || 0)
    const partsB = cleanB.split('.').map(p => parseInt(p, 10) || 0)

    const maxLength = Math.max(partsA.length, partsB.length)

    for (let i = 0; i < maxLength; i++) {
        const numA = partsA[i] || 0
        const numB = partsB[i] || 0

        if (numA < numB) return -1
        if (numA > numB) return 1
    }

    return 0
}

/**
 * Generate next version number suggestion
 * Increments the patch version
 */
export function suggestNextVersion(currentVersion: string): string {
    const clean = currentVersion.replace(/^v/, '')
    const parts = clean.split('.').map(p => parseInt(p, 10) || 0)

    // Pad to at least 3 parts (major.minor.patch)
    while (parts.length < 3) {
        parts.push(0)
    }

    // Increment patch version
    parts[parts.length - 1]++

    return parts.join('.')
}

/**
 * Check if a tool has any production version
 */
export function hasProductionVersion(versions: DbToolVersion[]): boolean {
    return versions.some(v => v.status === 'production')
}

/**
 * Get all versions by status
 */
export function getVersionsByStatus(
    versions: DbToolVersion[],
    status: ToolVersionStatus
): DbToolVersion[] {
    return versions.filter(v => v.status === status)
}

/**
 * Calculate rollout statistics for a version
 */
export function calculateRolloutStats(
    tenantIds: string[],
    rolloutPct: number
): { inRollout: string[]; notInRollout: string[] } {
    const inRollout: string[] = []
    const notInRollout: string[] = []

    for (const tenantId of tenantIds) {
        if (isInRollout(tenantId, rolloutPct)) {
            inRollout.push(tenantId)
        } else {
            notInRollout.push(tenantId)
        }
    }

    return { inRollout, notInRollout }
}
