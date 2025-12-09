// Admin API for managing tool versions
// Requires super_admin role

import { createClient } from '@/utils/supabase/server'
import { requireRole } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'
import { validateVersion, suggestNextVersion } from '@/lib/tool-engine'
import type {
    ApiResponse,
    DbToolVersion,
    ToolVersionWithTool,
    CreateVersionRequest,
    ListResponse,
} from '@/types/tools'

// GET /api/admin/versions - List versions with optional filters
export async function GET(request: Request) {
    try {
        // Require super_admin role
        await requireRole('super_admin')

        const supabase = await createClient()
        const { searchParams } = new URL(request.url)

        // Parse query params
        const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100)
        const offset = parseInt(searchParams.get('offset') || '0')
        const toolId = searchParams.get('tool_id')
        const status = searchParams.get('status')

        // Build query
        let query = supabase
            .from('tool_versions')
            .select('*, tools(*)', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1)

        // Apply filters
        if (toolId) {
            query = query.eq('tool_id', toolId)
        }
        if (status) {
            query = query.eq('status', status)
        }

        const { data: versions, error, count } = await query

        if (error) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: error.message },
                { status: 500 }
            )
        }

        // Transform to include tool data
        const versionsWithTool: ToolVersionWithTool[] = (versions || []).map(v => ({
            id: v.id,
            tool_id: v.tool_id,
            version: v.version,
            config_schema: v.config_schema,
            status: v.status,
            rollout_pct: v.rollout_pct,
            changelog: v.changelog,
            created_at: v.created_at,
            tool: v.tools,
        }))

        return NextResponse.json<ApiResponse<ListResponse<ToolVersionWithTool>>>({
            success: true,
            data: {
                items: versionsWithTool,
                total: count || 0,
                offset,
                limit,
            },
        })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error'
        const status = message.includes('required') ? 403 : 500
        return NextResponse.json<ApiResponse>(
            { success: false, error: message },
            { status }
        )
    }
}

// POST /api/admin/versions - Create a new version
export async function POST(request: Request) {
    try {
        // Require super_admin role
        await requireRole('super_admin')

        const body: CreateVersionRequest = await request.json()

        // Validate required fields
        if (!body.tool_id || !body.version) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'tool_id and version are required' },
                { status: 400 }
            )
        }

        // Validate version format
        const versionCheck = validateVersion(body.version)
        if (!versionCheck.valid) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: versionCheck.reason },
                { status: 400 }
            )
        }

        const supabase = await createClient()

        // Verify tool exists
        const { data: tool } = await supabase
            .from('tools')
            .select('id')
            .eq('id', body.tool_id)
            .single()

        if (!tool) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Tool not found' },
                { status: 404 }
            )
        }

        // Check for duplicate version
        const { data: existing } = await supabase
            .from('tool_versions')
            .select('id')
            .eq('tool_id', body.tool_id)
            .eq('version', body.version)
            .single()

        if (existing) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'This version already exists for this tool' },
                { status: 409 }
            )
        }

        // Get the latest version to inherit config schema
        const { data: latestVersion } = await supabase
            .from('tool_versions')
            .select('config_schema')
            .eq('tool_id', body.tool_id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single()

        // Create the version (always starts as draft)
        const { data: version, error } = await supabase
            .from('tool_versions')
            .insert({
                tool_id: body.tool_id,
                version: body.version,
                config_schema: body.config_schema || latestVersion?.config_schema || null,
                status: 'draft',
                rollout_pct: 100,  // Default to full rollout
                changelog: body.changelog || null,
            })
            .select()
            .single()

        if (error) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: error.message },
                { status: 500 }
            )
        }

        return NextResponse.json<ApiResponse<DbToolVersion>>(
            { success: true, data: version, message: 'Version created successfully' },
            { status: 201 }
        )
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error'
        const status = message.includes('required') ? 403 : 500
        return NextResponse.json<ApiResponse>(
            { success: false, error: message },
            { status }
        )
    }
}

// PATCH /api/admin/versions - Update a version (requires id in body)
export async function PATCH(request: Request) {
    try {
        // Require super_admin role
        await requireRole('super_admin')

        const body = await request.json()
        const { id, ...updates } = body

        if (!id) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Version id is required' },
                { status: 400 }
            )
        }

        const supabase = await createClient()

        // Get current version
        const { data: currentVersion } = await supabase
            .from('tool_versions')
            .select('*')
            .eq('id', id)
            .single()

        if (!currentVersion) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Version not found' },
                { status: 404 }
            )
        }

        // Only allow updates to draft versions (except rollout_pct for production)
        if (currentVersion.status !== 'draft') {
            // Only allow rollout_pct updates for production
            const allowedFields = currentVersion.status === 'production' ? ['rollout_pct'] : []
            const updateKeys = Object.keys(updates).filter(k => !['id'].includes(k))

            const disallowedFields = updateKeys.filter(k => !allowedFields.includes(k))
            if (disallowedFields.length > 0) {
                return NextResponse.json<ApiResponse>(
                    {
                        success: false,
                        error: `Cannot update ${disallowedFields.join(', ')} for ${currentVersion.status} version`,
                    },
                    { status: 400 }
                )
            }
        }

        // Validate rollout_pct if provided
        if (updates.rollout_pct !== undefined) {
            if (updates.rollout_pct < 0 || updates.rollout_pct > 100) {
                return NextResponse.json<ApiResponse>(
                    { success: false, error: 'rollout_pct must be between 0 and 100' },
                    { status: 400 }
                )
            }
        }

        // Remove fields that shouldn't be updated
        delete updates.tool_id
        delete updates.version
        delete updates.status  // Status changes via deploy/rollback
        delete updates.created_at

        const { data: version, error } = await supabase
            .from('tool_versions')
            .update(updates)
            .eq('id', id)
            .select()
            .single()

        if (error) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: error.message },
                { status: 500 }
            )
        }

        return NextResponse.json<ApiResponse<DbToolVersion>>({
            success: true,
            data: version,
            message: 'Version updated successfully',
        })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error'
        const status = message.includes('required') ? 403 : 500
        return NextResponse.json<ApiResponse>(
            { success: false, error: message },
            { status }
        )
    }
}

// DELETE /api/admin/versions - Delete a version (requires id in query)
export async function DELETE(request: Request) {
    try {
        // Require super_admin role
        await requireRole('super_admin')

        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Version id is required' },
                { status: 400 }
            )
        }

        const supabase = await createClient()

        // Get version
        const { data: version } = await supabase
            .from('tool_versions')
            .select('*')
            .eq('id', id)
            .single()

        if (!version) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Version not found' },
                { status: 404 }
            )
        }

        // Cannot delete production or staging versions
        if (['production', 'staging'].includes(version.status)) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: `Cannot delete ${version.status} version` },
                { status: 400 }
            )
        }

        // Check if any tenants are pinned to this version
        const { count: pinnedCount } = await supabase
            .from('tenant_tools')
            .select('*', { count: 'exact', head: true })
            .eq('version_id', id)

        if (pinnedCount && pinnedCount > 0) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: `Cannot delete: ${pinnedCount} tenant(s) are pinned to this version` },
                { status: 409 }
            )
        }

        const { error } = await supabase
            .from('tool_versions')
            .delete()
            .eq('id', id)

        if (error) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: error.message },
                { status: 500 }
            )
        }

        return NextResponse.json<ApiResponse>({
            success: true,
            message: 'Version deleted successfully',
        })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error'
        const status = message.includes('required') ? 403 : 500
        return NextResponse.json<ApiResponse>(
            { success: false, error: message },
            { status }
        )
    }
}
