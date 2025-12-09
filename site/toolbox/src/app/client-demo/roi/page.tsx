'use client'

import { useState, useEffect } from 'react'
import { DollarSign, ArrowLeft, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Sidebar } from '@/components/shared'
import { demoFolders } from '@/lib/demo-tools'
import { useDemoContext } from '@/lib/demo-context'
import ROIQuestionnaire from '@/components/tools/roi/ROIQuestionnaire'
import ROIVisualization from '@/components/tools/roi/ROIVisualization'
import ROIInputsCompact from '@/components/tools/roi/ROIInputsCompact'
import { useROICalculator, SOLUTION_DEFAULTS, AI_BOOKING_RATES } from '@/lib/hooks/use-roi-calculator'
import { motion, AnimatePresence } from 'framer-motion'

export default function DemoROIPage() {
    const { businessName } = useDemoContext()
    const searchParams = useSearchParams()
    const token = searchParams.get('token')

    // Use the calculator but don't persist to localStorage in demo mode
    const { inputs, setInputs, results, applySolutionDefaults } = useROICalculator()
    const [showResults, setShowResults] = useState(false)

    // Reset state on mount (demo mode - no persistence)
    useEffect(() => {
        setInputs({
            missedCallsPerWeek: 15,
            emergencyPercent: 25,
            solutionType: 'voicemail',
            currentMonthlyCost: SOLUTION_DEFAULTS.voicemail.monthlyCost,
            currentEmergencyBookingRate: SOLUTION_DEFAULTS.voicemail.emergencyBookingRate,
            currentServiceBookingRate: SOLUTION_DEFAULTS.voicemail.serviceBookingRate,
            aiEmergencyBookingRate: AI_BOOKING_RATES.emergency,
            aiServiceBookingRate: AI_BOOKING_RATES.service,
            emergencyTicketValue: 550,
            serviceTicketValue: 295
        })
        setShowResults(false)
    }, [])

    const handleReset = () => {
        setInputs({
            missedCallsPerWeek: 15,
            emergencyPercent: 25,
            solutionType: 'voicemail',
            currentMonthlyCost: SOLUTION_DEFAULTS.voicemail.monthlyCost,
            currentEmergencyBookingRate: SOLUTION_DEFAULTS.voicemail.emergencyBookingRate,
            currentServiceBookingRate: SOLUTION_DEFAULTS.voicemail.serviceBookingRate,
            aiEmergencyBookingRate: AI_BOOKING_RATES.emergency,
            aiServiceBookingRate: AI_BOOKING_RATES.service,
            emergencyTicketValue: 550,
            serviceTicketValue: 295
        })
        setShowResults(false)
    }

    const tokenParam = token ? `?token=${token}` : ''

    return (
        <div className="flex h-screen bg-[#f4f5f7] text-gray-900">
            {/* Desktop Sidebar - hidden on mobile */}
            <div className="hidden md:block">
                <Sidebar
                    folders={demoFolders}
                    activeFolder="demo_tools"
                    brandName="SolidFrame"
                    hideNav={true}
                />
            </div>

            <main className="flex-1 relative overflow-hidden flex flex-col min-w-0">
                {/* Header */}
                <header className="min-h-[56px] md:h-16 border-b border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 md:px-6 py-3 sm:py-0 bg-white gap-2 sm:gap-0">
                    <div className="flex items-center gap-3 md:gap-4">
                        <Link href={`/client-demo${tokenParam}`} className="p-2 hover:bg-gray-100 rounded-md transition-colors text-gray-500 hover:text-gray-900">
                            <ArrowLeft size={20} />
                        </Link>
                        <div className="p-2 md:p-2.5 rounded-lg bg-[#5f3bff]/10 border border-[#5f3bff]/20 hidden sm:block">
                            <DollarSign size={22} className="text-[#5f3bff]" />
                        </div>
                        <div>
                            <h2 className="text-base md:text-xl font-semibold text-gray-900">
                                ROI Calculator
                            </h2>
                            <p className="text-xs md:text-sm text-gray-500">
                                See the revenue {businessName} is leaving on the table
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-2 md:gap-3">
                        <div className="px-2.5 py-1 md:px-3 md:py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-600 text-[10px] md:text-xs font-medium">
                            Demo Mode
                        </div>
                        <button
                            onClick={handleReset}
                            className="text-gray-500 hover:text-gray-900 px-3 py-1.5 md:px-4 md:py-2 rounded-md hover:bg-gray-100 transition-all flex items-center gap-1.5 md:gap-2 text-xs md:text-sm"
                        >
                            <RotateCcw size={14} className="md:hidden" />
                            <RotateCcw size={16} className="hidden md:block" />
                            Reset
                        </button>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 p-4 md:p-6 flex flex-col overflow-y-auto">
                    <div className="max-w-7xl mx-auto w-full h-full flex-1 flex flex-col">
                        <AnimatePresence mode="wait">
                            {!showResults ? (
                                <motion.div
                                    key="questionnaire"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="max-w-2xl mx-auto h-full"
                                >
                                    <ROIQuestionnaire
                                        inputs={inputs}
                                        setInputs={setInputs}
                                        applySolutionDefaults={applySolutionDefaults}
                                        onComplete={() => setShowResults(true)}
                                    />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="results"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="max-w-4xl mx-auto w-full space-y-6 py-4"
                                >
                                    <ROIVisualization results={results} inputs={inputs} setInputs={setInputs} applySolutionDefaults={applySolutionDefaults} />

                                    <div className="p-4 rounded-lg bg-white border border-gray-200 shadow-sm">
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                Adjust Inputs
                                            </h3>
                                            <button
                                                onClick={() => setShowResults(false)}
                                                className="text-xs text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                                            >
                                                ← Back to questions
                                            </button>
                                        </div>
                                        <ROIInputsCompact
                                            inputs={inputs}
                                            setInputs={setInputs}
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </main>
        </div>
    )
}
