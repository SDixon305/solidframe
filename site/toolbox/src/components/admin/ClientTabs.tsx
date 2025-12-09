'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Wrench, BarChart3, Settings, Eye } from 'lucide-react'

interface ClientTabsProps {
    clientId: string
}

const tabs = [
    { slug: '', label: 'Overview', icon: LayoutDashboard },
    { slug: 'tools', label: 'Tools', icon: Wrench },
    { slug: 'usage', label: 'Usage', icon: BarChart3 },
    { slug: 'config', label: 'Config', icon: Settings },
    { slug: 'view-as', label: 'View As', icon: Eye },
]

export function ClientTabs({ clientId }: ClientTabsProps) {
    const pathname = usePathname()
    const basePath = `/admin/clients/${clientId}`

    const isActive = (slug: string) => {
        if (slug === '') {
            return pathname === basePath
        }
        return pathname === `${basePath}/${slug}`
    }

    return (
        <div className="border-b border-gray-200 bg-white">
            <nav className="flex gap-1 px-4 -mb-px">
                {tabs.map(tab => {
                    const Icon = tab.icon
                    const active = isActive(tab.slug)
                    const href = tab.slug ? `${basePath}/${tab.slug}` : basePath

                    return (
                        <Link
                            key={tab.slug}
                            href={href}
                            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                                active
                                    ? 'border-violet-600 text-violet-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            <Icon className="w-4 h-4" />
                            {tab.label}
                        </Link>
                    )
                })}
            </nav>
        </div>
    )
}
