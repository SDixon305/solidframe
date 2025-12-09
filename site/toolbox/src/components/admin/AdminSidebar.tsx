'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    Users,
    Wrench,
    BarChart3,
    Bell,
    Zap,
    LogOut,
    ChevronRight,
} from 'lucide-react'
import { AlertBadge } from './AlertBadge'

interface AdminSidebarProps {
    userName?: string
    userEmail?: string
    onLogout?: () => void
    unreadAlerts?: number
}

const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/clients', label: 'Clients', icon: Users },
    { href: '/admin/tools', label: 'Tools', icon: Wrench },
    { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/admin/alerts', label: 'Alerts', icon: Bell, showBadge: true },
]

export function AdminSidebar({
    userName = 'Admin User',
    userEmail = 'admin@solidframe.ai',
    onLogout,
    unreadAlerts = 0,
}: AdminSidebarProps) {
    const pathname = usePathname()

    const isActive = (href: string) => {
        if (href === '/admin') {
            return pathname === '/admin'
        }
        return pathname.startsWith(href)
    }

    const userInitials = userName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)

    return (
        <aside className="w-64 bg-gradient-to-b from-slate-900 to-slate-950 flex flex-col h-screen">
            {/* Brand Header */}
            <div className="p-5 border-b border-white/10">
                <Link href="/admin" className="flex items-center gap-3 group">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/20">
                        <Zap size={20} className="text-white fill-current" />
                    </div>
                    <div>
                        <h1 className="text-base font-semibold text-white group-hover:text-violet-400 transition-colors">
                            SolidFrame
                        </h1>
                        <span className="text-xs text-slate-400">Admin Portal</span>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-4">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-3">
                    Navigation
                </div>
                <div className="space-y-1">
                    {navItems.map(item => {
                        const active = isActive(item.href)
                        const Icon = item.icon

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 group ${
                                    active
                                        ? 'bg-white/10 text-white'
                                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                }`}
                            >
                                <div
                                    className={`p-1.5 rounded-md transition-colors ${
                                        active
                                            ? 'bg-violet-500/20'
                                            : 'bg-white/5 group-hover:bg-white/10'
                                    }`}
                                >
                                    <Icon
                                        size={16}
                                        className={
                                            active
                                                ? 'text-violet-400'
                                                : 'text-slate-500 group-hover:text-slate-300'
                                        }
                                    />
                                </div>
                                <span className="text-sm font-medium flex-1">{item.label}</span>
                                {item.showBadge && unreadAlerts > 0 && (
                                    <AlertBadge count={unreadAlerts} />
                                )}
                                {active && !item.showBadge && (
                                    <ChevronRight size={14} className="text-slate-500" />
                                )}
                            </Link>
                        )
                    })}
                </div>
            </nav>

            {/* User Footer */}
            <div className="p-4 border-t border-white/10">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-lg">
                        {userInitials}
                    </div>
                    <div className="overflow-hidden flex-1">
                        <div className="text-sm font-medium text-white truncate">{userName}</div>
                        <div className="text-xs text-slate-400 truncate">{userEmail}</div>
                    </div>
                    {onLogout && (
                        <button
                            onClick={onLogout}
                            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                            title="Log out"
                        >
                            <LogOut size={16} />
                        </button>
                    )}
                </div>
            </div>
        </aside>
    )
}
