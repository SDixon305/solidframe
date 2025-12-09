'use client'

import React, { useState } from 'react'
import { Search, Filter, ChevronDown, Calendar, RefreshCw, Phone, Mail, CheckCircle, AlertTriangle, Clock } from 'lucide-react'
import { format, formatDistanceToNow, differenceInDays, addMonths, addYears } from 'date-fns'

export interface MaintenanceContract {
    id: string
    customerName: string
    customerPhone: string
    customerEmail: string
    planName: string
    planValue: number
    startDate: Date
    renewalDate: Date
    status: 'active' | 'expiring' | 'expired' | 'renewed'
    lastServiceDate: Date | null
    remindersCount: number
}

interface ContractListProps {
    contracts: MaintenanceContract[]
    onSendReminder?: (contract: MaintenanceContract) => void
    onMarkRenewed?: (contract: MaintenanceContract) => void
}

const STATUS_CONFIG = {
    active: { label: 'Active', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
    expiring: { label: 'Expiring Soon', color: 'bg-amber-100 text-amber-700', icon: AlertTriangle },
    expired: { label: 'Expired', color: 'bg-red-100 text-red-700', icon: Clock },
    renewed: { label: 'Renewed', color: 'bg-blue-100 text-blue-700', icon: RefreshCw },
}

export default function ContractList({ contracts, onSendReminder, onMarkRenewed }: ContractListProps) {
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [showFilterDropdown, setShowFilterDropdown] = useState(false)
    const [expandedContract, setExpandedContract] = useState<string | null>(null)

    const filteredContracts = contracts.filter(contract => {
        const matchesSearch = contract.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contract.planName.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === 'all' || contract.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const totalValue = filteredContracts.reduce((sum, c) => sum + c.planValue, 0)

    return (
        <div className="space-y-4">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search contracts..."
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
                <span>Showing {filteredContracts.length} contracts</span>
                <span>Annual Value: ${totalValue.toLocaleString()}</span>
            </div>

            {/* Contract List */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                {filteredContracts.length === 0 ? (
                    <div className="p-8 text-center">
                        <p className="text-gray-500">No contracts found</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {filteredContracts.map((contract) => {
                            const statusConfig = STATUS_CONFIG[contract.status]
                            const StatusIcon = statusConfig.icon
                            const isExpanded = expandedContract === contract.id
                            const daysUntilRenewal = differenceInDays(contract.renewalDate, new Date())

                            return (
                                <div key={contract.id} className="hover:bg-gray-50 transition-colors">
                                    <div
                                        className="flex items-center gap-4 p-4 cursor-pointer"
                                        onClick={() => setExpandedContract(isExpanded ? null : contract.id)}
                                    >
                                        {/* Customer */}
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-gray-900">{contract.customerName}</div>
                                            <div className="text-sm text-gray-500">{contract.planName}</div>
                                        </div>

                                        {/* Value */}
                                        <div className="text-right">
                                            <div className="font-bold text-gray-900">${contract.planValue}/yr</div>
                                            <div className="text-xs text-gray-400">
                                                {contract.remindersCount} reminder{contract.remindersCount !== 1 ? 's' : ''} sent
                                            </div>
                                        </div>

                                        {/* Renewal date */}
                                        <div className="text-right w-28">
                                            <div className="text-sm text-gray-900">
                                                {format(contract.renewalDate, 'MMM d, yyyy')}
                                            </div>
                                            <div className={`text-xs ${daysUntilRenewal < 0 ? 'text-red-500' : daysUntilRenewal < 30 ? 'text-amber-500' : 'text-gray-400'}`}>
                                                {daysUntilRenewal < 0
                                                    ? `${Math.abs(daysUntilRenewal)} days overdue`
                                                    : daysUntilRenewal === 0
                                                        ? 'Due today'
                                                        : `${daysUntilRenewal} days left`
                                                }
                                            </div>
                                        </div>

                                        {/* Status */}
                                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                                            <StatusIcon size={12} />
                                            {statusConfig.label}
                                        </div>

                                        {/* Expand */}
                                        <ChevronDown
                                            size={16}
                                            className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                        />
                                    </div>

                                    {/* Expanded details */}
                                    {isExpanded && (
                                        <div className="px-4 pb-4">
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                                    <div>
                                                        <div className="text-xs text-gray-400 mb-1">Phone</div>
                                                        <div className="text-sm text-gray-700">{contract.customerPhone}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-gray-400 mb-1">Email</div>
                                                        <div className="text-sm text-gray-700">{contract.customerEmail}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-gray-400 mb-1">Start Date</div>
                                                        <div className="text-sm text-gray-700">
                                                            {format(contract.startDate, 'MMM d, yyyy')}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-gray-400 mb-1">Last Service</div>
                                                        <div className="text-sm text-gray-700">
                                                            {contract.lastServiceDate
                                                                ? formatDistanceToNow(contract.lastServiceDate, { addSuffix: true })
                                                                : 'Never'}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            onSendReminder?.(contract)
                                                        }}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[#5f3bff] hover:bg-[#5f3bff]/10 rounded-lg transition-colors"
                                                    >
                                                        <Mail size={14} />
                                                        Send Reminder
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            window.location.href = `tel:${contract.customerPhone}`
                                                        }}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[#5f3bff] hover:bg-[#5f3bff]/10 rounded-lg transition-colors"
                                                    >
                                                        <Phone size={14} />
                                                        Call
                                                    </button>
                                                    <div className="flex-1" />
                                                    {contract.status !== 'renewed' && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                onMarkRenewed?.(contract)
                                                            }}
                                                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                                        >
                                                            <RefreshCw size={14} />
                                                            Mark Renewed
                                                        </button>
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

// Generate fake contracts
const FIRST_NAMES = ['John', 'Sarah', 'Mike', 'Emily', 'David', 'Lisa', 'Chris', 'Amanda', 'James', 'Jennifer']
const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez']
const PLAN_NAMES = [
    { name: 'Basic Maintenance', value: 199 },
    { name: 'Standard Care', value: 299 },
    { name: 'Premium Protection', value: 399 },
    { name: 'Ultimate Coverage', value: 599 },
]

export function generateFakeContracts(tenantId: string, count: number = 45): MaintenanceContract[] {
    const seed = tenantId.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
    const seededRandom = (offset: number) => {
        const x = Math.sin(seed + offset) * 10000
        return x - Math.floor(x)
    }

    const contracts: MaintenanceContract[] = []
    const now = new Date()

    for (let i = 0; i < count; i++) {
        const firstName = FIRST_NAMES[Math.floor(seededRandom(i * 10) * FIRST_NAMES.length)]
        const lastName = LAST_NAMES[Math.floor(seededRandom(i * 10 + 1) * LAST_NAMES.length)]
        const plan = PLAN_NAMES[Math.floor(seededRandom(i * 10 + 2) * PLAN_NAMES.length)]

        // Start date 1-3 years ago
        const startMonthsAgo = 12 + Math.floor(seededRandom(i * 10 + 3) * 24)
        const startDate = new Date(now)
        startDate.setMonth(startDate.getMonth() - startMonthsAgo)

        // Renewal date based on annual renewal
        const renewalDate = new Date(startDate)
        while (renewalDate < now) {
            renewalDate.setFullYear(renewalDate.getFullYear() + 1)
        }
        // Adjust so some are past due
        if (seededRandom(i * 10 + 4) < 0.2) {
            renewalDate.setMonth(renewalDate.getMonth() - Math.floor(seededRandom(i * 10 + 5) * 3))
        }

        const daysUntilRenewal = differenceInDays(renewalDate, now)
        let status: MaintenanceContract['status']
        if (seededRandom(i * 10 + 6) < 0.15) status = 'renewed'
        else if (daysUntilRenewal < 0) status = 'expired'
        else if (daysUntilRenewal < 30) status = 'expiring'
        else status = 'active'

        const lastServiceMonthsAgo = Math.floor(seededRandom(i * 10 + 7) * 8)
        const lastServiceDate = lastServiceMonthsAgo > 0 ? new Date(now) : null
        if (lastServiceDate) {
            lastServiceDate.setMonth(lastServiceDate.getMonth() - lastServiceMonthsAgo)
        }

        contracts.push({
            id: `contract-${i + 1}`,
            customerName: `${firstName} ${lastName}`,
            customerPhone: `555-${String(1000 + Math.floor(seededRandom(i * 10 + 8) * 9000)).padStart(4, '0')}`,
            customerEmail: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
            planName: plan.name,
            planValue: plan.value,
            startDate,
            renewalDate,
            status,
            lastServiceDate,
            remindersCount: status === 'expiring' || status === 'expired' ? Math.floor(seededRandom(i * 10 + 9) * 3) + 1 : 0,
        })
    }

    // Sort by renewal date
    return contracts.sort((a, b) => a.renewalDate.getTime() - b.renewalDate.getTime())
}
