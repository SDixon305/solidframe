'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
    Phone,
    MessageCircle,
    Star,
    Calendar,
    DollarSign,
    Megaphone,
    RefreshCw,
    GraduationCap,
    ArrowRight,
    TrendingUp,
    TrendingDown,
    Minus,
} from 'lucide-react'
import { ClientTool, ToolSlug } from '@/lib/fake-data'
import { useTenantContext } from '@/lib/tenant-context'

// Icon mapping for tools
const TOOL_ICON_MAP: Record<ToolSlug, React.ElementType> = {
    'after-hours-agent': Phone,
    'missed-call-textback': MessageCircle,
    'review-request': Star,
    'appointment-reminders': Calendar,
    'quote-reviver': DollarSign,
    'seasonal-campaigns': Megaphone,
    'maintenance-renewal': RefreshCw,
    'tech-training': GraduationCap,
}

interface ClientToolCardProps {
    tool: ClientTool
    index?: number
}

export default function ClientToolCard({ tool, index = 0 }: ClientToolCardProps) {
    const { tenant } = useTenantContext()
    const Icon = TOOL_ICON_MAP[tool.slug]
    const href = `/${tenant.slug}/tools/${tool.slug}`

    const TrendIcon = tool.metrics.primary.trend === 'up'
        ? TrendingUp
        : tool.metrics.primary.trend === 'down'
            ? TrendingDown
            : Minus

    const trendColor = tool.metrics.primary.trend === 'up'
        ? 'text-emerald-600'
        : tool.metrics.primary.trend === 'down'
            ? 'text-red-500'
            : 'text-gray-400'

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
        >
            <Link href={href} className="block group">
                <div className="h-full bg-white border border-gray-200 rounded-xl p-5 hover:border-[#5f3bff]/30 hover:shadow-lg hover:shadow-[#5f3bff]/5 transition-all duration-200 hover:-translate-y-0.5">
                    {/* Top Row: Icon & Status */}
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-[#5f3bff] to-[#4f2fe0] shadow-sm group-hover:shadow-md group-hover:shadow-[#5f3bff]/20 transition-shadow">
                            <Icon size={24} className="text-white" />
                        </div>

                        <div className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                            tool.isActive
                                ? 'text-emerald-700 border-emerald-200 bg-emerald-50'
                                : 'text-gray-500 border-gray-200 bg-gray-50'
                        }`}>
                            {tool.isActive ? 'Active' : 'Inactive'}
                        </div>
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-base font-semibold text-gray-900 mb-1.5 group-hover:text-[#5f3bff] transition-colors">
                        {tool.name}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">
                        {tool.description}
                    </p>

                    {/* Metrics */}
                    <div className="pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-xs text-gray-400 mb-0.5">
                                    {tool.metrics.primary.label}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-lg font-bold text-gray-900">
                                        {tool.metrics.primary.value}
                                    </span>
                                    {tool.metrics.primary.trend && (
                                        <span className={`flex items-center gap-0.5 text-xs ${trendColor}`}>
                                            <TrendIcon size={12} />
                                            {tool.metrics.primary.trendValue}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {tool.metrics.secondary && (
                                <div className="text-right">
                                    <div className="text-xs text-gray-400 mb-0.5">
                                        {tool.metrics.secondary.label}
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">
                                        {tool.metrics.secondary.value}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Hover Action Indicator */}
                    <div className="mt-4 flex items-center gap-1.5 text-sm font-medium text-[#5f3bff] opacity-0 group-hover:opacity-100 transition-opacity">
                        <span>View Details</span>
                        <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            </Link>
        </motion.div>
    )
}

// Grid wrapper for tool cards
interface ToolGridProps {
    tools: ClientTool[]
}

export function ClientToolGrid({ tools }: ToolGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {tools.map((tool, index) => (
                <ClientToolCard key={tool.slug} tool={tool} index={index} />
            ))}
        </div>
    )
}
