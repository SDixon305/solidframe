'use client'

import React from 'react'

export interface Tab {
    id: string
    label: string
    icon?: React.ElementType
}

interface ToolTabsProps {
    tabs: Tab[]
    activeTab: string
    onTabChange: (tabId: string) => void
}

export default function ToolTabs({ tabs, activeTab, onTabChange }: ToolTabsProps) {
    return (
        <div className="flex gap-1 p-1 bg-gray-100 rounded-lg mb-6 w-fit">
            {tabs.map((tab) => {
                const isActive = tab.id === activeTab
                const Icon = tab.icon

                return (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                            isActive
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                        }`}
                    >
                        {Icon && <Icon size={16} />}
                        <span>{tab.label}</span>
                    </button>
                )
            })}
        </div>
    )
}
