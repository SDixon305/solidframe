'use client'

import { useState } from 'react'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts'
import { Phone, MessageSquare, Calendar } from 'lucide-react'
import type { UsageDataPoint } from '@/lib/analytics'

interface UsageChartProps {
    data: UsageDataPoint[]
    loading?: boolean
}

const SERIES_CONFIG = [
    { key: 'calls', label: 'Calls Handled', color: '#6366f1', icon: Phone },
    { key: 'sms', label: 'SMS Sent', color: '#22c55e', icon: MessageSquare },
    { key: 'appointments', label: 'Appointments', color: '#f59e0b', icon: Calendar },
] as const

type SeriesKey = typeof SERIES_CONFIG[number]['key']

export function UsageChart({ data, loading }: UsageChartProps) {
    const [visibleSeries, setVisibleSeries] = useState<Set<SeriesKey>>(
        new Set(['calls', 'sms', 'appointments'])
    )

    const toggleSeries = (key: SeriesKey) => {
        setVisibleSeries(prev => {
            const next = new Set(prev)
            if (next.has(key)) {
                // Don't allow hiding all series
                if (next.size > 1) next.delete(key)
            } else {
                next.add(key)
            }
            return next
        })
    }

    // Format date for display
    const formatXAxis = (dateStr: string) => {
        const date = new Date(dateStr)
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }

    if (loading) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-4" />
                <div className="h-[300px] bg-gray-100 rounded animate-pulse" />
            </div>
        )
    }

    if (!data || data.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage Over Time</h3>
                <div className="h-[300px] flex items-center justify-center text-gray-500">
                    No usage data available yet
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Usage Over Time</h3>
                <div className="flex gap-4">
                    {SERIES_CONFIG.map(({ key, label, color, icon: Icon }) => (
                        <button
                            key={key}
                            onClick={() => toggleSeries(key)}
                            className={`flex items-center gap-1.5 text-sm font-medium transition-opacity ${
                                visibleSeries.has(key) ? 'opacity-100' : 'opacity-40'
                            }`}
                        >
                            <span
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: color }}
                            />
                            <Icon size={14} style={{ color }} />
                            <span className="text-gray-600 hidden sm:inline">{label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                            dataKey="date"
                            tickFormatter={formatXAxis}
                            stroke="#9ca3af"
                            fontSize={12}
                            tickLine={false}
                            interval="preserveStartEnd"
                        />
                        <YAxis
                            stroke="#9ca3af"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#fff',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            }}
                            labelFormatter={(label) => {
                                const date = new Date(label)
                                return date.toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    month: 'short',
                                    day: 'numeric',
                                })
                            }}
                        />
                        {SERIES_CONFIG.map(({ key, label, color }) =>
                            visibleSeries.has(key) ? (
                                <Line
                                    key={key}
                                    type="monotone"
                                    dataKey={key}
                                    name={label}
                                    stroke={color}
                                    strokeWidth={2}
                                    dot={false}
                                    activeDot={{ r: 4, strokeWidth: 0 }}
                                />
                            ) : null
                        )}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
