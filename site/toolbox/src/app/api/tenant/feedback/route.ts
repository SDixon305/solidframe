// Client-facing API for feedback submission and retrieval
// Used by the client portal at /[tenant]/feedback

import { createClient } from '@/utils/supabase/server'
import { getTenantBySlug, getAuthUser } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'
import type { ApiResponse, ListResponse } from '@/types/tools'
import type {
    DbFeedback,
    FeedbackWithMeta,
    CreateFeedbackRequest,
    FeedbackUIType,
    mapUITypeToDbType,
    stringifyFeedbackMeta,
    parseFeedbackMessage,
} from '@/types/feedback'

// Helper to map UI type to DB type
function getDbType(uiType: FeedbackUIType): string {
    switch (uiType) {
        case 'general':
            return 'feedback'
        case 'bug':
        case 'ai_error':
            return 'bug'
        case 'feature_request':
            return 'feature_request'
        default:
            return 'feedback'
    }
}

// Helper to get alert type based on feedback type
function getAlertType(feedbackType: FeedbackUIType): string {
    switch (feedbackType) {
        case 'bug':
        case 'ai_error':
            return 'warning'
        default:
            return 'info'
    }
}

// POST /api/tenant/feedback - Submit new feedback
export async function POST(request: Request) {
    try {
        const supabase = await createClient()
        const body = await request.json()

        // Extract tenant_slug from request body
        const { tenant_slug, ...feedbackData } = body as CreateFeedbackRequest & { tenant_slug: string }

        if (!tenant_slug) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'tenant_slug is required' },
                { status: 400 }
            )
        }

        // Validate required fields
        if (!feedbackData.type || !feedbackData.subject || !feedbackData.description) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'type, subject, and description are required' },
                { status: 400 }
            )
        }

        // Validate type
        const validTypes: FeedbackUIType[] = ['general', 'bug', 'feature_request', 'ai_error']
        if (!validTypes.includes(feedbackData.type)) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Invalid feedback type' },
                { status: 400 }
            )
        }

        // Get tenant by slug
        const tenant = await getTenantBySlug(tenant_slug)
        if (!tenant) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Tenant not found' },
                { status: 404 }
            )
        }

        // Get current user (may be null in demo mode)
        const user = await getAuthUser()

        // Get browser info from headers
        const userAgent = request.headers.get('user-agent') || 'Unknown'
        const acceptLanguage = request.headers.get('accept-language') || 'Unknown'

        // Build the message JSON
        const messageData = {
            subject: feedbackData.subject,
            description: feedbackData.description,
            priority: feedbackData.priority || undefined,
            is_ai_error: feedbackData.type === 'ai_error',
            ai_context: feedbackData.ai_context || undefined,
            browser_info: {
                userAgent,
                platform: 'web',
                language: acceptLanguage.split(',')[0] || 'en',
            },
        }

        // Insert feedback record
        const { data: feedback, error: feedbackError } = await supabase
            .from('feedback')
            .insert({
                tenant_id: tenant.id,
                user_id: user?.id || null,
                tool_id: feedbackData.tool_id || null,
                type: getDbType(feedbackData.type),
                message: JSON.stringify(messageData),
                status: 'new',
            })
            .select()
            .single()

        if (feedbackError) {
            console.error('Failed to create feedback:', feedbackError)
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Failed to submit feedback' },
                { status: 500 }
            )
        }

        // Create admin alert for the feedback
        const alertTitle = feedbackData.type === 'ai_error'
            ? `AI Error Report from ${tenant.name}`
            : feedbackData.type === 'bug'
                ? `Bug Report from ${tenant.name}`
                : feedbackData.type === 'feature_request'
                    ? `Feature Request from ${tenant.name}`
                    : `Feedback from ${tenant.name}`

        const { error: alertError } = await supabase
            .from('alerts')
            .insert({
                tenant_id: tenant.id,
                type: getAlertType(feedbackData.type),
                title: alertTitle,
                message: feedbackData.subject,
                action_url: `/admin/feedback/${feedback.id}`,
            })

        if (alertError) {
            // Log but don't fail the request if alert creation fails
            console.error('Failed to create alert for feedback:', alertError)
        }

        // Parse feedback for response
        const feedbackWithMeta: FeedbackWithMeta = {
            ...feedback,
            meta: messageData,
            tool: null,
        }

        return NextResponse.json<ApiResponse<FeedbackWithMeta>>(
            {
                success: true,
                data: feedbackWithMeta,
                message: 'Feedback submitted successfully',
            },
            { status: 201 }
        )
    } catch (error) {
        console.error('Feedback submission error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json<ApiResponse>(
            { success: false, error: message },
            { status: 500 }
        )
    }
}

// GET /api/tenant/feedback - List feedback for a tenant
export async function GET(request: Request) {
    try {
        const supabase = await createClient()
        const { searchParams } = new URL(request.url)

        // Get tenant_slug from query params
        const tenant_slug = searchParams.get('tenant_slug')
        if (!tenant_slug) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'tenant_slug is required' },
                { status: 400 }
            )
        }

        // Get tenant by slug
        const tenant = await getTenantBySlug(tenant_slug)
        if (!tenant) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Tenant not found' },
                { status: 404 }
            )
        }

        // Parse query params
        const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)
        const offset = parseInt(searchParams.get('offset') || '0')
        const type = searchParams.get('type') // Optional type filter

        // Build query
        let query = supabase
            .from('feedback')
            .select(`
                *,
                tool:tools(id, name, slug)
            `, { count: 'exact' })
            .eq('tenant_id', tenant.id)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1)

        // Apply type filter if provided
        if (type) {
            query = query.eq('type', type)
        }

        const { data: feedbackList, error, count } = await query

        if (error) {
            console.error('Failed to fetch feedback:', error)
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Failed to fetch feedback' },
                { status: 500 }
            )
        }

        // Parse message JSON for each feedback item
        const feedbackWithMeta: FeedbackWithMeta[] = (feedbackList || []).map((item: DbFeedback & { tool?: { id: string; name: string; slug: string } | null }) => {
            let meta
            try {
                meta = JSON.parse(item.message)
            } catch {
                meta = {
                    subject: 'Feedback',
                    description: item.message,
                }
            }

            return {
                id: item.id,
                tenant_id: item.tenant_id,
                user_id: item.user_id,
                tool_id: item.tool_id,
                type: item.type,
                rating: item.rating,
                status: item.status,
                admin_notes: item.admin_notes,
                created_at: item.created_at,
                resolved_at: item.resolved_at,
                meta,
                tool: item.tool || null,
            }
        })

        return NextResponse.json<ApiResponse<ListResponse<FeedbackWithMeta>>>({
            success: true,
            data: {
                items: feedbackWithMeta,
                total: count || 0,
                offset,
                limit,
            },
        })
    } catch (error) {
        console.error('Feedback fetch error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json<ApiResponse>(
            { success: false, error: message },
            { status: 500 }
        )
    }
}
