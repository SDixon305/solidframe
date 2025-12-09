'use client'

import React, { useState, createContext, useContext } from 'react'
import { Menu, X, Zap } from 'lucide-react'

// Context for mobile sidebar state
interface MobileNavContextType {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
    toggle: () => void
}

const MobileNavContext = createContext<MobileNavContextType>({
    isOpen: false,
    setIsOpen: () => {},
    toggle: () => {},
})

export function useMobileNav() {
    return useContext(MobileNavContext)
}

interface DashboardLayoutProps {
    sidebar: React.ReactNode
    header: React.ReactNode
    children: React.ReactNode
    // Optional loading state
    loading?: boolean
    loadingMessage?: string
}

export default function DashboardLayout({
    sidebar,
    header,
    children,
    loading = false,
    loadingMessage = 'Loading...',
}: DashboardLayoutProps) {
    const [mobileNavOpen, setMobileNavOpen] = useState(false)

    const mobileNavContext: MobileNavContextType = {
        isOpen: mobileNavOpen,
        setIsOpen: setMobileNavOpen,
        toggle: () => setMobileNavOpen(!mobileNavOpen),
    }

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="p-4 rounded-2xl bg-slate-900 shadow-xl">
                        <Zap size={32} className="text-amber-400 animate-pulse" />
                    </div>
                    <p className="text-sm font-medium text-slate-500">{loadingMessage}</p>
                </div>
            </div>
        )
    }

    return (
        <MobileNavContext.Provider value={mobileNavContext}>
            <div className="flex h-screen bg-slate-100 text-slate-900 transition-colors duration-300">
                {/* Desktop Sidebar - hidden on mobile */}
                <div className="hidden md:block">
                    {sidebar}
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
                    {sidebar}
                </div>

                {/* Main Content Area */}
                <main className="flex-1 relative overflow-hidden flex flex-col min-w-0">
                    {/* Mobile Header Bar */}
                    <div className="md:hidden flex items-center gap-3 px-4 py-3 bg-slate-900 border-b border-white/10">
                        <button
                            onClick={() => setMobileNavOpen(true)}
                            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <Menu size={20} />
                        </button>
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500">
                                <Zap size={14} className="text-white fill-current" />
                            </div>
                            <span className="text-white font-semibold text-sm">SolidFrame</span>
                        </div>
                    </div>

                    {/* Desktop Header - hidden on mobile */}
                    <div className="hidden md:block">
                        {header}
                    </div>

                    {/* Mobile Header - simplified */}
                    <div className="md:hidden">
                        {header}
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-4 md:p-6">
                        {children}
                    </div>
                </main>
            </div>
        </MobileNavContext.Provider>
    )
}
