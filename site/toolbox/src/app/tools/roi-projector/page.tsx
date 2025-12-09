'use client'

import { useState } from 'react'
import ToolboxSidebar from '@/components/ToolboxSidebar'
import { DollarSign, ArrowLeft, Download, RotateCcw } from 'lucide-react'
import { pdf } from '@react-pdf/renderer'
import ROIReport from '@/components/tools/roi/ROIReport'
import Link from 'next/link'
import { useROICalculator } from '@/lib/hooks/use-roi-calculator'
import ROIQuestionnaire from '@/components/tools/roi/ROIQuestionnaire'
import ROIVisualization from '@/components/tools/roi/ROIVisualization'
import { motion, AnimatePresence } from 'framer-motion'

export default function ROIProjectorPage() {
    const userEmail = 'dev@solidframe.ai'
    const { inputs, setInputs, results, applySolutionDefaults } = useROICalculator()
    const [showResults, setShowResults] = useState(false)

    const handleReset = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('solidframe_roi_inputs_v4')
            window.location.reload()
        }
    }

    const handleExport = async () => {
        try {
            const blob = await pdf(<ROIReport inputs={inputs} results={results} />).toBlob()
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `SolidFrame_Growth_Blueprint_${new Date().toISOString().split('T')[0]}.pdf`
            link.click()
            URL.revokeObjectURL(url)
        } catch (error) {
            console.error("PDF Generation failed:", error)
            alert("Failed to generate report. Please try again.")
        }
    }

    return (
        <div className="flex h-screen bg-slate-100 text-slate-900">
            {/* Sidebar - hidden on mobile */}
            <div className="hidden md:block">
                <ToolboxSidebar
                    userEmail={userEmail}
                    activeFolder="sales_demos"
                />
            </div>

            <main className="flex-1 relative overflow-hidden flex flex-col min-w-0">
                {/* Header */}
                <header className="h-16 border-b border-slate-200 flex items-center justify-between px-4 md:px-6 bg-white shrink-0">
                    <div className="flex items-center gap-3 md:gap-4 min-w-0">
                        <Link href="/" className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-900 shrink-0">
                            <ArrowLeft size={20} />
                        </Link>
                        <div className="p-2.5 rounded-xl bg-slate-900 shadow-sm shrink-0">
                            <DollarSign size={20} className="text-amber-400" />
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-lg md:text-xl font-semibold text-slate-900 truncate">
                                ROI Projector
                            </h2>
                            <p className="text-xs md:text-sm text-slate-500 hidden sm:block">
                                Show them the cost of inaction
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-2 md:gap-3 shrink-0">
                        <button
                            onClick={handleReset}
                            className="text-slate-500 hover:text-slate-900 p-2 md:px-4 md:py-2 rounded-lg hover:bg-slate-100 transition-all flex items-center gap-2 text-sm font-medium"
                        >
                            <RotateCcw size={16} />
                            <span className="hidden sm:inline">Reset</span>
                        </button>
                        {showResults && (
                            <button
                                onClick={handleExport}
                                className="bg-slate-900 text-white p-2 md:px-4 md:py-2.5 rounded-lg font-medium text-sm hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-sm"
                            >
                                <Download size={16} />
                                <span className="hidden sm:inline">Export PDF</span>
                            </button>
                        )}
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
                                    className="w-full max-w-2xl mx-auto h-full"
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
                                    className="max-w-5xl mx-auto w-full py-2"
                                >
                                    <ROIVisualization
                                        results={results}
                                        inputs={inputs}
                                        setInputs={setInputs}
                                        applySolutionDefaults={applySolutionDefaults}
                                        onBackToQuestions={() => setShowResults(false)}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </main>
        </div>
    )
}
