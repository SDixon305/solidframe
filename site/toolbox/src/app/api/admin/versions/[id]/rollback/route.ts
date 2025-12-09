// Admin API for rolling back tool versions
// Requires super_admin role

import { createClient } from '@/utils/supabase/server'
import { requireRole, getAuthUser } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'
import { findPreviousProductionVersion } from '@/lib/tool-engine'
import type { ApiResponse, DbToolVersion, RollbackRequest } from '@/types/tools'

interface RouteParams {
    params: Promise<{ id: string }>
}

// POST /api/admin/versions/[id]/rollback - Rollback to previous production version
export async function POST(request: Request, { params }: RouteParams) {
    try {
        // Require super_admin role
        await requireRole('super_admin')

        const { id } = await params
        const body: RollbackRequest = await request.json().catch(() => ({}))

        const supabase = await createClient()

        // Get the current production version
        const { data: currentVersion, error: fetchError } = await supabase
            .from('tool_versions')
            .select('*')
            .eq('id', id)
            .single()

        if (fetchError || !currentVersion) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Version not found' },
                { status: 404 }
            )
        }

        // Can only rollback production versions
        if (currentVersion.status !== 'production') {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Can only rollback production versions' },
                { status: 400 }
            )
        }

        // Get all versions for this tool to find previous production
        const { data: allVersions, error: listError } = await supabase
            .from('tool_versions')
            .select('*')
            .eq('tool_id', currentVersion.tool_id)
            .order('created_at', { ascending: false })

        if (listError || !allVersions) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Failed to fetch versions' },
                { status: 500 }
            )
        }

        // Find the previous production version
        const previousVersion = findPreviousProductionVersion(allVersions, currentVersion.id)

        if (!previousVersion) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'No previous version to rollback to' },
                { status: 400 }
            )
        }

        // Perform the rollback
        // 1. Deprecate current production
        const { error: deprecateError } = await supabase
            .from('tool_versions')
            .update({ status: 'deprecated' })
            .eq('id', currentVersion.id)

        if (deprecateError) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: `Failed to deprecate current version: ${deprecateError.message}` },
                { status: 500 }
            )
        }

        // 2. Restore previous version to production
        const { data: restoredVersion, error: restoreError } = await supabase
            .from('tool_versions')
            .update({
                status: 'production',
                rollout_pct: 100,  // Full rollout after rollback
            })
            .eq('id', previousVersion.id)
            .select()
            .single()

        if (restoreError) {
            // Attempt to undo the deprecation
            await supabase
                .from('tool_versions')
                .update({ status: 'production' })
                .eq('id', currentVersion.id)

            return NextResponse.json<ApiResponse>(
                { success: false, error: `Failed to restore previous version: ${restoreError.message}` },
                { status: 500 }
            )
        }

        // 3. Log the rollback in alerts
        const user = await getAuthUser()
        await supabase
            .from('alerts')
            .insert({
                tenant_id: null,  // System-wide alert
                type: 'tool_rollback',
                title: `Tool version rolled back`,
                message: JSON.stringify({
                    tool_id: currentVersion.tool_id,
                    from_version: currentVersion.version,
                    to_version: previousVersion.version,
                    reason: body.reason || 'No reason provided',
                    performed_by: user?.email,
                }),
                read: false,
            })

        return NextResponse.json<ApiResponse<{ from: DbToolVersion; to: DbToolVersion }>>({
            success: true,
            data: {
                from: currentVersion,
                to: restoredVersion,
            },
            message: `Rolled back from ${currentVersion.version} to ${previousVersion.version}`,
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
