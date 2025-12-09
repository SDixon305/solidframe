'use client'

import React, { useState, useEffect } from 'react'
import { Mic, Play, Pause, Volume2, MessageSquare } from 'lucide-react'
import { OnboardingData, VOICE_OPTIONS, BRAND_TONES } from '@/types/onboarding'
import { buildGreetingPreview } from '@/lib/onboarding'

interface AIPersonalityStepProps {
    data: OnboardingData
    onUpdate: (updates: Partial<OnboardingData>) => void
}

export default function AIPersonalityStep({ data, onUpdate }: AIPersonalityStepProps) {
    const [voiceId, setVoiceId] = useState(data.voiceId || 'allison')
    const [brandTone, setBrandTone] = useState<'professional' | 'friendly' | 'warm'>(
        data.brandTone || 'professional'
    )
    const [customGreeting, setCustomGreeting] = useState(data.greetingMessage || '')
    const [playingVoice, setPlayingVoice] = useState<string | null>(null)

    useEffect(() => {
        onUpdate({ voiceId, brandTone, greetingMessage: customGreeting || undefined })
    }, [voiceId, brandTone, customGreeting])

    const handlePlayVoice = (id: string) => {
        if (playingVoice === id) {
            setPlayingVoice(null)
        } else {
            setPlayingVoice(id)
            // Simulate audio playback (in real app, would play actual audio)
            setTimeout(() => setPlayingVoice(null), 3000)
        }
    }

    const greetingPreview = buildGreetingPreview(
        data.companyName || 'Your Company',
        brandTone,
        customGreeting || undefined
    )

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                    Customize your AI personality
                </h2>
                <p className="text-gray-600">
                    Choose how your AI agent sounds and speaks to your customers.
                </p>
            </div>

            {/* Voice Selection */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                    Voice
                </label>
                <div className="grid grid-cols-2 gap-3">
                    {VOICE_OPTIONS.map((voice) => {
                        const isSelected = voiceId === voice.id
                        const isPlaying = playingVoice === voice.id

                        return (
                            <button
                                key={voice.id}
                                onClick={() => setVoiceId(voice.id)}
                                className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                                    isSelected
                                        ? 'border-[#5f3bff] bg-[#5f3bff]/5'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                {/* Selected Indicator */}
                                {isSelected && (
                                    <div className="absolute top-3 right-3">
                                        <div className="w-5 h-5 rounded-full bg-[#5f3bff] flex items-center justify-center">
                                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-[#5f3bff]/10' : 'bg-gray-100'}`}>
                                        <Mic size={20} className={isSelected ? 'text-[#5f3bff]' : 'text-gray-400'} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">{voice.name}</p>
                                        <p className="text-sm text-gray-500">{voice.description}</p>
                                    </div>
                                </div>

                                {/* Play Button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handlePlayVoice(voice.id)
                                    }}
                                    className="mt-3 flex items-center gap-2 text-sm text-[#5f3bff] hover:underline"
                                >
                                    {isPlaying ? (
                                        <>
                                            <Pause size={14} />
                                            Playing...
                                        </>
                                    ) : (
                                        <>
                                            <Play size={14} />
                                            Preview voice
                                        </>
                                    )}
                                </button>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Brand Tone */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                    Brand Tone
                </label>
                <div className="flex gap-3">
                    {BRAND_TONES.map((tone) => (
                        <button
                            key={tone.value}
                            onClick={() => setBrandTone(tone.value)}
                            className={`flex-1 p-4 rounded-xl border-2 text-center transition-all ${
                                brandTone === tone.value
                                    ? 'border-[#5f3bff] bg-[#5f3bff]/5'
                                    : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                            <p className="font-medium text-gray-900">{tone.label}</p>
                            <p className="text-sm text-gray-500 mt-0.5">{tone.description}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Custom Greeting */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Greeting <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                    value={customGreeting}
                    onChange={(e) => setCustomGreeting(e.target.value)}
                    placeholder="Leave blank to use the default greeting based on your selected tone..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f3bff] focus:border-[#5f3bff] transition-colors text-gray-900 placeholder:text-gray-400 resize-none"
                />
                <p className="mt-1.5 text-sm text-gray-500">
                    Use {'{company}'} to insert your company name.
                </p>
            </div>

            {/* Preview */}
            <div className="bg-gradient-to-br from-[#5f3bff]/5 to-[#4f2fe0]/5 rounded-xl p-5 border border-[#5f3bff]/10">
                <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-[#5f3bff]/10">
                        <MessageSquare size={20} className="text-[#5f3bff]" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Here's how your AI will greet callers</h3>
                        <p className="text-gray-700 italic">"{greetingPreview}"</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
