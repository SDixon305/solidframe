'use client'

import Link from 'next/link'
import { ExternalLink, MoreHorizontal, Users, Wrench, Calendar, Building2 } from 'lucide-react'
import type { TenantWithStats, BusinessType } from '@/types/tenants'

interface ClientCardProps {
    client: TenantWithStats
    onMenuClick?: (client: TenantWithStats) => void
}

const businessTypeColors: Record<BusinessType | string, { bg: string; text: string }> = {
    hvac: { bg: 'bg-blue-500/10', text: 'text-blue-500' },
    plumbing: { bg: 'bg-cyan-500/10', text: 'text-cyan-500' },
    electrical: { bg: 'bg-yellow-500/10', text: 'text-yellow-500' },
    roofing: { bg: 'bg-orange-500/10', text: 'text-orange-500' },
    general: { bg: 'bg-slate-500/10', text: 'text-slate-400' },
    other: { bg: 'bg-purple-500/10', text: 'text-purple-500' },
}

const statusConfig: Record<string, { dot: string; label: string }> = {
    active: { dot: 'bg-emerald-500', label: 'Active' },
    pending: { dot: 'bg-amber-500', label: 'Pending' },
    suspended: { dot: 'bg-red-500', label: 'Suspended' },
    cancelled: { dot: 'bg-slate-500', label: 'Cancelled' },
}

function formatRelativeTime(date: string | null | undefined): string {
    if (!date) return '-'
    const now = new Date()
    const then = new Date(date)
    const diffMs = now.getTime() - then.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 30) return `${diffDays}d ago`
    return then.toLocaleDateString()
}

export function ClientCard({ client, onMenuClick }: ClientCardProps) {
    const businessType = client.business_type || 'general'
    const colors = businessTypeColors[businessType] || businessTypeColors.general
    const status = statusConfig[client.status] || statusConfig.pending

    return (
        <Link
            href={`/admin/clients/${client.id}`}
            className="group block p-5 bg-white border border-gray-200 hover:border-violet-300 rounded-xl transition-all hover:shadow-md"
        >
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                    {/* Logo/Avatar */}
                    {client.logo_url ? (
                        <img
                            src={client.logo_url}
                            alt={client.name}
                            className="w-12 h-12 rounded-xl object-cover"
                        />
                    ) : (
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${colors.bg} ${colors.text}`}>
                            {client.name.charAt(0).toUpperCase()}
                        </div>
                    )}

                    {/* Name & Subdomain */}
                    <div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-violet-600 transition-colors">
                            {client.name}
                        </h3>
                        <div className="flex items-center gap-1.5 text-sm text-gray-500 font-mono">
                            <span>{client.slug}.toolbox.solidframe.ai</span>
                            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </div>
                </div>

                {/* Menu Button */}
                <button
                    onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        onMenuClick?.(client)
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors opacity-0 group-hover:opacity-100"
                >
                    <MoreHorizontal className="w-5 h-5" />
                </button>
            </div>

            {/* Stats Row */}
            <div className="mt-4 flex items-center gap-6 text-sm text-gray-500">
                {/* Business Type */}
                <div className="flex items-center gap-1.5">
                    <Building2 className={`w-4 h-4 ${colors.text}`} />
                    <span className="capitalize">{businessType}</span>
                </div>

                {/* Active Tools */}
                <div className="flex items-center gap-1.5">
                    <Wrench className="w-4 h-4" />
                    <span>{client.active_tool_count || 0} tools</span>
                </div>

                {/* Users */}
                <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    <span>{client.user_count || 0} users</span>
                </div>

                {/* Last Activity */}
                <div className="flex items-center gap-1.5 ml-auto">
                    <Calendar className="w-4 h-4" />
                    <span>{formatRelativeTime(client.last_activity || client.updated_at)}</span>
                </div>
            </div>

            {/* Status Badge */}
            <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${status.dot} ${client.status === 'active' ? 'animate-pulse' : ''}`} />
                    <span className="text-sm font-medium text-gray-600">{status.label}</span>
                </div>

                {client.owner_email && (
                    <span className="text-xs text-gray-400">{client.owner_email}</span>
                )}
            </div>
        </Link>
    )
}
