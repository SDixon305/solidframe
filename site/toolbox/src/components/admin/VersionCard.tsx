'use client'

import { useState } from 'react'
import {
    GitBranch,
    Clock,
    Edit2,
    Rocket,
    RotateCcw,
    ChevronDown,
    ChevronUp,
    CheckCircle2,
    Circle,
    AlertCircle,
    Archive,
} from 'lucide-react'
import type { DbToolVersion, ToolVersionStatus } from '@/types/tools'

// Status badge configuration
const statusConfig: Record<ToolVersionStatus, {
    label: string
    className: string
    icon: React.ComponentType<{ size?: number; className?: string }>
}> = {
    draft: {
        label: 'Draft',
        className: 'bg-gray-50 text-gray-600 border-gray-200',
        icon: Circle,
    },
    staging: {
        label: 'Staging',
        className: 'bg-amber-50 text-amber-700 border-amber-200',
        icon: AlertCircle,
    },
    production: {
        label: 'Production',
        className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        icon: CheckCircle2,
    },
    deprecated: {
        label: 'Deprecated',
        className: 'bg-red-50 text-red-600 border-red-200',
        icon: Archive,
    },
}

interface VersionCardProps {
    version: DbToolVersion
    isLatest?: boolean
    onEdit?: (version: DbToolVersion) => void
    onDeployToStaging?: (version: DbToolVersion) => void
    onDeployToProduction?: (version: DbToolVersion) => void
    onRollback?: (version: DbToolVersion) => void
    onUpdateRollout?: (version: DbToolVersion, pct: number) => void
}

export function VersionCard({
    version,
    isLatest = false,
    onEdit,
    onDeployToStaging,
    onDeployToProduction,
    onRollback,
    onUpdateRollout,
}: VersionCardProps) {
    const [expanded, setExpanded] = useState(false)

    const status = statusConfig[version.status]
    const StatusIcon = status.icon

    const formattedDate = new Date(version.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    })

    // Determine available actions based on status
    const canDeployToStaging = version.status === 'draft'
    const canDeployToProduction = version.status === 'staging'
    const canRollback = version.status === 'production'
    const canEdit = version.status === 'draft' || version.status === 'staging'
    const showRollout = version.status === 'production' && version.rollout_pct < 100

    return (
        <div className={`bg-white border rounded-xl overflow-hidden transition-all ${
            version.status === 'production'
                ? 'border-emerald-200 ring-1 ring-emerald-100'
                : 'border-gray-200'
        }`}>
            {/* Main Row */}
            <div
                className="p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpanded(!expanded)}
            >
                {/* Version number */}
                <div className="flex items-center gap-2 min-w-[100px]">
                    <GitBranch size={16} className="text-gray-400" />
                    <span className="font-mono font-semibold text-gray-900">
                        v{version.version}
                    </span>
                    {isLatest && (
                        <span className="px-1.5 py-0.5 text-[10px] font-medium bg-violet-100 text-violet-600 rounded">
                            Latest
                        </span>
                    )}
                </div>

                {/* Status badge */}
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${status.className}`}>
                    <StatusIcon size={12} />
                    {status.label}
                </div>

                {/* Rollout percentage (if production) */}
                {version.status === 'production' && (
                    <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-emerald-500 transition-all duration-300"
                                style={{ width: `${version.rollout_pct}%` }}
                            />
                        </div>
                        <span className="text-xs font-medium text-gray-600">
                            {version.rollout_pct}%
                        </span>
                    </div>
                )}

                {/* Created date */}
                <div className="flex items-center gap-1.5 text-xs text-gray-500 ml-auto">
                    <Clock size={12} />
                    {formattedDate}
                </div>

                {/* Expand/collapse */}
                <div className="p-1 text-gray-400">
                    {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
            </div>

            {/* Expanded Content */}
            {expanded && (
                <div className="border-t border-gray-100 p-4 bg-gray-50/50">
                    {/* Changelog */}
                    {version.changelog && (
                        <div className="mb-4">
                            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
                                Changelog
                            </h4>
                            <p className="text-sm text-gray-700">{version.changelog}</p>
                        </div>
                    )}

                    {/* Config Schema Preview */}
                    {version.config_schema && (
                        <div className="mb-4">
                            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
                                Default Configuration
                            </h4>
                            <pre className="text-xs text-gray-600 bg-white border border-gray-200 rounded-lg p-3 overflow-x-auto">
                                {JSON.stringify(
                                    (version.config_schema as { default?: unknown }).default || {},
                                    null,
                                    2
                                )}
                            </pre>
                        </div>
                    )}

                    {/* Rollout Slider (for production with partial rollout) */}
                    {showRollout && onUpdateRollout && (
                        <div className="mb-4">
                            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                                Rollout Percentage
                            </h4>
                            <div className="flex items-center gap-4">
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={version.rollout_pct}
                                    onChange={(e) => onUpdateRollout(version, parseInt(e.target.value))}
                                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                />
                                <span className="text-sm font-medium text-gray-700 w-12 text-right">
                                    {version.rollout_pct}%
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-2">
                        {canEdit && onEdit && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onEdit(version)
                                }}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <Edit2 size={12} />
                                Edit Config
                            </button>
                        )}

                        {canDeployToStaging && onDeployToStaging && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onDeployToStaging(version)
                                }}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors"
                            >
                                <Rocket size={12} />
                                Deploy to Staging
                            </button>
                        )}

                        {canDeployToProduction && onDeployToProduction && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onDeployToProduction(version)
                                }}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
                            >
                                <Rocket size={12} />
                                Deploy to Production
                            </button>
                        )}

                        {canRollback && onRollback && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onRollback(version)
                                }}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                            >
                                <RotateCcw size={12} />
                                Rollback
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

// Status Badge component for use elsewhere
export function VersionStatusBadge({ status }: { status: ToolVersionStatus }) {
    const config = statusConfig[status]
    const Icon = config.icon

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.className}`}>
            <Icon size={12} />
            {config.label}
        </span>
    )
}
