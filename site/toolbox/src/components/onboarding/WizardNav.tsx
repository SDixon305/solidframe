'use client'

import React from 'react'
import { ArrowLeft, ArrowRight, SkipForward, Check } from 'lucide-react'

interface WizardNavProps {
    onBack?: () => void
    onSkip?: () => void
    onNext?: () => void
    onFinish?: () => void
    isFirstStep?: boolean
    isLastStep?: boolean
    canSkip?: boolean
    nextDisabled?: boolean
    nextLabel?: string
    isLoading?: boolean
}

export default function WizardNav({
    onBack,
    onSkip,
    onNext,
    onFinish,
    isFirstStep = false,
    isLastStep = false,
    canSkip = false,
    nextDisabled = false,
    nextLabel,
    isLoading = false,
}: WizardNavProps) {
    const handleNext = () => {
        if (isLastStep && onFinish) {
            onFinish()
        } else if (onNext) {
            onNext()
        }
    }

    const buttonLabel = nextLabel || (isLastStep ? 'Finish Setup' : 'Continue')

    return (
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            {/* Back Button */}
            <div>
                {!isFirstStep && onBack && (
                    <button
                        onClick={onBack}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                    >
                        <ArrowLeft size={16} />
                        Back
                    </button>
                )}
            </div>

            {/* Right Side: Skip + Next */}
            <div className="flex items-center gap-3">
                {/* Skip Button */}
                {canSkip && onSkip && !isLastStep && (
                    <button
                        onClick={onSkip}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                    >
                        <SkipForward size={16} />
                        Skip for now
                    </button>
                )}

                {/* Next/Finish Button */}
                <button
                    onClick={handleNext}
                    disabled={nextDisabled || isLoading}
                    className={`flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                        isLastStep
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/40'
                            : 'bg-[#5f3bff] hover:bg-[#4f2fe0] text-white shadow-lg shadow-[#5f3bff]/25 hover:shadow-[#5f3bff]/40'
                    } disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none`}
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="none"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                            </svg>
                            Processing...
                        </>
                    ) : (
                        <>
                            {buttonLabel}
                            {isLastStep ? (
                                <Check size={16} strokeWidth={3} />
                            ) : (
                                <ArrowRight size={16} />
                            )}
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}
