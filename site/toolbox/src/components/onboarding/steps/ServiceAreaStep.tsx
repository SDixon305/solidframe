'use client'

import React, { useState } from 'react'
import { MapPin, Hash, Target, X, Plus } from 'lucide-react'
import { OnboardingData } from '@/types/onboarding'

interface ServiceAreaStepProps {
    data: OnboardingData
    onUpdate: (updates: Partial<OnboardingData>) => void
}

const RADIUS_OPTIONS = [
    { value: 10, label: '10 miles' },
    { value: 25, label: '25 miles' },
    { value: 50, label: '50 miles' },
    { value: 100, label: '100 miles' },
]

export default function ServiceAreaStep({ data, onUpdate }: ServiceAreaStepProps) {
    const [areaType, setAreaType] = useState<'zip-codes' | 'radius'>(data.serviceAreaType || 'zip-codes')
    const [zipInput, setZipInput] = useState('')
    const [zipCodes, setZipCodes] = useState<string[]>(data.zipCodes || [])

    const handleAreaTypeChange = (type: 'zip-codes' | 'radius') => {
        setAreaType(type)
        onUpdate({ serviceAreaType: type })
    }

    const handleAddZipCode = () => {
        const cleaned = zipInput.trim().replace(/\D/g, '')
        if (cleaned.length === 5 && !zipCodes.includes(cleaned)) {
            const newZipCodes = [...zipCodes, cleaned]
            setZipCodes(newZipCodes)
            onUpdate({ zipCodes: newZipCodes })
            setZipInput('')
        }
    }

    const handleRemoveZipCode = (zip: string) => {
        const newZipCodes = zipCodes.filter(z => z !== zip)
        setZipCodes(newZipCodes)
        onUpdate({ zipCodes: newZipCodes })
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            handleAddZipCode()
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                    Where do you provide service?
                </h2>
                <p className="text-gray-600">
                    Define your service area so the AI can inform callers about coverage.
                </p>
            </div>

            {/* Area Type Toggle */}
            <div className="flex gap-3">
                <button
                    onClick={() => handleAreaTypeChange('zip-codes')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                        areaType === 'zip-codes'
                            ? 'border-[#5f3bff] bg-[#5f3bff]/5 text-[#5f3bff]'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                >
                    <Hash size={18} />
                    <span className="font-medium">Zip Codes</span>
                </button>
                <button
                    onClick={() => handleAreaTypeChange('radius')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                        areaType === 'radius'
                            ? 'border-[#5f3bff] bg-[#5f3bff]/5 text-[#5f3bff]'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                >
                    <Target size={18} />
                    <span className="font-medium">Radius</span>
                </button>
            </div>

            {/* Zip Codes Input */}
            {areaType === 'zip-codes' && (
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Enter zip codes
                        </label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Hash size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    value={zipInput}
                                    onChange={(e) => setZipInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Enter 5-digit zip code"
                                    maxLength={5}
                                    className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f3bff] focus:border-[#5f3bff] transition-colors text-gray-900 placeholder:text-gray-400"
                                />
                            </div>
                            <button
                                onClick={handleAddZipCode}
                                disabled={zipInput.replace(/\D/g, '').length !== 5}
                                className="px-4 py-2.5 bg-[#5f3bff] text-white rounded-lg font-medium hover:bg-[#4f2fe0] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <Plus size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Zip Code Tags */}
                    {zipCodes.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {zipCodes.map((zip) => (
                                <span
                                    key={zip}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#5f3bff]/10 text-[#5f3bff] rounded-full text-sm font-medium"
                                >
                                    {zip}
                                    <button
                                        onClick={() => handleRemoveZipCode(zip)}
                                        className="hover:bg-[#5f3bff]/20 rounded-full p-0.5 transition-colors"
                                    >
                                        <X size={14} />
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}

                    {zipCodes.length === 0 && (
                        <p className="text-sm text-gray-500">
                            Add the zip codes where you provide service.
                        </p>
                    )}
                </div>
            )}

            {/* Radius Input */}
            {areaType === 'radius' && (
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Center address
                        </label>
                        <div className="relative">
                            <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={data.radiusCenter || ''}
                                onChange={(e) => onUpdate({ radiusCenter: e.target.value })}
                                placeholder="Enter your business address"
                                className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f3bff] focus:border-[#5f3bff] transition-colors text-gray-900 placeholder:text-gray-400"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Service radius
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                            {RADIUS_OPTIONS.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => onUpdate({ radiusMiles: option.value })}
                                    className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                                        data.radiusMiles === option.value
                                            ? 'border-[#5f3bff] bg-[#5f3bff] text-white'
                                            : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Map Placeholder */}
                    <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center border border-gray-200">
                        <div className="text-center text-gray-400">
                            <MapPin size={32} className="mx-auto mb-2" />
                            <p className="text-sm">Map preview coming soon</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Info Box */}
            <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
                <p className="text-sm text-amber-800">
                    <strong>Tip:</strong> Your AI will let callers know if they're outside your service area and can offer to take a message or suggest alternatives.
                </p>
            </div>
        </div>
    )
}
