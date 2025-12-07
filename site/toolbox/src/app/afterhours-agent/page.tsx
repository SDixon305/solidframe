'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Phone, X } from 'lucide-react'

export default function DemoPage() {
    const router = useRouter()
    const [selectedTrade, setSelectedTrade] = useState<string | null>(null)
    const [businessName, setBusinessName] = useState('')
    const [showModal, setShowModal] = useState(false)

    const trades = [
        {
            id: 'hvac',
            name: 'HVAC',
            description: 'Never miss an emergency call. Handle after-hours scheduling without lifting a finger.',
            color: 'from-blue-500 to-cyan-400',
            orbColor: 'bg-blue-500',
            icon: '🔥'
        },
        {
            id: 'plumbing',
            name: 'Plumbing',
            description: 'Catch every leak call. Triage emergencies vs routine jobs automatically.',
            color: 'from-cyan-500 to-teal-400',
            orbColor: 'bg-cyan-500',
            icon: '🔧'
        },
        {
            id: 'electrical',
            name: 'Electrical',
            description: 'Prioritize safety calls. Route outages to on-call techs instantly.',
            color: 'from-yellow-400 to-orange-500',
            orbColor: 'bg-yellow-400',
            icon: '⚡'
        },
        {
            id: 'roofing',
            name: 'Roofing',
            description: 'Capture storm damage leads 24/7. Never lose a job to a competitor.',
            color: 'from-orange-500 to-red-500',
            orbColor: 'bg-orange-500',
            icon: '🏠'
        },
    ]

    const handleTradeClick = (tradeId: string) => {
        setSelectedTrade(tradeId)
        setShowModal(true)
    }

    const handleStartDemo = () => {
        const name = businessName.trim() || 'Your Business'
        router.push(`/afterhours-agent/${selectedTrade}?name=${encodeURIComponent(name)}`)
    }

    const handleSkip = () => {
        router.push(`/afterhours-agent/${selectedTrade}?name=${encodeURIComponent('Your Business')}`)
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-black selection:bg-white/20">
            {/* Background Gradients */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 text-center mb-16 space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-zinc-400 tracking-wide mb-4">
                    <Phone className="w-3 h-3" />
                    24/7 AI RECEPTIONIST
                </div>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-zinc-500">
                    Stop Missing Calls.<br />
                    <span className="text-3xl md:text-5xl lg:text-6xl">Start Tonight.</span>
                </h1>
                <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto font-light">
                    Hear how AI answers your after-hours calls—trained for your trade, using your business name.
                </p>
            </div>

            {/* Trade Selection */}
            <div className="relative z-10 w-full max-w-5xl mx-auto mb-8">
                <p className="text-center text-sm text-zinc-500 mb-6 uppercase tracking-wider">I run a...</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {trades.map((trade) => (
                        <button
                            key={trade.id}
                            onClick={() => handleTradeClick(trade.id)}
                            className="group relative flex flex-col h-full bg-zinc-900/40 border border-white/5 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.1)] text-left"
                        >
                            {/* Orb Container */}
                            <div className="relative h-32 flex items-center justify-center bg-gradient-to-b from-black/0 to-black/20 overflow-hidden">
                                <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-b ${trade.color}`} />

                                {/* The Orb with Phone Icon */}
                                <div className="relative w-20 h-20">
                                    <div className={`absolute inset-0 rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 ${trade.orbColor}`} />
                                    <div className={`absolute inset-3 rounded-full blur-md bg-white opacity-15 group-hover:inset-2 transition-all duration-500`} />
                                    <div className={`relative w-full h-full rounded-full border border-white/10 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-md group-hover:scale-110 transition-transform duration-500 flex items-center justify-center`}>
                                        <span className="text-2xl">{trade.icon}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 p-6 pt-3">
                                <h3 className="text-xl font-bold mb-2 text-white group-hover:text-blue-200 transition-colors">{trade.name}</h3>
                                <p className="text-sm text-zinc-500 leading-relaxed group-hover:text-zinc-400 transition-colors">
                                    {trade.description}
                                </p>
                            </div>

                            {/* Footer / CTA */}
                            <div className="p-6 pt-0">
                                <div className="flex items-center gap-2 text-xs font-medium text-zinc-600 group-hover:text-white transition-colors uppercase tracking-wide">
                                    <Phone className="w-3 h-3" />
                                    <span>Hear It In Action</span>
                                    <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform">→</span>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Trust Indicators */}
            <div className="relative z-10 text-center mt-8">
                <p className="text-xs text-zinc-600 uppercase tracking-wider mb-3">Works alongside your existing stack</p>
                <div className="flex flex-wrap justify-center gap-4 text-xs text-zinc-500">
                    <span className="px-3 py-1 rounded-full border border-zinc-800">ServiceTitan</span>
                    <span className="px-3 py-1 rounded-full border border-zinc-800">Housecall Pro</span>
                    <span className="px-3 py-1 rounded-full border border-zinc-800">Jobber</span>
                    <span className="px-3 py-1 rounded-full border border-zinc-800">FieldEdge</span>
                </div>
            </div>

            {/* Business Name Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="relative bg-zinc-900 border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="text-center mb-6">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center">
                                <Phone className="w-7 h-7 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Personalize Your Demo</h2>
                            <p className="text-zinc-400 text-sm">
                                Enter your business name to hear how the AI will greet your callers.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-zinc-400 mb-2">Business Name</label>
                                <input
                                    type="text"
                                    value={businessName}
                                    onChange={(e) => setBusinessName(e.target.value)}
                                    placeholder="e.g., Mike's Heating & Air"
                                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-white/30 transition-colors"
                                    autoFocus
                                    onKeyDown={(e) => e.key === 'Enter' && handleStartDemo()}
                                />
                            </div>

                            <button
                                onClick={handleStartDemo}
                                className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
                            >
                                <Phone className="w-4 h-4" />
                                Start Demo Call
                            </button>

                            <button
                                onClick={handleSkip}
                                className="w-full py-3 text-zinc-500 hover:text-white text-sm transition-colors"
                            >
                                Skip for now →
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
