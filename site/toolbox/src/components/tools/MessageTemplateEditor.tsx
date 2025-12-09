'use client'

import React, { useState } from 'react'
import { Check, X, Edit2, MessageSquare, RefreshCw } from 'lucide-react'

interface MessageTemplateEditorProps {
    label: string
    template: string
    onSave: (template: string) => void
    variables?: { key: string; label: string; example: string }[]
    maxLength?: number
}

export default function MessageTemplateEditor({
    label,
    template,
    onSave,
    variables = [],
    maxLength = 500,
}: MessageTemplateEditorProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [editValue, setEditValue] = useState(template)

    const handleSave = () => {
        onSave(editValue)
        setIsEditing(false)
    }

    const handleCancel = () => {
        setEditValue(template)
        setIsEditing(false)
    }

    const insertVariable = (key: string) => {
        setEditValue(prev => prev + `{${key}}`)
    }

    const getPreviewText = () => {
        let preview = editValue
        variables.forEach(v => {
            preview = preview.replace(new RegExp(`\\{${v.key}\\}`, 'g'), v.example)
        })
        return preview
    }

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <MessageSquare size={18} className="text-gray-400" />
                    <h3 className="font-semibold text-gray-900">{label}</h3>
                </div>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[#5f3bff] hover:bg-[#5f3bff]/5 rounded-lg transition-colors"
                    >
                        <Edit2 size={14} />
                        Edit
                    </button>
                )}
            </div>

            {isEditing ? (
                <>
                    <textarea
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#5f3bff]/20 focus:border-[#5f3bff]"
                        rows={4}
                        maxLength={maxLength}
                    />

                    <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-gray-400">
                            {editValue.length}/{maxLength} characters
                        </span>
                    </div>

                    {/* Variables */}
                    {variables.length > 0 && (
                        <div className="mt-3">
                            <p className="text-xs text-gray-500 mb-2">Insert variable:</p>
                            <div className="flex flex-wrap gap-2">
                                {variables.map((v) => (
                                    <button
                                        key={v.key}
                                        onClick={() => insertVariable(v.key)}
                                        className="px-2.5 py-1 text-xs font-mono bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
                                    >
                                        {`{${v.key}}`}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Preview */}
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="flex items-center gap-2 mb-2">
                            <RefreshCw size={12} className="text-gray-400" />
                            <span className="text-xs font-medium text-gray-500">Live Preview</span>
                        </div>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                            {getPreviewText()}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-4">
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-1.5 px-4 py-2 bg-[#5f3bff] text-white text-sm font-medium rounded-lg hover:bg-[#4f2fe0] transition-colors"
                        >
                            <Check size={14} />
                            Save Changes
                        </button>
                        <button
                            onClick={handleCancel}
                            className="flex items-center gap-1.5 px-4 py-2 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <X size={14} />
                            Cancel
                        </button>
                    </div>
                </>
            ) : (
                <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{template}</p>
                </div>
            )}
        </div>
    )
}

// Simple toggle switch component for settings
interface ToggleSwitchProps {
    label: string
    description?: string
    checked: boolean
    onChange: (checked: boolean) => void
    disabled?: boolean
}

export function ToggleSwitch({ label, description, checked, onChange, disabled = false }: ToggleSwitchProps) {
    return (
        <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl">
            <div>
                <h4 className="font-medium text-gray-900">{label}</h4>
                {description && (
                    <p className="text-sm text-gray-500 mt-0.5">{description}</p>
                )}
            </div>
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                onClick={() => !disabled && onChange(!checked)}
                disabled={disabled}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#5f3bff]/20 ${
                    checked ? 'bg-[#5f3bff]' : 'bg-gray-200'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        checked ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
            </button>
        </div>
    )
}
