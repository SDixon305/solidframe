'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ClientForm } from '@/components/admin/ClientForm'
import type { CreateTenantRequest, UpdateTenantRequest } from '@/types/tenants'
import { createClient } from '@/utils/supabase/client'

export default function NewClientPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (data: CreateTenantRequest | UpdateTenantRequest) => {
        setIsLoading(true)
        setError(null)

        try {
            const supabase = createClient()

            // Create the tenant
            const { data: tenant, error: tenantError } = await supabase
                .from('tenants')
                .insert({
                    name: data.name,
                    slug: data.slug,
                    logo_url: data.logo_url || null,
                    status: 'pending',
                })
                .select()
                .single()

            if (tenantError) {
                throw new Error(tenantError.message)
            }

            // Create a pre-created user record for the owner
            if (data.owner_email) {
                const { error: userError } = await supabase
                    .from('users')
                    .insert({
                        tenant_id: tenant.id,
                        email: data.owner_email,
                        first_name: data.owner_name?.split(' ')[0] || null,
                        last_name: data.owner_name?.split(' ').slice(1).join(' ') || null,
                        role: 'client_user',
                        auth_id: null, // Will be set on first login
                    })

                if (userError) {
                    console.warn('Failed to create user record:', userError)
                    // Continue anyway - user can be added later
                }
            }

            // Redirect to the new client's detail page
            router.push(`/admin/clients/${tenant.id}`)
        } catch (err) {
            console.error('Error creating client:', err)
            setError(err instanceof Error ? err.message : 'Failed to create client')
            setIsLoading(false)
        }
    }

    const handleCancel = () => {
        router.push('/admin/clients')
    }

    return (
        <div className="max-w-2xl mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                <Link href="/admin/clients" className="hover:text-violet-600 flex items-center gap-1">
                    <ArrowLeft className="w-4 h-4" />
                    Clients
                </Link>
                <span>/</span>
                <span className="text-gray-900 font-medium">New Client</span>
            </div>

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Create New Client</h1>
                <p className="text-gray-500 mt-1">
                    Set up a new client account. They'll receive a magic link to access their portal.
                </p>
            </div>

            {/* Error Display */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    {error}
                </div>
            )}

            {/* Form */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <ClientForm
                    mode="create"
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    isLoading={isLoading}
                />
            </div>
        </div>
    )
}
