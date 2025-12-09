'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter, notFound } from 'next/navigation'
import { useTenantContext } from '@/lib/tenant-context'
import {
    ONBOARDING_STEPS,
    OnboardingStepId,
    OnboardingData,
    OnboardingProgress,
    DEFAULT_ONBOARDING_PROGRESS,
} from '@/types/onboarding'
import { loadProgress, saveProgress, validateStepData, stepNumberToId } from '@/lib/onboarding'
import {
    WizardProgress,
    WizardNav,
    WelcomeStep,
    BusinessTypeStep,
    ServiceAreaStep,
    BusinessHoursStep,
    EmergencyProtocolsStep,
    TeamSetupStep,
    AIPersonalityStep,
    PricingStep,
    PhoneNumberStep,
    TestCallStep,
} from '@/components/onboarding'

export default function OnboardingStepPage() {
    const params = useParams()
    const router = useRouter()
    const { tenant } = useTenantContext()

    const stepNumber = parseInt(params.step as string, 10)
    const tenantSlug = params.tenant as string

    // Validate step number
    if (isNaN(stepNumber) || stepNumber < 1 || stepNumber > ONBOARDING_STEPS.length) {
        notFound()
    }

    const currentStepId = stepNumberToId(stepNumber) as OnboardingStepId
    const currentStep = ONBOARDING_STEPS.find(s => s.number === stepNumber)!

    // State
    const [progress, setProgress] = useState<OnboardingProgress>(() => {
        if (typeof window === 'undefined') return DEFAULT_ONBOARDING_PROGRESS
        return loadProgress(tenant.id)
    })
    const [isLoading, setIsLoading] = useState(false)

    // Update current step in progress when navigating
    useEffect(() => {
        if (progress.currentStep !== currentStepId) {
            const newProgress = { ...progress, currentStep: currentStepId }
            setProgress(newProgress)
            saveProgress(tenant.id, newProgress)
        }
    }, [currentStepId, tenant.id])

    // Update data
    const handleUpdateData = useCallback((updates: Partial<OnboardingData>) => {
        setProgress(prev => {
            const newProgress = {
                ...prev,
                data: { ...prev.data, ...updates },
            }
            saveProgress(tenant.id, newProgress)
            return newProgress
        })
    }, [tenant.id])

    // Navigation handlers
    const goToStep = useCallback((stepId: OnboardingStepId) => {
        const step = ONBOARDING_STEPS.find(s => s.id === stepId)
        if (step) {
            router.push(`/${tenantSlug}/onboarding/${step.number}`)
        }
    }, [tenantSlug, router])

    const handleNext = useCallback(() => {
        // Validate current step
        const validation = validateStepData(currentStepId, progress.data)
        if (!validation.valid && !currentStep.skippable) {
            // Could show validation errors here
            console.warn('Validation failed:', validation.errors)
            return
        }

        // Mark step as completed
        const newCompleted = progress.completedSteps.includes(currentStepId)
            ? progress.completedSteps
            : [...progress.completedSteps, currentStepId]

        const newProgress = {
            ...progress,
            completedSteps: newCompleted,
            skippedSteps: progress.skippedSteps.filter(s => s !== currentStepId),
        }
        setProgress(newProgress)
        saveProgress(tenant.id, newProgress)

        // Navigate to next step
        if (stepNumber < ONBOARDING_STEPS.length) {
            router.push(`/${tenantSlug}/onboarding/${stepNumber + 1}`)
        }
    }, [currentStepId, currentStep, progress, stepNumber, tenant.id, tenantSlug, router])

    const handleBack = useCallback(() => {
        if (stepNumber > 1) {
            router.push(`/${tenantSlug}/onboarding/${stepNumber - 1}`)
        }
    }, [stepNumber, tenantSlug, router])

    const handleSkip = useCallback(() => {
        if (!currentStep.skippable) return

        // Mark step as skipped
        const newSkipped = progress.skippedSteps.includes(currentStepId)
            ? progress.skippedSteps
            : [...progress.skippedSteps, currentStepId]

        const newProgress = {
            ...progress,
            skippedSteps: newSkipped,
            completedSteps: progress.completedSteps.filter(s => s !== currentStepId),
        }
        setProgress(newProgress)
        saveProgress(tenant.id, newProgress)

        // Navigate to next step
        if (stepNumber < ONBOARDING_STEPS.length) {
            router.push(`/${tenantSlug}/onboarding/${stepNumber + 1}`)
        }
    }, [currentStepId, currentStep, progress, stepNumber, tenant.id, tenantSlug, router])

    const handleFinish = useCallback(() => {
        setIsLoading(true)

        // Mark as complete
        const newProgress = {
            ...progress,
            isComplete: true,
            completedAt: new Date().toISOString(),
            completedSteps: progress.completedSteps.includes(currentStepId)
                ? progress.completedSteps
                : [...progress.completedSteps, currentStepId],
        }
        saveProgress(tenant.id, newProgress)

        // Navigate to dashboard
        setTimeout(() => {
            router.push(`/${tenantSlug}`)
        }, 500)
    }, [progress, currentStepId, tenant.id, tenantSlug, router])

    // Render step content
    const renderStepContent = () => {
        const props = {
            data: progress.data,
            onUpdate: handleUpdateData,
        }

        switch (currentStepId) {
            case 'welcome':
                return <WelcomeStep {...props} tenantName={tenant.name} />
            case 'business-type':
                return <BusinessTypeStep {...props} />
            case 'service-area':
                return <ServiceAreaStep {...props} />
            case 'business-hours':
                return <BusinessHoursStep {...props} />
            case 'emergency-protocols':
                return <EmergencyProtocolsStep {...props} />
            case 'team-setup':
                return <TeamSetupStep {...props} />
            case 'ai-personality':
                return <AIPersonalityStep {...props} />
            case 'pricing':
                return <PricingStep {...props} />
            case 'phone-number':
                return <PhoneNumberStep {...props} />
            case 'test-call':
                return <TestCallStep {...props} onComplete={handleFinish} />
            default:
                return null
        }
    }

    const isFirstStep = stepNumber === 1
    const isLastStep = stepNumber === ONBOARDING_STEPS.length

    return (
        <div className="max-w-3xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-8">
                <WizardProgress
                    currentStep={currentStepId}
                    completedSteps={progress.completedSteps}
                    skippedSteps={progress.skippedSteps}
                    onStepClick={goToStep}
                />
            </div>

            {/* Step Content */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
                {renderStepContent()}

                {/* Navigation */}
                <div className="mt-8">
                    <WizardNav
                        onBack={handleBack}
                        onSkip={handleSkip}
                        onNext={handleNext}
                        onFinish={handleFinish}
                        isFirstStep={isFirstStep}
                        isLastStep={isLastStep}
                        canSkip={currentStep.skippable}
                        isLoading={isLoading}
                    />
                </div>
            </div>
        </div>
    )
}
