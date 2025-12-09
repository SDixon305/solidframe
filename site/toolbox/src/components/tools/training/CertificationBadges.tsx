'use client'

import React from 'react'
import { Award, Shield, Zap, Heart, Lock, Calendar, CheckCircle } from 'lucide-react'
import { format } from 'date-fns'

export interface Certification {
    id: string
    name: string
    description: string
    moduleId: string
    icon: 'award' | 'shield' | 'zap' | 'heart'
    color: string
    earnedAt: Date | null
    expiresAt: Date | null
}

interface CertificationBadgesProps {
    certifications: Certification[]
    variant?: 'grid' | 'list' | 'compact'
}

const ICON_MAP = {
    award: Award,
    shield: Shield,
    zap: Zap,
    heart: Heart,
}

export default function CertificationBadges({ certifications, variant = 'grid' }: CertificationBadgesProps) {
    const earnedCerts = certifications.filter(c => c.earnedAt !== null)
    const lockedCerts = certifications.filter(c => c.earnedAt === null)

    if (variant === 'compact') {
        return (
            <div className="flex flex-wrap gap-2">
                {certifications.map((cert) => {
                    const Icon = ICON_MAP[cert.icon]
                    const isEarned = cert.earnedAt !== null

                    return (
                        <div
                            key={cert.id}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                                isEarned
                                    ? `bg-${cert.color}-50 border-${cert.color}-200`
                                    : 'bg-gray-50 border-gray-200 opacity-50'
                            }`}
                            style={isEarned ? { backgroundColor: `${cert.color}15`, borderColor: `${cert.color}40` } : {}}
                        >
                            <div
                                className={`p-1.5 rounded-md ${isEarned ? '' : 'bg-gray-200'}`}
                                style={isEarned ? { backgroundColor: `${cert.color}20` } : {}}
                            >
                                {isEarned ? (
                                    <Icon size={14} style={{ color: cert.color }} />
                                ) : (
                                    <Lock size={14} className="text-gray-400" />
                                )}
                            </div>
                            <span className={`text-sm font-medium ${isEarned ? 'text-gray-900' : 'text-gray-400'}`}>
                                {cert.name}
                            </span>
                        </div>
                    )
                })}
            </div>
        )
    }

    if (variant === 'list') {
        return (
            <div className="space-y-3">
                {certifications.map((cert) => {
                    const Icon = ICON_MAP[cert.icon]
                    const isEarned = cert.earnedAt !== null

                    return (
                        <div
                            key={cert.id}
                            className={`flex items-center gap-4 p-4 rounded-xl border ${
                                isEarned ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-100'
                            }`}
                        >
                            <div
                                className={`p-3 rounded-xl ${isEarned ? '' : 'bg-gray-200'}`}
                                style={isEarned ? { backgroundColor: `${cert.color}15` } : {}}
                            >
                                {isEarned ? (
                                    <Icon size={24} style={{ color: cert.color }} />
                                ) : (
                                    <Lock size={24} className="text-gray-400" />
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className={`font-medium ${isEarned ? 'text-gray-900' : 'text-gray-400'}`}>
                                    {cert.name}
                                </div>
                                <div className={`text-sm ${isEarned ? 'text-gray-500' : 'text-gray-400'}`}>
                                    {cert.description}
                                </div>
                            </div>

                            {isEarned && cert.earnedAt && (
                                <div className="text-right shrink-0">
                                    <div className="flex items-center gap-1 text-emerald-600 text-sm font-medium">
                                        <CheckCircle size={14} />
                                        Earned
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        {format(cert.earnedAt, 'MMM d, yyyy')}
                                    </div>
                                </div>
                            )}

                            {!isEarned && (
                                <div className="text-right shrink-0">
                                    <div className="text-sm text-gray-400 font-medium">Locked</div>
                                    <div className="text-xs text-gray-400">Complete module</div>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        )
    }

    // Grid variant
    return (
        <div className="space-y-6">
            {/* Earned certifications */}
            {earnedCerts.length > 0 && (
                <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                        <CheckCircle size={16} className="text-emerald-500" />
                        Earned Certifications ({earnedCerts.length})
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        {earnedCerts.map((cert) => {
                            const Icon = ICON_MAP[cert.icon]

                            return (
                                <div
                                    key={cert.id}
                                    className="relative p-5 bg-white border border-gray-200 rounded-xl overflow-hidden"
                                >
                                    {/* Background gradient accent */}
                                    <div
                                        className="absolute top-0 right-0 w-24 h-24 opacity-10 rounded-bl-full"
                                        style={{ backgroundColor: cert.color }}
                                    />

                                    <div className="relative">
                                        <div
                                            className="inline-flex p-3 rounded-xl mb-4"
                                            style={{ backgroundColor: `${cert.color}15` }}
                                        >
                                            <Icon size={28} style={{ color: cert.color }} />
                                        </div>

                                        <h4 className="text-lg font-semibold text-gray-900 mb-1">{cert.name}</h4>
                                        <p className="text-sm text-gray-500 mb-4">{cert.description}</p>

                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                            <div className="flex items-center gap-1 text-emerald-600 text-sm font-medium">
                                                <CheckCircle size={14} />
                                                Certified
                                            </div>
                                            {cert.earnedAt && (
                                                <div className="flex items-center gap-1 text-xs text-gray-400">
                                                    <Calendar size={12} />
                                                    {format(cert.earnedAt, 'MMM d, yyyy')}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Locked certifications */}
            {lockedCerts.length > 0 && (
                <div>
                    <h3 className="text-sm font-semibold text-gray-400 mb-4 flex items-center gap-2">
                        <Lock size={16} />
                        Available to Earn ({lockedCerts.length})
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        {lockedCerts.map((cert) => {
                            const Icon = ICON_MAP[cert.icon]

                            return (
                                <div
                                    key={cert.id}
                                    className="relative p-5 bg-gray-50 border border-gray-100 rounded-xl"
                                >
                                    <div className="inline-flex p-3 rounded-xl bg-gray-200 mb-4">
                                        <Lock size={28} className="text-gray-400" />
                                    </div>

                                    <h4 className="text-lg font-semibold text-gray-400 mb-1">{cert.name}</h4>
                                    <p className="text-sm text-gray-400 mb-4">{cert.description}</p>

                                    <div className="pt-4 border-t border-gray-200">
                                        <span className="text-sm text-gray-400">
                                            Complete the module to earn this certification
                                        </span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {certifications.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100">
                    <Award size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">No Certifications Yet</h3>
                    <p className="text-sm text-gray-500">
                        Complete training modules to earn certifications
                    </p>
                </div>
            )}
        </div>
    )
}

// Generate certifications from modules
export function generateCertifications(modules: { id: string; name: string; status: string; hasCertification: boolean }[], tenantId: string): Certification[] {
    const seed = tenantId.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
    const seededRandom = (offset: number) => {
        const x = Math.sin(seed + offset) * 10000
        return x - Math.floor(x)
    }

    const certConfigs: Record<string, { icon: Certification['icon']; color: string; description: string }> = {
        safety: { icon: 'shield', color: '#10b981', description: 'Demonstrated knowledge of workplace safety protocols and procedures.' },
        'customer-service': { icon: 'heart', color: '#ec4899', description: 'Proven skills in professional customer interactions and service excellence.' },
        'hvac-basics': { icon: 'zap', color: '#f59e0b', description: 'Solid understanding of HVAC fundamentals and system operations.' },
        electrical: { icon: 'shield', color: '#3b82f6', description: 'Certified in electrical safety procedures and best practices.' },
    }

    return modules
        .filter(m => m.hasCertification)
        .map((module, index) => {
            const config = certConfigs[module.id] || { icon: 'award' as const, color: '#5f3bff', description: 'Completed training certification.' }
            const isEarned = module.status === 'completed'
            const daysAgo = 5 + Math.floor(seededRandom(index * 10) * 30)
            const earnedAt = isEarned ? new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000) : null

            return {
                id: `cert-${module.id}`,
                name: `${module.name} Certified`,
                description: config.description,
                moduleId: module.id,
                icon: config.icon,
                color: config.color,
                earnedAt,
                expiresAt: earnedAt ? new Date(earnedAt.getTime() + 365 * 24 * 60 * 60 * 1000) : null,
            }
        })
}
