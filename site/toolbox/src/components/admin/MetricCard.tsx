import { LucideIcon } from 'lucide-react'

interface MetricCardProps {
    title: string
    value: string | number
    subtitle?: string
    icon?: LucideIcon
    trend?: {
        value: number
        label: string
        isPositive?: boolean
    }
    variant?: 'default' | 'success' | 'warning' | 'danger'
}

const variantStyles = {
    default: {
        icon: 'bg-slate-100 text-slate-600',
        trend: 'text-slate-500',
    },
    success: {
        icon: 'bg-emerald-100 text-emerald-600',
        trend: 'text-emerald-600',
    },
    warning: {
        icon: 'bg-amber-100 text-amber-600',
        trend: 'text-amber-600',
    },
    danger: {
        icon: 'bg-red-100 text-red-600',
        trend: 'text-red-600',
    },
}

export function MetricCard({
    title,
    value,
    subtitle,
    icon: Icon,
    trend,
    variant = 'default',
}: MetricCardProps) {
    const styles = variantStyles[variant]

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
                    {subtitle && (
                        <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
                    )}
                    {trend && (
                        <p className={`mt-2 text-sm font-medium ${trend.isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                            {trend.isPositive ? '+' : ''}{trend.value}% {trend.label}
                        </p>
                    )}
                </div>
                {Icon && (
                    <div className={`p-3 rounded-lg ${styles.icon}`}>
                        <Icon size={20} />
                    </div>
                )}
            </div>
        </div>
    )
}
