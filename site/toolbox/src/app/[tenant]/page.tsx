'use client'

import { useTenantContext } from '@/lib/tenant-context'
import { ClientToolGrid } from '@/components/client'
import { Zap, AlertCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function ClientDashboardPage() {
    const { tenant, tools, onboardingComplete, onboardingStep } = useTenantContext()

    // Count active tools
    const activeTools = tools.filter(t => t.isActive).length
    const totalTools = tools.length

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Onboarding Banner */}
            {!onboardingComplete && (
                <div className="bg-gradient-to-r from-[#5f3bff] to-[#4f2fe0] rounded-xl p-5 text-white shadow-lg shadow-[#5f3bff]/20">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                            <div className="p-2.5 rounded-lg bg-white/20 backdrop-blur-sm shrink-0">
                                <Zap size={22} className="text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-1">
                                    Complete Your Setup
                                </h3>
                                <p className="text-sm text-white/80">
                                    You're {onboardingStep} of 10 steps into onboarding. Finish setup to unlock all features.
                                </p>
                            </div>
                        </div>
                        <Link
                            href={`/${tenant.slug}/onboarding`}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#5f3bff] rounded-lg font-medium text-sm hover:bg-white/90 transition-colors shrink-0"
                        >
                            Continue Setup
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            )}

            {/* Dashboard Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-500 mt-1">
                        {activeTools} of {totalTools} tools active
                    </p>
                </div>

                {/* Quick Stats */}
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-white border border-gray-200 rounded-lg">
                        <div className="text-xs text-gray-400 mb-0.5">This Month</div>
                        <div className="text-lg font-bold text-gray-900">$12,450</div>
                        <div className="text-xs text-emerald-600">+18% revenue impact</div>
                    </div>
                </div>
            </div>

            {/* Tool Grid */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Your Tools</h2>
                    <Link
                        href={`/${tenant.slug}/settings`}
                        className="text-sm text-[#5f3bff] hover:text-[#4f2fe0] font-medium"
                    >
                        Manage Tools
                    </Link>
                </div>

                <ClientToolGrid tools={tools} />
            </div>

            {/* Help Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 mt-8">
                <div className="flex items-start gap-4">
                    <div className="p-2.5 rounded-lg bg-blue-50 shrink-0">
                        <AlertCircle size={20} className="text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 mb-1">
                            Need Help?
                        </h3>
                        <p className="text-sm text-gray-500 mb-3">
                            Our team is here to help you get the most out of SolidFrame. Schedule a call or browse our help docs.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <a
                                href="#"
                                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#5f3bff] hover:text-[#4f2fe0]"
                            >
                                Schedule a Call
                                <ArrowRight size={14} />
                            </a>
                            <a
                                href="#"
                                className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900"
                            >
                                View Help Docs
                                <ArrowRight size={14} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
