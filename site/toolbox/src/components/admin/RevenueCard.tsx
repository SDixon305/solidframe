'use client'

import { TrendingUp, TrendingDown, CreditCard, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import type { RevenueData } from '@/lib/analytics'

interface RevenueCardProps {
    data: RevenueData | null
    loading?: boolean
}

const statusIcons = {
    succeeded: CheckCircle,
    pending: Clock,
    failed: AlertCircle,
}

const statusStyles = {
    succeeded: 'text-emerald-500',
    pending: 'text-amber-500',
    failed: 'text-red-500',
}

export function RevenueCard({ data, loading }: RevenueCardProps) {
    if (loading) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="h-6 w-24 bg-gray-200 rounded animate-pulse mb-4" />
                <div className="h-10 w-32 bg-gray-200 rounded animate-pulse mb-4" />
                <div className="space-y-3">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
                    ))}
                </div>
            </div>
        )
    }

    if (!data) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue</h3>
                <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                    <CreditCard size={40} className="text-gray-300 mb-2" />
                    <p className="text-sm">Stripe not connected</p>
                    <p className="text-xs text-gray-400 mt-1">Connect Stripe to track revenue</p>
                </div>
            </div>
        )
    }

    const TrendIcon = data.mrrTrend >= 0 ? TrendingUp : TrendingDown
    const trendColor = data.mrrTrend >= 0 ? 'text-emerald-600' : 'text-red-600'

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue</h3>

            {/* MRR Display */}
            <div className="mb-6">
                <p className="text-sm text-gray-500 mb-1">Monthly Recurring Revenue</p>
                <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-gray-900">
                        ${data.mrr.toLocaleString()}
                    </span>
                    <span className={`flex items-center gap-1 text-sm font-medium ${trendColor}`}>
                        <TrendIcon size={16} />
                        {data.mrrTrend >= 0 ? '+' : ''}{data.mrrTrend}%
                    </span>
                </div>
            </div>

            {/* Recent Payments */}
            <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Recent Payments</p>
                {data.recentPayments.length === 0 ? (
                    <p className="text-sm text-gray-500">No recent payments</p>
                ) : (
                    <div className="space-y-2">
                        {data.recentPayments.slice(0, 5).map((payment) => {
                            const StatusIcon = statusIcons[payment.status]
                            return (
                                <div
                                    key={payment.id}
                                    className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                                >
                                    <div className="flex items-center gap-2 min-w-0">
                                        <StatusIcon
                                            size={16}
                                            className={statusStyles[payment.status]}
                                        />
                                        <span className="text-sm text-gray-900 truncate">
                                            {payment.clientName}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 flex-shrink-0">
                                        <span className="text-sm font-medium text-gray-900">
                                            ${payment.amount}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {formatPaymentDate(payment.date)}
                                        </span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

function formatPaymentDate(dateStr: string): string {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
