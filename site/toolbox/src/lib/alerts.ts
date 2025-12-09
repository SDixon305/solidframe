// Server-side alert CRUD operations
// Used by API routes and server actions

import { createClient } from '@/utils/supabase/server'
import type { DbAlert, AlertFilters, AlertWithTenant } from '@/types/alerts'

// Get alerts with filters and pagination
export async function getAlerts(filters: AlertFilters = {}): Promise<{
    alerts: AlertWithTenant[]
    total: number
}> {
    const supabase = await createClient()
    const { category, severity, is_read, limit = 100, offset = 0 } = filters

    // Build query
    let query = supabase
        .from('alerts')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

    // Apply filters
    if (category) {
        query = query.like('type', `${category}.%`)
    }
    if (severity) {
        query = query.eq('severity', severity)
    }
    if (is_read !== undefined) {
        query = query.eq('is_read', is_read)
    }

    const { data: alerts, error, count } = await query

    if (error) {
        console.error('Error fetching alerts:', error)
        return { alerts: [], total: 0 }
    }

    // Fetch tenant info for alerts that have tenant_id
    const tenantIds = [...new Set((alerts || []).filter(a => a.tenant_id).map(a => a.tenant_id))]
    let tenantsMap: Record<string, { id: string; name: string; slug: string }> = {}

    if (tenantIds.length > 0) {
        const { data: tenants } = await supabase
            .from('tenants')
            .select('id, name, slug')
            .in('id', tenantIds)

        if (tenants) {
            tenantsMap = Object.fromEntries(tenants.map(t => [t.id, t]))
        }
    }

    // Map alerts with tenant info
    const alertsWithTenants: AlertWithTenant[] = (alerts || []).map(alert => ({
        ...alert,
        tenant: alert.tenant_id ? tenantsMap[alert.tenant_id] || null : null,
    }))

    return {
        alerts: alertsWithTenants,
        total: count || 0,
    }
}

// Get count of unread alerts
export async function getUnreadAlertCount(): Promise<number> {
    const supabase = await createClient()

    const { count, error } = await supabase
        .from('alerts')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false)

    if (error) {
        console.error('Error fetching unread count:', error)
        return 0
    }

    return count || 0
}

// Mark a single alert as read
export async function markAlertAsRead(alertId: string): Promise<DbAlert | null> {
    const supabase = await createClient()

    const { data: alert, error } = await supabase
        .from('alerts')
        .update({ is_read: true })
        .eq('id', alertId)
        .select()
        .single()

    if (error) {
        console.error('Error marking alert as read:', error)
        return null
    }

    return alert
}

// Mark all alerts as read
export async function markAllAlertsAsRead(): Promise<boolean> {
    const supabase = await createClient()

    const { error } = await supabase
        .from('alerts')
        .update({ is_read: true })
        .eq('is_read', false)

    if (error) {
        console.error('Error marking all alerts as read:', error)
        return false
    }

    return true
}

// Get a single alert by ID
export async function getAlert(alertId: string): Promise<DbAlert | null> {
    const supabase = await createClient()

    const { data: alert, error } = await supabase
        .from('alerts')
        .select('*')
        .eq('id', alertId)
        .single()

    if (error) {
        console.error('Error fetching alert:', error)
        return null
    }

    return alert
}

// Delete an alert
export async function deleteAlert(alertId: string): Promise<boolean> {
    const supabase = await createClient()

    const { error } = await supabase
        .from('alerts')
        .delete()
        .eq('id', alertId)

    if (error) {
        console.error('Error deleting alert:', error)
        return false
    }

    return true
}
