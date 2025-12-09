import { Users, Wrench, Phone, Bell, AlertCircle } from 'lucide-react'
import { MetricCard } from '@/components/admin/MetricCard'

export default function AdminDashboardPage() {
    // Placeholder metrics - will be fetched from API in later tasks
    const metrics = {
        totalClients: 12,
        activeTools: 24,
        callsThisMonth: 1847,
        unreadAlerts: 3,
    }

    // Placeholder recent alerts - will be fetched from API in later tasks
    const recentAlerts: { id: string; title: string; time: string; severity: 'info' | 'warning' | 'error' }[] = []

    return (
        <div className="space-y-6">
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    title="Total Clients"
                    value={metrics.totalClients}
                    subtitle="Active accounts"
                    icon={Users}
                    variant="default"
                />
                <MetricCard
                    title="Active Tools"
                    value={metrics.activeTools}
                    subtitle="Deployed across clients"
                    icon={Wrench}
                    variant="success"
                />
                <MetricCard
                    title="Calls This Month"
                    value={metrics.callsThisMonth.toLocaleString()}
                    subtitle="Handled by agents"
                    icon={Phone}
                    variant="default"
                    trend={{ value: 12, label: 'vs last month', isPositive: true }}
                />
                <MetricCard
                    title="Alerts"
                    value={metrics.unreadAlerts}
                    subtitle="Unread notifications"
                    icon={Bell}
                    variant={metrics.unreadAlerts > 0 ? 'warning' : 'default'}
                />
            </div>

            {/* Recent Alerts Section */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="px-5 py-4 border-b border-gray-100">
                    <h2 className="text-base font-semibold text-gray-900">Recent Alerts</h2>
                </div>
                <div className="p-5">
                    {recentAlerts.length > 0 ? (
                        <div className="space-y-3">
                            {recentAlerts.map(alert => (
                                <div
                                    key={alert.id}
                                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-50"
                                >
                                    <AlertCircle size={18} className="text-gray-400" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                                        <p className="text-xs text-gray-500">{alert.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3">
                                <Bell size={20} className="text-gray-400" />
                            </div>
                            <p className="text-sm font-medium text-gray-900">No recent alerts</p>
                            <p className="text-xs text-gray-500 mt-1">
                                System notifications will appear here
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Actions - placeholder for future */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="px-5 py-4 border-b border-gray-100">
                    <h2 className="text-base font-semibold text-gray-900">Quick Actions</h2>
                </div>
                <div className="p-5">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <button className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-violet-300 hover:bg-violet-50 transition-colors text-left">
                            <div className="p-2 rounded-lg bg-violet-100">
                                <Users size={18} className="text-violet-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">Add Client</p>
                                <p className="text-xs text-gray-500">Create new account</p>
                            </div>
                        </button>
                        <button className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-violet-300 hover:bg-violet-50 transition-colors text-left">
                            <div className="p-2 rounded-lg bg-emerald-100">
                                <Wrench size={18} className="text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">Deploy Tool</p>
                                <p className="text-xs text-gray-500">Activate for client</p>
                            </div>
                        </button>
                        <button className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-violet-300 hover:bg-violet-50 transition-colors text-left">
                            <div className="p-2 rounded-lg bg-amber-100">
                                <Phone size={18} className="text-amber-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">View Calls</p>
                                <p className="text-xs text-gray-500">Recent activity</p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
