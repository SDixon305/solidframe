'use client'

import React from 'react'
import { Zap, LucideIcon } from 'lucide-react'
import { IconMap, Folder } from '@/lib/toolbox-data'

interface HeaderProps {
    folder?: Folder
    folderId?: string
    // Personalization slot for client-demo
    title?: string
    subtitle?: string
    // Custom icon override
    icon?: LucideIcon
    // Right side content slot
    rightContent?: React.ReactNode
    // Hide system status (for demo mode) - kept for API compatibility
    hideSystemStatus?: boolean
}

export default function Header({
    folder,
    folderId = 'sales_demos',
    title,
    subtitle,
    icon,
    rightContent,
}: HeaderProps) {
    const Icon = icon || (folder ? (IconMap[folder.icon] || Zap) : Zap)

    const displayTitle = title || folder?.name || 'Toolbox'
    const displaySubtitle = subtitle || folder?.description || ''

    return (
        <header className="h-16 border-b border-slate-200 flex items-center justify-between px-6 bg-white">
            <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-slate-900 shadow-sm">
                    <Icon size={22} className="text-amber-400" />
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-slate-900">
                        {displayTitle}
                    </h2>
                    {displaySubtitle && (
                        <p className="text-sm text-slate-500">
                            {displaySubtitle}
                        </p>
                    )}
                </div>
            </div>

            {rightContent && (
                <div>{rightContent}</div>
            )}
        </header>
    )
}
