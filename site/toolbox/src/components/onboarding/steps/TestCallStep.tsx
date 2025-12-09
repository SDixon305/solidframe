'use client'

import React, { useState } from 'react'
import { Phone, PhoneCall, CheckCircle2, Sparkles, PartyPopper, Volume2 } from 'lucide-react'
import { OnboardingData } from '@/types/onboarding'

interface TestCallStepProps {
    data: OnboardingData
    onUpdate: (updates: Partial<OnboardingData>) => void
    onComplete: () => void
}

type CallState = 'idle' | 'connecting' | 'connected' | 'completed'

export default function TestCallStep({ data, onUpdate, onComplete }: TestCallStepProps) {
    const [callState, setCallState] = useState<CallState>(
        data.testCallCompleted ? 'completed' : 'idle'
    )
    const [callDuration, setCallDuration] = useState(0)

    const handleStartCall = () => {
        setCallState('connecting')

        // Simulate connection
        setTimeout(() => {
            setCallState('connected')

            // Simulate call duration
            const interval = setInterval(() => {
                setCallDuration(prev => prev + 1)
            }, 1000)

            // Simulate call completion after 5-10 seconds
            setTimeout(() => {
                clearInterval(interval)
                setCallState('completed')
                onUpdate({
                    testCallCompleted: true,
                    testCallDate: new Date().toISOString(),
                })
            }, 5000 + Math.random() * 5000)
        }, 2000)
    }

    const handleEndCall = () => {
        setCallState('completed')
        onUpdate({
            testCallCompleted: true,
            testCallDate: new Date().toISOString(),
        })
    }

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            {callState !== 'completed' ? (
                <div className="text-center">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                        Test your AI Agent
                    </h2>
                    <p className="text-gray-600">
                        Make a test call to hear how your AI agent will handle customer calls.
                    </p>
                </div>
            ) : (
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-4">
                        <PartyPopper size={32} className="text-emerald-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        You're all set!
                    </h2>
                    <p className="text-gray-600">
                        Your AI agent is ready to handle calls. Welcome to SolidFrame!
                    </p>
                </div>
            )}

            {/* Call Interface */}
            {callState !== 'completed' && (
                <div className="bg-gray-900 rounded-2xl p-8 text-white">
                    {/* Call Status */}
                    <div className="text-center mb-8">
                        {callState === 'idle' && (
                            <p className="text-gray-400">Click below to start a test call</p>
                        )}
                        {callState === 'connecting' && (
                            <div className="flex items-center justify-center gap-2">
                                <div className="animate-pulse w-2 h-2 bg-yellow-400 rounded-full" />
                                <p className="text-yellow-400">Connecting...</p>
                            </div>
                        )}
                        {callState === 'connected' && (
                            <div>
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                                    <p className="text-emerald-400">Connected</p>
                                </div>
                                <p className="text-3xl font-mono">{formatDuration(callDuration)}</p>
                            </div>
                        )}
                    </div>

                    {/* Audio Visualization */}
                    {callState === 'connected' && (
                        <div className="flex items-center justify-center gap-1 h-16 mb-8">
                            {[...Array(20)].map((_, i) => (
                                <div
                                    key={i}
                                    className="w-1 bg-[#5f3bff] rounded-full animate-pulse"
                                    style={{
                                        height: `${20 + Math.random() * 80}%`,
                                        animationDelay: `${i * 50}ms`,
                                        animationDuration: '300ms',
                                    }}
                                />
                            ))}
                        </div>
                    )}

                    {/* Call Button */}
                    <div className="flex justify-center">
                        {callState === 'idle' && (
                            <button
                                onClick={handleStartCall}
                                className="flex items-center gap-3 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 rounded-full text-white font-semibold transition-all shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105"
                            >
                                <Phone size={24} />
                                Start Test Call
                            </button>
                        )}
                        {callState === 'connecting' && (
                            <button
                                disabled
                                className="flex items-center gap-3 px-8 py-4 bg-gray-700 rounded-full text-gray-400 font-semibold cursor-not-allowed"
                            >
                                <PhoneCall size={24} className="animate-pulse" />
                                Connecting...
                            </button>
                        )}
                        {callState === 'connected' && (
                            <button
                                onClick={handleEndCall}
                                className="flex items-center gap-3 px-8 py-4 bg-red-500 hover:bg-red-600 rounded-full text-white font-semibold transition-all shadow-lg shadow-red-500/30"
                            >
                                <Phone size={24} />
                                End Call
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Completion Summary */}
            {callState === 'completed' && (
                <div className="space-y-4">
                    {/* Success Card */}
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-6">
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-emerald-100 rounded-lg">
                                <CheckCircle2 size={24} className="text-emerald-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-emerald-900 mb-1">Test call completed!</h3>
                                <p className="text-sm text-emerald-700">
                                    Your AI agent is configured and ready to handle real calls.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* What's Next */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Sparkles size={18} className="text-[#5f3bff]" />
                            What's next?
                        </h3>
                        <ul className="space-y-3">
                            {[
                                'Set up call forwarding to your AI number',
                                'Explore your dashboard and tools',
                                'Review your call transcripts and analytics',
                                'Fine-tune your AI settings anytime',
                            ].map((item, index) => (
                                <li key={index} className="flex items-center gap-3 text-gray-700">
                                    <div className="w-5 h-5 rounded-full bg-[#5f3bff]/10 flex items-center justify-center">
                                        <span className="text-xs font-bold text-[#5f3bff]">{index + 1}</span>
                                    </div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {/* Skip Test Option */}
            {callState === 'idle' && (
                <div className="text-center">
                    <button
                        onClick={() => {
                            setCallState('completed')
                            onUpdate({ testCallCompleted: false })
                        }}
                        className="text-sm text-gray-500 hover:text-gray-700 hover:underline"
                    >
                        Skip test and finish setup
                    </button>
                </div>
            )}
        </div>
    )
}
