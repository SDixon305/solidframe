'use client'

import { useState, useEffect, useRef } from 'react'
import { Phone, Mic, BrainCircuit, CheckCircle2, Timer, Volume2, PhoneCall } from 'lucide-react'

export type CallStatus = 'idle' | 'connecting' | 'connected' | 'listening' | 'processing' | 'completed'

interface LiveCallStatusProps {
    phoneNumber: string
    status: CallStatus
    transcript: string[]
    onStartCall: () => void
}

export default function LiveCallStatus({ phoneNumber, status, transcript, onStartCall }: LiveCallStatusProps) {
    const [duration, setDuration] = useState(0)
    const transcriptEndRef = useRef<HTMLDivElement>(null)

    // Auto-scroll transcript to bottom
    useEffect(() => {
        if (transcriptEndRef.current) {
            transcriptEndRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [transcript])

    useEffect(() => {
        let interval: NodeJS.Timeout
        if (status === 'connected' || status === 'listening' || status === 'processing') {
            interval = setInterval(() => {
                setDuration(d => d + 1)
            }, 1000)
        }
        return () => clearInterval(interval)
    }, [status])

    // Reset duration when going back to idle
    useEffect(() => {
        if (status === 'idle' || status === 'connecting') {
            setDuration(0)
        }
    }, [status])

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    if (status === 'idle') {
        return (
            <div className="h-full flex flex-col">
                <div className="bg-gradient-to-br from-emerald-900/50 to-slate-900/50 backdrop-blur-md rounded-xl p-6 border border-emerald-500/30 flex-1 flex flex-col relative overflow-hidden">
                    <div className="absolute inset-0 bg-emerald-500/5 animate-pulse" style={{ animationDuration: '4s' }}></div>

                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-emerald-500/20 rounded-lg border border-emerald-500/30">
                                <Phone className="w-4 h-4 text-emerald-400" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-white">
                                    Step 2: Call Now
                                </h3>
                                <p className="text-xs text-emerald-400/80">
                                    Your agent is standing by
                                </p>
                            </div>
                        </div>

                        <div className="bg-slate-950/50 rounded-xl p-6 border border-emerald-500/30 mb-4 text-center">
                            <p className="text-xs text-slate-400 mb-2 uppercase tracking-wider font-medium">Call this number</p>
                            <p className="text-3xl font-mono font-bold text-white tracking-tight">
                                {phoneNumber}
                            </p>
                        </div>

                        <div className="bg-slate-950/30 rounded-lg p-4 mb-4 border border-emerald-500/20">
                            <p className="text-xs text-emerald-400/70 font-semibold mb-2">Test the agent with a common scenario:</p>
                            <p className="text-sm text-white font-medium">"My air conditioner is completely broken"</p>
                            <p className="text-xs text-slate-500 mt-2">Or try your own emergency HVAC scenario</p>
                        </div>

                        <div className="mt-auto">
                            <button
                                onClick={onStartCall}
                                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-all shadow-lg shadow-emerald-900/20 hover:shadow-emerald-900/40 hover:-translate-y-0.5 text-sm flex items-center justify-center gap-2"
                            >
                                <Phone className="w-4 h-4" />
                                I'm Calling Now
                            </button>
                            <p className="text-center text-[10px] text-slate-500 mt-2">
                                Click to visualize the call in real-time
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="h-full flex flex-col">
            <div className="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden flex-1 flex flex-col relative shadow-2xl">
                {/* Header */}
                <div className="bg-slate-800/50 p-4 border-b border-slate-700 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${status === 'completed' ? 'bg-red-500' : 'bg-emerald-500 animate-pulse'}`}></div>
                        <span className="text-xs font-mono text-slate-300 uppercase tracking-wider">
                            {status === 'completed' ? 'Call Ended' : 'Live Call'}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 bg-slate-950/50 px-2 py-1 rounded text-xs font-mono">
                        <Timer className="w-3 h-3" />
                        {formatTime(duration)}
                    </div>
                </div>

                {/* Visualization Area */}
                <div className="flex-1 p-6 flex flex-col items-center justify-center relative min-h-[200px]">
                    {/* Background Grid */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

                    {/* Central Visual */}
                    <div className="relative z-10 mb-6">
                        {status === 'connecting' && (
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full border-4 border-slate-700 border-t-emerald-500 animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Phone className="w-8 h-8 text-slate-500" />
                                </div>
                            </div>
                        )}

                        {status === 'connected' && (
                            <div className="relative">
                                <div className="absolute inset-0 bg-emerald-500/30 rounded-full animate-ping" style={{ animationDuration: '1.5s' }}></div>
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-800 border-2 border-emerald-400/50 flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.4)]">
                                    <PhoneCall className="w-10 h-10 text-white" />
                                </div>
                            </div>
                        )}

                        {status === 'listening' && (
                            <div className="relative">
                                <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping" style={{ animationDuration: '1s' }}></div>
                                <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-blue-500/50 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                                    <Mic className="w-8 h-8 text-blue-400" />
                                </div>
                                {/* Sound wave effect */}
                                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="w-1 bg-blue-400 rounded-full animate-pulse"
                                            style={{
                                                height: `${12 + Math.random() * 16}px`,
                                                animationDelay: `${i * 0.1}s`,
                                                animationDuration: '0.5s'
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {status === 'processing' && (
                            <div className="relative">
                                <div className="absolute inset-0 rounded-full border-2 border-emerald-500/30 animate-pulse"></div>
                                <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-emerald-500/50 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                                    <BrainCircuit className="w-8 h-8 text-emerald-400 animate-pulse" />
                                </div>
                            </div>
                        )}

                        {status === 'completed' && (
                            <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-emerald-600/50 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                            </div>
                        )}
                    </div>

                    {/* Status Text */}
                    <div className="text-center z-10">
                        <h3 className="text-xl font-bold text-white mb-1">
                            {status === 'connecting' && "Connecting..."}
                            {status === 'connected' && "Call Connected"}
                            {status === 'listening' && "Customer Speaking"}
                            {status === 'processing' && "AI Responding"}
                            {status === 'completed' && "Call Complete"}
                        </h3>
                        <p className="text-sm text-slate-400">
                            {status === 'connecting' && "Waiting for your call..."}
                            {status === 'connected' && "AI agent answered"}
                            {status === 'listening' && "Listening to customer"}
                            {status === 'processing' && "Generating response"}
                            {status === 'completed' && "Thank you for testing!"}
                        </p>

                        {status === 'completed' && (
                            <a
                                href="/dashboard"
                                className="inline-flex items-center gap-2 px-6 py-2.5 mt-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-all shadow-lg shadow-emerald-900/20 hover:shadow-emerald-900/40 hover:-translate-y-0.5 text-sm"
                            >
                                View Full Dashboard
                            </a>
                        )}
                    </div>
                </div>

                {/* Live Transcript */}
                <div className="h-40 bg-slate-950 border-t border-slate-800 overflow-hidden flex flex-col">
                    <div className="px-4 py-2 border-b border-slate-800/50 flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${status === 'completed' ? 'bg-slate-500' : 'bg-emerald-500 animate-pulse'}`}></div>
                        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Live Transcript</span>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto font-mono text-xs scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                        <div className="space-y-2">
                            {transcript.length === 0 && status === 'connecting' && (
                                <div className="text-slate-600 italic">Waiting for call to connect...</div>
                            )}
                            {transcript.map((line, i) => {
                                const isAI = line.startsWith('AI:')
                                const isCustomer = line.startsWith('Customer:')
                                const content = line.replace(/^(AI:|Customer:)\s*/, '')

                                return (
                                    <div
                                        key={i}
                                        className="flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300"
                                        style={{ animationDelay: `${i * 50}ms` }}
                                    >
                                        <span className={`font-bold shrink-0 ${isAI ? 'text-emerald-500' : isCustomer ? 'text-blue-400' : 'text-slate-500'}`}>
                                            {isAI ? 'AI' : isCustomer ? 'User' : '???'}
                                        </span>
                                        <span className="text-slate-300">{content}</span>
                                    </div>
                                )
                            })}
                            {(status === 'listening') && (
                                <div className="flex gap-3 items-center text-blue-400/70 animate-pulse">
                                    <Volume2 className="w-3 h-3" />
                                    <span className="italic">Listening...</span>
                                </div>
                            )}
                            {(status === 'processing') && (
                                <div className="flex gap-3 items-center text-emerald-400/70">
                                    <BrainCircuit className="w-3 h-3 animate-pulse" />
                                    <span className="italic">AI is thinking...</span>
                                </div>
                            )}
                            <div ref={transcriptEndRef} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
