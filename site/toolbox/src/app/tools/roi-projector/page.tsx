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
import ROIInputsCompact from '@/components/tools/roi/ROIInputsCompact'
import { motion, AnimatePresence } from 'framer-motion'

export default function ROIProjectorPage() {
    const userEmail = 'dev@solidframe.ai'
    const { inputs, setInputs, results, applySolutionDefaults } = useROICalculator()
    const [showResults, setShowResults] = useState(false)

    const handleReset = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('solidframe_roi_inputs_v2')
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
        <div className="flex h-screen font-sans text-white transition-colors duration-500">
            <ToolboxSidebar
                userEmail={userEmail}
                activeFolder="sales_demos"
            />

            <main className="flex-1 relative overflow-hidden flex flex-col z-10 bg-[#09090b]">
                {/* Header */}
                <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-black/20 backdrop-blur-sm z-20">
                    <div className="flex items-center gap-6">
                        <Link href="/" className="p-2 hover:bg-white/10 rounded-lg transition-colors text-zinc-400 hover:text-white">
                            <ArrowLeft size={24} />
                        </Link>
                        <div className={`p-3 rounded-xl border bg-amber-500/10 border-amber-500/30 shadow-[0_0_20px_rgba(251,191,36,0.2)]`}>
                            <DollarSign size={24} className="text-amber-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold tracking-tight text-white">
                                ROI Projector
                            </h2>
                            <p className="text-sm text-zinc-500">
                                Show them the cost of inaction
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={handleReset}
                            className="text-zinc-400 hover:text-white px-4 py-2 rounded-lg hover:bg-white/5 transition-all flex items-center gap-2 text-sm"
                        >
                            <RotateCcw size={16} />
                            Reset
                        </button>
                        {showResults && (
                            <button
                                onClick={handleExport}
                                className="bg-white text-black px-5 py-2 rounded-lg font-bold uppercase tracking-wider text-xs hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all flex items-center gap-2"
                            >
                                <Download size={16} />
                                Export PDF
                            </button>
                        )}
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    <div className="max-w-7xl mx-auto">
                        <AnimatePresence mode="wait">
                            {!showResults ? (
                                <motion.div
                                    key="questionnaire"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="max-w-2xl mx-auto"
                                >
                                    <div className="text-center mb-8">
                                        <h1 className="text-2xl font-bold text-white mb-2">
                                            Let&apos;s calculate your ROI
                                        </h1>
                                        <p className="text-zinc-500">
                                            Answer a few questions about your business
                                        </p>
                                    </div>
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
                                    className="max-w-3xl mx-auto space-y-6"
                                >
                                    {/* Results on top */}
                                    <ROIVisualization results={results} />

                                    {/* Inputs below - calculator style */}
                                    <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/5">
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                                                Adjust Inputs
                                            </h3>
                                            <button
                                                onClick={() => setShowResults(false)}
                                                className="text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                                            >
                                                Back to questions
                                            </button>
                                        </div>
                                        <ROIInputsCompact
                                            inputs={inputs}
                                            setInputs={setInputs}
                                            applySolutionDefaults={applySolutionDefaults}
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
