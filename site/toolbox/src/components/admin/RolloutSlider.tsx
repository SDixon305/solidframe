'use client'

import { useState, useEffect } from 'react'
import { Users, AlertCircle } from 'lucide-react'

interface RolloutSliderProps {
    value: number
    onChange: (value: number) => void
    tenantCount?: number
    disabled?: boolean
    showPreview?: boolean
}

export function RolloutSlider({
    value,
    onChange,
    tenantCount = 0,
    disabled = false,
    showPreview = true,
}: RolloutSliderProps) {
    const [localValue, setLocalValue] = useState(value)
    const [isDragging, setIsDragging] = useState(false)

    useEffect(() => {
        if (!isDragging) {
            setLocalValue(value)
        }
    }, [value, isDragging])

    const handleChange = (newValue: number) => {
        setLocalValue(newValue)
    }

    const handleCommit = () => {
        setIsDragging(false)
        onChange(localValue)
    }

    // Calculate affected tenants
    const affectedTenants = Math.round((localValue / 100) * tenantCount)

    // Determine color based on percentage
    const getColor = (pct: number) => {
        if (pct === 0) return 'bg-gray-300'
        if (pct <= 25) return 'bg-amber-500'
        if (pct <= 75) return 'bg-blue-500'
        return 'bg-emerald-500'
    }

    // Quick select buttons
    const presets = [0, 10, 25, 50, 75, 100]

    return (
        <div className={`space-y-3 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
            {/* Slider with labels */}
            <div className="relative pt-1">
                {/* Value label */}
                <div
                    className="absolute -top-0.5 transform -translate-x-1/2 text-sm font-semibold text-gray-900 transition-all duration-150"
                    style={{ left: `${localValue}%` }}
                >
                    {localValue}%
                </div>

                {/* Slider track */}
                <div className="relative h-3 mt-6">
                    {/* Background track */}
                    <div className="absolute inset-0 bg-gray-100 rounded-full" />

                    {/* Filled track */}
                    <div
                        className={`absolute inset-y-0 left-0 rounded-full transition-all duration-150 ${getColor(localValue)}`}
                        style={{ width: `${localValue}%` }}
                    />

                    {/* Slider input */}
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={localValue}
                        onChange={(e) => {
                            setIsDragging(true)
                            handleChange(parseInt(e.target.value))
                        }}
                        onMouseUp={handleCommit}
                        onTouchEnd={handleCommit}
                        disabled={disabled}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />

                    {/* Thumb */}
                    <div
                        className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white border-2 shadow-md transition-all duration-150 ${
                            isDragging ? 'scale-110 border-violet-500' : 'border-gray-300'
                        }`}
                        style={{ left: `calc(${localValue}% - 10px)` }}
                    />
                </div>

                {/* Tick marks */}
                <div className="flex justify-between mt-2 text-xs text-gray-400">
                    <span>0%</span>
                    <span>25%</span>
                    <span>50%</span>
                    <span>75%</span>
                    <span>100%</span>
                </div>
            </div>

            {/* Quick select buttons */}
            <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 mr-1">Quick:</span>
                {presets.map((pct) => (
                    <button
                        key={pct}
                        onClick={() => {
                            setLocalValue(pct)
                            onChange(pct)
                        }}
                        disabled={disabled}
                        className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-colors ${
                            localValue === pct
                                ? 'bg-violet-50 border-violet-200 text-violet-700'
                                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        {pct}%
                    </button>
                ))}
            </div>

            {/* Preview of affected tenants */}
            {showPreview && tenantCount > 0 && (
                <div className={`flex items-center gap-2 p-3 rounded-lg ${
                    localValue < 100 && localValue > 0
                        ? 'bg-amber-50 border border-amber-200'
                        : 'bg-gray-50 border border-gray-200'
                }`}>
                    {localValue < 100 && localValue > 0 ? (
                        <>
                            <AlertCircle size={16} className="text-amber-600" />
                            <span className="text-sm text-amber-700">
                                <strong>{affectedTenants}</strong> of {tenantCount} tenants will receive this version
                            </span>
                        </>
                    ) : localValue === 100 ? (
                        <>
                            <Users size={16} className="text-emerald-600" />
                            <span className="text-sm text-emerald-700">
                                All <strong>{tenantCount}</strong> tenants will receive this version
                            </span>
                        </>
                    ) : (
                        <>
                            <Users size={16} className="text-gray-500" />
                            <span className="text-sm text-gray-600">
                                No tenants will receive this version (0%)
                            </span>
                        </>
                    )}
                </div>
            )}
        </div>
    )
}
