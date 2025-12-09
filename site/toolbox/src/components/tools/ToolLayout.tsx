'use client'

import React, { ReactNode } from 'react'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useTenantContext } from '@/lib/tenant-context'

interface ToolLayoutProps {
    children: ReactNode
    backLabel?: string
}

export default function ToolLayout({ children, backLabel = 'Back to Dashboard' }: ToolLayoutProps) {
    const { tenant } = useTenantContext()
    const basePath = `/${tenant.slug}`

    return (
        <div className="max-w-7xl mx-auto">
            {/* Back Navigation */}
            <Link
                href={basePath}
                className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors"
            >
                <ArrowLeft size={16} />
                <span>{backLabel}</span>
            </Link>

            {children}
        </div>
    )
}
