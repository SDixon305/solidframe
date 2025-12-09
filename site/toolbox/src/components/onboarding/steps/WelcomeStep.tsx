'use client'

import React, { useState } from 'react'
import { Building2, Upload, Sparkles, ArrowRight, Zap } from 'lucide-react'
import { OnboardingData } from '@/types/onboarding'

interface WelcomeStepProps {
    data: OnboardingData
    onUpdate: (updates: Partial<OnboardingData>) => void
    tenantName: string
}

export default function WelcomeStep({ data, onUpdate, tenantName }: WelcomeStepProps) {
    const [companyName, setCompanyName] = useState(data.companyName || tenantName)
    const [logoPreview, setLogoPreview] = useState<string | null>(data.logoUrl || null)

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCompanyName(e.target.value)
        onUpdate({ companyName: e.target.value })
    }

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                const result = reader.result as string
                setLogoPreview(result)
                onUpdate({ logoUrl: result })
            }
            reader.readAsDataURL(file)
        }
    }

    const benefits = [
        'AI-powered after-hours call handling',
        '24/7 emergency dispatch',
        'Automated customer follow-ups',
        'Revenue-boosting automations',
    ]

    return (
        <div className="space-y-8">
            {/* Welcome Header */}
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#5f3bff] to-[#4f2fe0] mb-4 shadow-lg shadow-[#5f3bff]/25">
                    <Sparkles size={32} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Welcome to SolidFrame!
                </h2>
                <p className="text-gray-600 max-w-md mx-auto">
                    Let's get your AI automation tools set up. This wizard will help you configure everything in about 10 minutes.
                </p>
            </div>

            {/* What You'll Get */}
            <div className="bg-gradient-to-br from-[#5f3bff]/5 to-[#4f2fe0]/5 rounded-xl p-6 border border-[#5f3bff]/10">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Zap size={18} className="text-[#5f3bff]" />
                    What you'll unlock
                </h3>
                <ul className="space-y-3">
                    {benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center gap-3 text-gray-700">
                            <ArrowRight size={14} className="text-[#5f3bff] flex-shrink-0" />
                            {benefit}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Company Profile */}
            <div className="space-y-6">
                <h3 className="font-semibold text-gray-900">Your Company Profile</h3>

                {/* Company Name */}
                <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                        Company Name
                    </label>
                    <div className="relative">
                        <Building2 size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            id="companyName"
                            value={companyName}
                            onChange={handleNameChange}
                            placeholder="Your Company Name"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f3bff] focus:border-[#5f3bff] transition-colors text-gray-900 placeholder:text-gray-400"
                        />
                    </div>
                    <p className="mt-1.5 text-sm text-gray-500">
                        This is how your AI agent will identify your business to callers.
                    </p>
                </div>

                {/* Logo Upload */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Logo <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <div className="flex items-start gap-4">
                        {/* Logo Preview */}
                        <div className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 overflow-hidden">
                            {logoPreview ? (
                                <img
                                    src={logoPreview}
                                    alt="Logo preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <Building2 size={28} className="text-gray-300" />
                            )}
                        </div>

                        {/* Upload Button */}
                        <div className="flex-1">
                            <label
                                htmlFor="logoUpload"
                                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
                            >
                                <Upload size={16} />
                                Upload Logo
                            </label>
                            <input
                                type="file"
                                id="logoUpload"
                                accept="image/*"
                                onChange={handleLogoUpload}
                                className="hidden"
                            />
                            <p className="mt-2 text-sm text-gray-500">
                                PNG, JPG or SVG. Max 2MB.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
