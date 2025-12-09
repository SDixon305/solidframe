// Feedback types for the client portal

// UI feedback types (what the user sees)
export type FeedbackUIType = 'general' | 'bug' | 'feature_request' | 'ai_error'

// Database feedback types (what's stored)
export type FeedbackDbType = 'feedback' | 'bug' | 'feature_request' | 'question' | 'praise' | 'complaint'

// Feedback status
export type FeedbackStatus = 'new' | 'reviewed' | 'in_progress' | 'resolved' | 'wont_fix'

// Priority for bug reports
export type FeedbackPriority = 'low' | 'medium' | 'high'

// Database record from feedback table
export interface DbFeedback {
    id: string
    tenant_id: string
    user_id: string | null
    tool_id: string | null
    type: FeedbackDbType
    message: string  // JSON stringified FeedbackMeta
    rating: number | null
    status: FeedbackStatus
    admin_notes: string | null
    created_at: string
    resolved_at: string | null
}

// Structured metadata stored in the message field
export interface FeedbackMeta {
    subject: string
    description: string
    priority?: FeedbackPriority
    is_ai_error?: boolean
    ai_context?: {
        what_ai_said: string
        what_should_say: string
        transcript_id?: string | null
    }
    browser_info?: {
        userAgent: string
        platform: string
        language: string
        screenSize?: string
    }
}

// Parsed feedback for UI display
export interface FeedbackWithMeta extends Omit<DbFeedback, 'message'> {
    meta: FeedbackMeta
    tool?: {
        id: string
        name: string
        slug: string
    } | null
}

// Create feedback request from client
export interface CreateFeedbackRequest {
    type: FeedbackUIType
    tool_id?: string | null
    subject: string
    description: string
    priority?: FeedbackPriority
    ai_context?: {
        what_ai_said: string
        what_should_say: string
        transcript_id?: string | null
    }
}

// Map UI types to DB types
export function mapUITypeToDbType(uiType: FeedbackUIType): FeedbackDbType {
    switch (uiType) {
        case 'general':
            return 'feedback'
        case 'bug':
            return 'bug'
        case 'feature_request':
            return 'feature_request'
        case 'ai_error':
            return 'bug'  // AI errors stored as bugs with is_ai_error flag
        default:
            return 'feedback'
    }
}

// Map DB types back to UI types (best effort)
export function mapDbTypeToUIType(dbType: FeedbackDbType, isAiError?: boolean): FeedbackUIType {
    if (isAiError) return 'ai_error'
    switch (dbType) {
        case 'feedback':
        case 'question':
        case 'praise':
        case 'complaint':
            return 'general'
        case 'bug':
            return 'bug'
        case 'feature_request':
            return 'feature_request'
        default:
            return 'general'
    }
}

// Parse message JSON to FeedbackMeta
export function parseFeedbackMessage(message: string): FeedbackMeta {
    try {
        return JSON.parse(message) as FeedbackMeta
    } catch {
        // Fallback for plain text messages
        return {
            subject: 'Feedback',
            description: message,
        }
    }
}

// Stringify FeedbackMeta to message
export function stringifyFeedbackMeta(meta: FeedbackMeta): string {
    return JSON.stringify(meta)
}

// Status display labels
export const feedbackStatusLabels: Record<FeedbackStatus, string> = {
    new: 'Submitted',
    reviewed: 'In Review',
    in_progress: 'In Progress',
    resolved: 'Resolved',
    wont_fix: "Won't Fix",
}

// Status colors for badges
export const feedbackStatusColors: Record<FeedbackStatus, { text: string; bg: string; border: string }> = {
    new: {
        text: 'text-blue-700',
        bg: 'bg-blue-50',
        border: 'border-blue-200',
    },
    reviewed: {
        text: 'text-amber-700',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
    },
    in_progress: {
        text: 'text-violet-700',
        bg: 'bg-violet-50',
        border: 'border-violet-200',
    },
    resolved: {
        text: 'text-emerald-700',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
    },
    wont_fix: {
        text: 'text-gray-700',
        bg: 'bg-gray-50',
        border: 'border-gray-200',
    },
}

// UI type labels
export const feedbackTypeLabels: Record<FeedbackUIType, string> = {
    general: 'General Feedback',
    bug: 'Bug Report',
    feature_request: 'Feature Request',
    ai_error: 'AI Error Report',
}

// Priority labels
export const feedbackPriorityLabels: Record<FeedbackPriority, string> = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
}

// Priority colors
export const feedbackPriorityColors: Record<FeedbackPriority, { text: string; bg: string }> = {
    low: { text: 'text-gray-600', bg: 'bg-gray-100' },
    medium: { text: 'text-amber-600', bg: 'bg-amber-100' },
    high: { text: 'text-red-600', bg: 'bg-red-100' },
}
