'use client'

import { ArrowLeft, Search, Star, Clock, DollarSign, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Sidebar } from '@/components/shared'
import { demoFolders } from '@/lib/demo-tools'
import { useDemoContext } from '@/lib/demo-context'
import { mockCompetitors, competitorComparison } from '@/lib/mock-data'
import { motion } from 'framer-motion'

export default function DemoCompetitorsPage() {
    const { businessName } = useDemoContext()
    const searchParams = useSearchParams()
    const token = searchParams.get('token')

    const tokenParam = token ? `?token=${token}` : ''
    const yourBusiness = { ...competitorComparison.yourBusiness, name: businessName }

    return (
        <div className="flex h-screen font-sans text-white transition-colors duration-500">
            <Sidebar
                folders={demoFolders}
                activeFolder="demo_tools"
                brandName="SolidFrame"
                hideNav={true}
            />

            <main className="flex-1 relative overflow-hidden flex flex-col z-10 bg-[#09090b]">
                {/* Header */}
                <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-black/20 backdrop-blur-sm z-20">
                    <div className="flex items-center gap-6">
                        <Link href={`/client-demo${tokenParam}`} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-zinc-400 hover:text-white">
                            <ArrowLeft size={24} />
                        </Link>
                        <div className="p-3 rounded-xl border bg-violet-500/10 border-violet-500/30 shadow-[0_0_20px_rgba(139,92,246,0.2)]">
                            <Search size={24} className="text-violet-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold tracking-tight text-white">
                                Competitive Analysis
                            </h2>
                            <p className="text-sm text-zinc-500">
                                See how you compare to local competitors
                            </p>
                        </div>
                    </div>

                    <div className="px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
                        Demo Mode
                    </div>
                </header>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Your Business Card - Highlighted */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 rounded-2xl bg-gradient-to-br from-rose-500/10 to-amber-500/10 border-2 border-rose-500/30 mb-6"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <div className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-1">Your Business</div>
                                <h3 className="text-2xl font-bold text-white">{yourBusiness.name}</h3>
                            </div>
                            <div className="flex items-center gap-1">
                                <Star size={20} className="text-amber-400 fill-amber-400" />
                                <span className="text-xl font-bold text-white">{yourBusiness.rating}</span>
                                <span className="text-sm text-zinc-400">({yourBusiness.reviewCount})</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-4">
                            <div>
                                <div className="text-xs text-zinc-500 mb-1">Price Range</div>
                                <div className="font-bold text-white">{yourBusiness.priceRange}</div>
                            </div>
                            <div>
                                <div className="text-xs text-zinc-500 mb-1">Response Time</div>
                                <div className="font-bold text-emerald-400">{yourBusiness.responseTime}</div>
                            </div>
                            <div>
                                <div className="text-xs text-zinc-500 mb-1">Reviews</div>
                                <div className="font-bold text-white">{yourBusiness.reviewCount}</div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/10">
                            <div className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Your Advantages with SolidFrame</div>
                            <div className="flex flex-wrap gap-2">
                                {yourBusiness.uniqueAdvantages.map((adv) => (
                                    <span key={adv} className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs">
                                        {adv}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Competitors */}
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-4">Local Competitors</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {mockCompetitors.map((comp, index) => (
                            <motion.div
                                key={comp.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="p-5 rounded-xl bg-zinc-900/50 border border-white/5"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <h4 className="font-bold text-white">{comp.name}</h4>
                                    <div className="flex items-center gap-1">
                                        <Star size={14} className="text-amber-400 fill-amber-400" />
                                        <span className="text-sm font-bold text-white">{comp.rating}</span>
                                        <span className="text-xs text-zinc-500">({comp.reviewCount})</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                                    <div className="flex items-center gap-2 text-zinc-400">
                                        <DollarSign size={14} />
                                        {comp.priceRange}
                                    </div>
                                    <div className="flex items-center gap-2 text-zinc-400">
                                        <Clock size={14} />
                                        {comp.responseTime}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 mb-2">Strengths</div>
                                        <div className="space-y-1">
                                            {comp.strengths.slice(0, 2).map((s) => (
                                                <div key={s} className="flex items-center gap-1 text-xs text-zinc-400">
                                                    <CheckCircle size={10} className="text-emerald-500" />
                                                    {s}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold uppercase tracking-wider text-red-500 mb-2">Weaknesses</div>
                                        <div className="space-y-1">
                                            {comp.weaknesses.slice(0, 2).map((w) => (
                                                <div key={w} className="flex items-center gap-1 text-xs text-zinc-400">
                                                    <XCircle size={10} className="text-red-500" />
                                                    {w}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-3 border-t border-white/5">
                                    <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-600 mb-2">Recent Reviews</div>
                                    {comp.recentReviews.slice(0, 1).map((review, i) => (
                                        <div key={i} className="text-xs text-zinc-500 italic">
                                            "{review.text}" - {review.date}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    )
}
