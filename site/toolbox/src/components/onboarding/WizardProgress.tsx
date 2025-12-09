'use client'

import React from 'react'
import { Check, Minus } from 'lucide-react'
import { ONBOARDING_STEPS, OnboardingStepId } from '@/types/onboarding'

interface WizardProgressProps {
    currentStep: OnboardingStepId
    completedSteps: OnboardingStepId[]
    skippedSteps: OnboardingStepId[]
    onStepClick?: (stepId: OnboardingStepId) => void
}

export default function WizardProgress({
    currentStep,
    completedSteps,
    skippedSteps,
    onStepClick,
}: WizardProgressProps) {
    const currentStepNumber = ONBOARDING_STEPS.find(s => s.id === currentStep)?.number ?? 1

    const getStepStatus = (stepId: OnboardingStepId) => {
        if (completedSteps.includes(stepId)) return 'completed'
        if (skippedSteps.includes(stepId)) return 'skipped'
        if (stepId === currentStep) return 'current'
        return 'upcoming'
    }

    const isClickable = (stepId: OnboardingStepId) => {
        const status = getStepStatus(stepId)
        return status === 'completed' || status === 'skipped' || status === 'current'
    }

    return (
        <div className="w-full">
            {/* Desktop Progress Bar */}
            <div className="hidden md:block">
                <div className="flex items-center justify-between relative">
                    {/* Background Line */}
                    <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200" />

                    {/* Progress Line */}
                    <div
                        className="absolute top-5 left-0 h-0.5 bg-[#5f3bff] transition-all duration-500"
                        style={{ width: `${((currentStepNumber - 1) / (ONBOARDING_STEPS.length - 1)) * 100}%` }}
                    />

                    {/* Steps */}
                    {ONBOARDING_STEPS.map((step) => {
                        const status = getStepStatus(step.id)
                        const clickable = isClickable(step.id)

                        return (
                            <div
                                key={step.id}
                                className="flex flex-col items-center relative z-10"
                            >
                                <button
                                    onClick={() => clickable && onStepClick?.(step.id)}
                                    disabled={!clickable}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                                        status === 'completed'
                                            ? 'bg-[#5f3bff] text-white cursor-pointer hover:bg-[#4f2fe0]'
                                            : status === 'skipped'
                                                ? 'bg-gray-300 text-gray-600 cursor-pointer hover:bg-gray-400'
                                                : status === 'current'
                                                    ? 'bg-[#5f3bff] text-white ring-4 ring-[#5f3bff]/20'
                                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    }`}
                                >
                                    {status === 'completed' ? (
                                        <Check size={18} strokeWidth={3} />
                                    ) : status === 'skipped' ? (
                                        <Minus size={18} strokeWidth={3} />
                                    ) : (
                                        <span className="text-sm font-semibold">{step.number}</span>
                                    )}
                                </button>
                                <span className={`mt-2 text-xs font-medium text-center max-w-[80px] ${
                                    status === 'current' ? 'text-[#5f3bff]' : 'text-gray-500'
                                }`}>
                                    {step.title}
                                </span>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Mobile Progress Bar */}
            <div className="md:hidden">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">
                        Step {currentStepNumber} of {ONBOARDING_STEPS.length}
                    </span>
                    <span className="text-sm text-gray-500">
                        {ONBOARDING_STEPS.find(s => s.id === currentStep)?.title}
                    </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-[#5f3bff] transition-all duration-500 rounded-full"
                        style={{ width: `${(currentStepNumber / ONBOARDING_STEPS.length) * 100}%` }}
                    />
                </div>

                {/* Step indicators for mobile */}
                <div className="flex justify-between mt-3">
                    {ONBOARDING_STEPS.map((step) => {
                        const status = getStepStatus(step.id)
                        return (
                            <button
                                key={step.id}
                                onClick={() => isClickable(step.id) && onStepClick?.(step.id)}
                                disabled={!isClickable(step.id)}
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                                    status === 'completed'
                                        ? 'bg-[#5f3bff] text-white'
                                        : status === 'skipped'
                                            ? 'bg-gray-300 text-gray-600'
                                            : status === 'current'
                                                ? 'bg-[#5f3bff] text-white ring-2 ring-[#5f3bff]/20'
                                                : 'bg-gray-200 text-gray-400'
                                }`}
                            >
                                {status === 'completed' ? (
                                    <Check size={12} strokeWidth={3} />
                                ) : status === 'skipped' ? (
                                    <Minus size={12} strokeWidth={3} />
                                ) : (
                                    step.number
                                )}
                            </button>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
