// Onboarding wizard types

export type OnboardingStepId =
    | 'welcome'
    | 'business-type'
    | 'service-area'
    | 'business-hours'
    | 'emergency-protocols'
    | 'team-setup'
    | 'ai-personality'
    | 'pricing'
    | 'phone-number'
    | 'test-call'

export interface OnboardingStep {
    id: OnboardingStepId
    number: number
    title: string
    description: string
    skippable: boolean
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
    { id: 'welcome', number: 1, title: 'Welcome', description: 'Set up your company profile', skippable: false },
    { id: 'business-type', number: 2, title: 'Business Type', description: 'Tell us about your business', skippable: false },
    { id: 'service-area', number: 3, title: 'Service Area', description: 'Define your coverage area', skippable: true },
    { id: 'business-hours', number: 4, title: 'Business Hours', description: 'Set your regular hours', skippable: false },
    { id: 'emergency-protocols', number: 5, title: 'Emergency Protocols', description: 'Configure emergency handling', skippable: true },
    { id: 'team-setup', number: 6, title: 'Team Setup', description: 'Add your technicians', skippable: true },
    { id: 'ai-personality', number: 7, title: 'AI Personality', description: 'Customize your AI agent', skippable: true },
    { id: 'pricing', number: 8, title: 'After Hours Pricing', description: 'Set your emergency rates', skippable: true },
    { id: 'phone-number', number: 9, title: 'Phone Number', description: 'Your AI phone line', skippable: false },
    { id: 'test-call', number: 10, title: 'Test Call', description: 'Try your AI agent', skippable: false },
]

export interface BusinessHours {
    day: string
    isOpen: boolean
    openTime: string
    closeTime: string
}

export interface Technician {
    id: string
    name: string
    phone: string
    onCallDays: string[]
}

export interface EmergencyType {
    id: string
    label: string
    enabled: boolean
    isCustom?: boolean
}

export interface OnboardingData {
    companyName?: string
    logoUrl?: string
    businessType?: 'hvac' | 'plumbing' | 'electrical' | 'general-contractor' | 'other'
    businessDescription?: string
    serviceAreaType?: 'zip-codes' | 'radius'
    zipCodes?: string[]
    radiusCenter?: string
    radiusMiles?: number
    timezone?: string
    businessHours?: BusinessHours[]
    emergencyTypes?: EmergencyType[]
    technicians?: Technician[]
    voiceId?: string
    greetingMessage?: string
    brandTone?: 'professional' | 'friendly' | 'warm'
    emergencyRate?: number
    minimumCharge?: number
    assignedPhoneNumber?: string
    forwardingConfigured?: boolean
    testCallCompleted?: boolean
    testCallDate?: string
}

export interface OnboardingProgress {
    currentStep: OnboardingStepId
    completedSteps: OnboardingStepId[]
    skippedSteps: OnboardingStepId[]
    data: OnboardingData
    isComplete: boolean
    startedAt: string
    completedAt?: string
}

export function getStepById(stepId: OnboardingStepId): OnboardingStep | undefined {
    return ONBOARDING_STEPS.find(step => step.id === stepId)
}

export function getStepNumber(stepId: OnboardingStepId): number {
    return getStepById(stepId)?.number ?? 1
}

export function getNextStep(currentStepId: OnboardingStepId): OnboardingStep | undefined {
    const current = getStepById(currentStepId)
    if (!current) return undefined
    return ONBOARDING_STEPS.find(step => step.number === current.number + 1)
}

export function getPreviousStep(currentStepId: OnboardingStepId): OnboardingStep | undefined {
    const current = getStepById(currentStepId)
    if (!current || current.number === 1) return undefined
    return ONBOARDING_STEPS.find(step => step.number === current.number - 1)
}

export const DEFAULT_BUSINESS_HOURS: BusinessHours[] = [
    { day: 'Monday', isOpen: true, openTime: '08:00', closeTime: '17:00' },
    { day: 'Tuesday', isOpen: true, openTime: '08:00', closeTime: '17:00' },
    { day: 'Wednesday', isOpen: true, openTime: '08:00', closeTime: '17:00' },
    { day: 'Thursday', isOpen: true, openTime: '08:00', closeTime: '17:00' },
    { day: 'Friday', isOpen: true, openTime: '08:00', closeTime: '17:00' },
    { day: 'Saturday', isOpen: false, openTime: '09:00', closeTime: '14:00' },
    { day: 'Sunday', isOpen: false, openTime: '09:00', closeTime: '14:00' },
]

export const DEFAULT_EMERGENCY_TYPES: EmergencyType[] = [
    { id: 'gas-leak', label: 'Gas leak / gas smell', enabled: true },
    { id: 'no-heat', label: 'No heat (winter emergency)', enabled: true },
    { id: 'no-ac', label: 'No AC (summer emergency)', enabled: true },
    { id: 'water-leak', label: 'Water leak / flooding', enabled: true },
    { id: 'electrical-hazard', label: 'Electrical hazard', enabled: true },
    { id: 'co-detector', label: 'Carbon monoxide detector alarm', enabled: true },
]

export const TIMEZONES = [
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'America/Phoenix', label: 'Arizona (no DST)' },
    { value: 'America/Anchorage', label: 'Alaska Time (AKT)' },
    { value: 'Pacific/Honolulu', label: 'Hawaii Time (HT)' },
]

export const VOICE_OPTIONS = [
    { id: 'allison', name: 'Allison', description: 'Professional female voice' },
    { id: 'matthew', name: 'Matthew', description: 'Friendly male voice' },
    { id: 'sarah', name: 'Sarah', description: 'Warm female voice' },
    { id: 'james', name: 'James', description: 'Authoritative male voice' },
]

export const BRAND_TONES = [
    { value: 'professional', label: 'Professional', description: 'Formal and business-like' },
    { value: 'friendly', label: 'Friendly', description: 'Approachable and casual' },
    { value: 'warm', label: 'Warm', description: 'Caring and empathetic' },
] as const

export const DEFAULT_ONBOARDING_PROGRESS: OnboardingProgress = {
    currentStep: 'welcome',
    completedSteps: [],
    skippedSteps: [],
    data: {},
    isComplete: false,
    startedAt: new Date().toISOString(),
}
