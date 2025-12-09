'use client'

import { use } from 'react'
import Link from 'next/link'
import {
    ArrowLeft,
    Zap,
    DollarSign,
    Mic,
    Globe,
    Search,
    Activity,
    CheckSquare,
    Video,
    Users,
    Phone,
    GitBranch,
    Settings,
    ExternalLink,
} from 'lucide-react'
import { getMockTool, getMockVersions, getMockTenantCount } from '@/lib/mock-data/tools'
import { VersionStatusBadge } from '@/components/admin/VersionCard'

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

export default function ToolDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = use(params)
    const tool = getMockTool(slug)

    if (!tool) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <h2 className="text-lg font-semibold text-gray-900">Tool not found</h2>
                    <p className="text-sm text-gray-500 mt-1">The tool &quot;{slug}&quot; does not exist</p>
                    <Link
                        href="/admin/tools"
                        className="inline-flex items-center gap-2 mt-4 text-sm text-violet-600 hover:text-violet-700"
                    >
                        <ArrowLeft size={14} />
                        Back to tools
                    </Link>
                </div>
            </div>
        )
    }

    const versions = getMockVersions(tool.id)
    const tenantCount = getMockTenantCount(tool.id)
    const Icon = iconMap[tool.icon || ''] || Zap

    // Calculate stats
    const productionVersion = versions.find(v => v.status === 'production')
    const stagingVersion = versions.find(v => v.status === 'staging')
    const draftVersions = versions.filter(v => v.status === 'draft')

    // Mock call stats
    const mockStats = {
        totalCalls: 1847,
        totalActions: 523,
        avgResponseTime: '1.2s',
    }

    return (
        <div className="space-y-6">
            {/* Back button */}
            <Link
                href="/admin/tools"
                className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
                <ArrowLeft size={14} />
                Back to tools
            </Link>

            {/* Tool Header */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-start gap-5">
                    {/* Icon */}
                    <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 shadow-lg">
                        <Icon size={28} className="text-amber-400" />
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-2xl font-semibold text-gray-900">{tool.name}</h1>
                            <span
                                className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                    tool.is_real
                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                        : 'bg-slate-50 text-slate-600 border border-slate-200'
                                }`}
                            >
                                {tool.is_real ? 'Real' : 'Mockup'}
                            </span>
                            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-violet-50 text-violet-700 border border-violet-200 capitalize">
                                {tool.category}
                            </span>
                        </div>

                        <p className="text-sm text-gray-600 mb-4">
                            {tool.description}
                        </p>

                        {/* Quick Stats */}
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 text-sm">
                                <GitBranch size={14} className="text-gray-400" />
                                <span className="text-gray-500">Production:</span>
                                {productionVersion ? (
                                    <span className="font-medium text-emerald-600">v{productionVersion.version}</span>
                                ) : (
                                    <span className="text-gray-400">None</span>
                                )}
                            </div>

                            <div className="flex items-center gap-2 text-sm">
                                <Users size={14} className="text-gray-400" />
                                <span className="font-medium text-gray-900">{tenantCount}</span>
                                <span className="text-gray-500">tenants using</span>
                            </div>

                            <div className="flex items-center gap-2 text-sm">
                                <Phone size={14} className="text-gray-400" />
                                <span className="font-medium text-gray-900">{mockStats.totalCalls.toLocaleString()}</span>
                                <span className="text-gray-500">total calls</span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        <Link
                            href={`/admin/tools/${slug}/versions`}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors"
                        >
                            <Settings size={16} />
                            Manage Versions
                        </Link>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total Versions</div>
                    <div className="text-2xl font-semibold text-gray-900">{versions.length}</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total Calls</div>
                    <div className="text-2xl font-semibold text-gray-900">{mockStats.totalCalls.toLocaleString()}</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total Actions</div>
                    <div className="text-2xl font-semibold text-gray-900">{mockStats.totalActions.toLocaleString()}</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Avg Response</div>
                    <div className="text-2xl font-semibold text-gray-900">{mockStats.avgResponseTime}</div>
                </div>
            </div>

            {/* Version Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Production Version */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-base font-semibold text-gray-900">Production Version</h2>
                        {productionVersion && <VersionStatusBadge status="production" />}
                    </div>
                    <div className="p-5">
                        {productionVersion ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="font-mono text-lg font-semibold text-gray-900">
                                        v{productionVersion.version}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        {productionVersion.rollout_pct}% rollout
                                    </span>
                                </div>

                                {/* Rollout Progress */}
                                <div>
                                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                                        <span>Rollout Progress</span>
                                        <span>{productionVersion.rollout_pct}%</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-emerald-500 transition-all"
                                            style={{ width: `${productionVersion.rollout_pct}%` }}
                                        />
                                    </div>
                                </div>

                                {productionVersion.changelog && (
                                    <div>
                                        <div className="text-xs text-gray-500 mb-1">Changelog</div>
                                        <p className="text-sm text-gray-700">{productionVersion.changelog}</p>
                                    </div>
                                )}

                                <Link
                                    href={`/admin/tools/${slug}/versions`}
                                    className="inline-flex items-center gap-1.5 text-sm text-violet-600 hover:text-violet-700"
                                >
                                    View all versions
                                    <ExternalLink size={12} />
                                </Link>
                            </div>
                        ) : (
                            <div className="text-center py-6">
                                <div className="text-sm text-gray-500">No production version deployed</div>
                                <Link
                                    href={`/admin/tools/${slug}/versions`}
                                    className="inline-flex items-center gap-1.5 mt-2 text-sm text-violet-600 hover:text-violet-700"
                                >
                                    Deploy a version
                                    <ExternalLink size={12} />
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Staging & Draft Status */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100">
                        <h2 className="text-base font-semibold text-gray-900">Development Pipeline</h2>
                    </div>
                    <div className="p-5 space-y-4">
                        {/* Staging */}
                        <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg">
                            <div className="flex items-center gap-3">
                                <VersionStatusBadge status="staging" />
                                {stagingVersion ? (
                                    <span className="font-mono text-sm font-medium text-amber-900">
                                        v{stagingVersion.version}
                                    </span>
                                ) : (
                                    <span className="text-sm text-amber-700">No staging version</span>
                                )}
                            </div>
                            {stagingVersion && (
                                <span className="text-xs text-amber-600">Ready to deploy</span>
                            )}
                        </div>

                        {/* Draft */}
                        <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                            <div className="flex items-center gap-3">
                                <VersionStatusBadge status="draft" />
                                <span className="text-sm text-gray-700">
                                    {draftVersions.length} draft{draftVersions.length !== 1 ? 's' : ''}
                                </span>
                            </div>
                            {draftVersions.length > 0 && (
                                <span className="font-mono text-xs text-gray-500">
                                    Latest: v{draftVersions[draftVersions.length - 1].version}
                                </span>
                            )}
                        </div>

                        <Link
                            href={`/admin/tools/${slug}/versions`}
                            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-medium text-violet-600 bg-violet-50 rounded-lg hover:bg-violet-100 transition-colors"
                        >
                            <Settings size={16} />
                            Manage Versions
                        </Link>
                    </div>
                </div>
            </div>

            {/* Tool Configuration Info */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                    <h2 className="text-base font-semibold text-gray-900">Tool Information</h2>
                </div>
                <div className="p-5">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Slug</div>
                            <div className="font-mono text-sm text-gray-900">{tool.slug}</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Category</div>
                            <div className="text-sm text-gray-900 capitalize">{tool.category}</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Type</div>
                            <div className="text-sm text-gray-900">{tool.is_real ? 'Real (functional)' : 'Mockup (demo)'}</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Created</div>
                            <div className="text-sm text-gray-900">
                                {new Date(tool.created_at).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
