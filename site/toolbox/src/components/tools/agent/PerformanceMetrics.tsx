'use client'

import React from 'react'
import { Phone, Clock, AlertTriangle, TrendingUp, CheckCircle } from 'lucide-react'
import MetricCard from '../MetricCard'

export interface AgentPerformanceData {
    totalCalls: number
    callsTrend: number
    avgDuration: number
    emergencyRate: number
    resolutionRate: number
    callsByType: {
        scheduling: number
        emergency: number
        inquiry: number
        followup: number
    }
    callsByOutcome: {
        booked: number
        dispatched: number
        callback: number
        resolved: number
        voicemail: number
    }
    weeklyCallVolume: number[]
}

interface PerformanceMetricsProps {
    data: AgentPerformanceData
    period?: string
}

export default function PerformanceMetrics({ data, period = 'Last 30 days' }: PerformanceMetricsProps) {
    const maxCallVolume = Math.max(...data.weeklyCallVolume)

    return (
        <div className="space-y-6">
            {/* Period Selector */}
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Performance Overview</h3>
                <span className="text-sm text-gray-500">{period}</span>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    label="Total Calls"
                    value={data.totalCalls}
                    trend={data.callsTrend > 0 ? 'up' : data.callsTrend < 0 ? 'down' : 'stable'}
                    trendValue={`${data.callsTrend > 0 ? '+' : ''}${data.callsTrend}%`}
                    icon={Phone}
                />
                <MetricCard
                    label="Avg Duration"
                    value={`${Math.floor(data.avgDuration / 60)}:${(data.avgDuration % 60).toString().padStart(2, '0')}`}
                    icon={Clock}
                />
                <MetricCard
                    label="Emergency Rate"
                    value={`${data.emergencyRate}%`}
                    description="of total calls"
                    icon={AlertTriangle}
                />
                <MetricCard
                    label="Resolution Rate"
                    value={`${data.resolutionRate}%`}
                    trend="up"
                    trendValue="+3%"
                    icon={CheckCircle}
                />
            </div>

            {/* Call Volume Chart */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h4 className="font-medium text-gray-900 mb-4">Weekly Call Volume</h4>
                <div className="flex items-end gap-2 h-32">
                    {data.weeklyCallVolume.map((calls, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center">
                            <div
                                className="w-full bg-[#5f3bff]/20 rounded-t hover:bg-[#5f3bff]/30 transition-colors relative group"
                                style={{ height: `${(calls / maxCallVolume) * 100}%` }}
                            >
                                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {calls}
                                </span>
                            </div>
                            <span className="text-xs text-gray-400 mt-2">
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][index]}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Breakdown Cards */}
            <div className="grid md:grid-cols-2 gap-4">
                {/* Calls by Type */}
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <h4 className="font-medium text-gray-900 mb-4">Calls by Type</h4>
                    <div className="space-y-3">
                        {Object.entries(data.callsByType).map(([type, count]) => {
                            const total = Object.values(data.callsByType).reduce((a, b) => a + b, 0)
                            const percentage = Math.round((count / total) * 100)
                            const colors: Record<string, string> = {
                                scheduling: 'bg-blue-500',
                                emergency: 'bg-red-500',
                                inquiry: 'bg-gray-400',
                                followup: 'bg-purple-500',
                            }

                            return (
                                <div key={type}>
                                    <div className="flex items-center justify-between text-sm mb-1">
                                        <span className="capitalize text-gray-700">{type}</span>
                                        <span className="text-gray-500">{count} ({percentage}%)</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${colors[type]} rounded-full`}
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Calls by Outcome */}
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <h4 className="font-medium text-gray-900 mb-4">Calls by Outcome</h4>
                    <div className="space-y-3">
                        {Object.entries(data.callsByOutcome).map(([outcome, count]) => {
                            const total = Object.values(data.callsByOutcome).reduce((a, b) => a + b, 0)
                            const percentage = Math.round((count / total) * 100)
                            const colors: Record<string, string> = {
                                booked: 'bg-emerald-500',
                                dispatched: 'bg-red-500',
                                callback: 'bg-amber-500',
                                resolved: 'bg-blue-500',
                                voicemail: 'bg-gray-400',
                            }

                            return (
                                <div key={outcome}>
                                    <div className="flex items-center justify-between text-sm mb-1">
                                        <span className="capitalize text-gray-700">{outcome}</span>
                                        <span className="text-gray-500">{count} ({percentage}%)</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${colors[outcome]} rounded-full`}
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
