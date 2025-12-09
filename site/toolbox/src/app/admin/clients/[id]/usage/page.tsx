'use client'

import { useClient } from '../layout'
import { BarChart3, Phone, MessageSquare, Calendar, Star, TrendingUp } from 'lucide-react'

// Mock usage data
const mockUsageData = {
    calls: [
        { month: 'Jul', value: 45 },
        { month: 'Aug', value: 62 },
        { month: 'Sep', value: 78 },
        { month: 'Oct', value: 95 },
        { month: 'Nov', value: 112 },
        { month: 'Dec', value: 127 },
    ],
    sms: [
        { month: 'Jul', value: 32 },
        { month: 'Aug', value: 45 },
        { month: 'Sep', value: 58 },
        { month: 'Oct', value: 67 },
        { month: 'Nov', value: 81 },
        { month: 'Dec', value: 89 },
    ],
    appointments: [
        { month: 'Jul', value: 12 },
        { month: 'Aug', value: 18 },
        { month: 'Sep', value: 24 },
        { month: 'Oct', value: 28 },
        { month: 'Nov', value: 31 },
        { month: 'Dec', value: 34 },
    ],
    reviews: [
        { month: 'Jul', value: 5 },
        { month: 'Aug', value: 8 },
        { month: 'Sep', value: 12 },
        { month: 'Oct', value: 15 },
        { month: 'Nov', value: 18 },
        { month: 'Dec', value: 21 },
    ],
}

function SimpleBarChart({ data, color }: { data: { month: string; value: number }[]; color: string }) {
    const maxValue = Math.max(...data.map(d => d.value))

    return (
        <div className="flex items-end gap-2 h-40">
            {data.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex flex-col items-center">
                        <span className="text-xs text-gray-500 mb-1">{item.value}</span>
                        <div
                            className={`w-full rounded-t-md ${color}`}
                            style={{ height: `${(item.value / maxValue) * 100}px` }}
                        />
                    </div>
                    <span className="text-xs text-gray-500">{item.month}</span>
                </div>
            ))}
        </div>
    )
}

function UsageCard({
    icon: Icon,
    label,
    total,
    trend,
    data,
    color,
}: {
    icon: React.ComponentType<{ className?: string }>
    label: string
    total: number
    trend: number
    data: { month: string; value: number }[]
    color: string
}) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${color.replace('bg-', 'bg-').replace('-500', '-50')}`}>
                        <Icon className={`w-5 h-5 ${color.replace('bg-', 'text-')}`} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">{label}</h3>
                        <p className="text-sm text-gray-500">Last 6 months</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{total.toLocaleString()}</p>
                    <p className={`text-sm flex items-center gap-1 justify-end ${
                        trend >= 0 ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                        <TrendingUp className={`w-3 h-3 ${trend < 0 ? 'rotate-180' : ''}`} />
                        {Math.abs(trend)}% vs last period
                    </p>
                </div>
            </div>
            <SimpleBarChart data={data} color={color} />
        </div>
    )
}

export default function ClientUsagePage() {
    const { client } = useClient()

    if (!client) {
        return null
    }

    const totalCalls = mockUsageData.calls.reduce((sum, d) => sum + d.value, 0)
    const totalSms = mockUsageData.sms.reduce((sum, d) => sum + d.value, 0)
    const totalAppointments = mockUsageData.appointments.reduce((sum, d) => sum + d.value, 0)
    const totalReviews = mockUsageData.reviews.reduce((sum, d) => sum + d.value, 0)

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Usage Statistics</h2>
                    <p className="text-sm text-gray-500">
                        Activity metrics for {client.name}
                    </p>
                </div>
                <select className="px-4 py-2 rounded-lg border border-gray-300 text-sm bg-white">
                    <option value="6m">Last 6 months</option>
                    <option value="12m">Last 12 months</option>
                    <option value="ytd">Year to date</option>
                </select>
            </div>

            {/* Usage Charts */}
            <div className="grid md:grid-cols-2 gap-6">
                <UsageCard
                    icon={Phone}
                    label="Calls Handled"
                    total={totalCalls}
                    trend={18}
                    data={mockUsageData.calls}
                    color="bg-violet-500"
                />
                <UsageCard
                    icon={MessageSquare}
                    label="SMS Messages"
                    total={totalSms}
                    trend={12}
                    data={mockUsageData.sms}
                    color="bg-blue-500"
                />
                <UsageCard
                    icon={Calendar}
                    label="Appointments Scheduled"
                    total={totalAppointments}
                    trend={24}
                    data={mockUsageData.appointments}
                    color="bg-emerald-500"
                />
                <UsageCard
                    icon={Star}
                    label="Reviews Requested"
                    total={totalReviews}
                    trend={32}
                    data={mockUsageData.reviews}
                    color="bg-amber-500"
                />
            </div>

            {/* Summary Stats */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Usage Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                        <p className="text-sm text-gray-500">Avg. Calls/Day</p>
                        <p className="text-2xl font-bold text-gray-900">{Math.round(totalCalls / 180)}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Response Rate</p>
                        <p className="text-2xl font-bold text-gray-900">94%</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Conversion Rate</p>
                        <p className="text-2xl font-bold text-gray-900">27%</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Avg. Review Score</p>
                        <p className="text-2xl font-bold text-gray-900">4.8</p>
                    </div>
                </div>
            </div>

            {/* Placeholder for future charts */}
            <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
                <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-500 mb-2">Advanced Analytics Coming Soon</h3>
                <p className="text-gray-400 max-w-md mx-auto">
                    Detailed breakdowns, trend analysis, and exportable reports will be available in a future update.
                </p>
            </div>
        </div>
    )
}
