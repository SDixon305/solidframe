'use client'

import React, { useState } from 'react'
import { Clock, Save } from 'lucide-react'

interface TriggerConfigProps {
    hoursDelay: number
    onSave: (hours: number) => void
}

export default function TriggerConfig({ hoursDelay, onSave }: TriggerConfigProps) {
    const [hours, setHours] = useState(hoursDelay)
    const [hasChanges, setHasChanges] = useState(false)

    const presets = [
        { value: 2, label: '2 hours' },
        { value: 4, label: '4 hours' },
        { value: 24, label: '1 day' },
        { value: 48, label: '2 days' },
    ]

    const handleChange = (value: number) => {
        setHours(value)
        setHasChanges(true)
    }

    const handleSave = () => {
        onSave(hours)
        setHasChanges(false)
    }

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
                <Clock size={18} className="text-gray-400" />
                <h3 className="font-semibold text-gray-900">Review Request Timing</h3>
            </div>

            <p className="text-sm text-gray-500 mb-4">
                Send review requests after a job is marked complete
            </p>

            {/* Presets */}
            <div className="flex flex-wrap gap-2 mb-4">
                {presets.map((preset) => (
                    <button
                        key={preset.value}
                        onClick={() => handleChange(preset.value)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            hours === preset.value
                                ? 'bg-[#5f3bff] text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        {preset.label}
                    </button>
                ))}
            </div>

            {/* Custom Input */}
            <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">Or custom:</span>
                <input
                    type="number"
                    value={hours}
                    onChange={(e) => handleChange(parseInt(e.target.value) || 0)}
                    min={1}
                    max={168}
                    className="w-20 px-3 py-2 border border-gray-200 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#5f3bff]/20 focus:border-[#5f3bff]"
                />
                <span className="text-sm text-gray-500">hours after completion</span>
            </div>

            {/* Save Button */}
            {hasChanges && (
                <button
                    onClick={handleSave}
                    className="mt-4 flex items-center gap-2 px-4 py-2 bg-[#5f3bff] text-white text-sm font-medium rounded-lg hover:bg-[#4f2fe0] transition-colors"
                >
                    <Save size={14} />
                    Save Changes
                </button>
            )}
        </div>
    )
}
