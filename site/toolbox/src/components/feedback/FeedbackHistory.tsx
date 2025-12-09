'use client'

import { useState, useEffect } from 'react'
import { Loader2, MessageSquare, Bug, Lightbulb, Bot, ChevronDown, ChevronUp, Filter, Inbox } from 'lucide-react'
import { useTenantContext } from '@/lib/tenant-context'
import type {
    FeedbackWithMeta,
    FeedbackUIType,
    FeedbackStatus,
} from '@/types/feedback'
import {
    feedbackStatusLabels,
    feedbackStatusColors,
    feedbackTypeLabels,
    feedbackPriorityColors,
} from '@/types/feedback'

interface FeedbackHistoryProps {
    refreshTrigger?: number
}

const typeIcons: Record<FeedbackUIType, typeof MessageSquare> = {
    general: MessageSquare,
    bug: Bug,
    feature_request: Lightbulb,
    ai_error: Bot,
}

// Map DB types to UI types for display
function getUIType(dbType: string, isAiError?: boolean): FeedbackUIType {
    if (isAiError) return 'ai_error'
    switch (dbType) {
        case 'bug':
            return 'bug'
        case 'feature_request':
            return 'feature_request'
        default:
            return 'general'
    }
}

export function FeedbackHistory({ refreshTrigger = 0 }: FeedbackHistoryProps) {
    const { tenant } = useTenantContext()

    const [feedback, setFeedback] = useState<FeedbackWithMeta[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [expandedId, setExpandedId] = useState<string | null>(null)
    const [filterType, setFilterType] = useState<string>('')

    // Fetch feedback history
    useEffect(() => {
        async function fetchFeedback() {
            setIsLoading(true)
            setError(null)

            try {
                const params = new URLSearchParams({
                    tenant_slug: tenant.slug,
                    limit: '50',
                })
                if (filterType) {
                    params.append('type', filterType)
                }

                const response = await fetch(`/api/tenant/feedback?${params}`)
                const result = await response.json()

                if (!response.ok || !result.success) {
                    throw new Error(result.error || 'Failed to fetch feedback')
                }

                setFeedback(result.data.items)
            } catch (err) {
                console.error('Failed to fetch feedback:', err)
                setError(err instanceof Error ? err.message : 'Failed to load feedback history')
            } finally {
                setIsLoading(false)
            }
        }

        fetchFeedback()
    }, [tenant.slug, filterType, refreshTrigger])

    // Format date for display
    const formatDate = (dateString: string): string => {
        const date = new Date(dateString)
        const now = new Date()
        const diffMs = now.getTime() - date.getTime()
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

        if (diffDays === 0) {
            return 'Today'
        } else if (diffDays === 1) {
            return 'Yesterday'
        } else if (diffDays < 7) {
            return `${diffDays} days ago`
        } else {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
            })
        }
    }

    // Get status badge component
    const StatusBadge = ({ status }: { status: FeedbackStatus }) => {
        const colors = feedbackStatusColors[status] || feedbackStatusColors.new
        const label = feedbackStatusLabels[status] || status

        return (
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text} border ${colors.border}`}>
                {label}
            </span>
        )
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-violet-600" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600">{error}</p>
                <button
                    onClick={() => setFilterType(filterType)} // Trigger refresh
                    className="mt-2 text-sm text-violet-600 hover:text-violet-700"
                >
                    Try again
                </button>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {/* Filter */}
            <div className="flex items-center gap-3">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                    value={filterType}
                    onChange={e => setFilterType(e.target.value)}
                    className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none bg-white"
                >
                    <option value="">All Types</option>
                    <option value="feedback">General Feedback</option>
                    <option value="bug">Bug Reports</option>
                    <option value="feature_request">Feature Requests</option>
                </select>
            </div>

            {/* Empty State */}
            {feedback.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                    <Inbox className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No feedback submitted yet</p>
                    <p className="text-sm text-gray-400 mt-1">
                        {filterType ? 'Try changing the filter' : 'Your submitted feedback will appear here'}
                    </p>
                </div>
            )}

            {/* Feedback List */}
            <div className="space-y-3">
                {feedback.map(item => {
                    const isExpanded = expandedId === item.id
                    const uiType = getUIType(item.type, item.meta?.is_ai_error)
                    const Icon = typeIcons[uiType]
                    const typeLabel = feedbackTypeLabels[uiType]

                    return (
                        <div
                            key={item.id}
                            className="bg-white border border-gray-200 rounded-lg overflow-hidden"
                        >
                            {/* Header - Always Visible */}
                            <button
                                type="button"
                                onClick={() => setExpandedId(isExpanded ? null : item.id)}
                                className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors text-left"
                            >
                                <div className={`p-2 rounded-lg ${
                                    uiType === 'bug' ? 'bg-red-100' :
                                    uiType === 'feature_request' ? 'bg-amber-100' :
                                    uiType === 'ai_error' ? 'bg-orange-100' :
                                    'bg-blue-100'
                                }`}>
                                    <Icon className={`w-4 h-4 ${
                                        uiType === 'bug' ? 'text-red-600' :
                                        uiType === 'feature_request' ? 'text-amber-600' :
                                        uiType === 'ai_error' ? 'text-orange-600' :
                                        'text-blue-600'
                                    }`} />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h4 className="font-medium text-gray-900 truncate">
                                            {item.meta?.subject || 'Untitled'}
                                        </h4>
                                        <StatusBadge status={item.status} />
                                    </div>
                                    <div className="flex items-center gap-2 mt-0.5 text-sm text-gray-500">
                                        <span>{typeLabel}</span>
                                        <span>•</span>
                                        <span>{formatDate(item.created_at)}</span>
                                        {item.tool && (
                                            <>
                                                <span>•</span>
                                                <span>{item.tool.name}</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {isExpanded ? (
                                    <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                )}
                            </button>

                            {/* Expanded Details */}
                            {isExpanded && (
                                <div className="px-4 pb-4 pt-2 border-t border-gray-100">
                                    {/* Description */}
                                    <div className="mb-4">
                                        <h5 className="text-sm font-medium text-gray-700 mb-1">Description</h5>
                                        <p className="text-sm text-gray-600 whitespace-pre-wrap">
                                            {item.meta?.description || 'No description provided'}
                                        </p>
                                    </div>

                                    {/* Priority (for bugs) */}
                                    {item.meta?.priority && (
                                        <div className="mb-4">
                                            <h5 className="text-sm font-medium text-gray-700 mb-1">Priority</h5>
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                                feedbackPriorityColors[item.meta.priority].bg
                                            } ${feedbackPriorityColors[item.meta.priority].text}`}>
                                                {item.meta.priority.charAt(0).toUpperCase() + item.meta.priority.slice(1)}
                                            </span>
                                        </div>
                                    )}

                                    {/* AI Error Context */}
                                    {item.meta?.is_ai_error && item.meta?.ai_context && (
                                        <div className="space-y-3 p-3 bg-orange-50 rounded-lg">
                                            <div>
                                                <h5 className="text-sm font-medium text-orange-800 mb-1">
                                                    What the AI said wrong:
                                                </h5>
                                                <p className="text-sm text-orange-700">
                                                    {item.meta.ai_context.what_ai_said}
                                                </p>
                                            </div>
                                            <div>
                                                <h5 className="text-sm font-medium text-orange-800 mb-1">
                                                    What it should have said:
                                                </h5>
                                                <p className="text-sm text-orange-700">
                                                    {item.meta.ai_context.what_should_say}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Admin Response (if any) */}
                                    {item.admin_notes && (
                                        <div className="mt-4 p-3 bg-violet-50 rounded-lg">
                                            <h5 className="text-sm font-medium text-violet-800 mb-1">
                                                SolidFrame Response:
                                            </h5>
                                            <p className="text-sm text-violet-700">
                                                {item.admin_notes}
                                            </p>
                                        </div>
                                    )}

                                    {/* Resolved timestamp */}
                                    {item.resolved_at && (
                                        <p className="mt-3 text-xs text-gray-400">
                                            Resolved on {new Date(item.resolved_at).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
