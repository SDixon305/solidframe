'use client'

import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, Mic, Phone, Play, Pause, Volume2 } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Sidebar } from '@/components/shared'
import { demoFolders } from '@/lib/demo-tools'
import { useDemoContext } from '@/lib/demo-context'
import { mockScenarios, voiceAgentStats, MockScenario, ConversationMessage } from '@/lib/mock-data'
import { motion, AnimatePresence } from 'framer-motion'

export default function DemoVoiceAgentPage() {
    const { businessName } = useDemoContext()
    const searchParams = useSearchParams()
    const token = searchParams.get('token')

    const [selectedScenario, setSelectedScenario] = useState<MockScenario>(mockScenarios[0])
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
    const [displayedMessages, setDisplayedMessages] = useState<ConversationMessage[]>([])

    const messagesEndRef = useRef<HTMLDivElement>(null)
    const playbackRef = useRef<NodeJS.Timeout | null>(null)

    const tokenParam = token ? `?token=${token}` : ''

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [displayedMessages])

    // Playback logic
    useEffect(() => {
        if (isPlaying && currentMessageIndex < selectedScenario.messages.length) {
            const currentMessage = selectedScenario.messages[currentMessageIndex]
            const nextMessage = selectedScenario.messages[currentMessageIndex + 1]

            const delay = nextMessage
                ? nextMessage.timestamp - currentMessage.timestamp
                : 2000

            playbackRef.current = setTimeout(() => {
                setDisplayedMessages(prev => [...prev, currentMessage])
                setCurrentMessageIndex(prev => prev + 1)
            }, currentMessageIndex === 0 ? 500 : delay)
        } else if (currentMessageIndex >= selectedScenario.messages.length) {
            setIsPlaying(false)
        }

        return () => {
            if (playbackRef.current) clearTimeout(playbackRef.current)
        }
    }, [isPlaying, currentMessageIndex, selectedScenario])

    const handlePlay = () => {
        if (currentMessageIndex >= selectedScenario.messages.length) {
            // Reset and play from beginning
            setCurrentMessageIndex(0)
            setDisplayedMessages([])
        }
        setIsPlaying(true)
    }

    const handlePause = () => {
        setIsPlaying(false)
    }

    const handleScenarioChange = (scenario: MockScenario) => {
        setSelectedScenario(scenario)
        setIsPlaying(false)
        setCurrentMessageIndex(0)
        setDisplayedMessages([])
    }

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
                        <div className="p-3 rounded-xl border bg-indigo-500/10 border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                            <Mic size={24} className="text-indigo-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold tracking-tight text-white">
                                Voice Agent Demo
                            </h2>
                            <p className="text-sm text-zinc-500">
                                Experience how AI handles calls for {businessName}
                            </p>
                        </div>
                    </div>

                    <div className="px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
                        Demo Mode
                    </div>
                </header>

                {/* Content */}
                <div className="flex-1 overflow-hidden flex">
                    {/* Scenario Selector */}
                    <div className="w-80 border-r border-white/5 overflow-y-auto p-4">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-4">
                            Call Scenarios
                        </h3>
                        <div className="space-y-2">
                            {mockScenarios.map((scenario) => (
                                <button
                                    key={scenario.id}
                                    onClick={() => handleScenarioChange(scenario)}
                                    className={`w-full p-4 rounded-xl text-left transition-all ${
                                        selectedScenario.id === scenario.id
                                            ? 'bg-indigo-500/20 border border-indigo-500/30'
                                            : 'bg-zinc-900/50 border border-white/5 hover:border-white/10'
                                    }`}
                                >
                                    <h4 className="font-bold text-white mb-1">{scenario.name}</h4>
                                    <p className="text-xs text-zinc-500 mb-2">{scenario.description}</p>
                                    <div className="flex gap-1 flex-wrap">
                                        {scenario.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className={`px-2 py-0.5 rounded text-[10px] ${
                                                    tag === 'Emergency'
                                                        ? 'bg-red-500/20 text-red-400'
                                                        : 'bg-zinc-700/50 text-zinc-400'
                                                }`}
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Stats */}
                        <div className="mt-6 pt-6 border-t border-white/5">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-4">
                                Agent Stats
                            </h3>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="p-3 rounded-lg bg-zinc-900/50">
                                    <div className="text-lg font-bold text-white">{voiceAgentStats.callsHandled}</div>
                                    <div className="text-[10px] text-zinc-500">Calls Handled</div>
                                </div>
                                <div className="p-3 rounded-lg bg-zinc-900/50">
                                    <div className="text-lg font-bold text-emerald-400">{voiceAgentStats.satisfactionRate}</div>
                                    <div className="text-[10px] text-zinc-500">Satisfaction</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Conversation View */}
                    <div className="flex-1 flex flex-col">
                        {/* Conversation Messages */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            <AnimatePresence>
                                {displayedMessages.map((message) => (
                                    <motion.div
                                        key={message.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex ${message.role === 'ai' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-md p-4 rounded-2xl ${
                                                message.role === 'ai'
                                                    ? 'bg-indigo-500/20 border border-indigo-500/30 rounded-br-sm'
                                                    : 'bg-zinc-800 border border-white/5 rounded-bl-sm'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2 mb-2">
                                                {message.role === 'ai' ? (
                                                    <Volume2 size={12} className="text-indigo-400" />
                                                ) : (
                                                    <Phone size={12} className="text-zinc-400" />
                                                )}
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                                                    {message.role === 'ai' ? 'AI Agent' : 'Caller'}
                                                </span>
                                            </div>
                                            <p className="text-white text-sm">{message.text}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {/* Typing indicator */}
                            {isPlaying && currentMessageIndex < selectedScenario.messages.length && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className={`flex ${
                                        selectedScenario.messages[currentMessageIndex]?.role === 'ai'
                                            ? 'justify-end'
                                            : 'justify-start'
                                    }`}
                                >
                                    <div className="px-4 py-3 rounded-2xl bg-zinc-800/50">
                                        <div className="flex gap-1">
                                            <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Outcome */}
                            {!isPlaying && displayedMessages.length === selectedScenario.messages.length && displayedMessages.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center"
                                >
                                    <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
                                        Call Outcome
                                    </div>
                                    <p className="text-white">{selectedScenario.outcome}</p>
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Playback Controls */}
                        <div className="p-6 border-t border-white/5 bg-black/20">
                            <div className="flex items-center justify-center gap-4">
                                <button
                                    onClick={isPlaying ? handlePause : handlePlay}
                                    className="px-8 py-4 bg-white text-black rounded-xl font-bold uppercase tracking-wider text-sm hover:scale-105 transition-transform flex items-center gap-3"
                                >
                                    {isPlaying ? (
                                        <>
                                            <Pause size={20} fill="black" />
                                            Pause
                                        </>
                                    ) : (
                                        <>
                                            <Play size={20} fill="black" />
                                            {displayedMessages.length > 0 ? 'Resume' : 'Play Scenario'}
                                        </>
                                    )}
                                </button>
                            </div>
                            <p className="text-center text-xs text-zinc-600 mt-3">
                                Watch how the AI handles this {selectedScenario.name.toLowerCase()} call
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
