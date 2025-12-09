'use client'

import { ReactNode, useState } from 'react'
import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'
import { AdminSidebar } from './AdminSidebar'
import { AdminHeader } from './AdminHeader'
import { createClient } from '@/utils/supabase/client'
import { useUnreadAlertCount } from '@/hooks/useAlerts'

interface AdminLayoutClientProps {
    children: ReactNode
    userName: string
    userEmail: string
}

export function AdminLayoutClient({
    children,
    userName,
    userEmail,
}: AdminLayoutClientProps) {
    const [mobileNavOpen, setMobileNavOpen] = useState(false)
    const router = useRouter()

    // Real-time unread alert count from Supabase
    const unreadAlerts = useUnreadAlertCount()

    const handleLogout = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/login')
    }

    return (
        <div className="flex h-screen bg-[#f4f5f7] text-gray-900">
            {/* Desktop Sidebar - hidden on mobile */}
            <div className="hidden md:block">
                <AdminSidebar
                    userName={userName}
                    userEmail={userEmail}
                    onLogout={handleLogout}
                    unreadAlerts={unreadAlerts}
                />
            </div>

            {/* Mobile Sidebar Overlay */}
            {mobileNavOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setMobileNavOpen(false)}
                />
            )}

            {/* Mobile Sidebar Drawer */}
            <div
                className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
                    mobileNavOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Close button */}
                <button
                    onClick={() => setMobileNavOpen(false)}
                    className="absolute top-5 right-4 p-2 text-white/70 hover:text-white z-10 rounded-lg hover:bg-white/10 transition-colors"
                >
                    <X size={20} />
                </button>
                <AdminSidebar
                    userName={userName}
                    userEmail={userEmail}
                    onLogout={handleLogout}
                    unreadAlerts={unreadAlerts}
                />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <AdminHeader
                    userName={userName}
                    userEmail={userEmail}
                    onMenuClick={() => setMobileNavOpen(true)}
                    onLogout={handleLogout}
                    unreadAlerts={unreadAlerts}
                />

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}
