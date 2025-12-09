'use client'

import React from 'react'
import { TrendingUp, Users, MessageSquare, DollarSign } from 'lucide-react'

interface LeadsSavedCounterProps {
    leadsSaved: number
    responseRate: number
    estimatedRevenue?: number
    period?: string
}

export default function LeadsSavedCounter({
    leadsSaved,
    responseRate,
    estimatedRevenue,
    period = 'this month',
}: LeadsSavedCounterProps) {
    return (
        <div className="bg-gradient-to-br from-[#5f3bff] to-[#4f2fe0] rounded-xl p-6 text-white shadow-xl shadow-[#5f3bff]/20">
            <div className="flex items-center gap-2 mb-4">
                <Users size={20} className="text-white/80" />
                <span className="text-sm font-medium text-white/80 uppercase tracking-wide">
                    Leads Saved
                </span>
            </div>

            <div className="text-6xl font-bold mb-2">
                {leadsSaved}
            </div>

            <div className="flex items-center gap-1 text-white/80 mb-6">
                <TrendingUp size={16} />
                <span className="text-sm">{period}</span>
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
                <div>
                    <div className="flex items-center gap-1.5 text-white/70 mb-1">
                        <MessageSquare size={14} />
                        <span className="text-xs uppercase tracking-wide">Response Rate</span>
                    </div>
                    <span className="text-2xl font-bold">{responseRate}%</span>
                </div>

                {estimatedRevenue !== undefined && (
                    <div>
                        <div className="flex items-center gap-1.5 text-white/70 mb-1">
                            <DollarSign size={14} />
                            <span className="text-xs uppercase tracking-wide">Est. Value</span>
                        </div>
                        <span className="text-2xl font-bold">
                            ${estimatedRevenue.toLocaleString()}
                        </span>
                    </div>
                )}
            </div>
        </div>
    )
}
