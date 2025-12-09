// Alert types for the SolidFrame admin portal

// Alert types - the specific event that triggered the alert
export type AlertType =
    | 'client.created'
    | 'client.onboarded'
    | 'client.first_call'
    | 'billing.payment_received'
    | 'billing.payment_failed'
    | 'billing.subscription_cancelled'
    | 'tool.error'
    | 'tool.deployed'
    | 'usage.threshold'
    | 'system.error'

// Alert severity levels
export type AlertSeverity = 'info' | 'success' | 'warning' | 'error'

// Alert categories (derived from type prefix)
export type AlertCategory = 'client' | 'billing' | 'tool' | 'usage' | 'system'

// Alert record from the database (alerts table)
export interface DbAlert {
    id: string
    type: AlertType
    severity: AlertSeverity
    title: string
    message: string
    tenant_id: string | null
    metadata: Record<string, unknown> | null
    is_read: boolean
    created_at: string
}

// Alert with tenant info (for display)
export interface AlertWithTenant extends DbAlert {
    tenant?: {
        id: string
        name: string
        slug: string
    } | null
}

// Create alert request
export interface CreateAlertRequest {
    type: AlertType
    title: string
    message: string
    tenant_id?: string
    metadata?: Record<string, unknown>
}

// Alert filters for querying
export interface AlertFilters {
    category?: AlertCategory
    severity?: AlertSeverity
    is_read?: boolean
    limit?: number
    offset?: number
}

// Map alert type to category
export function getAlertCategory(type: AlertType): AlertCategory {
    const prefix = type.split('.')[0]
    return prefix as AlertCategory
}

// Map alert type to default severity
export function getDefaultSeverity(type: AlertType): AlertSeverity {
    const severityMap: Record<AlertType, AlertSeverity> = {
        'client.created': 'info',
        'client.onboarded': 'info',
        'client.first_call': 'success',
        'billing.payment_received': 'success',
        'billing.payment_failed': 'error',
        'billing.subscription_cancelled': 'warning',
        'tool.error': 'error',
        'tool.deployed': 'info',
        'usage.threshold': 'warning',
        'system.error': 'error',
    }
    return severityMap[type]
}

// Severity color classes for UI
export const severityColors: Record<AlertSeverity, { text: string; bg: string; border: string; icon: string }> = {
    info: {
        text: 'text-blue-700',
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        icon: 'text-blue-500',
    },
    success: {
        text: 'text-emerald-700',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        icon: 'text-emerald-500',
    },
    warning: {
        text: 'text-amber-700',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        icon: 'text-amber-500',
    },
    error: {
        text: 'text-red-700',
        bg: 'bg-red-50',
        border: 'border-red-200',
        icon: 'text-red-500',
    },
}

// Category labels for UI
export const categoryLabels: Record<AlertCategory, string> = {
    client: 'Client',
    billing: 'Billing',
    tool: 'Tool',
    usage: 'Usage',
    system: 'System',
}

// Severity labels for UI
export const severityLabels: Record<AlertSeverity, string> = {
    info: 'Info',
    success: 'Success',
    warning: 'Warning',
    error: 'Error',
}
