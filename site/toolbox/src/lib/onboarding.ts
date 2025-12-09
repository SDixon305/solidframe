// Onboarding state management utilities

import {
    OnboardingStepId,
    OnboardingData,
    OnboardingProgress,
    ONBOARDING_STEPS,
    DEFAULT_ONBOARDING_PROGRESS,
} from '@/types/onboarding'

const STORAGE_KEY_PREFIX = 'solidframe-onboarding-'

// Get storage key for a tenant
function getStorageKey(tenantId: string): string {
    return `${STORAGE_KEY_PREFIX}${tenantId}`
}

// Load progress from localStorage
export function loadProgress(tenantId: string): OnboardingProgress {
    if (typeof window === 'undefined') {
        return DEFAULT_ONBOARDING_PROGRESS
    }

    try {
        const stored = localStorage.getItem(getStorageKey(tenantId))
        if (stored) {
            return JSON.parse(stored)
        }
    } catch (e) {
        console.error('Failed to load onboarding progress:', e)
    }

    return DEFAULT_ONBOARDING_PROGRESS
}

// Save progress to localStorage
export function saveProgress(tenantId: string, progress: OnboardingProgress): void {
    if (typeof window === 'undefined') return

    try {
        localStorage.setItem(getStorageKey(tenantId), JSON.stringify(progress))
    } catch (e) {
        console.error('Failed to save onboarding progress:', e)
    }
}

// Clear progress from localStorage
export function clearProgress(tenantId: string): void {
    if (typeof window === 'undefined') return

    try {
        localStorage.removeItem(getStorageKey(tenantId))
    } catch (e) {
        console.error('Failed to clear onboarding progress:', e)
    }
}

// Validate step data based on step ID
export function validateStepData(stepId: OnboardingStepId, data: OnboardingData): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    switch (stepId) {
        case 'welcome':
            if (!data.companyName?.trim()) {
                errors.push('Company name is required')
            }
            break

        case 'business-type':
            if (!data.businessType) {
                errors.push('Please select a business type')
            }
            break

        case 'service-area':
            if (data.serviceAreaType === 'zip-codes' && (!data.zipCodes || data.zipCodes.length === 0)) {
                errors.push('Please enter at least one zip code')
            }
            if (data.serviceAreaType === 'radius' && !data.radiusCenter) {
                errors.push('Please enter a center address')
            }
            break

        case 'business-hours':
            if (!data.timezone) {
                errors.push('Please select a timezone')
            }
            if (!data.businessHours || data.businessHours.length === 0) {
                errors.push('Business hours are required')
            }
            break

        case 'emergency-protocols':
            // Optional, no validation required
            break

        case 'team-setup':
            // Optional, but if started, need at least one technician
            break

        case 'ai-personality':
            // Optional
            break

        case 'pricing':
            // Optional
            break

        case 'phone-number':
            // Read-only step, no validation
            break

        case 'test-call':
            // Optional to complete
            break
    }

    return {
        valid: errors.length === 0,
        errors,
    }
}

// Get completion percentage
export function getCompletionPercentage(progress: OnboardingProgress): number {
    const totalSteps = ONBOARDING_STEPS.length
    const completedCount = progress.completedSteps.length
    return Math.round((completedCount / totalSteps) * 100)
}

// Check if user can proceed to next step
export function canProceed(stepId: OnboardingStepId, data: OnboardingData): boolean {
    const { valid } = validateStepData(stepId, data)
    return valid
}

// Get step URL
export function getStepUrl(tenantSlug: string, stepId: OnboardingStepId): string {
    const step = ONBOARDING_STEPS.find(s => s.id === stepId)
    if (!step) return `/${tenantSlug}/onboarding`
    return `/${tenantSlug}/onboarding/${step.number}`
}

// Map step number to step ID
export function stepNumberToId(stepNumber: number): OnboardingStepId | undefined {
    const step = ONBOARDING_STEPS.find(s => s.number === stepNumber)
    return step?.id
}

// Generate sample phone number (placeholder)
export function generatePlaceholderPhoneNumber(): string {
    // Generate a realistic-looking phone number for demo
    const areaCode = ['512', '214', '713', '469', '817'][Math.floor(Math.random() * 5)]
    const exchange = String(Math.floor(Math.random() * 900) + 100)
    const subscriber = String(Math.floor(Math.random() * 9000) + 1000)
    return `+1 (${areaCode}) ${exchange}-${subscriber}`
}

// Format phone number for display
export function formatPhoneNumber(phone: string): string {
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
    }
    if (cleaned.length === 11 && cleaned[0] === '1') {
        return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`
    }
    return phone
}

// Build greeting message preview
export function buildGreetingPreview(
    companyName: string,
    tone: 'professional' | 'friendly' | 'warm',
    customGreeting?: string
): string {
    if (customGreeting) {
        return customGreeting.replace('{company}', companyName)
    }

    const greetings = {
        professional: `Thank you for calling ${companyName}. How may I assist you today?`,
        friendly: `Hey there! You've reached ${companyName}. What can I help you with?`,
        warm: `Hi, and thank you for calling ${companyName}. I'm here to help. What's going on?`,
    }

    return greetings[tone] || greetings.professional
}

// Get after hours explanation based on business hours
export function getAfterHoursExplanation(businessHours: OnboardingData['businessHours']): string {
    if (!businessHours || businessHours.length === 0) {
        return 'Your AI agent will handle calls outside your business hours.'
    }

    const openDays = businessHours.filter(h => h.isOpen)
    if (openDays.length === 0) {
        return 'Your AI agent will handle all calls (no business hours set).'
    }

    const firstDay = openDays[0]
    return `Your AI agent handles calls outside your regular hours (e.g., after ${firstDay.closeTime} or on closed days).`
}
