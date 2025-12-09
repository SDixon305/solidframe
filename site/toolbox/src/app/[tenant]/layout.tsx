'use client'

import { useState, useEffect, ReactNode, createContext, useContext } from 'react'
import { useParams, notFound } from 'next/navigation'
import { Menu, X, Zap } from 'lucide-react'
import { TenantProvider, DEMO_TENANTS, createMockTenant } from '@/lib/tenant-context'
import { ClientSidebar, ClientHeader } from '@/components/client'
import { DbTenant } from '@/types/auth'

// Mobile nav context for client portal
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

export function useClientMobileNav() {
    return useContext(MobileNavContext)
}

interface ClientLayoutProps {
    children: ReactNode
}

export default function ClientLayout({ children }: ClientLayoutProps) {
    const params = useParams()
    const tenantSlug = params.tenant as string

    const [tenant, setTenant] = useState<DbTenant | null>(null)
    const [loading, setLoading] = useState(true)
    const [mobileNavOpen, setMobileNavOpen] = useState(false)

    // Validate tenant and load data
    useEffect(() => {
        async function loadTenant() {
            setLoading(true)

            // Check if this is a known demo tenant
            if (DEMO_TENANTS[tenantSlug]) {
                setTenant(DEMO_TENANTS[tenantSlug])
                setLoading(false)
                return
            }

            // In production, this would fetch from Supabase
            // For now, create a mock tenant for any unknown slug
            // In a real app, we'd return 404 for unknown tenants
            try {
                // Simulate API call delay
                await new Promise(resolve => setTimeout(resolve, 100))

                // For development: allow any slug to work as a demo tenant
                const mockTenant = createMockTenant(
                    tenantSlug,
                    tenantSlug
                        .split('-')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ')
                )
                setTenant(mockTenant)
            } catch (error) {
                console.error('Failed to load tenant:', error)
                setTenant(null)
            }

            setLoading(false)
        }

        loadTenant()
    }, [tenantSlug])

    const mobileNavContext: MobileNavContextType = {
        isOpen: mobileNavOpen,
        setIsOpen: setMobileNavOpen,
        toggle: () => setMobileNavOpen(!mobileNavOpen),
    }

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-[#f4f5f7] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-[#5f3bff] to-[#4f2fe0] shadow-xl">
                        <Zap size={32} className="text-white animate-pulse" />
                    </div>
                    <p className="text-sm font-medium text-gray-500">Loading...</p>
                </div>
            </div>
        )
    }

    // Tenant not found
    if (!tenant) {
        notFound()
    }

    return (
        <TenantProvider
            tenant={tenant}
            onboardingProgress={{ completed: false, currentStep: 3 }}
        >
            <MobileNavContext.Provider value={mobileNavContext}>
                <div className="flex h-screen bg-[#f4f5f7] text-gray-900">
                    {/* Desktop Sidebar */}
                    <div className="hidden md:block">
                        <ClientSidebar />
                    </div>

                    {/* Mobile Sidebar Overlay */}
                    {mobileNavOpen && (
                        <div
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
                            onClick={() => setMobileNavOpen(false)}
                        />
                    )}

                    {/* Mobile Sidebar Drawer */}
                    <div
                        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
                            mobileNavOpen ? 'translate-x-0' : '-translate-x-full'
                        }`}
                    >
                        <button
                            onClick={() => setMobileNavOpen(false)}
                            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 z-10 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <X size={20} />
                        </button>
                        <ClientSidebar />
                    </div>

                    {/* Main Content Area */}
                    <main className="flex-1 relative overflow-hidden flex flex-col min-w-0">
                        {/* Mobile Header Bar */}
                        <div className="md:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200">
                            <button
                                onClick={() => setMobileNavOpen(true)}
                                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <Menu size={20} />
                            </button>
                            <div className="flex items-center gap-2">
                                {tenant.logo_url ? (
                                    <img
                                        src={tenant.logo_url}
                                        alt={tenant.name}
                                        className="w-7 h-7 rounded-md object-cover"
                                    />
                                ) : (
                                    <div className="p-1.5 rounded-md bg-gradient-to-br from-[#5f3bff] to-[#4f2fe0]">
                                        <Zap size={14} className="text-white" />
                                    </div>
                                )}
                                <span className="font-semibold text-sm text-gray-900">
                                    {tenant.name}
                                </span>
                            </div>
                        </div>

                        {/* Desktop Header */}
                        <div className="hidden md:block">
                            <ClientHeader />
                        </div>

                        {/* Page Content */}
                        <div className="flex-1 overflow-y-auto p-4 md:p-6">
                            {children}
                        </div>
                    </main>
                </div>
            </MobileNavContext.Provider>
        </TenantProvider>
    )
}
