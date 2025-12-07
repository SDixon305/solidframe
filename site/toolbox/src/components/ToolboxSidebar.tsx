'use client'

import React from 'react'
import Link from 'next/link'
import {
    Zap,
    Activity,
    Target,
    Users,
    BarChart,
    Cpu,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { IconMap } from '@/lib/toolbox-data'
import { useToolbox } from '@/hooks/use-toolbox'

// Define folder updates to match the dashboard
const folderThemes: Record<string, { color: string; bg: string; glow: string; border: string }> = {
    sales_demos: { color: 'text-rose-500', bg: 'bg-rose-500/10', glow: 'shadow-[0_0_20px_rgba(244,63,94,0.4)]', border: 'border-rose-500/40' },
    agent_config: { color: 'text-amber-400', bg: 'bg-amber-500/10', glow: 'shadow-[0_0_20px_rgba(251,191,36,0.2)]', border: 'border-amber-500/30' },
    client_mgmt: { color: 'text-cyan-400', bg: 'bg-cyan-500/10', glow: 'shadow-[0_0_20px_rgba(34,211,238,0.3)]', border: 'border-cyan-500/30' },
    data_ops: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', glow: 'shadow-[0_0_20px_rgba(16,185,129,0.2)]', border: 'border-emerald-500/30' },
}

interface ToolboxSidebarProps {
    userEmail?: string;
    activeFolder?: string;
    onFolderSelect?: (folderId: string) => void;
}

export default function ToolboxSidebar({ userEmail, activeFolder, onFolderSelect }: ToolboxSidebarProps) {
    const { folders, loading } = useToolbox()

    if (loading) return <div className="w-72 glass-panel border-r border-white/5 animate-pulse" />

    // Handle folder click - if prop provided use it, otherwise normal navigation could be added here if needed
    // But currently the dashboard uses state. For the ROI page, we might just want the sidebar for visual consistency
    // or to allow navigating back to dashboard with a specific folder open?
    // For now, let's assume if onFolderSelect is passed, it's the dashboard. 
    // If not, maybe we just link back to dashboard?

    return (
        <aside className="w-72 glass-panel border-r-0 border-r-white/5 flex flex-col z-20 h-screen sticky top-0">
            <div className="p-6 border-b border-white/5">
                <Link href="/" className="flex items-center gap-3 mb-2 group">
                    <div className={`p-2.5 rounded-xl border transition-all duration-300 bg-rose-500/10 border-rose-500/40 text-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.4)]`}>
                        <Zap size={24} className="fill-current" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-white uppercase font-sans group-hover:text-rose-500 transition-colors">SolidFrame</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                            <span className="text-[10px] font-mono text-emerald-500 tracking-wider">SYSTEM ONLINE</span>
                        </div>
                    </div>
                </Link>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                {Object.entries(folders).map(([key, folder]) => {
                    // Logic: If we are on the dashboard (onFolderSelect exists), we use state.
                    // If we are on a tool page, activeFolder might be null or specific.
                    // If we sort of want to act like "Sales Demos" is active because ROI Projector is in it...

                    const isActive = activeFolder === key
                    const FolderIcon = IconMap[folder.icon] || Zap
                    const folderTheme = folderThemes[key] || folderThemes.sales_demos

                    return (
                        <button
                            key={key}
                            onClick={() => onFolderSelect ? onFolderSelect(key) : window.location.href = `/?folder=${key}`}
                            className={`w-full p-4 mb-2 rounded-xl transition-all duration-300 group relative overflow-hidden ${isActive
                                ? `${folderTheme.bg} border border-white/5`
                                : 'hover:bg-white/5 border border-transparent hover:border-white/5'
                                }`}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className={`absolute left-0 top-0 bottom-0 w-1 ${folderTheme.bg.replace('/10', '/50')} shadow-[0_0_10px_currentColor]`}
                                />
                            )}
                            <div className="flex flex-col items-center gap-2 relative z-10">
                                <div className={`p-3 rounded-lg transition-all duration-300 ${isActive ? 'bg-black/20 scale-110' : 'bg-transparent group-hover:bg-white/5 group-hover:scale-105'
                                    }`}>
                                    <FolderIcon
                                        size={20}
                                        className={`transition-all duration-300 ${isActive
                                            ? folderTheme.color
                                            : `text-zinc-500 group-hover:${folderTheme.color}`
                                            }`}
                                        fill={isActive ? "currentColor" : "none"}
                                        fillOpacity={isActive ? 0.2 : 0}
                                    />
                                </div>
                                <span className={`text-[10px] font-medium tracking-wider uppercase transition-colors duration-300 ${isActive
                                    ? 'text-white'
                                    : `text-zinc-500 group-hover:${folderTheme.color}`
                                    }`}>
                                    {folder.name}
                                </span>
                            </div>
                        </button>
                    )
                })}

                <div className="pt-4 mt-2 border-t border-white/5">
                    <Link
                        href="/status"
                        className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-left transition-all duration-300 group text-zinc-500 hover:text-zinc-300 hover:bg-white/5 border border-transparent"
                    >
                        <div className="p-1.5 rounded-md transition-colors bg-transparent group-hover:bg-white/10">
                            <Activity size={18} />
                        </div>
                        <div className="flex-1">
                            <div className="text-sm font-medium tracking-wide text-zinc-400 group-hover:text-zinc-200">
                                Tool Status
                            </div>
                        </div>
                    </Link>
                </div>
            </nav>

            {/* User Profile */}
            <div className="p-4 border-t border-white/5">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                    <div className="w-8 h-8 rounded bg-gradient-to-tr from-zinc-700 to-zinc-600 flex items-center justify-center text-xs font-bold ring-1 ring-white/10">
                        SD
                    </div>
                    <div className="overflow-hidden">
                        <div className="text-xs font-medium truncate text-zinc-300">Seth Dixon</div>
                        <div className="text-[10px] text-zinc-500 truncate">{userEmail || 'dev@solidframe.ai'}</div>
                    </div>
                </div>
            </div>
        </aside>
    )
}
