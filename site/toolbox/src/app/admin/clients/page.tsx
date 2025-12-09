'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { Search, Filter, Plus, Loader2, X, Building2 } from 'lucide-react'
import { ClientCard } from '@/components/admin/ClientCard'
import type { TenantWithStats, BusinessType, TenantStatus } from '@/types/tenants'
import { createClient } from '@/utils/supabase/client'

const statusOptions: { value: TenantStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'pending', label: 'Pending' },
    { value: 'suspended', label: 'Suspended' },
    { value: 'cancelled', label: 'Cancelled' },
]

const businessTypeOptions: { value: BusinessType | 'all'; label: string }[] = [
    { value: 'all', label: 'All Types' },
    { value: 'hvac', label: 'HVAC' },
    { value: 'plumbing', label: 'Plumbing' },
    { value: 'electrical', label: 'Electrical' },
    { value: 'roofing', label: 'Roofing' },
    { value: 'general', label: 'General' },
    { value: 'other', label: 'Other' },
]

const sortOptions: { value: string; label: string }[] = [
    { value: 'created_at:desc', label: 'Newest First' },
    { value: 'created_at:asc', label: 'Oldest First' },
    { value: 'name:asc', label: 'Name A-Z' },
    { value: 'name:desc', label: 'Name Z-A' },
]

// Mock data for development
const mockClients: TenantWithStats[] = [
    {
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
    },
    {
        id: '2',
        name: "Sparky's Electric",
        slug: 'sparkys-electric',
        logo_url: null,
        status: 'pending',
        stripe_customer_id: null,
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        business_type: 'electrical',
        owner_name: 'Mike Johnson',
        owner_email: 'mike@sparkyselectric.com',
        active_tool_count: 1,
        user_count: 1,
        last_activity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: '3',
        name: 'Apex Roofing',
        slug: 'apex-roofing',
        logo_url: null,
        status: 'active',
        stripe_customer_id: null,
        created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        business_type: 'roofing',
        owner_name: 'Sarah Williams',
        owner_email: 'sarah@apexroofing.com',
        active_tool_count: 6,
        user_count: 5,
        last_activity: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: '4',
        name: 'CleanFlow Plumbing',
        slug: 'cleanflow-plumbing',
        logo_url: null,
        status: 'suspended',
        stripe_customer_id: null,
        created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        business_type: 'plumbing',
        owner_name: 'Bob Davis',
        owner_email: 'bob@cleanflowplumbing.com',
        active_tool_count: 0,
        user_count: 2,
        last_activity: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    },
]

export default function ClientsPage() {
    const [clients, setClients] = useState<TenantWithStats[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Filters
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState<TenantStatus | 'all'>('all')
    const [typeFilter, setTypeFilter] = useState<BusinessType | 'all'>('all')
    const [sort, setSort] = useState('created_at:desc')
    const [showFilters, setShowFilters] = useState(false)

    // Load clients
    useEffect(() => {
        async function loadClients() {
            setIsLoading(true)
            setError(null)

            try {
                const supabase = createClient()
                const { data, error } = await supabase
                    .from('tenants')
                    .select('*')
                    .order('created_at', { ascending: false })

                if (error) {
                    // Fall back to mock data in development
                    console.warn('Supabase error, using mock data:', error)
                    setClients(mockClients)
                } else if (data && data.length > 0) {
                    setClients(data as TenantWithStats[])
                } else {
                    // No data, use mock
                    setClients(mockClients)
                }
            } catch (err) {
                console.error('Error loading clients:', err)
                setClients(mockClients)
            } finally {
                setIsLoading(false)
            }
        }

        loadClients()
    }, [])

    // Filter and sort clients
    const filteredClients = useMemo(() => {
        let result = [...clients]

        // Search filter
        if (search) {
            const searchLower = search.toLowerCase()
            result = result.filter(client =>
                client.name.toLowerCase().includes(searchLower) ||
                client.slug.toLowerCase().includes(searchLower) ||
                client.owner_email?.toLowerCase().includes(searchLower) ||
                client.owner_name?.toLowerCase().includes(searchLower)
            )
        }

        // Status filter
        if (statusFilter !== 'all') {
            result = result.filter(client => client.status === statusFilter)
        }

        // Business type filter
        if (typeFilter !== 'all') {
            result = result.filter(client => client.business_type === typeFilter)
        }

        // Sort
        const [sortField, sortOrder] = sort.split(':')
        result.sort((a, b) => {
            let comparison = 0
            if (sortField === 'name') {
                comparison = a.name.localeCompare(b.name)
            } else if (sortField === 'created_at') {
                comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            }
            return sortOrder === 'desc' ? -comparison : comparison
        })

        return result
    }, [clients, search, statusFilter, typeFilter, sort])

    const hasActiveFilters = statusFilter !== 'all' || typeFilter !== 'all'

    const clearFilters = () => {
        setStatusFilter('all')
        setTypeFilter('all')
        setSearch('')
    }

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
                    <p className="text-gray-500 mt-1">
                        Manage client accounts and tool activations
                    </p>
                </div>
                <Link
                    href="/admin/clients/new"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-colors shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    Add Client
                </Link>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, subdomain, or email..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
                        />
                        {search && (
                            <button
                                onClick={() => setSearch('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Filter Toggle (Mobile) */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`md:hidden flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-colors ${
                            hasActiveFilters
                                ? 'border-violet-300 bg-violet-50 text-violet-700'
                                : 'border-gray-300 text-gray-700'
                        }`}
                    >
                        <Filter className="w-4 h-4" />
                        Filters
                        {hasActiveFilters && (
                            <span className="w-5 h-5 rounded-full bg-violet-600 text-white text-xs flex items-center justify-center">
                                {(statusFilter !== 'all' ? 1 : 0) + (typeFilter !== 'all' ? 1 : 0)}
                            </span>
                        )}
                    </button>

                    {/* Filters (Desktop always visible, mobile collapsible) */}
                    <div className={`flex flex-col md:flex-row gap-4 ${showFilters ? 'block' : 'hidden md:flex'}`}>
                        {/* Status Filter */}
                        <select
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value as TenantStatus | 'all')}
                            className="px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all bg-white min-w-[140px]"
                        >
                            {statusOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>

                        {/* Business Type Filter */}
                        <select
                            value={typeFilter}
                            onChange={e => setTypeFilter(e.target.value as BusinessType | 'all')}
                            className="px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all bg-white min-w-[140px]"
                        >
                            {businessTypeOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>

                        {/* Sort */}
                        <select
                            value={sort}
                            onChange={e => setSort(e.target.value)}
                            className="px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all bg-white min-w-[150px]"
                        >
                            {sortOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Active Filters */}
                {hasActiveFilters && (
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                        <span className="text-sm text-gray-500">Active filters:</span>
                        {statusFilter !== 'all' && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-violet-100 text-violet-700 rounded-md text-sm">
                                Status: {statusFilter}
                                <button onClick={() => setStatusFilter('all')}>
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                        {typeFilter !== 'all' && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-violet-100 text-violet-700 rounded-md text-sm">
                                Type: {typeFilter}
                                <button onClick={() => setTypeFilter('all')}>
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                        <button
                            onClick={clearFilters}
                            className="text-sm text-violet-600 hover:text-violet-800 ml-2"
                        >
                            Clear all
                        </button>
                    </div>
                )}
            </div>

            {/* Results */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
                </div>
            ) : error ? (
                <div className="text-center py-20">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="text-violet-600 hover:text-violet-800"
                    >
                        Try again
                    </button>
                </div>
            ) : filteredClients.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
                    <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No clients found</h3>
                    <p className="text-gray-500 mb-6">
                        {search || hasActiveFilters
                            ? 'Try adjusting your search or filters'
                            : 'Get started by adding your first client'}
                    </p>
                    {(search || hasActiveFilters) ? (
                        <button
                            onClick={clearFilters}
                            className="text-violet-600 hover:text-violet-800 font-medium"
                        >
                            Clear filters
                        </button>
                    ) : (
                        <Link
                            href="/admin/clients/new"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Add Client
                        </Link>
                    )}
                </div>
            ) : (
                <>
                    {/* Results Count */}
                    <p className="text-sm text-gray-500 mb-4">
                        Showing {filteredClients.length} of {clients.length} clients
                    </p>

                    {/* Client Grid */}
                    <div className="grid gap-4">
                        {filteredClients.map(client => (
                            <ClientCard
                                key={client.id}
                                client={client}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}
