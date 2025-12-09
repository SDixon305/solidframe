'use client'

import { useState } from 'react'
import { ArrowLeft, Copy, Check, Link2, Sparkles, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { generateToken } from '@/lib/demo-context'
import { logDemoLink } from '@/lib/supabase'

export default function DemoLinksPage() {
    const [ownerName, setOwnerName] = useState('')
    const [businessName, setBusinessName] = useState('')
    const [generatedLink, setGeneratedLink] = useState('')
    const [copied, setCopied] = useState(false)
    const [isGenerating, setIsGenerating] = useState(false)
    const [logError, setLogError] = useState<string | null>(null)

    const handleGenerate = async () => {
        setIsGenerating(true)
        setLogError(null)

        const expirationDays = 14
        const token = generateToken(ownerName, businessName, expirationDays)
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://toolbox.solidframe.ai'
        const link = `${baseUrl}/client-demo?token=${token}`

        // Log to Supabase for analytics
        const expiresAt = new Date(Date.now() + expirationDays * 24 * 60 * 60 * 1000).toISOString()
        const result = await logDemoLink({
            owner_name: ownerName || null,
            business_name: businessName || null,
            token,
            expires_at: expiresAt,
        })

        if (!result.success) {
            setLogError(result.error || 'Failed to log link')
        }

        setGeneratedLink(link)
        setCopied(false)
        setIsGenerating(false)
    }

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(generatedLink)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy:', err)
        }
    }

    const expirationDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    })

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <header className="h-20 border-b border-white/5 flex items-center px-8 bg-black/20 backdrop-blur-sm">
                <Link href="/admin" className="p-2 hover:bg-white/10 rounded-lg transition-colors text-zinc-400 hover:text-white mr-4">
                    <ArrowLeft size={24} />
                </Link>
                <div className="p-3 rounded-xl border bg-rose-500/10 border-rose-500/30 shadow-[0_0_20px_rgba(244,63,94,0.2)] mr-4">
                    <Link2 size={24} className="text-rose-400" />
                </div>
                <div>
                    <h1 className="text-xl font-bold">Demo Link Generator</h1>
                    <p className="text-sm text-zinc-500">Create personalized demo links for prospects</p>
                </div>
            </header>

            {/* Content */}
            <div className="max-w-2xl mx-auto p-8">
                <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-8">
                    <div className="flex items-center gap-3 mb-8">
                        <Sparkles size={24} className="text-amber-400" />
                        <h2 className="text-lg font-bold">Personalization</h2>
                    </div>

                    <div className="space-y-6">
                        {/* Owner Name */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
                                Owner Name (optional)
                            </label>
                            <input
                                type="text"
                                value={ownerName}
                                onChange={(e) => setOwnerName(e.target.value)}
                                placeholder="e.g., John Smith"
                                className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:border-rose-500/50 transition-colors"
                            />
                            <p className="text-xs text-zinc-600 mt-1">
                                Leave blank to use "valued customer"
                            </p>
                        </div>

                        {/* Business Name */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
                                Business Name (optional)
                            </label>
                            <input
                                type="text"
                                value={businessName}
                                onChange={(e) => setBusinessName(e.target.value)}
                                placeholder="e.g., ABC Heating & Cooling"
                                className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:border-rose-500/50 transition-colors"
                            />
                            <p className="text-xs text-zinc-600 mt-1">
                                Leave blank to use "Trinity Cooling"
                            </p>
                        </div>

                        {/* Generate Button */}
                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            className="w-full py-4 bg-white text-black rounded-lg font-bold uppercase tracking-wider text-sm hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {isGenerating ? 'Generating...' : 'Generate Demo Link'}
                        </button>

                        {/* Error Warning */}
                        {logError && (
                            <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400 text-sm">
                                <AlertCircle size={16} />
                                <span>Link generated but failed to log analytics: {logError}</span>
                            </div>
                        )}
                    </div>

                    {/* Generated Link */}
                    {generatedLink && (
                        <div className="mt-8 pt-8 border-t border-white/5">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                                    Generated Link
                                </span>
                                <span className="text-xs text-amber-400">
                                    Expires: {expirationDate}
                                </span>
                            </div>
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    value={generatedLink}
                                    readOnly
                                    className="flex-1 px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-zinc-300 text-sm font-mono"
                                />
                                <button
                                    onClick={handleCopy}
                                    className={`px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all flex items-center gap-2 ${
                                        copied
                                            ? 'bg-emerald-500 text-white'
                                            : 'bg-white/10 text-white hover:bg-white/20'
                                    }`}
                                >
                                    {copied ? <Check size={18} /> : <Copy size={18} />}
                                    {copied ? 'Copied!' : 'Copy'}
                                </button>
                            </div>

                            {/* Preview */}
                            <div className="mt-6 p-4 rounded-lg bg-black/30 border border-white/5">
                                <p className="text-xs text-zinc-500 mb-2">Preview greeting:</p>
                                <p className="text-white">
                                    "Welcome, <span className="text-rose-400">{businessName || 'Trinity Cooling'}</span>"
                                </p>
                                <p className="text-zinc-400 text-sm">
                                    Explore what SolidFrame can do for {ownerName || 'valued customer'}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
