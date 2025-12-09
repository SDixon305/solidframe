'use client'

import { useState, useEffect } from 'react'
import { Bug, ChevronDown, ChevronUp, Monitor, Globe, Clock } from 'lucide-react'
import { FeedbackForm } from './FeedbackForm'

interface BrowserContext {
    userAgent: string
    platform: string
    language: string
    screenSize: string
    timezone: string
    url: string
    timestamp: string
}

interface IssueReporterProps {
    onSuccess?: () => void
    initialToolId?: string
    showContextByDefault?: boolean
}

export function IssueReporter({ onSuccess, initialToolId, showContextByDefault = false }: IssueReporterProps) {
    const [browserContext, setBrowserContext] = useState<BrowserContext | null>(null)
    const [showContext, setShowContext] = useState(showContextByDefault)

    // Capture browser context on mount
    useEffect(() => {
        const context: BrowserContext = {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            screenSize: `${window.screen.width}x${window.screen.height}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            url: window.location.href,
            timestamp: new Date().toISOString(),
        }
        setBrowserContext(context)
    }, [])

    // Format user agent for display
    const formatUserAgent = (ua: string): string => {
        // Extract browser name and version
        if (ua.includes('Chrome')) {
            const match = ua.match(/Chrome\/(\d+)/)
            return `Chrome ${match?.[1] || ''}`
        }
        if (ua.includes('Firefox')) {
            const match = ua.match(/Firefox\/(\d+)/)
            return `Firefox ${match?.[1] || ''}`
        }
        if (ua.includes('Safari') && !ua.includes('Chrome')) {
            const match = ua.match(/Version\/(\d+)/)
            return `Safari ${match?.[1] || ''}`
        }
        if (ua.includes('Edge')) {
            const match = ua.match(/Edg\/(\d+)/)
            return `Edge ${match?.[1] || ''}`
        }
        return 'Unknown Browser'
    }

    // Format platform for display
    const formatPlatform = (platform: string): string => {
        if (platform.includes('Win')) return 'Windows'
        if (platform.includes('Mac')) return 'macOS'
        if (platform.includes('Linux')) return 'Linux'
        if (platform.includes('iPhone') || platform.includes('iPad')) return 'iOS'
        if (platform.includes('Android')) return 'Android'
        return platform
    }

    return (
        <div className="space-y-6">
            {/* Bug Report Header */}
            <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                <div className="p-2 bg-red-100 rounded-lg">
                    <Bug className="w-5 h-5 text-red-600" />
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900">Report an Issue</h3>
                    <p className="text-sm text-gray-500">Help us fix bugs by providing details about what went wrong</p>
                </div>
            </div>

            {/* Browser Context Panel */}
            {browserContext && (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                        type="button"
                        onClick={() => setShowContext(!showContext)}
                        className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                        <span className="text-sm font-medium text-gray-700">
                            System Information (auto-captured)
                        </span>
                        {showContext ? (
                            <ChevronUp className="w-4 h-4 text-gray-500" />
                        ) : (
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                        )}
                    </button>

                    {showContext && (
                        <div className="p-4 space-y-3 bg-white">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                <div className="flex items-center gap-2">
                                    <Globe className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-500">Browser:</span>
                                    <span className="text-gray-900">{formatUserAgent(browserContext.userAgent)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Monitor className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-500">Platform:</span>
                                    <span className="text-gray-900">{formatPlatform(browserContext.platform)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Monitor className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-500">Screen:</span>
                                    <span className="text-gray-900">{browserContext.screenSize}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-500">Timezone:</span>
                                    <span className="text-gray-900">{browserContext.timezone}</span>
                                </div>
                            </div>
                            <p className="text-xs text-gray-400">
                                This information helps us reproduce and fix the issue faster.
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Feedback Form (pre-set to bug type) */}
            <FeedbackForm
                onSuccess={onSuccess}
                initialType="bug"
                initialToolId={initialToolId}
            />
        </div>
    )
}
