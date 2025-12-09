'use client'

import React from 'react'
import { Power, MessageCircle } from 'lucide-react'

interface EnableToggleProps {
    enabled: boolean
    onToggle: (enabled: boolean) => void
    label?: string
    description?: string
}

export default function EnableToggle({
    enabled,
    onToggle,
    label = 'Text-Back',
    description = 'Automatically text customers who call when you can\'t answer',
}: EnableToggleProps) {
    return (
        <div className={`bg-white border-2 rounded-xl p-6 transition-all duration-300 ${
            enabled
                ? 'border-[#5f3bff] shadow-lg shadow-[#5f3bff]/10'
                : 'border-gray-200'
        }`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className={`p-4 rounded-xl transition-colors ${
                        enabled
                            ? 'bg-[#5f3bff]/10'
                            : 'bg-gray-100'
                    }`}>
                        <MessageCircle
                            size={28}
                            className={enabled ? 'text-[#5f3bff]' : 'text-gray-400'}
                        />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">{label}</h3>
                        <p className="text-sm text-gray-500">{description}</p>
                    </div>
                </div>

                <button
                    onClick={() => onToggle(!enabled)}
                    className={`relative w-20 h-10 rounded-full transition-colors duration-300 focus:outline-none focus:ring-4 ${
                        enabled
                            ? 'bg-[#5f3bff] focus:ring-[#5f3bff]/20'
                            : 'bg-gray-200 focus:ring-gray-200/50'
                    }`}
                >
                    <span
                        className={`absolute top-1 left-1 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center transition-transform duration-300 ${
                            enabled ? 'translate-x-10' : 'translate-x-0'
                        }`}
                    >
                        <Power
                            size={16}
                            className={enabled ? 'text-[#5f3bff]' : 'text-gray-400'}
                        />
                    </span>
                </button>
            </div>

            {/* Status Message */}
            <div className={`mt-4 p-3 rounded-lg text-sm font-medium text-center ${
                enabled
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-gray-50 text-gray-500'
            }`}>
                {enabled
                    ? '✓ Active - Missed calls will receive an automatic text'
                    : 'Disabled - Turn on to start capturing leads'}
            </div>
        </div>
    )
}
