'use client'

import { CheckCheck, Filter, X } from 'lucide-react'
import type { AlertFilters as AlertFiltersType, AlertCategory, AlertSeverity, categoryLabels, severityLabels } from '@/types/alerts'

interface AlertFiltersProps {
    filters: AlertFiltersType
    onFiltersChange: (filters: AlertFiltersType) => void
    onMarkAllAsRead: () => void
    unreadCount: number
}

const categories: { value: AlertCategory; label: string }[] = [
    { value: 'client', label: 'Client' },
    { value: 'billing', label: 'Billing' },
    { value: 'tool', label: 'Tool' },
    { value: 'usage', label: 'Usage' },
    { value: 'system', label: 'System' },
]

const severities: { value: AlertSeverity; label: string; color: string }[] = [
    { value: 'info', label: 'Info', color: 'bg-blue-500' },
    { value: 'success', label: 'Success', color: 'bg-emerald-500' },
    { value: 'warning', label: 'Warning', color: 'bg-amber-500' },
    { value: 'error', label: 'Error', color: 'bg-red-500' },
]

const readStates: { value: boolean | undefined; label: string }[] = [
    { value: undefined, label: 'All' },
    { value: false, label: 'Unread' },
    { value: true, label: 'Read' },
]

export function AlertFilters({
    filters,
    onFiltersChange,
    onMarkAllAsRead,
    unreadCount,
}: AlertFiltersProps) {
    const hasActiveFilters = filters.category || filters.severity || filters.is_read !== undefined

    const clearFilters = () => {
        onFiltersChange({
            ...filters,
            category: undefined,
            severity: undefined,
            is_read: undefined,
        })
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <div className="flex flex-wrap items-center gap-4">
                {/* Category filter */}
                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">Category:</label>
                    <select
                        value={filters.category || ''}
                        onChange={(e) => onFiltersChange({
                            ...filters,
                            category: e.target.value as AlertCategory || undefined,
                        })}
                        className="text-sm border border-gray-300 rounded-md px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                    >
                        <option value="">All</option>
                        {categories.map((cat) => (
                            <option key={cat.value} value={cat.value}>
                                {cat.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Severity filter */}
                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">Severity:</label>
                    <select
                        value={filters.severity || ''}
                        onChange={(e) => onFiltersChange({
                            ...filters,
                            severity: e.target.value as AlertSeverity || undefined,
                        })}
                        className="text-sm border border-gray-300 rounded-md px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                    >
                        <option value="">All</option>
                        {severities.map((sev) => (
                            <option key={sev.value} value={sev.value}>
                                {sev.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Read state filter */}
                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">Status:</label>
                    <select
                        value={filters.is_read === undefined ? '' : String(filters.is_read)}
                        onChange={(e) => {
                            const value = e.target.value
                            onFiltersChange({
                                ...filters,
                                is_read: value === '' ? undefined : value === 'true',
                            })
                        }}
                        className="text-sm border border-gray-300 rounded-md px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                    >
                        {readStates.map((state) => (
                            <option key={String(state.value)} value={String(state.value ?? '')}>
                                {state.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Clear filters button */}
                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <X size={14} />
                        Clear filters
                    </button>
                )}

                {/* Spacer */}
                <div className="flex-1" />

                {/* Mark all as read button */}
                {unreadCount > 0 && (
                    <button
                        onClick={onMarkAllAsRead}
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-violet-600 bg-violet-50 rounded-md hover:bg-violet-100 transition-colors"
                    >
                        <CheckCheck size={16} />
                        Mark all as read ({unreadCount})
                    </button>
                )}
            </div>
        </div>
    )
}
