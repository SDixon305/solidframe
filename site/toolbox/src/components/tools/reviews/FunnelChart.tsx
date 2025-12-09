'use client'

import React from 'react'
import { Send, MousePointer, Star, ArrowRight } from 'lucide-react'

interface FunnelChartProps {
    sent: number
    clicked: number
    reviewed: number
}

export default function FunnelChart({ sent, clicked, reviewed }: FunnelChartProps) {
    const clickRate = sent > 0 ? Math.round((clicked / sent) * 100) : 0
    const reviewRate = clicked > 0 ? Math.round((reviewed / clicked) * 100) : 0
    const overallRate = sent > 0 ? Math.round((reviewed / sent) * 100) : 0

    const stages = [
        {
            icon: Send,
            label: 'Sent',
            value: sent,
            color: 'bg-blue-500',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-600',
        },
        {
            icon: MousePointer,
            label: 'Clicked',
            value: clicked,
            color: 'bg-amber-500',
            bgColor: 'bg-amber-50',
            textColor: 'text-amber-600',
            rate: clickRate,
        },
        {
            icon: Star,
            label: 'Reviewed',
            value: reviewed,
            color: 'bg-emerald-500',
            bgColor: 'bg-emerald-50',
            textColor: 'text-emerald-600',
            rate: reviewRate,
        },
    ]

    const maxValue = Math.max(...stages.map(s => s.value))

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-900">Review Funnel</h3>
                <span className="text-sm text-gray-500">Last 30 days</span>
            </div>

            {/* Funnel Visualization */}
            <div className="space-y-4">
                {stages.map((stage, index) => {
                    const Icon = stage.icon
                    const widthPercentage = maxValue > 0 ? (stage.value / maxValue) * 100 : 0

                    return (
                        <div key={stage.label}>
                            <div className="flex items-center gap-3 mb-2">
                                <div className={`p-2 rounded-lg ${stage.bgColor}`}>
                                    <Icon size={16} className={stage.textColor} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-gray-900">{stage.label}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg font-bold text-gray-900">
                                                {stage.value.toLocaleString()}
                                            </span>
                                            {stage.rate !== undefined && (
                                                <span className="text-xs text-gray-400">
                                                    ({stage.rate}%)
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="ml-11 h-3 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${stage.color} rounded-full transition-all duration-700`}
                                    style={{ width: `${widthPercentage}%` }}
                                />
                            </div>
                            {index < stages.length - 1 && (
                                <div className="ml-11 flex items-center gap-1 mt-2 mb-2 text-gray-400">
                                    <ArrowRight size={12} />
                                    <span className="text-xs">
                                        {stages[index + 1].rate}% conversion
                                    </span>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Overall Conversion */}
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-sm text-gray-500">Overall conversion rate</span>
                <span className="text-lg font-bold text-[#5f3bff]">{overallRate}%</span>
            </div>
        </div>
    )
}
