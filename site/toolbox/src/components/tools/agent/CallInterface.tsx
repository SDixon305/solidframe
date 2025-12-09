'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Phone, PhoneOff, Mic, MicOff, Volume2 } from 'lucide-react'

interface CallInterfaceProps {
    onCallStart?: () => void
    onCallEnd?: () => void
    vapiAssistantId?: string
    tenantName?: string
}

export default function CallInterface({
    onCallStart,
    onCallEnd,
    vapiAssistantId,
    tenantName = 'your business',
}: CallInterfaceProps) {
    const [callState, setCallState] = useState<'idle' | 'connecting' | 'active' | 'ending'>('idle')
    const [duration, setDuration] = useState(0)
    const [isMuted, setIsMuted] = useState(false)
    const [transcript, setTranscript] = useState<{ role: 'ai' | 'user'; text: string }[]>([])

    const durationInterval = useRef<NodeJS.Timeout | null>(null)
    const vapiRef = useRef<any>(null)

    // Duration timer
    useEffect(() => {
        if (callState === 'active') {
            durationInterval.current = setInterval(() => {
                setDuration(d => d + 1)
            }, 1000)
        } else {
            if (durationInterval.current) {
                clearInterval(durationInterval.current)
            }
        }

        return () => {
            if (durationInterval.current) {
                clearInterval(durationInterval.current)
            }
        }
    }, [callState])

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const handleStartCall = async () => {
        setCallState('connecting')
        setDuration(0)
        setTranscript([])
        onCallStart?.()

        // In production, this would use Vapi Web SDK
        // For now, simulate a connection
        try {
            // Check if Vapi is available
            if (typeof window !== 'undefined' && (window as any).Vapi) {
                const Vapi = (window as any).Vapi
                vapiRef.current = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY)

                vapiRef.current.on('call-start', () => {
                    setCallState('active')
                })

                vapiRef.current.on('call-end', () => {
                    setCallState('idle')
                    onCallEnd?.()
                })

                vapiRef.current.on('message', (message: any) => {
                    if (message.type === 'transcript') {
                        setTranscript(prev => [...prev, {
                            role: message.role === 'assistant' ? 'ai' : 'user',
                            text: message.transcript,
                        }])
                    }
                })

                await vapiRef.current.start(vapiAssistantId)
            } else {
                // Demo mode - simulate call
                setTimeout(() => {
                    setCallState('active')
                    // Add demo transcript
                    setTimeout(() => {
                        setTranscript([
                            { role: 'ai', text: `Thanks for calling ${tenantName}! This is your AI assistant. How can I help you today?` }
                        ])
                    }, 1500)
                }, 2000)
            }
        } catch (error) {
            console.error('Failed to start call:', error)
            setCallState('idle')
        }
    }

    const handleEndCall = () => {
        setCallState('ending')

        if (vapiRef.current) {
            vapiRef.current.stop()
            vapiRef.current = null
        }

        setTimeout(() => {
            setCallState('idle')
            onCallEnd?.()
        }, 1000)
    }

    const toggleMute = () => {
        setIsMuted(!isMuted)
        if (vapiRef.current) {
            vapiRef.current.setMuted(!isMuted)
        }
    }

    return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {/* Call Status Bar */}
            <div className={`px-4 py-3 text-sm font-medium text-center transition-colors ${
                callState === 'idle' ? 'bg-gray-50 text-gray-600' :
                callState === 'connecting' ? 'bg-amber-50 text-amber-700' :
                callState === 'active' ? 'bg-emerald-50 text-emerald-700' :
                'bg-gray-50 text-gray-600'
            }`}>
                {callState === 'idle' && 'Ready to test your AI agent'}
                {callState === 'connecting' && 'Connecting...'}
                {callState === 'active' && `Call in progress - ${formatDuration(duration)}`}
                {callState === 'ending' && 'Ending call...'}
            </div>

            {/* Main Call Interface */}
            <div className="p-6">
                {/* Waveform Visualization */}
                <div className="relative h-24 bg-gray-50 rounded-lg mb-6 overflow-hidden flex items-center justify-center">
                    {callState === 'idle' ? (
                        <div className="flex items-center gap-2 text-gray-400">
                            <Phone size={20} />
                            <span className="text-sm">Click to start a test call</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1">
                            {[...Array(20)].map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-1 rounded-full transition-all duration-150 ${
                                        callState === 'active' ? 'bg-[#5f3bff]' : 'bg-gray-300'
                                    }`}
                                    style={{
                                        height: callState === 'active'
                                            ? `${Math.random() * 60 + 20}%`
                                            : '20%',
                                        animationDelay: `${i * 50}ms`,
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Call Controls */}
                <div className="flex items-center justify-center gap-4">
                    {callState === 'idle' ? (
                        <button
                            onClick={handleStartCall}
                            className="flex items-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-full shadow-lg shadow-emerald-500/30 transition-all hover:scale-105"
                        >
                            <Phone size={20} />
                            Start Test Call
                        </button>
                    ) : (
                        <>
                            {/* Mute Button */}
                            <button
                                onClick={toggleMute}
                                disabled={callState !== 'active'}
                                className={`p-4 rounded-full transition-colors ${
                                    isMuted
                                        ? 'bg-red-100 text-red-600'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                } ${callState !== 'active' ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                            </button>

                            {/* End Call Button */}
                            <button
                                onClick={handleEndCall}
                                disabled={callState === 'ending'}
                                className="flex items-center gap-2 px-8 py-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-full shadow-lg shadow-red-500/30 transition-all hover:scale-105 disabled:opacity-50"
                            >
                                <PhoneOff size={20} />
                                End Call
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Live Transcript */}
            {transcript.length > 0 && (
                <div className="border-t border-gray-100 p-4 bg-gray-50 max-h-48 overflow-y-auto">
                    <div className="flex items-center gap-2 mb-3">
                        <Volume2 size={14} className="text-gray-400" />
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Live Transcript
                        </span>
                    </div>
                    <div className="space-y-2">
                        {transcript.map((msg, i) => (
                            <div
                                key={i}
                                className={`text-sm p-2 rounded ${
                                    msg.role === 'ai'
                                        ? 'bg-[#5f3bff]/10 text-gray-700'
                                        : 'bg-white text-gray-600'
                                }`}
                            >
                                <span className="font-medium text-xs uppercase text-gray-400 mr-2">
                                    {msg.role === 'ai' ? 'AI:' : 'You:'}
                                </span>
                                {msg.text}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
