// Fake data generation utilities for client portal
// Generates time-based metrics that grow over time to feel realistic

// Tool slugs and their display names
export const CLIENT_TOOLS = [
    { slug: 'after-hours-agent', name: 'After Hours AI Agent', isReal: true },
    { slug: 'missed-call-textback', name: 'Missed Call Text-Back', isReal: false },
    { slug: 'review-request', name: 'Review Request Bot', isReal: false },
    { slug: 'appointment-reminders', name: 'Appointment Reminders', isReal: false },
    { slug: 'quote-reviver', name: 'Quote Reviver', isReal: false },
    { slug: 'seasonal-campaigns', name: 'Seasonal Campaigns', isReal: false },
    { slug: 'maintenance-renewal', name: 'Maintenance Renewal', isReal: false },
    { slug: 'tech-training', name: 'Tech Training', isReal: false },
] as const

export type ToolSlug = typeof CLIENT_TOOLS[number]['slug']

// Tool icon mappings
export const TOOL_ICONS: Record<ToolSlug, string> = {
    'after-hours-agent': 'phone',
    'missed-call-textback': 'message-square',
    'review-request': 'star',
    'appointment-reminders': 'calendar',
    'quote-reviver': 'dollar-sign',
    'seasonal-campaigns': 'megaphone',
    'maintenance-renewal': 'refresh-cw',
    'tech-training': 'graduation-cap',
}

// Tool descriptions
export const TOOL_DESCRIPTIONS: Record<ToolSlug, string> = {
    'after-hours-agent': 'AI voice agent handles calls 24/7 with intelligent triage and dispatch.',
    'missed-call-textback': 'Automatically text back customers who call when you can\'t answer.',
    'review-request': 'Send automated review requests after completed jobs.',
    'appointment-reminders': 'Reduce no-shows with smart appointment reminders.',
    'quote-reviver': 'Follow up on stale quotes to recover lost revenue.',
    'seasonal-campaigns': 'Send targeted campaigns for seasonal promotions.',
    'maintenance-renewal': 'Alert customers when maintenance contracts are due.',
    'tech-training': 'Train technicians with AI-powered scenarios.',
}

// Helper to get days since a date
function daysSince(date: Date): number {
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

// Seeded random number generator for consistent fake data
function seededRandom(seed: number): () => number {
    return () => {
        seed = (seed * 9301 + 49297) % 233280
        return seed / 233280
    }
}

// Generate a random variance
function randomVariance(base: number, pct: number, random: () => number): number {
    const variance = base * (pct / 100)
    return Math.round(base + (random() - 0.5) * 2 * variance)
}

// Tool metrics interface
export interface ToolMetrics {
    primary: {
        label: string
        value: number | string
        trend?: 'up' | 'down' | 'stable'
        trendValue?: string
    }
    secondary?: {
        label: string
        value: number | string
    }
}

// Generate fake metrics based on tenant creation date and tool
export function generateToolMetrics(
    tenantCreatedAt: Date,
    toolSlug: ToolSlug,
    tenantId: string = 'default'
): ToolMetrics {
    const days = daysSince(tenantCreatedAt)
    // Create a seed from tenant ID and tool slug for consistent results
    const seed = (tenantId + toolSlug).split('').reduce((a, b) => a + b.charCodeAt(0), 0)
    const random = seededRandom(seed)

    const baseGrowth = Math.floor(days * 1.2)

    switch (toolSlug) {
        case 'after-hours-agent':
            return {
                primary: {
                    label: 'Calls Handled',
                    value: randomVariance(baseGrowth * 3, 15, random),
                    trend: 'up',
                    trendValue: '+12%',
                },
                secondary: {
                    label: 'Avg Duration',
                    value: `${randomVariance(180, 20, random)}s`,
                },
            }

        case 'missed-call-textback':
            return {
                primary: {
                    label: 'Leads Saved',
                    value: randomVariance(baseGrowth, 20, random),
                    trend: 'up',
                    trendValue: '+8%',
                },
                secondary: {
                    label: 'Response Rate',
                    value: `${randomVariance(94, 5, random)}%`,
                },
            }

        case 'review-request':
            return {
                primary: {
                    label: 'Reviews Collected',
                    value: randomVariance(Math.floor(baseGrowth * 0.4), 15, random),
                    trend: 'up',
                    trendValue: '+15%',
                },
                secondary: {
                    label: 'Avg Rating',
                    value: (4.5 + random() * 0.4).toFixed(1),
                },
            }

        case 'appointment-reminders':
            return {
                primary: {
                    label: 'Reminders Sent',
                    value: randomVariance(baseGrowth * 2, 10, random),
                    trend: 'stable',
                },
                secondary: {
                    label: 'Confirmation Rate',
                    value: `${randomVariance(92, 5, random)}%`,
                },
            }

        case 'quote-reviver':
            return {
                primary: {
                    label: 'Revenue Recovered',
                    value: `$${(randomVariance(baseGrowth * 150, 25, random)).toLocaleString()}`,
                    trend: 'up',
                    trendValue: '+23%',
                },
                secondary: {
                    label: 'Quotes Revived',
                    value: randomVariance(Math.floor(baseGrowth * 0.3), 20, random),
                },
            }

        case 'seasonal-campaigns':
            return {
                primary: {
                    label: 'Campaigns Sent',
                    value: randomVariance(Math.floor(days / 14), 30, random),
                    trend: 'stable',
                },
                secondary: {
                    label: 'Open Rate',
                    value: `${randomVariance(38, 15, random)}%`,
                },
            }

        case 'maintenance-renewal':
            return {
                primary: {
                    label: 'Renewals Secured',
                    value: randomVariance(Math.floor(baseGrowth * 0.2), 20, random),
                    trend: 'up',
                    trendValue: '+18%',
                },
                secondary: {
                    label: 'Renewal Rate',
                    value: `${randomVariance(87, 8, random)}%`,
                },
            }

        case 'tech-training':
            return {
                primary: {
                    label: 'Modules Completed',
                    value: randomVariance(Math.floor(baseGrowth * 0.5), 25, random),
                    trend: 'up',
                    trendValue: '+5%',
                },
                secondary: {
                    label: 'Avg Score',
                    value: `${randomVariance(88, 8, random)}%`,
                },
            }

        default:
            return {
                primary: {
                    label: 'Activity',
                    value: randomVariance(baseGrowth, 20, random),
                },
            }
    }
}

// Activity log entry
export interface ActivityLogEntry {
    id: string
    timestamp: Date
    type: 'success' | 'info' | 'warning'
    message: string
    details?: string
}

// First names for fake data
const FIRST_NAMES = [
    'John', 'Sarah', 'Mike', 'Emily', 'David', 'Lisa', 'Chris', 'Amanda',
    'James', 'Jennifer', 'Robert', 'Michelle', 'William', 'Ashley', 'Thomas',
    'Jessica', 'Daniel', 'Nicole', 'Matthew', 'Stephanie', 'Andrew', 'Rachel',
]

// Last names for fake data
const LAST_NAMES = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller',
    'Davis', 'Rodriguez', 'Martinez', 'Wilson', 'Anderson', 'Taylor', 'Thomas',
    'Moore', 'Jackson', 'Martin', 'Lee', 'Thompson', 'White', 'Harris', 'Clark',
]

// Generate fake activity log for a tool
export function generateActivityLog(
    tenantCreatedAt: Date,
    toolSlug: ToolSlug,
    tenantId: string = 'default',
    count: number = 15
): ActivityLogEntry[] {
    const seed = (tenantId + toolSlug + 'activity').split('').reduce((a, b) => a + b.charCodeAt(0), 0)
    const random = seededRandom(seed)

    const entries: ActivityLogEntry[] = []
    const now = new Date()

    for (let i = 0; i < count; i++) {
        // Random timestamp within last 30 days
        const daysAgo = Math.floor(random() * 30)
        const hoursAgo = Math.floor(random() * 24)
        const timestamp = new Date(now)
        timestamp.setDate(timestamp.getDate() - daysAgo)
        timestamp.setHours(timestamp.getHours() - hoursAgo)

        // Don't generate activity before tenant was created
        if (timestamp < tenantCreatedAt) continue

        const firstName = FIRST_NAMES[Math.floor(random() * FIRST_NAMES.length)]
        const lastName = LAST_NAMES[Math.floor(random() * LAST_NAMES.length)]
        const phone = `555-${String(Math.floor(random() * 10000)).padStart(4, '0')}`

        const entry = generateActivityEntry(toolSlug, firstName, lastName, phone, random, i)
        entries.push({
            ...entry,
            id: `${toolSlug}-${i}-${timestamp.getTime()}`,
            timestamp,
        })
    }

    // Sort by timestamp descending
    return entries.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}

function generateActivityEntry(
    toolSlug: ToolSlug,
    firstName: string,
    lastName: string,
    phone: string,
    random: () => number,
    index: number
): Omit<ActivityLogEntry, 'id' | 'timestamp'> {
    const successRate = 0.85

    switch (toolSlug) {
        case 'after-hours-agent':
            const callTypes = ['Scheduling request', 'Emergency call', 'General inquiry', 'Service follow-up']
            const callType = callTypes[Math.floor(random() * callTypes.length)]
            return {
                type: random() < successRate ? 'success' : 'info',
                message: `${callType} from ${firstName} ${lastName}`,
                details: `Duration: ${Math.floor(random() * 180 + 60)}s`,
            }

        case 'missed-call-textback':
            return {
                type: random() < successRate ? 'success' : 'info',
                message: `Auto-texted ${firstName} at ${phone}`,
                details: random() < 0.6 ? 'Customer responded' : undefined,
            }

        case 'review-request':
            const rating = Math.floor(random() * 2) + 4 // 4-5 stars
            return {
                type: 'success',
                message: `${firstName} ${lastName} left a ${rating}-star review`,
                details: random() < 0.7 ? '"Great service!"' : undefined,
            }

        case 'appointment-reminders':
            return {
                type: random() < 0.92 ? 'success' : 'warning',
                message: `Reminder sent to ${firstName} ${lastName}`,
                details: random() < 0.92 ? 'Confirmed' : 'No response',
            }

        case 'quote-reviver':
            const amount = Math.floor(random() * 3000) + 500
            return {
                type: random() < 0.3 ? 'success' : 'info',
                message: random() < 0.3
                    ? `${firstName} ${lastName} accepted $${amount.toLocaleString()} quote`
                    : `Follow-up sent for $${amount.toLocaleString()} quote`,
            }

        case 'seasonal-campaigns':
            return {
                type: 'info',
                message: `Campaign delivered to ${firstName} ${lastName}`,
                details: random() < 0.4 ? 'Opened' : undefined,
            }

        case 'maintenance-renewal':
            return {
                type: random() < 0.87 ? 'success' : 'warning',
                message: `${firstName} ${lastName} renewal ${random() < 0.87 ? 'confirmed' : 'pending'}`,
                details: `Contract #${1000 + index}`,
            }

        case 'tech-training':
            const modules = ['Safety Basics', 'Customer Service', 'HVAC Fundamentals', 'Electrical Safety']
            const module = modules[Math.floor(random() * modules.length)]
            return {
                type: 'success',
                message: `${firstName} completed "${module}"`,
                details: `Score: ${Math.floor(random() * 20) + 80}%`,
            }

        default:
            return {
                type: 'info',
                message: `Activity from ${firstName} ${lastName}`,
            }
    }
}

// Generate a display-ready tool object for the client portal
export interface ClientTool {
    id: string
    slug: ToolSlug
    name: string
    description: string
    icon: string
    isReal: boolean
    isActive: boolean
    metrics: ToolMetrics
}

export function generateClientTools(
    tenantCreatedAt: Date,
    tenantId: string,
    activeSlugs: ToolSlug[] = CLIENT_TOOLS.map(t => t.slug)
): ClientTool[] {
    return CLIENT_TOOLS.map(tool => ({
        id: `tool-${tool.slug}`,
        slug: tool.slug,
        name: tool.name,
        description: TOOL_DESCRIPTIONS[tool.slug],
        icon: TOOL_ICONS[tool.slug],
        isReal: tool.isReal,
        isActive: activeSlugs.includes(tool.slug),
        metrics: generateToolMetrics(tenantCreatedAt, tool.slug, tenantId),
    }))
}
