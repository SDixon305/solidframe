'use client'

import React, { useState, useEffect } from 'react'
import { Clock, Moon, Sun } from 'lucide-react'
import { OnboardingData, DEFAULT_BUSINESS_HOURS, BusinessHours, TIMEZONES } from '@/types/onboarding'

interface BusinessHoursStepProps {
    data: OnboardingData
    onUpdate: (updates: Partial<OnboardingData>) => void
}

export default function BusinessHoursStep({ data, onUpdate }: BusinessHoursStepProps) {
    const [hours, setHours] = useState<BusinessHours[]>(data.businessHours || DEFAULT_BUSINESS_HOURS)
    const [timezone, setTimezone] = useState(data.timezone || 'America/Chicago')

    useEffect(() => {
        onUpdate({ businessHours: hours, timezone })
    }, [hours, timezone])

    const handleToggleDay = (index: number) => {
        const newHours = [...hours]
        newHours[index].isOpen = !newHours[index].isOpen
        setHours(newHours)
    }

    const handleTimeChange = (index: number, field: 'openTime' | 'closeTime', value: string) => {
        const newHours = [...hours]
        newHours[index][field] = value
        setHours(newHours)
    }

    const getAfterHoursPreview = () => {
        const closedDays = hours.filter(h => !h.isOpen).map(h => h.day)
        const openDay = hours.find(h => h.isOpen)

        if (!openDay) return 'AI handles all calls'

        let preview = `AI answers calls after ${openDay.closeTime}`
        if (closedDays.length > 0) {
            preview += ` and all day ${closedDays.slice(0, 2).join(', ')}`
            if (closedDays.length > 2) preview += '...'
        }
        return preview
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                    Set your business hours
                </h2>
                <p className="text-gray-600">
                    Your AI agent will handle calls outside these hours.
                </p>
            </div>

            {/* Timezone */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timezone
                </label>
                <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f3bff] focus:border-[#5f3bff] transition-colors text-gray-900 bg-white"
                >
                    {TIMEZONES.map((tz) => (
                        <option key={tz.value} value={tz.value}>
                            {tz.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Hours Grid */}
            <div className="space-y-3">
                {hours.map((day, index) => (
                    <div
                        key={day.day}
                        className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${
                            day.isOpen ? 'bg-white border border-gray-200' : 'bg-gray-50 border border-gray-100'
                        }`}
                    >
                        {/* Toggle */}
                        <button
                            onClick={() => handleToggleDay(index)}
                            className={`relative w-12 h-6 rounded-full transition-colors ${
                                day.isOpen ? 'bg-[#5f3bff]' : 'bg-gray-300'
                            }`}
                        >
                            <span
                                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${
                                    day.isOpen ? 'left-7' : 'left-1'
                                }`}
                            />
                        </button>

                        {/* Day Name */}
                        <span className={`w-24 font-medium ${day.isOpen ? 'text-gray-900' : 'text-gray-400'}`}>
                            {day.day}
                        </span>

                        {/* Time Inputs */}
                        {day.isOpen ? (
                            <div className="flex items-center gap-2 flex-1">
                                <input
                                    type="time"
                                    value={day.openTime}
                                    onChange={(e) => handleTimeChange(index, 'openTime', e.target.value)}
                                    className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#5f3bff] focus:border-[#5f3bff]"
                                />
                                <span className="text-gray-400">to</span>
                                <input
                                    type="time"
                                    value={day.closeTime}
                                    onChange={(e) => handleTimeChange(index, 'closeTime', e.target.value)}
                                    className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#5f3bff] focus:border-[#5f3bff]"
                                />
                            </div>
                        ) : (
                            <span className="text-gray-400 text-sm">Closed</span>
                        )}
                    </div>
                ))}
            </div>

            {/* After Hours Preview */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-5 border border-indigo-100">
                <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-indigo-100">
                        <Moon size={20} className="text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-1">After Hours Preview</h3>
                        <p className="text-sm text-gray-600">{getAfterHoursPreview()}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
