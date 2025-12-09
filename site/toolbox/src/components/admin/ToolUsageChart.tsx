'use client'

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts'
import {
    Phone,
    MessageSquare,
    Star,
    Calendar,
    DollarSign,
    Megaphone,
    RefreshCw,
    GraduationCap,
    Wrench,
} from 'lucide-react'
import type { ToolUsageData } from '@/lib/analytics'

interface ToolUsageChartProps {
    data: ToolUsageData[]
    loading?: boolean
}

// Icon mapping for tools
const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
    'phone': Phone,
    'message-square': MessageSquare,
    'star': Star,
    'calendar': Calendar,
    'dollar-sign': DollarSign,
    'megaphone': Megaphone,
    'refresh-cw': RefreshCw,
    'graduation-cap': GraduationCap,
    'tool': Wrench,
}

// Color palette for bars
const COLORS = [
    '#6366f1', // indigo
    '#8b5cf6', // violet
    '#a855f7', // purple
    '#d946ef', // fuchsia
    '#ec4899', // pink
    '#f43f5e', // rose
    '#f97316', // orange
    '#eab308', // yellow
]

export function ToolUsageChart({ data, loading }: ToolUsageChartProps) {
    if (loading) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="h-6 w-36 bg-gray-200 rounded animate-pulse mb-4" />
                <div className="h-[280px] bg-gray-100 rounded animate-pulse" />
            </div>
        )
    }

    if (!data || data.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tool Popularity</h3>
                <div className="h-[280px] flex flex-col items-center justify-center text-gray-500">
                    <Wrench size={40} className="text-gray-300 mb-2" />
                    <p>No tool usage data yet</p>
                </div>
            </div>
        )
    }

    // Custom tick for Y-axis with icons
    const CustomYAxisTick = ({ x, y, payload }: { x: number; y: number; payload: { value: string } }) => {
        const tool = data.find(t => t.name === payload.value)
        const IconComponent = tool ? iconMap[tool.icon] || Wrench : Wrench

        return (
            <g transform={`translate(${x},${y})`}>
                <foreignObject x={-140} y={-10} width={135} height={20}>
                    <div className="flex items-center gap-2 text-right">
                        <IconComponent size={14} className="text-gray-400 flex-shrink-0" />
                        <span className="text-xs text-gray-600 truncate flex-1">{payload.value}</span>
                    </div>
                </foreignObject>
            </g>
        )
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tool Popularity</h3>
            <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        layout="vertical"
                        margin={{ top: 0, right: 20, left: 145, bottom: 0 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                        <XAxis
                            type="number"
                            stroke="#9ca3af"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            type="category"
                            dataKey="name"
                            stroke="#9ca3af"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tick={CustomYAxisTick as never}
                            width={140}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#fff',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            }}
                            formatter={(value: number) => [value.toLocaleString(), 'Total Actions']}
                        />
                        <Bar
                            dataKey="usage"
                            radius={[0, 4, 4, 0]}
                            maxBarSize={24}
                        >
                            {data.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
