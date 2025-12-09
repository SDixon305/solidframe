'use client'

import { useState } from 'react'
import { ArrowLeft, Phone, AlertTriangle, Clock, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Sidebar } from '@/components/shared'
import { demoFolders } from '@/lib/demo-tools'
import { useDemoContext } from '@/lib/demo-context'
import { mockCalls, callStats } from '@/lib/mock-data'
import { motion } from 'framer-motion'

export default function DemoCallsPage() {
    const { businessName } = useDemoContext()
    const searchParams = useSearchParams()
    const token = searchParams.get('token')
    const [selectedCall, setSelectedCall] = useState(mockCalls[0])

    const tokenParam = token ? `?token=${token}` : ''

    return (
        <div className="flex h-screen font-sans text-white transition-colors duration-500">
            <Sidebar
                folders={demoFolders}
                activeFolder="demo_tools"
                brandName="SolidFrame"
                hideNav={true}
            />

            <main className="flex-1 relative overflow-hidden flex flex-col z-10 bg-[#09090b]">
                {/* Header */}
                <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-black/20 backdrop-blur-sm z-20">
                    <div className="flex items-center gap-6">
                        <Link href={`/client-demo${tokenParam}`} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-zinc-400 hover:text-white">
                            <ArrowLeft size={24} />
                        </Link>
                        <div className="p-3 rounded-xl border bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                            <Phone size={24} className="text-emerald-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold tracking-tight text-white">
                                Call Dashboard
                            </h2>
                            <p className="text-sm text-zinc-500">
                                Real-time call monitoring for {businessName}
                            </p>
                        </div>
                    </div>

                    <div className="px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
                        Demo Mode
                    </div>
                </header>

                {/* Content */}
                <div className="flex-1 overflow-hidden flex">
                    {/* Call List */}
                    <div className="w-96 border-r border-white/5 overflow-y-auto">
                        {/* Stats */}
                        <div className="p-4 border-b border-white/5 grid grid-cols-2 gap-3">
                            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                <div className="text-2xl font-bold text-emerald-400">{callStats.today.answered}</div>
                                <div className="text-[10px] uppercase tracking-wider text-zinc-500">Answered Today</div>
                            </div>
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                                <div className="text-2xl font-bold text-red-400">{callStats.today.emergencies}</div>
                                <div className="text-[10px] uppercase tracking-wider text-zinc-500">Emergencies</div>
                            </div>
                        </div>

                        {/* Call List */}
                        <div className="p-2">
                            {mockCalls.map((call, index) => (
                                <motion.button
                                    key={call.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    onClick={() => setSelectedCall(call)}
                                    className={`w-full p-4 rounded-xl text-left transition-all mb-2 ${
                                        selectedCall?.id === call.id
                                            ? 'bg-white/10 border border-white/10'
                                            : 'hover:bg-white/5 border border-transparent'
                                    }`}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            {call.isEmergency && (
                                                <AlertTriangle size={14} className="text-red-400" />
                                            )}
                                            <span className="font-medium text-white">{call.caller}</span>
                                        </div>
                                        {call.status === 'completed' ? (
                                            <CheckCircle size={14} className="text-emerald-400" />
                                        ) : call.status === 'missed' ? (
                                            <XCircle size={14} className="text-red-400" />
                                        ) : (
                                            <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                                        <Clock size={12} />
                                        {call.timestamp}
                                        {call.duration !== '0:00' && (
                                            <span className="ml-2">{call.duration}</span>
                                        )}
                                    </div>
                                    {call.isEmergency && (
                                        <div className="mt-2 px-2 py-1 rounded bg-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-wider inline-block">
                                            {call.emergencyType}
                                        </div>
                                    )}
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Call Detail */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {selectedCall && (
                            <motion.div
                                key={selectedCall.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                {/* Call Header */}
                                <div className="mb-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        {selectedCall.isEmergency && (
                                            <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold uppercase">
                                                Emergency: {selectedCall.emergencyType}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-2xl font-bold text-white">{selectedCall.caller}</h3>
                                    <p className="text-zinc-500">{selectedCall.phone}</p>
                                </div>

                                {/* AI Summary */}
                                <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/5 mb-6">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">AI Summary</h4>
                                    <p className="text-white">{selectedCall.aiSummary}</p>
                                </div>

                                {/* Transcript */}
                                {selectedCall.transcript.length > 0 && (
                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-4">Transcript</h4>
                                        <div className="space-y-3">
                                            {selectedCall.transcript.map((line, i) => {
                                                const isAI = line.startsWith('AI:')
                                                return (
                                                    <div
                                                        key={i}
                                                        className={`p-3 rounded-lg ${
                                                            isAI
                                                                ? 'bg-rose-500/10 border border-rose-500/20 ml-8'
                                                                : 'bg-zinc-800/50 border border-white/5 mr-8'
                                                        }`}
                                                    >
                                                        <p className="text-xs text-zinc-500 mb-1">
                                                            {isAI ? 'AI Agent' : 'Caller'}
                                                        </p>
                                                        <p className="text-white text-sm">
                                                            {line.replace(/^(AI:|Caller:)\s*/, '')}
                                                        </p>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
