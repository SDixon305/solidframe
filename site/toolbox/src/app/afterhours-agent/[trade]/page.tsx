'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { Trade } from '@/lib/types'
import { getRandomScenario, personalizeTranscript, CallScenario, TranscriptMessage } from '@/lib/mock-scenarios'
import Link from 'next/link'
import {
    Phone,
    PhoneOff,
    ChevronLeft,
    Volume2,
    Mic,
    MicOff,
    AlertTriangle,
    CheckCircle,
    Clock,
    DollarSign,
    User,
    Calendar,
    ArrowRight,
    MessageSquare
} from 'lucide-react'

type CallPhase = 'incoming' | 'active' | 'summary'
type AgentStatus = 'idle' | 'listening' | 'thinking' | 'responding'

export default function TradeDemoPage() {
    const params = useParams()
    const searchParams = useSearchParams()
    const trade = params.trade as Trade
    const businessName = searchParams.get('name') || 'Your Business'

    const [phase, setPhase] = useState<CallPhase>('incoming')
    const [agentStatus, setAgentStatus] = useState<AgentStatus>('idle')
    const [transcript, setTranscript] = useState<TranscriptMessage[]>([])
    const [currentScenario, setCurrentScenario] = useState<CallScenario | null>(null)
    const [emergencyDetected, setEmergencyDetected] = useState(false)
    const [ringCount, setRingCount] = useState(0)
    const [callDuration, setCallDuration] = useState(0)
    const [isMuted, setIsMuted] = useState(false)

    const transcriptEndRef = useRef<HTMLDivElement>(null)
    const callTimerRef = useRef<NodeJS.Timeout | null>(null)

    // Initialize scenario on mount
    useEffect(() => {
        const scenario = getRandomScenario(trade)
        setCurrentScenario(scenario)
    }, [trade])

    // Scroll to bottom of transcript
    useEffect(() => {
        transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [transcript])

    // Ring animation during incoming phase
    useEffect(() => {
        if (phase === 'incoming') {
            const interval = setInterval(() => {
                setRingCount(prev => prev + 1)
            }, 2000)
            return () => clearInterval(interval)
        }
    }, [phase])

    // Call duration timer
    useEffect(() => {
        if (phase === 'active') {
            callTimerRef.current = setInterval(() => {
                setCallDuration(prev => prev + 1)
            }, 1000)
        }
        return () => {
            if (callTimerRef.current) clearInterval(callTimerRef.current)
        }
    }, [phase])

    // Simulate conversation
    const simulateConversation = useCallback(() => {
        if (!currentScenario) return

        const personalizedTranscript = personalizeTranscript(currentScenario.transcript, businessName)
        let index = 0

        const addNextMessage = () => {
            if (index >= personalizedTranscript.length) {
                // Conversation complete, show summary
                setTimeout(() => {
                    setAgentStatus('idle')
                    setPhase('summary')
                }, 1500)
                return
            }

            const msg = personalizedTranscript[index]

            // Set status based on who's speaking next
            if (msg.role === 'user') {
                setAgentStatus('listening')
            } else {
                setAgentStatus('thinking')
                setTimeout(() => setAgentStatus('responding'), 800)
            }

            // Add message after delay
            setTimeout(() => {
                setTranscript(prev => [...prev, msg])

                // Check for emergency trigger
                if (msg.isEmergencyTrigger) {
                    setEmergencyDetected(true)
                }

                index++
                // Vary timing based on message length
                const delay = Math.min(1500 + msg.text.length * 20, 4000)
                setTimeout(addNextMessage, delay)
            }, msg.role === 'agent' ? 1200 : 800)
        }

        addNextMessage()
    }, [currentScenario, businessName])

    const handleAnswerCall = () => {
        setPhase('active')
        setAgentStatus('responding')
        simulateConversation()
    }

    const handleEndCall = () => {
        if (callTimerRef.current) clearInterval(callTimerRef.current)
        setPhase('summary')
        setAgentStatus('idle')
    }

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const getTheme = (t: string) => {
        switch (t) {
            case 'hvac': return { color: 'blue', bg: 'bg-blue-500', border: 'border-blue-500/30', text: 'text-blue-400' }
            case 'plumbing': return { color: 'cyan', bg: 'bg-cyan-500', border: 'border-cyan-500/30', text: 'text-cyan-400' }
            case 'electrical': return { color: 'yellow', bg: 'bg-yellow-500', border: 'border-yellow-500/30', text: 'text-yellow-400' }
            case 'roofing': return { color: 'orange', bg: 'bg-orange-500', border: 'border-orange-500/30', text: 'text-orange-400' }
            default: return { color: 'white', bg: 'bg-white', border: 'border-white/30', text: 'text-white' }
        }
    }

    const theme = getTheme(trade)

    const getClassificationColor = (classification: string) => {
        switch (classification) {
            case 'EMERGENCY': return 'bg-red-500/20 text-red-400 border-red-500/30'
            case 'ROUTINE': return 'bg-green-500/20 text-green-400 border-green-500/30'
            case 'SALES_INQUIRY': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
            default: return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30'
        }
    }

    // PHASE 1: INCOMING CALL SCREEN
    if (phase === 'incoming') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-black text-white">
                {/* Background pulse */}
                <div className="fixed inset-0 pointer-events-none">
                    <div className={`absolute inset-0 ${theme.bg} opacity-5 animate-pulse`} />
                </div>

                {/* Back button */}
                <Link
                    href="/afterhours-agent"
                    className="absolute top-8 left-8 flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm z-20"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                </Link>

                {/* Context: Late night timestamp */}
                <div className="absolute top-8 right-8 text-zinc-500 text-sm font-mono">
                    11:47 PM
                </div>

                <div className="relative z-10 flex flex-col items-center text-center max-w-md">
                    {/* Demo mode indicator */}
                    <div className="mb-8 px-4 py-2 rounded-full bg-zinc-800/50 border border-white/10 text-xs text-zinc-400 uppercase tracking-wider">
                        Demo Mode
                    </div>

                    {/* Incoming call animation */}
                    <div className="relative w-32 h-32 mb-8">
                        {/* Ripple rings */}
                        <div className={`absolute inset-0 rounded-full ${theme.bg} opacity-20 animate-ping`} style={{ animationDuration: '2s' }} />
                        <div className={`absolute inset-[-20px] rounded-full border ${theme.border} animate-ping opacity-30`} style={{ animationDuration: '2.5s', animationDelay: '0.5s' }} />

                        {/* Phone icon */}
                        <div className={`relative w-full h-full rounded-full ${theme.bg}/20 border ${theme.border} flex items-center justify-center`}>
                            <Phone className={`w-12 h-12 ${theme.text} ${ringCount % 2 === 0 ? 'rotate-12' : '-rotate-12'} transition-transform duration-200`} />
                        </div>
                    </div>

                    {/* Caller info */}
                    <p className="text-zinc-500 text-sm uppercase tracking-wider mb-2">Incoming Call</p>
                    <h1 className="text-3xl font-bold mb-2">{businessName}</h1>
                    <p className="text-zinc-400 mb-2">After-hours line</p>

                    {/* Scenario preview */}
                    {currentScenario && (
                        <p className="text-zinc-600 text-sm mb-8">
                            Scenario: {currentScenario.title}
                        </p>
                    )}

                    {/* Answer buttons */}
                    <div className="flex gap-4">
                        <button
                            onClick={handleAnswerCall}
                            className="flex items-center gap-3 px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full transition-all hover:scale-105 shadow-[0_0_30px_rgba(34,197,94,0.4)]"
                        >
                            <Phone className="w-5 h-5" />
                            Answer
                        </button>
                    </div>

                    <p className="mt-6 text-xs text-zinc-600">
                        This simulates how your AI receptionist handles calls
                    </p>
                </div>
            </div>
        )
    }

    // PHASE 2: ACTIVE CALL
    if (phase === 'active') {
        return (
            <div className="flex h-screen bg-black text-white overflow-hidden">
                {/* Left Panel: Call Visualization */}
                <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 relative">
                    {/* Header */}
                    <div className="absolute top-8 left-8 right-8 flex items-center justify-between z-20">
                        <button
                            onClick={handleEndCall}
                            className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            End Demo
                        </button>

                        <div className="flex items-center gap-4">
                            {/* Call duration */}
                            <div className="flex items-center gap-2 text-zinc-400 font-mono text-sm">
                                <Clock className="w-4 h-4" />
                                {formatDuration(callDuration)}
                            </div>
                        </div>
                    </div>

                    {/* Emergency Badge */}
                    <div className={`absolute top-24 left-1/2 -translate-x-1/2 transition-all duration-500 ${emergencyDetected ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                        <div className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-full text-red-400 animate-pulse">
                            <AlertTriangle className="w-4 h-4" />
                            <span className="text-sm font-medium uppercase tracking-wider">Emergency Detected</span>
                        </div>
                    </div>

                    {/* Main visualization */}
                    <div className="flex flex-col items-center">
                        {/* Status indicator */}
                        <div className={`mb-6 px-4 py-2 rounded-full border text-xs uppercase tracking-widest transition-all duration-300 ${agentStatus === 'listening' ? 'bg-blue-500/10 border-blue-500/50 text-blue-400' :
                                agentStatus === 'thinking' ? 'bg-yellow-500/10 border-yellow-500/50 text-yellow-400' :
                                    agentStatus === 'responding' ? 'bg-green-500/10 border-green-500/50 text-green-400' :
                                        'bg-zinc-800/50 border-white/10 text-zinc-500'
                            }`}>
                            {agentStatus === 'listening' && '● Listening...'}
                            {agentStatus === 'thinking' && '● Understanding...'}
                            {agentStatus === 'responding' && '● Responding...'}
                            {agentStatus === 'idle' && '○ Ready'}
                        </div>

                        <h2 className="text-2xl font-bold mb-1">{businessName}</h2>
                        <p className="text-zinc-500 text-sm mb-8">AI Receptionist • Trained for {trade.charAt(0).toUpperCase() + trade.slice(1)}</p>

                        {/* The Orb */}
                        <div className="relative w-48 h-48 mb-12">
                            {/* Outer glow */}
                            <div className={`absolute inset-0 rounded-full blur-[40px] transition-all duration-700 ${agentStatus === 'responding' ? `${theme.bg} opacity-40` :
                                    agentStatus === 'listening' ? 'bg-blue-500 opacity-30' :
                                        agentStatus === 'thinking' ? 'bg-yellow-500 opacity-30' :
                                            'bg-zinc-700 opacity-20'
                                }`} />

                            {/* Activity rings */}
                            {agentStatus !== 'idle' && (
                                <>
                                    <div className={`absolute inset-0 rounded-full border border-white/10 animate-ping opacity-30`} style={{ animationDuration: '2s' }} />
                                    <div className={`absolute inset-[-15px] rounded-full border border-white/5 animate-ping opacity-20`} style={{ animationDuration: '3s' }} />
                                </>
                            )}

                            {/* Core orb */}
                            <div className={`relative w-full h-full rounded-full border border-white/10 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-md flex items-center justify-center transition-transform duration-700 ${agentStatus !== 'idle' ? 'scale-110' : 'scale-100'}`}>
                                {agentStatus === 'listening' ? (
                                    <Mic className="w-12 h-12 text-blue-400" />
                                ) : agentStatus === 'responding' ? (
                                    <Volume2 className="w-12 h-12 text-green-400" />
                                ) : (
                                    <MessageSquare className="w-12 h-12 text-zinc-500" />
                                )}
                            </div>
                        </div>

                        {/* Call controls */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsMuted(!isMuted)}
                                className={`p-4 rounded-full transition-colors ${isMuted ? 'bg-red-500/20 text-red-400' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}
                            >
                                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                            </button>

                            <button
                                onClick={handleEndCall}
                                className="flex items-center gap-2 px-8 py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-full transition-all hover:scale-105"
                            >
                                <PhoneOff className="w-5 h-5" />
                                End Call
                            </button>

                            <button className="p-4 rounded-full bg-zinc-800 text-zinc-400 hover:text-white transition-colors">
                                <Volume2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Live Transcript */}
                <div className="hidden lg:flex w-1/2 border-l border-white/5 bg-zinc-900/30 flex-col">
                    <div className="p-6 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Live Transcript</span>
                        </div>
                        {currentScenario && (
                            <span className={`px-3 py-1 rounded-full text-xs border ${getClassificationColor(currentScenario.classification)}`}>
                                {currentScenario.classification.replace('_', ' ')}
                            </span>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {transcript.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center text-zinc-600">
                                <MessageSquare className="w-12 h-12 opacity-20 mb-4" />
                                <p className="text-sm">Waiting for conversation...</p>
                            </div>
                        )}

                        {transcript.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] rounded-2xl px-5 py-3 ${msg.role === 'user'
                                        ? 'bg-zinc-800 text-zinc-200 rounded-br-sm'
                                        : `bg-gradient-to-br from-${theme.color}-500/20 to-${theme.color}-500/5 border ${theme.border} text-white rounded-bl-sm`
                                    }`}>
                                    <p className="text-xs uppercase tracking-wider opacity-50 mb-1">
                                        {msg.role === 'user' ? 'Customer' : 'AI Receptionist'}
                                    </p>
                                    <p className="leading-relaxed">{msg.text}</p>
                                </div>
                            </div>
                        ))}
                        <div ref={transcriptEndRef} />
                    </div>
                </div>

                {/* Mobile Transcript Drawer */}
                <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-zinc-900/95 backdrop-blur-md border-t border-white/10 max-h-[40vh] overflow-y-auto">
                    <div className="p-4 border-b border-white/5 flex items-center justify-between sticky top-0 bg-zinc-900/95">
                        <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Transcript</span>
                        <div className="w-8 h-1 rounded-full bg-zinc-700" />
                    </div>
                    <div className="p-4 space-y-3">
                        {transcript.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] rounded-xl px-4 py-2 text-sm ${msg.role === 'user'
                                        ? 'bg-zinc-800 text-zinc-200'
                                        : 'bg-blue-500/20 border border-blue-500/30 text-white'
                                    }`}>
                                    <p>{msg.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    // PHASE 3: CALL SUMMARY - Compact single-screen dashboard
    return (
        <div className="h-screen bg-black text-white flex flex-col p-4 sm:p-6">
            {/* Header row */}
            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={() => {
                        setPhase('incoming')
                        setTranscript([])
                        setEmergencyDetected(false)
                        setCallDuration(0)
                        setCurrentScenario(getRandomScenario(trade))
                    }}
                    className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Try Again
                </button>
                <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-sm font-medium text-green-400">Emergency Job Booked</span>
                </div>
                <Link href="/afterhours-agent" className="text-zinc-500 hover:text-white text-sm">
                    Change Trade
                </Link>
            </div>

            {currentScenario && (
                <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full">
                    {/* Main content grid */}
                    <div className="flex-1 grid grid-cols-2 gap-3 mb-4">
                        {/* Left column: Call details */}
                        <div className="flex flex-col gap-3">
                            {/* Classification badge */}
                            <div className={`px-4 py-3 rounded-xl border ${getClassificationColor(currentScenario.classification)}`}>
                                <div className="flex items-center gap-2">
                                    {currentScenario.classification === 'EMERGENCY' && <AlertTriangle className="w-4 h-4" />}
                                    {currentScenario.classification === 'ROUTINE' && <Calendar className="w-4 h-4" />}
                                    {currentScenario.classification === 'SALES_INQUIRY' && <DollarSign className="w-4 h-4" />}
                                    <span className="font-bold text-sm">{currentScenario.classification.replace('_', ' ')}</span>
                                </div>
                                <p className="text-xs opacity-70 mt-1">Handled in 47 seconds — no waiting.</p>
                            </div>

                            {/* Customer & Issue */}
                            <div className="flex-1 p-4 rounded-xl bg-zinc-900/50 border border-white/5">
                                <div className="flex items-center gap-2 mb-3">
                                    <User className="w-4 h-4 text-zinc-500" />
                                    <span className="text-sm font-medium">{currentScenario.customerName}</span>
                                </div>
                                <ul className="text-sm text-zinc-400 space-y-1 mb-3">
                                    {currentScenario.issue.split(', ').map((item, i) => (
                                        <li key={i} className="flex items-center gap-2">
                                            <span className="w-1 h-1 rounded-full bg-zinc-500" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <div className="flex items-center gap-2 text-green-400 text-sm">
                                    <CheckCircle className="w-4 h-4" />
                                    <span>Job successfully converted</span>
                                </div>
                            </div>

                            {/* Action taken */}
                            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                                <div className="flex items-start gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                                    <p className="text-sm text-green-400">{currentScenario.action}</p>
                                </div>
                            </div>

                            {/* AI Message Preview */}
                            <div className="p-4 rounded-xl bg-zinc-800/50 border border-white/5">
                                <div className="flex items-center gap-2 mb-2">
                                    <MessageSquare className="w-3 h-3 text-zinc-500" />
                                    <span className="text-xs text-zinc-500 uppercase tracking-wider">What the AI told the customer</span>
                                </div>
                                <p className="text-sm text-zinc-300 italic leading-relaxed">
                                    "I'm sorry you're without heat — especially in this weather. I've dispatched our on-call technician. They'll text you shortly with an ETA."
                                </p>
                            </div>
                        </div>

                        {/* Right column: Value & Impact */}
                        <div className="flex flex-col gap-3">
                            {/* Big value number */}
                            <div className="flex-1 p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20 flex flex-col justify-center items-center text-center">
                                <p className="text-6xl sm:text-7xl font-bold text-green-400">${currentScenario.value}</p>
                                <p className="text-xs text-zinc-400 mt-2 leading-snug">
                                    Booked revenue that would have<br />gone to voicemail.
                                </p>
                            </div>

                            {/* The point - compact */}
                            <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/5">
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-start gap-2">
                                        <span className="text-red-400 font-medium shrink-0">Without AI:</span>
                                        <span className="text-zinc-400">Missed call → voicemail → customer calls a competitor</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-green-400 font-medium shrink-0">With AI:</span>
                                        <span className="text-zinc-300">Job booked + technician dispatched</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Month-to-date metric */}
                    <div className="text-center mb-3">
                        <p className="text-sm text-zinc-500">
                            Month-to-date recovered revenue: <span className="text-green-400 font-semibold">$8,760</span>
                        </p>
                    </div>

                    {/* CTA buttons - horizontal on desktop */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Link
                            href={`/tools/roi-projector?callValue=${currentScenario.value}&trade=${trade}`}
                            className="flex items-center justify-center gap-2 py-3 px-4 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-all active:scale-[0.98] touch-manipulation text-sm"
                        >
                            <DollarSign className="w-4 h-4" />
                            See Yearly Savings
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                        <a
                            href="https://calendly.com/seth-solidframe/15-minute-discovery-call"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 py-3 px-4 bg-zinc-800 text-white font-bold rounded-xl hover:bg-zinc-700 transition-all border border-white/10 active:scale-[0.98] touch-manipulation text-sm"
                        >
                            <Calendar className="w-4 h-4" />
                            Book a Demo
                        </a>
                    </div>
                </div>
            )}
        </div>
    )
}
