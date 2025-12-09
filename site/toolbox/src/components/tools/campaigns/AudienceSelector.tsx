'use client'

import React, { useState } from 'react'
import { Users, CheckSquare, Square, ChevronDown, ChevronUp, Filter, Search } from 'lucide-react'

export interface AudienceSegment {
    id: string
    name: string
    description: string
    count: number
    tags: string[]
}

interface AudienceSelectorProps {
    segments: AudienceSegment[]
    selectedSegments: string[]
    onSelectionChange: (segmentIds: string[]) => void
    totalCustomers: number
}

export default function AudienceSelector({
    segments,
    selectedSegments,
    onSelectionChange,
    totalCustomers,
}: AudienceSelectorProps) {
    const [searchTerm, setSearchTerm] = useState('')
    const [isExpanded, setIsExpanded] = useState(true)

    const filteredSegments = segments.filter(segment =>
        segment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        segment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        segment.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    const selectedCount = selectedSegments.length === 0
        ? totalCustomers
        : segments
            .filter(s => selectedSegments.includes(s.id))
            .reduce((sum, s) => sum + s.count, 0)

    const toggleSegment = (segmentId: string) => {
        if (selectedSegments.includes(segmentId)) {
            onSelectionChange(selectedSegments.filter(id => id !== segmentId))
        } else {
            onSelectionChange([...selectedSegments, segmentId])
        }
    }

    const selectAll = () => {
        onSelectionChange([])
    }

    const isAllSelected = selectedSegments.length === 0

    return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {/* Header */}
            <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#5f3bff]/10 rounded-lg">
                        <Users size={18} className="text-[#5f3bff]" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">Target Audience</h3>
                        <p className="text-sm text-gray-500">
                            {isAllSelected ? 'All customers' : `${selectedSegments.length} segment${selectedSegments.length === 1 ? '' : 's'} selected`}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">{selectedCount.toLocaleString()}</div>
                        <div className="text-xs text-gray-400">recipients</div>
                    </div>
                    {isExpanded ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                </div>
            </div>

            {/* Expanded content */}
            {isExpanded && (
                <div className="border-t border-gray-100 p-4">
                    {/* Search */}
                    <div className="relative mb-4">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search segments..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5f3bff]/20 focus:border-[#5f3bff]"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>

                    {/* All customers option */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            selectAll()
                        }}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg mb-2 transition-colors ${
                            isAllSelected
                                ? 'bg-[#5f3bff]/10 border border-[#5f3bff]/30'
                                : 'bg-gray-50 border border-gray-100 hover:border-gray-200'
                        }`}
                    >
                        {isAllSelected ? (
                            <CheckSquare size={18} className="text-[#5f3bff]" />
                        ) : (
                            <Square size={18} className="text-gray-400" />
                        )}
                        <div className="flex-1 text-left">
                            <div className="font-medium text-gray-900">All Customers</div>
                            <div className="text-sm text-gray-500">Send to everyone in your list</div>
                        </div>
                        <div className="text-sm font-medium text-gray-500">{totalCustomers.toLocaleString()}</div>
                    </button>

                    <div className="text-xs text-gray-400 mb-2 mt-4">Or select specific segments:</div>

                    {/* Segments list */}
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                        {filteredSegments.map((segment) => {
                            const isSelected = selectedSegments.includes(segment.id)

                            return (
                                <button
                                    key={segment.id}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        toggleSegment(segment.id)
                                    }}
                                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                                        isSelected
                                            ? 'bg-[#5f3bff]/10 border border-[#5f3bff]/30'
                                            : 'bg-gray-50 border border-gray-100 hover:border-gray-200'
                                    }`}
                                >
                                    {isSelected ? (
                                        <CheckSquare size={18} className="text-[#5f3bff]" />
                                    ) : (
                                        <Square size={18} className="text-gray-400" />
                                    )}
                                    <div className="flex-1 text-left">
                                        <div className="font-medium text-gray-900">{segment.name}</div>
                                        <div className="text-sm text-gray-500">{segment.description}</div>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {segment.tags.map(tag => (
                                                <span
                                                    key={tag}
                                                    className="px-1.5 py-0.5 text-xs bg-gray-200 text-gray-600 rounded"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="text-sm font-medium text-gray-500">{segment.count.toLocaleString()}</div>
                                </button>
                            )
                        })}
                    </div>

                    {filteredSegments.length === 0 && (
                        <div className="text-center py-8 text-gray-400">
                            <Filter size={24} className="mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No segments match your search</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

// Compact audience display
interface CompactAudienceProps {
    selectedCount: number
    totalCount: number
}

export function CompactAudience({ selectedCount, totalCount }: CompactAudienceProps) {
    return (
        <div className="flex items-center gap-2 text-sm">
            <Users size={14} className="text-gray-400" />
            <span className="text-gray-600">
                {selectedCount === totalCount ? 'All customers' : `${selectedCount.toLocaleString()} of ${totalCount.toLocaleString()}`}
            </span>
        </div>
    )
}

// Default audience segments
export const DEFAULT_AUDIENCE_SEGMENTS: AudienceSegment[] = [
    {
        id: 'past-customers',
        name: 'Past Service Customers',
        description: 'Customers who have had service in the last 12 months',
        count: 634,
        tags: ['service', 'recent'],
    },
    {
        id: 'maintenance-members',
        name: 'Maintenance Plan Members',
        description: 'Active maintenance agreement holders',
        count: 187,
        tags: ['member', 'maintenance'],
    },
    {
        id: 'no-maintenance',
        name: 'No Maintenance Plan',
        description: 'Customers without an active maintenance plan',
        count: 892,
        tags: ['upsell', 'opportunity'],
    },
    {
        id: 'equipment-over-10',
        name: 'Equipment 10+ Years Old',
        description: 'Potential replacement candidates',
        count: 312,
        tags: ['replacement', 'upsell'],
    },
    {
        id: 'emergency-calls',
        name: 'Emergency Call History',
        description: 'Customers who have had emergency service',
        count: 156,
        tags: ['emergency', 'priority'],
    },
    {
        id: 'new-customers',
        name: 'New Customers (30 days)',
        description: 'Recently acquired customers',
        count: 43,
        tags: ['new', 'onboarding'],
    },
]
