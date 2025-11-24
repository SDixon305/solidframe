'use client'

import { useState, useEffect } from 'react'
import { Phone, Mic, BrainCircuit, CheckCircle2, Timer, Volume2 } from 'lucide-react'

export type CallStatus = 'idle' | 'connecting' | 'connected' | 'listening' | 'processing' | 'completed'

interface LiveCallStatusProps {
    phoneNumber: string
    status: CallStatus
    transcript: string[]
    onStartCall: () => void
}

export default function LiveCallStatus({ phoneNumber, status, transcript, onStartCall }: LiveCallStatusProps) {
    const [duration, setDuration] = useState(0)

    useEffect(() => {
        let interval: NodeJS.Timeout
        if (status === 'connected' || status === 'listening' || status === 'processing') {
            interval = setInterval(() => {
                setDuration(d => d + 1)
            }, 1000)
        }
        return () => clearInterval(interval)
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
                <div className="flex-1 p-6 flex flex-col items-center justify-center relative">
                    {/* Background Grid */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

                    {/* Central Visual */}
                    <div className="relative z-10 mb-8">
                        {status === 'connecting' && (
                            <div className="w-24 h-24 rounded-full border-4 border-slate-700 border-t-emerald-500 animate-spin"></div>
                        )}

                        {status === 'listening' && (
                            <div className="relative">
                                <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping"></div>
                                <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-emerald-500/50 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                                    <Mic className="w-8 h-8 text-emerald-400" />
                                </div>
                            </div>
                        )}

                        {status === 'processing' && (
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-blue-500/50 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                                    <BrainCircuit className="w-8 h-8 text-blue-400 animate-pulse" />
                                </div>
                            </div>
                        )}

                        {status === 'completed' && (
                            <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center">
                                <CheckCircle2 className="w-10 h-10 text-slate-400" />
                            </div>
                        )}
                    </div>

                    {/* Status Text */}
                    <div className="text-center z-10">
                        <h3 className="text-xl font-bold text-white mb-1">
                            {status === 'connecting' && "Connecting..."}
                            {status === 'listening' && "Listening..."}
                            {status === 'processing' && "Thinking..."}
                            {status === 'completed' && "Job Booked"}
                        </h3>
                        <p className="text-sm text-slate-400 mb-6">
                            {status === 'connecting' && "Establishing secure line"}
                            {status === 'listening' && "Analyzing voice patterns"}
                            {status === 'processing' && "Checking schedule & availability"}
                            {status === 'completed' && "Notification sent to technician"}
                        </p>

                        {status === 'completed' && (
                            <a
                                href="/dashboard"
                                className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-all shadow-lg shadow-emerald-900/20 hover:shadow-emerald-900/40 hover:-translate-y-0.5 text-sm"
                            >
                                View Full Dashboard
                            </a>
                        )}
                    </div>
                </div>

                {/* Live Transcript / Log */}
                <div className="h-32 bg-slate-950 border-t border-slate-800 p-4 overflow-y-auto font-mono text-xs">
                    <div className="space-y-2">
                        {transcript.map((line, i) => (
                            <div key={i} className="flex gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <span className="text-slate-600">[{formatTime(duration - (transcript.length - i) * 2)}]</span>
                                <span className={line.startsWith('AI:') ? 'text-emerald-400' : 'text-blue-300'}>
                                    {line}
                                </span>
                            </div>
                        ))}
                        {status === 'listening' && (
                            <div className="flex gap-2 items-center text-slate-500 animate-pulse">
                                <Volume2 className="w-3 h-3" />
                                <span>Detecting speech...</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
