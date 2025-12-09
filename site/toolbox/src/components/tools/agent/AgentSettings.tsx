'use client'

import React, { useState } from 'react'
import { Volume2, Clock, AlertTriangle, Save, RefreshCw, Play } from 'lucide-react'

export interface AgentConfig {
    voiceId: string
    voiceName: string
    greeting: string
    businessHours: {
        start: string
        end: string
        timezone: string
    }
    emergencyKeywords: string[]
    escalationEnabled: boolean
    escalationPhone?: string
}

interface AgentSettingsProps {
    config: AgentConfig
    onSave: (config: AgentConfig) => void
    onTestGreeting?: () => void
}

const VOICE_OPTIONS = [
    { id: 'alloy', name: 'Alloy', description: 'Neutral and balanced' },
    { id: 'echo', name: 'Echo', description: 'Warm and professional' },
    { id: 'fable', name: 'Fable', description: 'Friendly and energetic' },
    { id: 'onyx', name: 'Onyx', description: 'Deep and authoritative' },
    { id: 'nova', name: 'Nova', description: 'Light and conversational' },
    { id: 'shimmer', name: 'Shimmer', description: 'Clear and helpful' },
]

const TIMEZONES = [
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'America/Phoenix',
]

export default function AgentSettings({ config, onSave, onTestGreeting }: AgentSettingsProps) {
    const [editedConfig, setEditedConfig] = useState<AgentConfig>(config)
    const [hasChanges, setHasChanges] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    const handleChange = <K extends keyof AgentConfig>(key: K, value: AgentConfig[K]) => {
        setEditedConfig(prev => ({ ...prev, [key]: value }))
        setHasChanges(true)
    }

    const handleBusinessHoursChange = (field: string, value: string) => {
        setEditedConfig(prev => ({
            ...prev,
            businessHours: { ...prev.businessHours, [field]: value }
        }))
        setHasChanges(true)
    }

    const handleSave = async () => {
        setIsSaving(true)
        await onSave(editedConfig)
        setIsSaving(false)
        setHasChanges(false)
    }

    return (
        <div className="space-y-6">
            {/* Voice Selection */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                    <Volume2 size={18} className="text-gray-400" />
                    <h3 className="font-semibold text-gray-900">Voice</h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {VOICE_OPTIONS.map((voice) => (
                        <button
                            key={voice.id}
                            onClick={() => {
                                handleChange('voiceId', voice.id)
                                handleChange('voiceName', voice.name)
                            }}
                            className={`p-4 rounded-lg border text-left transition-all ${
                                editedConfig.voiceId === voice.id
                                    ? 'border-[#5f3bff] bg-[#5f3bff]/5 ring-2 ring-[#5f3bff]/20'
                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                            <div className="font-medium text-gray-900">{voice.name}</div>
                            <div className="text-xs text-gray-500 mt-0.5">{voice.description}</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Greeting */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <RefreshCw size={18} className="text-gray-400" />
                        <h3 className="font-semibold text-gray-900">Greeting Message</h3>
                    </div>
                    {onTestGreeting && (
                        <button
                            onClick={onTestGreeting}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[#5f3bff] hover:bg-[#5f3bff]/5 rounded-lg transition-colors"
                        >
                            <Play size={14} />
                            Test
                        </button>
                    )}
                </div>

                <textarea
                    value={editedConfig.greeting}
                    onChange={(e) => handleChange('greeting', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#5f3bff]/20 focus:border-[#5f3bff]"
                    rows={3}
                    placeholder="Hi, thanks for calling [Business Name]! I'm an AI assistant..."
                />
                <p className="text-xs text-gray-400 mt-2">
                    This is what callers will hear when they first connect.
                </p>
            </div>

            {/* Business Hours */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                    <Clock size={18} className="text-gray-400" />
                    <h3 className="font-semibold text-gray-900">After Hours Window</h3>
                </div>

                <p className="text-sm text-gray-500 mb-4">
                    The AI agent handles calls outside these hours. During business hours, calls go to your regular phone.
                </p>

                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">
                            Business Opens
                        </label>
                        <input
                            type="time"
                            value={editedConfig.businessHours.start}
                            onChange={(e) => handleBusinessHoursChange('start', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5f3bff]/20 focus:border-[#5f3bff]"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">
                            Business Closes
                        </label>
                        <input
                            type="time"
                            value={editedConfig.businessHours.end}
                            onChange={(e) => handleBusinessHoursChange('end', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5f3bff]/20 focus:border-[#5f3bff]"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">
                            Timezone
                        </label>
                        <select
                            value={editedConfig.businessHours.timezone}
                            onChange={(e) => handleBusinessHoursChange('timezone', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5f3bff]/20 focus:border-[#5f3bff] bg-white"
                        >
                            {TIMEZONES.map((tz) => (
                                <option key={tz} value={tz}>
                                    {tz.replace('America/', '').replace('_', ' ')}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Emergency Escalation */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle size={18} className="text-red-400" />
                    <h3 className="font-semibold text-gray-900">Emergency Escalation</h3>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-4">
                    <div>
                        <div className="font-medium text-gray-900">Auto-escalate emergencies</div>
                        <div className="text-sm text-gray-500">
                            When the AI detects an emergency, immediately notify on-call staff
                        </div>
                    </div>
                    <button
                        type="button"
                        role="switch"
                        aria-checked={editedConfig.escalationEnabled}
                        onClick={() => handleChange('escalationEnabled', !editedConfig.escalationEnabled)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            editedConfig.escalationEnabled ? 'bg-[#5f3bff]' : 'bg-gray-200'
                        }`}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                editedConfig.escalationEnabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                        />
                    </button>
                </div>

                {editedConfig.escalationEnabled && (
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">
                            Escalation Phone Number
                        </label>
                        <input
                            type="tel"
                            value={editedConfig.escalationPhone || ''}
                            onChange={(e) => handleChange('escalationPhone', e.target.value)}
                            placeholder="(555) 123-4567"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5f3bff]/20 focus:border-[#5f3bff]"
                        />
                    </div>
                )}
            </div>

            {/* Save Button */}
            {hasChanges && (
                <div className="flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-6 py-3 bg-[#5f3bff] hover:bg-[#4f2fe0] text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                    >
                        <Save size={18} />
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            )}
        </div>
    )
}
