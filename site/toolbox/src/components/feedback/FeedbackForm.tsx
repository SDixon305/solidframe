'use client'

import { useState } from 'react'
import { Loader2, Send, Camera, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useTenantContext } from '@/lib/tenant-context'
import type {
    FeedbackUIType,
    FeedbackPriority,
    CreateFeedbackRequest,
    feedbackTypeLabels,
    feedbackPriorityLabels,
} from '@/types/feedback'

interface FeedbackFormProps {
    onSuccess?: () => void
    initialType?: FeedbackUIType
    initialToolId?: string
}

const feedbackTypes: { value: FeedbackUIType; label: string; description: string }[] = [
    { value: 'general', label: 'General Feedback', description: 'Suggestions, comments, or general thoughts' },
    { value: 'bug', label: 'Bug Report', description: 'Something isn\'t working correctly' },
    { value: 'feature_request', label: 'Feature Request', description: 'I wish the tool could...' },
    { value: 'ai_error', label: 'AI Error Report', description: 'The AI agent said something incorrect' },
]

const priorities: { value: FeedbackPriority; label: string }[] = [
    { value: 'low', label: 'Low - Minor inconvenience' },
    { value: 'medium', label: 'Medium - Impacts my workflow' },
    { value: 'high', label: 'High - Blocking my work' },
]

export function FeedbackForm({ onSuccess, initialType = 'general', initialToolId }: FeedbackFormProps) {
    const { tenant, tools } = useTenantContext()

    const [formData, setFormData] = useState<{
        type: FeedbackUIType
        tool_id: string
        subject: string
        description: string
        priority: FeedbackPriority
        ai_what_said: string
        ai_should_say: string
    }>({
        type: initialType,
        tool_id: initialToolId || '',
        subject: '',
        description: '',
        priority: 'medium',
        ai_what_said: '',
        ai_should_say: '',
    })

    const [errors, setErrors] = useState<Record<string, string>>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
    const [errorMessage, setErrorMessage] = useState('')

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }))
        }
        // Reset submit status when user starts editing again
        if (submitStatus !== 'idle') {
            setSubmitStatus('idle')
        }
    }

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {}

        if (!formData.subject.trim()) {
            newErrors.subject = 'Subject is required'
        } else if (formData.subject.length < 5) {
            newErrors.subject = 'Subject must be at least 5 characters'
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required'
        } else if (formData.description.length < 10) {
            newErrors.description = 'Please provide more detail (at least 10 characters)'
        }

        // AI Error specific validation
        if (formData.type === 'ai_error') {
            if (!formData.ai_what_said.trim()) {
                newErrors.ai_what_said = 'Please describe what the AI said incorrectly'
            }
            if (!formData.ai_should_say.trim()) {
                newErrors.ai_should_say = 'Please describe what the AI should have said'
            }
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validate()) return

        setIsSubmitting(true)
        setErrorMessage('')

        try {
            const requestBody: CreateFeedbackRequest & { tenant_slug: string } = {
                tenant_slug: tenant.slug,
                type: formData.type,
                tool_id: formData.tool_id || null,
                subject: formData.subject.trim(),
                description: formData.description.trim(),
                priority: formData.type === 'bug' ? formData.priority : undefined,
                ai_context: formData.type === 'ai_error' ? {
                    what_ai_said: formData.ai_what_said.trim(),
                    what_should_say: formData.ai_should_say.trim(),
                    transcript_id: null, // TODO: Capture from recent call if available
                } : undefined,
            }

            const response = await fetch('/api/tenant/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            })

            const result = await response.json()

            if (!response.ok || !result.success) {
                throw new Error(result.error || 'Failed to submit feedback')
            }

            // Success!
            setSubmitStatus('success')

            // Reset form
            setFormData({
                type: 'general',
                tool_id: '',
                subject: '',
                description: '',
                priority: 'medium',
                ai_what_said: '',
                ai_should_say: '',
            })

            onSuccess?.()
        } catch (error) {
            console.error('Feedback submission error:', error)
            setSubmitStatus('error')
            setErrorMessage(error instanceof Error ? error.message : 'Failed to submit feedback')
        } finally {
            setIsSubmitting(false)
        }
    }

    const selectedType = feedbackTypes.find(t => t.value === formData.type)

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Success Message */}
            {submitStatus === 'success' && (
                <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <div>
                        <p className="font-medium text-emerald-800">Feedback submitted successfully!</p>
                        <p className="text-sm text-emerald-600">Thank you for helping us improve. We'll review your feedback shortly.</p>
                    </div>
                </div>
            )}

            {/* Error Message */}
            {submitStatus === 'error' && (
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <div>
                        <p className="font-medium text-red-800">Failed to submit feedback</p>
                        <p className="text-sm text-red-600">{errorMessage}</p>
                    </div>
                </div>
            )}

            {/* Feedback Type */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    What type of feedback is this? <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {feedbackTypes.map(type => (
                        <button
                            key={type.value}
                            type="button"
                            onClick={() => handleChange('type', type.value)}
                            className={`p-3 rounded-lg border-2 text-left transition-all ${
                                formData.type === type.value
                                    ? 'border-violet-500 bg-violet-50'
                                    : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                        >
                            <p className={`font-medium ${formData.type === type.value ? 'text-violet-700' : 'text-gray-900'}`}>
                                {type.label}
                            </p>
                            <p className="text-sm text-gray-500 mt-0.5">{type.description}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Tool Selection */}
            <div>
                <label htmlFor="tool" className="block text-sm font-medium text-gray-700 mb-1">
                    Related Tool (optional)
                </label>
                <select
                    id="tool"
                    value={formData.tool_id}
                    onChange={e => handleChange('tool_id', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all bg-white"
                    disabled={isSubmitting}
                >
                    <option value="">General / Not tool-specific</option>
                    {tools.map(tool => (
                        <option key={tool.slug} value={tool.id}>
                            {tool.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Subject */}
            <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="subject"
                    value={formData.subject}
                    onChange={e => handleChange('subject', e.target.value)}
                    placeholder={
                        formData.type === 'bug'
                            ? 'e.g., Button not responding on mobile'
                            : formData.type === 'feature_request'
                                ? 'e.g., Add SMS notification option'
                                : formData.type === 'ai_error'
                                    ? 'e.g., Agent gave wrong business hours'
                                    : 'Brief summary of your feedback'
                    }
                    className={`w-full px-4 py-2.5 rounded-lg border ${
                        errors.subject ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-violet-500'
                    } focus:ring-2 focus:border-transparent outline-none transition-all`}
                    disabled={isSubmitting}
                    maxLength={200}
                />
                {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject}</p>}
            </div>

            {/* Description */}
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                </label>
                <textarea
                    id="description"
                    value={formData.description}
                    onChange={e => handleChange('description', e.target.value)}
                    placeholder={
                        formData.type === 'bug'
                            ? 'Please describe what happened, what you expected, and steps to reproduce...'
                            : formData.type === 'feature_request'
                                ? 'Describe the feature you\'d like and how it would help your business...'
                                : 'Please provide as much detail as possible...'
                    }
                    rows={4}
                    className={`w-full px-4 py-3 rounded-lg border ${
                        errors.description ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-violet-500'
                    } focus:ring-2 focus:border-transparent outline-none transition-all resize-none`}
                    disabled={isSubmitting}
                />
                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>

            {/* Priority (Bug Report only) */}
            {formData.type === 'bug' && (
                <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                        Priority
                    </label>
                    <select
                        id="priority"
                        value={formData.priority}
                        onChange={e => handleChange('priority', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all bg-white"
                        disabled={isSubmitting}
                    >
                        {priorities.map(p => (
                            <option key={p.value} value={p.value}>
                                {p.label}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* AI Error Report specific fields */}
            {formData.type === 'ai_error' && (
                <div className="space-y-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm font-medium text-amber-800">
                        Help us improve the AI agent by describing the error:
                    </p>

                    <div>
                        <label htmlFor="ai_what_said" className="block text-sm font-medium text-gray-700 mb-1">
                            What did the AI say that was wrong? <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="ai_what_said"
                            value={formData.ai_what_said}
                            onChange={e => handleChange('ai_what_said', e.target.value)}
                            placeholder="e.g., The AI said our business hours are 9-5, but we're actually open 8-6..."
                            rows={3}
                            className={`w-full px-4 py-3 rounded-lg border ${
                                errors.ai_what_said ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-violet-500'
                            } focus:ring-2 focus:border-transparent outline-none transition-all resize-none bg-white`}
                            disabled={isSubmitting}
                        />
                        {errors.ai_what_said && <p className="mt-1 text-sm text-red-600">{errors.ai_what_said}</p>}
                    </div>

                    <div>
                        <label htmlFor="ai_should_say" className="block text-sm font-medium text-gray-700 mb-1">
                            What should it have said? <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="ai_should_say"
                            value={formData.ai_should_say}
                            onChange={e => handleChange('ai_should_say', e.target.value)}
                            placeholder="e.g., It should say we're open Monday-Friday 8am-6pm and Saturday 9am-2pm..."
                            rows={3}
                            className={`w-full px-4 py-3 rounded-lg border ${
                                errors.ai_should_say ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-violet-500'
                            } focus:ring-2 focus:border-transparent outline-none transition-all resize-none bg-white`}
                            disabled={isSubmitting}
                        />
                        {errors.ai_should_say && <p className="mt-1 text-sm text-red-600">{errors.ai_should_say}</p>}
                    </div>
                </div>
            )}

            {/* Screenshot Upload (Placeholder) */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Screenshot (optional)
                </label>
                <div className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
                    <Camera className="w-8 h-8 text-gray-400" />
                    <div>
                        <p className="text-sm text-gray-500">Screenshot upload coming soon</p>
                        <p className="text-xs text-gray-400">For now, please describe what you see in the description</p>
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-2">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Submitting...
                        </>
                    ) : (
                        <>
                            <Send className="w-4 h-4" />
                            Submit Feedback
                        </>
                    )}
                </button>
            </div>
        </form>
    )
}
