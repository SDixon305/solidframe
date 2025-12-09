'use client'

import { useState, useEffect, useCallback } from 'react'
import { Tool } from '@/lib/toolbox-data'

const STORAGE_KEY = 'solidframe-tool-order'

interface ToolOrder {
    [status: string]: string[] // status -> array of tool IDs in order
}

export function useToolOrder() {
    const [order, setOrder] = useState<ToolOrder>({})
    const [isLoaded, setIsLoaded] = useState(false)

    // Load order from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY)
            if (stored) {
                setOrder(JSON.parse(stored))
            }
        } catch (e) {
            console.warn('Failed to load tool order:', e)
        }
        setIsLoaded(true)
    }, [])

    // Save order to localStorage
    const saveOrder = useCallback((newOrder: ToolOrder) => {
        setOrder(newOrder)
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newOrder))
        } catch (e) {
            console.warn('Failed to save tool order:', e)
        }
    }, [])

    // Sort tools by custom order, falling back to original order for unordered tools
    const sortTools = useCallback((tools: Tool[], status: string): Tool[] => {
        const statusOrder = order[status] || []

        if (statusOrder.length === 0) {
            return tools
        }

        // Create a map for quick lookup
        const orderMap = new Map(statusOrder.map((id, index) => [id, index]))

        return [...tools].sort((a, b) => {
            const aIndex = orderMap.get(a.id)
            const bIndex = orderMap.get(b.id)

            // Both have custom order
            if (aIndex !== undefined && bIndex !== undefined) {
                return aIndex - bIndex
            }
            // Only a has custom order - a comes first
            if (aIndex !== undefined) return -1
            // Only b has custom order - b comes first
            if (bIndex !== undefined) return 1
            // Neither has custom order - keep original order
            return 0
        })
    }, [order])

    // Update order for a specific status column
    const updateOrder = useCallback((status: string, toolIds: string[]) => {
        const newOrder = { ...order, [status]: toolIds }
        saveOrder(newOrder)
    }, [order, saveOrder])

    // Reorder tools within a status column
    const reorderTools = useCallback((
        status: string,
        activeId: string,
        overId: string,
        tools: Tool[]
    ) => {
        const toolIds = tools.map(t => t.id)
        const activeIndex = toolIds.indexOf(activeId)
        const overIndex = toolIds.indexOf(overId)

        if (activeIndex === -1 || overIndex === -1) return

        const newOrder = [...toolIds]
        newOrder.splice(activeIndex, 1)
        newOrder.splice(overIndex, 0, activeId)

        updateOrder(status, newOrder)
    }, [updateOrder])

    return {
        isLoaded,
        sortTools,
        updateOrder,
        reorderTools,
    }
}
