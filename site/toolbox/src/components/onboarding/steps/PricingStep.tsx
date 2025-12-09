'use client'

import React, { useState, useEffect } from 'react'
import { DollarSign, AlertCircle, Info } from 'lucide-react'
import { OnboardingData } from '@/types/onboarding'

interface PricingStepProps {
    data: OnboardingData
    onUpdate: (updates: Partial<OnboardingData>) => void
}

export default function PricingStep({ data, onUpdate }: PricingStepProps) {
    const [emergencyRate, setEmergencyRate] = useState(data.emergencyRate?.toString() || '')
    const [minimumCharge, setMinimumCharge] = useState(data.minimumCharge?.toString() || '')

    useEffect(() => {
        onUpdate({
            emergencyRate: emergencyRate ? parseFloat(emergencyRate) : undefined,
            minimumCharge: minimumCharge ? parseFloat(minimumCharge) : undefined,
        })
    }, [emergencyRate, minimumCharge])

    const formatCurrency = (value: string) => {
        const num = parseFloat(value)
        if (isNaN(num)) return ''
        return num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                    Set your after-hours pricing
                </h2>
                <p className="text-gray-600">
                    Your AI will disclose these rates to callers before dispatching a technician.
                </p>
            </div>

            {/* Pricing Inputs */}
            <div className="space-y-5">
                {/* Emergency Service Rate */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Emergency Service Rate
                    </label>
                    <div className="relative">
                        <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="number"
                            value={emergencyRate}
                            onChange={(e) => setEmergencyRate(e.target.value)}
                            placeholder="150"
                            min="0"
                            step="0.01"
                            className="w-full pl-9 pr-16 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f3bff] focus:border-[#5f3bff] transition-colors text-gray-900 placeholder:text-gray-400"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                            / hour
                        </span>
                    </div>
                    <p className="mt-1.5 text-sm text-gray-500">
                        The hourly rate for after-hours emergency service calls.
                    </p>
                </div>

                {/* Minimum Service Charge */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Minimum Service Charge
                    </label>
                    <div className="relative">
                        <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="number"
                            value={minimumCharge}
                            onChange={(e) => setMinimumCharge(e.target.value)}
                            placeholder="99"
                            min="0"
                            step="0.01"
                            className="w-full pl-9 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f3bff] focus:border-[#5f3bff] transition-colors text-gray-900 placeholder:text-gray-400"
                        />
                    </div>
                    <p className="mt-1.5 text-sm text-gray-500">
                        The minimum charge for any after-hours service call (e.g., trip charge).
                    </p>
                </div>
            </div>

            {/* Preview */}
            {(emergencyRate || minimumCharge) && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                    <h3 className="font-semibold text-gray-900 mb-3">What callers will hear:</h3>
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <p className="text-gray-700 italic">
                            "For after-hours emergency service, there is a
                            {minimumCharge && ` $${formatCurrency(minimumCharge)} minimum service charge`}
                            {minimumCharge && emergencyRate && ' and'}
                            {emergencyRate && ` a rate of $${formatCurrency(emergencyRate)} per hour`}.
                            Would you like me to dispatch a technician?"
                        </p>
                    </div>
                </div>
            )}

            {/* Tips */}
            <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <Info size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-amber-800">
                        <p className="font-semibold mb-1">Pricing Tips</p>
                        <ul className="list-disc list-inside space-y-1">
                            <li>Industry average for emergency HVAC calls: $100-200/hour</li>
                            <li>Most contractors charge a $75-150 minimum or trip charge</li>
                            <li>Clear pricing upfront reduces callbacks and disputes</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* No Pricing Warning */}
            {!emergencyRate && !minimumCharge && (
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-blue-800">
                            <strong>Skip this step?</strong> Your AI will still dispatch technicians for emergencies, but won't quote pricing. You can add this later in Settings.
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}
