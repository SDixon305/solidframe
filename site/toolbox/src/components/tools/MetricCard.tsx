'use client'

import React from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface MetricCardProps {
    label: string
    value: string | number
    trend?: 'up' | 'down' | 'stable'
    trendValue?: string
    description?: string
    icon?: React.ElementType
    variant?: 'default' | 'large' | 'compact'
    className?: string
}

export default function MetricCard({
    label,
    value,
    trend,
    trendValue,
    description,
    icon: Icon,
    variant = 'default',
    className = '',
}: MetricCardProps) {
    const TrendIcon = trend === 'up'
        ? TrendingUp
        : trend === 'down'
            ? TrendingDown
            : Minus

    const trendColor = trend === 'up'
        ? 'text-emerald-600 bg-emerald-50'
        : trend === 'down'
            ? 'text-red-500 bg-red-50'
            : 'text-gray-400 bg-gray-50'

    if (variant === 'large') {
        return (
            <div className={`bg-white border border-gray-200 rounded-xl p-6 ${className}`}>
                <div className="flex items-start justify-between mb-4">
                    <span className="text-sm font-medium text-gray-500">{label}</span>
                    {Icon && (
                        <div className="p-2 rounded-lg bg-[#5f3bff]/10">
                            <Icon size={18} className="text-[#5f3bff]" />
                        </div>
                    )}
                </div>
                <div className="flex items-end gap-3">
                    <span className="text-4xl font-bold text-gray-900">{value}</span>
                    {trend && trendValue && (
                        <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${trendColor}`}>
                            <TrendIcon size={14} />
                            {trendValue}
                        </span>
                    )}
                </div>
                {description && (
                    <p className="text-sm text-gray-400 mt-2">{description}</p>
                )}
            </div>
        )
    }

    if (variant === 'compact') {
        return (
            <div className={`p-3 rounded-lg bg-gray-50 ${className}`}>
                <div className="text-xs text-gray-400 mb-0.5">{label}</div>
                <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">{value}</span>
                    {trend && (
                        <TrendIcon size={12} className={trend === 'up' ? 'text-emerald-500' : trend === 'down' ? 'text-red-500' : 'text-gray-400'} />
                    )}
                </div>
            </div>
        )
    }

    // Default variant
    return (
        <div className={`bg-white border border-gray-200 rounded-xl p-4 ${className}`}>
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-500">{label}</span>
                {Icon && <Icon size={18} className="text-gray-400" />}
            </div>
            <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-900">{value}</span>
                {trend && trendValue && (
                    <span className={`flex items-center gap-0.5 text-xs font-medium ${trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-red-500' : 'text-gray-400'}`}>
                        <TrendIcon size={12} />
                        {trendValue}
                    </span>
                )}
            </div>
            {description && (
                <p className="text-xs text-gray-400 mt-1">{description}</p>
            )}
        </div>
    )
}

// Simple big number metric display
interface BigMetricProps {
    label: string
    value: string | number
    subValue?: string
    color?: 'default' | 'success' | 'warning' | 'primary'
}

export function BigMetric({ label, value, subValue, color = 'default' }: BigMetricProps) {
    const colorStyles = {
        default: 'text-gray-900',
        success: 'text-emerald-600',
        warning: 'text-amber-600',
        primary: 'text-[#5f3bff]',
    }

    return (
        <div className="text-center">
            <div className={`text-5xl font-bold mb-2 ${colorStyles[color]}`}>
                {value}
            </div>
            <div className="text-sm font-medium text-gray-500">{label}</div>
            {subValue && (
                <div className="text-xs text-gray-400 mt-1">{subValue}</div>
            )}
        </div>
    )
}
