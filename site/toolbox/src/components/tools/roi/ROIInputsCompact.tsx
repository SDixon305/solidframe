'use client'

import React from 'react'
import { ROIInputs } from '@/lib/hooks/use-roi-calculator'

interface ROIInputsCompactProps {
    inputs: ROIInputs
    setInputs: React.Dispatch<React.SetStateAction<ROIInputs>>
}

export default function ROIInputsCompact({ inputs, setInputs }: ROIInputsCompactProps) {
    const handleInputChange = (key: keyof ROIInputs, value: number) => {
        setInputs(prev => ({ ...prev, [key]: value }))
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-4">
            {/* Row 1 */}
            <div>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                    <span>Calls/wk</span>
                    <span className="font-medium text-gray-900">{inputs.missedCallsPerWeek}</span>
                </div>
                <input
                    type="range"
                    min={0}
                    max={40}
                    step={1}
                    value={inputs.missedCallsPerWeek}
                    onChange={(e) => handleInputChange('missedCallsPerWeek', Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#5f3bff] touch-pan-y"
                />
            </div>

            <div>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                    <span>% emergency</span>
                    <span className="font-medium text-gray-900">{inputs.emergencyPercent}%</span>
                </div>
                <input
                    type="range"
                    min={10}
                    max={50}
                    value={inputs.emergencyPercent}
                    onChange={(e) => handleInputChange('emergencyPercent', Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-500 touch-pan-y"
                />
            </div>

            <div>
                <div className="text-xs text-gray-500 mb-1.5">Emergency $</div>
                <div className="relative">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                    <input
                        type="number"
                        min={200}
                        max={1500}
                        step={50}
                        value={inputs.emergencyTicketValue}
                        onChange={(e) => handleInputChange('emergencyTicketValue', Number(e.target.value))}
                        className="w-full bg-white border border-gray-200 rounded min-h-[44px] py-2 pl-5 pr-2 text-gray-900 text-sm focus:outline-none focus:border-[#5f3bff]/50 focus:ring-1 focus:ring-[#5f3bff]/20"
                    />
                </div>
            </div>

            <div>
                <div className="text-xs text-gray-500 mb-1.5">Service $</div>
                <div className="relative">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                    <input
                        type="number"
                        min={100}
                        max={500}
                        step={25}
                        value={inputs.serviceTicketValue}
                        onChange={(e) => handleInputChange('serviceTicketValue', Number(e.target.value))}
                        className="w-full bg-white border border-gray-200 rounded min-h-[44px] py-2 pl-5 pr-2 text-gray-900 text-sm focus:outline-none focus:border-[#5f3bff]/50 focus:ring-1 focus:ring-[#5f3bff]/20"
                    />
                </div>
            </div>

            {/* Row 2 */}
            <div>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                    <span>Emerg. book %</span>
                    <span className="font-medium text-gray-900">{inputs.currentEmergencyBookingRate}%</span>
                </div>
                <input
                    type="range"
                    min={10}
                    max={90}
                    value={inputs.currentEmergencyBookingRate}
                    onChange={(e) => handleInputChange('currentEmergencyBookingRate', Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-rose-500 touch-pan-y"
                />
            </div>

            <div>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                    <span>Svc. book %</span>
                    <span className="font-medium text-gray-900">{inputs.currentServiceBookingRate}%</span>
                </div>
                <input
                    type="range"
                    min={20}
                    max={90}
                    value={inputs.currentServiceBookingRate}
                    onChange={(e) => handleInputChange('currentServiceBookingRate', Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500 touch-pan-y"
                />
            </div>

        </div>
    )
}
