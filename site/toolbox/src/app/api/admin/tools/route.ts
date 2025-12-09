// Admin API for managing tool definitions
// Requires super_admin role

import { createClient } from '@/utils/supabase/server'
import { requireRole } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'
import type { ApiResponse, DbTool, ToolWithVersion, CreateToolRequest, ListResponse } from '@/types/tools'

// GET /api/admin/tools - List all tools with their versions
export async function GET(request: Request) {
    try {
        // Require super_admin role
        await requireRole('super_admin')

        const supabase = await createClient()
        const { searchParams } = new URL(request.url)

        // Parse query params
        const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100)
        const offset = parseInt(searchParams.get('offset') || '0')
        const category = searchParams.get('category')
        const isReal = searchParams.get('is_real')

        // Build query
        let query = supabase
            .from('tools')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1)

        // Apply filters
        if (category) {
            query = query.eq('category', category)
        }
        if (isReal !== null) {
            query = query.eq('is_real', isReal === 'true')
        }

        const { data: tools, error, count } = await query

        if (error) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: error.message },
                { status: 500 }
            )
        }

        // Fetch active versions for each tool
        const toolIds = tools?.map(t => t.id) || []
        const { data: versions } = await supabase
            .from('tool_versions')
            .select('*')
            .in('tool_id', toolIds)
            .in('status', ['production', 'staging'])

        // Map versions to tools
        const toolsWithVersions: ToolWithVersion[] = (tools || []).map(tool => {
            const toolVersions = versions?.filter(v => v.tool_id === tool.id) || []
            return {
                ...tool,
                active_version: toolVersions.find(v => v.status === 'production') || null,
                staging_version: toolVersions.find(v => v.status === 'staging') || null,
            }
        })

        return NextResponse.json<ApiResponse<ListResponse<ToolWithVersion>>>({
            success: true,
            data: {
                items: toolsWithVersions,
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

// POST /api/admin/tools - Create a new tool
export async function POST(request: Request) {
    try {
        // Require super_admin role
        await requireRole('super_admin')

        const body: CreateToolRequest = await request.json()

        // Validate required fields
        if (!body.slug || !body.name || !body.category) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'slug, name, and category are required' },
                { status: 400 }
            )
        }

        // Validate slug format (lowercase, alphanumeric, hyphens)
        const slugRegex = /^[a-z0-9-]+$/
        if (!slugRegex.test(body.slug)) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'slug must be lowercase alphanumeric with hyphens only' },
                { status: 400 }
            )
        }

        const supabase = await createClient()

        // Check for duplicate slug
        const { data: existing } = await supabase
            .from('tools')
            .select('id')
            .eq('slug', body.slug)
            .single()

        if (existing) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'A tool with this slug already exists' },
                { status: 409 }
            )
        }

        // Create the tool
        const { data: tool, error } = await supabase
            .from('tools')
            .insert({
                slug: body.slug,
                name: body.name,
                description: body.description || null,
                icon: body.icon || null,
                category: body.category,
                is_real: body.is_real ?? false,
            })
            .select()
            .single()

        if (error) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: error.message },
                { status: 500 }
            )
        }

        return NextResponse.json<ApiResponse<DbTool>>(
            { success: true, data: tool, message: 'Tool created successfully' },
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

// PATCH /api/admin/tools - Update a tool (requires id in body)
export async function PATCH(request: Request) {
    try {
        // Require super_admin role
        await requireRole('super_admin')

        const body = await request.json()
        const { id, ...updates } = body

        if (!id) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Tool id is required' },
                { status: 400 }
            )
        }

        // Remove fields that shouldn't be updated
        delete updates.slug  // slug is immutable
        delete updates.created_at

        const supabase = await createClient()

        const { data: tool, error } = await supabase
            .from('tools')
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

        if (!tool) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Tool not found' },
                { status: 404 }
            )
        }

        return NextResponse.json<ApiResponse<DbTool>>({
            success: true,
            data: tool,
            message: 'Tool updated successfully',
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

// DELETE /api/admin/tools - Delete a tool (requires id in query)
export async function DELETE(request: Request) {
    try {
        // Require super_admin role
        await requireRole('super_admin')

        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Tool id is required' },
                { status: 400 }
            )
        }

        const supabase = await createClient()

        // Check if tool is being used by any tenants
        const { count: tenantCount } = await supabase
            .from('tenant_tools')
            .select('*', { count: 'exact', head: true })
            .eq('tool_id', id)
            .eq('is_active', true)

        if (tenantCount && tenantCount > 0) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: `Cannot delete: tool is active for ${tenantCount} tenant(s)` },
                { status: 409 }
            )
        }

        const { error } = await supabase
            .from('tools')
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
            message: 'Tool deleted successfully',
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
