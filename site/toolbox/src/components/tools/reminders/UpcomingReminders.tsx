'use client'

import React from 'react'
import { Calendar, Clock, User, MapPin, CheckCircle, AlertCircle } from 'lucide-react'
import { format, isToday, isTomorrow, addDays } from 'date-fns'

export interface UpcomingAppointment {
    id: string
    customerName: string
    serviceType: string
    date: Date
    time: string
    address?: string
    reminderSent: boolean
    confirmed: boolean
}

interface UpcomingRemindersProps {
    appointments: UpcomingAppointment[]
    maxDisplay?: number
}

export default function UpcomingReminders({
    appointments,
    maxDisplay = 10,
}: UpcomingRemindersProps) {
    const displayAppointments = appointments.slice(0, maxDisplay)

    const getDateLabel = (date: Date) => {
        if (isToday(date)) return 'Today'
        if (isTomorrow(date)) return 'Tomorrow'
        return format(date, 'EEE, MMM d')
    }

    const getDateColor = (date: Date) => {
        if (isToday(date)) return 'bg-red-100 text-red-700'
        if (isTomorrow(date)) return 'bg-amber-100 text-amber-700'
        return 'bg-gray-100 text-gray-700'
    }

    if (appointments.length === 0) {
        return (
            <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
                <Calendar size={32} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 text-sm">No upcoming appointments</p>
            </div>
        )
    }

    return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Upcoming Reminders</h3>
                <span className="text-sm text-gray-500">
                    {appointments.length} scheduled
                </span>
            </div>

            <div className="divide-y divide-gray-100">
                {displayAppointments.map((apt) => (
                    <div
                        key={apt.id}
                        className="p-4 hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex items-start gap-4">
                            {/* Date Badge */}
                            <div className={`px-3 py-2 rounded-lg text-center min-w-[80px] ${getDateColor(apt.date)}`}>
                                <div className="text-xs font-medium uppercase">
                                    {getDateLabel(apt.date)}
                                </div>
                                <div className="text-lg font-bold">
                                    {apt.time}
                                </div>
                            </div>

                            {/* Details */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <User size={14} className="text-gray-400" />
                                    <span className="font-medium text-gray-900">
                                        {apt.customerName}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-600 mb-1">
                                    {apt.serviceType}
                                </div>
                                {apt.address && (
                                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                        <MapPin size={12} />
                                        <span className="truncate">{apt.address}</span>
                                    </div>
                                )}
                            </div>

                            {/* Status */}
                            <div className="flex flex-col items-end gap-1">
                                {apt.reminderSent && (
                                    <span className="flex items-center gap-1 text-xs text-blue-600">
                                        <Clock size={12} />
                                        Reminder sent
                                    </span>
                                )}
                                {apt.confirmed ? (
                                    <span className="flex items-center gap-1 text-xs text-emerald-600">
                                        <CheckCircle size={12} />
                                        Confirmed
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 text-xs text-gray-400">
                                        <AlertCircle size={12} />
                                        Pending
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {appointments.length > maxDisplay && (
                <div className="p-3 border-t border-gray-100 bg-gray-50 text-center">
                    <span className="text-sm text-gray-500">
                        +{appointments.length - maxDisplay} more appointments
                    </span>
                </div>
            )}
        </div>
    )
}
