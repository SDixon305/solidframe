'use client'

import React, { useState } from 'react'
import { Phone, Clock, AlertTriangle, CheckCircle, ChevronRight, Play, Search, Filter } from 'lucide-react'
import { formatDistanceToNow, format } from 'date-fns'

export interface CallRecord {
    id: string
    callerName: string
    callerPhone: string
    timestamp: Date
    duration: number // seconds
    type: 'scheduling' | 'emergency' | 'inquiry' | 'followup'
    outcome: 'booked' | 'dispatched' | 'callback' | 'resolved' | 'voicemail'
    transcript?: string
    hasRecording?: boolean
}

interface CallHistoryProps {
    calls: CallRecord[]
    onPlayRecording?: (callId: string) => void
    maxDisplay?: number
}

export default function CallHistory({ calls, onPlayRecording, maxDisplay }: CallHistoryProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [filterType, setFilterType] = useState<string | null>(null)
    const [expandedCall, setExpandedCall] = useState<string | null>(null)

    const displayCalls = calls
        .filter(call => {
            if (searchQuery) {
                const query = searchQuery.toLowerCase()
                return (
                    call.callerName.toLowerCase().includes(query) ||
                    call.callerPhone.includes(query)
                )
            }
            return true
        })
        .filter(call => {
            if (filterType) return call.type === filterType
            return true
        })
        .slice(0, maxDisplay)

    const typeConfig = {
        scheduling: { label: 'Scheduling', color: 'bg-blue-50 text-blue-700 border-blue-200' },
        emergency: { label: 'Emergency', color: 'bg-red-50 text-red-700 border-red-200' },
        inquiry: { label: 'Inquiry', color: 'bg-gray-50 text-gray-700 border-gray-200' },
        followup: { label: 'Follow-up', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    }

    const outcomeConfig = {
        booked: { icon: CheckCircle, color: 'text-emerald-500' },
        dispatched: { icon: AlertTriangle, color: 'text-red-500' },
        callback: { icon: Clock, color: 'text-amber-500' },
        resolved: { icon: CheckCircle, color: 'text-blue-500' },
        voicemail: { icon: Phone, color: 'text-gray-400' },
    }

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {/* Header with Search & Filter */}
            <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search calls..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5f3bff]/20 focus:border-[#5f3bff]"
                    />
                </div>
                <div className="relative">
                    <select
                        value={filterType || ''}
                        onChange={(e) => setFilterType(e.target.value || null)}
                        className="appearance-none pl-9 pr-8 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5f3bff]/20 focus:border-[#5f3bff] bg-white"
                    >
                        <option value="">All Types</option>
                        <option value="scheduling">Scheduling</option>
                        <option value="emergency">Emergency</option>
                        <option value="inquiry">Inquiry</option>
                        <option value="followup">Follow-up</option>
                    </select>
                    <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
            </div>

            {/* Call List */}
            <div className="divide-y divide-gray-100">
                {displayCalls.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        <Phone size={32} className="mx-auto text-gray-300 mb-3" />
                        <p className="text-sm">No calls found</p>
                    </div>
                ) : (
                    displayCalls.map((call) => {
                        const type = typeConfig[call.type]
                        const outcome = outcomeConfig[call.outcome]
                        const OutcomeIcon = outcome.icon
                        const isExpanded = expandedCall === call.id

                        return (
                            <div key={call.id}>
                                <button
                                    onClick={() => setExpandedCall(isExpanded ? null : call.id)}
                                    className="w-full p-4 hover:bg-gray-50 transition-colors text-left"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-lg ${
                                            call.type === 'emergency' ? 'bg-red-100' : 'bg-gray-100'
                                        }`}>
                                            <Phone size={16} className={
                                                call.type === 'emergency' ? 'text-red-500' : 'text-gray-500'
                                            } />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-medium text-gray-900">
                                                    {call.callerName}
                                                </span>
                                                <span className={`px-2 py-0.5 text-xs font-medium rounded border ${type.color}`}>
                                                    {type.label}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-gray-500">
                                                <span>{call.callerPhone}</span>
                                                <span>•</span>
                                                <span>{formatDuration(call.duration)}</span>
                                                <span>•</span>
                                                <span>{formatDistanceToNow(call.timestamp, { addSuffix: true })}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-1.5">
                                                <OutcomeIcon size={14} className={outcome.color} />
                                                <span className="text-sm text-gray-600 capitalize">
                                                    {call.outcome}
                                                </span>
                                            </div>
                                            <ChevronRight
                                                size={16}
                                                className={`text-gray-400 transition-transform ${
                                                    isExpanded ? 'rotate-90' : ''
                                                }`}
                                            />
                                        </div>
                                    </div>
                                </button>

                                {/* Expanded Content */}
                                {isExpanded && (
                                    <div className="px-4 pb-4 bg-gray-50">
                                        <div className="pl-10">
                                            {/* Recording playback */}
                                            {call.hasRecording && onPlayRecording && (
                                                <button
                                                    onClick={() => onPlayRecording(call.id)}
                                                    className="flex items-center gap-2 px-4 py-2 mb-3 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                                >
                                                    <Play size={14} />
                                                    Play Recording
                                                </button>
                                            )}

                                            {/* Transcript */}
                                            {call.transcript && (
                                                <div className="p-4 bg-white rounded-lg border border-gray-200">
                                                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                                                        Transcript
                                                    </h4>
                                                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                                        {call.transcript}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Timestamp */}
                                            <div className="mt-3 text-xs text-gray-400">
                                                {format(call.timestamp, 'EEEE, MMMM d, yyyy \'at\' h:mm a')}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}
