'use client'

import React, { useState } from 'react'
import { Bell, Clock, Mail, MessageSquare, Check, Save, Settings } from 'lucide-react'

export interface ReminderSettings {
    firstReminder: {
        enabled: boolean
        daysBefore: number
        method: 'email' | 'sms' | 'both'
    }
    secondReminder: {
        enabled: boolean
        daysBefore: number
        method: 'email' | 'sms' | 'both'
    }
    finalReminder: {
        enabled: boolean
        daysBefore: number
        method: 'email' | 'sms' | 'both'
    }
    emailTemplate: string
    smsTemplate: string
}

interface RenewalSettingsProps {
    settings: ReminderSettings
    onSettingsChange: (settings: ReminderSettings) => void
}

const DEFAULT_EMAIL_TEMPLATE = `Hi {customer_name},

Your maintenance plan with {company_name} is coming up for renewal on {renewal_date}.

Your current plan: {plan_name}
Annual cost: {plan_value}

Renewing ensures:
✓ Priority scheduling
✓ No diagnostic fees
✓ Seasonal tune-ups included
✓ Parts discounts

Reply to this email or call us at {company_phone} to renew today!

Thank you for being a valued customer.

{company_name}`

const DEFAULT_SMS_TEMPLATE = `Hi {customer_name}, your {company_name} maintenance plan expires on {renewal_date}. Renew now to keep your priority benefits! Call {company_phone} or reply YES.`

export default function RenewalSettings({ settings, onSettingsChange }: RenewalSettingsProps) {
    const [localSettings, setLocalSettings] = useState(settings)
    const [hasChanges, setHasChanges] = useState(false)
    const [showSaved, setShowSaved] = useState(false)

    const updateSettings = (updates: Partial<ReminderSettings>) => {
        const newSettings = { ...localSettings, ...updates }
        setLocalSettings(newSettings)
        setHasChanges(true)
    }

    const updateReminder = (
        key: 'firstReminder' | 'secondReminder' | 'finalReminder',
        updates: Partial<ReminderSettings['firstReminder']>
    ) => {
        updateSettings({
            [key]: { ...localSettings[key], ...updates }
        })
    }

    const handleSave = () => {
        onSettingsChange(localSettings)
        setHasChanges(false)
        setShowSaved(true)
        setTimeout(() => setShowSaved(false), 2000)
    }

    const ReminderRow = ({
        label,
        reminderKey,
        reminder,
    }: {
        label: string
        reminderKey: 'firstReminder' | 'secondReminder' | 'finalReminder'
        reminder: ReminderSettings['firstReminder']
    }) => (
        <div className={`p-4 rounded-lg border ${reminder.enabled ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-100'}`}>
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Bell size={16} className={reminder.enabled ? 'text-[#5f3bff]' : 'text-gray-400'} />
                    <span className="font-medium text-gray-900">{label}</span>
                </div>
                <button
                    onClick={() => updateReminder(reminderKey, { enabled: !reminder.enabled })}
                    className={`relative w-10 h-5 rounded-full transition-colors ${
                        reminder.enabled ? 'bg-[#5f3bff]' : 'bg-gray-200'
                    }`}
                >
                    <span
                        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                            reminder.enabled ? 'translate-x-5' : ''
                        }`}
                    />
                </button>
            </div>

            {reminder.enabled && (
                <div className="flex flex-wrap items-center gap-4 pt-2">
                    <div className="flex items-center gap-2">
                        <Clock size={14} className="text-gray-400" />
                        <select
                            value={reminder.daysBefore}
                            onChange={(e) => updateReminder(reminderKey, { daysBefore: parseInt(e.target.value) })}
                            className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5f3bff]/20 focus:border-[#5f3bff]"
                        >
                            {[7, 14, 21, 30, 45, 60].map(days => (
                                <option key={days} value={days}>{days} days before</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Send via:</span>
                        <div className="flex gap-1">
                            {(['email', 'sms', 'both'] as const).map(method => (
                                <button
                                    key={method}
                                    onClick={() => updateReminder(reminderKey, { method })}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                                        reminder.method === method
                                            ? 'bg-[#5f3bff] text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    {method === 'both' ? 'Both' : method === 'email' ? 'Email' : 'SMS'}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )

    return (
        <div className="space-y-6">
            {/* Reminder timing */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                    <Settings size={18} className="text-gray-400" />
                    <h3 className="font-semibold text-gray-900">Reminder Schedule</h3>
                </div>

                <div className="space-y-3">
                    <ReminderRow
                        label="First Reminder"
                        reminderKey="firstReminder"
                        reminder={localSettings.firstReminder}
                    />
                    <ReminderRow
                        label="Second Reminder"
                        reminderKey="secondReminder"
                        reminder={localSettings.secondReminder}
                    />
                    <ReminderRow
                        label="Final Reminder"
                        reminderKey="finalReminder"
                        reminder={localSettings.finalReminder}
                    />
                </div>
            </div>

            {/* Email template */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                    <Mail size={18} className="text-gray-400" />
                    <h3 className="font-semibold text-gray-900">Email Template</h3>
                </div>

                <textarea
                    value={localSettings.emailTemplate}
                    onChange={(e) => updateSettings({ emailTemplate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#5f3bff]/20 focus:border-[#5f3bff] font-mono"
                    rows={12}
                />

                <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-2">Available variables:</p>
                    <div className="flex flex-wrap gap-1">
                        {['{customer_name}', '{company_name}', '{renewal_date}', '{plan_name}', '{plan_value}', '{company_phone}'].map(v => (
                            <span key={v} className="px-2 py-0.5 text-xs font-mono bg-gray-100 text-gray-600 rounded">{v}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* SMS template */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                    <MessageSquare size={18} className="text-gray-400" />
                    <h3 className="font-semibold text-gray-900">SMS Template</h3>
                </div>

                <textarea
                    value={localSettings.smsTemplate}
                    onChange={(e) => updateSettings({ smsTemplate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#5f3bff]/20 focus:border-[#5f3bff]"
                    rows={3}
                    maxLength={160}
                />
                <div className="flex items-center justify-between mt-2">
                    <div className="flex flex-wrap gap-1">
                        {['{customer_name}', '{company_name}', '{renewal_date}', '{company_phone}'].map(v => (
                            <span key={v} className="px-2 py-0.5 text-xs font-mono bg-gray-100 text-gray-600 rounded">{v}</span>
                        ))}
                    </div>
                    <span className="text-xs text-gray-400">{localSettings.smsTemplate.length}/160</span>
                </div>
            </div>

            {/* Save button */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-100 rounded-lg">
                    <span className="text-sm text-amber-700">
                        <strong>Demo Mode:</strong> Settings saved locally only
                    </span>
                </div>

                <button
                    onClick={handleSave}
                    disabled={!hasChanges}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all ${
                        hasChanges
                            ? 'bg-[#5f3bff] text-white hover:bg-[#4f2fe0]'
                            : showSaved
                                ? 'bg-emerald-500 text-white'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                >
                    {showSaved ? (
                        <>
                            <Check size={18} />
                            Saved!
                        </>
                    ) : (
                        <>
                            <Save size={18} />
                            Save Settings
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}

// Default settings
export const DEFAULT_RENEWAL_SETTINGS: ReminderSettings = {
    firstReminder: { enabled: true, daysBefore: 30, method: 'email' },
    secondReminder: { enabled: true, daysBefore: 14, method: 'both' },
    finalReminder: { enabled: true, daysBefore: 7, method: 'sms' },
    emailTemplate: DEFAULT_EMAIL_TEMPLATE,
    smsTemplate: DEFAULT_SMS_TEMPLATE,
}
