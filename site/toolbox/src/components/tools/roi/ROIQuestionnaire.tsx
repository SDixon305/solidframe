'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Phone,
    PhoneMissed,
    Voicemail,
    Headphones,
    Users,
    Flame,
    Wrench,
    ChevronDown,
    ChevronUp,
    Check,
    Settings
} from 'lucide-react'
import {
    ROIInputs,
    SolutionType,
    SOLUTION_DEFAULTS
} from '@/lib/hooks/use-roi-calculator'

interface ROIQuestionnaireProps {
    inputs: ROIInputs
    setInputs: React.Dispatch<React.SetStateAction<ROIInputs>>
    applySolutionDefaults: (solutionType: SolutionType) => void
    onComplete?: () => void
}

interface QuestionProps {
    question: string
    subtext?: string
    children: React.ReactNode
    isActive: boolean
    isCompleted: boolean
    stepNumber: number
    onEdit: () => void
}

function Question({ question, subtext, children, isActive, isCompleted, stepNumber, onEdit }: QuestionProps) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`
                rounded-2xl border transition-all duration-300
                ${isActive
                    ? 'bg-zinc-900/80 border-amber-500/30 shadow-[0_0_30px_rgba(251,191,36,0.1)]'
                    : isCompleted
                        ? 'bg-zinc-900/40 border-white/5 cursor-pointer hover:border-white/20'
                        : 'bg-zinc-900/20 border-white/5 opacity-50'
                }
            `}
            onClick={isCompleted && !isActive ? onEdit : undefined}
        >
            <div className={`p-6 ${isActive ? '' : 'py-4'}`}>
                <div className="flex items-start gap-4">
                    <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0
                        ${isCompleted ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white/60'}
                    `}>
                        {isCompleted ? <Check size={16} /> : stepNumber}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className={`font-medium ${isActive ? 'text-lg text-white' : 'text-base text-zinc-400'}`}>
                            {question}
                        </h3>
                        {subtext && isActive && (
                            <p className="text-sm text-zinc-500 mt-1">{subtext}</p>
                        )}

                        <AnimatePresence>
                            {isActive && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mt-6"
                                >
                                    {children}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

interface SliderInputProps {
    value: number
    onChange: (value: number) => void
    min: number
    max: number
    step?: number
    formatValue: (value: number) => string
    color?: 'amber' | 'rose' | 'emerald'
}

function SliderInput({ value, onChange, min, max, step = 1, formatValue, color = 'amber' }: SliderInputProps) {
    const colorClasses = {
        amber: 'accent-amber-500',
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
                    className="text-4xl font-mono font-bold text-white"
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
                className={`w-full h-3 bg-zinc-800 rounded-lg appearance-none cursor-pointer ${colorClasses[color]} transition-all`}
            />
            <div className="flex justify-between text-xs text-zinc-600 font-mono">
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
    const [showAssumptions, setShowAssumptions] = useState(false)

    const handleNext = () => {
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1)
        }
    }

    const handleStepClick = (step: number) => {
        if (step <= currentStep) {
            setCurrentStep(step)
        }
    }

    const handleInputChange = (key: keyof ROIInputs, value: number | SolutionType) => {
        setInputs(prev => ({ ...prev, [key]: value }))
    }

    const handleSolutionSelect = (solutionType: SolutionType) => {
        applySolutionDefaults(solutionType)
        // Auto-advance after selection
        setTimeout(() => handleNext(), 300)
    }

    return (
        <div className="space-y-4">
            {/* Question 1: After-Hours Calls */}
            <Question
                stepNumber={1}
                question="How many after-hours calls do you get per week?"
                subtext="Calls that come in when you can't answer live"
                isActive={currentStep === 0}
                isCompleted={currentStep > 0}
                onEdit={() => handleStepClick(0)}
            >
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
                    className="mt-6 w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 px-6 rounded-xl transition-all cursor-pointer"
                >
                    Continue
                </button>
            </Question>

            {/* Question 2: Current Solution */}
            <Question
                stepNumber={2}
                question="How do you currently handle after-hours calls?"
                isActive={currentStep === 1}
                isCompleted={currentStep > 1}
                onEdit={() => handleStepClick(1)}
            >
                <div className="grid gap-3">
                    {SOLUTION_OPTIONS.map((option) => (
                        <button
                            key={option.type}
                            onClick={() => handleSolutionSelect(option.type)}
                            className={`
                                flex items-center gap-4 p-4 rounded-xl border transition-all text-left cursor-pointer
                                ${inputs.solutionType === option.type
                                    ? 'bg-amber-500/10 border-amber-500/50 text-white'
                                    : 'bg-zinc-800/50 border-white/10 text-zinc-300 hover:border-white/30'
                                }
                            `}
                        >
                            <div className={`
                                p-3 rounded-lg
                                ${inputs.solutionType === option.type ? 'bg-amber-500/20 text-amber-400' : 'bg-white/5 text-zinc-400'}
                            `}>
                                {option.icon}
                            </div>
                            <div>
                                <div className="font-medium">{option.label}</div>
                                <div className="text-sm text-zinc-500">{option.description}</div>
                            </div>
                            {inputs.solutionType === option.type && (
                                <Check size={20} className="ml-auto text-amber-400" />
                            )}
                        </button>
                    ))}
                </div>
            </Question>

            {/* Question 3: Emergency Ticket Value */}
            <Question
                stepNumber={3}
                question="What's your average emergency job worth?"
                subtext="No heat, gas leak, AC out in summer - the urgent ones"
                isActive={currentStep === 2}
                isCompleted={currentStep > 2}
                onEdit={() => handleStepClick(2)}
            >
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
                    className="mt-6 w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 px-6 rounded-xl transition-all cursor-pointer"
                >
                    Continue
                </button>
            </Question>

            {/* Question 4: Service Ticket Value */}
            <Question
                stepNumber={4}
                question="What about a routine service call?"
                subtext="Maintenance, tune-ups, non-urgent repairs"
                isActive={currentStep === 3}
                isCompleted={currentStep > 3}
                onEdit={() => handleStepClick(3)}
            >
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
                    onClick={() => {
                        setCurrentStep(4)
                        onComplete?.()
                    }}
                    className="mt-6 w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3 px-6 rounded-xl transition-all cursor-pointer"
                >
                    Show My Results
                </button>
            </Question>

            {/* Assumptions Section (collapsible) */}
            {currentStep >= 1 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="rounded-xl border border-white/5 bg-zinc-900/30"
                >
                    <button
                        onClick={() => setShowAssumptions(!showAssumptions)}
                        className="w-full flex items-center justify-between p-4 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
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
                                <div className="p-4 pt-0 space-y-6 border-t border-white/5">
                                    {/* Emergency % */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-3">
                                            <Flame size={14} className="text-rose-400" />
                                            <label className="text-xs text-zinc-400 uppercase tracking-wide">
                                                Emergency Call %
                                            </label>
                                            <span className="ml-auto text-sm font-mono text-white">
                                                {inputs.emergencyPercent}%
                                            </span>
                                        </div>
                                        <input
                                            type="range"
                                            min={10}
                                            max={50}
                                            value={inputs.emergencyPercent}
                                            onChange={(e) => handleInputChange('emergencyPercent', Number(e.target.value))}
                                            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                                        />
                                        <p className="text-[10px] text-zinc-600 mt-1">
                                            Industry average: ~25% of HVAC calls are emergencies
                                        </p>
                                    </div>

                                    {/* Current Booking Rates */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-3">
                                            <Phone size={14} className="text-orange-400" />
                                            <label className="text-xs text-zinc-400 uppercase tracking-wide">
                                                Current Emergency Booking Rate
                                            </label>
                                            <span className="ml-auto text-sm font-mono text-white">
                                                {inputs.currentEmergencyBookingRate}%
                                            </span>
                                        </div>
                                        <input
                                            type="range"
                                            min={10}
                                            max={90}
                                            value={inputs.currentEmergencyBookingRate}
                                            onChange={(e) => handleInputChange('currentEmergencyBookingRate', Number(e.target.value))}
                                            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                                        />
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2 mb-3">
                                            <Wrench size={14} className="text-blue-400" />
                                            <label className="text-xs text-zinc-400 uppercase tracking-wide">
                                                Current Service Booking Rate
                                            </label>
                                            <span className="ml-auto text-sm font-mono text-white">
                                                {inputs.currentServiceBookingRate}%
                                            </span>
                                        </div>
                                        <input
                                            type="range"
                                            min={20}
                                            max={90}
                                            value={inputs.currentServiceBookingRate}
                                            onChange={(e) => handleInputChange('currentServiceBookingRate', Number(e.target.value))}
                                            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                        />
                                    </div>

                                    {/* Current Solution Cost */}
                                    {inputs.solutionType !== 'voicemail' && (
                                        <div>
                                            <div className="flex items-center gap-2 mb-3">
                                                <label className="text-xs text-zinc-400 uppercase tracking-wide">
                                                    Current Monthly Cost
                                                </label>
                                                <span className="ml-auto text-sm font-mono text-white">
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
                                                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-500"
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
    )
}
