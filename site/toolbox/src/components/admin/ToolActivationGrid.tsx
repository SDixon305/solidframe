'use client'

import { useState } from 'react'
import { Check, X, Phone, MessageSquare, Calendar, TrendingUp, Star, Wrench, Loader2 } from 'lucide-react'
import type { DbTool } from '@/types/tools'
import type { TenantToolWithInfo } from '@/types/tenants'

interface ToolActivationGridProps {
    tools: DbTool[]
    tenantTools: TenantToolWithInfo[]
    onToggle: (toolId: string, isActive: boolean) => Promise<void>
    isLoading?: boolean
}

const toolIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    'after-hours-agent': Phone,
    'missed-call-textback': MessageSquare,
    'review-request-bot': Star,
    'appointment-reminders': Calendar,
    'quote-reviver': TrendingUp,
    'seasonal-campaigns': Calendar,
    'maintenance-renewal': Wrench,
    'tech-training': Wrench,
}

const toolColors: Record<string, { bg: string; text: string; border: string }> = {
    'after-hours-agent': { bg: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-200' },
    'missed-call-textback': { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
    'review-request-bot': { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
    'appointment-reminders': { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' },
    'quote-reviver': { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' },
    'seasonal-campaigns': { bg: 'bg-pink-50', text: 'text-pink-600', border: 'border-pink-200' },
    'maintenance-renewal': { bg: 'bg-cyan-50', text: 'text-cyan-600', border: 'border-cyan-200' },
    'tech-training': { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200' },
}

export function ToolActivationGrid({ tools, tenantTools, onToggle, isLoading }: ToolActivationGridProps) {
    const [loadingToolId, setLoadingToolId] = useState<string | null>(null)

    const isToolActive = (toolId: string): boolean => {
        const tenantTool = tenantTools.find(tt => tt.tool_id === toolId)
        return tenantTool?.is_active ?? false
    }

    const handleToggle = async (toolId: string) => {
        const currentState = isToolActive(toolId)
        setLoadingToolId(toolId)
        try {
            await onToggle(toolId, !currentState)
        } finally {
            setLoadingToolId(null)
        }
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {tools.map(tool => {
                const Icon = toolIcons[tool.slug] || Wrench
                const colors = toolColors[tool.slug] || { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200' }
                const active = isToolActive(tool.id)
                const loading = loadingToolId === tool.id

                return (
                    <div
                        key={tool.id}
                        className={`relative p-4 rounded-xl border-2 transition-all ${
                            active
                                ? `${colors.border} ${colors.bg}`
                                : 'border-gray-200 bg-gray-50 opacity-60'
                        }`}
                    >
                        {/* Real/Demo Badge */}
                        {tool.is_real && (
                            <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-emerald-500 text-white text-xs font-bold rounded-full">
                                LIVE
                            </div>
                        )}

                        <div className="flex items-start justify-between mb-3">
                            {/* Icon */}
                            <div className={`p-2.5 rounded-lg ${active ? colors.bg : 'bg-gray-100'}`}>
                                <Icon className={`w-5 h-5 ${active ? colors.text : 'text-gray-400'}`} />
                            </div>

                            {/* Toggle */}
                            <button
                                onClick={() => handleToggle(tool.id)}
                                disabled={loading || isLoading}
                                className={`relative w-12 h-6 rounded-full transition-colors ${
                                    active ? 'bg-violet-600' : 'bg-gray-300'
                                } ${loading || isLoading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                            >
                                {loading ? (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Loader2 className="w-4 h-4 text-white animate-spin" />
                                    </div>
                                ) : (
                                    <div
                                        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                                            active ? 'translate-x-6' : 'translate-x-0.5'
                                        }`}
                                    >
                                        {active ? (
                                            <Check className="w-3 h-3 text-violet-600 absolute top-1 left-1" />
                                        ) : (
                                            <X className="w-3 h-3 text-gray-400 absolute top-1 left-1" />
                                        )}
                                    </div>
                                )}
                            </button>
                        </div>

                        {/* Tool Name */}
                        <h4 className={`font-semibold mb-1 ${active ? 'text-gray-900' : 'text-gray-500'}`}>
                            {tool.name}
                        </h4>

                        {/* Description */}
                        <p className={`text-sm ${active ? 'text-gray-600' : 'text-gray-400'}`}>
                            {tool.description || 'No description available'}
                        </p>

                        {/* Status */}
                        <div className="mt-3 pt-3 border-t border-gray-100">
                            <span className={`text-xs font-medium ${active ? 'text-emerald-600' : 'text-gray-400'}`}>
                                {active ? 'Enabled' : 'Disabled'}
                            </span>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
