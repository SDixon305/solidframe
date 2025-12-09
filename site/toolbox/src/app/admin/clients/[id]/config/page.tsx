'use client'

import { useState, useEffect } from 'react'
import { useClient } from '../layout'
import { Settings, ChevronRight, Save, RotateCcw, Loader2, Code } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

// Mock config data
const mockConfigs = [
    {
        tool_id: '1',
        tool_name: 'After-Hours Agent',
        tool_slug: 'after-hours-agent',
        config: {
            greeting: 'Thank you for calling Trinity Cooling. How can I help you today?',
            business_hours: { start: '08:00', end: '17:00' },
            emergency_keywords: ['gas leak', 'no heat', 'no AC', 'flooding'],
            transfer_number: '+1-555-123-4567',
            voicemail_enabled: true,
        },
        updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        tool_id: '3',
        tool_name: 'Review Request Bot',
        tool_slug: 'review-request-bot',
        config: {
            delay_hours: 24,
            platforms: ['google', 'yelp'],
            message_template: 'Hi {{customer_name}}, thank you for choosing Trinity Cooling! We\'d love to hear about your experience.',
            minimum_rating: 4,
        },
        updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        tool_id: '4',
        tool_name: 'Appointment Reminders',
        tool_slug: 'appointment-reminders',
        config: {
            reminder_times: ['24h', '2h'],
            sms_enabled: true,
            email_enabled: true,
            confirmation_required: true,
        },
        updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
]

interface ConfigEntry {
    tool_id: string
    tool_name: string
    tool_slug: string
    config: Record<string, unknown>
    updated_at: string
}

export default function ClientConfigPage() {
    const { client } = useClient()
    const [configs, setConfigs] = useState<ConfigEntry[]>([])
    const [selectedConfig, setSelectedConfig] = useState<ConfigEntry | null>(null)
    const [editedJson, setEditedJson] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [jsonError, setJsonError] = useState<string | null>(null)

    useEffect(() => {
        async function loadConfigs() {
            if (!client) return

            setIsLoading(true)

            try {
                const supabase = createClient()
                const { data, error } = await supabase
                    .from('tenant_tool_configs')
                    .select('*, tool:tools(id, name, slug)')
                    .eq('tenant_id', client.id)

                if (error) {
                    console.warn('Supabase error, using mock data:', error)
                    setConfigs(mockConfigs)
                } else if (data && data.length > 0) {
                    const mapped = data.map(item => ({
                        tool_id: item.tool_id,
                        tool_name: (item.tool as { name: string })?.name || 'Unknown Tool',
                        tool_slug: (item.tool as { slug: string })?.slug || 'unknown',
                        config: item.config,
                        updated_at: item.updated_at,
                    }))
                    setConfigs(mapped)
                } else {
                    setConfigs(mockConfigs)
                }
            } catch (err) {
                console.error('Error loading configs:', err)
                setConfigs(mockConfigs)
            } finally {
                setIsLoading(false)
            }
        }

        loadConfigs()
    }, [client])

    const handleSelectConfig = (config: ConfigEntry) => {
        setSelectedConfig(config)
        setEditedJson(JSON.stringify(config.config, null, 2))
        setJsonError(null)
    }

    const handleJsonChange = (value: string) => {
        setEditedJson(value)
        try {
            JSON.parse(value)
            setJsonError(null)
        } catch {
            setJsonError('Invalid JSON')
        }
    }

    const handleSave = async () => {
        if (!selectedConfig || !client || jsonError) return

        setIsSaving(true)

        try {
            const parsedConfig = JSON.parse(editedJson)
            const supabase = createClient()

            const { error } = await supabase
                .from('tenant_tool_configs')
                .upsert({
                    tenant_id: client.id,
                    tool_id: selectedConfig.tool_id,
                    config: parsedConfig,
                    updated_at: new Date().toISOString(),
                })

            if (error) {
                console.error('Error saving config:', error)
                // Update locally anyway for demo
            }

            // Update local state
            setConfigs(prev =>
                prev.map(c =>
                    c.tool_id === selectedConfig.tool_id
                        ? { ...c, config: parsedConfig, updated_at: new Date().toISOString() }
                        : c
                )
            )
            setSelectedConfig({ ...selectedConfig, config: parsedConfig })
        } catch (err) {
            console.error('Error saving config:', err)
        } finally {
            setIsSaving(false)
        }
    }

    const handleReset = () => {
        if (selectedConfig) {
            setEditedJson(JSON.stringify(selectedConfig.config, null, 2))
            setJsonError(null)
        }
    }

    if (!client) {
        return null
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-lg font-semibold text-gray-900">Tool Configurations</h2>
                <p className="text-sm text-gray-500">
                    View and edit tool-specific settings for {client.name}
                </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Config List */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
                        {configs.length === 0 ? (
                            <div className="p-6 text-center text-gray-500">
                                <Settings className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                <p>No tool configurations found</p>
                                <p className="text-sm mt-1">Activate tools to configure them</p>
                            </div>
                        ) : (
                            configs.map(config => (
                                <button
                                    key={config.tool_id}
                                    onClick={() => handleSelectConfig(config)}
                                    className={`w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors ${
                                        selectedConfig?.tool_id === config.tool_id
                                            ? 'bg-violet-50 border-l-2 border-violet-600'
                                            : ''
                                    }`}
                                >
                                    <div>
                                        <h4 className="font-medium text-gray-900">{config.tool_name}</h4>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Updated {new Date(config.updated_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-400" />
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Config Editor */}
                <div className="lg:col-span-2">
                    {selectedConfig ? (
                        <div className="bg-white rounded-xl border border-gray-200">
                            {/* Editor Header */}
                            <div className="flex items-center justify-between p-4 border-b border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-violet-50 rounded-lg">
                                        <Code className="w-4 h-4 text-violet-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{selectedConfig.tool_name}</h3>
                                        <p className="text-xs text-gray-500 font-mono">{selectedConfig.tool_slug}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleReset}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <RotateCcw className="w-4 h-4" />
                                        Reset
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={!!jsonError || isSaving}
                                        className="flex items-center gap-1.5 px-4 py-1.5 text-sm bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSaving ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Save className="w-4 h-4" />
                                        )}
                                        Save
                                    </button>
                                </div>
                            </div>

                            {/* JSON Editor */}
                            <div className="p-4">
                                {jsonError && (
                                    <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
                                        {jsonError}
                                    </div>
                                )}
                                <textarea
                                    value={editedJson}
                                    onChange={e => handleJsonChange(e.target.value)}
                                    className={`w-full h-96 p-4 font-mono text-sm rounded-lg border ${
                                        jsonError
                                            ? 'border-red-300 focus:ring-red-500'
                                            : 'border-gray-300 focus:ring-violet-500'
                                    } focus:ring-2 focus:border-transparent outline-none bg-gray-50`}
                                    spellCheck={false}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
                            <Settings className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-500 mb-2">Select a Configuration</h3>
                            <p className="text-gray-400 max-w-md mx-auto">
                                Choose a tool from the list to view and edit its configuration.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
