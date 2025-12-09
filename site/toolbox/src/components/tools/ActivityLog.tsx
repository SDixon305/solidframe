'use client'

import React from 'react'
import { CheckCircle, Info, AlertTriangle, Clock } from 'lucide-react'
import { ActivityLogEntry } from '@/lib/fake-data'
import { formatDistanceToNow } from 'date-fns'

interface ActivityLogProps {
    entries: ActivityLogEntry[]
    maxEntries?: number
    showViewAll?: boolean
    onViewAll?: () => void
}

export default function ActivityLog({
    entries,
    maxEntries = 10,
    showViewAll = true,
    onViewAll,
}: ActivityLogProps) {
    const displayEntries = entries.slice(0, maxEntries)

    const typeConfig = {
        success: {
            icon: CheckCircle,
            bgColor: 'bg-emerald-50',
            iconColor: 'text-emerald-500',
            borderColor: 'border-emerald-100',
        },
        info: {
            icon: Info,
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-500',
            borderColor: 'border-blue-100',
        },
        warning: {
            icon: AlertTriangle,
            bgColor: 'bg-amber-50',
            iconColor: 'text-amber-500',
            borderColor: 'border-amber-100',
        },
    }

    if (entries.length === 0) {
        return (
            <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
                <Clock size={32} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 text-sm">No activity yet</p>
            </div>
        )
    }

    return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="divide-y divide-gray-100">
                {displayEntries.map((entry) => {
                    const config = typeConfig[entry.type]
                    const Icon = config.icon

                    return (
                        <div
                            key={entry.id}
                            className="flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors"
                        >
                            <div className={`p-1.5 rounded-full ${config.bgColor}`}>
                                <Icon size={14} className={config.iconColor} />
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-900">
                                    {entry.message}
                                </p>
                                {entry.details && (
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        {entry.details}
                                    </p>
                                )}
                            </div>

                            <span className="text-xs text-gray-400 whitespace-nowrap">
                                {formatDistanceToNow(entry.timestamp, { addSuffix: true })}
                            </span>
                        </div>
                    )
                })}
            </div>

            {showViewAll && entries.length > maxEntries && onViewAll && (
                <div className="p-3 border-t border-gray-100 bg-gray-50">
                    <button
                        onClick={onViewAll}
                        className="w-full text-center text-sm text-[#5f3bff] hover:text-[#4f2fe0] font-medium"
                    >
                        View all {entries.length} entries
                    </button>
                </div>
            )}
        </div>
    )
}

// Compact activity log for sidebar/overview display
interface CompactActivityLogProps {
    entries: ActivityLogEntry[]
    maxEntries?: number
}

export function CompactActivityLog({ entries, maxEntries = 5 }: CompactActivityLogProps) {
    const displayEntries = entries.slice(0, maxEntries)

    const typeColors = {
        success: 'bg-emerald-500',
        info: 'bg-blue-500',
        warning: 'bg-amber-500',
    }

    if (entries.length === 0) {
        return (
            <p className="text-sm text-gray-400 text-center py-4">No recent activity</p>
        )
    }

    return (
        <div className="space-y-2">
            {displayEntries.map((entry) => (
                <div
                    key={entry.id}
                    className="flex items-center gap-2 text-sm"
                >
                    <div className={`w-1.5 h-1.5 rounded-full ${typeColors[entry.type]}`} />
                    <span className="text-gray-600 truncate flex-1">{entry.message}</span>
                    <span className="text-xs text-gray-400">
                        {formatDistanceToNow(entry.timestamp, { addSuffix: true }).replace('about ', '')}
                    </span>
                </div>
            ))}
        </div>
    )
}
