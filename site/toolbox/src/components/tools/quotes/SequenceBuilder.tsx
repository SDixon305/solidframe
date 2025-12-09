'use client'

import React, { useState } from 'react'
import { Clock, Mail, Phone, MessageSquare, ChevronDown, ChevronUp, Check, Edit2, Save, X } from 'lucide-react'

export interface SequenceStep {
    id: string
    day: number
    type: 'email' | 'sms' | 'call'
    subject?: string
    message: string
    enabled: boolean
}

interface SequenceBuilderProps {
    sequence: SequenceStep[]
    onSequenceChange: (sequence: SequenceStep[]) => void
    compact?: boolean
}

const STEP_ICONS = {
    email: Mail,
    sms: MessageSquare,
    call: Phone,
}

const STEP_COLORS = {
    email: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600', icon: 'bg-blue-100' },
    sms: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-600', icon: 'bg-emerald-100' },
    call: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-600', icon: 'bg-amber-100' },
}

export default function SequenceBuilder({ sequence, onSequenceChange, compact = false }: SequenceBuilderProps) {
    const [expandedStep, setExpandedStep] = useState<string | null>(null)
    const [editingStep, setEditingStep] = useState<string | null>(null)
    const [editedMessage, setEditedMessage] = useState('')

    const toggleStep = (stepId: string) => {
        const updated = sequence.map(s =>
            s.id === stepId ? { ...s, enabled: !s.enabled } : s
        )
        onSequenceChange(updated)
    }

    const startEdit = (step: SequenceStep) => {
        setEditingStep(step.id)
        setEditedMessage(step.message)
    }

    const saveEdit = (stepId: string) => {
        const updated = sequence.map(s =>
            s.id === stepId ? { ...s, message: editedMessage } : s
        )
        onSequenceChange(updated)
        setEditingStep(null)
    }

    const cancelEdit = () => {
        setEditingStep(null)
        setEditedMessage('')
    }

    if (compact) {
        return (
            <div className="flex items-center gap-2">
                {sequence.map((step, index) => {
                    const Icon = STEP_ICONS[step.type]
                    const colors = STEP_COLORS[step.type]
                    return (
                        <React.Fragment key={step.id}>
                            <div
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                                    step.enabled ? colors.bg : 'bg-gray-50'
                                } ${step.enabled ? colors.border : 'border-gray-200'} border`}
                            >
                                <Icon size={14} className={step.enabled ? colors.text : 'text-gray-400'} />
                                <span className={`text-sm font-medium ${step.enabled ? colors.text : 'text-gray-400'}`}>
                                    Day {step.day}
                                </span>
                            </div>
                            {index < sequence.length - 1 && (
                                <div className="w-6 h-px bg-gray-300" />
                            )}
                        </React.Fragment>
                    )
                })}
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-700">Follow-up Sequence</h3>
                <span className="text-xs text-gray-500">
                    {sequence.filter(s => s.enabled).length} of {sequence.length} steps active
                </span>
            </div>

            {/* Timeline visualization */}
            <div className="relative">
                {/* Connecting line */}
                <div className="absolute left-5 top-8 bottom-8 w-0.5 bg-gray-200" />

                <div className="space-y-4">
                    {sequence.map((step, index) => {
                        const Icon = STEP_ICONS[step.type]
                        const colors = STEP_COLORS[step.type]
                        const isExpanded = expandedStep === step.id
                        const isEditing = editingStep === step.id

                        return (
                            <div key={step.id} className="relative">
                                {/* Step card */}
                                <div
                                    className={`ml-10 bg-white border rounded-xl overflow-hidden transition-all ${
                                        step.enabled ? 'border-gray-200' : 'border-gray-100 opacity-60'
                                    }`}
                                >
                                    {/* Step header */}
                                    <div
                                        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                                        onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${colors.icon}`}>
                                                <Icon size={16} className={colors.text} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-gray-900">Day {step.day}</span>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
                                                        {step.type === 'sms' ? 'SMS' : step.type.charAt(0).toUpperCase() + step.type.slice(1)}
                                                    </span>
                                                </div>
                                                {step.subject && (
                                                    <p className="text-sm text-gray-500 mt-0.5">{step.subject}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    toggleStep(step.id)
                                                }}
                                                className={`relative w-10 h-5 rounded-full transition-colors ${
                                                    step.enabled ? 'bg-[#5f3bff]' : 'bg-gray-200'
                                                }`}
                                            >
                                                <span
                                                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                                                        step.enabled ? 'translate-x-5' : ''
                                                    }`}
                                                />
                                            </button>
                                            {isExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                                        </div>
                                    </div>

                                    {/* Expanded content */}
                                    {isExpanded && (
                                        <div className="px-4 pb-4 border-t border-gray-100">
                                            <div className="pt-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-xs font-medium text-gray-500">Message</span>
                                                    {!isEditing && (
                                                        <button
                                                            onClick={() => startEdit(step)}
                                                            className="flex items-center gap-1 text-xs text-[#5f3bff] hover:text-[#4f2fe0]"
                                                        >
                                                            <Edit2 size={12} />
                                                            Edit
                                                        </button>
                                                    )}
                                                </div>

                                                {isEditing ? (
                                                    <div className="space-y-3">
                                                        <textarea
                                                            value={editedMessage}
                                                            onChange={(e) => setEditedMessage(e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5f3bff]/20 focus:border-[#5f3bff]"
                                                            rows={4}
                                                        />
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => saveEdit(step.id)}
                                                                className="flex items-center gap-1 px-3 py-1.5 bg-[#5f3bff] text-white text-xs font-medium rounded-lg hover:bg-[#4f2fe0]"
                                                            >
                                                                <Save size={12} />
                                                                Save
                                                            </button>
                                                            <button
                                                                onClick={cancelEdit}
                                                                className="flex items-center gap-1 px-3 py-1.5 text-gray-600 text-xs font-medium rounded-lg hover:bg-gray-100"
                                                            >
                                                                <X size={12} />
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">
                                                        {step.message}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Timeline marker */}
                                <div
                                    className={`absolute left-0 top-4 w-10 h-10 rounded-full flex items-center justify-center ${
                                        step.enabled ? 'bg-[#5f3bff]' : 'bg-gray-300'
                                    }`}
                                >
                                    {step.enabled ? (
                                        <Check size={16} className="text-white" />
                                    ) : (
                                        <span className="text-xs font-bold text-white">{index + 1}</span>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

// Default sequence data
export const DEFAULT_QUOTE_SEQUENCE: SequenceStep[] = [
    {
        id: 'step-1',
        day: 1,
        type: 'email',
        subject: 'Following up on your quote',
        message: `Hi {customer_name},

Thank you for requesting a quote from us! We wanted to follow up to see if you had any questions about the estimate we provided.

Your quote total: {quote_amount}

We'd love to help you with this project. Feel free to reply or call us at any time.

Best regards,
{company_name}`,
        enabled: true,
    },
    {
        id: 'step-2',
        day: 3,
        type: 'sms',
        message: `Hi {customer_name}, just checking in on your quote for {quote_amount}. Any questions? Reply or call us anytime - {company_phone}`,
        enabled: true,
    },
    {
        id: 'step-3',
        day: 7,
        type: 'call',
        message: `Friendly follow-up call to discuss the quote and answer any remaining questions. Offer to schedule the work at customer's convenience.`,
        enabled: true,
    },
]
