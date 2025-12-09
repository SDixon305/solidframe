'use client'

import { useClient } from './layout'
import { Phone, MessageSquare, Calendar, DollarSign, Users, Wrench, TrendingUp, Clock } from 'lucide-react'

// Mock stats for development
const mockStats = {
    calls_this_month: 127,
    calls_trend: 12,
    sms_this_month: 89,
    sms_trend: -5,
    appointments_this_month: 34,
    appointments_trend: 8,
    revenue_this_month: 2850,
    revenue_trend: 15,
}

function StatCard({
    icon: Icon,
    label,
    value,
    trend,
    format = 'number',
}: {
    icon: React.ComponentType<{ className?: string }>
    label: string
    value: number
    trend?: number
    format?: 'number' | 'currency'
}) {
    const formattedValue = format === 'currency'
        ? `$${value.toLocaleString()}`
        : value.toLocaleString()

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-violet-50 rounded-lg">
                    <Icon className="w-5 h-5 text-violet-600" />
                </div>
                {trend !== undefined && (
                    <span className={`text-sm font-medium flex items-center gap-1 ${
                        trend >= 0 ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                        <TrendingUp className={`w-4 h-4 ${trend < 0 ? 'rotate-180' : ''}`} />
                        {Math.abs(trend)}%
                    </span>
                )}
            </div>
            <p className="text-2xl font-bold text-gray-900">{formattedValue}</p>
            <p className="text-sm text-gray-500 mt-1">{label}</p>
        </div>
    )
}

export default function ClientOverviewPage() {
    const { client } = useClient()

    if (!client) {
        return null
    }

    const createdDate = new Date(client.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })

    return (
        <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    icon={Phone}
                    label="Calls This Month"
                    value={mockStats.calls_this_month}
                    trend={mockStats.calls_trend}
                />
                <StatCard
                    icon={MessageSquare}
                    label="SMS Sent"
                    value={mockStats.sms_this_month}
                    trend={mockStats.sms_trend}
                />
                <StatCard
                    icon={Calendar}
                    label="Appointments"
                    value={mockStats.appointments_this_month}
                    trend={mockStats.appointments_trend}
                />
                <StatCard
                    icon={DollarSign}
                    label="Revenue"
                    value={mockStats.revenue_this_month}
                    trend={mockStats.revenue_trend}
                    format="currency"
                />
            </div>

            {/* Details Grid */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Client Info */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Client Information</h3>
                    <dl className="space-y-3">
                        <div className="flex justify-between">
                            <dt className="text-gray-500">Company Name</dt>
                            <dd className="font-medium text-gray-900">{client.name}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-gray-500">Subdomain</dt>
                            <dd className="font-mono text-sm text-gray-900">{client.slug}.toolbox.solidframe.ai</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-gray-500">Business Type</dt>
                            <dd className="font-medium text-gray-900 capitalize">{client.business_type || 'Not specified'}</dd>
                        </div>
                        {client.business_address && (
                            <div className="flex justify-between">
                                <dt className="text-gray-500">Address</dt>
                                <dd className="font-medium text-gray-900 text-right">{client.business_address}</dd>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <dt className="text-gray-500">Created</dt>
                            <dd className="font-medium text-gray-900">{createdDate}</dd>
                        </div>
                    </dl>
                </div>

                {/* Owner Info */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Owner Information</h3>
                    <dl className="space-y-3">
                        <div className="flex justify-between">
                            <dt className="text-gray-500">Name</dt>
                            <dd className="font-medium text-gray-900">{client.owner_name || 'Not specified'}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-gray-500">Email</dt>
                            <dd className="font-medium text-gray-900">{client.owner_email || 'Not specified'}</dd>
                        </div>
                    </dl>

                    <div className="mt-6 pt-4 border-t border-gray-100">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h4>
                        <div className="flex gap-2">
                            <button className="px-3 py-1.5 text-sm bg-violet-50 text-violet-700 rounded-lg hover:bg-violet-100 transition-colors">
                                Send Login Link
                            </button>
                            <button className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                                View Portal
                            </button>
                        </div>
                    </div>
                </div>

                {/* Subscription */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Subscription</h3>
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`w-3 h-3 rounded-full ${
                            client.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'
                        }`} />
                        <span className="font-medium text-gray-900 capitalize">{client.status}</span>
                    </div>
                    <dl className="space-y-3">
                        <div className="flex justify-between">
                            <dt className="text-gray-500">Plan</dt>
                            <dd className="font-medium text-gray-900">Professional</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-gray-500">Billing</dt>
                            <dd className="font-medium text-gray-900">$299/month</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-gray-500">Next Invoice</dt>
                            <dd className="font-medium text-gray-900">Dec 15, 2024</dd>
                        </div>
                    </dl>
                </div>

                {/* Activity Summary */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Activity Summary</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <Users className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">{client.user_count || 0} Team Members</p>
                                <p className="text-xs text-gray-500">Active users</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-violet-50 rounded-lg">
                                <Wrench className="w-4 h-4 text-violet-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">{client.active_tool_count || 0} Tools Active</p>
                                <p className="text-xs text-gray-500">Of 8 available</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-50 rounded-lg">
                                <Clock className="w-4 h-4 text-amber-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">Last Active</p>
                                <p className="text-xs text-gray-500">
                                    {client.last_activity
                                        ? new Date(client.last_activity).toLocaleDateString()
                                        : 'Never'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
