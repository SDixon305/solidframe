'use client'

import React, { useState } from 'react'
import { Calendar, Clock, Send, AlertCircle, CheckCircle, Zap } from 'lucide-react'
import { format, addDays, setHours, setMinutes } from 'date-fns'

interface ScheduleSendProps {
    recipientCount: number
    onSendNow?: () => void
    onSchedule?: (date: Date) => void
    disabled?: boolean
}

export default function ScheduleSend({
    recipientCount,
    onSendNow,
    onSchedule,
    disabled = false,
}: ScheduleSendProps) {
    const [scheduleType, setScheduleType] = useState<'now' | 'scheduled'>('now')
    const [selectedDate, setSelectedDate] = useState<string>(format(addDays(new Date(), 1), 'yyyy-MM-dd'))
    const [selectedTime, setSelectedTime] = useState<string>('09:00')
    const [showConfirmation, setShowConfirmation] = useState(false)

    const scheduledDateTime = (() => {
        const [hours, minutes] = selectedTime.split(':').map(Number)
        const date = new Date(selectedDate)
        return setMinutes(setHours(date, hours), minutes)
    })()

    const handleSend = () => {
        if (scheduleType === 'now') {
            onSendNow?.()
        } else {
            onSchedule?.(scheduledDateTime)
        }
        setShowConfirmation(true)
    }

    if (showConfirmation) {
        return (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={24} className="text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-emerald-900 mb-2">
                    {scheduleType === 'now' ? 'Campaign Sent!' : 'Campaign Scheduled!'}
                </h3>
                <p className="text-emerald-700 mb-4">
                    {scheduleType === 'now'
                        ? `Your campaign is being sent to ${recipientCount.toLocaleString()} recipients.`
                        : `Your campaign will be sent on ${format(scheduledDateTime, 'MMM d, yyyy')} at ${format(scheduledDateTime, 'h:mm a')}.`
                    }
                </p>
                <p className="text-sm text-emerald-600">
                    (Demo Mode - No actual messages were sent)
                </p>
            </div>
        )
    }

    return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">Send Campaign</h3>
                <p className="text-sm text-gray-500 mt-1">
                    Choose when to send to {recipientCount.toLocaleString()} recipients
                </p>
            </div>

            <div className="p-4 space-y-4">
                {/* Send now option */}
                <button
                    onClick={() => setScheduleType('now')}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                        scheduleType === 'now'
                            ? 'border-[#5f3bff] bg-[#5f3bff]/5'
                            : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                    <div className={`p-3 rounded-lg ${scheduleType === 'now' ? 'bg-[#5f3bff]' : 'bg-gray-100'}`}>
                        <Zap size={20} className={scheduleType === 'now' ? 'text-white' : 'text-gray-500'} />
                    </div>
                    <div className="flex-1">
                        <div className="font-medium text-gray-900">Send Immediately</div>
                        <div className="text-sm text-gray-500">Campaign will be sent right away</div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        scheduleType === 'now' ? 'border-[#5f3bff] bg-[#5f3bff]' : 'border-gray-300'
                    }`}>
                        {scheduleType === 'now' && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                </button>

                {/* Schedule option */}
                <button
                    onClick={() => setScheduleType('scheduled')}
                    className={`w-full flex items-start gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                        scheduleType === 'scheduled'
                            ? 'border-[#5f3bff] bg-[#5f3bff]/5'
                            : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                    <div className={`p-3 rounded-lg ${scheduleType === 'scheduled' ? 'bg-[#5f3bff]' : 'bg-gray-100'}`}>
                        <Calendar size={20} className={scheduleType === 'scheduled' ? 'text-white' : 'text-gray-500'} />
                    </div>
                    <div className="flex-1">
                        <div className="font-medium text-gray-900">Schedule for Later</div>
                        <div className="text-sm text-gray-500">Pick a date and time</div>

                        {scheduleType === 'scheduled' && (
                            <div className="flex gap-3 mt-3" onClick={(e) => e.stopPropagation()}>
                                <div className="relative">
                                    <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        min={format(new Date(), 'yyyy-MM-dd')}
                                        className="pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5f3bff]/20 focus:border-[#5f3bff]"
                                    />
                                </div>
                                <div className="relative">
                                    <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="time"
                                        value={selectedTime}
                                        onChange={(e) => setSelectedTime(e.target.value)}
                                        className="pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5f3bff]/20 focus:border-[#5f3bff]"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 ${
                        scheduleType === 'scheduled' ? 'border-[#5f3bff] bg-[#5f3bff]' : 'border-gray-300'
                    }`}>
                        {scheduleType === 'scheduled' && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                </button>

                {/* Demo warning */}
                <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-100 rounded-lg">
                    <AlertCircle size={16} className="text-amber-600 mt-0.5 shrink-0" />
                    <p className="text-sm text-amber-700">
                        <strong>Demo Mode:</strong> No actual messages will be sent. This is a preview of the campaign experience.
                    </p>
                </div>

                {/* Send button */}
                <button
                    onClick={handleSend}
                    disabled={disabled}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-[#5f3bff] text-white font-medium rounded-xl hover:bg-[#4f2fe0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Send size={18} />
                    {scheduleType === 'now' ? 'Send Now' : `Schedule for ${format(scheduledDateTime, 'MMM d')}`}
                </button>
            </div>
        </div>
    )
}

// Compact scheduled indicator
interface ScheduledBadgeProps {
    scheduledDate: Date
}

export function ScheduledBadge({ scheduledDate }: ScheduledBadgeProps) {
    return (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
            <Clock size={12} />
            <span>Scheduled for {format(scheduledDate, 'MMM d, h:mm a')}</span>
        </div>
    )
}
