// Alert trigger functions
// Call these from webhooks, flows, error handlers to create alerts

import { createClient } from '@/utils/supabase/server'
import type { AlertType, DbAlert, getDefaultSeverity } from '@/types/alerts'

// Core function to create an alert
export async function createAlert(
    type: AlertType,
    title: string,
    message: string,
    tenantId?: string,
    metadata?: Record<string, unknown>
): Promise<DbAlert | null> {
    const supabase = await createClient()

    // Get default severity for this alert type
    const severityMap: Record<AlertType, 'info' | 'success' | 'warning' | 'error'> = {
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

    const severity = severityMap[type]

    const { data: alert, error } = await supabase
        .from('alerts')
        .insert({
            type,
            severity,
            title,
            message,
            tenant_id: tenantId || null,
            metadata: metadata || null,
            is_read: false,
        })
        .select()
        .single()

    if (error) {
        console.error('Error creating alert:', error)
        return null
    }

    return alert
}

// Helper: Client created
export async function alertClientCreated(
    tenantId: string,
    tenantName: string
): Promise<DbAlert | null> {
    return createAlert(
        'client.created',
        'New client created',
        `${tenantName} has been added to the platform.`,
        tenantId,
        { tenant_name: tenantName }
    )
}

// Helper: Client onboarded (completed wizard)
export async function alertClientOnboarded(
    tenantId: string,
    tenantName: string
): Promise<DbAlert | null> {
    return createAlert(
        'client.onboarded',
        'Client completed onboarding',
        `${tenantName} has completed the onboarding wizard.`,
        tenantId,
        { tenant_name: tenantName }
    )
}

// Helper: Client first call handled
export async function alertClientFirstCall(
    tenantId: string,
    tenantName: string
): Promise<DbAlert | null> {
    return createAlert(
        'client.first_call',
        'First call handled',
        `${tenantName} just had their first call handled by the AI agent!`,
        tenantId,
        { tenant_name: tenantName }
    )
}

// Helper: Payment received
export async function alertPaymentReceived(
    tenantId: string,
    tenantName: string,
    amount: number,
    currency: string = 'usd'
): Promise<DbAlert | null> {
    const formattedAmount = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency.toUpperCase(),
    }).format(amount / 100)

    return createAlert(
        'billing.payment_received',
        'Payment received',
        `${tenantName} paid ${formattedAmount}.`,
        tenantId,
        { tenant_name: tenantName, amount, currency }
    )
}

// Helper: Payment failed
export async function alertPaymentFailed(
    tenantId: string,
    tenantName: string,
    reason?: string
): Promise<DbAlert | null> {
    return createAlert(
        'billing.payment_failed',
        'Payment failed',
        `Payment failed for ${tenantName}${reason ? `: ${reason}` : '.'}`,
        tenantId,
        { tenant_name: tenantName, reason }
    )
}

// Helper: Subscription cancelled
export async function alertSubscriptionCancelled(
    tenantId: string,
    tenantName: string,
    reason?: string
): Promise<DbAlert | null> {
    return createAlert(
        'billing.subscription_cancelled',
        'Subscription cancelled',
        `${tenantName} cancelled their subscription${reason ? `: ${reason}` : '.'}`,
        tenantId,
        { tenant_name: tenantName, reason }
    )
}

// Helper: Tool error
export async function alertToolError(
    toolName: string,
    errorMessage: string,
    tenantId?: string,
    tenantName?: string
): Promise<DbAlert | null> {
    return createAlert(
        'tool.error',
        `Tool error: ${toolName}`,
        errorMessage,
        tenantId,
        { tool_name: toolName, tenant_name: tenantName }
    )
}

// Helper: Tool deployed
export async function alertToolDeployed(
    toolName: string,
    version: string,
    target: 'staging' | 'production'
): Promise<DbAlert | null> {
    return createAlert(
        'tool.deployed',
        `${toolName} deployed to ${target}`,
        `Version ${version} of ${toolName} has been deployed to ${target}.`,
        undefined,
        { tool_name: toolName, version, target }
    )
}

// Helper: Usage threshold reached
export async function alertUsageThreshold(
    tenantId: string,
    tenantName: string,
    metric: string,
    current: number,
    threshold: number
): Promise<DbAlert | null> {
    const percentage = Math.round((current / threshold) * 100)
    return createAlert(
        'usage.threshold',
        `Usage limit approaching`,
        `${tenantName} has reached ${percentage}% of their ${metric} limit (${current}/${threshold}).`,
        tenantId,
        { tenant_name: tenantName, metric, current, threshold, percentage }
    )
}

// Helper: System error
export async function alertSystemError(
    title: string,
    message: string,
    metadata?: Record<string, unknown>
): Promise<DbAlert | null> {
    return createAlert(
        'system.error',
        title,
        message,
        undefined,
        metadata
    )
}
