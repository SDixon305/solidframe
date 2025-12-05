'use client'

import { useEffect, useState } from 'react'
import { Phone, DollarSign, Clock, Star, TrendingUp, Users } from 'lucide-react'

interface MetricCardProps {
    icon: React.ReactNode
    label: string
    value: string | number
    subtext: string
    color: string
    trend?: string
}

function MetricCard({ icon, label, value, subtext, color, trend }: MetricCardProps) {
    const [displayValue, setDisplayValue] = useState(0)
    const targetValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.]/g, '')) : value

    useEffect(() => {
        if (typeof value === 'number') {
            let start = 0
            const duration = 2000
            const increment = targetValue / (duration / 16)

            const timer = setInterval(() => {
                start += increment
                if (start >= targetValue) {
                    setDisplayValue(targetValue)
                    clearInterval(timer)
                } else {
                    setDisplayValue(Math.floor(start))
                }
            }, 16)

            return () => clearInterval(timer)
        }
    }, [targetValue, value])

    const formattedValue = typeof value === 'number'
        ? displayValue.toLocaleString()
        : value

    return (
        <div className={`bg-white rounded-xl shadow-lg p-6 border-2 border-${color}-200 hover:shadow-xl transition-shadow`}>
            <div className="flex items-start justify-between mb-3">
                <div className={`p-3 bg-${color}-100 rounded-lg`}>
                    {icon}
                </div>
                {trend && (
                    <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                        <TrendingUp className="w-4 h-4" />
                        {trend}
                    </div>
                )}
            </div>
            <h3 className="text-sm font-semibold text-gray-600 mb-1">{label}</h3>
            <p className={`text-3xl font-bold text-${color}-600 mb-1`}>
                {formattedValue}
            </p>
            <p className="text-xs text-gray-500">{subtext}</p>
        </div>
    )
}

export default function RevenueMetrics() {
    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg p-8 border-2 border-blue-200">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-blue-100 rounded-lg">
                        <TrendingUp className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            Live Performance Metrics
                        </h2>
                        <p className="text-sm text-gray-600">
                            Real results from Bob's HVAC (Demo Data)
                        </p>
                    </div>
                </div>

                {/* Main Metrics Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    <MetricCard
                        icon={<Phone className="w-6 h-6 text-blue-600" />}
                        label="Calls Captured This Month"
                        value={47}
                        subtext="vs. 18 without AI (161% increase)"
                        color="blue"
                        trend="+161%"
                    />

                    <MetricCard
                        icon={<DollarSign className="w-6 h-6 text-green-600" />}
                        label="Revenue Generated"
                        value="$23,500"
                        subtext="From after-hours calls alone"
                        color="green"
                        trend="+$16,200"
                    />

                    <MetricCard
                        icon={<Clock className="w-6 h-6 text-purple-600" />}
                        label="Avg Response Time"
                        value="2.3 min"
                        subtext="Emergency calls answered instantly"
                        color="purple"
                    />

                    <MetricCard
                        icon={<Star className="w-6 h-6 text-yellow-600" />}
                        label="Customer Satisfaction"
                        value="98%"
                        subtext="5-star ratings from customers"
                        color="yellow"
                    />

                    <MetricCard
                        icon={<Phone className="w-6 h-6 text-red-600" />}
                        label="Missed Calls Prevented"
                        value={42}
                        subtext="Calls that would have been lost"
                        color="red"
                    />

                    <MetricCard
                        icon={<Users className="w-6 h-6 text-indigo-600" />}
                        label="Time Saved"
                        value="15.7 hrs"
                        subtext="Owner's time freed up weekly"
                        color="indigo"
                    />
                </div>

                {/* Revenue Breakdown */}
                <div className="bg-white rounded-lg p-6 border-2 border-blue-200">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        Monthly Revenue Breakdown
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                <span className="text-sm text-gray-700">Emergency Calls (14)</span>
                            </div>
                            <span className="font-bold text-gray-900">$7,000</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                <span className="text-sm text-gray-700">Standard Service (33)</span>
                            </div>
                            <span className="font-bold text-gray-900">$6,600</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <span className="text-sm text-gray-700">Maintenance Contracts (8)</span>
                            </div>
                            <span className="font-bold text-gray-900">$9,900</span>
                        </div>
                        <div className="border-t border-gray-200 pt-3 mt-3 flex justify-between">
                            <span className="font-bold text-gray-900">Total Revenue</span>
                            <span className="font-bold text-green-600 text-xl">$23,500</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow p-4 text-center border border-gray-200">
                    <p className="text-2xl font-bold text-blue-600">24/7</p>
                    <p className="text-xs text-gray-600 mt-1">Coverage</p>
                </div>
                <div className="bg-white rounded-lg shadow p-4 text-center border border-gray-200">
                    <p className="text-2xl font-bold text-green-600">95%</p>
                    <p className="text-xs text-gray-600 mt-1">Capture Rate</p>
                </div>
                <div className="bg-white rounded-lg shadow p-4 text-center border border-gray-200">
                    <p className="text-2xl font-bold text-purple-600">&lt;3 min</p>
                    <p className="text-xs text-gray-600 mt-1">Response</p>
                </div>
                <div className="bg-white rounded-lg shadow p-4 text-center border border-gray-200">
                    <p className="text-2xl font-bold text-red-600">0</p>
                    <p className="text-xs text-gray-600 mt-1">Missed Calls</p>
                </div>
            </div>
        </div>
    )
}
