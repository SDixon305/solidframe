'use client'

import React, { useState, useEffect } from 'react'
import { Phone, Copy, Check, ExternalLink, ArrowRight } from 'lucide-react'
import { OnboardingData } from '@/types/onboarding'
import { generatePlaceholderPhoneNumber } from '@/lib/onboarding'

interface PhoneNumberStepProps {
    data: OnboardingData
    onUpdate: (updates: Partial<OnboardingData>) => void
}

export default function PhoneNumberStep({ data, onUpdate }: PhoneNumberStepProps) {
    const [phoneNumber, setPhoneNumber] = useState(data.assignedPhoneNumber || '')
    const [copied, setCopied] = useState(false)

    // Generate a placeholder phone number if not already assigned
    useEffect(() => {
        if (!phoneNumber) {
            const newNumber = generatePlaceholderPhoneNumber()
            setPhoneNumber(newNumber)
            onUpdate({ assignedPhoneNumber: newNumber })
        }
    }, [])

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(phoneNumber)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy:', err)
        }
    }

    const forwardingSteps = [
        {
            title: 'Set up call forwarding',
            description: 'Forward your business line to this number after hours',
        },
        {
            title: 'Test the forwarding',
            description: 'Call your business line after hours to verify',
        },
        {
            title: 'You\'re all set!',
            description: 'Your AI will now answer after-hours calls',
        },
    ]

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                    Your AI Phone Number
                </h2>
                <p className="text-gray-600">
                    This is your dedicated AI phone line. Forward your business calls here after hours.
                </p>
            </div>

            {/* Phone Number Display */}
            <div className="bg-gradient-to-br from-[#5f3bff] to-[#4f2fe0] rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/20 rounded-xl">
                            <Phone size={28} className="text-white" />
                        </div>
                        <div>
                            <p className="text-white/70 text-sm mb-1">Your AI Line</p>
                            <p className="text-2xl font-bold tracking-wide">{phoneNumber}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm font-medium"
                    >
                        {copied ? (
                            <>
                                <Check size={16} />
                                Copied!
                            </>
                        ) : (
                            <>
                                <Copy size={16} />
                                Copy
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Setup Instructions */}
            <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="font-semibold text-gray-900 mb-4">How to set up call forwarding</h3>
                <div className="space-y-4">
                    {forwardingSteps.map((step, index) => (
                        <div key={index} className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-full bg-[#5f3bff] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                                {index + 1}
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">{step.title}</p>
                                <p className="text-sm text-gray-600">{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Carrier Instructions */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="font-semibold text-gray-900 mb-3">Quick forwarding codes</h3>
                <div className="grid grid-cols-2 gap-4">
                    {[
                        { carrier: 'AT&T', code: '*61*' + phoneNumber.replace(/\D/g, '') + '#' },
                        { carrier: 'Verizon', code: '*71' + phoneNumber.replace(/\D/g, '') },
                        { carrier: 'T-Mobile', code: '**61*' + phoneNumber.replace(/\D/g, '') + '#' },
                        { carrier: 'Other', code: 'Check carrier settings' },
                    ].map((item) => (
                        <div key={item.carrier} className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-500 mb-1">{item.carrier}</p>
                            <p className="font-mono text-sm text-gray-900 truncate">{item.code}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Help Link */}
            <a
                href="#"
                className="flex items-center justify-center gap-2 text-[#5f3bff] font-medium hover:underline"
            >
                Need help setting up? View detailed instructions
                <ExternalLink size={16} />
            </a>

            {/* Note */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                    <strong>Note:</strong> This is a demo phone number. In production, you'll receive a real Vapi number connected to your AI agent.
                </p>
            </div>
        </div>
    )
}
