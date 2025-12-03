'use client'

import { useState } from 'react'
import { Building2, User, Phone, Thermometer } from 'lucide-react'
import { inferRegionFromPhone, getClimateDescription } from '@/utils/areaCodeMapping'

export interface BusinessData {
    name: string
    ownerName: string
    ownerPhone: string
}

interface BusinessSetupProps {
    data: BusinessData
    onUpdate: (data: BusinessData) => void
    onConfigured: () => void
    onPhoneNumberSet: (phone: string) => void
}

import { supabase } from '@/lib/supabaseClient'

export default function BusinessSetup({ data, onUpdate, onConfigured, onPhoneNumberSet }: BusinessSetupProps) {
    const [isConfigured, setIsConfigured] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)

        try {
            // Infer region from phone number area code
            const { region } = inferRegionFromPhone(data.ownerPhone)

            // 1. Deactivate previous sessions
            await supabase
                .from('demo_sessions')
                .update({ is_active: false })
                .eq('is_active', true)

            // 2. Create new session
            const { error } = await supabase
                .from('demo_sessions')
                .insert({
                    business_name: data.name,
                    region: region, // Inferred from area code
                    owner_name: data.ownerName,
                    owner_phone: data.ownerPhone,
                    is_active: true
                })

            if (error) throw error

            console.log('Configured business:', data)
            console.log('Inferred region:', region)

            // 3. Update VAPI assistant with new business name
            // Use environment variable for backend URL, fallback to localhost for development
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'
            try {
                const vapiResponse = await fetch(`${backendUrl}/api/update-vapi-greeting`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        business_name: data.name
                    })
                })

                if (!vapiResponse.ok) {
                    const errorText = await vapiResponse.text()
                    console.error('Failed to update VAPI assistant:', errorText)
                    throw new Error(`VAPI update failed: ${errorText}`)
                }

                console.log('Successfully updated VAPI assistant with business name:', data.name)
            } catch (vapiError) {
                console.error('Error updating VAPI assistant:', vapiError)
                // This IS critical for the demo - alert the user
                throw new Error('Failed to configure voice agent. Please try again.')
            }

            setIsConfigured(true)
            onConfigured()
            onPhoneNumberSet('+1 (844) 671-3994') // Demo phone number
        } catch (err) {
            console.error('Error saving session:', err)
            alert('Failed to save configuration. Please try again.')
        } finally {
            setIsSaving(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        onUpdate({
            ...data,
            [e.target.name]: e.target.value,
        })
    }

    if (isConfigured) {
        const climateDescription = getClimateDescription(data.ownerPhone)

        return (
            <div className="space-y-4">
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
                    <div className="flex items-center gap-2 text-green-700 mb-4">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm">✓</span>
                        </div>
                        <span className="font-semibold">Business Configured</span>
                    </div>

                    <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-gray-500" />
                            <span className="font-medium">{data.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Thermometer className="w-4 h-4 text-gray-500" />
                            <span className="text-xs">{climateDescription}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-500" />
                            <span>{data.ownerName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-500" />
                            <span>{data.ownerPhone}</span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => setIsConfigured(false)}
                    className="w-full px-4 py-2 text-sm text-slate-600 hover:text-slate-900 font-medium"
                >
                    Edit Configuration
                </button>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Business Name */}
            <div>
                <label htmlFor="name" className="block text-xs font-medium text-gray-700 mb-1">
                    Business Name
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={data.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                />
            </div>

            {/* Owner Information - Compacted into Grid */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label htmlFor="ownerName" className="block text-xs font-medium text-gray-700 mb-1">
                        Owner Name
                    </label>
                    <input
                        type="text"
                        id="ownerName"
                        name="ownerName"
                        value={data.ownerName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="ownerPhone" className="block text-xs font-medium text-gray-700 mb-1">
                        Owner Phone
                    </label>
                    <input
                        type="tel"
                        id="ownerPhone"
                        name="ownerPhone"
                        value={data.ownerPhone}
                        onChange={handleChange}
                        placeholder="e.g., 305-555-0100"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        required
                    />
                </div>
            </div>

            {/* Climate zone auto-detected notice */}
            {data.ownerPhone && (
                <div className="text-xs text-gray-500 flex items-center gap-1">
                    <Thermometer className="w-3 h-3" />
                    <span>{getClimateDescription(data.ownerPhone)}</span>
                </div>
            )}

            <button
                type="submit"
                disabled={isSaving}
                className="w-full px-6 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSaving ? 'Configuring...' : 'Configure Business'}
            </button>
        </form>
    )
}
