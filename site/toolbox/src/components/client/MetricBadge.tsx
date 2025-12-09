'use client'

import React from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface MetricBadgeProps {
    label: string
    value: string | number
    trend?: 'up' | 'down' | 'stable'
    trendValue?: string
    size?: 'sm' | 'md' | 'lg'
    variant?: 'default' | 'highlight' | 'subtle'
}

export default function MetricBadge({
    label,
    value,
    trend,
    trendValue,
    size = 'md',
    variant = 'default',
}: MetricBadgeProps) {
    const sizeStyles = {
        sm: {
            container: 'px-2 py-1',
            label: 'text-[10px]',
            value: 'text-sm font-semibold',
            trend: 'text-[10px]',
            icon: 10,
        },
        md: {
            container: 'px-3 py-1.5',
            label: 'text-xs',
            value: 'text-base font-semibold',
            trend: 'text-xs',
            icon: 12,
        },
        lg: {
            container: 'px-4 py-2',
            label: 'text-xs',
            value: 'text-xl font-bold',
            trend: 'text-sm',
            icon: 14,
        },
    }

    const variantStyles = {
        default: 'bg-gray-50 border border-gray-200',
        highlight: 'bg-[#5f3bff]/5 border border-[#5f3bff]/20',
        subtle: 'bg-white border border-gray-100',
    }

    const trendColors = {
        up: 'text-emerald-600',
        down: 'text-red-500',
        stable: 'text-gray-400',
    }

    const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus

    const styles = sizeStyles[size]

    return (
        <div className={`inline-flex flex-col rounded-lg ${variantStyles[variant]} ${styles.container}`}>
            <span className={`${styles.label} text-gray-500 uppercase tracking-wide`}>
                {label}
            </span>
            <div className="flex items-center gap-1.5">
                <span className={`${styles.value} text-gray-900`}>
                    {value}
                </span>
                {trend && (
                    <span className={`flex items-center gap-0.5 ${trendColors[trend]} ${styles.trend}`}>
                        <TrendIcon size={styles.icon} />
                        {trendValue && <span>{trendValue}</span>}
                    </span>
                )}
            </div>
        </div>
    )
}

// Compact inline metric for tool cards
interface InlineMetricProps {
    label: string
    value: string | number
}

export function InlineMetric({ label, value }: InlineMetricProps) {
    return (
        <div className="flex items-center gap-1.5 text-xs">
            <span className="text-gray-400">{label}:</span>
            <span className="font-medium text-gray-700">{value}</span>
        </div>
    )
}
