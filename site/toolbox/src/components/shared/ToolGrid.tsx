'use client'

import React from 'react'
import { AnimatePresence } from 'framer-motion'
import { Tool } from '@/lib/toolbox-data'
import ToolCard from './ToolCard'

interface ToolGridProps {
    tools: Tool[]
    folderId: string
    // Optional overrides for demo/client modes
    getLinkOverride?: (tool: Tool) => string | undefined
    getActionLabel?: (tool: Tool) => string | undefined
    onToolAction?: (tool: Tool) => void
    disabledTools?: string[]
}

export default function ToolGrid({
    tools,
    folderId,
    getLinkOverride,
    getActionLabel,
    onToolAction,
    disabledTools = [],
}: ToolGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 max-w-7xl mx-auto">
            <AnimatePresence mode="popLayout">
                {tools.map((tool, index) => (
                    <ToolCard
                        key={tool.id}
                        tool={tool}
                        folderId={folderId}
                        index={index}
                        linkOverride={getLinkOverride?.(tool)}
                        actionLabel={getActionLabel?.(tool)}
                        onAction={onToolAction ? () => onToolAction(tool) : undefined}
                        disabled={disabledTools.includes(tool.id)}
                    />
                ))}
            </AnimatePresence>
        </div>
    )
}
