'use client'

import React from 'react'
import Link from 'next/link'
import { Zap, Activity, ChevronRight } from 'lucide-react'
import { IconMap, Folder } from '@/lib/toolbox-data'

interface SidebarProps {
    folders: Record<string, Folder>
    activeFolder?: string
    onFolderSelect?: (folderId: string) => void
    // User info
    userEmail?: string
    userName?: string
    userInitials?: string
    // Branding customization for client-demo
    brandName?: string
    // Hide navigation (for simplified demo)
    hideNav?: boolean
    // Custom footer content
    footerContent?: React.ReactNode
    // Loading state
    loading?: boolean
    // Active system link (e.g., 'status')
    activeSystemLink?: string
}

export default function Sidebar({
    folders,
    activeFolder,
    onFolderSelect,
    userEmail = 'dev@solidframe.ai',
    userName = 'Seth Dixon',
    userInitials = 'SD',
    brandName = 'SolidFrame',
    hideNav = false,
    footerContent,
    loading = false,
    activeSystemLink,
}: SidebarProps) {
    if (loading) {
        return <div className="w-64 bg-slate-900 animate-pulse" />
    }

    return (
        <aside className="w-64 bg-gradient-to-b from-slate-900 to-slate-950 flex flex-col h-screen sticky top-0">
            {/* Brand Header */}
            <div className="p-5 border-b border-white/10">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-orange-500/20">
                        <Zap size={20} className="text-white fill-current" />
                    </div>
                    <div>
                        <h1 className="text-base font-semibold text-white group-hover:text-amber-400 transition-colors">
                            {brandName}
                        </h1>
                        <span className="text-xs text-slate-400">Toolbox</span>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            {!hideNav && (
                <nav className="flex-1 overflow-y-auto p-4">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-3">
                        Tools
                    </div>
                    <div className="space-y-1">
                        {Object.entries(folders).map(([key, folder]) => {
                            const isActive = activeFolder === key
                            const FolderIcon = IconMap[folder.icon] || Zap

                            return (
                                <button
                                    key={key}
                                    onClick={() => onFolderSelect ? onFolderSelect(key) : window.location.href = `/?folder=${key}`}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 group ${isActive
                                        ? 'bg-white/10 text-white'
                                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    <div className={`p-1.5 rounded-md transition-colors ${isActive ? 'bg-amber-500/20' : 'bg-white/5 group-hover:bg-white/10'}`}>
                                        <FolderIcon
                                            size={16}
                                            className={isActive ? 'text-amber-400' : 'text-slate-500 group-hover:text-slate-300'}
                                        />
                                    </div>
                                    <span className="text-sm font-medium flex-1">
                                        {folder.name}
                                    </span>
                                    {isActive && (
                                        <ChevronRight size={14} className="text-slate-500" />
                                    )}
                                </button>
                            )
                        })}
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/10">
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-3">
                            System
                        </div>
                        <Link
                            href="/status"
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 group ${
                                activeSystemLink === 'status'
                                    ? 'bg-white/10 text-white'
                                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                            }`}
                        >
                            <div className={`p-1.5 rounded-md transition-colors ${
                                activeSystemLink === 'status'
                                    ? 'bg-amber-500/20'
                                    : 'bg-white/5 group-hover:bg-white/10'
                            }`}>
                                <Activity size={16} className={
                                    activeSystemLink === 'status'
                                        ? 'text-amber-400'
                                        : 'text-slate-500 group-hover:text-slate-300'
                                } />
                            </div>
                            <span className="text-sm font-medium">Tool Status</span>
                            {activeSystemLink === 'status' && (
                                <ChevronRight size={14} className="text-slate-500 ml-auto" />
                            )}
                        </Link>
                    </div>
                </nav>
            )}

            {/* Spacer when nav is hidden */}
            {hideNav && <div className="flex-1" />}

            {/* Footer */}
            {footerContent ? (
                footerContent
            ) : (
                <div className="p-4 border-t border-white/10">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-xs font-bold text-white shadow-lg">
                            {userInitials}
                        </div>
                        <div className="overflow-hidden flex-1">
                            <div className="text-sm font-medium text-white truncate">{userName}</div>
                            <div className="text-xs text-slate-400 truncate">{userEmail}</div>
                        </div>
                    </div>
                </div>
            )}
        </aside>
    )
}
