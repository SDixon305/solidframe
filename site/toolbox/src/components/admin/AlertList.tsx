'use client'

import { Bell, Loader2 } from 'lucide-react'
import { AlertItem } from './AlertItem'
import type { AlertWithTenant } from '@/types/alerts'

interface AlertListProps {
    alerts: AlertWithTenant[]
    loading: boolean
    error: string | null
    hasMore: boolean
    onLoadMore: () => void
    onMarkAsRead: (alertId: string) => void
}

export function AlertList({
    alerts,
    loading,
    error,
    hasMore,
    onLoadMore,
    onMarkAsRead,
}: AlertListProps) {
    // Loading state (initial load)
    if (loading && alerts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <Loader2 size={32} className="text-gray-400 animate-spin" />
                <p className="mt-3 text-sm text-gray-500">Loading alerts...</p>
            </div>
        )
    }

    // Error state
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-12 bg-red-50 rounded-lg border border-red-200">
                <p className="text-sm text-red-600">Error loading alerts: {error}</p>
            </div>
        )
    }

    // Empty state
    if (alerts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                <div className="p-3 bg-gray-100 rounded-full">
                    <Bell size={24} className="text-gray-400" />
                </div>
                <h3 className="mt-3 text-sm font-medium text-gray-900">No alerts</h3>
                <p className="mt-1 text-sm text-gray-500">
                    You&apos;re all caught up! New alerts will appear here.
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-3">
            {/* Alert items */}
            {alerts.map((alert) => (
                <AlertItem
                    key={alert.id}
                    alert={alert}
                    onMarkAsRead={onMarkAsRead}
                />
            ))}

            {/* Load more button */}
            {hasMore && (
                <div className="pt-4 flex justify-center">
                    <button
                        onClick={onLoadMore}
                        disabled={loading}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Loading...
                            </>
                        ) : (
                            'Load more'
                        )}
                    </button>
                </div>
            )}
        </div>
    )
}
