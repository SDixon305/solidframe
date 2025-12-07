'use client'

import React from 'react'

import { AnimatePresence, motion } from 'framer-motion'
import ToolDetailModal from './modals/ToolDetailModal'
import { useState } from 'react'
import Link from 'next/link'
import {
    ArrowLeft,
    CheckCircle2,
    Clock,
    Construction,
    Zap,
    Activity
} from 'lucide-react'

import SpotlightCard from './SpotlightCard'
import { IconMap, statusColors, statusLabels, Tool } from '@/lib/toolbox-data'
import { useToolbox } from '@/hooks/use-toolbox'

export default function ToolboxStatusBoard() {
    const [selectedTool, setSelectedTool] = useState<Tool | null>(null)
    const { folders } = useToolbox()

    // Flatten tools into a single list
    const allTools: Tool[] = Object.values(folders).flatMap(folder => folder.tools)

    // Group tools by status
    const liveTools = allTools.filter(t => t.status === 'live')
    const buildingTools = allTools.filter(t => t.status === 'priority' || t.status === 'building')
    const backlogTools = allTools.filter(t => t.status === 'planned')

    const columns = [
        { title: 'Live', icon: CheckCircle2, tools: liveTools, color: 'text-emerald-400', borderColor: 'border-emerald-500/20' },
        { title: 'In Construction', icon: Construction, tools: buildingTools, color: 'text-amber-400', borderColor: 'border-amber-500/20' },
        { title: 'Queue', icon: Clock, tools: backlogTools, color: 'text-zinc-400', borderColor: 'border-zinc-700/50' },
    ]

    return (
        <div className="flex h-screen font-sans text-white">
            {/* Minimal Sidebar for Navigation */}
            <aside className="w-20 lg:w-72 glass-panel border-r-0 border-r-white/5 flex flex-col z-20">
                <div className="p-6 border-b border-white/5 flex items-center gap-3">
                    <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group">
                        <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors">
                            <ArrowLeft size={20} />
                        </div>
                        <span className="hidden lg:block font-medium">Back</span>
                    </Link>
                </div>

                <div className="p-6">
                    <h1 className="hidden lg:block text-xl font-bold mb-2">Status Board</h1>
                    <p className="hidden lg:block text-sm text-zinc-500">Track the development progress of all SolidFrame tools.</p>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 relative overflow-hidden flex flex-col z-10">
                {/* Header */}
                <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-black/20 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <Activity className="text-indigo-400" />
                        <h2 className="text-lg font-medium">System Development Status</h2>
                    </div>
                </header>

                {/* Kanban Board */}
                <div className="flex-1 overflow-x-auto overflow-y-hidden p-8">
                    <div className="flex h-full gap-6 min-w-[1000px]">
                        {columns.map((col) => (
                            <div key={col.title} className="flex-1 flex flex-col min-w-[320px]">
                                <div className={`flex items-center gap-2 mb-4 px-2 py-1 border-b leading-none ${col.color} ${col.borderColor}`}>
                                    <col.icon size={16} />
                                    <h3 className="font-bold uppercase tracking-wider text-sm">{col.title}</h3>
                                    <span className="ml-auto text-xs opacity-60 bg-white/5 px-2 py-0.5 rounded-full">{col.tools.length}</span>
                                </div>

                                <div className="flex-1 overflow-y-auto space-y-4 pr-2 pb-10 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                                    {col.tools.map((tool, index) => {
                                        const ToolIcon = IconMap[tool.icon] || Zap
                                        return (
                                            <motion.div
                                                key={tool.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                onClick={() => setSelectedTool(tool)}
                                                className="cursor-pointer"
                                            >
                                                <SpotlightCard
                                                    className="glass-panel rounded-lg p-4 border border-white/5 hover:border-white/10 transition-colors group"
                                                    spotlightColor="rgba(255,255,255,0.1)"
                                                >
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 rounded bg-white/5 text-zinc-300">
                                                                <ToolIcon size={18} />
                                                            </div>
                                                            <div className="font-bold text-sm text-zinc-200">{tool.name}</div>
                                                        </div>
                                                    </div>
                                                    <p className="text-xs text-zinc-500 leading-relaxed mb-3">
                                                        {tool.description}
                                                    </p>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[10px] font-mono text-zinc-600 bg-black/40 px-1.5 py-0.5 rounded">
                                                            {tool.id}
                                                        </span>
                                                        <div className={`w-2 h-2 rounded-full ${tool.status === 'live' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' :
                                                            tool.status === 'priority' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' :
                                                                'bg-zinc-700'
                                                            }`} />
                                                    </div>
                                                </SpotlightCard>
                                            </motion.div>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <AnimatePresence>
                {selectedTool && (
                    <ToolDetailModal tool={selectedTool} onClose={() => setSelectedTool(null)} />
                )}
            </AnimatePresence>
        </div>
    )
}
