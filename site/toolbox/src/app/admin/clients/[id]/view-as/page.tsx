'use client'

import { useState } from 'react'
import { useClient } from '../layout'
import { ExternalLink, Monitor, Smartphone, Tablet, Maximize2, AlertTriangle, Eye } from 'lucide-react'

type DeviceType = 'desktop' | 'tablet' | 'mobile'

const deviceSizes: Record<DeviceType, { width: string; height: string }> = {
    desktop: { width: '100%', height: '800px' },
    tablet: { width: '768px', height: '1024px' },
    mobile: { width: '375px', height: '812px' },
}

export default function ClientViewAsPage() {
    const { client } = useClient()
    const [device, setDevice] = useState<DeviceType>('desktop')
    const [isFullscreen, setIsFullscreen] = useState(false)

    if (!client) {
        return null
    }

    const portalUrl = `https://${client.slug}.toolbox.solidframe.ai`
    const demoUrl = `/client-demo?tenant=${client.slug}&readonly=true`

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">View as Client</h2>
                    <p className="text-sm text-gray-500">
                        Preview what {client.name} sees in their portal
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Device Selector */}
                    <div className="flex items-center bg-white border border-gray-200 rounded-lg p-1">
                        <button
                            onClick={() => setDevice('desktop')}
                            className={`p-2 rounded-md transition-colors ${
                                device === 'desktop'
                                    ? 'bg-violet-100 text-violet-600'
                                    : 'text-gray-400 hover:text-gray-600'
                            }`}
                            title="Desktop"
                        >
                            <Monitor className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setDevice('tablet')}
                            className={`p-2 rounded-md transition-colors ${
                                device === 'tablet'
                                    ? 'bg-violet-100 text-violet-600'
                                    : 'text-gray-400 hover:text-gray-600'
                            }`}
                            title="Tablet"
                        >
                            <Tablet className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setDevice('mobile')}
                            className={`p-2 rounded-md transition-colors ${
                                device === 'mobile'
                                    ? 'bg-violet-100 text-violet-600'
                                    : 'text-gray-400 hover:text-gray-600'
                            }`}
                            title="Mobile"
                        >
                            <Smartphone className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Fullscreen Toggle */}
                    <button
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-gray-700 transition-colors"
                        title="Toggle fullscreen"
                    >
                        <Maximize2 className="w-4 h-4" />
                    </button>

                    {/* Open in New Tab */}
                    <a
                        href={portalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                        <ExternalLink className="w-4 h-4" />
                        Open Portal
                    </a>
                </div>
            </div>

            {/* Read-Only Banner */}
            <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-100 rounded-lg">
                <Eye className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <div className="text-sm text-amber-800">
                    <p className="font-medium">Read-Only Preview</p>
                    <p className="text-amber-700">
                        This is a preview of the client portal. Actions and changes are disabled.
                    </p>
                </div>
            </div>

            {/* Preview Frame */}
            <div
                className={`bg-white rounded-xl border border-gray-200 overflow-hidden transition-all ${
                    isFullscreen ? 'fixed inset-4 z-50' : ''
                }`}
            >
                {/* Browser Chrome */}
                <div className="bg-gray-100 border-b border-gray-200 p-3">
                    <div className="flex items-center gap-3">
                        {/* Window Controls */}
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-400" />
                            <div className="w-3 h-3 rounded-full bg-yellow-400" />
                            <div className="w-3 h-3 rounded-full bg-green-400" />
                        </div>

                        {/* URL Bar */}
                        <div className="flex-1 flex items-center gap-2 bg-white rounded-md px-3 py-1.5 border border-gray-200">
                            <span className="text-xs text-emerald-600 font-medium">https://</span>
                            <span className="text-sm text-gray-600 font-mono">
                                {client.slug}.toolbox.solidframe.ai
                            </span>
                        </div>
                    </div>
                </div>

                {/* Iframe Container */}
                <div
                    className={`flex items-start justify-center bg-gray-50 overflow-auto ${
                        isFullscreen ? 'h-[calc(100%-48px)]' : ''
                    }`}
                    style={!isFullscreen ? { minHeight: '600px' } : {}}
                >
                    <div
                        className={`bg-white shadow-lg transition-all ${
                            device !== 'desktop' ? 'my-4 rounded-lg overflow-hidden' : ''
                        }`}
                        style={deviceSizes[device]}
                    >
                        {/* Demo Content Placeholder */}
                        <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                            <div className="w-16 h-16 rounded-full bg-violet-100 flex items-center justify-center mb-4">
                                <Eye className="w-8 h-8 text-violet-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Client Portal Preview
                            </h3>
                            <p className="text-gray-500 max-w-md mb-6">
                                The client portal for {client.name} would be displayed here.
                                This shows exactly what the client sees when they log in.
                            </p>

                            <div className="flex flex-col gap-4">
                                <a
                                    href={demoUrl}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-colors"
                                >
                                    <Monitor className="w-4 h-4" />
                                    View Demo Portal
                                </a>

                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                    <AlertTriangle className="w-4 h-4" />
                                    <span>Full iframe preview coming in a future update</span>
                                </div>
                            </div>

                            {/* Quick Info */}
                            <div className="mt-8 grid grid-cols-3 gap-6 text-center">
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">{client.active_tool_count || 0}</p>
                                    <p className="text-sm text-gray-500">Active Tools</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">{client.user_count || 0}</p>
                                    <p className="text-sm text-gray-500">Team Members</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900 capitalize">{client.status}</p>
                                    <p className="text-sm text-gray-500">Status</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Fullscreen Escape Notice */}
            {isFullscreen && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
                    <button
                        onClick={() => setIsFullscreen(false)}
                        className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium shadow-lg"
                    >
                        Press ESC or click to exit fullscreen
                    </button>
                </div>
            )}
        </div>
    )
}
