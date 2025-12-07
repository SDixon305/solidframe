'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Zap,
    Activity,
    Construction
} from 'lucide-react'
import Link from 'next/link'

import SpotlightCard from './SpotlightCard'
import BorderBeam from './BorderBeam'
import ToolboxSidebar from './ToolboxSidebar'
import { IconMap, statusColors } from '@/lib/toolbox-data'
import { useToolbox } from '@/hooks/use-toolbox'

// Define folder-specific colors for a vibrant UI
const folderThemes: Record<string, { color: string; bg: string; glow: string; border: string }> = {
    sales_demos: { color: 'text-rose-500', bg: 'bg-rose-500/10', glow: 'shadow-[0_0_20px_rgba(244,63,94,0.4)]', border: 'border-rose-500/40' },
    agent_config: { color: 'text-amber-400', bg: 'bg-amber-500/10', glow: 'shadow-[0_0_20px_rgba(251,191,36,0.2)]', border: 'border-amber-500/30' },
    client_mgmt: { color: 'text-cyan-400', bg: 'bg-cyan-500/10', glow: 'shadow-[0_0_20px_rgba(34,211,238,0.3)]', border: 'border-cyan-500/30' },
    data_ops: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', glow: 'shadow-[0_0_20px_rgba(16,185,129,0.2)]', border: 'border-emerald-500/30' },
}

export default function ToolboxDashboard({ userEmail }: { userEmail: string | undefined }) {
    const [activeFolder, setActiveFolder] = useState('sales_demos')
    const [activeItem, setActiveItem] = useState<string | null>(null)

    // Folders Data
    const { folders, loading } = useToolbox()
    const theme = folderThemes[activeFolder] || folderThemes.sales_demos

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-black text-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500" />
                    <p className="text-lg text-zinc-400">Loading toolbox...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex h-screen font-sans text-white transition-colors duration-500">
            {/* Sidebar */}
            <ToolboxSidebar
                userEmail={userEmail}
                activeFolder={activeFolder}
                onFolderSelect={setActiveFolder}
            />

            {/* Main Content Area */}
            <main className="flex-1 relative overflow-hidden flex flex-col z-10">

                {/* Header */}
                <header className="h-24 border-b border-white/5 flex items-center justify-between px-8 bg-black/20 backdrop-blur-sm z-20">
                    <div className="flex items-center gap-6">
                        <div className={`p-4 rounded-2xl border ${theme.bg} ${theme.border} ${theme.glow} transition-all duration-500`}>
                            {(() => {
                                const Icon = IconMap[folders[activeFolder]?.icon] || Zap
                                return <Icon size={28} className={theme.color} fill="currentColor" fillOpacity={0.2} />
                            })()}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-white mb-1">
                                {folders[activeFolder]?.name}
                            </h2>
                            <p className="text-sm text-zinc-400 font-medium">
                                {folders[activeFolder]?.description}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-6">
                        <div className="text-right">
                            <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">Worker Nodes</div>
                            <div className="flex items-center justify-end gap-2 text-emerald-400 font-mono text-sm shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                SYSTEM ONLINE
                            </div>
                        </div>
                        <div className="text-right pl-6 border-l border-white/10">
                            <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">CPU Load</div>
                            <div className="font-mono text-sm text-zinc-300">12% / 3.4GB</div>
                        </div>
                    </div>
                </header>

                {/* Content Grid */}
                <div className="flex-1 overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-7xl mx-auto">
                        <AnimatePresence mode="popLayout">
                            {folders[activeFolder]?.tools.map((tool, index) => {
                                const ToolIcon = IconMap[tool.icon] || Zap
                                return (
                                    <motion.div
                                        key={tool.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                        onMouseEnter={() => setActiveItem(tool.id)}
                                        onMouseLeave={() => setActiveItem(null)}
                                        className="group relative"
                                    >
                                        <SpotlightCard className="h-full bg-zinc-900/30 border border-white/5 rounded-2xl p-6 hover:bg-white/5 transition-all duration-300 group-hover:border-white/10">
                                            {/* Top Row: Icon & Status */}
                                            <div className="flex justify-between items-start mb-6">
                                                {/* Tool Icon with PERMANENT Color */}
                                                <div className={`p-3.5 rounded-xl border transition-all duration-300 group-hover:scale-110 ${theme.bg} ${theme.border} ${theme.glow}`}>
                                                    <ToolIcon
                                                        size={28}
                                                        className={theme.color}
                                                        strokeWidth={1.5}
                                                        fill="currentColor"
                                                        fillOpacity={0.1} // Subtle fill always on
                                                    />
                                                </div>

                                                {/* Status Pill */}
                                                <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusColors[tool.status] || statusColors.planned}`}>
                                                    {tool.status === 'live' ? 'ACTIVE' : tool.status === 'priority' ? 'READY' : 'PLANNED'}
                                                </div>
                                            </div>

                                            {/* Text Content */}
                                            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-white/90 transition-colors">
                                                {tool.name}
                                            </h3>
                                            <p className="text-sm text-zinc-400 leading-relaxed mb-6 group-hover:text-zinc-300 transition-colors">
                                                {tool.description}
                                            </p>

                                            {/* Bottom Action Area */}
                                            <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                                                <span className="text-xs font-mono text-zinc-600 group-hover:text-zinc-500 transition-colors">
                                                    v1.0.2
                                                </span>

                                                {tool.status === 'priority' || tool.status === 'live' ? (
                                                    // UPDATE: If tool.id is roi-projector or instant-demo, link to it
                                                    tool.id === 'roi-projector' ? (
                                                        <Link href="/tools/roi-projector" className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-white text-black hover:scale-105 transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] flex items-center gap-2`}>
                                                            <Zap size={14} className="fill-black" />
                                                            INITIALIZE
                                                        </Link>
                                                    ) : tool.id === 'instant-demo' ? (
                                                        <Link href="/afterhours-agent" className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-white text-black hover:scale-105 transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] flex items-center gap-2`}>
                                                            <Zap size={14} className="fill-black" />
                                                            LAUNCH
                                                        </Link>
                                                    ) : (
                                                        <button className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-white text-black hover:scale-105 transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] flex items-center gap-2`}>
                                                            <Zap size={14} className="fill-black" />
                                                            {tool.status === 'live' ? 'OPEN' : 'INITIALIZE'}
                                                        </button>
                                                    )
                                                ) : (
                                                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-600 px-4 py-2">
                                                        <Construction size={14} />
                                                        LOCKED
                                                    </div>
                                                )}
                                            </div>

                                            {activeItem === tool.id && (
                                                <BorderBeam
                                                    size={300}
                                                    duration={8}
                                                    delay={0}
                                                    colorFrom={theme.color.replace('text-', '').replace('-400', '-500').replace('-500', '-500')}
                                                    colorTo="transparent"
                                                />
                                            )}
                                        </SpotlightCard>
                                    </motion.div>
                                )
                            })}
                        </AnimatePresence>
                    </div>
                </div>
            </main>
        </div>
    )
}
