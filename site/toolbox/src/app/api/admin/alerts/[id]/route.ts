// Admin API for managing individual alerts
// Requires super_admin role

import { createClient } from '@/utils/supabase/server'
import { requireRole } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'
import type { ApiResponse } from '@/types/tools'
import type { DbAlert } from '@/types/alerts'

interface RouteParams {
    params: Promise<{ id: string }>
}

// GET /api/admin/alerts/[id] - Get a single alert
export async function GET(request: Request, { params }: RouteParams) {
    try {
        // Require super_admin role
        await requireRole('super_admin')

        const { id } = await params
        const supabase = await createClient()

        const { data: alert, error } = await supabase
            .from('alerts')
            .select('*')
            .eq('id', id)
            .single()

        if (error) {
            if (error.code === 'PGRST116') {
                return NextResponse.json<ApiResponse>(
                    { success: false, error: 'Alert not found' },
                    { status: 404 }
                )
            }
            return NextResponse.json<ApiResponse>(
                { success: false, error: error.message },
                { status: 500 }
            )
        }

        return NextResponse.json<ApiResponse<DbAlert>>({
            success: true,
            data: alert,
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

// PATCH /api/admin/alerts/[id] - Mark alert as read/unread
export async function PATCH(request: Request, { params }: RouteParams) {
    try {
        // Require super_admin role
        await requireRole('super_admin')

        const { id } = await params
        const body = await request.json()
        const supabase = await createClient()

        // Only allow updating is_read field
        const updates: { is_read?: boolean } = {}
        if (typeof body.is_read === 'boolean') {
            updates.is_read = body.is_read
        }

        if (Object.keys(updates).length === 0) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'No valid update fields provided' },
                { status: 400 }
            )
        }

        const { data: alert, error } = await supabase
            .from('alerts')
            .update(updates)
            .eq('id', id)
            .select()
            .single()

        if (error) {
            if (error.code === 'PGRST116') {
                return NextResponse.json<ApiResponse>(
                    { success: false, error: 'Alert not found' },
                    { status: 404 }
                )
            }
            return NextResponse.json<ApiResponse>(
                { success: false, error: error.message },
                { status: 500 }
            )
        }

        return NextResponse.json<ApiResponse<DbAlert>>({
            success: true,
            data: alert,
            message: updates.is_read ? 'Alert marked as read' : 'Alert marked as unread',
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

// DELETE /api/admin/alerts/[id] - Delete an alert
export async function DELETE(request: Request, { params }: RouteParams) {
    try {
        // Require super_admin role
        await requireRole('super_admin')

        const { id } = await params
        const supabase = await createClient()

        const { error } = await supabase
            .from('alerts')
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
            message: 'Alert deleted successfully',
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
