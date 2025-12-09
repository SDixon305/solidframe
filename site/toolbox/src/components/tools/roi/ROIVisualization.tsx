'use client'

import React, { useState } from 'react'
import { ROIResults, ROIInputs, SolutionType } from '@/lib/hooks/use-roi-calculator'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, TrendingDown, Voicemail, Headphones, Users, Zap, Info } from 'lucide-react'

interface ROIVisualizationProps {
    results: ROIResults
    inputs: ROIInputs
    setInputs: React.Dispatch<React.SetStateAction<ROIInputs>>
    applySolutionDefaults: (solutionType: SolutionType) => void
    onBackToQuestions?: () => void
}

// Tooltip descriptions for each input
const INPUT_TOOLTIPS: Record<string, string> = {
    currentSolution: "What's handling your after-hours calls right now?",
    missedCallsPerWeek: "Estimate how many calls go unanswered each week.",
    emergencyPercent: "What portion of missed calls are urgent emergencies?",
    emergencyTicketValue: "Average revenue from an emergency service call.",
    serviceTicketValue: "Average revenue from a standard service appointment.",
    aiEmergencyBookingRate: "How often AI successfully books emergency calls.",
    aiServiceBookingRate: "How often AI successfully books service appointments.",
}

// Tooltip component
function Tooltip({ children, content }: { children: React.ReactNode; content: string }) {
    const [isVisible, setIsVisible] = useState(false)

    return (
        <div className="relative inline-flex items-center gap-1.5">
            <span
                className="cursor-help"
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
            >
                {children}
            </span>
            <Info
                size={12}
                className="text-slate-400 hover:text-slate-600 cursor-help transition-colors"
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
            />
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 bottom-full mb-2 z-50 w-48 p-2 text-xs text-white bg-slate-800 rounded-lg shadow-lg"
                    >
                        {content}
                        <div className="absolute left-3 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-800" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

const SOLUTION_OPTIONS: { type: SolutionType; label: string; icon: React.ReactNode }[] = [
    { type: 'voicemail', label: 'Voicemail', icon: <Voicemail size={14} /> },
    { type: 'answering_service', label: 'Call Service', icon: <Headphones size={14} /> },
    { type: 'in_house_staff', label: 'In-house', icon: <Users size={14} /> }
]

export default function ROIVisualization({ results, inputs, setInputs, applySolutionDefaults, onBackToQuestions }: ROIVisualizationProps) {
    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val)
    }

    const handleInputChange = (key: keyof ROIInputs, value: number) => {
        setInputs(prev => ({ ...prev, [key]: value }))
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full"
        >
            {/* Two Column Layout: Results Left, Settings Right */}
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
                {/* LEFT COLUMN - Results */}
                <div className="flex-1 lg:max-w-sm space-y-4">
                    {/* Loss Card */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-1.5 rounded-md bg-rose-100">
                                <TrendingDown size={14} className="text-rose-600" />
                            </div>
                            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                                Currently Losing
                            </span>
                        </div>
                        <div className="flex items-baseline justify-between">
                            <motion.div
                                key={results.totalCurrentLoss}
                                initial={{ opacity: 0.5 }}
                                animate={{ opacity: 1 }}
                                className="text-2xl font-bold text-rose-600"
                            >
                                {formatCurrency(results.totalCurrentLoss)}
                                <span className="text-sm text-rose-400 font-semibold">/yr</span>
                            </motion.div>
                            <div className="text-sm text-rose-500 font-medium">
                                {formatCurrency(results.totalCurrentLoss / 12)}/mo
                            </div>
                        </div>
                    </div>

                    {/* NET GAIN HERO - Compact but impactful */}
                    <motion.div
                        initial={{ scale: 0.98, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.15, type: "spring", stiffness: 300 }}
                        className="relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 p-5 shadow-lg shadow-emerald-500/20"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16" />
                        <div className="relative">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-1.5 bg-white/20 rounded-lg">
                                    <TrendingUp size={16} className="text-white" />
                                </div>
                                <span className="text-emerald-100 text-xs font-semibold uppercase tracking-wider">
                                    Your Net Gain
                                </span>
                            </div>
                            <div className="flex items-baseline justify-between">
                                <motion.div
                                    key={results.netAnnualGain}
                                    initial={{ scale: 0.95 }}
                                    animate={{ scale: 1 }}
                                    className="text-3xl sm:text-4xl font-bold text-white tracking-tight"
                                >
                                    +{formatCurrency(results.netAnnualGain)}
                                    <span className="text-base text-emerald-200 font-semibold">/yr</span>
                                </motion.div>
                                <div className="bg-white/15 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-white/20">
                                    <div className="text-emerald-100 text-[10px] font-medium uppercase">Monthly</div>
                                    <div className="text-lg font-bold text-white">
                                        +{formatCurrency(results.netMonthlyGain)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Quick Stats Row */}
                    <div className="grid grid-cols-3 gap-2">
                        <div className="bg-white rounded-lg border border-gray-200 p-3 text-center">
                            <div className="text-lg font-bold text-slate-900">{inputs.missedCallsPerWeek}</div>
                            <div className="text-[10px] text-slate-400 uppercase">Calls/wk</div>
                        </div>
                        <div className="bg-white rounded-lg border border-gray-200 p-3 text-center">
                            <div className="text-lg font-bold text-slate-900">${inputs.emergencyTicketValue}</div>
                            <div className="text-[10px] text-slate-400 uppercase">Emerg $</div>
                        </div>
                        <div className="bg-white rounded-lg border border-gray-200 p-3 text-center">
                            <div className="text-lg font-bold text-slate-900">${inputs.serviceTicketValue}</div>
                            <div className="text-[10px] text-slate-400 uppercase">Service $</div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN - Always Visible Settings */}
                <div className="flex-1 lg:max-w-md space-y-4">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                        <div className="flex items-center gap-2 mb-4">
                            <Zap size={14} className="text-amber-500" />
                            <span className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                                Adjust Inputs
                            </span>
                        </div>

                        {/* Ticket Values - First */}
                        <div className="grid grid-cols-2 gap-2 mb-4">
                            <div className="group/input p-2 -m-2 rounded-lg transition-all duration-300 hover:bg-gradient-to-br hover:from-amber-50/50 hover:to-transparent hover:shadow-[inset_0_0_15px_rgba(251,191,36,0.1)]">
                                <Tooltip content={INPUT_TOOLTIPS.emergencyTicketValue}>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">Emergency $</label>
                                </Tooltip>
                                <input
                                    type="number"
                                    min={200}
                                    max={1500}
                                    step={50}
                                    value={inputs.emergencyTicketValue}
                                    onChange={(e) => handleInputChange('emergencyTicketValue', Number(e.target.value))}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg min-h-[40px] py-1.5 px-2 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all"
                                />
                            </div>
                            <div className="group/input p-2 -m-2 rounded-lg transition-all duration-300 hover:bg-gradient-to-br hover:from-blue-50/50 hover:to-transparent hover:shadow-[inset_0_0_15px_rgba(59,130,246,0.1)]">
                                <Tooltip content={INPUT_TOOLTIPS.serviceTicketValue}>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">Service $</label>
                                </Tooltip>
                                <input
                                    type="number"
                                    min={100}
                                    max={500}
                                    step={25}
                                    value={inputs.serviceTicketValue}
                                    onChange={(e) => handleInputChange('serviceTicketValue', Number(e.target.value))}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg min-h-[40px] py-1.5 px-2 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition-all"
                                />
                            </div>
                        </div>

                        {/* Current Solution */}
                        <div className="mb-4 group/section p-3 -mx-3 rounded-lg transition-all duration-300 hover:bg-gradient-to-r hover:from-slate-50 hover:to-transparent hover:shadow-[inset_0_0_20px_rgba(148,163,184,0.1)]">
                            <Tooltip content={INPUT_TOOLTIPS.currentSolution}>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Current Solution</label>
                            </Tooltip>
                            <div className="grid grid-cols-3 gap-1.5">
                                {SOLUTION_OPTIONS.map((option) => (
                                    <button
                                        key={option.type}
                                        onClick={() => applySolutionDefaults(option.type)}
                                        className={`min-h-[40px] py-2 px-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1 ${
                                            inputs.solutionType === option.type
                                                ? 'bg-slate-900 text-white shadow-sm'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                    >
                                        {option.icon}
                                        <span>{option.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Sliders */}
                        <div className="space-y-3">
                            <div className="group/slider p-3 -mx-3 rounded-lg transition-all duration-300 hover:bg-gradient-to-r hover:from-amber-50/50 hover:to-transparent hover:shadow-[inset_0_0_20px_rgba(251,191,36,0.1)]">
                                <div className="flex justify-between text-xs mb-1">
                                    <Tooltip content={INPUT_TOOLTIPS.missedCallsPerWeek}>
                                        <span className="font-semibold text-slate-700">Missed Calls/Week</span>
                                    </Tooltip>
                                    <span className="font-bold text-slate-900">{inputs.missedCallsPerWeek}</span>
                                </div>
                                <input
                                    type="range"
                                    min={0}
                                    max={40}
                                    value={inputs.missedCallsPerWeek}
                                    onChange={(e) => handleInputChange('missedCallsPerWeek', Number(e.target.value))}
                                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900 touch-pan-y transition-all group-hover/slider:h-2"
                                />
                            </div>
                            <div className="group/slider p-3 -mx-3 rounded-lg transition-all duration-300 hover:bg-gradient-to-r hover:from-rose-50/50 hover:to-transparent hover:shadow-[inset_0_0_20px_rgba(244,63,94,0.08)]">
                                <div className="flex justify-between text-xs mb-1">
                                    <Tooltip content={INPUT_TOOLTIPS.emergencyPercent}>
                                        <span className="font-semibold text-slate-700">% Emergencies</span>
                                    </Tooltip>
                                    <span className="font-bold text-slate-900">{inputs.emergencyPercent}%</span>
                                </div>
                                <input
                                    type="range"
                                    min={10}
                                    max={50}
                                    value={inputs.emergencyPercent}
                                    onChange={(e) => handleInputChange('emergencyPercent', Number(e.target.value))}
                                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900 touch-pan-y transition-all group-hover/slider:h-2"
                                />
                            </div>
                        </div>

                        {/* AI Rates */}
                        <div className="mt-4 pt-4 border-t border-slate-100">
                            <label className="block text-sm font-bold text-slate-800 mb-3 uppercase tracking-wider">AI Booking Rates</label>
                            <div className="space-y-2">
                                <div className="group/slider p-3 -mx-3 rounded-lg transition-all duration-300 hover:bg-gradient-to-r hover:from-emerald-50/50 hover:to-transparent hover:shadow-[inset_0_0_20px_rgba(16,185,129,0.1)]">
                                    <div className="flex justify-between text-xs mb-1">
                                        <Tooltip content={INPUT_TOOLTIPS.aiEmergencyBookingRate}>
                                            <span className="font-semibold text-slate-700">Emergency Rate</span>
                                        </Tooltip>
                                        <span className="font-bold text-emerald-600">{inputs.aiEmergencyBookingRate}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min={50}
                                        max={100}
                                        value={inputs.aiEmergencyBookingRate}
                                        onChange={(e) => handleInputChange('aiEmergencyBookingRate', Number(e.target.value))}
                                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 touch-pan-y transition-all group-hover/slider:h-2"
                                    />
                                </div>
                                <div className="group/slider p-3 -mx-3 rounded-lg transition-all duration-300 hover:bg-gradient-to-r hover:from-emerald-50/50 hover:to-transparent hover:shadow-[inset_0_0_20px_rgba(16,185,129,0.1)]">
                                    <div className="flex justify-between text-xs mb-1">
                                        <Tooltip content={INPUT_TOOLTIPS.aiServiceBookingRate}>
                                            <span className="font-semibold text-slate-700">Service Rate</span>
                                        </Tooltip>
                                        <span className="font-bold text-emerald-600">{inputs.aiServiceBookingRate}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min={50}
                                        max={100}
                                        value={inputs.aiServiceBookingRate}
                                        onChange={(e) => handleInputChange('aiServiceBookingRate', Number(e.target.value))}
                                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 touch-pan-y transition-all group-hover/slider:h-2"
                                    />
                                </div>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-2 italic">
                                Your current solution: ~{inputs.currentEmergencyBookingRate}% emergency booking
                            </p>
                        </div>

                        {onBackToQuestions && (
                            <button
                                onClick={onBackToQuestions}
                                className="mt-4 text-xs text-slate-500 hover:text-slate-700 transition-colors font-medium"
                            >
                                ← Start over
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
