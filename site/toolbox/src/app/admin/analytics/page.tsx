'use client'

import { useEffect, useState, useCallback } from 'react'
import { Users, DollarSign, Activity, Wrench } from 'lucide-react'
import { MetricCard } from '@/components/admin/MetricCard'
import { UsageChart } from '@/components/admin/UsageChart'
import { ClientBreakdown } from '@/components/admin/ClientBreakdown'
import { ToolUsageChart } from '@/components/admin/ToolUsageChart'
import { RevenueCard } from '@/components/admin/RevenueCard'
import { DateRangeFilter, type DateRange } from '@/components/admin/DateRangeFilter'
import { fetchAnalytics, type AnalyticsData } from '@/lib/analytics'

export default function AnalyticsPage() {
    const [range, setRange] = useState<DateRange>(30)
    const [data, setData] = useState<AnalyticsData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const loadAnalytics = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const result = await fetchAnalytics(range)
            setData(result)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load analytics')
        } finally {
            setLoading(false)
        }
    }, [range])

    useEffect(() => {
        loadAnalytics()
    }, [loadAnalytics])

    const handleRangeChange = (newRange: DateRange) => {
        setRange(newRange)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
                    <p className="text-sm text-gray-500 mt-1">Platform-wide metrics and insights</p>
                </div>
                <DateRangeFilter value={range} onChange={handleRangeChange} />
            </div>

            {/* Error State */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                    {error}
                </div>
            )}

            {/* Overview Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    title="Total Clients"
                    value={loading ? '—' : data?.overview.totalClients.value ?? 0}
                    icon={Users}
                    trend={data?.overview.totalClients.trend ? {
                        value: data.overview.totalClients.trend,
                        label: 'vs last period',
                        isPositive: data.overview.totalClients.trend > 0,
                    } : undefined}
                    variant="default"
                />
                <MetricCard
                    title="Monthly Revenue"
                    value={loading ? '—' : `$${(data?.overview.mrr.value ?? 0).toLocaleString()}`}
                    icon={DollarSign}
                    trend={data?.overview.mrr.trend ? {
                        value: data.overview.mrr.trend,
                        label: 'vs last period',
                        isPositive: data.overview.mrr.trend > 0,
                    } : undefined}
                    variant="success"
                />
                <MetricCard
                    title="Actions This Month"
                    value={loading ? '—' : (data?.overview.actionsThisMonth.value ?? 0).toLocaleString()}
                    icon={Activity}
                    trend={data?.overview.actionsThisMonth.trend ? {
                        value: data.overview.actionsThisMonth.trend,
                        label: 'vs last period',
                        isPositive: data.overview.actionsThisMonth.trend > 0,
                    } : undefined}
                    variant="default"
                />
                <MetricCard
                    title="Active Tools"
                    value={loading ? '—' : `${data?.overview.activeTools.value ?? 0} of ${data?.overview.activeTools.total ?? 8}`}
                    icon={Wrench}
                    subtitle="Tools with activity"
                    variant="default"
                />
            </div>

            {/* Usage Chart - Full Width */}
            <UsageChart
                data={data?.usageTimeSeries ?? []}
                loading={loading}
            />

            {/* Bottom Section - Two Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <ClientBreakdown
                    data={data?.clientBreakdown ?? []}
                    loading={loading}
                />

                {/* Right Column */}
                <div className="space-y-6">
                    <ToolUsageChart
                        data={data?.toolUsage ?? []}
                        loading={loading}
                    />
                    <RevenueCard
                        data={data?.revenue ?? null}
                        loading={loading}
                    />
                </div>
            </div>
        </div>
    )
}
