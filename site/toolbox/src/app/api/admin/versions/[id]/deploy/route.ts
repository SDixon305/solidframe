// Admin API for deploying tool versions
// Requires super_admin role

import { createClient } from '@/utils/supabase/server'
import { requireRole } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'
import { canDeployToStaging, canDeployToProduction, validateRolloutPct } from '@/lib/tool-engine'
import type { ApiResponse, DbToolVersion, DeployVersionRequest } from '@/types/tools'

interface RouteParams {
    params: Promise<{ id: string }>
}

// POST /api/admin/versions/[id]/deploy - Deploy a version to staging or production
export async function POST(request: Request, { params }: RouteParams) {
    try {
        // Require super_admin role
        await requireRole('super_admin')

        const { id } = await params
        const body: DeployVersionRequest = await request.json()

        // Validate target
        if (!body.target || !['staging', 'production'].includes(body.target)) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'target must be "staging" or "production"' },
                { status: 400 }
            )
        }

        // Validate rollout_pct if provided
        if (body.rollout_pct !== undefined) {
            const pctCheck = validateRolloutPct(body.rollout_pct)
            if (!pctCheck.valid) {
                return NextResponse.json<ApiResponse>(
                    { success: false, error: pctCheck.reason },
                    { status: 400 }
                )
            }
        }

        const supabase = await createClient()

        // Get the version to deploy
        const { data: version, error: fetchError } = await supabase
            .from('tool_versions')
            .select('*')
            .eq('id', id)
            .single()

        if (fetchError || !version) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Version not found' },
                { status: 404 }
            )
        }

        // Validate deployment based on target
        if (body.target === 'staging') {
            const check = canDeployToStaging(version)
            if (!check.allowed) {
                return NextResponse.json<ApiResponse>(
                    { success: false, error: check.reason },
                    { status: 400 }
                )
            }

            // Deploy to staging
            const { data: updated, error: updateError } = await supabase
                .from('tool_versions')
                .update({ status: 'staging' })
                .eq('id', id)
                .select()
                .single()

            if (updateError) {
                return NextResponse.json<ApiResponse>(
                    { success: false, error: updateError.message },
                    { status: 500 }
                )
            }

            return NextResponse.json<ApiResponse<DbToolVersion>>({
                success: true,
                data: updated,
                message: `Version ${version.version} deployed to staging`,
            })
        }

        // Deploy to production
        const check = canDeployToProduction(version)
        if (!check.allowed) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: check.reason },
                { status: 400 }
            )
        }

        // Find current production version to deprecate
        const { data: currentProduction } = await supabase
            .from('tool_versions')
            .select('id')
            .eq('tool_id', version.tool_id)
            .eq('status', 'production')
            .single()

        // Start transaction-like operations
        // 1. Deprecate current production version (if exists)
        if (currentProduction) {
            const { error: deprecateError } = await supabase
                .from('tool_versions')
                .update({ status: 'deprecated' })
                .eq('id', currentProduction.id)

            if (deprecateError) {
                return NextResponse.json<ApiResponse>(
                    { success: false, error: `Failed to deprecate current version: ${deprecateError.message}` },
                    { status: 500 }
                )
            }
        }

        // 2. Promote this version to production
        const rolloutPct = body.rollout_pct ?? 100
        const { data: updated, error: updateError } = await supabase
            .from('tool_versions')
            .update({
                status: 'production',
                rollout_pct: rolloutPct,
            })
            .eq('id', id)
            .select()
            .single()

        if (updateError) {
            // Attempt to rollback the deprecation
            if (currentProduction) {
                await supabase
                    .from('tool_versions')
                    .update({ status: 'production' })
                    .eq('id', currentProduction.id)
            }

            return NextResponse.json<ApiResponse>(
                { success: false, error: updateError.message },
                { status: 500 }
            )
        }

        const rolloutMessage = rolloutPct < 100
            ? ` (canary: ${rolloutPct}%)`
            : ''

        return NextResponse.json<ApiResponse<DbToolVersion>>({
            success: true,
            data: updated,
            message: `Version ${version.version} deployed to production${rolloutMessage}`,
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
