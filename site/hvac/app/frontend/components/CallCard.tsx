'use client'

import { Phone, MapPin, Clock, AlertCircle, CheckCircle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface Call {
    id: string
    customer_name?: string
    customer_phone?: string
    customer_address?: string
    issue_description?: string
    priority_level: 'emergency' | 'standard'
    status: string
    created_at: string
    duration_seconds?: number
}

interface CallCardProps {
    call: Call
    onClick?: () => void
}

export default function CallCard({ call, onClick }: CallCardProps) {
    const isEmergency = call.priority_level === 'emergency'

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
            case 'accepted':
                return 'text-green-600 bg-green-100'
            case 'dispatched':
                return 'text-blue-600 bg-blue-100'
            case 'escalated':
                return 'text-orange-600 bg-orange-100'
            case 'missed':
                return 'text-gray-600 bg-gray-100'
            default:
                return 'text-yellow-600 bg-yellow-100'
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
            case 'accepted':
                return <CheckCircle className="w-4 h-4" />
            case 'escalated':
                return <AlertCircle className="w-4 h-4" />
            default:
                return <Clock className="w-4 h-4" />
        }
    }

    return (
        <div
            onClick={onClick}
            className={`
        bg-white rounded-lg shadow-md p-6 border-l-4 cursor-pointer
        transition-all hover:shadow-lg
        ${isEmergency ? 'border-red-500' : 'border-blue-500'}
      `}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={`
            p-2 rounded-lg
            ${isEmergency ? 'bg-red-100' : 'bg-blue-100'}
          `}>
                        <Phone className={`
              w-5 h-5
              ${isEmergency ? 'text-red-600' : 'text-blue-600'}
            `} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">
                            {call.customer_name || 'Unknown Caller'}
                        </h3>
                        <p className="text-sm text-gray-500">
                            {call.created_at ? formatDistanceToNow(new Date(call.created_at), { addSuffix: true }) : 'Just now'}
                        </p>
                    </div>
                </div>

                {/* Priority Badge */}
                <div className={`
          px-3 py-1 rounded-full text-xs font-semibold
          ${isEmergency ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}
        `}>
                    {isEmergency ? '🚨 EMERGENCY' : '📋 STANDARD'}
                </div>
            </div>

            {/* Call Details */}
            <div className="space-y-2 mb-4">
                {call.customer_phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span>{call.customer_phone}</span>
                    </div>
                )}

                {call.customer_address && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{call.customer_address}</span>
                    </div>
                )}

                {call.issue_description && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">
                            {call.issue_description}
                        </p>
                    </div>
                )}
            </div>

            {/* Status */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className={`
          flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium
          ${getStatusColor(call.status)}
        `}>
                    {getStatusIcon(call.status)}
                    <span className="capitalize">{call.status}</span>
                </div>

                {call.duration_seconds && (
                    <div className="text-xs text-gray-500">
                        Duration: {Math.floor(call.duration_seconds / 60)}m {call.duration_seconds % 60}s
                    </div>
                )}
            </div>
        </div>
    )
}
