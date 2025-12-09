'use client'

import React from 'react'
import { Bell, Search, User, Zap } from 'lucide-react'
import { useTenantContext } from '@/lib/tenant-context'

interface ClientHeaderProps {
    title?: string
    subtitle?: string
    rightContent?: React.ReactNode
}

export default function ClientHeader({
    title,
    subtitle,
    rightContent,
}: ClientHeaderProps) {
    const { tenant, onboardingComplete } = useTenantContext()

    const displayTitle = title || `Welcome back, ${tenant.name}`

    return (
        <header className="h-16 border-b border-gray-200 flex items-center justify-between px-6 bg-white">
            {/* Left: Title */}
            <div className="flex items-center gap-4 min-w-0">
                <div className="min-w-0">
                    <h1 className="text-lg font-semibold text-gray-900 truncate">
                        {displayTitle}
                    </h1>
                    {subtitle && (
                        <p className="text-sm text-gray-500 truncate">
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
                {/* Onboarding reminder */}
                {!onboardingComplete && (
                    <a
                        href={`/${tenant.slug}/onboarding`}
                        className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium hover:bg-amber-100 transition-colors"
                    >
                        <Zap size={12} />
                        Complete Setup
                    </a>
                )}

                {/* Right slot content */}
                {rightContent}

                {/* Search */}
                <button className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                    <Search size={20} />
                </button>

                {/* Notifications */}
                <button className="relative p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
                </button>

                {/* User Menu */}
                <button className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#5f3bff] to-[#4f2fe0] flex items-center justify-center">
                        <User size={16} className="text-white" />
                    </div>
                </button>
            </div>
        </header>
    )
}
