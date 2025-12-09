'use client'

import { useState } from 'react'
import { ArrowLeft, Globe, Star, Phone, Mail, MapPin, Filter } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Sidebar } from '@/components/shared'
import { demoFolders } from '@/lib/demo-tools'
import { useDemoContext } from '@/lib/demo-context'
import { mockLeads, leadStats } from '@/lib/mock-data'
import { motion } from 'framer-motion'

export default function DemoLeadScraperPage() {
    const { businessName } = useDemoContext()
    const searchParams = useSearchParams()
    const token = searchParams.get('token')
    const [filter, setFilter] = useState<string>('all')

    const tokenParam = token ? `?token=${token}` : ''

    const filteredLeads = filter === 'all'
        ? mockLeads
        : mockLeads.filter(lead => lead.status === filter)

    const statusColors: Record<string, string> = {
        new: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        contacted: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        qualified: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        'not-interested': 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
    }

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
                        <div className="p-3 rounded-xl border bg-cyan-500/10 border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                            <Globe size={24} className="text-cyan-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold tracking-tight text-white">
                                Lead Scraper
                            </h2>
                            <p className="text-sm text-zinc-500">
                                Potential leads in your service area
                            </p>
                        </div>
                    </div>

                    <div className="px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
                        Demo Mode
                    </div>
                </header>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Stats Row */}
                    <div className="grid grid-cols-4 gap-4 mb-6">
                        <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/5">
                            <div className="text-2xl font-bold text-white">{leadStats.totalScraped}</div>
                            <div className="text-xs text-zinc-500">Total Scraped</div>
                        </div>
                        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                            <div className="text-2xl font-bold text-emerald-400">{leadStats.newLeads}</div>
                            <div className="text-xs text-zinc-500">New Leads</div>
                        </div>
                        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                            <div className="text-2xl font-bold text-amber-400">{leadStats.contacted}</div>
                            <div className="text-xs text-zinc-500">Contacted</div>
                        </div>
                        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                            <div className="text-2xl font-bold text-blue-400">{leadStats.qualified}</div>
                            <div className="text-xs text-zinc-500">Qualified</div>
                        </div>
                    </div>

                    {/* Filter */}
                    <div className="flex items-center gap-2 mb-6">
                        <Filter size={16} className="text-zinc-500" />
                        <div className="flex gap-2">
                            {['all', 'new', 'contacted', 'qualified'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilter(status)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                                        filter === status
                                            ? 'bg-white text-black'
                                            : 'bg-white/5 text-zinc-400 hover:bg-white/10'
                                    }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Lead Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {filteredLeads.map((lead, index) => (
                            <motion.div
                                key={lead.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="p-5 rounded-xl bg-zinc-900/50 border border-white/5 hover:border-white/10 transition-all"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="font-bold text-white">{lead.businessName}</h3>
                                        <p className="text-sm text-zinc-500">{lead.ownerName}</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${statusColors[lead.status]}`}>
                                        {lead.status.replace('-', ' ')}
                                    </span>
                                </div>

                                <div className="flex items-center gap-1 mb-3">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={14}
                                            className={i < Math.floor(lead.rating) ? 'text-amber-400 fill-amber-400' : 'text-zinc-600'}
                                        />
                                    ))}
                                    <span className="text-sm text-zinc-400 ml-1">{lead.rating}</span>
                                    <span className="text-xs text-zinc-600 ml-1">({lead.reviewCount} reviews)</span>
                                </div>

                                <div className="space-y-2 text-sm text-zinc-400">
                                    <div className="flex items-center gap-2">
                                        <Phone size={14} />
                                        {lead.phone}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Mail size={14} />
                                        {lead.email}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin size={14} />
                                        {lead.city}
                                    </div>
                                </div>

                                <div className="mt-3 pt-3 border-t border-white/5 flex flex-wrap gap-1">
                                    {lead.services.map((service) => (
                                        <span key={service} className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-zinc-500">
                                            {service}
                                        </span>
                                    ))}
                                </div>

                                <div className="mt-3 text-[10px] text-zinc-600">
                                    {lead.lastActivity}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    )
}
