'use client'

import React, { useState, useEffect } from 'react'
import { AlertTriangle, Plus, X, Flame, Droplets, Zap, Wind, Shield } from 'lucide-react'
import { OnboardingData, DEFAULT_EMERGENCY_TYPES, EmergencyType } from '@/types/onboarding'

interface EmergencyProtocolsStepProps {
    data: OnboardingData
    onUpdate: (updates: Partial<OnboardingData>) => void
}

const EMERGENCY_ICONS: Record<string, React.ElementType> = {
    'gas-leak': Flame,
    'no-heat': Wind,
    'no-ac': Wind,
    'water-leak': Droplets,
    'electrical-hazard': Zap,
    'co-detector': Shield,
}

export default function EmergencyProtocolsStep({ data, onUpdate }: EmergencyProtocolsStepProps) {
    const [emergencyTypes, setEmergencyTypes] = useState<EmergencyType[]>(
        data.emergencyTypes || DEFAULT_EMERGENCY_TYPES
    )
    const [customEmergency, setCustomEmergency] = useState('')
    const [showAddCustom, setShowAddCustom] = useState(false)

    useEffect(() => {
        onUpdate({ emergencyTypes })
    }, [emergencyTypes])

    const handleToggle = (id: string) => {
        setEmergencyTypes(prev =>
            prev.map(et =>
                et.id === id ? { ...et, enabled: !et.enabled } : et
            )
        )
    }

    const handleAddCustom = () => {
        if (customEmergency.trim()) {
            const newType: EmergencyType = {
                id: `custom-${Date.now()}`,
                label: customEmergency.trim(),
                enabled: true,
                isCustom: true,
            }
            setEmergencyTypes(prev => [...prev, newType])
            setCustomEmergency('')
            setShowAddCustom(false)
        }
    }

    const handleRemoveCustom = (id: string) => {
        setEmergencyTypes(prev => prev.filter(et => et.id !== id))
    }

    const enabledCount = emergencyTypes.filter(et => et.enabled).length

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                    Configure emergency protocols
                </h2>
                <p className="text-gray-600">
                    Select which situations your AI should treat as emergencies requiring immediate dispatch.
                </p>
            </div>

            {/* Emergency Types List */}
            <div className="space-y-2">
                {emergencyTypes.map((emergency) => {
                    const Icon = EMERGENCY_ICONS[emergency.id] || AlertTriangle

                    return (
                        <div
                            key={emergency.id}
                            className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                                emergency.enabled
                                    ? 'border-red-200 bg-red-50/50'
                                    : 'border-gray-200 bg-gray-50'
                            }`}
                        >
                            {/* Checkbox */}
                            <button
                                onClick={() => handleToggle(emergency.id)}
                                className={`w-6 h-6 rounded flex items-center justify-center border-2 transition-all ${
                                    emergency.enabled
                                        ? 'bg-red-500 border-red-500 text-white'
                                        : 'border-gray-300 bg-white'
                                }`}
                            >
                                {emergency.enabled && (
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </button>

                            {/* Icon */}
                            <div className={`p-2 rounded-lg ${emergency.enabled ? 'bg-red-100' : 'bg-gray-100'}`}>
                                <Icon size={18} className={emergency.enabled ? 'text-red-600' : 'text-gray-400'} />
                            </div>

                            {/* Label */}
                            <span className={`flex-1 font-medium ${
                                emergency.enabled ? 'text-gray-900' : 'text-gray-500'
                            }`}>
                                {emergency.label}
                            </span>

                            {/* Remove button for custom */}
                            {emergency.isCustom && (
                                <button
                                    onClick={() => handleRemoveCustom(emergency.id)}
                                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Add Custom Emergency */}
            {showAddCustom ? (
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={customEmergency}
                        onChange={(e) => setCustomEmergency(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddCustom()}
                        placeholder="Describe the emergency type..."
                        autoFocus
                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f3bff] focus:border-[#5f3bff] transition-colors text-gray-900 placeholder:text-gray-400"
                    />
                    <button
                        onClick={handleAddCustom}
                        disabled={!customEmergency.trim()}
                        className="px-4 py-2.5 bg-[#5f3bff] text-white rounded-lg font-medium hover:bg-[#4f2fe0] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Add
                    </button>
                    <button
                        onClick={() => {
                            setShowAddCustom(false)
                            setCustomEmergency('')
                        }}
                        className="px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            ) : (
                <button
                    onClick={() => setShowAddCustom(true)}
                    className="flex items-center gap-2 text-[#5f3bff] font-medium hover:underline"
                >
                    <Plus size={18} />
                    Add custom emergency type
                </button>
            )}

            {/* Summary */}
            <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <AlertTriangle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm text-amber-800">
                            <strong>{enabledCount} emergency type{enabledCount !== 1 ? 's' : ''}</strong> configured.
                            When a caller reports one of these, your AI will immediately attempt to dispatch an on-call technician.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
