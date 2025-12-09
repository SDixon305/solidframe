'use client'

import { useState } from 'react'
import {
    Rocket,
    RotateCcw,
    AlertTriangle,
    CheckCircle2,
    X,
    Users,
    GitBranch,
} from 'lucide-react'
import { RolloutSlider } from './RolloutSlider'
import type { DbToolVersion } from '@/types/tools'

interface DeployControlsProps {
    currentProductionVersion: DbToolVersion | null
    stagingVersion: DbToolVersion | null
    previousVersion: DbToolVersion | null
    tenantCount: number
    onDeployToProduction: (version: DbToolVersion, rolloutPct: number) => Promise<void>
    onRollback: (toVersion: DbToolVersion) => Promise<void>
    onUpdateRollout: (version: DbToolVersion, rolloutPct: number) => Promise<void>
}

export function DeployControls({
    currentProductionVersion,
    stagingVersion,
    previousVersion,
    tenantCount,
    onDeployToProduction,
    onRollback,
    onUpdateRollout,
}: DeployControlsProps) {
    const [showDeployModal, setShowDeployModal] = useState(false)
    const [showRollbackModal, setShowRollbackModal] = useState(false)
    const [rolloutPct, setRolloutPct] = useState(10) // Default to 10% for new deploys
    const [isDeploying, setIsDeploying] = useState(false)
    const [isRollingBack, setIsRollingBack] = useState(false)

    const handleDeploy = async () => {
        if (!stagingVersion) return

        setIsDeploying(true)
        try {
            await onDeployToProduction(stagingVersion, rolloutPct)
            setShowDeployModal(false)
        } finally {
            setIsDeploying(false)
        }
    }

    const handleRollback = async () => {
        if (!previousVersion) return

        setIsRollingBack(true)
        try {
            await onRollback(previousVersion)
            setShowRollbackModal(false)
        } finally {
            setIsRollingBack(false)
        }
    }

    const affectedTenants = Math.round((rolloutPct / 100) * tenantCount)

    return (
        <div className="space-y-4">
            {/* Current Production Status */}
            {currentProductionVersion && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-emerald-100 rounded-lg">
                            <CheckCircle2 size={18} className="text-emerald-600" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-emerald-900">
                                Production: v{currentProductionVersion.version}
                            </h3>
                            <p className="text-xs text-emerald-700">
                                {currentProductionVersion.rollout_pct}% rollout ({Math.round((currentProductionVersion.rollout_pct / 100) * tenantCount)} tenants)
                            </p>
                        </div>
                    </div>

                    {/* Rollout slider for partial rollout */}
                    {currentProductionVersion.rollout_pct < 100 && (
                        <div className="mt-3 pt-3 border-t border-emerald-200">
                            <RolloutSlider
                                value={currentProductionVersion.rollout_pct}
                                onChange={(pct) => onUpdateRollout(currentProductionVersion, pct)}
                                tenantCount={tenantCount}
                            />
                        </div>
                    )}

                    {/* Rollback button */}
                    {previousVersion && (
                        <button
                            onClick={() => setShowRollbackModal(true)}
                            className="mt-3 flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                        >
                            <RotateCcw size={14} />
                            Rollback to v{previousVersion.version}
                        </button>
                    )}
                </div>
            )}

            {/* Staging Ready to Deploy */}
            {stagingVersion && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-amber-100 rounded-lg">
                            <Rocket size={18} className="text-amber-600" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-amber-900">
                                Staging Ready: v{stagingVersion.version}
                            </h3>
                            <p className="text-xs text-amber-700">
                                This version is ready to deploy to production
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowDeployModal(true)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-purple-600 rounded-lg hover:from-violet-700 hover:to-purple-700 shadow-sm transition-all"
                    >
                        <Rocket size={16} />
                        Deploy to Production
                    </button>
                </div>
            )}

            {/* No staging version message */}
            {!stagingVersion && !currentProductionVersion && (
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-center">
                    <p className="text-sm text-gray-600">
                        No versions are ready for deployment. Create a draft version and deploy to staging first.
                    </p>
                </div>
            )}

            {/* Deploy Confirmation Modal */}
            {showDeployModal && stagingVersion && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setShowDeployModal(false)}
                    />
                    <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-violet-100 rounded-lg">
                                    <Rocket size={20} className="text-violet-600" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        Deploy to Production
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        v{stagingVersion.version}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowDeployModal(false)}
                                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Rollout percentage selection */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-3">
                                    Select Rollout Percentage
                                </h3>
                                <RolloutSlider
                                    value={rolloutPct}
                                    onChange={setRolloutPct}
                                    tenantCount={tenantCount}
                                />
                            </div>

                            {/* Warning for full rollout */}
                            {rolloutPct === 100 && (
                                <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                    <AlertTriangle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-amber-700">
                                        <strong>Full deployment:</strong> All {tenantCount} tenants will immediately receive this version.
                                    </p>
                                </div>
                            )}

                            {/* Impact summary */}
                            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                                    Deployment Impact
                                </h4>
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-2">
                                        <GitBranch size={16} className="text-gray-400" />
                                        <span className="text-sm text-gray-700">
                                            {currentProductionVersion ? `v${currentProductionVersion.version}` : 'None'} → v{stagingVersion.version}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users size={16} className="text-gray-400" />
                                        <span className="text-sm text-gray-700">
                                            {affectedTenants} tenants affected
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
                            <button
                                onClick={() => setShowDeployModal(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeploy}
                                disabled={isDeploying}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-violet-600 rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <Rocket size={16} />
                                {isDeploying ? 'Deploying...' : `Deploy to ${rolloutPct}%`}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Rollback Confirmation Modal */}
            {showRollbackModal && previousVersion && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setShowRollbackModal(false)}
                    />
                    <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-100 rounded-lg">
                                    <RotateCcw size={20} className="text-red-600" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        Confirm Rollback
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        Restore v{previousVersion.version}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowRollbackModal(false)}
                                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
                                <AlertTriangle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm text-red-700 font-medium mb-1">
                                        This action will immediately rollback production
                                    </p>
                                    <p className="text-sm text-red-600">
                                        All {tenantCount} tenants will be reverted to v{previousVersion.version}.
                                        This happens instantly with no gradual rollout.
                                    </p>
                                </div>
                            </div>

                            {/* Version comparison */}
                            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                                    Version Change
                                </h4>
                                <div className="flex items-center gap-3">
                                    <div className="px-3 py-1.5 bg-white border border-red-200 rounded-lg">
                                        <span className="font-mono text-sm text-red-600">
                                            v{currentProductionVersion?.version}
                                        </span>
                                    </div>
                                    <span className="text-gray-400">→</span>
                                    <div className="px-3 py-1.5 bg-white border border-emerald-200 rounded-lg">
                                        <span className="font-mono text-sm text-emerald-600">
                                            v{previousVersion.version}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
                            <button
                                onClick={() => setShowRollbackModal(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRollback}
                                disabled={isRollingBack}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <RotateCcw size={16} />
                                {isRollingBack ? 'Rolling back...' : 'Confirm Rollback'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
