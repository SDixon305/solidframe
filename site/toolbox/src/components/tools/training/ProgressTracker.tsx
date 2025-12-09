'use client'

import React from 'react'
import { TrendingUp, BookOpen, Award, Clock, CheckCircle, Target } from 'lucide-react'
import { TrainingModuleData } from './ModuleList'

export interface TrainingProgress {
    totalModules: number
    completedModules: number
    totalLessons: number
    completedLessons: number
    totalDuration: string
    completedDuration: string
    certificationsEarned: number
    totalCertifications: number
    avgScore: number
    streakDays: number
}

interface ProgressTrackerProps {
    progress: TrainingProgress
    variant?: 'large' | 'compact'
}

export default function ProgressTracker({ progress, variant = 'large' }: ProgressTrackerProps) {
    const overallProgress = progress.totalLessons > 0
        ? Math.round((progress.completedLessons / progress.totalLessons) * 100)
        : 0

    // Calculate the ring progress
    const circumference = 2 * Math.PI * 45
    const progressOffset = ((100 - overallProgress) / 100) * circumference

    if (variant === 'compact') {
        return (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                    <div className="text-xs text-emerald-600 mb-1">Progress</div>
                    <div className="text-xl font-bold text-emerald-700">{overallProgress}%</div>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="text-xs text-blue-600 mb-1">Completed</div>
                    <div className="text-xl font-bold text-blue-700">{progress.completedModules}/{progress.totalModules}</div>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                    <div className="text-xs text-amber-600 mb-1">Certifications</div>
                    <div className="text-xl font-bold text-amber-700">{progress.certificationsEarned}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="text-xs text-gray-500 mb-1">Avg Score</div>
                    <div className="text-xl font-bold text-gray-700">{progress.avgScore}%</div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {/* Hero progress */}
            <div className="bg-gradient-to-br from-[#5f3bff] to-[#4f2fe0] rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-white/70 text-sm font-medium mb-2">Overall Progress</div>
                        <div className="text-5xl font-bold mb-1">{overallProgress}%</div>
                        <div className="flex items-center gap-1 text-white/70">
                            <CheckCircle size={14} />
                            <span className="text-sm">
                                {progress.completedLessons} of {progress.totalLessons} lessons completed
                            </span>
                        </div>
                    </div>

                    {/* Circular progress */}
                    <div className="relative">
                        <svg width="100" height="100" className="transform -rotate-90">
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                stroke="rgba(255,255,255,0.2)"
                                strokeWidth="8"
                            />
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                stroke="white"
                                strokeWidth="8"
                                strokeDasharray={circumference}
                                strokeDashoffset={progressOffset}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <BookOpen size={24} className="text-white" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-500">Modules</span>
                        <BookOpen size={16} className="text-gray-400" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                        {progress.completedModules}/{progress.totalModules}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">completed</div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-500">Certifications</span>
                        <Award size={16} className="text-amber-500" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                        {progress.certificationsEarned}/{progress.totalCertifications}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">earned</div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-500">Avg Score</span>
                        <Target size={16} className="text-emerald-500" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{progress.avgScore}%</div>
                    <div className="text-xs text-gray-400 mt-1">quiz average</div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-500">Time Spent</span>
                        <Clock size={16} className="text-[#5f3bff]" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{progress.completedDuration}</div>
                    <div className="text-xs text-gray-400 mt-1">of {progress.totalDuration}</div>
                </div>
            </div>

            {/* Streak indicator */}
            {progress.streakDays > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-100 rounded-lg">
                            <TrendingUp size={20} className="text-amber-600" />
                        </div>
                        <div>
                            <div className="font-semibold text-amber-800">
                                {progress.streakDays} Day Streak!
                            </div>
                            <div className="text-sm text-amber-600">
                                Keep it up! Training daily builds skills faster.
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

// Generate fake progress from modules
export function generateTrainingProgress(modules: TrainingModuleData[], tenantId: string): TrainingProgress {
    const seed = tenantId.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
    const seededRandom = (offset: number) => {
        const x = Math.sin(seed + offset) * 10000
        return x - Math.floor(x)
    }

    const totalLessons = modules.reduce((sum, m) => sum + m.lessonsCount, 0)
    const completedLessons = modules.reduce((sum, m) => sum + m.completedLessons, 0)
    const completedModules = modules.filter(m => m.status === 'completed').length
    const certificationsEarned = modules.filter(m => m.hasCertification && m.status === 'completed').length
    const totalCertifications = modules.filter(m => m.hasCertification).length

    // Estimate durations
    const totalMinutes = modules.reduce((sum, m) => sum + parseInt(m.duration), 0)
    const completedMinutes = Math.round((completedLessons / totalLessons) * totalMinutes)

    const formatDuration = (minutes: number) => {
        if (minutes < 60) return `${minutes} min`
        const hours = Math.floor(minutes / 60)
        const mins = minutes % 60
        return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
    }

    return {
        totalModules: modules.length,
        completedModules,
        totalLessons,
        completedLessons,
        totalDuration: formatDuration(totalMinutes),
        completedDuration: formatDuration(completedMinutes),
        certificationsEarned,
        totalCertifications,
        avgScore: 85 + Math.floor(seededRandom(1) * 12),
        streakDays: Math.floor(seededRandom(2) * 7),
    }
}
