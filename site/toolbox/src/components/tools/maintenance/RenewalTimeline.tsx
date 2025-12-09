'use client'

import React from 'react'
import { Calendar, AlertTriangle, CheckCircle, Clock, ChevronRight } from 'lucide-react'
import { format, differenceInDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isWithinInterval, addWeeks } from 'date-fns'
import { MaintenanceContract } from './ContractList'

interface RenewalTimelineProps {
    contracts: MaintenanceContract[]
    onContractClick?: (contract: MaintenanceContract) => void
}

export default function RenewalTimeline({ contracts, onContractClick }: RenewalTimelineProps) {
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    // Filter to upcoming and overdue renewals
    const relevantContracts = contracts.filter(c =>
        c.status !== 'renewed' &&
        differenceInDays(c.renewalDate, now) <= 90
    )

    // Group by time period
    const overdue = relevantContracts.filter(c => differenceInDays(c.renewalDate, now) < 0)
    const thisWeek = relevantContracts.filter(c => {
        const days = differenceInDays(c.renewalDate, now)
        return days >= 0 && days <= 7
    })
    const nextTwoWeeks = relevantContracts.filter(c => {
        const days = differenceInDays(c.renewalDate, now)
        return days > 7 && days <= 21
    })
    const thisMonth = relevantContracts.filter(c => {
        const days = differenceInDays(c.renewalDate, now)
        return days > 21 && days <= 30
    })
    const nextTwoMonths = relevantContracts.filter(c => {
        const days = differenceInDays(c.renewalDate, now)
        return days > 30 && days <= 90
    })

    const sections = [
        { title: 'Overdue', contracts: overdue, color: 'red', icon: AlertTriangle },
        { title: 'This Week', contracts: thisWeek, color: 'amber', icon: Clock },
        { title: 'Next 2 Weeks', contracts: nextTwoWeeks, color: 'blue', icon: Calendar },
        { title: 'This Month', contracts: thisMonth, color: 'gray', icon: Calendar },
        { title: 'Next 2 Months', contracts: nextTwoMonths, color: 'gray', icon: Calendar },
    ].filter(s => s.contracts.length > 0)

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Renewal Timeline</h3>

            {sections.length === 0 ? (
                <div className="text-center py-8">
                    <CheckCircle size={32} className="mx-auto text-emerald-400 mb-3" />
                    <p className="text-gray-500">No upcoming renewals in the next 90 days</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {sections.map((section) => {
                        const Icon = section.icon
                        const colorClasses = {
                            red: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: 'text-red-500' },
                            amber: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', icon: 'text-amber-500' },
                            blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', icon: 'text-blue-500' },
                            gray: { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700', icon: 'text-gray-400' },
                        }[section.color]!

                        return (
                            <div key={section.title}>
                                <div className="flex items-center gap-2 mb-3">
                                    <Icon size={16} className={colorClasses.icon} />
                                    <span className="text-sm font-medium text-gray-900">{section.title}</span>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colorClasses.bg} ${colorClasses.text}`}>
                                        {section.contracts.length}
                                    </span>
                                </div>

                                <div className="space-y-2">
                                    {section.contracts.slice(0, 5).map((contract) => (
                                        <button
                                            key={contract.id}
                                            onClick={() => onContractClick?.(contract)}
                                            className={`w-full flex items-center gap-3 p-3 rounded-lg border ${colorClasses.bg} ${colorClasses.border} hover:shadow-sm transition-shadow text-left`}
                                        >
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium text-gray-900 text-sm truncate">
                                                    {contract.customerName}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {contract.planName} · ${contract.planValue}/yr
                                                </div>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {format(contract.renewalDate, 'MMM d')}
                                                </div>
                                                <div className={`text-xs ${section.color === 'red' ? 'text-red-500' : 'text-gray-400'}`}>
                                                    {(() => {
                                                        const days = differenceInDays(contract.renewalDate, now)
                                                        if (days < 0) return `${Math.abs(days)}d overdue`
                                                        if (days === 0) return 'Today'
                                                        return `in ${days}d`
                                                    })()}
                                                </div>
                                            </div>
                                            <ChevronRight size={16} className="text-gray-400" />
                                        </button>
                                    ))}
                                    {section.contracts.length > 5 && (
                                        <div className="text-center py-2">
                                            <span className="text-sm text-gray-500">
                                                +{section.contracts.length - 5} more
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

// Compact timeline for overview
interface CompactTimelineProps {
    contracts: MaintenanceContract[]
}

export function CompactTimeline({ contracts }: CompactTimelineProps) {
    const now = new Date()

    const overdue = contracts.filter(c => c.status !== 'renewed' && differenceInDays(c.renewalDate, now) < 0).length
    const thisWeek = contracts.filter(c => {
        const days = differenceInDays(c.renewalDate, now)
        return c.status !== 'renewed' && days >= 0 && days <= 7
    }).length
    const thisMonth = contracts.filter(c => {
        const days = differenceInDays(c.renewalDate, now)
        return c.status !== 'renewed' && days > 7 && days <= 30
    }).length

    return (
        <div className="flex items-center gap-4">
            {overdue > 0 && (
                <div className="flex items-center gap-1.5 text-red-600">
                    <AlertTriangle size={14} />
                    <span className="text-sm font-medium">{overdue} overdue</span>
                </div>
            )}
            {thisWeek > 0 && (
                <div className="flex items-center gap-1.5 text-amber-600">
                    <Clock size={14} />
                    <span className="text-sm font-medium">{thisWeek} this week</span>
                </div>
            )}
            {thisMonth > 0 && (
                <div className="flex items-center gap-1.5 text-gray-500">
                    <Calendar size={14} />
                    <span className="text-sm font-medium">{thisMonth} this month</span>
                </div>
            )}
            {overdue === 0 && thisWeek === 0 && thisMonth === 0 && (
                <div className="flex items-center gap-1.5 text-emerald-600">
                    <CheckCircle size={14} />
                    <span className="text-sm font-medium">All caught up</span>
                </div>
            )}
        </div>
    )
}

// Calendar view for timeline
interface CalendarTimelineProps {
    contracts: MaintenanceContract[]
    weeksToShow?: number
}

export function CalendarTimeline({ contracts, weeksToShow = 4 }: CalendarTimelineProps) {
    const now = new Date()
    const startDate = startOfWeek(now, { weekStartsOn: 0 })
    const endDate = endOfWeek(addWeeks(now, weeksToShow - 1), { weekStartsOn: 0 })
    const days = eachDayOfInterval({ start: startDate, end: endDate })

    // Get contracts by date
    const getContractsForDay = (date: Date) =>
        contracts.filter(c =>
            c.status !== 'renewed' &&
            isSameDay(c.renewalDate, date)
        )

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Calendar View</h3>

            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-xs font-medium text-gray-400 py-1">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
                {days.map((day, index) => {
                    const dayContracts = getContractsForDay(day)
                    const isToday = isSameDay(day, now)
                    const isPast = day < now && !isToday

                    return (
                        <div
                            key={index}
                            className={`relative p-2 min-h-[60px] rounded-lg border ${
                                isToday
                                    ? 'border-[#5f3bff] bg-[#5f3bff]/5'
                                    : isPast
                                        ? 'border-gray-100 bg-gray-50'
                                        : 'border-gray-200'
                            }`}
                        >
                            <div className={`text-xs font-medium mb-1 ${
                                isToday ? 'text-[#5f3bff]' : isPast ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                                {format(day, 'd')}
                            </div>
                            {dayContracts.length > 0 && (
                                <div className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                                    isPast ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                                }`}>
                                    {dayContracts.length} renewal{dayContracts.length > 1 ? 's' : ''}
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
