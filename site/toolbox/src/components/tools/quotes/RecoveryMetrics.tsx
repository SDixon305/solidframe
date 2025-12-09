'use client'

import React from 'react'
import { TrendingUp, DollarSign, Target, BarChart3, ArrowUpRight } from 'lucide-react'

export interface QuoteMetrics {
    recovered: number
    conversionRate: number
    avgQuoteValue: number
    totalOutstanding: number
    outstandingValue: number
    thisMonthRecovered: number
    lastMonthRecovered: number
}

interface RecoveryMetricsProps {
    metrics: QuoteMetrics
    compact?: boolean
}

export default function RecoveryMetrics({ metrics, compact = false }: RecoveryMetricsProps) {
    const monthOverMonth = metrics.lastMonthRecovered > 0
        ? Math.round(((metrics.thisMonthRecovered - metrics.lastMonthRecovered) / metrics.lastMonthRecovered) * 100)
        : 0

    if (compact) {
        return (
            <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                    <div className="text-xs text-emerald-600 mb-1">Recovered This Month</div>
                    <div className="text-xl font-bold text-emerald-700">
                        ${metrics.thisMonthRecovered.toLocaleString()}
                    </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="text-xs text-gray-500 mb-1">Conversion Rate</div>
                    <div className="text-xl font-bold text-gray-900">{metrics.conversionRate}%</div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {/* Hero metric */}
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="text-emerald-100 text-sm font-medium mb-2">Revenue Recovered This Month</div>
                        <div className="text-4xl font-bold mb-1">
                            ${metrics.thisMonthRecovered.toLocaleString()}
                        </div>
                        {monthOverMonth !== 0 && (
                            <div className="flex items-center gap-1 text-emerald-100">
                                <ArrowUpRight size={14} className={monthOverMonth < 0 ? 'rotate-90' : ''} />
                                <span className="text-sm">
                                    {monthOverMonth > 0 ? '+' : ''}{monthOverMonth}% vs last month
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="p-3 bg-white/20 rounded-xl">
                        <DollarSign size={28} className="text-white" />
                    </div>
                </div>
            </div>

            {/* Secondary metrics */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-500">Conversion Rate</span>
                        <Target size={16} className="text-[#5f3bff]" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{metrics.conversionRate}%</div>
                    <div className="text-xs text-gray-400 mt-1">quotes recovered</div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-500">Avg Quote Value</span>
                        <BarChart3 size={16} className="text-gray-400" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                        ${metrics.avgQuoteValue.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">per quote</div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-500">Outstanding</span>
                        <TrendingUp size={16} className="text-amber-500" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                        ${metrics.outstandingValue.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{metrics.totalOutstanding} quotes</div>
                </div>
            </div>

            {/* All-time recovered */}
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-sm text-gray-500 mb-1">Total Recovered (All Time)</div>
                        <div className="text-xl font-bold text-gray-900">
                            ${metrics.recovered.toLocaleString()}
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-gray-500 mb-1">Last Month</div>
                        <div className="text-xl font-bold text-gray-700">
                            ${metrics.lastMonthRecovered.toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Generate fake metrics based on tenant age
export function generateQuoteMetrics(tenantCreatedAt: Date, tenantId: string): QuoteMetrics {
    const now = new Date()
    const daysSinceCreation = Math.ceil((now.getTime() - tenantCreatedAt.getTime()) / (1000 * 60 * 60 * 24))

    // Seeded random for consistent results
    const seed = tenantId.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
    const seededRandom = (offset: number = 0) => {
        const x = Math.sin(seed + offset) * 10000
        return x - Math.floor(x)
    }

    const baseRecovery = daysSinceCreation * 150
    const thisMonthRecovered = 8200 + Math.floor(seededRandom(1) * 3000)
    const lastMonthRecovered = 6800 + Math.floor(seededRandom(2) * 2500)

    return {
        recovered: baseRecovery + Math.floor(seededRandom(3) * baseRecovery * 0.3),
        conversionRate: 17 + Math.floor(seededRandom(4) * 8),
        avgQuoteValue: 1650 + Math.floor(seededRandom(5) * 400),
        totalOutstanding: 25 + Math.floor(seededRandom(6) * 15),
        outstandingValue: 42000 + Math.floor(seededRandom(7) * 15000),
        thisMonthRecovered,
        lastMonthRecovered,
    }
}
