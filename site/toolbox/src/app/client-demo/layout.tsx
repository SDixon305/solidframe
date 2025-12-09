'use client'

import { useSearchParams } from 'next/navigation'
import { DemoProvider, parseToken, createDemoConfig } from '@/lib/demo-context'
import { Suspense } from 'react'

function DemoLayoutInner({ children }: { children: React.ReactNode }) {
    const searchParams = useSearchParams()
    const token = searchParams.get('token')

    const parsedToken = parseToken(token)
    const config = createDemoConfig(parsedToken)

    // Show expired state
    if (config.isExpired) {
        return (
            <div className="min-h-screen bg-[#f4f5f7] flex items-center justify-center p-8">
                <div className="max-w-md text-center bg-white rounded-lg border border-gray-200 shadow-sm p-8">
                    <div className="w-14 h-14 mx-auto mb-5 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center">
                        <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h1 className="text-xl font-semibold text-gray-900 mb-2">
                        Demo Link Expired
                    </h1>
                    <p className="text-sm text-gray-500 mb-6">
                        This demo link has expired after 14 days. Please contact SolidFrame to request a new demo link.
                    </p>
                    <a
                        href="https://solidframe.ai"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#5f3bff] text-white rounded-md font-medium text-sm hover:bg-[#4f2fe0] transition-colors"
                    >
                        Visit SolidFrame
                    </a>
                </div>
            </div>
        )
    }

    return (
        <DemoProvider config={config}>
            {children}
        </DemoProvider>
    )
}

export default function ClientDemoLayout({ children }: { children: React.ReactNode }) {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#f4f5f7] flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#5f3bff] border-t-transparent" />
            </div>
        }>
            <DemoLayoutInner>{children}</DemoLayoutInner>
        </Suspense>
    )
}
