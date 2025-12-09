// Admin API for managing alerts
// Requires super_admin role

import { createClient } from '@/utils/supabase/server'
import { requireRole } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'
import type { ApiResponse, ListResponse } from '@/types/tools'
import type { DbAlert, AlertWithTenant, AlertCategory, AlertSeverity, getAlertCategory } from '@/types/alerts'

// GET /api/admin/alerts - List all alerts with filters
export async function GET(request: Request) {
    try {
        // Require super_admin role
        await requireRole('super_admin')

        const supabase = await createClient()
        const { searchParams } = new URL(request.url)

        // Parse query params
        const limit = Math.min(parseInt(searchParams.get('limit') || '100'), 100)
        const offset = parseInt(searchParams.get('offset') || '0')
        const category = searchParams.get('category') as AlertCategory | null
        const severity = searchParams.get('severity') as AlertSeverity | null
        const isRead = searchParams.get('is_read')

        // Build query
        let query = supabase
            .from('alerts')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1)

        // Apply filters
        if (category) {
            // Filter by category prefix (e.g., 'client' matches 'client.created', 'client.onboarded')
            query = query.like('type', `${category}.%`)
        }
        if (severity) {
            query = query.eq('severity', severity)
        }
        if (isRead !== null && isRead !== undefined) {
            query = query.eq('is_read', isRead === 'true')
        }

        const { data: alerts, error, count } = await query

        if (error) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: error.message },
                { status: 500 }
            )
        }

        // Fetch tenant info for alerts that have tenant_id
        const tenantIds = [...new Set((alerts || []).filter(a => a.tenant_id).map(a => a.tenant_id))]
        let tenantsMap: Record<string, { id: string; name: string; slug: string }> = {}

        if (tenantIds.length > 0) {
            const { data: tenants } = await supabase
                .from('tenants')
                .select('id, name, slug')
                .in('id', tenantIds)

            if (tenants) {
                tenantsMap = Object.fromEntries(tenants.map(t => [t.id, t]))
            }
        }

        // Map alerts with tenant info
        const alertsWithTenants: AlertWithTenant[] = (alerts || []).map(alert => ({
            ...alert,
            tenant: alert.tenant_id ? tenantsMap[alert.tenant_id] || null : null,
        }))

        return NextResponse.json<ApiResponse<ListResponse<AlertWithTenant>>>({
            success: true,
            data: {
                items: alertsWithTenants,
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

// POST /api/admin/alerts/mark-all-read - Mark all alerts as read
export async function POST(request: Request) {
    try {
        // Require super_admin role
        await requireRole('super_admin')

        const supabase = await createClient()

        const { error } = await supabase
            .from('alerts')
            .update({ is_read: true })
            .eq('is_read', false)

        if (error) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: error.message },
                { status: 500 }
            )
        }

        return NextResponse.json<ApiResponse>({
            success: true,
            message: 'All alerts marked as read',
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
