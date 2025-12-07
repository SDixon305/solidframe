'use client'

import { ROIResults } from '@/lib/hooks/use-roi-calculator'
import { motion } from 'framer-motion'
import { TrendingUp, Flame, Wrench } from 'lucide-react'

interface ROIVisualizationProps {
    results: ROIResults
}

export default function ROIVisualization({ results }: ROIVisualizationProps) {
    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val)
    }

    const isHighValue = results.netAnnualGain > 50000

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
        >
            {/* Hero: Net Annual Gain */}
            <motion.div
                className={`p-4 rounded-xl border relative overflow-hidden ${isHighValue ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-emerald-500/20 bg-zinc-900/50'}`}
            >
                {isHighValue && (
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.1)_0%,transparent_70%)]" />
                )}
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-1 flex items-center gap-1">
                            <TrendingUp size={12} />
                            Your Annual Gain
                        </div>
                        <motion.div
                            key={results.netAnnualGain}
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            className="text-3xl font-mono font-bold text-emerald-400"
                        >
                            {formatCurrency(results.netAnnualGain)}
                        </motion.div>
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] text-zinc-500">Monthly</div>
                        <div className="text-lg font-mono font-bold text-emerald-400/80">
                            {formatCurrency(results.netMonthlyGain)}/mo
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Breakdown Grid - Compact 2x2 */}
            <div className="grid grid-cols-4 gap-2">
                {/* Emergency Lost */}
                <div className="p-3 rounded-lg bg-zinc-900/50 border border-rose-500/20">
                    <div className="flex items-center gap-1 mb-1">
                        <Flame size={12} className="text-rose-400" />
                        <span className="text-[10px] text-zinc-500">Emerg. Lost</span>
                    </div>
                    <div className="text-base font-mono font-bold text-rose-400">
                        {formatCurrency(results.emergencyLostToCompetitor)}
                    </div>
                </div>

                {/* Emergency Recovered */}
                <div className="p-3 rounded-lg bg-zinc-900/50 border border-emerald-500/20">
                    <div className="flex items-center gap-1 mb-1">
                        <Flame size={12} className="text-emerald-400" />
                        <span className="text-[10px] text-zinc-500">Emerg. Recovered</span>
                    </div>
                    <div className="text-base font-mono font-bold text-emerald-400">
                        +{formatCurrency(results.emergencyRecovered)}
                    </div>
                </div>

                {/* Service Lost */}
                <div className="p-3 rounded-lg bg-zinc-900/50 border border-orange-500/20">
                    <div className="flex items-center gap-1 mb-1">
                        <Wrench size={12} className="text-orange-400" />
                        <span className="text-[10px] text-zinc-500">Svc. Lost</span>
                    </div>
                    <div className="text-base font-mono font-bold text-orange-400">
                        {formatCurrency(results.serviceLostSlippingAway)}
                    </div>
                </div>

                {/* Service Recovered */}
                <div className="p-3 rounded-lg bg-zinc-900/50 border border-emerald-500/20">
                    <div className="flex items-center gap-1 mb-1">
                        <Wrench size={12} className="text-emerald-400" />
                        <span className="text-[10px] text-zinc-500">Svc. Recovered</span>
                    </div>
                    <div className="text-base font-mono font-bold text-emerald-400">
                        +{formatCurrency(results.serviceRecovered)}
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
