'use client'

import { useState } from 'react'
import { MessageSquarePlus, History, Bug } from 'lucide-react'
import { FeedbackForm, FeedbackHistory, IssueReporter } from '@/components/feedback'

type TabId = 'submit' | 'history' | 'report-issue'

export default function FeedbackPage() {
    const [activeTab, setActiveTab] = useState<TabId>('submit')
    const [historyRefreshKey, setHistoryRefreshKey] = useState(0)

    const handleFeedbackSuccess = () => {
        // Trigger history refresh when new feedback is submitted
        setHistoryRefreshKey(prev => prev + 1)
    }

    const tabs: { id: TabId; label: string; icon: typeof MessageSquarePlus }[] = [
        { id: 'submit', label: 'Submit Feedback', icon: MessageSquarePlus },
        { id: 'report-issue', label: 'Report Issue', icon: Bug },
        { id: 'history', label: 'My Submissions', icon: History },
    ]

    return (
        <div className="max-w-3xl mx-auto">
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Feedback & Support</h1>
                <p className="text-gray-500 mt-1">
                    Help us improve by sharing your feedback, reporting issues, or requesting features
                </p>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="flex border-b border-gray-200">
                    {tabs.map(tab => {
                        const Icon = tab.icon
                        const isActive = activeTab === tab.id

                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                                    isActive
                                        ? 'text-violet-600 bg-violet-50 border-b-2 border-violet-600 -mb-px'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span className="hidden sm:inline">{tab.label}</span>
                            </button>
                        )
                    })}
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    {activeTab === 'submit' && (
                        <div>
                            <div className="mb-6">
                                <h2 className="text-lg font-semibold text-gray-900">Share Your Feedback</h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    Your feedback helps us build better tools for your business
                                </p>
                            </div>
                            <FeedbackForm onSuccess={handleFeedbackSuccess} />
                        </div>
                    )}

                    {activeTab === 'report-issue' && (
                        <IssueReporter onSuccess={handleFeedbackSuccess} />
                    )}

                    {activeTab === 'history' && (
                        <div>
                            <div className="mb-6">
                                <h2 className="text-lg font-semibold text-gray-900">Your Submissions</h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    Track the status of your feedback and support requests
                                </p>
                            </div>
                            <FeedbackHistory refreshTrigger={historyRefreshKey} />
                        </div>
                    )}
                </div>
            </div>

            {/* Help Card */}
            <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Need immediate help?</h3>
                <p className="text-sm text-gray-600">
                    For urgent issues or account questions, contact our support team at{' '}
                    <a
                        href="mailto:support@solidframe.ai"
                        className="text-violet-600 hover:text-violet-700 font-medium"
                    >
                        support@solidframe.ai
                    </a>
                </p>
            </div>
        </div>
    )
}
