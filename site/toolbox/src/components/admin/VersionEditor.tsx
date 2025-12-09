'use client'

import { useState, useEffect } from 'react'
import {
    X,
    Save,
    AlertTriangle,
    CheckCircle2,
    Code,
    Eye,
} from 'lucide-react'
import type { DbToolVersion } from '@/types/tools'

interface VersionEditorProps {
    version: DbToolVersion
    isOpen: boolean
    onClose: () => void
    onSave: (version: DbToolVersion, configSchema: Record<string, unknown>, changelog: string) => Promise<void>
}

export function VersionEditor({
    version,
    isOpen,
    onClose,
    onSave,
}: VersionEditorProps) {
    const [configText, setConfigText] = useState('')
    const [changelog, setChangelog] = useState(version.changelog || '')
    const [error, setError] = useState<string | null>(null)
    const [isSaving, setIsSaving] = useState(false)
    const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor')

    // Initialize editor with current config
    useEffect(() => {
        if (isOpen) {
            setConfigText(JSON.stringify(version.config_schema || {}, null, 2))
            setChangelog(version.changelog || '')
            setError(null)
        }
    }, [isOpen, version])

    // Validate JSON as user types
    const validateJson = (text: string): { valid: boolean; error?: string; parsed?: Record<string, unknown> } => {
        if (!text.trim()) {
            return { valid: false, error: 'Config schema cannot be empty' }
        }

        try {
            const parsed = JSON.parse(text)
            if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
                return { valid: false, error: 'Config schema must be an object' }
            }
            return { valid: true, parsed }
        } catch (e) {
            return { valid: false, error: `Invalid JSON: ${(e as Error).message}` }
        }
    }

    const validation = validateJson(configText)

    const handleSave = async () => {
        if (!validation.valid || !validation.parsed) {
            setError(validation.error || 'Invalid configuration')
            return
        }

        setIsSaving(true)
        setError(null)

        try {
            await onSave(version, validation.parsed, changelog)
            onClose()
        } catch (e) {
            setError((e as Error).message || 'Failed to save')
        } finally {
            setIsSaving(false)
        }
    }

    // Get default config for preview
    const getDefaultConfig = () => {
        if (!validation.valid || !validation.parsed) {
            return null
        }
        const schema = validation.parsed as { default?: Record<string, unknown> }
        return schema.default || {}
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            Edit Version v{version.version}
                        </h2>
                        <p className="text-sm text-gray-500">
                            Modify the configuration schema for this version
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-100">
                    <button
                        onClick={() => setActiveTab('editor')}
                        className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                            activeTab === 'editor'
                                ? 'text-violet-600 border-violet-500'
                                : 'text-gray-500 border-transparent hover:text-gray-700'
                        }`}
                    >
                        <Code size={16} />
                        JSON Editor
                    </button>
                    <button
                        onClick={() => setActiveTab('preview')}
                        className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                            activeTab === 'preview'
                                ? 'text-violet-600 border-violet-500'
                                : 'text-gray-500 border-transparent hover:text-gray-700'
                        }`}
                    >
                        <Eye size={16} />
                        Default Config Preview
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {activeTab === 'editor' ? (
                        <div className="space-y-4">
                            {/* JSON Editor */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Config Schema (JSON)
                                </label>
                                <textarea
                                    value={configText}
                                    onChange={(e) => {
                                        setConfigText(e.target.value)
                                        setError(null)
                                    }}
                                    className={`w-full h-64 px-4 py-3 font-mono text-sm bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                                        !validation.valid && configText.trim()
                                            ? 'border-red-300 focus:ring-red-200'
                                            : 'border-gray-200 focus:ring-violet-200 focus:border-violet-300'
                                    }`}
                                    placeholder="Enter JSON configuration schema..."
                                    spellCheck={false}
                                />
                                {!validation.valid && configText.trim() && (
                                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1.5">
                                        <AlertTriangle size={14} />
                                        {validation.error}
                                    </p>
                                )}
                                {validation.valid && (
                                    <p className="mt-2 text-sm text-emerald-600 flex items-center gap-1.5">
                                        <CheckCircle2 size={14} />
                                        Valid JSON
                                    </p>
                                )}
                            </div>

                            {/* Changelog */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Changelog
                                </label>
                                <textarea
                                    value={changelog}
                                    onChange={(e) => setChangelog(e.target.value)}
                                    className="w-full h-20 px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-300 transition-colors"
                                    placeholder="Describe what changed in this version..."
                                />
                            </div>
                        </div>
                    ) : (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Default Configuration Values
                            </label>
                            {validation.valid ? (
                                <pre className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono text-gray-700 overflow-x-auto">
                                    {JSON.stringify(getDefaultConfig(), null, 2)}
                                </pre>
                            ) : (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                                    Fix JSON errors to see preview
                                </div>
                            )}

                            {validation.valid && validation.parsed && (
                                <div className="mt-4">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                                        Schema Properties
                                    </h4>
                                    <div className="space-y-2">
                                        {Object.entries((validation.parsed as { properties?: Record<string, { type?: string }> }).properties || {}).map(([key, prop]) => (
                                            <div
                                                key={key}
                                                className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg"
                                            >
                                                <span className="font-mono text-sm text-gray-900">{key}</span>
                                                <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded">
                                                    {(prop as { type?: string }).type || 'unknown'}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Error message */}
                    {error && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 flex items-center gap-2">
                            <AlertTriangle size={16} />
                            {error}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!validation.valid || isSaving}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-violet-600 rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Save size={16} />
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    )
}
