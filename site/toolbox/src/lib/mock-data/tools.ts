// Mock data for admin tool management UI
// This will be replaced with API calls in production

import type { DbTool, DbToolVersion, ToolWithVersion } from '@/types/tools'

// Mock tools (8 tools as specified)
export const mockTools: DbTool[] = [
    {
        id: 'tool-1',
        slug: 'roi-calculator',
        name: 'ROI Calculator',
        description: 'Calculate potential revenue impact and ROI projections for prospects',
        icon: 'calculator',
        category: 'marketing',
        is_real: true,
        created_at: '2024-01-15T00:00:00Z',
    },
    {
        id: 'tool-2',
        slug: 'voice-agent',
        name: 'Voice Agent',
        description: 'AI-powered voice receptionist for handling inbound calls',
        icon: 'mic',
        category: 'voice',
        is_real: true,
        created_at: '2024-01-20T00:00:00Z',
    },
    {
        id: 'tool-3',
        slug: 'lead-scraper',
        name: 'Lead Scraper',
        description: 'Find and enrich leads from public sources',
        icon: 'scraper',
        category: 'automation',
        is_real: false,
        created_at: '2024-02-01T00:00:00Z',
    },
    {
        id: 'tool-4',
        slug: 'review-requester',
        name: 'Review Requester',
        description: 'Automatically send review requests to satisfied customers',
        icon: 'star',
        category: 'messaging',
        is_real: false,
        created_at: '2024-02-10T00:00:00Z',
    },
    {
        id: 'tool-5',
        slug: 'competitor-analysis',
        name: 'Competitor Analysis',
        description: 'Analyze competitor reviews, pricing, and market position',
        icon: 'search',
        category: 'marketing',
        is_real: false,
        created_at: '2024-02-15T00:00:00Z',
    },
    {
        id: 'tool-6',
        slug: 'call-dashboard',
        name: 'Call Dashboard',
        description: 'Real-time view of incoming calls with transcripts and analytics',
        icon: 'chart',
        category: 'voice',
        is_real: true,
        created_at: '2024-03-01T00:00:00Z',
    },
    {
        id: 'tool-7',
        slug: 'training-hub',
        name: 'Training Hub',
        description: 'AI-powered training scenarios for technician onboarding',
        icon: 'star',
        category: 'automation',
        is_real: false,
        created_at: '2024-03-10T00:00:00Z',
    },
    {
        id: 'tool-8',
        slug: 'appointment-scheduler',
        name: 'Appointment Scheduler',
        description: 'Let customers book appointments through the voice agent',
        icon: 'toggle',
        category: 'scheduling',
        is_real: false,
        created_at: '2024-03-15T00:00:00Z',
    },
]

// Mock versions for each tool
export const mockVersions: Record<string, DbToolVersion[]> = {
    'tool-1': [
        {
            id: 'ver-1-1',
            tool_id: 'tool-1',
            version: '1.0.0',
            config_schema: {
                type: 'object',
                properties: {
                    callsPerWeek: { type: 'number', default: 150 },
                    avgTicket: { type: 'number', default: 350 },
                    missedCallRate: { type: 'number', default: 0.35 },
                },
                default: { callsPerWeek: 150, avgTicket: 350, missedCallRate: 0.35 },
            },
            status: 'deprecated',
            rollout_pct: 100,
            changelog: 'Initial release',
            created_at: '2024-01-15T00:00:00Z',
        },
        {
            id: 'ver-1-2',
            tool_id: 'tool-1',
            version: '1.1.0',
            config_schema: {
                type: 'object',
                properties: {
                    callsPerWeek: { type: 'number', default: 150 },
                    avgTicket: { type: 'number', default: 350 },
                    missedCallRate: { type: 'number', default: 0.35 },
                    businessName: { type: 'string', default: '' },
                },
                default: { callsPerWeek: 150, avgTicket: 350, missedCallRate: 0.35, businessName: '' },
            },
            status: 'production',
            rollout_pct: 100,
            changelog: 'Added business name customization',
            created_at: '2024-02-01T00:00:00Z',
        },
        {
            id: 'ver-1-3',
            tool_id: 'tool-1',
            version: '1.2.0',
            config_schema: {
                type: 'object',
                properties: {
                    callsPerWeek: { type: 'number', default: 150 },
                    avgTicket: { type: 'number', default: 350 },
                    missedCallRate: { type: 'number', default: 0.35 },
                    businessName: { type: 'string', default: '' },
                    industry: { type: 'string', default: 'hvac' },
                },
                default: { callsPerWeek: 150, avgTicket: 350, missedCallRate: 0.35, businessName: '', industry: 'hvac' },
            },
            status: 'staging',
            rollout_pct: 0,
            changelog: 'Added industry-specific calculations',
            created_at: '2024-03-01T00:00:00Z',
        },
        {
            id: 'ver-1-4',
            tool_id: 'tool-1',
            version: '1.3.0',
            config_schema: {
                type: 'object',
                properties: {
                    callsPerWeek: { type: 'number', default: 150 },
                    avgTicket: { type: 'number', default: 350 },
                    missedCallRate: { type: 'number', default: 0.35 },
                    businessName: { type: 'string', default: '' },
                    industry: { type: 'string', default: 'hvac' },
                    showProjections: { type: 'boolean', default: true },
                },
                default: { callsPerWeek: 150, avgTicket: 350, missedCallRate: 0.35, businessName: '', industry: 'hvac', showProjections: true },
            },
            status: 'draft',
            rollout_pct: 0,
            changelog: 'New projection chart toggle',
            created_at: '2024-03-15T00:00:00Z',
        },
    ],
    'tool-2': [
        {
            id: 'ver-2-1',
            tool_id: 'tool-2',
            version: '1.0.0',
            config_schema: {
                type: 'object',
                properties: {
                    greeting: { type: 'string', default: 'Hello, thank you for calling!' },
                    voiceId: { type: 'string', default: 'rachel' },
                    maxCallDuration: { type: 'number', default: 300 },
                },
                default: { greeting: 'Hello, thank you for calling!', voiceId: 'rachel', maxCallDuration: 300 },
            },
            status: 'production',
            rollout_pct: 75,
            changelog: 'Initial voice agent release',
            created_at: '2024-01-20T00:00:00Z',
        },
        {
            id: 'ver-2-2',
            tool_id: 'tool-2',
            version: '1.1.0',
            config_schema: {
                type: 'object',
                properties: {
                    greeting: { type: 'string', default: 'Hello, thank you for calling!' },
                    voiceId: { type: 'string', default: 'rachel' },
                    maxCallDuration: { type: 'number', default: 300 },
                    emergencyKeywords: { type: 'array', default: ['emergency', 'urgent', 'leak'] },
                },
                default: { greeting: 'Hello, thank you for calling!', voiceId: 'rachel', maxCallDuration: 300, emergencyKeywords: ['emergency', 'urgent', 'leak'] },
            },
            status: 'draft',
            rollout_pct: 0,
            changelog: 'Added emergency keyword detection',
            created_at: '2024-03-01T00:00:00Z',
        },
    ],
    'tool-3': [
        {
            id: 'ver-3-1',
            tool_id: 'tool-3',
            version: '1.0.0',
            config_schema: {
                type: 'object',
                properties: {
                    sources: { type: 'array', default: ['google', 'yelp'] },
                    maxLeads: { type: 'number', default: 100 },
                },
                default: { sources: ['google', 'yelp'], maxLeads: 100 },
            },
            status: 'production',
            rollout_pct: 100,
            changelog: 'Initial release',
            created_at: '2024-02-01T00:00:00Z',
        },
    ],
    'tool-4': [
        {
            id: 'ver-4-1',
            tool_id: 'tool-4',
            version: '1.0.0',
            config_schema: {
                type: 'object',
                properties: {
                    template: { type: 'string', default: 'Hi {name}, thanks for choosing us!' },
                    delayHours: { type: 'number', default: 24 },
                },
                default: { template: 'Hi {name}, thanks for choosing us!', delayHours: 24 },
            },
            status: 'production',
            rollout_pct: 100,
            changelog: 'Initial release',
            created_at: '2024-02-10T00:00:00Z',
        },
    ],
    'tool-5': [
        {
            id: 'ver-5-1',
            tool_id: 'tool-5',
            version: '1.0.0',
            config_schema: {
                type: 'object',
                properties: {
                    radius: { type: 'number', default: 25 },
                    competitors: { type: 'number', default: 5 },
                },
                default: { radius: 25, competitors: 5 },
            },
            status: 'production',
            rollout_pct: 100,
            changelog: 'Initial release',
            created_at: '2024-02-15T00:00:00Z',
        },
    ],
    'tool-6': [
        {
            id: 'ver-6-1',
            tool_id: 'tool-6',
            version: '1.0.0',
            config_schema: {
                type: 'object',
                properties: {
                    refreshInterval: { type: 'number', default: 5000 },
                    showTranscripts: { type: 'boolean', default: true },
                },
                default: { refreshInterval: 5000, showTranscripts: true },
            },
            status: 'production',
            rollout_pct: 100,
            changelog: 'Initial release',
            created_at: '2024-03-01T00:00:00Z',
        },
    ],
    'tool-7': [
        {
            id: 'ver-7-1',
            tool_id: 'tool-7',
            version: '1.0.0',
            config_schema: {
                type: 'object',
                properties: {
                    scenarios: { type: 'array', default: ['basic', 'emergency'] },
                },
                default: { scenarios: ['basic', 'emergency'] },
            },
            status: 'draft',
            rollout_pct: 0,
            changelog: 'Initial draft',
            created_at: '2024-03-10T00:00:00Z',
        },
    ],
    'tool-8': [
        {
            id: 'ver-8-1',
            tool_id: 'tool-8',
            version: '1.0.0',
            config_schema: {
                type: 'object',
                properties: {
                    availableSlots: { type: 'number', default: 10 },
                    bookingWindow: { type: 'number', default: 14 },
                },
                default: { availableSlots: 10, bookingWindow: 14 },
            },
            status: 'production',
            rollout_pct: 50,
            changelog: 'Initial release with limited rollout',
            created_at: '2024-03-15T00:00:00Z',
        },
    ],
}

// Mock tenant counts per tool
export const mockTenantCounts: Record<string, number> = {
    'tool-1': 8,
    'tool-2': 12,
    'tool-3': 5,
    'tool-4': 7,
    'tool-5': 4,
    'tool-6': 12,
    'tool-7': 0,
    'tool-8': 3,
}

// Helper functions to get mock data
export function getMockTools(): ToolWithVersion[] {
    return mockTools.map(tool => {
        const versions = mockVersions[tool.id] || []
        const productionVersion = versions.find(v => v.status === 'production') || null
        const stagingVersion = versions.find(v => v.status === 'staging') || null
        return {
            ...tool,
            active_version: productionVersion,
            staging_version: stagingVersion,
        }
    })
}

export function getMockTool(slug: string): ToolWithVersion | null {
    const tool = mockTools.find(t => t.slug === slug)
    if (!tool) return null
    const versions = mockVersions[tool.id] || []
    const productionVersion = versions.find(v => v.status === 'production') || null
    const stagingVersion = versions.find(v => v.status === 'staging') || null
    return {
        ...tool,
        active_version: productionVersion,
        staging_version: stagingVersion,
    }
}

export function getMockVersions(toolId: string): DbToolVersion[] {
    return mockVersions[toolId] || []
}

export function getMockTenantCount(toolId: string): number {
    return mockTenantCounts[toolId] || 0
}
