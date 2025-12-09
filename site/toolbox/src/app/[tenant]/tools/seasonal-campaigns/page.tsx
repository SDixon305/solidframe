'use client'

import { useState, useMemo } from 'react'
import { LayoutGrid, PlusCircle, History, Users } from 'lucide-react'
import { useTenantContext } from '@/lib/tenant-context'
import { generateActivityLog } from '@/lib/fake-data'
import ToolLayout from '@/components/tools/ToolLayout'
import ToolHeader from '@/components/tools/ToolHeader'
import ToolTabs, { Tab } from '@/components/tools/ToolTabs'
import CampaignTemplates, { DEFAULT_CAMPAIGN_TEMPLATES, CampaignTemplate, TemplatePreview } from '@/components/tools/campaigns/CampaignTemplates'
import AudienceSelector, { DEFAULT_AUDIENCE_SEGMENTS, CompactAudience } from '@/components/tools/campaigns/AudienceSelector'
import ScheduleSend from '@/components/tools/campaigns/ScheduleSend'
import CampaignHistory, { CampaignStats, generateCampaignHistory } from '@/components/tools/campaigns/CampaignHistory'
import { CompactActivityLog } from '@/components/tools/ActivityLog'

const TABS: Tab[] = [
    { id: 'overview', label: 'Overview', icon: LayoutGrid },
    { id: 'create', label: 'Create', icon: PlusCircle },
    { id: 'history', label: 'History', icon: History },
    { id: 'audience', label: 'Audience', icon: Users },
]

export default function SeasonalCampaignsPage() {
    const { tenant, getTool } = useTenantContext()
    const [activeTab, setActiveTab] = useState('overview')

    // Campaign creation state
    const [selectedTemplate, setSelectedTemplate] = useState<CampaignTemplate | null>(null)
    const [selectedSegments, setSelectedSegments] = useState<string[]>([])

    const tool = getTool('seasonal-campaigns')
    const tenantCreatedAt = new Date(tenant.created_at)

    // Total customers
    const totalCustomers = 1247

    // Calculate recipient count
    const recipientCount = selectedSegments.length === 0
        ? totalCustomers
        : DEFAULT_AUDIENCE_SEGMENTS
            .filter(s => selectedSegments.includes(s.id))
            .reduce((sum, s) => sum + s.count, 0)

    // Generate fake data
    const campaignHistory = useMemo(() => generateCampaignHistory(tenant.id), [tenant.id])
    const activity = useMemo(
        () => generateActivityLog(tenantCreatedAt, 'seasonal-campaigns', tenant.id, 15),
        [tenant.id]
    )

    // Calculate stats
    const avgOpenRate = Math.round(
        campaignHistory.reduce((sum, c) => sum + c.openRate, 0) / campaignHistory.length
    )
    const avgClickRate = Math.round(
        campaignHistory.reduce((sum, c) => sum + c.clickRate, 0) / campaignHistory.length
    )
    const totalRecipients = campaignHistory.reduce((sum, c) => sum + c.recipientCount, 0)

    if (!tool) return null

    return (
        <ToolLayout>
            <ToolHeader
                slug="seasonal-campaigns"
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
                        {/* Suggested campaign */}
                        <div className="bg-gradient-to-br from-[#5f3bff] to-[#4f2fe0] rounded-xl p-6 text-white">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <div className="text-white/70 text-sm font-medium mb-1">Suggested Campaign</div>
                                    <h3 className="text-xl font-bold mb-2">Winter Heating Special</h3>
                                    <p className="text-white/80 text-sm">
                                        The season is right for a heating promotion. Reach {totalCustomers.toLocaleString()} customers.
                                    </p>
                                </div>
                                <button
                                    onClick={() => {
                                        setSelectedTemplate(DEFAULT_CAMPAIGN_TEMPLATES[3]) // Winter template
                                        setActiveTab('create')
                                    }}
                                    className="px-5 py-2.5 bg-white text-[#5f3bff] rounded-lg font-medium text-sm hover:bg-white/90 transition-colors whitespace-nowrap"
                                >
                                    Create Campaign
                                </button>
                            </div>
                        </div>

                        {/* Stats */}
                        <CampaignStats
                            totalCampaigns={campaignHistory.length}
                            avgOpenRate={avgOpenRate}
                            avgClickRate={avgClickRate}
                            totalRecipients={totalRecipients}
                        />

                        {/* Recent campaigns */}
                        <div className="bg-white border border-gray-200 rounded-xl p-5">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-semibold text-gray-700">Recent Campaigns</h3>
                                <button
                                    onClick={() => setActiveTab('history')}
                                    className="text-sm text-[#5f3bff] hover:text-[#4f2fe0] font-medium"
                                >
                                    View All →
                                </button>
                            </div>
                            <div className="space-y-3">
                                {campaignHistory.slice(0, 3).map((campaign) => (
                                    <div key={campaign.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div>
                                            <div className="font-medium text-gray-900 text-sm">{campaign.name}</div>
                                            <div className="text-xs text-gray-500">{campaign.recipientCount.toLocaleString()} recipients</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-medium text-emerald-600">{campaign.openRate}% opens</div>
                                            <div className="text-xs text-gray-500">{campaign.clickRate}% clicks</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent activity */}
                        <div className="bg-white border border-gray-200 rounded-xl p-5">
                            <h3 className="text-sm font-semibold text-gray-700 mb-4">Recent Activity</h3>
                            <CompactActivityLog entries={activity} maxEntries={5} />
                        </div>
                    </>
                )}

                {activeTab === 'create' && (
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Left column - Template selection */}
                        <div className="space-y-6">
                            <div className="bg-white border border-gray-200 rounded-xl p-5">
                                <h3 className="text-sm font-semibold text-gray-700 mb-4">Choose Template</h3>
                                <CampaignTemplates
                                    templates={DEFAULT_CAMPAIGN_TEMPLATES}
                                    selectedTemplate={selectedTemplate}
                                    onSelectTemplate={setSelectedTemplate}
                                />
                            </div>

                            {/* Audience selector */}
                            <AudienceSelector
                                segments={DEFAULT_AUDIENCE_SEGMENTS}
                                selectedSegments={selectedSegments}
                                onSelectionChange={setSelectedSegments}
                                totalCustomers={totalCustomers}
                            />
                        </div>

                        {/* Right column - Preview and send */}
                        <div className="space-y-6">
                            {selectedTemplate ? (
                                <>
                                    <TemplatePreview
                                        template={selectedTemplate}
                                        onEdit={() => console.log('Edit template')}
                                    />

                                    <ScheduleSend
                                        recipientCount={recipientCount}
                                        onSendNow={() => console.log('Send now')}
                                        onSchedule={(date) => console.log('Schedule for', date)}
                                        disabled={!selectedTemplate}
                                    />
                                </>
                            ) : (
                                <div className="bg-gray-50 border border-gray-200 border-dashed rounded-xl p-8 text-center">
                                    <div className="text-gray-400 mb-2">
                                        Select a template to preview
                                    </div>
                                    <p className="text-sm text-gray-500">
                                        Choose from the seasonal templates on the left to get started
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'history' && (
                    <>
                        <CampaignStats
                            totalCampaigns={campaignHistory.length}
                            avgOpenRate={avgOpenRate}
                            avgClickRate={avgClickRate}
                            totalRecipients={totalRecipients}
                        />

                        <CampaignHistory
                            campaigns={campaignHistory}
                            onDuplicate={(campaign) => {
                                // Find matching template or use first one
                                const template = DEFAULT_CAMPAIGN_TEMPLATES.find(t =>
                                    t.name.toLowerCase().includes(campaign.name.toLowerCase().split(' ')[0])
                                ) || DEFAULT_CAMPAIGN_TEMPLATES[0]
                                setSelectedTemplate(template)
                                setActiveTab('create')
                            }}
                            onDelete={(campaign) => console.log('Delete', campaign.id)}
                        />
                    </>
                )}

                {activeTab === 'audience' && (
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Audience overview */}
                        <div className="space-y-4">
                            <div className="bg-white border border-gray-200 rounded-xl p-5">
                                <h3 className="text-sm font-semibold text-gray-700 mb-4">Total Audience</h3>
                                <div className="text-4xl font-bold text-gray-900 mb-2">
                                    {totalCustomers.toLocaleString()}
                                </div>
                                <p className="text-sm text-gray-500">customers in your database</p>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-xl p-5">
                                <h3 className="text-sm font-semibold text-gray-700 mb-4">Segment Breakdown</h3>
                                <div className="space-y-3">
                                    {DEFAULT_AUDIENCE_SEGMENTS.map((segment) => {
                                        const percentage = Math.round((segment.count / totalCustomers) * 100)
                                        return (
                                            <div key={segment.id}>
                                                <div className="flex items-center justify-between text-sm mb-1">
                                                    <span className="text-gray-700">{segment.name}</span>
                                                    <span className="text-gray-500">{segment.count.toLocaleString()}</span>
                                                </div>
                                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-[#5f3bff] rounded-full"
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Segment details */}
                        <div className="bg-white border border-gray-200 rounded-xl p-5">
                            <h3 className="text-sm font-semibold text-gray-700 mb-4">Segment Details</h3>
                            <div className="space-y-3">
                                {DEFAULT_AUDIENCE_SEGMENTS.map((segment) => (
                                    <div key={segment.id} className="p-4 bg-gray-50 rounded-lg">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-medium text-gray-900">{segment.name}</h4>
                                            <span className="text-sm font-medium text-[#5f3bff]">
                                                {segment.count.toLocaleString()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 mb-2">{segment.description}</p>
                                        <div className="flex flex-wrap gap-1">
                                            {segment.tags.map(tag => (
                                                <span
                                                    key={tag}
                                                    className="px-2 py-0.5 text-xs bg-white text-gray-600 rounded border border-gray-200"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ToolLayout>
    )
}
