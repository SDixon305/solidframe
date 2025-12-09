'use client'

import Link from 'next/link'
import {
    Zap,
    DollarSign,
    Mic,
    Globe,
    Search,
    Activity,
    CheckSquare,
    Video,
    Users,
    ChevronRight,
} from 'lucide-react'
import type { ToolWithVersion } from '@/types/tools'

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
    calculator: DollarSign,
    mic: Mic,
    scraper: Globe,
    star: Video,
    search: Search,
    chart: Activity,
    toggle: CheckSquare,
}

interface AdminToolCardProps {
    tool: ToolWithVersion
    tenantCount: number
}

export function AdminToolCard({ tool, tenantCount }: AdminToolCardProps) {
    const Icon = iconMap[tool.icon || ''] || Zap

    const currentVersion = tool.active_version?.version || 'No version'
    const hasStagingVersion = !!tool.staging_version

    return (
        <Link
            href={`/admin/tools/${tool.slug}`}
            className="group block bg-white border border-gray-200 rounded-xl p-5 hover:border-violet-300 hover:shadow-lg transition-all duration-200"
        >
            {/* Header Row */}
            <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 shadow-sm">
                    <Icon size={22} className="text-amber-400" />
                </div>

                <div className="flex items-center gap-2">
                    {/* Real vs Mockup Badge */}
                    <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            tool.is_real
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-50 text-slate-600 border border-slate-200'
                        }`}
                    >
                        {tool.is_real ? 'Real' : 'Mockup'}
                    </span>

                    {/* Staging indicator */}
                    {hasStagingVersion && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                            Staging
                        </span>
                    )}
                </div>
            </div>

            {/* Tool Name & Description */}
            <h3 className="text-base font-semibold text-gray-900 mb-1.5 group-hover:text-violet-600 transition-colors">
                {tool.name}
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">
                {tool.description}
            </p>

            {/* Stats Row */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-4">
                    {/* Version */}
                    <div className="text-xs">
                        <span className="text-gray-400">Version:</span>{' '}
                        <span className="font-medium text-gray-700">{currentVersion}</span>
                    </div>

                    {/* Tenant Count */}
                    <div className="flex items-center gap-1 text-xs">
                        <Users size={12} className="text-gray-400" />
                        <span className="font-medium text-gray-700">{tenantCount}</span>
                        <span className="text-gray-400">tenants</span>
                    </div>
                </div>

                <ChevronRight
                    size={16}
                    className="text-gray-300 group-hover:text-violet-500 group-hover:translate-x-1 transition-all"
                />
            </div>
        </Link>
    )
}
