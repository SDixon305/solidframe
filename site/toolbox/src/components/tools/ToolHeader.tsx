'use client'

import React from 'react'
import {
    Phone,
    MessageCircle,
    Star,
    Calendar,
    DollarSign,
    Megaphone,
    RefreshCw,
    GraduationCap,
    TrendingUp,
    TrendingDown,
    Minus,
} from 'lucide-react'
import { ToolSlug, ToolMetrics } from '@/lib/fake-data'

const TOOL_ICON_MAP: Record<ToolSlug, React.ElementType> = {
    'after-hours-agent': Phone,
    'missed-call-textback': MessageCircle,
    'review-request': Star,
    'appointment-reminders': Calendar,
    'quote-reviver': DollarSign,
    'seasonal-campaigns': Megaphone,
    'maintenance-renewal': RefreshCw,
    'tech-training': GraduationCap,
}

interface ToolHeaderProps {
    slug: ToolSlug
    name: string
    description?: string
    metrics?: ToolMetrics
    isReal?: boolean
    rightContent?: React.ReactNode
}

export default function ToolHeader({
    slug,
    name,
    description,
    metrics,
    isReal = false,
    rightContent,
}: ToolHeaderProps) {
    const Icon = TOOL_ICON_MAP[slug]

    const TrendIcon = metrics?.primary.trend === 'up'
        ? TrendingUp
        : metrics?.primary.trend === 'down'
            ? TrendingDown
            : Minus

    const trendColor = metrics?.primary.trend === 'up'
        ? 'text-emerald-600'
        : metrics?.primary.trend === 'down'
            ? 'text-red-500'
            : 'text-gray-400'

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="p-3 rounded-xl bg-gradient-to-br from-[#5f3bff] to-[#4f2fe0] shadow-lg shadow-[#5f3bff]/20">
                        <Icon size={28} className="text-white" />
                    </div>

                    {/* Title & Description */}
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-xl font-bold text-gray-900">
                                {name}
                            </h1>
                            {isReal ? (
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
                                    Live
                                </span>
                            ) : (
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-200">
                                    Demo
                                </span>
                            )}
                        </div>
                        {description && (
                            <p className="text-sm text-gray-500">{description}</p>
                        )}
                    </div>
                </div>

                {/* Metric or Right Content */}
                {rightContent ? (
                    rightContent
                ) : metrics && (
                    <div className="text-right">
                        <div className="text-xs text-gray-400 mb-0.5">
                            {metrics.primary.label}
                        </div>
                        <div className="flex items-center gap-2 justify-end">
                            <span className="text-2xl font-bold text-gray-900">
                                {metrics.primary.value}
                            </span>
                            {metrics.primary.trend && (
                                <span className={`flex items-center gap-0.5 text-sm ${trendColor}`}>
                                    <TrendIcon size={14} />
                                    {metrics.primary.trendValue}
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
