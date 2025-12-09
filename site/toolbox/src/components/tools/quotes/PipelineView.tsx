'use client'

import React from 'react'
import { FileText, Clock, Send, CheckCircle, ChevronRight } from 'lucide-react'

export interface PipelineStage {
    id: string
    label: string
    count: number
    value: number
    color: string
}

interface PipelineViewProps {
    stages: PipelineStage[]
    variant?: 'horizontal' | 'vertical'
}

export default function PipelineView({ stages, variant = 'horizontal' }: PipelineViewProps) {
    const totalQuotes = stages.reduce((sum, s) => sum + s.count, 0)
    const totalValue = stages.reduce((sum, s) => sum + s.value, 0)

    if (variant === 'vertical') {
        return (
            <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Quote Pipeline</h3>
                <div className="space-y-3">
                    {stages.map((stage, index) => {
                        const percentage = totalQuotes > 0 ? (stage.count / totalQuotes) * 100 : 0
                        return (
                            <div key={stage.id} className="relative">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-medium text-gray-700">{stage.label}</span>
                                    <span className="text-sm text-gray-500">{stage.count} quotes</span>
                                </div>
                                <div className="h-8 bg-gray-100 rounded-lg overflow-hidden">
                                    <div
                                        className={`h-full ${stage.color} flex items-center px-3 transition-all duration-500`}
                                        style={{ width: `${Math.max(percentage, 5)}%` }}
                                    >
                                        <span className="text-xs font-medium text-white">
                                            ${stage.value.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Total Pipeline Value</span>
                        <span className="text-lg font-bold text-gray-900">${totalValue.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        )
    }

    // Horizontal funnel view
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-6">Quote Pipeline</h3>

            <div className="flex items-stretch gap-2">
                {stages.map((stage, index) => {
                    const Icon = index === 0 ? FileText : index === 1 ? Send : index === 2 ? Clock : CheckCircle
                    const isLast = index === stages.length - 1

                    return (
                        <React.Fragment key={stage.id}>
                            <div className="flex-1 min-w-0">
                                <div
                                    className={`relative p-4 rounded-xl ${stage.color.replace('bg-', 'bg-opacity-10 bg-')}`}
                                    style={{ backgroundColor: `${stage.color.includes('emerald') ? '#d1fae5' : stage.color.includes('amber') ? '#fef3c7' : stage.color.includes('blue') ? '#dbeafe' : '#f3f4f6'}` }}
                                >
                                    <div className={`p-2 rounded-lg ${stage.color} w-fit mb-3`}>
                                        <Icon size={18} className="text-white" />
                                    </div>
                                    <div className="text-2xl font-bold text-gray-900 mb-1">
                                        {stage.count}
                                    </div>
                                    <div className="text-sm font-medium text-gray-600 mb-2">
                                        {stage.label}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        ${stage.value.toLocaleString()}
                                    </div>
                                </div>
                            </div>
                            {!isLast && (
                                <div className="flex items-center">
                                    <ChevronRight size={24} className="text-gray-300" />
                                </div>
                            )}
                        </React.Fragment>
                    )
                })}
            </div>

            {/* Conversion rates */}
            <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                        {stages.slice(0, -1).map((stage, index) => {
                            const nextStage = stages[index + 1]
                            const conversionRate = stage.count > 0
                                ? Math.round((nextStage.count / stage.count) * 100)
                                : 0
                            return (
                                <div key={`conv-${stage.id}`} className="flex items-center gap-1">
                                    <span className="text-gray-400">{stage.label} → {nextStage.label}:</span>
                                    <span className="font-medium text-gray-700">{conversionRate}%</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

// Compact version for overview
interface CompactPipelineProps {
    stages: PipelineStage[]
}

export function CompactPipeline({ stages }: CompactPipelineProps) {
    const totalQuotes = stages.reduce((sum, s) => sum + s.count, 0)

    return (
        <div className="flex items-center gap-1 h-4">
            {stages.map((stage) => {
                const percentage = totalQuotes > 0 ? (stage.count / totalQuotes) * 100 : 0
                return (
                    <div
                        key={stage.id}
                        className={`h-full rounded-sm ${stage.color} transition-all`}
                        style={{ width: `${Math.max(percentage, 5)}%` }}
                        title={`${stage.label}: ${stage.count} quotes ($${stage.value.toLocaleString()})`}
                    />
                )
            })}
        </div>
    )
}

// Default pipeline data generator
export function generatePipelineData(tenantId: string): PipelineStage[] {
    // Seeded random for consistent results
    const seed = tenantId.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
    const random = () => {
        const x = Math.sin(seed + Math.random() * 1000) * 10000
        return x - Math.floor(x)
    }

    const outstandingCount = 25 + Math.floor(random() * 10)
    const outstandingValue = outstandingCount * (1200 + Math.floor(random() * 600))

    const followedUpCount = Math.floor(outstandingCount * 0.6)
    const followedUpValue = Math.floor(outstandingValue * 0.6)

    const pendingCount = Math.floor(followedUpCount * 0.5)
    const pendingValue = Math.floor(followedUpValue * 0.5)

    const wonCount = Math.floor(pendingCount * 0.4)
    const wonValue = Math.floor(pendingValue * 0.38)

    return [
        { id: 'outstanding', label: 'Outstanding', count: outstandingCount, value: outstandingValue, color: 'bg-gray-400' },
        { id: 'followed-up', label: 'Followed Up', count: followedUpCount, value: followedUpValue, color: 'bg-blue-500' },
        { id: 'pending', label: 'Pending Decision', count: pendingCount, value: pendingValue, color: 'bg-amber-500' },
        { id: 'won', label: 'Won', count: wonCount, value: wonValue, color: 'bg-emerald-500' },
    ]
}
