'use client'

import { useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { loadProgress, stepNumberToId } from '@/lib/onboarding'
import { ONBOARDING_STEPS } from '@/types/onboarding'
import { useTenantContext } from '@/lib/tenant-context'

// Redirect to the current step
export default function OnboardingPage() {
    const router = useRouter()
    const params = useParams()
    const tenantSlug = params.tenant as string
    const { tenant } = useTenantContext()

    useEffect(() => {
        // Load saved progress or start at step 1
        const progress = loadProgress(tenant.id)
        const currentStepId = progress.currentStep
        const step = ONBOARDING_STEPS.find(s => s.id === currentStepId)
        const stepNumber = step?.number || 1

        router.replace(`/${tenantSlug}/onboarding/${stepNumber}`)
    }, [router, tenantSlug, tenant.id])

    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-4 border-[#5f3bff] border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-gray-500">Loading onboarding...</p>
            </div>
        </div>
    )
}
