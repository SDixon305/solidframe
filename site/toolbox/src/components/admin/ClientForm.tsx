'use client'

import { useState, useEffect } from 'react'
import { Loader2, Upload, X } from 'lucide-react'
import type { CreateTenantRequest, UpdateTenantRequest, BusinessType, TenantWithStats } from '@/types/tenants'

interface ClientFormProps {
    mode: 'create' | 'edit'
    initialData?: TenantWithStats | null
    onSubmit: (data: CreateTenantRequest | UpdateTenantRequest) => Promise<void>
    onCancel: () => void
    isLoading?: boolean
}

const businessTypes: { value: BusinessType; label: string }[] = [
    { value: 'hvac', label: 'HVAC' },
    { value: 'plumbing', label: 'Plumbing' },
    { value: 'electrical', label: 'Electrical' },
    { value: 'roofing', label: 'Roofing' },
    { value: 'general', label: 'General Contractor' },
    { value: 'other', label: 'Other' },
]

function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .substring(0, 50)
}

export function ClientForm({ mode, initialData, onSubmit, onCancel, isLoading }: ClientFormProps) {
    const [formData, setFormData] = useState<CreateTenantRequest>({
        name: initialData?.name || '',
        slug: initialData?.slug || '',
        owner_name: initialData?.owner_name || '',
        owner_email: initialData?.owner_email || '',
        business_type: (initialData?.business_type as BusinessType) || 'hvac',
        business_address: initialData?.business_address || '',
        logo_url: initialData?.logo_url || '',
    })

    const [autoSlug, setAutoSlug] = useState(!initialData?.slug)
    const [errors, setErrors] = useState<Record<string, string>>({})

    // Auto-generate slug from name
    useEffect(() => {
        if (autoSlug && mode === 'create' && formData.name) {
            setFormData(prev => ({ ...prev, slug: generateSlug(formData.name) }))
        }
    }, [formData.name, autoSlug, mode])

    const handleChange = (field: keyof CreateTenantRequest, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }))
        }
        if (field === 'slug') {
            setAutoSlug(false)
        }
    }

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {}

        if (!formData.name.trim()) {
            newErrors.name = 'Company name is required'
        }

        if (!formData.owner_email.trim()) {
            newErrors.owner_email = 'Owner email is required'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.owner_email)) {
            newErrors.owner_email = 'Please enter a valid email address'
        }

        if (mode === 'create' && !formData.slug?.trim()) {
            newErrors.slug = 'Subdomain is required'
        } else if (formData.slug && !/^[a-z0-9-]+$/.test(formData.slug)) {
            newErrors.slug = 'Subdomain can only contain lowercase letters, numbers, and hyphens'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validate()) return
        await onSubmit(formData)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company Name */}
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={e => handleChange('name', e.target.value)}
                    placeholder="e.g., Trinity Cooling Services"
                    className={`w-full px-4 py-2.5 rounded-lg border ${errors.name ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-violet-500'} focus:ring-2 focus:border-transparent outline-none transition-all`}
                    disabled={isLoading}
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            {/* Subdomain */}
            <div>
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                    Subdomain <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center">
                    <input
                        type="text"
                        id="slug"
                        value={formData.slug}
                        onChange={e => handleChange('slug', e.target.value.toLowerCase())}
                        placeholder="trinity-cooling"
                        className={`flex-1 px-4 py-2.5 rounded-l-lg border-y border-l ${errors.slug ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-violet-500'} focus:ring-2 focus:border-transparent outline-none transition-all`}
                        disabled={isLoading || mode === 'edit'}
                    />
                    <span className="px-4 py-2.5 bg-gray-100 border border-gray-300 rounded-r-lg text-gray-500 text-sm">
                        .toolbox.solidframe.ai
                    </span>
                </div>
                {errors.slug && <p className="mt-1 text-sm text-red-600">{errors.slug}</p>}
                {mode === 'edit' && (
                    <p className="mt-1 text-sm text-gray-500">Subdomain cannot be changed after creation</p>
                )}
            </div>

            {/* Owner Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="owner_name" className="block text-sm font-medium text-gray-700 mb-1">
                        Owner Name
                    </label>
                    <input
                        type="text"
                        id="owner_name"
                        value={formData.owner_name}
                        onChange={e => handleChange('owner_name', e.target.value)}
                        placeholder="John Smith"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
                        disabled={isLoading}
                    />
                </div>

                <div>
                    <label htmlFor="owner_email" className="block text-sm font-medium text-gray-700 mb-1">
                        Owner Email <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        id="owner_email"
                        value={formData.owner_email}
                        onChange={e => handleChange('owner_email', e.target.value)}
                        placeholder="john@trinitycooling.com"
                        className={`w-full px-4 py-2.5 rounded-lg border ${errors.owner_email ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-violet-500'} focus:ring-2 focus:border-transparent outline-none transition-all`}
                        disabled={isLoading}
                    />
                    {errors.owner_email && <p className="mt-1 text-sm text-red-600">{errors.owner_email}</p>}
                </div>
            </div>

            {/* Business Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="business_type" className="block text-sm font-medium text-gray-700 mb-1">
                        Business Type
                    </label>
                    <select
                        id="business_type"
                        value={formData.business_type}
                        onChange={e => handleChange('business_type', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all bg-white"
                        disabled={isLoading}
                    >
                        {businessTypes.map(type => (
                            <option key={type.value} value={type.value}>
                                {type.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="business_address" className="block text-sm font-medium text-gray-700 mb-1">
                        Business Address
                    </label>
                    <input
                        type="text"
                        id="business_address"
                        value={formData.business_address}
                        onChange={e => handleChange('business_address', e.target.value)}
                        placeholder="123 Main St, City, State 12345"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
                        disabled={isLoading}
                    />
                </div>
            </div>

            {/* Logo Upload */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Logo (optional)
                </label>
                <div className="flex items-center gap-4">
                    {formData.logo_url ? (
                        <div className="relative">
                            <img
                                src={formData.logo_url}
                                alt="Logo preview"
                                className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                            />
                            <button
                                type="button"
                                onClick={() => handleChange('logo_url', '')}
                                className="absolute -top-2 -right-2 p-1 bg-red-100 rounded-full text-red-600 hover:bg-red-200 transition-colors"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ) : (
                        <div className="w-16 h-16 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                            <Upload className="w-6 h-6" />
                        </div>
                    )}
                    <div className="flex-1">
                        <input
                            type="url"
                            value={formData.logo_url || ''}
                            onChange={e => handleChange('logo_url', e.target.value)}
                            placeholder="https://example.com/logo.png"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all text-sm"
                            disabled={isLoading}
                        />
                        <p className="mt-1 text-xs text-gray-500">Enter a URL to the company logo</p>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    disabled={isLoading}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                >
                    {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {mode === 'create' ? 'Create Client' : 'Save Changes'}
                </button>
            </div>
        </form>
    )
}
