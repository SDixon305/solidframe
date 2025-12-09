'use client'

import { useState, useEffect } from 'react'
import { useClient } from '../layout'
import { ToolActivationGrid } from '@/components/admin/ToolActivationGrid'
import type { DbTool } from '@/types/tools'
import type { TenantToolWithInfo } from '@/types/tenants'
import { createClient } from '@/utils/supabase/client'
import { Loader2, Info } from 'lucide-react'

// Mock tools for development
const mockTools: DbTool[] = [
    { id: '1', slug: 'after-hours-agent', name: 'After-Hours Agent', description: 'AI-powered voice agent that handles calls 24/7, captures emergency requests, and schedules callbacks.', icon: 'phone', category: 'voice', is_real: true, created_at: new Date().toISOString() },
    { id: '2', slug: 'missed-call-textback', name: 'Missed Call Textback', description: 'Automatically sends a friendly SMS when you miss a call, keeping leads warm.', icon: 'message-square', category: 'messaging', is_real: false, created_at: new Date().toISOString() },
    { id: '3', slug: 'review-request-bot', name: 'Review Request Bot', description: 'Automatically requests reviews from satisfied customers after service completion.', icon: 'star', category: 'marketing', is_real: false, created_at: new Date().toISOString() },
    { id: '4', slug: 'appointment-reminders', name: 'Appointment Reminders', description: 'Sends automated reminders via SMS and email to reduce no-shows.', icon: 'calendar', category: 'scheduling', is_real: false, created_at: new Date().toISOString() },
    { id: '5', slug: 'quote-reviver', name: 'Quote Reviver', description: 'Follows up on stale quotes automatically to win back potential customers.', icon: 'trending-up', category: 'marketing', is_real: false, created_at: new Date().toISOString() },
    { id: '6', slug: 'seasonal-campaigns', name: 'Seasonal Campaigns', description: 'Pre-built marketing campaigns for AC tune-ups, heating prep, and more.', icon: 'calendar', category: 'marketing', is_real: false, created_at: new Date().toISOString() },
    { id: '7', slug: 'maintenance-renewal', name: 'Maintenance Renewal', description: 'Automated outreach for maintenance contract renewals.', icon: 'wrench', category: 'automation', is_real: false, created_at: new Date().toISOString() },
    { id: '8', slug: 'tech-training', name: 'Tech Training Hub', description: 'Video training library for technicians with quizzes and certifications.', icon: 'wrench', category: 'automation', is_real: false, created_at: new Date().toISOString() },
]

// Mock tenant tools for development
const mockTenantTools: TenantToolWithInfo[] = [
    { id: '1', tenant_id: '1', tool_id: '1', is_active: true, version_id: null, activated_at: new Date().toISOString(), deactivated_at: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), tool: mockTools[0] },
    { id: '2', tenant_id: '1', tool_id: '3', is_active: true, version_id: null, activated_at: new Date().toISOString(), deactivated_at: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), tool: mockTools[2] },
    { id: '3', tenant_id: '1', tool_id: '4', is_active: true, version_id: null, activated_at: new Date().toISOString(), deactivated_at: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), tool: mockTools[3] },
    { id: '4', tenant_id: '1', tool_id: '5', is_active: true, version_id: null, activated_at: new Date().toISOString(), deactivated_at: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), tool: mockTools[4] },
]

export default function ClientToolsPage() {
    const { client, refresh } = useClient()
    const [tools, setTools] = useState<DbTool[]>([])
    const [tenantTools, setTenantTools] = useState<TenantToolWithInfo[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function loadTools() {
            if (!client) return

            setIsLoading(true)

            try {
                const supabase = createClient()

                // Load all tools
                const { data: toolsData, error: toolsError } = await supabase
                    .from('tools')
                    .select('*')
                    .order('name')

                if (toolsError) {
                    console.warn('Supabase error loading tools, using mock data:', toolsError)
                    setTools(mockTools)
                } else {
                    setTools(toolsData as DbTool[] || mockTools)
                }

                // Load tenant's tool activations
                const { data: tenantToolsData, error: tenantToolsError } = await supabase
                    .from('tenant_tools')
                    .select('*, tool:tools(*)')
                    .eq('tenant_id', client.id)

                if (tenantToolsError) {
                    console.warn('Supabase error loading tenant tools, using mock data:', tenantToolsError)
                    setTenantTools(mockTenantTools)
                } else {
                    setTenantTools(tenantToolsData as TenantToolWithInfo[] || mockTenantTools)
                }
            } catch (err) {
                console.error('Error loading tools:', err)
                setTools(mockTools)
                setTenantTools(mockTenantTools)
            } finally {
                setIsLoading(false)
            }
        }

        loadTools()
    }, [client])

    const handleToggle = async (toolId: string, isActive: boolean) => {
        if (!client) return

        try {
            const supabase = createClient()

            // Check if tenant_tool record exists
            const existingTenantTool = tenantTools.find(tt => tt.tool_id === toolId)

            if (existingTenantTool) {
                // Update existing record
                const { error } = await supabase
                    .from('tenant_tools')
                    .update({
                        is_active: isActive,
                        activated_at: isActive ? new Date().toISOString() : null,
                        deactivated_at: !isActive ? new Date().toISOString() : null,
                        updated_at: new Date().toISOString(),
                    })
                    .eq('id', existingTenantTool.id)

                if (error) {
                    console.error('Error updating tenant tool:', error)
                    // Optimistic update anyway for demo
                }
            } else {
                // Create new record
                const { error } = await supabase
                    .from('tenant_tools')
                    .insert({
                        tenant_id: client.id,
                        tool_id: toolId,
                        is_active: isActive,
                        activated_at: isActive ? new Date().toISOString() : null,
                    })

                if (error) {
                    console.error('Error creating tenant tool:', error)
                    // Optimistic update anyway for demo
                }
            }

            // Optimistic update
            setTenantTools(prev => {
                const existing = prev.find(tt => tt.tool_id === toolId)
                const tool = tools.find(t => t.id === toolId)

                if (existing) {
                    return prev.map(tt =>
                        tt.tool_id === toolId
                            ? {
                                ...tt,
                                is_active: isActive,
                                activated_at: isActive ? new Date().toISOString() : tt.activated_at,
                                deactivated_at: !isActive ? new Date().toISOString() : null,
                            }
                            : tt
                    )
                } else if (tool) {
                    return [
                        ...prev,
                        {
                            id: `temp-${toolId}`,
                            tenant_id: client.id,
                            tool_id: toolId,
                            is_active: isActive,
                            version_id: null,
                            activated_at: isActive ? new Date().toISOString() : null,
                            deactivated_at: null,
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString(),
                            tool,
                        },
                    ]
                }
                return prev
            })

            // Refresh parent to update tool count
            refresh()
        } catch (err) {
            console.error('Error toggling tool:', err)
        }
    }

    if (!client) {
        return null
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
            </div>
        )
    }

    const activeCount = tenantTools.filter(tt => tt.is_active).length
    const realActiveCount = tenantTools.filter(tt => tt.is_active && tt.tool?.is_real).length

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Tool Activation</h2>
                    <p className="text-sm text-gray-500">
                        {activeCount} of {tools.length} tools active
                        {realActiveCount > 0 && ` (${realActiveCount} live)`}
                    </p>
                </div>
            </div>

            {/* Info Banner */}
            <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                    <p className="font-medium">About Tool Status</p>
                    <p className="mt-1 text-blue-700">
                        Tools marked as <span className="font-semibold">LIVE</span> are fully implemented and operational.
                        Other tools are in development and will show demo/placeholder content.
                    </p>
                </div>
            </div>

            {/* Tool Grid */}
            <ToolActivationGrid
                tools={tools}
                tenantTools={tenantTools}
                onToggle={handleToggle}
            />
        </div>
    )
}
