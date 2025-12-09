'use client'

import { Bell } from 'lucide-react'
import { useAlerts } from '@/hooks/useAlerts'
import { AlertFilters } from '@/components/admin/AlertFilters'
import { AlertList } from '@/components/admin/AlertList'

export default function AlertsPage() {
    const {
        alerts,
        loading,
        error,
        total,
        unreadCount,
        filters,
        setFilters,
        markAsRead,
        markAllAsRead,
        loadMore,
        hasMore,
    } = useAlerts()

    return (
        <div className="p-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-violet-100 rounded-lg">
                        <Bell size={24} className="text-violet-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Alerts</h1>
                        <p className="text-sm text-gray-500">
                            {unreadCount > 0
                                ? `${unreadCount} unread alert${unreadCount === 1 ? '' : 's'}`
                                : 'All caught up!'
                            }
                            {total > 0 && ` • ${total} total`}
                        </p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="mb-6">
                <AlertFilters
                    filters={filters}
                    onFiltersChange={setFilters}
                    onMarkAllAsRead={markAllAsRead}
                    unreadCount={unreadCount}
                />
            </div>

            {/* Alert list */}
            <AlertList
                alerts={alerts}
                loading={loading}
                error={error}
                hasMore={hasMore}
                onLoadMore={loadMore}
                onMarkAsRead={markAsRead}
            />
        </div>
    )
}
