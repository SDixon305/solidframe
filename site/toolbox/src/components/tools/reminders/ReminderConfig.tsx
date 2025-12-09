'use client'

import React, { useState } from 'react'
import { Clock, Bell, Save, MessageSquare } from 'lucide-react'

interface ReminderSettings {
    dayBefore: boolean
    twoHoursBefore: boolean
    customHours?: number
}

interface ReminderConfigProps {
    settings: ReminderSettings
    onSave: (settings: ReminderSettings) => void
}

export default function ReminderConfig({ settings, onSave }: ReminderConfigProps) {
    const [config, setConfig] = useState<ReminderSettings>(settings)
    const [hasChanges, setHasChanges] = useState(false)

    const handleToggle = (key: keyof ReminderSettings) => {
        if (key === 'customHours') return
        setConfig(prev => ({ ...prev, [key]: !prev[key] }))
        setHasChanges(true)
    }

    const handleSave = () => {
        onSave(config)
        setHasChanges(false)
    }

    const reminderOptions = [
        {
            key: 'dayBefore' as const,
            icon: Clock,
            label: '24 Hours Before',
            description: 'Send a reminder the day before the appointment',
            enabled: config.dayBefore,
        },
        {
            key: 'twoHoursBefore' as const,
            icon: Bell,
            label: '2 Hours Before',
            description: 'Send a final reminder 2 hours before',
            enabled: config.twoHoursBefore,
        },
    ]

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
                <MessageSquare size={18} className="text-gray-400" />
                <h3 className="font-semibold text-gray-900">Reminder Schedule</h3>
            </div>

            <p className="text-sm text-gray-500 mb-6">
                Choose when to send appointment reminders to your customers
            </p>

            <div className="space-y-4">
                {reminderOptions.map((option) => {
                    const Icon = option.icon

                    return (
                        <div
                            key={option.key}
                            className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all cursor-pointer ${
                                option.enabled
                                    ? 'border-[#5f3bff] bg-[#5f3bff]/5'
                                    : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => handleToggle(option.key)}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-2.5 rounded-lg ${
                                    option.enabled ? 'bg-[#5f3bff]/10' : 'bg-gray-100'
                                }`}>
                                    <Icon
                                        size={20}
                                        className={option.enabled ? 'text-[#5f3bff]' : 'text-gray-400'}
                                    />
                                </div>
                                <div>
                                    <div className="font-medium text-gray-900">{option.label}</div>
                                    <div className="text-sm text-gray-500">{option.description}</div>
                                </div>
                            </div>

                            <button
                                type="button"
                                role="switch"
                                aria-checked={option.enabled}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleToggle(option.key)
                                }}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                    option.enabled ? 'bg-[#5f3bff]' : 'bg-gray-200'
                                }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                        option.enabled ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                                />
                            </button>
                        </div>
                    )
                })}
            </div>

            {/* Active Summary */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">
                    <strong>Active reminders:</strong>{' '}
                    {!config.dayBefore && !config.twoHoursBefore ? (
                        <span className="text-amber-600">None selected</span>
                    ) : (
                        [
                            config.dayBefore && '24 hours before',
                            config.twoHoursBefore && '2 hours before',
                        ]
                            .filter(Boolean)
                            .join(' and ')
                    )}
                </div>
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
