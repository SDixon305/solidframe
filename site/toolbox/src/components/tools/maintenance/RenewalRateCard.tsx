'use client'

import React from 'react'
import { TrendingUp, RefreshCw, DollarSign, Users, Calendar, AlertTriangle } from 'lucide-react'

export interface RenewalMetrics {
    renewalRate: number
    totalContracts: number
    activeContracts: number
    expiringSoon: number
    totalAnnualValue: number
    renewedThisMonth: number
    renewedValue: number
    avgContractValue: number
}

interface RenewalRateCardProps {
    metrics: RenewalMetrics
    variant?: 'large' | 'compact'
}

export default function RenewalRateCard({ metrics, variant = 'large' }: RenewalRateCardProps) {
    if (variant === 'compact') {
        return (
            <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                    <div className="text-xs text-emerald-600 mb-1">Renewal Rate</div>
                    <div className="text-xl font-bold text-emerald-700">{metrics.renewalRate}%</div>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                    <div className="text-xs text-amber-600 mb-1">Expiring Soon</div>
                    <div className="text-xl font-bold text-amber-700">{metrics.expiringSoon}</div>
                </div>
            </div>
        )
    }

    // Calculate the ring progress
    const circumference = 2 * Math.PI * 45
    const progress = (metrics.renewalRate / 100) * circumference

    return (
        <div className="space-y-4">
            {/* Hero renewal rate */}
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-emerald-100 text-sm font-medium mb-2">Renewal Rate</div>
                        <div className="text-5xl font-bold mb-1">{metrics.renewalRate}%</div>
                        <div className="flex items-center gap-1 text-emerald-100">
                            <TrendingUp size={14} />
                            <span className="text-sm">+3% from last month</span>
                        </div>
                    </div>

                    {/* Circular progress */}
                    <div className="relative">
                        <svg width="100" height="100" className="transform -rotate-90">
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                stroke="rgba(255,255,255,0.2)"
                                strokeWidth="8"
                            />
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                stroke="white"
                                strokeWidth="8"
                                strokeDasharray={circumference}
                                strokeDashoffset={circumference - progress}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <RefreshCw size={24} className="text-white" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Secondary metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-500">Total Contracts</span>
                        <Users size={16} className="text-gray-400" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{metrics.totalContracts}</div>
                    <div className="text-xs text-gray-400 mt-1">{metrics.activeContracts} active</div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-500">Expiring Soon</span>
                        <AlertTriangle size={16} className="text-amber-500" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{metrics.expiringSoon}</div>
                    <div className="text-xs text-amber-500 mt-1">Next 30 days</div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-500">Annual Value</span>
                        <DollarSign size={16} className="text-emerald-500" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">${(metrics.totalAnnualValue / 1000).toFixed(0)}k</div>
                    <div className="text-xs text-gray-400 mt-1">recurring revenue</div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-500">Avg Contract</span>
                        <Calendar size={16} className="text-[#5f3bff]" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">${metrics.avgContractValue}</div>
                    <div className="text-xs text-gray-400 mt-1">per year</div>
                </div>
            </div>

            {/* This month stats */}
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-sm text-gray-500 mb-1">Renewed This Month</div>
                        <div className="text-xl font-bold text-gray-900">
                            {metrics.renewedThisMonth} contracts
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-gray-500 mb-1">Value Secured</div>
                        <div className="text-xl font-bold text-emerald-600">
                            ${metrics.renewedValue.toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Generate fake renewal metrics
export function generateRenewalMetrics(tenantId: string, contracts: { status: string; planValue: number }[]): RenewalMetrics {
    const seed = tenantId.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
    const seededRandom = (offset: number) => {
        const x = Math.sin(seed + offset) * 10000
        return x - Math.floor(x)
    }

    const totalContracts = contracts.length
    const activeContracts = contracts.filter(c => c.status === 'active' || c.status === 'expiring').length
    const expiringSoon = contracts.filter(c => c.status === 'expiring').length
    const totalAnnualValue = contracts.reduce((sum, c) => sum + c.planValue, 0)
    const avgContractValue = Math.round(totalAnnualValue / totalContracts)

    const renewedThisMonth = 3 + Math.floor(seededRandom(1) * 5)
    const renewedValue = renewedThisMonth * avgContractValue

    return {
        renewalRate: 87 + Math.floor(seededRandom(2) * 6),
        totalContracts,
        activeContracts,
        expiringSoon,
        totalAnnualValue,
        renewedThisMonth,
        renewedValue,
        avgContractValue,
    }
}
