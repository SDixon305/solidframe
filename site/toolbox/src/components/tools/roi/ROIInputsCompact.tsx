'use client'

import React from 'react'
import { Phone, Flame, Wrench, Headphones, Users, Voicemail } from 'lucide-react'
import { ROIInputs, SolutionType, SOLUTION_DEFAULTS } from '@/lib/hooks/use-roi-calculator'

interface ROIInputsCompactProps {
    inputs: ROIInputs
    setInputs: React.Dispatch<React.SetStateAction<ROIInputs>>
    applySolutionDefaults: (solutionType: SolutionType) => void
}

const SOLUTION_ICONS: Record<SolutionType, React.ReactNode> = {
    voicemail: <Voicemail size={12} />,
    answering_service: <Headphones size={12} />,
    in_house_staff: <Users size={12} />
}

const SOLUTION_LABELS: Record<SolutionType, string> = {
    voicemail: 'Voicemail',
    answering_service: 'Answering',
    in_house_staff: 'In-house'
}

export default function ROIInputsCompact({ inputs, setInputs, applySolutionDefaults }: ROIInputsCompactProps) {
    const handleInputChange = (key: keyof ROIInputs, value: number) => {
        setInputs(prev => ({ ...prev, [key]: value }))
    }

    return (
        <div className="grid grid-cols-4 gap-x-6 gap-y-4">
            {/* Row 1 */}
            <div>
                <div className="flex items-center justify-between text-[11px] text-zinc-500 mb-1">
                    <span>Calls/wk</span>
                    <span className="font-mono text-white">{inputs.missedCallsPerWeek}</span>
                </div>
                <input
                    type="range"
                    min={0}
                    max={40}
                    step={1}
                    value={inputs.missedCallsPerWeek}
                    onChange={(e) => handleInputChange('missedCallsPerWeek', Number(e.target.value))}
                    className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
            </div>

            <div>
                <div className="flex items-center justify-between text-[11px] text-zinc-500 mb-1">
                    <span>% emergency</span>
                    <span className="font-mono text-white">{inputs.emergencyPercent}%</span>
                </div>
                <input
                    type="range"
                    min={10}
                    max={50}
                    value={inputs.emergencyPercent}
                    onChange={(e) => handleInputChange('emergencyPercent', Number(e.target.value))}
                    className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-500"
                />
            </div>

            <div>
                <div className="text-[11px] text-zinc-500 mb-1">Emergency $</div>
                <div className="relative">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-500 text-xs">$</span>
                    <input
                        type="number"
                        min={200}
                        max={1500}
                        step={50}
                        value={inputs.emergencyTicketValue}
                        onChange={(e) => handleInputChange('emergencyTicketValue', Number(e.target.value))}
                        className="w-full bg-zinc-800/50 border border-white/10 rounded py-1.5 pl-5 pr-2 text-white font-mono text-xs focus:outline-none focus:border-amber-500/50"
                    />
                </div>
            </div>

            <div>
                <div className="text-[11px] text-zinc-500 mb-1">Service $</div>
                <div className="relative">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-500 text-xs">$</span>
                    <input
                        type="number"
                        min={100}
                        max={500}
                        step={25}
                        value={inputs.serviceTicketValue}
                        onChange={(e) => handleInputChange('serviceTicketValue', Number(e.target.value))}
                        className="w-full bg-zinc-800/50 border border-white/10 rounded py-1.5 pl-5 pr-2 text-white font-mono text-xs focus:outline-none focus:border-amber-500/50"
                    />
                </div>
            </div>

            {/* Row 2 */}
            <div>
                <div className="flex items-center justify-between text-[11px] text-zinc-500 mb-1">
                    <span>Emerg. book %</span>
                    <span className="font-mono text-white">{inputs.currentEmergencyBookingRate}%</span>
                </div>
                <input
                    type="range"
                    min={10}
                    max={90}
                    value={inputs.currentEmergencyBookingRate}
                    onChange={(e) => handleInputChange('currentEmergencyBookingRate', Number(e.target.value))}
                    className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
            </div>

            <div>
                <div className="flex items-center justify-between text-[11px] text-zinc-500 mb-1">
                    <span>Svc. book %</span>
                    <span className="font-mono text-white">{inputs.currentServiceBookingRate}%</span>
                </div>
                <input
                    type="range"
                    min={20}
                    max={90}
                    value={inputs.currentServiceBookingRate}
                    onChange={(e) => handleInputChange('currentServiceBookingRate', Number(e.target.value))}
                    className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
            </div>

            <div className="col-span-2">
                <div className="text-[11px] text-zinc-500 mb-1">Current solution</div>
                <div className="flex gap-1">
                    {(Object.keys(SOLUTION_LABELS) as SolutionType[]).map((type) => (
                        <button
                            key={type}
                            onClick={() => applySolutionDefaults(type)}
                            className={`flex-1 py-1.5 px-2 rounded text-[10px] transition-all cursor-pointer flex items-center justify-center gap-1 ${
                                inputs.solutionType === type
                                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                    : 'bg-zinc-800/50 text-zinc-500 border border-transparent hover:text-zinc-300'
                            }`}
                        >
                            {SOLUTION_ICONS[type]}
                            <span>{SOLUTION_LABELS[type]}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
