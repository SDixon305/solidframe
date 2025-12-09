'use client'

import { createContext, useContext, ReactNode } from 'react'

export interface DemoConfig {
    // Personalization from magic link
    ownerName: string
    businessName: string
    // Token metadata
    isExpired: boolean
    expiresAt: number | null
    // Mode flags
    isDemo: true
}

const DEFAULT_CONFIG: DemoConfig = {
    ownerName: 'valued customer',
    businessName: 'Trinity Cooling',
    isExpired: false,
    expiresAt: null,
    isDemo: true,
}

const DemoContext = createContext<DemoConfig>(DEFAULT_CONFIG)

export function useDemoContext() {
    return useContext(DemoContext)
}

interface DemoProviderProps {
    children: ReactNode
    config: DemoConfig
}

export function DemoProvider({ children, config }: DemoProviderProps) {
    return (
        <DemoContext.Provider value={config}>
            {children}
        </DemoContext.Provider>
    )
}

// Token parsing utilities
export interface DemoToken {
    owner?: string
    business?: string
    exp?: number
}

export function parseToken(tokenString: string | null): DemoToken {
    if (!tokenString) return {}

    try {
        const decoded = atob(tokenString)
        return JSON.parse(decoded) as DemoToken
    } catch {
        console.warn('Failed to parse demo token')
        return {}
    }
}

export function createDemoConfig(token: DemoToken): DemoConfig {
    const now = Date.now()
    const isExpired = token.exp ? now > token.exp : false

    return {
        ownerName: token.owner || DEFAULT_CONFIG.ownerName,
        businessName: token.business || DEFAULT_CONFIG.businessName,
        isExpired,
        expiresAt: token.exp || null,
        isDemo: true,
    }
}

export function generateToken(owner: string, business: string, expirationDays: number = 14): string {
    const payload: DemoToken = {
        owner: owner || undefined,
        business: business || undefined,
        exp: Date.now() + (expirationDays * 24 * 60 * 60 * 1000),
    }
    return btoa(JSON.stringify(payload))
}
