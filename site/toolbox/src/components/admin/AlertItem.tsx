'use client'

import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import {
    Users,
    CreditCard,
    Wrench,
    TrendingUp,
    AlertTriangle,
    Check,
    ExternalLink,
} from 'lucide-react'
import type { AlertWithTenant, AlertType, AlertSeverity, severityColors } from '@/types/alerts'

interface AlertItemProps {
    alert: AlertWithTenant
    onMarkAsRead?: (alertId: string) => void
}

// Get icon for alert type
function getAlertIcon(type: AlertType) {
    const category = type.split('.')[0]
    switch (category) {
        case 'client':
            return Users
        case 'billing':
            return CreditCard
        case 'tool':
            return Wrench
        case 'usage':
            return TrendingUp
        case 'system':
        default:
            return AlertTriangle
    }
}

// Severity styles
const severityStyles: Record<AlertSeverity, { bg: string; border: string; icon: string; dot: string }> = {
    info: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        icon: 'text-blue-500 bg-blue-100',
        dot: 'bg-blue-500',
    },
    success: {
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        icon: 'text-emerald-500 bg-emerald-100',
        dot: 'bg-emerald-500',
    },
    warning: {
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        icon: 'text-amber-500 bg-amber-100',
        dot: 'bg-amber-500',
    },
    error: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        icon: 'text-red-500 bg-red-100',
        dot: 'bg-red-500',
    },
}

// Get link for alert (navigate to related resource)
function getAlertLink(alert: AlertWithTenant): string | null {
    const category = alert.type.split('.')[0]
    switch (category) {
        case 'client':
            return alert.tenant_id ? `/admin/clients/${alert.tenant_id}` : null
        case 'billing':
            return alert.tenant_id ? `/admin/clients/${alert.tenant_id}` : null
        case 'tool':
            const toolName = alert.metadata?.tool_name as string | undefined
            return toolName ? `/admin/tools/${toolName.toLowerCase().replace(/\s+/g, '-')}` : '/admin/tools'
        case 'usage':
            return alert.tenant_id ? `/admin/clients/${alert.tenant_id}` : '/admin/analytics'
        case 'system':
        default:
            return null
    }
}

export function AlertItem({ alert, onMarkAsRead }: AlertItemProps) {
    const Icon = getAlertIcon(alert.type)
    const styles = severityStyles[alert.severity]
    const link = getAlertLink(alert)
    const timeAgo = formatDistanceToNow(new Date(alert.created_at), { addSuffix: true })

    const handleMarkAsRead = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (onMarkAsRead && !alert.is_read) {
            onMarkAsRead(alert.id)
        }
    }

    const content = (
        <div
            className={`
                relative p-4 rounded-lg border transition-all
                ${alert.is_read
                    ? 'bg-white border-gray-200 hover:border-gray-300'
                    : `${styles.bg} ${styles.border} hover:shadow-sm`
                }
            `}
        >
            {/* Unread indicator dot */}
            {!alert.is_read && (
                <div className={`absolute top-4 right-4 w-2 h-2 rounded-full ${styles.dot}`} />
            )}

            <div className="flex items-start gap-3">
                {/* Icon */}
                <div className={`p-2 rounded-lg ${alert.is_read ? 'bg-gray-100 text-gray-500' : styles.icon}`}>
                    <Icon size={18} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <h4 className={`text-sm font-medium ${alert.is_read ? 'text-gray-700' : 'text-gray-900'}`}>
                            {alert.title}
                        </h4>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                            {timeAgo}
                        </span>
                    </div>

                    <p className={`mt-1 text-sm ${alert.is_read ? 'text-gray-500' : 'text-gray-600'}`}>
                        {alert.message}
                    </p>

                    {/* Tenant badge */}
                    {alert.tenant && (
                        <div className="mt-2">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                                {alert.tenant.name}
                            </span>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="mt-3 flex items-center gap-3">
                        {!alert.is_read && onMarkAsRead && (
                            <button
                                onClick={handleMarkAsRead}
                                className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                <Check size={14} />
                                Mark as read
                            </button>
                        )}
                        {link && (
                            <span className="inline-flex items-center gap-1 text-xs text-violet-600 hover:text-violet-700">
                                <ExternalLink size={14} />
                                View details
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )

    if (link) {
        return (
            <Link href={link} className="block">
                {content}
            </Link>
        )
    }

    return content
}
