'use client'

import React, { useState, useMemo } from 'react'
import { LayoutGrid, History, Settings, BarChart2 } from 'lucide-react'
import { useTenantContext } from '@/lib/tenant-context'
import { ToolLayout, ToolHeader, ToolTabs, Tab, CompactActivityLog } from '@/components/tools'
import {
    CallInterface,
    CallHistory,
    AgentSettings,
    PerformanceMetrics,
    AgentConfig,
} from '@/components/tools/agent'
import {
    generateCallRecords,
    generateAgentConfig,
    generateAgentPerformance,
} from '@/lib/fake-agent-data'
import { generateActivityLog } from '@/lib/fake-data'

const TABS: Tab[] = [
    { id: 'overview', label: 'Overview', icon: LayoutGrid },
    { id: 'history', label: 'Call History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'performance', label: 'Performance', icon: BarChart2 },
]

export default function AfterHoursAgentPage() {
    const { tenant, getTool } = useTenantContext()
    const tool = getTool('after-hours-agent')

    const [activeTab, setActiveTab] = useState('overview')
    const [agentConfig, setAgentConfig] = useState<AgentConfig>(() =>
        generateAgentConfig(tenant.name)
    )

    // Generate fake data based on tenant
    const calls = useMemo(() =>
        generateCallRecords(tenant.id, tenant.name, new Date(tenant.created_at), 50),
        [tenant.id, tenant.name, tenant.created_at]
    )

    const performance = useMemo(() =>
        generateAgentPerformance(tenant.id, new Date(tenant.created_at)),
        [tenant.id, tenant.created_at]
    )

    const activity = useMemo(() =>
        generateActivityLog(new Date(tenant.created_at), 'after-hours-agent', tenant.id, 10),
        [tenant.created_at, tenant.id]
    )

    const handleSaveConfig = async (config: AgentConfig) => {
        // In production, this would save to the database
        setAgentConfig(config)
        console.log('Saving config:', config)
    }

    const handlePlayRecording = (callId: string) => {
        console.log('Playing recording for call:', callId)
        // In production, this would play the actual recording
    }

    if (!tool) {
        return <div>Tool not found</div>
    }

    return (
        <ToolLayout>
            <ToolHeader
                slug="after-hours-agent"
                name={tool.name}
                description={tool.description}
                metrics={tool.metrics}
                isReal={true}
            />

            <ToolTabs
                tabs={TABS}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Main Content - Call Interface */}
                    <div className="lg:col-span-2 space-y-6">
                        <CallInterface
                            tenantName={tenant.name}
                            vapiAssistantId={process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID}
                        />

                        {/* Recent Calls */}
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-3">Recent Calls</h3>
                            <CallHistory
                                calls={calls.slice(0, 5)}
                                onPlayRecording={handlePlayRecording}
                            />
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Stats */}
                        <div className="bg-white border border-gray-200 rounded-xl p-5">
                            <h3 className="font-semibold text-gray-900 mb-4">Quick Stats</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <div className="text-2xl font-bold text-gray-900">
                                        {performance.totalCalls}
                                    </div>
                                    <div className="text-xs text-gray-500">Total Calls</div>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <div className="text-2xl font-bold text-emerald-600">
                                        {performance.resolutionRate}%
                                    </div>
                                    <div className="text-xs text-gray-500">Resolved</div>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <div className="text-2xl font-bold text-gray-900">
                                        {Math.floor(performance.avgDuration / 60)}:{(performance.avgDuration % 60).toString().padStart(2, '0')}
                                    </div>
                                    <div className="text-xs text-gray-500">Avg Duration</div>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <div className="text-2xl font-bold text-red-500">
                                        {performance.emergencyRate}%
                                    </div>
                                    <div className="text-xs text-gray-500">Emergencies</div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white border border-gray-200 rounded-xl p-5">
                            <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
                            <CompactActivityLog entries={activity} maxEntries={5} />
                        </div>
                    </div>
                </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
                <CallHistory
                    calls={calls}
                    onPlayRecording={handlePlayRecording}
                />
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
                <AgentSettings
                    config={agentConfig}
                    onSave={handleSaveConfig}
                />
            )}

            {/* Performance Tab */}
            {activeTab === 'performance' && (
                <PerformanceMetrics data={performance} />
            )}
        </ToolLayout>
    )
}
