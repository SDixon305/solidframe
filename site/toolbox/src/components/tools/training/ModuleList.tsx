'use client'

import React from 'react'
import { BookOpen, Clock, CheckCircle, ChevronRight, Lock, Play, Award } from 'lucide-react'

export interface TrainingLesson {
    id: string
    title: string
    duration: string
    completed: boolean
}

export interface TrainingModuleData {
    id: string
    name: string
    description: string
    lessonsCount: number
    completedLessons: number
    duration: string
    status: 'not_started' | 'in_progress' | 'completed'
    lessons: TrainingLesson[]
    hasCertification: boolean
}

interface ModuleListProps {
    modules: TrainingModuleData[]
    onModuleClick: (module: TrainingModuleData) => void
    compact?: boolean
}

export default function ModuleList({ modules, onModuleClick, compact = false }: ModuleListProps) {
    const getStatusConfig = (status: TrainingModuleData['status']) => {
        switch (status) {
            case 'completed':
                return { label: 'Completed', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle }
            case 'in_progress':
                return { label: 'In Progress', color: 'bg-blue-100 text-blue-700', icon: Play }
            case 'not_started':
                return { label: 'Not Started', color: 'bg-gray-100 text-gray-600', icon: Lock }
        }
    }

    if (compact) {
        return (
            <div className="space-y-2">
                {modules.map((module) => {
                    const config = getStatusConfig(module.status)
                    const progress = module.lessonsCount > 0
                        ? Math.round((module.completedLessons / module.lessonsCount) * 100)
                        : 0

                    return (
                        <button
                            key={module.id}
                            onClick={() => onModuleClick(module)}
                            className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left"
                        >
                            <div className={`p-2 rounded-lg ${
                                module.status === 'completed' ? 'bg-emerald-100' : 'bg-gray-200'
                            }`}>
                                <BookOpen size={16} className={
                                    module.status === 'completed' ? 'text-emerald-600' : 'text-gray-500'
                                } />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="font-medium text-gray-900 text-sm truncate">{module.name}</div>
                                <div className="text-xs text-gray-500">
                                    {module.completedLessons}/{module.lessonsCount} lessons
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-medium text-gray-900">{progress}%</div>
                            </div>
                        </button>
                    )
                })}
            </div>
        )
    }

    return (
        <div className="grid md:grid-cols-2 gap-4">
            {modules.map((module) => {
                const config = getStatusConfig(module.status)
                const StatusIcon = config.icon
                const progress = module.lessonsCount > 0
                    ? Math.round((module.completedLessons / module.lessonsCount) * 100)
                    : 0

                return (
                    <button
                        key={module.id}
                        onClick={() => onModuleClick(module)}
                        className="relative text-left p-5 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all group"
                    >
                        {/* Certification badge */}
                        {module.hasCertification && module.status === 'completed' && (
                            <div className="absolute top-4 right-4">
                                <Award size={20} className="text-amber-500" />
                            </div>
                        )}

                        {/* Icon */}
                        <div className={`inline-flex p-3 rounded-xl mb-4 ${
                            module.status === 'completed'
                                ? 'bg-emerald-100'
                                : module.status === 'in_progress'
                                    ? 'bg-blue-100'
                                    : 'bg-gray-100'
                        }`}>
                            <BookOpen size={24} className={
                                module.status === 'completed'
                                    ? 'text-emerald-600'
                                    : module.status === 'in_progress'
                                        ? 'text-blue-600'
                                        : 'text-gray-500'
                            } />
                        </div>

                        {/* Title & Description */}
                        <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-[#5f3bff] transition-colors">
                            {module.name}
                        </h3>
                        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{module.description}</p>

                        {/* Progress bar */}
                        <div className="mb-3">
                            <div className="flex items-center justify-between text-xs mb-1">
                                <span className="text-gray-500">
                                    {module.completedLessons} of {module.lessonsCount} lessons
                                </span>
                                <span className="font-medium text-gray-700">{progress}%</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all ${
                                        module.status === 'completed'
                                            ? 'bg-emerald-500'
                                            : module.status === 'in_progress'
                                                ? 'bg-blue-500'
                                                : 'bg-gray-300'
                                    }`}
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>

                        {/* Meta info */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-xs text-gray-400">
                                <div className="flex items-center gap-1">
                                    <Clock size={12} />
                                    <span>{module.duration}</span>
                                </div>
                                <span className={`px-2 py-0.5 rounded-full font-medium ${config.color}`}>
                                    {config.label}
                                </span>
                            </div>
                            <ChevronRight size={16} className="text-gray-400 group-hover:text-[#5f3bff] transition-colors" />
                        </div>
                    </button>
                )
            })}
        </div>
    )
}

// Generate fake training modules
export function generateTrainingModules(tenantId: string): TrainingModuleData[] {
    const seed = tenantId.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
    const seededRandom = (offset: number) => {
        const x = Math.sin(seed + offset) * 10000
        return x - Math.floor(x)
    }

    const modules: TrainingModuleData[] = [
        {
            id: 'safety',
            name: 'Safety Fundamentals',
            description: 'Essential safety protocols for HVAC technicians, including electrical safety, refrigerant handling, and proper PPE usage.',
            lessonsCount: 8,
            duration: '45 min',
            hasCertification: true,
        },
        {
            id: 'customer-service',
            name: 'Customer Service Excellence',
            description: 'Best practices for professional customer interactions, handling complaints, and building long-term relationships.',
            lessonsCount: 6,
            duration: '30 min',
            hasCertification: true,
        },
        {
            id: 'hvac-basics',
            name: 'HVAC Basics Refresher',
            description: 'Review fundamental HVAC concepts, system types, and common troubleshooting techniques.',
            lessonsCount: 10,
            duration: '60 min',
            hasCertification: true,
        },
        {
            id: 'electrical',
            name: 'Electrical Safety',
            description: 'Comprehensive electrical safety training including lockout/tagout, voltage testing, and arc flash awareness.',
            lessonsCount: 5,
            duration: '25 min',
            hasCertification: true,
        },
        {
            id: 'first-call',
            name: 'First Call Resolution',
            description: 'Techniques for diagnosing and resolving issues on the first visit, improving customer satisfaction and efficiency.',
            lessonsCount: 4,
            duration: '20 min',
            hasCertification: false,
        },
    ].map((module, index) => {
        // Determine completion status based on seeded random
        const progressRandom = seededRandom(index * 10)
        let completedLessons: number
        let status: TrainingModuleData['status']

        if (index === 0) {
            // First module always completed
            completedLessons = module.lessonsCount
            status = 'completed'
        } else if (progressRandom < 0.3) {
            completedLessons = 0
            status = 'not_started'
        } else if (progressRandom < 0.6) {
            completedLessons = Math.floor(seededRandom(index * 10 + 1) * (module.lessonsCount - 1)) + 1
            status = 'in_progress'
        } else {
            completedLessons = module.lessonsCount
            status = 'completed'
        }

        // Generate lessons
        const lessons: TrainingLesson[] = Array.from({ length: module.lessonsCount }, (_, i) => ({
            id: `${module.id}-lesson-${i + 1}`,
            title: `Lesson ${i + 1}: ${getLessonTitle(module.id, i)}`,
            duration: `${3 + Math.floor(seededRandom(index * 100 + i) * 5)} min`,
            completed: i < completedLessons,
        }))

        return {
            ...module,
            completedLessons,
            status,
            lessons,
        }
    })

    return modules
}

function getLessonTitle(moduleId: string, lessonIndex: number): string {
    const titles: Record<string, string[]> = {
        safety: [
            'Introduction to Workplace Safety',
            'Personal Protective Equipment',
            'Electrical Hazard Awareness',
            'Refrigerant Safety Handling',
            'Ladder and Height Safety',
            'Heat Stress Prevention',
            'Emergency Procedures',
            'Safety Documentation',
        ],
        'customer-service': [
            'First Impressions Matter',
            'Active Listening Skills',
            'Explaining Technical Issues',
            'Handling Difficult Customers',
            'Upselling with Integrity',
            'Follow-up Best Practices',
        ],
        'hvac-basics': [
            'HVAC System Overview',
            'Heating Systems Types',
            'Cooling Systems Types',
            'Air Distribution Basics',
            'Thermostat Fundamentals',
            'Refrigeration Cycle',
            'Electrical Components',
            'Diagnostic Procedures',
            'Common Failure Modes',
            'Maintenance Essentials',
        ],
        electrical: [
            'Electrical Safety Overview',
            'Voltage and Current Basics',
            'Lockout/Tagout Procedures',
            'Testing Equipment',
            'Emergency Response',
        ],
        'first-call': [
            'Preparation is Key',
            'Systematic Diagnostics',
            'Common Quick Fixes',
            'When to Escalate',
        ],
    }

    return titles[moduleId]?.[lessonIndex] || `Topic ${lessonIndex + 1}`
}
