'use client'

import React from 'react'
import { CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react'

interface ConfirmationRateProps {
    rate: number
    confirmed: number
    noResponse: number
    cancelled: number
    trend?: number
}

export default function ConfirmationRate({
    rate,
    confirmed,
    noResponse,
    cancelled,
    trend,
}: ConfirmationRateProps) {
    const total = confirmed + noResponse + cancelled

    return (
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white shadow-xl shadow-emerald-500/20">
            {/* Main Rate */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <div className="text-sm font-medium text-white/80 uppercase tracking-wide mb-1">
                        Confirmation Rate
                    </div>
                    <div className="text-6xl font-bold">
                        {rate}%
                    </div>
                </div>
                {trend !== undefined && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-white/20 rounded-full text-sm">
                        <TrendingUp size={14} />
                        +{trend}%
                    </div>
                )}
            </div>

            {/* Breakdown */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/20">
                <div className="text-center">
                    <div className="flex items-center justify-center gap-1.5 text-white/80 mb-1">
                        <CheckCircle size={14} />
                    </div>
                    <div className="text-2xl font-bold">{confirmed}</div>
                    <div className="text-xs text-white/70">Confirmed</div>
                </div>
                <div className="text-center">
                    <div className="flex items-center justify-center gap-1.5 text-white/80 mb-1">
                        <Clock size={14} />
                    </div>
                    <div className="text-2xl font-bold">{noResponse}</div>
                    <div className="text-xs text-white/70">No Response</div>
                </div>
                <div className="text-center">
                    <div className="flex items-center justify-center gap-1.5 text-white/80 mb-1">
                        <XCircle size={14} />
                    </div>
                    <div className="text-2xl font-bold">{cancelled}</div>
                    <div className="text-xs text-white/70">Cancelled</div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden flex">
                <div
                    className="bg-white rounded-full"
                    style={{ width: `${(confirmed / total) * 100}%` }}
                />
                <div
                    className="bg-white/50"
                    style={{ width: `${(noResponse / total) * 100}%` }}
                />
            </div>
        </div>
    )
}
