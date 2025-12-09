'use client'

import { useState, useMemo } from 'react'
import { LayoutGrid, ListOrdered, FileText, Activity } from 'lucide-react'
import { useTenantContext } from '@/lib/tenant-context'
import { generateActivityLog } from '@/lib/fake-data'
import ToolLayout from '@/components/tools/ToolLayout'
import ToolHeader from '@/components/tools/ToolHeader'
import ToolTabs, { Tab } from '@/components/tools/ToolTabs'
import ActivityLog, { CompactActivityLog } from '@/components/tools/ActivityLog'
import SequenceBuilder, { DEFAULT_QUOTE_SEQUENCE, SequenceStep } from '@/components/tools/quotes/SequenceBuilder'
import PipelineView, { generatePipelineData } from '@/components/tools/quotes/PipelineView'
import RecoveryMetrics, { generateQuoteMetrics } from '@/components/tools/quotes/RecoveryMetrics'
import QuoteList, { generateFakeQuotes } from '@/components/tools/quotes/QuoteList'

const TABS: Tab[] = [
    { id: 'overview', label: 'Overview', icon: LayoutGrid },
    { id: 'sequence', label: 'Sequence', icon: ListOrdered },
    { id: 'quotes', label: 'Quotes', icon: FileText },
    { id: 'activity', label: 'Activity', icon: Activity },
]

export default function QuoteReviverPage() {
    const { tenant, getTool } = useTenantContext()
    const [activeTab, setActiveTab] = useState('overview')
    const [sequence, setSequence] = useState<SequenceStep[]>(DEFAULT_QUOTE_SEQUENCE)

    const tool = getTool('quote-reviver')
    const tenantCreatedAt = new Date(tenant.created_at)

    // Generate fake data
    const pipeline = useMemo(() => generatePipelineData(tenant.id), [tenant.id])
    const metrics = useMemo(() => generateQuoteMetrics(tenantCreatedAt, tenant.id), [tenant.id])
    const quotes = useMemo(() => generateFakeQuotes(tenant.id, 25), [tenant.id])
    const activity = useMemo(
        () => generateActivityLog(tenantCreatedAt, 'quote-reviver', tenant.id, 20),
        [tenant.id]
    )

    if (!tool) return null

    return (
        <ToolLayout>
            <ToolHeader
                slug="quote-reviver"
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
                        {/* Top metrics row */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <RecoveryMetrics metrics={metrics} compact />
                            <div className="bg-white border border-gray-200 rounded-xl p-5">
                                <h3 className="text-sm font-semibold text-gray-700 mb-4">Active Sequence</h3>
                                <SequenceBuilder sequence={sequence} onSequenceChange={setSequence} compact />
                                <button
                                    onClick={() => setActiveTab('sequence')}
                                    className="mt-4 text-sm text-[#5f3bff] hover:text-[#4f2fe0] font-medium"
                                >
                                    Edit Sequence →
                                </button>
                            </div>
                        </div>

                        {/* Pipeline */}
                        <PipelineView stages={pipeline} />

                        {/* Recent activity */}
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
                    </>
                )}

                {activeTab === 'sequence' && (
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <div className="max-w-2xl">
                            <div className="mb-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-2">Follow-up Sequence</h2>
                                <p className="text-sm text-gray-500">
                                    Customize the automated follow-up sequence for stale quotes. Each step can be enabled or disabled independently.
                                </p>
                            </div>

                            <SequenceBuilder sequence={sequence} onSequenceChange={setSequence} />

                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <h4 className="text-sm font-medium text-gray-700 mb-3">Available Variables</h4>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        { key: 'customer_name', label: 'Customer Name' },
                                        { key: 'quote_amount', label: 'Quote Amount' },
                                        { key: 'company_name', label: 'Company Name' },
                                        { key: 'company_phone', label: 'Company Phone' },
                                        { key: 'service_type', label: 'Service Type' },
                                    ].map(v => (
                                        <span
                                            key={v.key}
                                            className="px-2.5 py-1 text-xs font-mono bg-gray-100 text-gray-600 rounded"
                                        >
                                            {`{${v.key}}`}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-6 p-4 bg-amber-50 border border-amber-100 rounded-lg">
                                <p className="text-sm text-amber-700">
                                    <strong>Demo Mode:</strong> Changes to the sequence are saved locally but won't trigger actual follow-ups.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'quotes' && (
                    <>
                        {/* Full metrics display */}
                        <RecoveryMetrics metrics={metrics} />

                        {/* Quote list */}
                        <QuoteList
                            quotes={quotes}
                            onContactCustomer={(quote, method) => {
                                console.log(`Contact ${quote.customerName} via ${method}`)
                            }}
                            onMarkWon={(quote) => {
                                console.log(`Mark ${quote.id} as won`)
                            }}
                            onMarkLost={(quote) => {
                                console.log(`Mark ${quote.id} as lost`)
                            }}
                        />
                    </>
                )}

                {activeTab === 'activity' && (
                    <ActivityLog entries={activity} showViewAll={false} />
                )}
            </div>
        </ToolLayout>
    )
}
