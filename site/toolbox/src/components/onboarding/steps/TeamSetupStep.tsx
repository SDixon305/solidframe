'use client'

import React, { useState, useEffect } from 'react'
import { User, Phone, Calendar, Plus, X, UserPlus } from 'lucide-react'
import { OnboardingData, Technician } from '@/types/onboarding'

interface TeamSetupStepProps {
    data: OnboardingData
    onUpdate: (updates: Partial<OnboardingData>) => void
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function TeamSetupStep({ data, onUpdate }: TeamSetupStepProps) {
    const [technicians, setTechnicians] = useState<Technician[]>(data.technicians || [])
    const [showAddForm, setShowAddForm] = useState(technicians.length === 0)
    const [newTech, setNewTech] = useState<Partial<Technician>>({
        name: '',
        phone: '',
        onCallDays: [],
    })

    useEffect(() => {
        onUpdate({ technicians })
    }, [technicians])

    const handleAddTechnician = () => {
        if (newTech.name?.trim() && newTech.phone?.trim()) {
            const tech: Technician = {
                id: `tech-${Date.now()}`,
                name: newTech.name.trim(),
                phone: newTech.phone.trim(),
                onCallDays: newTech.onCallDays || [],
            }
            setTechnicians(prev => [...prev, tech])
            setNewTech({ name: '', phone: '', onCallDays: [] })
            setShowAddForm(false)
        }
    }

    const handleRemoveTechnician = (id: string) => {
        setTechnicians(prev => prev.filter(t => t.id !== id))
    }

    const toggleOnCallDay = (day: string) => {
        setNewTech(prev => ({
            ...prev,
            onCallDays: prev.onCallDays?.includes(day)
                ? prev.onCallDays.filter(d => d !== day)
                : [...(prev.onCallDays || []), day],
        }))
    }

    const formatPhone = (phone: string) => {
        const cleaned = phone.replace(/\D/g, '')
        if (cleaned.length === 10) {
            return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
        }
        return phone
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                    Add your team members
                </h2>
                <p className="text-gray-600">
                    Add technicians who can be dispatched for emergency calls.
                </p>
            </div>

            {/* Technician List */}
            {technicians.length > 0 && (
                <div className="space-y-3">
                    {technicians.map((tech) => (
                        <div
                            key={tech.id}
                            className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg"
                        >
                            <div className="w-10 h-10 rounded-full bg-[#5f3bff]/10 flex items-center justify-center">
                                <User size={20} className="text-[#5f3bff]" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900">{tech.name}</p>
                                <p className="text-sm text-gray-500">{formatPhone(tech.phone)}</p>
                                {tech.onCallDays.length > 0 && (
                                    <p className="text-xs text-gray-400 mt-1">
                                        On-call: {tech.onCallDays.join(', ')}
                                    </p>
                                )}
                            </div>
                            <button
                                onClick={() => handleRemoveTechnician(tech.id)}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Technician Form */}
            {showAddForm ? (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-4">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <UserPlus size={18} className="text-[#5f3bff]" />
                        Add Technician
                    </h3>

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Name
                        </label>
                        <div className="relative">
                            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={newTech.name || ''}
                                onChange={(e) => setNewTech(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="John Smith"
                                className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f3bff] focus:border-[#5f3bff] transition-colors text-gray-900 placeholder:text-gray-400"
                            />
                        </div>
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Phone Number
                        </label>
                        <div className="relative">
                            <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="tel"
                                value={newTech.phone || ''}
                                onChange={(e) => setNewTech(prev => ({ ...prev, phone: e.target.value }))}
                                placeholder="(555) 123-4567"
                                className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f3bff] focus:border-[#5f3bff] transition-colors text-gray-900 placeholder:text-gray-400"
                            />
                        </div>
                    </div>

                    {/* On-Call Days */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            On-Call Days <span className="text-gray-400 font-normal">(optional)</span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {DAYS.map((day) => (
                                <button
                                    key={day}
                                    onClick={() => toggleOnCallDay(day)}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                        newTech.onCallDays?.includes(day)
                                            ? 'bg-[#5f3bff] text-white'
                                            : 'bg-white border border-gray-300 text-gray-600 hover:border-gray-400'
                                    }`}
                                >
                                    {day}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={handleAddTechnician}
                            disabled={!newTech.name?.trim() || !newTech.phone?.trim()}
                            className="flex-1 px-4 py-2.5 bg-[#5f3bff] text-white rounded-lg font-medium hover:bg-[#4f2fe0] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Add Technician
                        </button>
                        {technicians.length > 0 && (
                            <button
                                onClick={() => {
                                    setShowAddForm(false)
                                    setNewTech({ name: '', phone: '', onCallDays: [] })
                                }}
                                className="px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center gap-2 text-[#5f3bff] font-medium hover:underline"
                >
                    <Plus size={18} />
                    Add another technician
                </button>
            )}

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                    <strong>How it works:</strong> When an emergency call comes in after hours, your AI will notify the on-call technician via SMS. If no response, it will try the next available person.
                </p>
            </div>
        </div>
    )
}
