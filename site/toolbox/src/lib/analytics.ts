// Analytics data generation and types
// Generates realistic fake data for platform-wide analytics dashboard

import { CLIENT_TOOLS, type ToolSlug } from './fake-data'

// Types for analytics data
export interface AnalyticsOverview {
    totalClients: { value: number; trend: number }
    mrr: { value: number; trend: number }
    actionsThisMonth: { value: number; trend: number }
    activeTools: { value: number; total: number }
}

export interface UsageDataPoint {
    date: string
    calls: number
    sms: number
    appointments: number
}

export interface ClientUsageRow {
    id: string
    name: string
    slug: string
    calls: number
    sms: number
    appointments: number
    lastActive: string
    status: 'active' | 'suspended' | 'pending'
}

export interface ToolUsageData {
    slug: string
    name: string
    usage: number
    icon: string
}

export interface PaymentRecord {
    id: string
    clientName: string
    amount: number
    date: string
    status: 'succeeded' | 'pending' | 'failed'
}

export interface RevenueData {
    mrr: number
    mrrTrend: number
    totalRevenue: number
    recentPayments: PaymentRecord[]
}

export interface AnalyticsData {
    overview: AnalyticsOverview
    usageTimeSeries: UsageDataPoint[]
    clientBreakdown: ClientUsageRow[]
    toolUsage: ToolUsageData[]
    revenue: RevenueData
}

// Seeded random number generator for consistent fake data
function seededRandom(seed: number): () => number {
    return () => {
        seed = (seed * 9301 + 49297) % 233280
        return seed / 233280
    }
}

// Generate random variance around a base value
function randomVariance(base: number, pct: number, random: () => number): number {
    const variance = base * (pct / 100)
    return Math.round(base + (random() - 0.5) * 2 * variance)
}

// Format date as YYYY-MM-DD
function formatDate(date: Date): string {
    return date.toISOString().split('T')[0]
}

// Sample client names for fake data
const SAMPLE_CLIENTS = [
    { name: 'Comfort Air HVAC', slug: 'comfort-air' },
    { name: 'Pro Plumbing Solutions', slug: 'pro-plumbing' },
    { name: 'Elite Electric', slug: 'elite-electric' },
    { name: 'Premier Roofing Co', slug: 'premier-roofing' },
    { name: 'All Seasons Heating', slug: 'all-seasons' },
    { name: 'Quick Fix Plumbing', slug: 'quick-fix' },
    { name: 'Bright Spark Electric', slug: 'bright-spark' },
    { name: 'Cool Breeze AC', slug: 'cool-breeze' },
    { name: 'Summit Roofing', slug: 'summit-roofing' },
    { name: 'First Call HVAC', slug: 'first-call' },
    { name: 'Metro Plumbers', slug: 'metro-plumbers' },
    { name: 'Reliable Electric', slug: 'reliable-electric' },
]

// Tool icons mapping
const TOOL_ICONS: Record<string, string> = {
    'after-hours-agent': 'phone',
    'missed-call-textback': 'message-square',
    'review-request': 'star',
    'appointment-reminders': 'calendar',
    'quote-reviver': 'dollar-sign',
    'seasonal-campaigns': 'megaphone',
    'maintenance-renewal': 'refresh-cw',
    'tech-training': 'graduation-cap',
}

// Generate overview metrics
export function generateAnalyticsOverview(seed: number = 12345): AnalyticsOverview {
    const random = seededRandom(seed)

    return {
        totalClients: {
            value: randomVariance(12, 20, random),
            trend: randomVariance(8, 50, random),
        },
        mrr: {
            value: randomVariance(4200, 15, random),
            trend: randomVariance(12, 30, random),
        },
        actionsThisMonth: {
            value: randomVariance(1847, 20, random),
            trend: randomVariance(15, 40, random),
        },
        activeTools: {
            value: 6,
            total: 8,
        },
    }
}

// Generate usage time series data
export function generateUsageTimeSeries(days: number = 30, seed: number = 54321): UsageDataPoint[] {
    const random = seededRandom(seed)
    const data: UsageDataPoint[] = []
    const now = new Date()

    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now)
        date.setDate(date.getDate() - i)

        // Add some weekly patterns - lower on weekends
        const dayOfWeek = date.getDay()
        const weekendMultiplier = (dayOfWeek === 0 || dayOfWeek === 6) ? 0.6 : 1

        // Add a general upward trend
        const trendMultiplier = 1 + (days - i) * 0.01

        data.push({
            date: formatDate(date),
            calls: Math.round(randomVariance(45, 30, random) * weekendMultiplier * trendMultiplier),
            sms: Math.round(randomVariance(120, 25, random) * weekendMultiplier * trendMultiplier),
            appointments: Math.round(randomVariance(25, 35, random) * weekendMultiplier * trendMultiplier),
        })
    }

    return data
}

// Generate client breakdown data
export function generateClientBreakdown(seed: number = 98765): ClientUsageRow[] {
    const random = seededRandom(seed)
    const now = new Date()

    return SAMPLE_CLIENTS.map((client, index) => {
        // Generate a random last active date within last 7 days
        const daysAgo = Math.floor(random() * 7)
        const lastActive = new Date(now)
        lastActive.setDate(lastActive.getDate() - daysAgo)

        // Most clients are active, few suspended/pending
        let status: 'active' | 'suspended' | 'pending' = 'active'
        if (index === SAMPLE_CLIENTS.length - 1) status = 'pending'
        if (index === SAMPLE_CLIENTS.length - 2) status = 'suspended'

        return {
            id: `tenant-${index + 1}`,
            name: client.name,
            slug: client.slug,
            calls: randomVariance(150, 40, random),
            sms: randomVariance(400, 35, random),
            appointments: randomVariance(80, 45, random),
            lastActive: formatDate(lastActive),
            status,
        }
    }).sort((a, b) => b.calls - a.calls) // Sort by calls descending
}

// Generate tool usage data
export function generateToolUsage(seed: number = 11111): ToolUsageData[] {
    const random = seededRandom(seed)

    // Base usage values for each tool (After Hours Agent highest)
    const baseUsage: Record<ToolSlug, number> = {
        'after-hours-agent': 2400,
        'missed-call-textback': 1800,
        'appointment-reminders': 1500,
        'review-request': 900,
        'quote-reviver': 600,
        'seasonal-campaigns': 300,
        'maintenance-renewal': 450,
        'tech-training': 200,
    }

    return CLIENT_TOOLS.map(tool => ({
        slug: tool.slug,
        name: tool.name,
        usage: randomVariance(baseUsage[tool.slug], 20, random),
        icon: TOOL_ICONS[tool.slug] || 'tool',
    })).sort((a, b) => b.usage - a.usage)
}

// Generate revenue data
export function generateRevenueData(seed: number = 22222): RevenueData {
    const random = seededRandom(seed)
    const now = new Date()

    // Generate recent payments
    const payments: PaymentRecord[] = SAMPLE_CLIENTS.slice(0, 5).map((client, index) => {
        const daysAgo = Math.floor(random() * 14)
        const paymentDate = new Date(now)
        paymentDate.setDate(paymentDate.getDate() - daysAgo)

        return {
            id: `pay-${index + 1}`,
            clientName: client.name,
            amount: randomVariance(350, 30, random),
            date: formatDate(paymentDate),
            status: (random() > 0.1 ? 'succeeded' : 'pending') as 'pending' | 'succeeded' | 'failed',
        }
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return {
        mrr: randomVariance(4200, 10, random),
        mrrTrend: randomVariance(12, 40, random),
        totalRevenue: randomVariance(42000, 15, random),
        recentPayments: payments,
    }
}

// Generate all analytics data at once
export function generateAnalyticsData(days: number = 30, seed: number = Date.now()): AnalyticsData {
    return {
        overview: generateAnalyticsOverview(seed),
        usageTimeSeries: generateUsageTimeSeries(days, seed + 1),
        clientBreakdown: generateClientBreakdown(seed + 2),
        toolUsage: generateToolUsage(seed + 3),
        revenue: generateRevenueData(seed + 4),
    }
}

// Fetch analytics from API or generate fake data
export async function fetchAnalytics(range: 7 | 30 | 90 = 30): Promise<AnalyticsData> {
    try {
        const response = await fetch(`/api/admin/analytics?range=${range}`)
        if (!response.ok) throw new Error('Failed to fetch analytics')
        const data = await response.json()
        if (data.success) return data.data
        throw new Error(data.error)
    } catch {
        // Fall back to generated data
        return generateAnalyticsData(range)
    }
}
