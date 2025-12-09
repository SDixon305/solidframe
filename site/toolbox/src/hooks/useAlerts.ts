'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import type { AlertWithTenant, AlertFilters, AlertCategory, AlertSeverity } from '@/types/alerts'

interface UseAlertsOptions {
    autoFetch?: boolean
    limit?: number
}

interface UseAlertsReturn {
    alerts: AlertWithTenant[]
    loading: boolean
    error: string | null
    total: number
    unreadCount: number
    filters: AlertFilters
    setFilters: (filters: AlertFilters) => void
    fetchAlerts: () => Promise<void>
    markAsRead: (alertId: string) => Promise<void>
    markAllAsRead: () => Promise<void>
    loadMore: () => Promise<void>
    hasMore: boolean
}

export function useAlerts(options: UseAlertsOptions = {}): UseAlertsReturn {
    const { autoFetch = true, limit = 100 } = options
    const supabase = createClient()

    const [alerts, setAlerts] = useState<AlertWithTenant[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [total, setTotal] = useState(0)
    const [unreadCount, setUnreadCount] = useState(0)
    const [filters, setFilters] = useState<AlertFilters>({ limit })

    // Fetch alerts from API
    const fetchAlerts = useCallback(async (append = false) => {
        try {
            if (!append) setLoading(true)
            setError(null)

            // Build query params
            const params = new URLSearchParams()
            params.set('limit', String(filters.limit || limit))
            params.set('offset', String(append ? alerts.length : (filters.offset || 0)))
            if (filters.category) params.set('category', filters.category)
            if (filters.severity) params.set('severity', filters.severity)
            if (filters.is_read !== undefined) params.set('is_read', String(filters.is_read))

            const response = await fetch(`/api/admin/alerts?${params.toString()}`)
            const data = await response.json()

            if (!data.success) {
                throw new Error(data.error || 'Failed to fetch alerts')
            }

            if (append) {
                setAlerts(prev => [...prev, ...data.data.items])
            } else {
                setAlerts(data.data.items)
            }
            setTotal(data.data.total)
        } catch (err) {
            console.error('Error fetching alerts:', err)
            setError(err instanceof Error ? err.message : 'Unknown error')
        } finally {
            setLoading(false)
        }
    }, [filters, alerts.length, limit])

    // Fetch unread count
    const fetchUnreadCount = useCallback(async () => {
        try {
            const { count, error: countError } = await supabase
                .from('alerts')
                .select('*', { count: 'exact', head: true })
                .eq('is_read', false)

            if (countError) throw countError
            setUnreadCount(count || 0)
        } catch (err) {
            console.error('Error fetching unread count:', err)
        }
    }, [supabase])

    // Mark single alert as read
    const markAsRead = useCallback(async (alertId: string) => {
        try {
            const response = await fetch(`/api/admin/alerts/${alertId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_read: true }),
            })

            const data = await response.json()
            if (!data.success) {
                throw new Error(data.error || 'Failed to mark alert as read')
            }

            // Update local state
            setAlerts(prev => prev.map(alert =>
                alert.id === alertId ? { ...alert, is_read: true } : alert
            ))
            setUnreadCount(prev => Math.max(0, prev - 1))
        } catch (err) {
            console.error('Error marking alert as read:', err)
            throw err
        }
    }, [])

    // Mark all alerts as read
    const markAllAsRead = useCallback(async () => {
        try {
            const response = await fetch('/api/admin/alerts', {
                method: 'POST',
            })

            const data = await response.json()
            if (!data.success) {
                throw new Error(data.error || 'Failed to mark all alerts as read')
            }

            // Update local state
            setAlerts(prev => prev.map(alert => ({ ...alert, is_read: true })))
            setUnreadCount(0)
        } catch (err) {
            console.error('Error marking all alerts as read:', err)
            throw err
        }
    }, [])

    // Load more alerts (pagination)
    const loadMore = useCallback(async () => {
        await fetchAlerts(true)
    }, [fetchAlerts])

    // Initial fetch
    useEffect(() => {
        if (autoFetch) {
            fetchAlerts()
            fetchUnreadCount()
        }
    }, [autoFetch]) // eslint-disable-line react-hooks/exhaustive-deps

    // Refetch when filters change
    useEffect(() => {
        if (autoFetch) {
            fetchAlerts()
        }
    }, [filters.category, filters.severity, filters.is_read]) // eslint-disable-line react-hooks/exhaustive-deps

    // Setup real-time subscription
    useEffect(() => {
        const channel = supabase
            .channel('admin-alerts')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'alerts',
            }, (payload) => {
                // On any change, refetch alerts and unread count
                fetchAlerts()
                fetchUnreadCount()
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [supabase, fetchAlerts, fetchUnreadCount])

    return {
        alerts,
        loading,
        error,
        total,
        unreadCount,
        filters,
        setFilters,
        fetchAlerts: () => fetchAlerts(),
        markAsRead,
        markAllAsRead,
        loadMore,
        hasMore: alerts.length < total,
    }
}

// Simplified hook just for unread count (used in sidebar)
export function useUnreadAlertCount(): number {
    const [count, setCount] = useState(0)
    const supabase = createClient()

    const fetchCount = useCallback(async () => {
        try {
            const { count: unreadCount, error } = await supabase
                .from('alerts')
                .select('*', { count: 'exact', head: true })
                .eq('is_read', false)

            if (error) throw error
            setCount(unreadCount || 0)
        } catch (err) {
            console.error('Error fetching unread alert count:', err)
        }
    }, [supabase])

    useEffect(() => {
        fetchCount()

        // Setup real-time subscription
        const channel = supabase
            .channel('alert-count')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'alerts',
            }, fetchCount)
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [supabase, fetchCount])

    return count
}
