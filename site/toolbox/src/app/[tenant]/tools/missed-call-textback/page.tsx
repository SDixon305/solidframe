'use client'

import React, { useState, useMemo } from 'react'
import { LayoutGrid, Settings, Activity } from 'lucide-react'
import { useTenantContext } from '@/lib/tenant-context'
import { ToolLayout, ToolHeader, ToolTabs, Tab, ActivityLog, MessageTemplateEditor } from '@/components/tools'
import { EnableToggle, LeadsSavedCounter } from '@/components/tools/textback'
import { generateActivityLog } from '@/lib/fake-data'

const TABS: Tab[] = [
    { id: 'overview', label: 'Overview', icon: LayoutGrid },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'activity', label: 'Activity', icon: Activity },
]

const DEFAULT_TEMPLATE = `Hi {firstName}! We missed your call to {businessName}. How can we help you today? Reply to this text and we'll get back to you ASAP!`

const TEMPLATE_VARIABLES = [
    { key: 'firstName', label: 'First Name', example: 'John' },
    { key: 'businessName', label: 'Business Name', example: 'Acme HVAC' },
    { key: 'phoneNumber', label: 'Phone Number', example: '(555) 123-4567' },
]

export default function MissedCallTextBackPage() {
    const { tenant, getTool } = useTenantContext()
    const tool = getTool('missed-call-textback')

    const [activeTab, setActiveTab] = useState('overview')
    const [enabled, setEnabled] = useState(true)
    const [messageTemplate, setMessageTemplate] = useState(
        DEFAULT_TEMPLATE.replace('{businessName}', tenant.name)
    )

    // Generate fake data
    const metrics = useMemo(() => {
        const createdAt = new Date(tenant.created_at)
        const daysSince = Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24))
        const leadsSaved = Math.floor(daysSince * 2.8) + 15
        const responseRate = 91 + Math.floor(Math.random() * 7)
        const estimatedRevenue = leadsSaved * 350

        return { leadsSaved, responseRate, estimatedRevenue }
    }, [tenant.created_at])

    const activity = useMemo(() =>
        generateActivityLog(new Date(tenant.created_at), 'missed-call-textback', tenant.id, 30),
        [tenant.created_at, tenant.id]
    )

    const handleSaveTemplate = (template: string) => {
        setMessageTemplate(template)
        console.log('Saved template:', template)
    }

    if (!tool) {
        return <div>Tool not found</div>
    }

    return (
        <ToolLayout>
            <ToolHeader
                slug="missed-call-textback"
                name={tool.name}
                description={tool.description}
                metrics={tool.metrics}
                isReal={false}
            />

            <ToolTabs
                tabs={TABS}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <div className="space-y-6">
                    {/* Enable Toggle */}
                    <EnableToggle
                        enabled={enabled}
                        onToggle={setEnabled}
                    />

                    {/* Stats Grid */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Leads Counter */}
                        <LeadsSavedCounter
                            leadsSaved={metrics.leadsSaved}
                            responseRate={metrics.responseRate}
                            estimatedRevenue={metrics.estimatedRevenue}
                        />

                        {/* How It Works */}
                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">How It Works</h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-[#5f3bff]/10 text-[#5f3bff] text-sm font-bold flex items-center justify-center flex-shrink-0">
                                        1
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">Customer calls</div>
                                        <div className="text-sm text-gray-500">
                                            When you can't answer or are on another call
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-[#5f3bff]/10 text-[#5f3bff] text-sm font-bold flex items-center justify-center flex-shrink-0">
                                        2
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">Auto-text sent</div>
                                        <div className="text-sm text-gray-500">
                                            Personalized message delivered within seconds
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-[#5f3bff]/10 text-[#5f3bff] text-sm font-bold flex items-center justify-center flex-shrink-0">
                                        3
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">Lead captured</div>
                                        <div className="text-sm text-gray-500">
                                            Customer responds and you follow up
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Recent Activity</h3>
                        <ActivityLog
                            entries={activity}
                            maxEntries={5}
                            onViewAll={() => setActiveTab('activity')}
                        />
                    </div>
                </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
                <div className="space-y-6">
                    <MessageTemplateEditor
                        label="Text-Back Message"
                        template={messageTemplate}
                        onSave={handleSaveTemplate}
                        variables={TEMPLATE_VARIABLES}
                        maxLength={300}
                    />

                    {/* Response Window */}
                    <div className="bg-white border border-gray-200 rounded-xl p-5">
                        <h3 className="font-semibold text-gray-900 mb-4">Response Settings</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Send text within
                                </label>
                                <select className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5f3bff]/20 focus:border-[#5f3bff] bg-white">
                                    <option value="10">10 seconds</option>
                                    <option value="30">30 seconds</option>
                                    <option value="60">1 minute</option>
                                </select>
                                <p className="text-xs text-gray-400 mt-1">
                                    Faster responses lead to higher conversion rates
                                </p>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <div className="font-medium text-gray-900">Only during business hours</div>
                                    <div className="text-sm text-gray-500">
                                        Don't send texts late at night
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    role="switch"
                                    aria-checked={true}
                                    className="relative inline-flex h-6 w-11 items-center rounded-full bg-[#5f3bff]"
                                >
                                    <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Activity Tab */}
            {activeTab === 'activity' && (
                <ActivityLog
                    entries={activity}
                    showViewAll={false}
                />
            )}
        </ToolLayout>
    )
}
