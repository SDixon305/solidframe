'use client'

import { Phone, Bot, ArrowRight, Truck } from 'lucide-react'

export default function ExplainerSection() {
    return (
        <section className="relative overflow-hidden bg-slate-950 text-white pt-32 pb-12 lg:pt-40 lg:pb-16">
            {/* Background Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl mix-blend-screen animate-pulse" style={{ animationDuration: '4s' }} />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl mix-blend-screen animate-pulse" style={{ animationDuration: '7s' }} />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero Header */}
                <div className="text-center max-w-4xl mx-auto mb-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-900/30 border border-blue-500/30 text-blue-400 text-xs font-medium mb-4 backdrop-blur-sm">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        Now Live: The Future of HVAC Dispatching
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
                        Never Miss a Call.<br />
                        <span className="text-white">Never Lose a Job.</span>
                    </h1>

                    <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        AI-powered dispatching that answers every call, identifies emergencies for immediate dispatch, and schedules routine service—24/7, without hiring another person.
                    </p>
                </div>

                {/* How It Works - 3 Step Flow */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 max-w-4xl mx-auto">
                    {/* Step 1 */}
                    <div className="flex items-center gap-3 bg-slate-900/50 rounded-2xl px-6 py-4 border border-slate-700/50">
                        <div className="p-3 rounded-xl bg-blue-500 text-white shadow-lg shadow-blue-500/30">
                            <Phone className="w-5 h-5" />
                        </div>
                        <span className="text-lg font-semibold text-white">Customer calls</span>
                    </div>

                    {/* Arrow */}
                    <ArrowRight className="w-6 h-6 text-slate-600 hidden md:block" />
                    <div className="h-6 w-px bg-slate-700 md:hidden" />

                    {/* Step 2 */}
                    <div className="flex items-center gap-3 bg-slate-900/50 rounded-2xl px-6 py-4 border border-slate-700/50">
                        <div className="p-3 rounded-xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
                            <Bot className="w-5 h-5" />
                        </div>
                        <span className="text-lg font-semibold text-white">AI triages & books</span>
                    </div>

                    {/* Arrow */}
                    <ArrowRight className="w-6 h-6 text-slate-600 hidden md:block" />
                    <div className="h-6 w-px bg-slate-700 md:hidden" />

                    {/* Step 3 */}
                    <div className="flex items-center gap-3 bg-slate-900/50 rounded-2xl px-6 py-4 border border-slate-700/50">
                        <div className="p-3 rounded-xl bg-amber-500 text-white shadow-lg shadow-amber-500/30">
                            <Truck className="w-5 h-5" />
                        </div>
                        <span className="text-lg font-semibold text-white">Tech gets dispatched</span>
                    </div>
                </div>

                {/* Subtext */}
                <p className="text-center text-slate-400 mt-8 text-lg">
                    Emergencies get dispatched immediately. Routine calls get scheduled. You stay in control.
                </p>
            </div>
        </section>
    )
}
