'use client'

import { useState } from 'react'
import { ArrowLeft, Star, MessageSquare, Send, Check, Clock, Eye } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Sidebar } from '@/components/shared'
import { demoFolders } from '@/lib/demo-tools'
import { useDemoContext } from '@/lib/demo-context'
import { reviewTemplates, mockReviewRequests, reviewStats, ReviewRequest } from '@/lib/mock-data'
import { motion } from 'framer-motion'

export default function DemoReviewsPage() {
    const { businessName } = useDemoContext()
    const searchParams = useSearchParams()
    const token = searchParams.get('token')

    const [selectedTemplate, setSelectedTemplate] = useState(reviewTemplates[0])
    const [previewCustomer, setPreviewCustomer] = useState('John Smith')
    const [previewService, setPreviewService] = useState('AC Repair')
    const [showSentAnimation, setShowSentAnimation] = useState(false)

    const tokenParam = token ? `?token=${token}` : ''

    const getPreviewMessage = () => {
        return selectedTemplate.message
            .replace('{customerName}', previewCustomer)
            .replace('{serviceType}', previewService)
            .replace('{reviewLink}', 'g.page/r/trinity-cooling')
    }

    const handleSendDemo = () => {
        setShowSentAnimation(true)
        setTimeout(() => setShowSentAnimation(false), 2000)
    }

    const statusIcons: Record<string, React.ReactNode> = {
        pending: <Clock size={14} className="text-zinc-500" />,
        sent: <Send size={14} className="text-amber-400" />,
        opened: <Eye size={14} className="text-blue-400" />,
        completed: <Check size={14} className="text-emerald-400" />,
    }

    const statusColors: Record<string, string> = {
        pending: 'bg-zinc-500/20 text-zinc-400',
        sent: 'bg-amber-500/20 text-amber-400',
        opened: 'bg-blue-500/20 text-blue-400',
        completed: 'bg-emerald-500/20 text-emerald-400',
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
                        <div className="p-3 rounded-xl border bg-amber-500/10 border-amber-500/30 shadow-[0_0_20px_rgba(251,191,36,0.2)]">
                            <Star size={24} className="text-amber-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold tracking-tight text-white">
                                Review Request Generator
                            </h2>
                            <p className="text-sm text-zinc-500">
                                Automate review collection for {businessName}
                            </p>
                        </div>
                    </div>

                    <div className="px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
                        Demo Mode
                    </div>
                </header>

                {/* Content */}
                <div className="flex-1 overflow-hidden flex">
                    {/* Left: Composer */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {/* Stats */}
                        <div className="grid grid-cols-4 gap-4 mb-6">
                            <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/5">
                                <div className="text-2xl font-bold text-white">{reviewStats.totalSent}</div>
                                <div className="text-xs text-zinc-500">Requests Sent</div>
                            </div>
                            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                <div className="text-2xl font-bold text-emerald-400">{reviewStats.responseRate}</div>
                                <div className="text-xs text-zinc-500">Response Rate</div>
                            </div>
                            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                                <div className="text-2xl font-bold text-amber-400">{reviewStats.averageRating}</div>
                                <div className="text-xs text-zinc-500">Avg Rating</div>
                            </div>
                            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                <div className="text-2xl font-bold text-blue-400">{reviewStats.googleReviews}</div>
                                <div className="text-xs text-zinc-500">Google Reviews</div>
                            </div>
                        </div>

                        {/* Template Selector */}
                        <div className="mb-6">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3">
                                Select Template
                            </h3>
                            <div className="flex gap-2">
                                {reviewTemplates.map((template) => (
                                    <button
                                        key={template.id}
                                        onClick={() => setSelectedTemplate(template)}
                                        className={`px-4 py-2 rounded-lg text-sm transition-all ${
                                            selectedTemplate.id === template.id
                                                ? 'bg-white text-black font-bold'
                                                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                                        }`}
                                    >
                                        {template.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Preview Inputs */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
                                    Customer Name
                                </label>
                                <input
                                    type="text"
                                    value={previewCustomer}
                                    onChange={(e) => setPreviewCustomer(e.target.value)}
                                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
                                    Service Type
                                </label>
                                <input
                                    type="text"
                                    value={previewService}
                                    onChange={(e) => setPreviewService(e.target.value)}
                                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white"
                                />
                            </div>
                        </div>

                        {/* SMS Preview */}
                        <div className="mb-6">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3">
                                SMS Preview
                            </h3>
                            <div className="p-6 rounded-xl bg-zinc-900/50 border border-white/5">
                                <div className="flex items-center gap-2 mb-3">
                                    <MessageSquare size={16} className="text-emerald-400" />
                                    <span className="text-xs text-zinc-500">Text Message</span>
                                </div>
                                <p className="text-white leading-relaxed">
                                    {getPreviewMessage()}
                                </p>
                            </div>
                        </div>

                        {/* Send Button */}
                        <motion.button
                            onClick={handleSendDemo}
                            disabled={showSentAnimation}
                            className={`w-full py-4 rounded-xl font-bold uppercase tracking-wider text-sm transition-all flex items-center justify-center gap-2 ${
                                showSentAnimation
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-white text-black hover:scale-[1.02]'
                            }`}
                            whileTap={{ scale: 0.98 }}
                        >
                            {showSentAnimation ? (
                                <>
                                    <Check size={20} />
                                    Message Sent!
                                </>
                            ) : (
                                <>
                                    <Send size={20} />
                                    Send Review Request (Demo)
                                </>
                            )}
                        </motion.button>
                    </div>

                    {/* Right: Recent Requests */}
                    <div className="w-96 border-l border-white/5 overflow-y-auto">
                        <div className="p-4 border-b border-white/5">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                                Recent Requests
                            </h3>
                        </div>
                        <div className="p-4 space-y-3">
                            {mockReviewRequests.map((request, index) => (
                                <motion.div
                                    key={request.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="p-4 rounded-xl bg-zinc-900/50 border border-white/5"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h4 className="font-medium text-white">{request.customerName}</h4>
                                            <p className="text-xs text-zinc-500">{request.serviceType}</p>
                                        </div>
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${statusColors[request.status]}`}>
                                            {request.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-zinc-500">
                                        <span>{request.serviceDate}</span>
                                        {request.rating && (
                                            <div className="flex items-center gap-1">
                                                <Star size={12} className="text-amber-400 fill-amber-400" />
                                                <span className="text-amber-400">{request.rating}</span>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
