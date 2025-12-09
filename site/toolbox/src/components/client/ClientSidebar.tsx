'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    Wrench,
    Settings,
    MessageSquare,
    HelpCircle,
    ChevronDown,
    ChevronRight,
    Phone,
    MessageCircle,
    Star,
    Calendar,
    DollarSign,
    Megaphone,
    RefreshCw,
    GraduationCap,
    LogOut,
    Zap,
} from 'lucide-react'
import { useTenantContext } from '@/lib/tenant-context'
import { ToolSlug } from '@/lib/fake-data'

// Icon mapping for tools
const TOOL_ICON_MAP: Record<ToolSlug, React.ElementType> = {
    'after-hours-agent': Phone,
    'missed-call-textback': MessageCircle,
    'review-request': Star,
    'appointment-reminders': Calendar,
    'quote-reviver': DollarSign,
    'seasonal-campaigns': Megaphone,
    'maintenance-renewal': RefreshCw,
    'tech-training': GraduationCap,
}

interface ClientSidebarProps {
    className?: string
}

export default function ClientSidebar({ className = '' }: ClientSidebarProps) {
    const pathname = usePathname()
    const { tenant, tools } = useTenantContext()
    const [toolsExpanded, setToolsExpanded] = useState(true)

    const basePath = `/${tenant.slug}`

    const isActive = (path: string) => pathname === path
    const isToolActive = (slug: string) => pathname === `${basePath}/tools/${slug}`

    const navLinkClass = (active: boolean) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            active
                ? 'bg-[#5f3bff]/10 text-[#5f3bff] border border-[#5f3bff]/20'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }`

    const toolLinkClass = (active: boolean) =>
        `flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-all duration-200 ${
            active
                ? 'bg-[#5f3bff]/10 text-[#5f3bff]'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
        }`

    return (
        <aside className={`w-64 bg-white border-r border-gray-200 flex flex-col h-screen ${className}`}>
            {/* Brand Header */}
            <div className="p-5 border-b border-gray-100">
                <Link href={basePath} className="flex items-center gap-3 group">
                    {tenant.logo_url ? (
                        <img
                            src={tenant.logo_url}
                            alt={tenant.name}
                            className="w-10 h-10 rounded-lg object-cover"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#5f3bff] to-[#4f2fe0] flex items-center justify-center">
                            <Zap size={20} className="text-white" />
                        </div>
                    )}
                    <div className="min-w-0">
                        <h1 className="text-sm font-semibold text-gray-900 truncate group-hover:text-[#5f3bff] transition-colors">
                            {tenant.name}
                        </h1>
                        <span className="text-xs text-gray-400">Dashboard</span>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                {/* Dashboard */}
                <Link href={basePath} className={navLinkClass(isActive(basePath))}>
                    <LayoutDashboard size={18} />
                    <span>Dashboard</span>
                </Link>

                {/* Tools (Expandable) */}
                <div>
                    <button
                        onClick={() => setToolsExpanded(!toolsExpanded)}
                        className={`w-full ${navLinkClass(pathname.includes('/tools/'))}`}
                    >
                        <Wrench size={18} />
                        <span className="flex-1 text-left">Tools</span>
                        {toolsExpanded ? (
                            <ChevronDown size={16} className="text-gray-400" />
                        ) : (
                            <ChevronRight size={16} className="text-gray-400" />
                        )}
                    </button>

                    {toolsExpanded && (
                        <div className="mt-1 ml-4 pl-3 border-l border-gray-200 space-y-0.5">
                            {tools.map((tool) => {
                                const Icon = TOOL_ICON_MAP[tool.slug]
                                return (
                                    <Link
                                        key={tool.slug}
                                        href={`${basePath}/tools/${tool.slug}`}
                                        className={toolLinkClass(isToolActive(tool.slug))}
                                    >
                                        <Icon size={14} />
                                        <span className="truncate">{tool.name}</span>
                                        {tool.isActive && (
                                            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        )}
                                    </Link>
                                )
                            })}
                        </div>
                    )}
                </div>

                {/* Divider */}
                <div className="pt-4 mt-4 border-t border-gray-100">
                    <Link
                        href={`${basePath}/settings`}
                        className={navLinkClass(isActive(`${basePath}/settings`))}
                    >
                        <Settings size={18} />
                        <span>Settings</span>
                    </Link>

                    <Link
                        href={`${basePath}/feedback`}
                        className={navLinkClass(isActive(`${basePath}/feedback`))}
                    >
                        <MessageSquare size={18} />
                        <span>Feedback</span>
                    </Link>

                    <Link
                        href={`${basePath}/help`}
                        className={navLinkClass(isActive(`${basePath}/help`))}
                    >
                        <HelpCircle size={18} />
                        <span>Help</span>
                    </Link>
                </div>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100">
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors">
                    <LogOut size={18} />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    )
}
