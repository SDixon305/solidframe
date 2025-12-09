'use client'

import { useState, useMemo } from 'react'
import { LayoutGrid, FileText, Settings, Activity } from 'lucide-react'
import { useTenantContext } from '@/lib/tenant-context'
import { generateActivityLog } from '@/lib/fake-data'
import ToolLayout from '@/components/tools/ToolLayout'
import ToolHeader from '@/components/tools/ToolHeader'
import ToolTabs, { Tab } from '@/components/tools/ToolTabs'
import ActivityLog, { CompactActivityLog } from '@/components/tools/ActivityLog'
import ContractList, { generateFakeContracts } from '@/components/tools/maintenance/ContractList'
import RenewalTimeline, { CompactTimeline, CalendarTimeline } from '@/components/tools/maintenance/RenewalTimeline'
import RenewalRateCard, { generateRenewalMetrics } from '@/components/tools/maintenance/RenewalRateCard'
import RenewalSettings, { DEFAULT_RENEWAL_SETTINGS, ReminderSettings } from '@/components/tools/maintenance/RenewalSettings'

const TABS: Tab[] = [
    { id: 'overview', label: 'Overview', icon: LayoutGrid },
    { id: 'contracts', label: 'Contracts', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'activity', label: 'Activity', icon: Activity },
]

export default function MaintenanceRenewalPage() {
    const { tenant, getTool } = useTenantContext()
    const [activeTab, setActiveTab] = useState('overview')
    const [settings, setSettings] = useState<ReminderSettings>(DEFAULT_RENEWAL_SETTINGS)

    const tool = getTool('maintenance-renewal')
    const tenantCreatedAt = new Date(tenant.created_at)

    // Generate fake data
    const contracts = useMemo(() => generateFakeContracts(tenant.id, 45), [tenant.id])
    const metrics = useMemo(
        () => generateRenewalMetrics(tenant.id, contracts.map(c => ({ status: c.status, planValue: c.planValue }))),
        [tenant.id, contracts]
    )
    const activity = useMemo(
        () => generateActivityLog(tenantCreatedAt, 'maintenance-renewal', tenant.id, 20),
        [tenant.id]
    )

    if (!tool) return null

    return (
        <ToolLayout>
            <ToolHeader
                slug="maintenance-renewal"
                name={tool.name}
                description={tool.description}
                metrics={tool.metrics}
                isReal={tool.isReal}
            />

            <ToolTabs tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Tab Content */}
            <div className="space-y-6">
                {activeTab === 'overview' && (
                    <>
                        {/* Metrics */}
                        <RenewalRateCard metrics={metrics} />

                        {/* Two column layout */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Timeline */}
                            <RenewalTimeline
                                contracts={contracts}
                                onContractClick={(contract) => {
                                    setActiveTab('contracts')
                                }}
                            />

                            {/* Calendar view */}
                            <CalendarTimeline contracts={contracts} weeksToShow={4} />
                        </div>

                        {/* Quick stats and activity */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white border border-gray-200 rounded-xl p-5">
                                <h3 className="text-sm font-semibold text-gray-700 mb-4">Upcoming Renewals</h3>
                                <CompactTimeline contracts={contracts} />
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <button
                                        onClick={() => setActiveTab('contracts')}
                                        className="text-sm text-[#5f3bff] hover:text-[#4f2fe0] font-medium"
                                    >
                                        View All Contracts →
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-xl p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-semibold text-gray-700">Recent Activity</h3>
                                    <button
                                        onClick={() => setActiveTab('activity')}
                                        className="text-sm text-[#5f3bff] hover:text-[#4f2fe0] font-medium"
                                    >
                                        View All →
                                    </button>
                                </div>
                                <CompactActivityLog entries={activity} maxEntries={5} />
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'contracts' && (
                    <>
                        {/* Compact metrics */}
                        <RenewalRateCard metrics={metrics} variant="compact" />

                        {/* Contract list */}
                        <ContractList
                            contracts={contracts}
                            onSendReminder={(contract) => {
                                console.log('Send reminder to', contract.customerName)
                            }}
                            onMarkRenewed={(contract) => {
                                console.log('Mark renewed', contract.id)
                            }}
                        />
                    </>
                )}

                {activeTab === 'settings' && (
                    <RenewalSettings
                        settings={settings}
                        onSettingsChange={setSettings}
                    />
                )}

                {activeTab === 'activity' && (
                    <ActivityLog entries={activity} showViewAll={false} />
                )}
            </div>
        </ToolLayout>
    )
}
