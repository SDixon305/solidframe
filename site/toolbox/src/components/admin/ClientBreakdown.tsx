'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ChevronUp, ChevronDown, Building2 } from 'lucide-react'
import type { ClientUsageRow } from '@/lib/analytics'

interface ClientBreakdownProps {
    data: ClientUsageRow[]
    loading?: boolean
}

type SortKey = 'name' | 'calls' | 'sms' | 'appointments' | 'lastActive'
type SortDirection = 'asc' | 'desc'

const statusStyles = {
    active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    suspended: 'bg-red-50 text-red-700 border-red-200',
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
}

export function ClientBreakdown({ data, loading }: ClientBreakdownProps) {
    const [sortKey, setSortKey] = useState<SortKey>('calls')
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
        } else {
            setSortKey(key)
            setSortDirection('desc')
        }
    }

    const sortedData = useMemo(() => {
        return [...data].sort((a, b) => {
            let comparison = 0
            switch (sortKey) {
                case 'name':
                    comparison = a.name.localeCompare(b.name)
                    break
                case 'calls':
                    comparison = a.calls - b.calls
                    break
                case 'sms':
                    comparison = a.sms - b.sms
                    break
                case 'appointments':
                    comparison = a.appointments - b.appointments
                    break
                case 'lastActive':
                    comparison = new Date(a.lastActive).getTime() - new Date(b.lastActive).getTime()
                    break
            }
            return sortDirection === 'asc' ? comparison : -comparison
        })
    }, [data, sortKey, sortDirection])

    const SortHeader = ({ label, sortKeyValue }: { label: string; sortKeyValue: SortKey }) => (
        <th
            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
            onClick={() => handleSort(sortKeyValue)}
        >
            <div className="flex items-center gap-1">
                {label}
                <span className="text-gray-400">
                    {sortKey === sortKeyValue ? (
                        sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    ) : (
                        <ChevronDown size={14} className="opacity-30" />
                    )}
                </span>
            </div>
        </th>
    )

    if (loading) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                    <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="p-4 space-y-3">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
                    ))}
                </div>
            </div>
        )
    }

    if (!data || data.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Client Breakdown</h3>
                <div className="h-[200px] flex flex-col items-center justify-center text-gray-500">
                    <Building2 size={40} className="text-gray-300 mb-2" />
                    <p>No clients yet</p>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Client Breakdown</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <SortHeader label="Client" sortKeyValue="name" />
                            <SortHeader label="Calls" sortKeyValue="calls" />
                            <SortHeader label="SMS" sortKeyValue="sms" />
                            <SortHeader label="Appts" sortKeyValue="appointments" />
                            <SortHeader label="Last Active" sortKeyValue="lastActive" />
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {sortedData.map((client) => (
                            <tr
                                key={client.id}
                                className="hover:bg-gray-50 transition-colors"
                            >
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <Link
                                        href={`/admin/clients/${client.id}`}
                                        className="text-sm font-medium text-gray-900 hover:text-indigo-600"
                                    >
                                        {client.name}
                                    </Link>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                    {client.calls.toLocaleString()}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                    {client.sms.toLocaleString()}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                    {client.appointments.toLocaleString()}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                    {formatLastActive(client.lastActive)}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${statusStyles[client.status]}`}>
                                        {client.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

function formatLastActive(dateStr: string): string {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
