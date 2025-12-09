'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Phone,
    Voicemail,
    Headphones,
    Users,
    Flame,
    Wrench,
    Check,
    Settings,
    ChevronDown,
    ChevronUp
} from 'lucide-react'
import {
    ROIInputs,
    SolutionType
} from '@/lib/hooks/use-roi-calculator'

interface ROIQuestionnaireProps {
    inputs: ROIInputs
    setInputs: React.Dispatch<React.SetStateAction<ROIInputs>>
    applySolutionDefaults: (solutionType: SolutionType) => void
    onComplete?: () => void
}

// Progress indicator component
function ProgressBar({ currentStep, totalSteps, onStepClick }: {
    currentStep: number
    totalSteps: number
    onStepClick: (step: number) => void
}) {
    return (
        <div className="flex items-center justify-center gap-1.5 sm:gap-2">
            {Array.from({ length: totalSteps }).map((_, index) => (
                <React.Fragment key={index}>
                    <button
                        onClick={() => index < currentStep && onStepClick(index)}
                        disabled={index > currentStep}
                        className={`
                            relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center
                            transition-all duration-300 text-sm font-semibold
                            ${index < currentStep
                                ? 'bg-emerald-100 text-emerald-600 cursor-pointer hover:bg-emerald-200'
                                : index === currentStep
                                    ? 'bg-[#5f3bff]/10 text-[#5f3bff] ring-2 ring-[#5f3bff]/30'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }
                        `}
                    >
                        {index < currentStep ? <Check size={16} /> : index + 1}
                    </button>
                    {index < totalSteps - 1 && (
                        <div className={`w-4 sm:w-8 h-0.5 transition-colors duration-300 ${
                            index < currentStep ? 'bg-emerald-300' : 'bg-gray-200'
                        }`} />
                    )}
                </React.Fragment>
            ))}
        </div>
    )
}

interface SliderInputProps {
    value: number
    onChange: (value: number) => void
    min: number
    max: number
    step?: number
    formatValue: (value: number) => string
    color?: 'purple' | 'rose' | 'emerald'
}

function SliderInput({ value, onChange, min, max, step = 1, formatValue, color = 'purple' }: SliderInputProps) {
    const colorClasses = {
        purple: 'accent-[#5f3bff]',
        rose: 'accent-rose-500',
        emerald: 'accent-emerald-500'
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-center">
                <motion.span
                    key={value}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    className="text-4xl font-semibold text-gray-900"
                >
                    {formatValue(value)}
                </motion.span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer ${colorClasses[color]} transition-all`}
            />
            <div className="flex justify-between text-xs text-gray-400">
                <span>{formatValue(min)}</span>
                <span>{formatValue(max)}</span>
            </div>
        </div>
    )
}

interface SolutionOption {
    type: SolutionType
    label: string
    icon: React.ReactNode
    description: string
}

const SOLUTION_OPTIONS: SolutionOption[] = [
    {
        type: 'voicemail',
        label: 'Voicemail',
        icon: <Voicemail size={24} />,
        description: 'Calls go to voicemail, you call back later'
    },
    {
        type: 'answering_service',
        label: 'Answering Service',
        icon: <Headphones size={24} />,
        description: 'Live operators take messages'
    },
    {
        type: 'in_house_staff',
        label: 'In-house Staff',
        icon: <Users size={24} />,
        description: 'Your own team handles calls'
    }
]

export default function ROIQuestionnaire({ inputs, setInputs, applySolutionDefaults, onComplete }: ROIQuestionnaireProps) {
    const [currentStep, setCurrentStep] = useState(0)
    const [direction, setDirection] = useState(1) // 1 = forward, -1 = backward
    const [showAssumptions, setShowAssumptions] = useState(false)
    const totalSteps = 4

    const handleNext = () => {
        if (currentStep < totalSteps - 1) {
            setDirection(1)
            setCurrentStep(currentStep + 1)
        }
    }

    const handleBack = () => {
        if (currentStep > 0) {
            setDirection(-1)
            setCurrentStep(currentStep - 1)
        }
    }

    const handleStepClick = (step: number) => {
        if (step < currentStep) {
            setDirection(-1)
            setCurrentStep(step)
        }
    }

    const handleInputChange = (key: keyof ROIInputs, value: number | SolutionType) => {
        setInputs(prev => ({ ...prev, [key]: value }))
    }

    const handleSolutionSelect = (solutionType: SolutionType) => {
        applySolutionDefaults(solutionType)
        // Auto-advance after selection
        setTimeout(() => {
            setDirection(1)
            setCurrentStep(currentStep + 1)
        }, 300)
    }

    // Animation variants for slide transitions
    const slideVariants = {
        enter: (dir: number) => ({
            x: dir > 0 ? 100 : -100,
            opacity: 0
        }),
        center: {
            x: 0,
            opacity: 1
        },
        exit: (dir: number) => ({
            x: dir > 0 ? -100 : 100,
            opacity: 0
        })
    }

    // Question content for each step
    const questions = [
        {
            title: "How many after-hours calls do you get per week?",
            subtitle: "Calls that come in when you can't answer live",
            content: (
                <>
                    <SliderInput
                        value={inputs.missedCallsPerWeek}
                        onChange={(v) => handleInputChange('missedCallsPerWeek', v)}
                        min={0}
                        max={40}
                        step={1}
                        formatValue={(v) => `${v} calls`}
                        color="rose"
                    />
                    <button
                        onClick={handleNext}
                        className="mt-8 w-full bg-[#5f3bff] hover:bg-[#4f2fe0] text-white font-medium py-3 px-6 rounded-lg transition-colors cursor-pointer text-base"
                    >
                        Continue
                    </button>
                </>
            )
        },
        {
            title: "How do you currently handle after-hours calls?",
            subtitle: "Select your current solution",
            content: (
                <div className="grid gap-3">
                    {SOLUTION_OPTIONS.map((option) => (
                        <button
                            key={option.type}
                            onClick={() => handleSolutionSelect(option.type)}
                            className={`
                                flex items-center gap-4 p-4 rounded-lg border transition-all text-left cursor-pointer
                                ${inputs.solutionType === option.type
                                    ? 'bg-[#5f3bff]/5 border-[#5f3bff]/30 text-gray-900'
                                    : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                                }
                            `}
                        >
                            <div className={`
                                p-3 rounded-lg
                                ${inputs.solutionType === option.type ? 'bg-[#5f3bff]/10 text-[#5f3bff]' : 'bg-gray-100 text-gray-500'}
                            `}>
                                {option.icon}
                            </div>
                            <div>
                                <div className="font-medium">{option.label}</div>
                                <div className="text-sm text-gray-500">{option.description}</div>
                            </div>
                            {inputs.solutionType === option.type && (
                                <Check size={20} className="ml-auto text-[#5f3bff]" />
                            )}
                        </button>
                    ))}
                </div>
            )
        },
        {
            title: "What's your average emergency job worth?",
            subtitle: "No heat, gas leak, AC out in summer - the urgent ones",
            content: (
                <>
                    <SliderInput
                        value={inputs.emergencyTicketValue}
                        onChange={(v) => handleInputChange('emergencyTicketValue', v)}
                        min={200}
                        max={1500}
                        step={50}
                        formatValue={(v) => `$${v.toLocaleString()}`}
                        color="emerald"
                    />
                    <button
                        onClick={handleNext}
                        className="mt-8 w-full bg-[#5f3bff] hover:bg-[#4f2fe0] text-white font-medium py-3 px-6 rounded-lg transition-colors cursor-pointer text-base"
                    >
                        Continue
                    </button>
                </>
            )
        },
        {
            title: "What about a routine service call?",
            subtitle: "Maintenance, tune-ups, non-urgent repairs",
            content: (
                <>
                    <SliderInput
                        value={inputs.serviceTicketValue}
                        onChange={(v) => handleInputChange('serviceTicketValue', v)}
                        min={100}
                        max={500}
                        step={25}
                        formatValue={(v) => `$${v.toLocaleString()}`}
                        color="emerald"
                    />
                    <button
                        onClick={() => onComplete?.()}
                        className="mt-8 w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 px-6 rounded-lg transition-colors cursor-pointer text-base"
                    >
                        Show My Results
                    </button>
                </>
            )
        }
    ]

    return (
        <div className="flex flex-col h-full min-h-[500px]">
            {/* Progress Bar - Fixed at top */}
            <div className="shrink-0 mb-6">
                <ProgressBar
                    currentStep={currentStep}
                    totalSteps={totalSteps}
                    onStepClick={handleStepClick}
                />
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto">
                <div className="flex flex-col min-h-full">
                    {/* Question Container - Centered vertically */}
                    <div className="flex-1 flex flex-col justify-center py-4">
                        <AnimatePresence mode="wait" custom={direction}>
                            <motion.div
                                key={currentStep}
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="w-full"
                            >
                                {/* Question Header */}
                                <div className="text-center mb-6 md:mb-8 px-2">
                                    <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 mb-2">
                                        {questions[currentStep].title}
                                    </h2>
                                    <p className="text-sm sm:text-base text-gray-500">
                                        {questions[currentStep].subtitle}
                                    </p>
                                </div>

                                {/* Question Content */}
                                <div className="max-w-md mx-auto px-2">
                                    {questions[currentStep].content}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Back Button & Assumptions - At bottom of scroll area */}
                    <div className="shrink-0 mt-6 space-y-4">
                {currentStep > 0 && (
                    <button
                        onClick={handleBack}
                        className="w-full text-gray-500 hover:text-gray-700 py-2 transition-colors text-sm"
                    >
                        ← Back to previous question
                    </button>
                )}

                {/* Assumptions Section (collapsible) */}
                {currentStep >= 1 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="rounded-lg border border-gray-200 bg-white"
                    >
                        <button
                            onClick={() => setShowAssumptions(!showAssumptions)}
                            className="w-full flex items-center justify-between p-4 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                <Settings size={16} />
                                <span>Adjust assumptions</span>
                            </div>
                            {showAssumptions ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>

                        <AnimatePresence>
                            {showAssumptions && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="p-4 pt-0 space-y-6 border-t border-gray-100">
                                        {/* Emergency % */}
                                        <div>
                                            <div className="flex items-center gap-2 mb-3">
                                                <Flame size={14} className="text-rose-500" />
                                                <label className="text-xs text-gray-500 uppercase tracking-wide">
                                                    Emergency Call %
                                                </label>
                                                <span className="ml-auto text-sm font-medium text-gray-900">
                                                    {inputs.emergencyPercent}%
                                                </span>
                                            </div>
                                            <input
                                                type="range"
                                                min={10}
                                                max={50}
                                                value={inputs.emergencyPercent}
                                                onChange={(e) => handleInputChange('emergencyPercent', Number(e.target.value))}
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
                                            />
                                            <p className="text-xs text-gray-400 mt-1">
                                                Industry average: ~25% of HVAC calls are emergencies
                                            </p>
                                        </div>

                                        {/* Current Booking Rates */}
                                        <div>
                                            <div className="flex items-center gap-2 mb-3">
                                                <Phone size={14} className="text-orange-500" />
                                                <label className="text-xs text-gray-500 uppercase tracking-wide">
                                                    Current Emergency Booking Rate
                                                </label>
                                                <span className="ml-auto text-sm font-medium text-gray-900">
                                                    {inputs.currentEmergencyBookingRate}%
                                                </span>
                                            </div>
                                            <input
                                                type="range"
                                                min={10}
                                                max={90}
                                                value={inputs.currentEmergencyBookingRate}
                                                onChange={(e) => handleInputChange('currentEmergencyBookingRate', Number(e.target.value))}
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                                            />
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-2 mb-3">
                                                <Wrench size={14} className="text-blue-500" />
                                                <label className="text-xs text-gray-500 uppercase tracking-wide">
                                                    Current Service Booking Rate
                                                </label>
                                                <span className="ml-auto text-sm font-medium text-gray-900">
                                                    {inputs.currentServiceBookingRate}%
                                                </span>
                                            </div>
                                            <input
                                                type="range"
                                                min={20}
                                                max={90}
                                                value={inputs.currentServiceBookingRate}
                                                onChange={(e) => handleInputChange('currentServiceBookingRate', Number(e.target.value))}
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                            />
                                        </div>

                                        {/* Current Solution Cost */}
                                        {inputs.solutionType !== 'voicemail' && (
                                            <div>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <label className="text-xs text-gray-500 uppercase tracking-wide">
                                                        Current Monthly Cost
                                                    </label>
                                                    <span className="ml-auto text-sm font-medium text-gray-900">
                                                        ${inputs.currentMonthlyCost}/mo
                                                    </span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min={0}
                                                    max={1000}
                                                    step={50}
                                                    value={inputs.currentMonthlyCost}
                                                    onChange={(e) => handleInputChange('currentMonthlyCost', Number(e.target.value))}
                                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-500"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
                    </div>
                </div>
            </div>
        </div>
    )
}
