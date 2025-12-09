'use client'

import { useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
    OnboardingStepId,
    OnboardingData,
    OnboardingProgress,
    ONBOARDING_STEPS,
    getStepById,
    getNextStep,
    getPreviousStep,
    DEFAULT_ONBOARDING_PROGRESS,
} from '@/types/onboarding'

interface UseOnboardingOptions {
    tenantSlug: string
    initialProgress?: Partial<OnboardingProgress>
}

interface UseOnboardingReturn {
    // Current state
    currentStep: OnboardingStepId
    currentStepNumber: number
    totalSteps: number
    data: OnboardingData
    completedSteps: OnboardingStepId[]
    skippedSteps: OnboardingStepId[]
    isComplete: boolean
    isFirstStep: boolean
    isLastStep: boolean
    canSkip: boolean

    // Actions
    goToStep: (stepId: OnboardingStepId) => void
    goToNext: () => void
    goToPrevious: () => void
    skipStep: () => void
    updateData: (updates: Partial<OnboardingData>) => void
    completeStep: (stepId?: OnboardingStepId) => void
    finishOnboarding: () => void

    // Utilities
    isStepCompleted: (stepId: OnboardingStepId) => boolean
    isStepSkipped: (stepId: OnboardingStepId) => boolean
    isStepAccessible: (stepId: OnboardingStepId) => boolean
    getStepStatus: (stepId: OnboardingStepId) => 'completed' | 'skipped' | 'current' | 'upcoming'
}

export function useOnboarding({ tenantSlug, initialProgress }: UseOnboardingOptions): UseOnboardingReturn {
    const router = useRouter()

    // Initialize progress state
    const [progress, setProgress] = useState<OnboardingProgress>(() => ({
        ...DEFAULT_ONBOARDING_PROGRESS,
        ...initialProgress,
        startedAt: initialProgress?.startedAt || new Date().toISOString(),
    }))

    const currentStepInfo = useMemo(() => getStepById(progress.currentStep), [progress.currentStep])
    const currentStepNumber = currentStepInfo?.number ?? 1
    const totalSteps = ONBOARDING_STEPS.length

    const isFirstStep = currentStepNumber === 1
    const isLastStep = currentStepNumber === totalSteps
    const canSkip = currentStepInfo?.skippable ?? false

    // Save progress to localStorage (and eventually to API)
    const saveProgress = useCallback((newProgress: OnboardingProgress) => {
        try {
            localStorage.setItem(`onboarding-${tenantSlug}`, JSON.stringify(newProgress))
        } catch (e) {
            console.error('Failed to save onboarding progress:', e)
        }
    }, [tenantSlug])

    // Navigate to a specific step
    const goToStep = useCallback((stepId: OnboardingStepId) => {
        const step = getStepById(stepId)
        if (!step) return

        setProgress(prev => {
            const newProgress = { ...prev, currentStep: stepId }
            saveProgress(newProgress)
            return newProgress
        })

        router.push(`/${tenantSlug}/onboarding/${step.number}`)
    }, [tenantSlug, router, saveProgress])

    // Go to next step
    const goToNext = useCallback(() => {
        const nextStep = getNextStep(progress.currentStep)
        if (nextStep) {
            goToStep(nextStep.id)
        }
    }, [progress.currentStep, goToStep])

    // Go to previous step
    const goToPrevious = useCallback(() => {
        const prevStep = getPreviousStep(progress.currentStep)
        if (prevStep) {
            goToStep(prevStep.id)
        }
    }, [progress.currentStep, goToStep])

    // Skip current step
    const skipStep = useCallback(() => {
        if (!canSkip) return

        setProgress(prev => {
            const newSkipped = prev.skippedSteps.includes(prev.currentStep)
                ? prev.skippedSteps
                : [...prev.skippedSteps, prev.currentStep]

            const newProgress = { ...prev, skippedSteps: newSkipped }
            saveProgress(newProgress)
            return newProgress
        })

        goToNext()
    }, [canSkip, goToNext, saveProgress])

    // Update onboarding data
    const updateData = useCallback((updates: Partial<OnboardingData>) => {
        setProgress(prev => {
            const newProgress = {
                ...prev,
                data: { ...prev.data, ...updates },
            }
            saveProgress(newProgress)
            return newProgress
        })
    }, [saveProgress])

    // Mark a step as completed
    const completeStep = useCallback((stepId?: OnboardingStepId) => {
        const targetStep = stepId || progress.currentStep

        setProgress(prev => {
            const newCompleted = prev.completedSteps.includes(targetStep)
                ? prev.completedSteps
                : [...prev.completedSteps, targetStep]

            // Remove from skipped if it was there
            const newSkipped = prev.skippedSteps.filter(s => s !== targetStep)

            const newProgress = {
                ...prev,
                completedSteps: newCompleted,
                skippedSteps: newSkipped,
            }
            saveProgress(newProgress)
            return newProgress
        })
    }, [progress.currentStep, saveProgress])

    // Finish the entire onboarding
    const finishOnboarding = useCallback(() => {
        setProgress(prev => {
            const newProgress = {
                ...prev,
                isComplete: true,
                completedAt: new Date().toISOString(),
            }
            saveProgress(newProgress)
            return newProgress
        })

        // Navigate to dashboard
        router.push(`/${tenantSlug}`)
    }, [tenantSlug, router, saveProgress])

    // Check if a step is completed
    const isStepCompleted = useCallback((stepId: OnboardingStepId) => {
        return progress.completedSteps.includes(stepId)
    }, [progress.completedSteps])

    // Check if a step is skipped
    const isStepSkipped = useCallback((stepId: OnboardingStepId) => {
        return progress.skippedSteps.includes(stepId)
    }, [progress.skippedSteps])

    // Check if a step is accessible (can navigate to it)
    const isStepAccessible = useCallback((stepId: OnboardingStepId) => {
        const step = getStepById(stepId)
        if (!step) return false

        // Can always go back to completed/skipped steps
        if (isStepCompleted(stepId) || isStepSkipped(stepId)) return true

        // Can access current step
        if (stepId === progress.currentStep) return true

        // Can access next step after current
        const currentStep = getStepById(progress.currentStep)
        if (currentStep && step.number === currentStep.number + 1) return true

        return false
    }, [progress.currentStep, isStepCompleted, isStepSkipped])

    // Get step status for progress bar
    const getStepStatus = useCallback((stepId: OnboardingStepId): 'completed' | 'skipped' | 'current' | 'upcoming' => {
        if (isStepCompleted(stepId)) return 'completed'
        if (isStepSkipped(stepId)) return 'skipped'
        if (stepId === progress.currentStep) return 'current'
        return 'upcoming'
    }, [progress.currentStep, isStepCompleted, isStepSkipped])

    return {
        currentStep: progress.currentStep,
        currentStepNumber,
        totalSteps,
        data: progress.data,
        completedSteps: progress.completedSteps,
        skippedSteps: progress.skippedSteps,
        isComplete: progress.isComplete,
        isFirstStep,
        isLastStep,
        canSkip,
        goToStep,
        goToNext,
        goToPrevious,
        skipStep,
        updateData,
        completeStep,
        finishOnboarding,
        isStepCompleted,
        isStepSkipped,
        isStepAccessible,
        getStepStatus,
    }
}

// Load saved progress from localStorage
export function loadOnboardingProgress(tenantSlug: string): OnboardingProgress | null {
    try {
        const saved = localStorage.getItem(`onboarding-${tenantSlug}`)
        if (saved) {
            return JSON.parse(saved)
        }
    } catch (e) {
        console.error('Failed to load onboarding progress:', e)
    }
    return null
}
