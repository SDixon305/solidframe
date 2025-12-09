'use client'

import React from 'react'
import { Flame, Droplets, Zap, Wrench, Building } from 'lucide-react'
import { OnboardingData } from '@/types/onboarding'

interface BusinessTypeStepProps {
    data: OnboardingData
    onUpdate: (updates: Partial<OnboardingData>) => void
}

const BUSINESS_TYPES = [
    {
        value: 'hvac',
        label: 'HVAC',
        description: 'Heating, ventilation, and air conditioning',
        icon: Flame,
        color: 'text-orange-500',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
        selectedBg: 'bg-orange-100',
        selectedBorder: 'border-orange-500',
    },
    {
        value: 'plumbing',
        label: 'Plumbing',
        description: 'Pipes, drains, and water systems',
        icon: Droplets,
        color: 'text-blue-500',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        selectedBg: 'bg-blue-100',
        selectedBorder: 'border-blue-500',
    },
    {
        value: 'electrical',
        label: 'Electrical',
        description: 'Wiring, panels, and electrical systems',
        icon: Zap,
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        selectedBg: 'bg-yellow-100',
        selectedBorder: 'border-yellow-500',
    },
    {
        value: 'general-contractor',
        label: 'General Contractor',
        description: 'Multi-trade construction and renovation',
        icon: Wrench,
        color: 'text-gray-600',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200',
        selectedBg: 'bg-gray-100',
        selectedBorder: 'border-gray-500',
    },
    {
        value: 'other',
        label: 'Other',
        description: 'Other home services or trades',
        icon: Building,
        color: 'text-purple-500',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200',
        selectedBg: 'bg-purple-100',
        selectedBorder: 'border-purple-500',
    },
] as const

export default function BusinessTypeStep({ data, onUpdate }: BusinessTypeStepProps) {
    const selectedType = data.businessType

    const handleSelect = (value: typeof BUSINESS_TYPES[number]['value']) => {
        onUpdate({ businessType: value })
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                    What type of business do you run?
                </h2>
                <p className="text-gray-600">
                    This helps us customize your AI agent's knowledge and responses.
                </p>
            </div>

            {/* Business Type Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {BUSINESS_TYPES.map((type) => {
                    const Icon = type.icon
                    const isSelected = selectedType === type.value

                    return (
                        <button
                            key={type.value}
                            onClick={() => handleSelect(type.value)}
                            className={`relative p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                                isSelected
                                    ? `${type.selectedBg} ${type.selectedBorder} shadow-md`
                                    : `${type.bgColor} ${type.borderColor} hover:shadow-sm`
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

                            <div className="flex items-start gap-3">
                                <div className={`p-2 rounded-lg ${type.bgColor}`}>
                                    <Icon size={24} className={type.color} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{type.label}</h3>
                                    <p className="text-sm text-gray-600 mt-0.5">{type.description}</p>
                                </div>
                            </div>
                        </button>
                    )
                })}
            </div>

            {/* Optional Description */}
            {selectedType === 'other' && (
                <div className="mt-4">
                    <label htmlFor="businessDescription" className="block text-sm font-medium text-gray-700 mb-2">
                        Tell us more about your business
                    </label>
                    <textarea
                        id="businessDescription"
                        rows={3}
                        value={data.businessDescription || ''}
                        onChange={(e) => onUpdate({ businessDescription: e.target.value })}
                        placeholder="Describe your business type and services..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f3bff] focus:border-[#5f3bff] transition-colors text-gray-900 placeholder:text-gray-400 resize-none"
                    />
                </div>
            )}

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                    <strong>Why does this matter?</strong> Your AI agent will use industry-specific terminology and understand common service requests for your trade.
                </p>
            </div>
        </div>
    )
}
