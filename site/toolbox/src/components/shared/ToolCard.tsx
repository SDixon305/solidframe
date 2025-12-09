'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Zap, Construction, ArrowRight } from 'lucide-react'
import Link from 'next/link'

import { IconMap, Tool } from '@/lib/toolbox-data'
import { statusColors, statusLabels } from '@/lib/theme'

interface ToolCardProps {
    tool: Tool
    folderId: string
    index?: number
    // Optional overrides for demo/client modes
    linkOverride?: string
    actionLabel?: string
    onAction?: () => void
    disabled?: boolean
}

export default function ToolCard({
    tool,
    folderId,
    index = 0,
    linkOverride,
    actionLabel,
    onAction,
    disabled = false,
}: ToolCardProps) {
    const ToolIcon = IconMap[tool.icon] || Zap

    const isReady = tool.status === 'priority' || tool.status === 'live'
    const buttonLabel = actionLabel || (tool.status === 'live' ? 'Open' : 'Launch')

    // Determine link destination
    const getLink = () => {
        if (linkOverride) return linkOverride
        if (tool.id === 'roi-projector') return '/tools/roi-projector'
        if (tool.id === 'instant-demo') return '/afterhours-agent'
        return null
    }

    const link = getLink()

    const ActionButton = () => {
        if (!isReady || disabled) {
            return (
                <div className="flex items-center gap-2 text-xs font-medium text-slate-400 px-3 py-1.5">
                    <Construction size={14} />
                    Locked
                </div>
            )
        }

        const buttonClasses = `px-4 py-2.5 rounded-lg text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md`

        if (onAction) {
            return (
                <button onClick={onAction} className={buttonClasses}>
                    {buttonLabel}
                    <ArrowRight size={14} />
                </button>
            )
        }

        if (link) {
            return (
                <Link href={link} className={buttonClasses}>
                    {buttonLabel}
                    <ArrowRight size={14} />
                </Link>
            )
        }

        return (
            <button className={buttonClasses}>
                {buttonLabel}
                <ArrowRight size={14} />
            </button>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="group"
        >
            <div className="h-full bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5">
                {/* Top Row: Icon & Status */}
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 rounded-xl bg-slate-900 shadow-sm">
                        <ToolIcon
                            size={24}
                            className="text-amber-400"
                        />
                    </div>

                    <div className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[tool.status] || statusColors.planned}`}>
                        {statusLabels[tool.status] || 'Planned'}
                    </div>
                </div>

                {/* Text Content */}
                <h3 className="text-base font-semibold text-slate-900 mb-2">
                    {tool.name}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">
                    {tool.description}
                </p>

                {/* Bottom Action Area */}
                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium">
                        v1.0.2
                    </span>
                    <ActionButton />
                </div>
            </div>
        </motion.div>
    )
}
