'use client'

import React, { useState } from 'react'
import { Mail, Eye, MousePointer, Users, Calendar, ChevronDown, MoreHorizontal, Copy, Trash2 } from 'lucide-react'
import { format, formatDistanceToNow } from 'date-fns'

export interface CampaignHistoryItem {
    id: string
    name: string
    subject: string
    sentAt: Date
    recipientCount: number
    openRate: number
    clickRate: number
    status: 'sent' | 'scheduled' | 'draft'
}

interface CampaignHistoryProps {
    campaigns: CampaignHistoryItem[]
    onDuplicate?: (campaign: CampaignHistoryItem) => void
    onDelete?: (campaign: CampaignHistoryItem) => void
}

export default function CampaignHistory({ campaigns, onDuplicate, onDelete }: CampaignHistoryProps) {
    const [expandedCampaign, setExpandedCampaign] = useState<string | null>(null)

    const getStatusConfig = (status: CampaignHistoryItem['status']) => {
        switch (status) {
            case 'sent':
                return { label: 'Sent', color: 'bg-emerald-100 text-emerald-700' }
            case 'scheduled':
                return { label: 'Scheduled', color: 'bg-blue-100 text-blue-700' }
            case 'draft':
                return { label: 'Draft', color: 'bg-gray-100 text-gray-700' }
        }
    }

    if (campaigns.length === 0) {
        return (
            <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
                <Mail size={32} className="mx-auto text-gray-300 mb-3" />
                <h3 className="font-medium text-gray-900 mb-1">No campaigns yet</h3>
                <p className="text-sm text-gray-500">Your campaign history will appear here</p>
            </div>
        )
    }

    return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="divide-y divide-gray-100">
                {campaigns.map((campaign) => {
                    const isExpanded = expandedCampaign === campaign.id
                    const statusConfig = getStatusConfig(campaign.status)

                    return (
                        <div key={campaign.id} className="hover:bg-gray-50 transition-colors">
                            {/* Campaign row */}
                            <div
                                className="flex items-center gap-4 p-4 cursor-pointer"
                                onClick={() => setExpandedCampaign(isExpanded ? null : campaign.id)}
                            >
                                {/* Icon */}
                                <div className="p-2 bg-[#5f3bff]/10 rounded-lg shrink-0">
                                    <Mail size={18} className="text-[#5f3bff]" />
                                </div>

                                {/* Campaign info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-medium text-gray-900 truncate">{campaign.name}</h4>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                                            {statusConfig.label}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 truncate">{campaign.subject}</p>
                                </div>

                                {/* Stats */}
                                {campaign.status === 'sent' && (
                                    <div className="hidden md:flex items-center gap-6">
                                        <div className="text-center">
                                            <div className="flex items-center gap-1 text-sm font-medium text-gray-900">
                                                <Eye size={14} className="text-gray-400" />
                                                {campaign.openRate}%
                                            </div>
                                            <div className="text-xs text-gray-400">Opens</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="flex items-center gap-1 text-sm font-medium text-gray-900">
                                                <MousePointer size={14} className="text-gray-400" />
                                                {campaign.clickRate}%
                                            </div>
                                            <div className="text-xs text-gray-400">Clicks</div>
                                        </div>
                                    </div>
                                )}

                                {/* Date */}
                                <div className="text-right shrink-0">
                                    <div className="text-sm text-gray-900">
                                        {format(campaign.sentAt, 'MMM d, yyyy')}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        {formatDistanceToNow(campaign.sentAt, { addSuffix: true })}
                                    </div>
                                </div>

                                {/* Expand indicator */}
                                <ChevronDown
                                    size={16}
                                    className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                />
                            </div>

                            {/* Expanded details */}
                            {isExpanded && (
                                <div className="px-4 pb-4">
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        {/* Stats grid */}
                                        <div className="grid grid-cols-4 gap-4 mb-4">
                                            <div className="text-center p-3 bg-white rounded-lg">
                                                <div className="flex items-center justify-center gap-1 text-lg font-bold text-gray-900">
                                                    <Users size={16} className="text-gray-400" />
                                                    {campaign.recipientCount.toLocaleString()}
                                                </div>
                                                <div className="text-xs text-gray-500">Recipients</div>
                                            </div>
                                            <div className="text-center p-3 bg-white rounded-lg">
                                                <div className="flex items-center justify-center gap-1 text-lg font-bold text-gray-900">
                                                    <Mail size={16} className="text-gray-400" />
                                                    {Math.round(campaign.recipientCount * 0.95).toLocaleString()}
                                                </div>
                                                <div className="text-xs text-gray-500">Delivered</div>
                                            </div>
                                            <div className="text-center p-3 bg-white rounded-lg">
                                                <div className="flex items-center justify-center gap-1 text-lg font-bold text-emerald-600">
                                                    <Eye size={16} />
                                                    {campaign.openRate}%
                                                </div>
                                                <div className="text-xs text-gray-500">Open Rate</div>
                                            </div>
                                            <div className="text-center p-3 bg-white rounded-lg">
                                                <div className="flex items-center justify-center gap-1 text-lg font-bold text-blue-600">
                                                    <MousePointer size={16} />
                                                    {campaign.clickRate}%
                                                </div>
                                                <div className="text-xs text-gray-500">Click Rate</div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    onDuplicate?.(campaign)
                                                }}
                                                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[#5f3bff] hover:bg-[#5f3bff]/10 rounded-lg transition-colors"
                                            >
                                                <Copy size={14} />
                                                Duplicate
                                            </button>
                                            <div className="flex-1" />
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    onDelete?.(campaign)
                                                }}
                                                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={14} />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

// Summary stats for overview
interface CampaignStatsProps {
    totalCampaigns: number
    avgOpenRate: number
    avgClickRate: number
    totalRecipients: number
}

export function CampaignStats({ totalCampaigns, avgOpenRate, avgClickRate, totalRecipients }: CampaignStatsProps) {
    return (
        <div className="grid grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="text-2xl font-bold text-gray-900">{totalCampaigns}</div>
                <div className="text-sm text-gray-500">Total Campaigns</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="text-2xl font-bold text-gray-900">{totalRecipients.toLocaleString()}</div>
                <div className="text-sm text-gray-500">Total Sent</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="text-2xl font-bold text-emerald-600">{avgOpenRate}%</div>
                <div className="text-sm text-gray-500">Avg Open Rate</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="text-2xl font-bold text-blue-600">{avgClickRate}%</div>
                <div className="text-sm text-gray-500">Avg Click Rate</div>
            </div>
        </div>
    )
}

// Generate fake campaign history
export function generateCampaignHistory(tenantId: string): CampaignHistoryItem[] {
    const seed = tenantId.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
    const seededRandom = (offset: number) => {
        const x = Math.sin(seed + offset) * 10000
        return x - Math.floor(x)
    }

    const now = new Date()
    const campaigns: CampaignHistoryItem[] = []

    const templates = [
        { name: 'Spring AC Tune-Up Special', subject: '🌸 Spring AC Tune-Up Special - $89' },
        { name: 'Summer Cooling Check', subject: '☀️ Beat the Heat - AC Check Special' },
        { name: 'Fall Heating Prep', subject: '🍂 Fall Heating System Check' },
    ]

    templates.forEach((template, index) => {
        const daysAgo = 30 + index * 45 + Math.floor(seededRandom(index * 10) * 15)
        const sentAt = new Date(now)
        sentAt.setDate(sentAt.getDate() - daysAgo)

        campaigns.push({
            id: `campaign-${index + 1}`,
            name: template.name,
            subject: template.subject,
            sentAt,
            recipientCount: 800 + Math.floor(seededRandom(index * 10 + 1) * 500),
            openRate: 32 + Math.floor(seededRandom(index * 10 + 2) * 15),
            clickRate: 8 + Math.floor(seededRandom(index * 10 + 3) * 8),
            status: 'sent',
        })
    })

    return campaigns.sort((a, b) => b.sentAt.getTime() - a.sentAt.getTime())
}
