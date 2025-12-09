'use client'

import { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { ClientHeader } from '@/components/admin/ClientHeader'
import { ClientTabs } from '@/components/admin/ClientTabs'
import type { TenantWithStats } from '@/types/tenants'
import { createClient } from '@/utils/supabase/client'
import { Loader2 } from 'lucide-react'

// Mock data for development
const mockClient: TenantWithStats = {
    id: '1',
    name: 'Trinity Cooling',
    slug: 'trinity-cooling',
    logo_url: null,
    status: 'active',
    stripe_customer_id: null,
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    business_type: 'hvac',
    owner_name: 'John Smith',
    owner_email: 'john@trinitycooling.com',
    active_tool_count: 4,
    user_count: 3,
    last_activity: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
}

// Context for sharing client data across tabs
interface ClientContextValue {
    client: TenantWithStats | null
    isLoading: boolean
    error: string | null
    refresh: () => Promise<void>
}

const ClientContext = createContext<ClientContextValue>({
    client: null,
    isLoading: true,
    error: null,
    refresh: async () => {},
})

export function useClient() {
    return useContext(ClientContext)
}

interface ClientLayoutProps {
    children: ReactNode
    params: Promise<{ id: string }>
}

export default function ClientLayout({ children, params }: ClientLayoutProps) {
    const router = useRouter()
    const [client, setClient] = useState<TenantWithStats | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [clientId, setClientId] = useState<string | null>(null)

    // Unwrap params
    useEffect(() => {
        params.then(p => setClientId(p.id))
    }, [params])

    const loadClient = async () => {
        if (!clientId) return

        setIsLoading(true)
        setError(null)

        try {
            const supabase = createClient()
            const { data, error } = await supabase
                .from('tenants')
                .select('*')
                .eq('id', clientId)
                .single()

            if (error) {
                console.warn('Supabase error, using mock data:', error)
                setClient({ ...mockClient, id: clientId })
            } else if (data) {
                setClient(data as TenantWithStats)
            } else {
                setClient({ ...mockClient, id: clientId })
            }
        } catch (err) {
            console.error('Error loading client:', err)
            setClient({ ...mockClient, id: clientId })
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (clientId) {
            loadClient()
        }
    }, [clientId])

    const handleEdit = () => {
        // TODO: Open edit modal or navigate to edit page
        console.log('Edit client')
    }

    const handleDelete = async () => {
        if (!client) return
        if (!confirm(`Are you sure you want to delete ${client.name}? This action cannot be undone.`)) {
            return
        }

        try {
            const supabase = createClient()
            const { error } = await supabase
                .from('tenants')
                .delete()
                .eq('id', client.id)

            if (error) {
                throw error
            }

            router.push('/admin/clients')
        } catch (err) {
            console.error('Error deleting client:', err)
            alert('Failed to delete client')
        }
    }

    const handleSendMagicLink = async () => {
        if (!client?.owner_email) {
            alert('No owner email configured for this client')
            return
        }

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: client.owner_email }),
            })

            if (response.ok) {
                alert(`Magic link sent to ${client.owner_email}`)
            } else {
                throw new Error('Failed to send magic link')
            }
        } catch (err) {
            console.error('Error sending magic link:', err)
            alert('Failed to send magic link')
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
            </div>
        )
    }

    if (error || !client) {
        return (
            <div className="text-center py-20">
                <p className="text-red-600 mb-4">{error || 'Client not found'}</p>
                <button
                    onClick={() => router.push('/admin/clients')}
                    className="text-violet-600 hover:text-violet-800"
                >
                    Back to clients
                </button>
            </div>
        )
    }

    return (
        <ClientContext.Provider value={{ client, isLoading, error, refresh: loadClient }}>
            <div className="-m-4 md:-m-6">
                <ClientHeader
                    client={client}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onSendMagicLink={handleSendMagicLink}
                />
                <ClientTabs clientId={client.id} />
                <div className="p-4 md:p-6">
                    {children}
                </div>
            </div>
        </ClientContext.Provider>
    )
}
