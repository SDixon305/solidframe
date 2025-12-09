'use client'

import React, { useState, useMemo } from 'react'
import { LayoutGrid, Settings, Activity, Star } from 'lucide-react'
import { useTenantContext } from '@/lib/tenant-context'
import { ToolLayout, ToolHeader, ToolTabs, Tab, ActivityLog, MessageTemplateEditor } from '@/components/tools'
import { StarRatingDisplay, FunnelChart, TriggerConfig } from '@/components/tools/reviews'
import { generateActivityLog } from '@/lib/fake-data'

const TABS: Tab[] = [
    { id: 'overview', label: 'Overview', icon: LayoutGrid },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'activity', label: 'Activity', icon: Activity },
]

const DEFAULT_TEMPLATE = `Hi {firstName}! Thanks for choosing {businessName} for your recent {serviceType}. We'd love to hear about your experience! Leave us a quick review: {reviewLink}`

const TEMPLATE_VARIABLES = [
    { key: 'firstName', label: 'First Name', example: 'John' },
    { key: 'businessName', label: 'Business Name', example: 'Acme HVAC' },
    { key: 'serviceType', label: 'Service Type', example: 'AC repair' },
    { key: 'reviewLink', label: 'Review Link', example: 'g.page/r/acme-hvac' },
]

// Seeded random for consistent data
function seededRandom(seed: number): () => number {
    return () => {
        seed = (seed * 9301 + 49297) % 233280
        return seed / 233280
    }
}

export default function ReviewRequestPage() {
    const { tenant, getTool } = useTenantContext()
    const tool = getTool('review-request')

    const [activeTab, setActiveTab] = useState('overview')
    const [hoursDelay, setHoursDelay] = useState(4)
    const [messageTemplate, setMessageTemplate] = useState(
        DEFAULT_TEMPLATE.replace('{businessName}', tenant.name)
    )

    // Generate fake data
    const reviewData = useMemo(() => {
        const seed = tenant.id.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
        const random = seededRandom(seed)

        const createdAt = new Date(tenant.created_at)
        const daysSince = Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24))

        const sent = Math.floor(daysSince * 3.2) + 20
        const clicked = Math.floor(sent * (0.55 + random() * 0.15))
        const reviewed = Math.floor(clicked * (0.4 + random() * 0.15))

        const distribution = {
            5: Math.floor(reviewed * 0.65),
            4: Math.floor(reviewed * 0.22),
            3: Math.floor(reviewed * 0.08),
            2: Math.floor(reviewed * 0.03),
            1: Math.floor(reviewed * 0.02),
        }

        const totalDistribution = Object.values(distribution).reduce((a, b) => a + b, 0)
        const averageRating = totalDistribution > 0
            ? (distribution[5] * 5 + distribution[4] * 4 + distribution[3] * 3 + distribution[2] * 2 + distribution[1] * 1) / totalDistribution
            : 4.7

        return {
            sent,
            clicked,
            reviewed,
            averageRating,
            distribution,
        }
    }, [tenant.id, tenant.created_at])

    const activity = useMemo(() =>
        generateActivityLog(new Date(tenant.created_at), 'review-request', tenant.id, 30),
        [tenant.created_at, tenant.id]
    )

    // Recent reviews for display
    const recentReviews = useMemo(() => {
        const seed = (tenant.id + 'reviews').split('').reduce((a, b) => a + b.charCodeAt(0), 0)
        const random = seededRandom(seed)

        const names = ['Sarah M.', 'John D.', 'Mike R.', 'Emily T.', 'David L.']
        const reviews = [
            "Great service! The technician was professional and fixed our AC quickly.",
            "Very responsive and fair pricing. Will definitely use again.",
            "On time, courteous, and did excellent work. Highly recommend!",
            "Best HVAC company in the area. They really know their stuff.",
            "Fixed our heating issue same day. Couldn't be happier!",
        ]

        return names.slice(0, 3).map((name, i) => ({
            id: `review-${i}`,
            name,
            rating: Math.floor(random() * 2) + 4,
            text: reviews[i],
            date: new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000 * (Math.floor(random() * 5) + 1)),
        }))
    }, [tenant.id])

    const handleSaveTemplate = (template: string) => {
        setMessageTemplate(template)
        console.log('Saved template:', template)
    }

    const handleSaveTrigger = (hours: number) => {
        setHoursDelay(hours)
        console.log('Saved trigger delay:', hours)
    }

    if (!tool) {
        return <div>Tool not found</div>
    }

    return (
        <ToolLayout>
            <ToolHeader
                slug="review-request"
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
                    {/* Stats Grid */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <StarRatingDisplay
                            averageRating={reviewData.averageRating}
                            totalReviews={reviewData.reviewed}
                            distribution={reviewData.distribution}
                        />
                        <FunnelChart
                            sent={reviewData.sent}
                            clicked={reviewData.clicked}
                            reviewed={reviewData.reviewed}
                        />
                    </div>

                    {/* Recent Reviews */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Recent Reviews</h3>
                        <div className="space-y-4">
                            {recentReviews.map((review) => (
                                <div
                                    key={review.id}
                                    className="p-4 bg-gray-50 rounded-lg"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-gray-900">
                                                {review.name}
                                            </span>
                                            <div className="flex items-center">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={12}
                                                        className={
                                                            i < review.rating
                                                                ? 'text-amber-400 fill-amber-400'
                                                                : 'text-gray-200'
                                                        }
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-400">
                                            {review.date.toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600">{review.text}</p>
                                </div>
                            ))}
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
                    <TriggerConfig
                        hoursDelay={hoursDelay}
                        onSave={handleSaveTrigger}
                    />

                    <MessageTemplateEditor
                        label="Review Request Message"
                        template={messageTemplate}
                        onSave={handleSaveTemplate}
                        variables={TEMPLATE_VARIABLES}
                        maxLength={300}
                    />

                    {/* Review Platform Settings */}
                    <div className="bg-white border border-gray-200 rounded-xl p-5">
                        <h3 className="font-semibold text-gray-900 mb-4">Review Platforms</h3>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-lg">
                                        🔵
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">Google Reviews</div>
                                        <div className="text-xs text-gray-500">Primary platform</div>
                                    </div>
                                </div>
                                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded">
                                    Connected
                                </span>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg opacity-50">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-lg">
                                        📘
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">Facebook</div>
                                        <div className="text-xs text-gray-500">Coming soon</div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg opacity-50">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-lg">
                                        🟡
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">Yelp</div>
                                        <div className="text-xs text-gray-500">Coming soon</div>
                                    </div>
                                </div>
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
