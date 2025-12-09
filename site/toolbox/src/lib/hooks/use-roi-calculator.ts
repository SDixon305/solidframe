import { useState, useEffect, useCallback } from 'react'

// Solution types with their default booking rates
export type SolutionType = 'voicemail' | 'answering_service' | 'in_house_staff'

export interface SolutionDefaults {
    emergencyBookingRate: number
    serviceBookingRate: number
    monthlyCost: number
}

export const SOLUTION_DEFAULTS: Record<SolutionType, SolutionDefaults> = {
    voicemail: {
        emergencyBookingRate: 30,
        serviceBookingRate: 40,
        monthlyCost: 0
    },
    answering_service: {
        emergencyBookingRate: 50,
        serviceBookingRate: 60,
        monthlyCost: 200
    },
    in_house_staff: {
        emergencyBookingRate: 70,
        serviceBookingRate: 75,
        monthlyCost: 500
    }
}

// AI performance claims (not adjustable)
export const AI_BOOKING_RATES = {
    emergency: 95,
    service: 85
}

// SolidFrame pricing tiers
export const SOLIDFRAME_PRICING = {
    lowVolume: { maxCalls: 25, monthlyPrice: 299 },
    highVolume: { monthlyPrice: 499 }
}

export interface ROIInputs {
    // Call volume - direct missed calls input
    missedCallsPerWeek: number

    // Call mix (hidden default, adjustable in assumptions)
    emergencyPercent: number // 0-100%, default 25%

    // Current solution
    solutionType: SolutionType
    currentMonthlyCost: number
    currentEmergencyBookingRate: number // 0-100%
    currentServiceBookingRate: number // 0-100%

    // AI solution booking rates (adjustable)
    aiEmergencyBookingRate: number // 0-100%, default 95%
    aiServiceBookingRate: number // 0-100%, default 85%

    // Ticket values
    emergencyTicketValue: number
    serviceTicketValue: number
}

export interface ROIResults {
    // Derived counts
    missedCallsPerWeek: number
    missedEmergencyCalls: number
    missedServiceCalls: number

    // Current state losses
    emergencyLostToCompetitor: number // Annual
    serviceLostSlippingAway: number // Annual
    totalCurrentLoss: number // Annual

    // AI recovery
    emergencyRecovered: number // Annual
    serviceRecovered: number // Annual
    totalRecovered: number // Annual

    // Cost comparison
    currentAnnualCost: number
    solidFrameAnnualCost: number

    // Bottom line
    netAnnualGain: number
    netMonthlyGain: number
}

const DEFAULT_INPUTS: ROIInputs = {
    missedCallsPerWeek: 15,
    emergencyPercent: 25,
    solutionType: 'voicemail',
    currentMonthlyCost: SOLUTION_DEFAULTS.voicemail.monthlyCost,
    currentEmergencyBookingRate: SOLUTION_DEFAULTS.voicemail.emergencyBookingRate,
    currentServiceBookingRate: SOLUTION_DEFAULTS.voicemail.serviceBookingRate,
    aiEmergencyBookingRate: AI_BOOKING_RATES.emergency,
    aiServiceBookingRate: AI_BOOKING_RATES.service,
    emergencyTicketValue: 550,
    serviceTicketValue: 295
}

function calculateSolidFrameMonthlyPrice(missedCallsPerWeek: number): number {
    return missedCallsPerWeek <= SOLIDFRAME_PRICING.lowVolume.maxCalls
        ? SOLIDFRAME_PRICING.lowVolume.monthlyPrice
        : SOLIDFRAME_PRICING.highVolume.monthlyPrice
}

export function useROICalculator() {
    // Initialize state from localStorage if available, else defaults
    const [inputs, setInputs] = useState<ROIInputs>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('solidframe_roi_inputs_v4')
            if (saved) {
                try {
                    const parsed = JSON.parse(saved)
                    // Merge with defaults to ensure all fields exist
                    return { ...DEFAULT_INPUTS, ...parsed }
                } catch (e) {
                    // Fall through to defaults
                }
            }
        }
        return DEFAULT_INPUTS
    })

    const [results, setResults] = useState<ROIResults>({
        missedCallsPerWeek: 0,
        missedEmergencyCalls: 0,
        missedServiceCalls: 0,
        emergencyLostToCompetitor: 0,
        serviceLostSlippingAway: 0,
        totalCurrentLoss: 0,
        emergencyRecovered: 0,
        serviceRecovered: 0,
        totalRecovered: 0,
        currentAnnualCost: 0,
        solidFrameAnnualCost: 0,
        netAnnualGain: 0,
        netMonthlyGain: 0
    })

    // Helper to apply solution defaults
    const applySolutionDefaults = useCallback((solutionType: SolutionType) => {
        const defaults = SOLUTION_DEFAULTS[solutionType]
        setInputs(prev => ({
            ...prev,
            solutionType,
            currentEmergencyBookingRate: defaults.emergencyBookingRate,
            currentServiceBookingRate: defaults.serviceBookingRate,
            currentMonthlyCost: defaults.monthlyCost
        }))
    }, [])

    // Update derived results whenever inputs change
    useEffect(() => {
        const {
            missedCallsPerWeek,
            emergencyPercent,
            currentMonthlyCost,
            currentEmergencyBookingRate,
            currentServiceBookingRate,
            aiEmergencyBookingRate,
            aiServiceBookingRate,
            emergencyTicketValue,
            serviceTicketValue
        } = inputs

        // Calculate missed calls breakdown by type
        const missedEmergencyCalls = missedCallsPerWeek * (emergencyPercent / 100)
        const missedServiceCalls = missedCallsPerWeek * (1 - emergencyPercent / 100)

        // Weekly potential revenue from missed calls
        const emergencyPotentialWeekly = missedEmergencyCalls * emergencyTicketValue
        const servicePotentialWeekly = missedServiceCalls * serviceTicketValue

        // Current booking (what they recover now)
        const emergencyCurrentWeekly = emergencyPotentialWeekly * (currentEmergencyBookingRate / 100)
        const serviceCurrentWeekly = servicePotentialWeekly * (currentServiceBookingRate / 100)

        // Current losses (what they're NOT recovering)
        const emergencyLostWeekly = emergencyPotentialWeekly - emergencyCurrentWeekly
        const serviceLostWeekly = servicePotentialWeekly - serviceCurrentWeekly

        // AI booking (what SolidFrame would recover)
        const emergencyAIWeekly = emergencyPotentialWeekly * (aiEmergencyBookingRate / 100)
        const serviceAIWeekly = servicePotentialWeekly * (aiServiceBookingRate / 100)

        // Recovered = AI booking minus current booking (the delta)
        const emergencyRecoveredWeekly = emergencyAIWeekly - emergencyCurrentWeekly
        const serviceRecoveredWeekly = serviceAIWeekly - serviceCurrentWeekly

        // Annualize (52 weeks)
        const emergencyLostToCompetitor = emergencyLostWeekly * 52
        const serviceLostSlippingAway = serviceLostWeekly * 52
        const totalCurrentLoss = emergencyLostToCompetitor + serviceLostSlippingAway

        const emergencyRecovered = emergencyRecoveredWeekly * 52
        const serviceRecovered = serviceRecoveredWeekly * 52
        const totalRecovered = emergencyRecovered + serviceRecovered

        // Cost comparison
        const currentAnnualCost = currentMonthlyCost * 12
        const solidFrameMonthlyPrice = calculateSolidFrameMonthlyPrice(missedCallsPerWeek)
        const solidFrameAnnualCost = solidFrameMonthlyPrice * 12

        // Net gain = recovered revenue - (SolidFrame cost - current cost)
        // If current cost is $0 (voicemail), then net = recovered - SolidFrame cost
        // If current cost is $200, then net = recovered - (SolidFrame - 200) = recovered - SolidFrame + 200
        const netAnnualGain = totalRecovered - (solidFrameAnnualCost - currentAnnualCost)
        const netMonthlyGain = netAnnualGain / 12

        setResults({
            missedCallsPerWeek,
            missedEmergencyCalls,
            missedServiceCalls,
            emergencyLostToCompetitor,
            serviceLostSlippingAway,
            totalCurrentLoss,
            emergencyRecovered,
            serviceRecovered,
            totalRecovered,
            currentAnnualCost,
            solidFrameAnnualCost,
            netAnnualGain,
            netMonthlyGain
        })

        // Persist to local storage
        if (typeof window !== 'undefined') {
            localStorage.setItem('solidframe_roi_inputs_v4', JSON.stringify(inputs))
        }

    }, [inputs])

    return {
        inputs,
        setInputs,
        results,
        applySolutionDefaults,
        solutionDefaults: SOLUTION_DEFAULTS,
        aiBookingRates: AI_BOOKING_RATES
    }
}
