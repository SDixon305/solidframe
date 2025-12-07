'use client'

import { useState } from 'react'
import { DEFAULT_PROMPTS, DEFAULT_VOICES, Trade } from '@/lib/types'

export default function AgentFactory() {
    const [selectedTrade, setSelectedTrade] = useState<Trade>('hvac')
    const [systemPrompt, setSystemPrompt] = useState(DEFAULT_PROMPTS['hvac'])
    const [voiceId, setVoiceId] = useState(DEFAULT_VOICES['hvac'])
    const [firstMessage, setFirstMessage] = useState("Hello, this is SolidFrame HVAC. How can I help you?")

    const handleTradeChange = (trade: Trade) => {
        setSelectedTrade(trade)
        setSystemPrompt(DEFAULT_PROMPTS[trade])
        setVoiceId(DEFAULT_VOICES[trade])
    }

    const handleSave = () => {
        console.log('Saving config:', { selectedTrade, systemPrompt, voiceId, firstMessage })
        alert('Agent Configuration Saved (Mock)')
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 mb-8">
                Agent Factory
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Trade Selector Sidebar */}
                <div className="space-y-2">
                    <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-widest mb-4">Select Trade</h2>
                    {(['hvac', 'plumbing', 'electrical', 'roofing'] as Trade[]).map((trade) => (
                        <button
                            key={trade}
                            onClick={() => handleTradeChange(trade)}
                            className={`w-full text-left px-4 py-3 rounded-lg transition-all ${selectedTrade === trade
                                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/50'
                                    : 'hover:bg-white/5 text-zinc-400'
                                }`}
                        >
                            <span className="capitalize font-medium">{trade}</span>
                        </button>
                    ))}
                </div>

                {/* Editor Form */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-black/40 border border-white/10 rounded-xl p-6 backdrop-blur">
                        <h3 className="text-xl font-bold text-white mb-6 capitalize">{selectedTrade} Agent Config</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs uppercase text-zinc-500 mb-1">Voice ID (Vapi / 11Labs)</label>
                                <input
                                    type="text"
                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                    value={voiceId}
                                    onChange={(e) => setVoiceId(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-xs uppercase text-zinc-500 mb-1">First Message</label>
                                <input
                                    type="text"
                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                    value={firstMessage}
                                    onChange={(e) => setFirstMessage(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-xs uppercase text-zinc-500 mb-1">System Prompt</label>
                                <textarea
                                    rows={12}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-zinc-300 focus:outline-none focus:border-blue-500 font-mono text-sm"
                                    value={systemPrompt}
                                    onChange={(e) => setSystemPrompt(e.target.value)}
                                />
                            </div>

                            <button
                                onClick={handleSave}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-blue-900/20"
                            >
                                Save Configuration
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
