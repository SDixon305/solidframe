'use client'

import React, { useState } from 'react'
import { Search, Filter, ChevronDown, Mail, Phone, Clock, CheckCircle, XCircle, MoreHorizontal } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export interface Quote {
    id: string
    customerName: string
    customerPhone: string
    customerEmail: string
    amount: number
    description: string
    createdAt: Date
    lastContactAt: Date | null
    status: 'outstanding' | 'followed_up' | 'pending' | 'won' | 'lost'
    followUpCount: number
}

interface QuoteListProps {
    quotes: Quote[]
    onContactCustomer?: (quote: Quote, method: 'email' | 'phone') => void
    onMarkWon?: (quote: Quote) => void
    onMarkLost?: (quote: Quote) => void
}

const STATUS_CONFIG = {
    outstanding: { label: 'Outstanding', color: 'bg-gray-100 text-gray-700' },
    followed_up: { label: 'Followed Up', color: 'bg-blue-100 text-blue-700' },
    pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700' },
    won: { label: 'Won', color: 'bg-emerald-100 text-emerald-700' },
    lost: { label: 'Lost', color: 'bg-red-100 text-red-700' },
}

export default function QuoteList({ quotes, onContactCustomer, onMarkWon, onMarkLost }: QuoteListProps) {
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [showFilterDropdown, setShowFilterDropdown] = useState(false)
    const [expandedQuote, setExpandedQuote] = useState<string | null>(null)

    const filteredQuotes = quotes.filter(quote => {
        const matchesSearch = quote.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            quote.description.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === 'all' || quote.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const totalValue = filteredQuotes.reduce((sum, q) => sum + q.amount, 0)

    return (
        <div className="space-y-4">
            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search quotes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5f3bff]/20 focus:border-[#5f3bff]"
                    />
                </div>

                <div className="relative">
                    <button
                        onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                        className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        <Filter size={16} />
                        <span>{statusFilter === 'all' ? 'All Status' : STATUS_CONFIG[statusFilter as keyof typeof STATUS_CONFIG]?.label}</span>
                        <ChevronDown size={14} />
                    </button>

                    {showFilterDropdown && (
                        <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                            <div className="p-1">
                                <button
                                    onClick={() => { setStatusFilter('all'); setShowFilterDropdown(false) }}
                                    className={`w-full text-left px-3 py-2 text-sm rounded-md ${statusFilter === 'all' ? 'bg-[#5f3bff]/10 text-[#5f3bff]' : 'hover:bg-gray-50'}`}
                                >
                                    All Status
                                </button>
                                {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                                    <button
                                        key={key}
                                        onClick={() => { setStatusFilter(key); setShowFilterDropdown(false) }}
                                        className={`w-full text-left px-3 py-2 text-sm rounded-md ${statusFilter === key ? 'bg-[#5f3bff]/10 text-[#5f3bff]' : 'hover:bg-gray-50'}`}
                                    >
                                        {config.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Summary */}
            <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Showing {filteredQuotes.length} quotes</span>
                <span>Total: ${totalValue.toLocaleString()}</span>
            </div>

            {/* Quote Table */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                {filteredQuotes.length === 0 ? (
                    <div className="p-8 text-center">
                        <p className="text-gray-500">No quotes found</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {filteredQuotes.map((quote) => {
                            const statusConfig = STATUS_CONFIG[quote.status]
                            const isExpanded = expandedQuote === quote.id

                            return (
                                <div key={quote.id} className="hover:bg-gray-50 transition-colors">
                                    <div
                                        className="flex items-center gap-4 p-4 cursor-pointer"
                                        onClick={() => setExpandedQuote(isExpanded ? null : quote.id)}
                                    >
                                        {/* Customer */}
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-gray-900">{quote.customerName}</div>
                                            <div className="text-sm text-gray-500 truncate">{quote.description}</div>
                                        </div>

                                        {/* Amount */}
                                        <div className="text-right">
                                            <div className="font-bold text-gray-900">${quote.amount.toLocaleString()}</div>
                                            <div className="text-xs text-gray-400">
                                                {formatDistanceToNow(quote.createdAt, { addSuffix: true })}
                                            </div>
                                        </div>

                                        {/* Status */}
                                        <div className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                                            {statusConfig.label}
                                        </div>

                                        {/* Follow-ups */}
                                        <div className="text-center w-16">
                                            <div className="text-sm font-medium text-gray-900">{quote.followUpCount}</div>
                                            <div className="text-xs text-gray-400">follow-ups</div>
                                        </div>

                                        {/* Expand indicator */}
                                        <ChevronDown
                                            size={16}
                                            className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                        />
                                    </div>

                                    {/* Expanded details */}
                                    {isExpanded && (
                                        <div className="px-4 pb-4 pt-0">
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                                    <div>
                                                        <div className="text-xs text-gray-400 mb-1">Phone</div>
                                                        <div className="text-sm text-gray-700">{quote.customerPhone}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-gray-400 mb-1">Email</div>
                                                        <div className="text-sm text-gray-700">{quote.customerEmail}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-gray-400 mb-1">Last Contact</div>
                                                        <div className="text-sm text-gray-700">
                                                            {quote.lastContactAt
                                                                ? formatDistanceToNow(quote.lastContactAt, { addSuffix: true })
                                                                : 'Never'}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-gray-400 mb-1">Quote Age</div>
                                                        <div className="text-sm text-gray-700">
                                                            {formatDistanceToNow(quote.createdAt)}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            onContactCustomer?.(quote, 'email')
                                                        }}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[#5f3bff] hover:bg-[#5f3bff]/10 rounded-lg transition-colors"
                                                    >
                                                        <Mail size={14} />
                                                        Email
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            onContactCustomer?.(quote, 'phone')
                                                        }}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[#5f3bff] hover:bg-[#5f3bff]/10 rounded-lg transition-colors"
                                                    >
                                                        <Phone size={14} />
                                                        Call
                                                    </button>
                                                    <div className="flex-1" />
                                                    {quote.status !== 'won' && quote.status !== 'lost' && (
                                                        <>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    onMarkWon?.(quote)
                                                                }}
                                                                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                                            >
                                                                <CheckCircle size={14} />
                                                                Mark Won
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    onMarkLost?.(quote)
                                                                }}
                                                                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            >
                                                                <XCircle size={14} />
                                                                Mark Lost
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

// Generate fake quotes
const FIRST_NAMES = ['John', 'Sarah', 'Mike', 'Emily', 'David', 'Lisa', 'Chris', 'Amanda', 'James', 'Jennifer', 'Robert', 'Michelle', 'William', 'Ashley', 'Thomas']
const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Wilson', 'Anderson', 'Taylor', 'Thomas', 'Moore']
const SERVICES = [
    'AC Unit Replacement',
    'Furnace Installation',
    'Full HVAC System',
    'Ductwork Repair',
    'Heat Pump Installation',
    'Central Air Installation',
    'Boiler Replacement',
    'Zoning System Install',
    'Air Quality System',
    'Thermostat Upgrade',
]

export function generateFakeQuotes(tenantId: string, count: number = 25): Quote[] {
    const seed = tenantId.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
    const seededRandom = (offset: number) => {
        const x = Math.sin(seed + offset) * 10000
        return x - Math.floor(x)
    }

    const quotes: Quote[] = []
    const now = new Date()

    for (let i = 0; i < count; i++) {
        const firstName = FIRST_NAMES[Math.floor(seededRandom(i * 10) * FIRST_NAMES.length)]
        const lastName = LAST_NAMES[Math.floor(seededRandom(i * 10 + 1) * LAST_NAMES.length)]
        const service = SERVICES[Math.floor(seededRandom(i * 10 + 2) * SERVICES.length)]
        const daysAgo = Math.floor(seededRandom(i * 10 + 3) * 60) + 1
        const amount = 500 + Math.floor(seededRandom(i * 10 + 4) * 4500)

        const statusRandom = seededRandom(i * 10 + 5)
        let status: Quote['status']
        if (statusRandom < 0.4) status = 'outstanding'
        else if (statusRandom < 0.6) status = 'followed_up'
        else if (statusRandom < 0.75) status = 'pending'
        else if (statusRandom < 0.9) status = 'won'
        else status = 'lost'

        const createdAt = new Date(now)
        createdAt.setDate(createdAt.getDate() - daysAgo)

        const hasBeenContacted = status !== 'outstanding' || seededRandom(i * 10 + 6) > 0.5
        const lastContactDaysAgo = hasBeenContacted ? Math.floor(seededRandom(i * 10 + 7) * Math.min(daysAgo, 14)) : null
        const lastContactAt = lastContactDaysAgo !== null ? new Date(now.setDate(now.getDate() - lastContactDaysAgo)) : null

        quotes.push({
            id: `quote-${i + 1}`,
            customerName: `${firstName} ${lastName}`,
            customerPhone: `555-${String(1000 + Math.floor(seededRandom(i * 10 + 8) * 9000)).padStart(4, '0')}`,
            customerEmail: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
            amount,
            description: service,
            createdAt,
            lastContactAt,
            status,
            followUpCount: status === 'outstanding' ? 0 : Math.floor(seededRandom(i * 10 + 9) * 4) + 1,
        })
    }

    // Sort by created date descending
    return quotes.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}
