import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import {
    X,
    CheckCircle2,
    Circle,
    Construction,
    Rocket,
    Clock,
    FileText,
    Zap,
    Target,
    Shield
} from 'lucide-react'
import { Tool, IconMap, statusColors } from '@/lib/toolbox-data'

interface ToolDetailModalProps {
    tool: Tool
    onClose: () => void
}

export default function ToolDetailModal({ tool, onClose }: ToolDetailModalProps) {
    const ToolIcon = IconMap[tool.icon] || Zap

    // Mock data for OpenSpec-style details
    // Ideally this comes from the real metadata later
    const progress = tool.specs && tool.specs.length > 0
        ? Math.round((tool.specs.filter(s => s.completed).length / tool.specs.length) * 100)
        : (tool.status === 'live' ? 100 : tool.status === 'priority' ? 65 : tool.status === 'building' ? 35 : 0)

    // Determine color theme based on status
    const themeColor = tool.status === 'live' ? 'emerald' : tool.status === 'priority' ? 'amber' : tool.status === 'building' ? 'indigo' : 'zinc'

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-white/10 bg-[#09090b] shadow-2xl flex flex-col"
            >
                {/* Header Section */}
                <div className="relative p-8 pb-6 border-b border-white/5 overflow-hidden">
                    <div className={`absolute top-0 right-0 p-32 bg-${themeColor}-500/5 blur-[100px] rounded-full pointer-events-none`} />

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/5 text-zinc-500 hover:text-white transition-colors z-20"
                    >
                        <X size={20} />
                    </button>

                    <div className="flex items-start gap-6 relative z-10">
                        <div className={`p-4 rounded-xl border bg-${themeColor}-500/10 border-${themeColor}-500/20 text-${themeColor}-400 shadow-[0_0_30px_rgba(0,0,0,0.5)]`}>
                            <ToolIcon size={40} />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h2 className="text-3xl font-bold tracking-tight text-white">{tool.name}</h2>
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider border ${statusColors[tool.status]}`}>
                                    {tool.status.replace('-', ' ')}
                                </span>
                            </div>
                            <p className="text-zinc-400 text-lg leading-relaxed max-w-2xl">
                                {tool.description}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Progress Bar - Video Game Style */}
                <div className="px-8 py-6 bg-white/[0.02]">
                    <div className="flex items-end justify-between mb-2">
                        <span className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-widest">Completion</span>
                        <span className={`text-xl font-mono font-bold text-${themeColor}-400`}>{progress}%</span>
                    </div>
                    <div className="h-4 w-full bg-black/50 rounded-full border border-white/5 overflow-hidden relative">
                        {/* Grid pattern overlay */}
                        <div className="absolute inset-0 z-10 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>

                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1.5, ease: "circOut" }}
                            className={`h-full bg-gradient-to-r from-${themeColor}-900 via-${themeColor}-500 to-${themeColor}-400 relative`}
                        >
                            <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[length:20px_20px] animate-[progress-stripes_1s_linear_infinite]" />
                            <div className={`absolute right-0 top-0 bottom-0 w-1 bg-white/50 shadow-[0_0_10px_2px_rgba(255,255,255,0.3)]`} />
                        </motion.div>
                    </div>
                </div>

                {/* Main Content: Split View (OpenSpec Style + Visuals) */}
                <div className="flex-1 overflow-y-auto min-h-0 flex flex-col md:flex-row">

                    {/* Left: OpenSpec Details */}
                    <div className="flex-1 p-8 space-y-8 border-r border-white/5">
                        {/* Why */}
                        <section>
                            <h3 className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider mb-3">
                                <Target size={16} className="text-indigo-400" />
                                Why We're Building This
                            </h3>
                            <p className="text-zinc-400 text-sm leading-relaxed">
                                Current workflow requires manual data entry which introduces errors and slows down the sales cycle. This tool automates the process to ensure 100% accuracy and instant turnaround times.
                            </p>
                        </section>

                        {/* What / Specs */}
                        <section>
                            <h3 className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider mb-3">
                                <FileText size={16} className="text-emerald-400" />
                                Core Specifications
                            </h3>
                            <ul className="space-y-3">
                                {tool.specs && tool.specs.length > 0 ? (
                                    tool.specs.map((item, i) => (
                                        <motion.li
                                            key={i}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.2 + (i * 0.1) }}
                                            className="flex items-start gap-3 group"
                                        >
                                            <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-colors ${item.completed ? `bg-${themeColor}-500/20 border-${themeColor}-500/50 text-${themeColor}-400` : 'border-zinc-700 bg-zinc-800/50 text-transparent'}`}>
                                                <CheckCircle2 size={10} />
                                            </div>
                                            <span className={`text-sm ${item.completed ? 'text-zinc-300 line-through decoration-zinc-600' : 'text-zinc-400'}`}>
                                                {item.label}
                                            </span>
                                        </motion.li>
                                    ))
                                ) : (
                                    <li className="text-zinc-500 italic text-sm">Specs are being defined...</li>
                                )}
                            </ul>
                        </section>

                        {/* Impact */}
                        <section>
                            <h3 className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider mb-3">
                                <Shield size={16} className="text-amber-400" />
                                Expected Impact
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                                    <div className="text-2xl font-bold text-white mb-0.5">30%</div>
                                    <div className="text-[10px] text-zinc-500 uppercase font-mono">Faster Sales Cycles</div>
                                </div>
                                <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                                    <div className="text-2xl font-bold text-white mb-0.5">0</div>
                                    <div className="text-[10px] text-zinc-500 uppercase font-mono">Manual Errors</div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right: Visuals / Blueprint */}
                    <div className="w-full md:w-[400px] bg-black/20 p-8 flex flex-col gap-6">
                        <div className="aspect-video w-full rounded-xl bg-gradient-to-br from-zinc-900 to-black border border-white/10 relative overflow-hidden group">
                            {tool.image ? (
                                <Image
                                    src={tool.image}
                                    alt={tool.name}
                                    fill
                                    className="object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-700"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <Construction className="mx-auto mb-3 text-zinc-700" size={32} />
                                        <div className="text-xs font-mono text-zinc-600 uppercase tracking-widest">UI Concept</div>
                                    </div>
                                </div>
                            )}

                            {/* Overlay for depth */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

                            {/* Animated scanner line */}
                            <div className="absolute top-0 bottom-0 bg-indigo-500/10 w-[1px] shadow-[0_0_15px_rgba(99,102,241,0.5)] animate-[scan_3s_ease-in-out_infinite] pointer-events-none" />
                            <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-black/60 border border-white/10 text-[10px] text-zinc-500 font-mono pointer-events-none">
                                FIG-204-B
                            </div>
                        </div>

                        <div className="glass-panel p-4 rounded-xl">
                            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-3 flex items-center justify-between">
                                Deploy Log
                                <span className={`w-2 h-2 rounded-full ${tool.activityLog ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-700'}`}></span>
                            </h4>
                            <div className="space-y-2 font-mono text-[10px] text-zinc-500">
                                {tool.activityLog && tool.activityLog.length > 0 ? (
                                    tool.activityLog.map((log, i) => (
                                        <div key={i} className="flex gap-2">
                                            <span className="text-zinc-600">{log.time}</span>
                                            <span className={log.color}>{log.message}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-zinc-700 italic">No recent activity</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-white/5 bg-black/40 flex items-center justify-between">
                    <button className="text-xs text-zinc-500 hover:text-white transition-colors flex items-center gap-2">
                        <FileText size={14} />
                        VIEW FULL OPENSPEC
                    </button>
                    {progress < 100 && (
                        <button className={`px-6 py-2 bg-${themeColor}-600 hover:bg-${themeColor}-500 text-white text-sm font-bold rounded-lg shadow-lg flex items-center gap-2 transition-all hover:scale-105 active:scale-95`}>
                            <Rocket size={16} />
                            {progress > 0 ? 'VIEW PROGRESS' : 'VOTE FOR THIS'}
                        </button>
                    )}
                </div>
            </motion.div>
        </div>
    )
}
