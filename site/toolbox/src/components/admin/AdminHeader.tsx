'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Bell, ChevronDown, LogOut, User, Settings, Zap } from 'lucide-react'

interface AdminHeaderProps {
    userName?: string
    userEmail?: string
    onMenuClick?: () => void
    onLogout?: () => void
    unreadAlerts?: number
}

export function AdminHeader({
    userName = 'Admin User',
    userEmail = 'admin@solidframe.ai',
    onMenuClick,
    onLogout,
    unreadAlerts = 0,
}: AdminHeaderProps) {
    const [userMenuOpen, setUserMenuOpen] = useState(false)
    const pathname = usePathname()

    const getPageTitle = () => {
        if (pathname === '/admin') return 'Dashboard'
        if (pathname.startsWith('/admin/clients')) return 'Clients'
        if (pathname.startsWith('/admin/tools')) return 'Tools'
        if (pathname.startsWith('/admin/analytics')) return 'Analytics'
        if (pathname.startsWith('/admin/alerts')) return 'Alerts'
        return 'Admin'
    }

    const userInitials = userName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)

    return (
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6">
            {/* Left side - Mobile menu + Page title */}
            <div className="flex items-center gap-3">
                {/* Mobile menu button */}
                <button
                    onClick={onMenuClick}
                    className="md:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <Menu size={20} />
                </button>

                {/* Mobile logo */}
                <div className="md:hidden flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600">
                        <Zap size={14} className="text-white fill-current" />
                    </div>
                </div>

                {/* Page title - desktop only */}
                <h1 className="hidden md:block text-lg font-semibold text-gray-900">
                    {getPageTitle()}
                </h1>
            </div>

            {/* Right side - Alerts + User menu */}
            <div className="flex items-center gap-2">
                {/* Alerts button */}
                <Link
                    href="/admin/alerts"
                    className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <Bell size={20} />
                    {unreadAlerts > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] text-[10px] font-semibold text-white bg-red-500 rounded-full px-1">
                            {unreadAlerts > 99 ? '99+' : unreadAlerts}
                        </span>
                    )}
                </Link>

                {/* User menu */}
                <div className="relative">
                    <button
                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                        className="flex items-center gap-2 p-1.5 pr-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                            {userInitials}
                        </div>
                        <span className="hidden sm:block text-sm font-medium">{userName}</span>
                        <ChevronDown size={16} className={`hidden sm:block transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown menu */}
                    {userMenuOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setUserMenuOpen(false)}
                            />
                            <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-lg border border-gray-200 shadow-lg z-20 py-1">
                                <div className="px-3 py-2 border-b border-gray-100">
                                    <p className="text-sm font-medium text-gray-900">{userName}</p>
                                    <p className="text-xs text-gray-500">{userEmail}</p>
                                </div>
                                <Link
                                    href="/admin/settings"
                                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    onClick={() => setUserMenuOpen(false)}
                                >
                                    <Settings size={16} />
                                    Settings
                                </Link>
                                <Link
                                    href="/admin/profile"
                                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    onClick={() => setUserMenuOpen(false)}
                                >
                                    <User size={16} />
                                    Profile
                                </Link>
                                <div className="border-t border-gray-100 mt-1 pt-1">
                                    <button
                                        onClick={() => {
                                            setUserMenuOpen(false)
                                            onLogout?.()
                                        }}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                                    >
                                        <LogOut size={16} />
                                        Log out
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}
