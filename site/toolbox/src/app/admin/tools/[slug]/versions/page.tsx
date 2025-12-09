'use client'

import { use, useState, useMemo } from 'react'
import Link from 'next/link'
import {
    ArrowLeft,
    Plus,
    Zap,
    DollarSign,
    Mic,
    Globe,
    Search,
    Activity,
    CheckSquare,
    Video,
    AlertTriangle,
    X,
    Rocket,
    RotateCcw,
} from 'lucide-react'
import { getMockTool, getMockVersions, getMockTenantCount, mockVersions } from '@/lib/mock-data/tools'
import { VersionCard } from '@/components/admin/VersionCard'
import { VersionEditor } from '@/components/admin/VersionEditor'
import { DeployControls } from '@/components/admin/DeployControls'
import { RolloutSlider } from '@/components/admin/RolloutSlider'
import type { DbToolVersion } from '@/types/tools'
import { suggestNextVersion, findPreviousProductionVersion } from '@/lib/tool-engine'

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
    calculator: DollarSign,
    mic: Mic,
    scraper: Globe,
    star: Video,
    search: Search,
    chart: Activity,
    toggle: CheckSquare,
}

export default function VersionManagementPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = use(params)
    const tool = getMockTool(slug)
    const initialVersions = getMockVersions(tool?.id || '')

    // Local state for versions (simulating API updates)
    const [versions, setVersions] = useState<DbToolVersion[]>(initialVersions)
    const [editingVersion, setEditingVersion] = useState<DbToolVersion | null>(null)

    // Modal states
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showDeployToStagingModal, setShowDeployToStagingModal] = useState<DbToolVersion | null>(null)
    const [showDeployToProductionModal, setShowDeployToProductionModal] = useState<DbToolVersion | null>(null)
    const [showRollbackModal, setShowRollbackModal] = useState<DbToolVersion | null>(null)
    const [rolloutPct, setRolloutPct] = useState(10)

    // Processing states
    const [isProcessing, setIsProcessing] = useState(false)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)

    if (!tool) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <h2 className="text-lg font-semibold text-gray-900">Tool not found</h2>
                    <p className="text-sm text-gray-500 mt-1">The tool &quot;{slug}&quot; does not exist</p>
                    <Link
                        href="/admin/tools"
                        className="inline-flex items-center gap-2 mt-4 text-sm text-violet-600 hover:text-violet-700"
                    >
                        <ArrowLeft size={14} />
                        Back to tools
                    </Link>
                </div>
            </div>
        )
    }

    const tenantCount = getMockTenantCount(tool.id)
    const Icon = iconMap[tool.icon || ''] || Zap

    // Computed version states
    const productionVersion = useMemo(() => versions.find(v => v.status === 'production'), [versions])
    const stagingVersion = useMemo(() => versions.find(v => v.status === 'staging'), [versions])
    const draftVersions = useMemo(() => versions.filter(v => v.status === 'draft'), [versions])
    const deprecatedVersions = useMemo(() => versions.filter(v => v.status === 'deprecated'), [versions])
    const previousVersion = useMemo(
        () => productionVersion ? findPreviousProductionVersion(versions, productionVersion.id) : null,
        [versions, productionVersion]
    )

    // Sort versions by date (newest first)
    const sortedVersions = useMemo(() => {
        return [...versions].sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
    }, [versions])

    // Get next version suggestion
    const latestVersion = sortedVersions[0]?.version || '1.0.0'
    const suggestedVersion = suggestNextVersion(latestVersion)

    // Show success message temporarily
    const showSuccess = (message: string) => {
        setSuccessMessage(message)
        setTimeout(() => setSuccessMessage(null), 3000)
    }

    // Handler: Create new version
    const handleCreateVersion = async () => {
        setIsProcessing(true)

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500))

        const newVersion: DbToolVersion = {
            id: `ver-${Date.now()}`,
            tool_id: tool.id,
            version: suggestedVersion,
            config_schema: sortedVersions[0]?.config_schema || { type: 'object', properties: {}, default: {} },
            status: 'draft',
            rollout_pct: 0,
            changelog: 'New version',
            created_at: new Date().toISOString(),
        }

        setVersions(prev => [newVersion, ...prev])
        setShowCreateModal(false)
        setIsProcessing(false)
        showSuccess(`Created version v${suggestedVersion}`)
    }

    // Handler: Deploy to staging
    const handleDeployToStaging = async (version: DbToolVersion) => {
        setIsProcessing(true)

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500))

        // Move current staging to draft if exists
        setVersions(prev => prev.map(v => {
            if (v.id === version.id) {
                return { ...v, status: 'staging' as const }
            }
            if (v.status === 'staging') {
                return { ...v, status: 'draft' as const }
            }
            return v
        }))

        setShowDeployToStagingModal(null)
        setIsProcessing(false)
        showSuccess(`Deployed v${version.version} to staging`)
    }

    // Handler: Deploy to production
    const handleDeployToProduction = async (version: DbToolVersion, pct: number) => {
        setIsProcessing(true)

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500))

        setVersions(prev => prev.map(v => {
            if (v.id === version.id) {
                return { ...v, status: 'production' as const, rollout_pct: pct }
            }
            if (v.status === 'production') {
                return { ...v, status: 'deprecated' as const }
            }
            return v
        }))

        setShowDeployToProductionModal(null)
        setIsProcessing(false)
        showSuccess(`Deployed v${version.version} to production at ${pct}%`)
    }

    // Handler: Rollback
    const handleRollback = async (toVersion: DbToolVersion) => {
        setIsProcessing(true)

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500))

        setVersions(prev => prev.map(v => {
            if (v.id === toVersion.id) {
                return { ...v, status: 'production' as const, rollout_pct: 100 }
            }
            if (v.status === 'production') {
                return { ...v, status: 'deprecated' as const }
            }
            return v
        }))

        setShowRollbackModal(null)
        setIsProcessing(false)
        showSuccess(`Rolled back to v${toVersion.version}`)
    }

    // Handler: Update rollout percentage
    const handleUpdateRollout = async (version: DbToolVersion, pct: number) => {
        // Optimistic update
        setVersions(prev => prev.map(v => {
            if (v.id === version.id) {
                return { ...v, rollout_pct: pct }
            }
            return v
        }))
    }

    // Handler: Save version config
    const handleSaveVersion = async (version: DbToolVersion, configSchema: Record<string, unknown>, changelog: string) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500))

        setVersions(prev => prev.map(v => {
            if (v.id === version.id) {
                return { ...v, config_schema: configSchema, changelog }
            }
            return v
        }))

        showSuccess(`Saved changes to v${version.version}`)
    }

    return (
        <div className="space-y-6">
            {/* Success Toast */}
            {successMessage && (
                <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2">
                    <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-lg shadow-lg">
                        <div className="p-1 bg-emerald-100 rounded-full">
                            <Zap size={14} className="text-emerald-600" />
                        </div>
                        <span className="text-sm font-medium text-emerald-800">{successMessage}</span>
                    </div>
                </div>
            )}

            {/* Back button */}
            <Link
                href={`/admin/tools/${slug}`}
                className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
                <ArrowLeft size={14} />
                Back to {tool.name}
            </Link>

            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 shadow-md">
                        <Icon size={24} className="text-amber-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">{tool.name} Versions</h1>
                        <p className="text-sm text-gray-500 mt-0.5">
                            {versions.length} version{versions.length !== 1 ? 's' : ''} &middot; {tenantCount} tenants using this tool
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors"
                >
                    <Plus size={16} />
                    New Version
                </button>
            </div>

            {/* Deploy Controls */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h2 className="text-base font-semibold text-gray-900 mb-4">Deployment Status</h2>
                <DeployControls
                    currentProductionVersion={productionVersion || null}
                    stagingVersion={stagingVersion || null}
                    previousVersion={previousVersion}
                    tenantCount={tenantCount}
                    onDeployToProduction={async (version, pct) => {
                        await handleDeployToProduction(version, pct)
                    }}
                    onRollback={async (version) => {
                        await handleRollback(version)
                    }}
                    onUpdateRollout={async (version, pct) => {
                        await handleUpdateRollout(version, pct)
                    }}
                />
            </div>

            {/* Version List */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-base font-semibold text-gray-900">All Versions</h2>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            {versions.filter(v => v.status === 'production').length} Production
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-amber-500" />
                            {versions.filter(v => v.status === 'staging').length} Staging
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-gray-400" />
                            {versions.filter(v => v.status === 'draft').length} Draft
                        </span>
                    </div>
                </div>

                <div className="divide-y divide-gray-100">
                    {sortedVersions.length > 0 ? (
                        sortedVersions.map((version, index) => (
                            <div key={version.id} className="p-4">
                                <VersionCard
                                    version={version}
                                    isLatest={index === 0}
                                    onEdit={() => setEditingVersion(version)}
                                    onDeployToStaging={() => setShowDeployToStagingModal(version)}
                                    onDeployToProduction={() => {
                                        setRolloutPct(10)
                                        setShowDeployToProductionModal(version)
                                    }}
                                    onRollback={previousVersion ? () => setShowRollbackModal(version) : undefined}
                                    onUpdateRollout={(ver, pct) => handleUpdateRollout(ver, pct)}
                                />
                            </div>
                        ))
                    ) : (
                        <div className="p-12 text-center">
                            <p className="text-sm text-gray-500">No versions yet. Create your first version to get started.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Version Editor Modal */}
            {editingVersion && (
                <VersionEditor
                    version={editingVersion}
                    isOpen={!!editingVersion}
                    onClose={() => setEditingVersion(null)}
                    onSave={handleSaveVersion}
                />
            )}

            {/* Create Version Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setShowCreateModal(false)}
                    />
                    <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">Create New Version</h2>
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            <p className="text-sm text-gray-600 mb-4">
                                This will create a new draft version <strong>v{suggestedVersion}</strong> based on the latest version&apos;s configuration.
                            </p>
                            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">New Version</span>
                                    <span className="font-mono font-semibold text-gray-900">v{suggestedVersion}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateVersion}
                                disabled={isProcessing}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-violet-600 rounded-lg hover:bg-violet-700 disabled:opacity-50"
                            >
                                <Plus size={16} />
                                {isProcessing ? 'Creating...' : 'Create Version'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Deploy to Staging Modal */}
            {showDeployToStagingModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setShowDeployToStagingModal(null)}
                    />
                    <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-amber-100 rounded-lg">
                                    <Rocket size={18} className="text-amber-600" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">Deploy to Staging</h2>
                                    <p className="text-sm text-gray-500">v{showDeployToStagingModal.version}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowDeployToStagingModal(null)}
                                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <div className="p-6">
                            <p className="text-sm text-gray-600 mb-4">
                                This will deploy version <strong>v{showDeployToStagingModal.version}</strong> to the staging environment for testing.
                            </p>
                            {stagingVersion && (
                                <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                    <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-amber-700">
                                        Current staging version <strong>v{stagingVersion.version}</strong> will be moved back to draft.
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
                            <button
                                onClick={() => setShowDeployToStagingModal(null)}
                                className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDeployToStaging(showDeployToStagingModal)}
                                disabled={isProcessing}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700 disabled:opacity-50"
                            >
                                <Rocket size={16} />
                                {isProcessing ? 'Deploying...' : 'Deploy to Staging'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Deploy to Production Modal */}
            {showDeployToProductionModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setShowDeployToProductionModal(null)}
                    />
                    <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-100 rounded-lg">
                                    <Rocket size={18} className="text-emerald-600" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">Deploy to Production</h2>
                                    <p className="text-sm text-gray-500">v{showDeployToProductionModal.version}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowDeployToProductionModal(null)}
                                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-3">Select Rollout Percentage</h3>
                                <RolloutSlider
                                    value={rolloutPct}
                                    onChange={setRolloutPct}
                                    tenantCount={tenantCount}
                                />
                            </div>

                            {rolloutPct === 100 && (
                                <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                    <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-amber-700">
                                        <strong>Full rollout:</strong> All {tenantCount} tenants will immediately receive this version.
                                    </p>
                                </div>
                            )}

                            {productionVersion && (
                                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">Version Change</div>
                                    <div className="flex items-center gap-3">
                                        <span className="font-mono text-sm text-gray-600">v{productionVersion.version}</span>
                                        <span className="text-gray-400">&rarr;</span>
                                        <span className="font-mono text-sm font-semibold text-emerald-600">v{showDeployToProductionModal.version}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
                            <button
                                onClick={() => setShowDeployToProductionModal(null)}
                                className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDeployToProduction(showDeployToProductionModal, rolloutPct)}
                                disabled={isProcessing}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 disabled:opacity-50"
                            >
                                <Rocket size={16} />
                                {isProcessing ? 'Deploying...' : `Deploy to ${rolloutPct}%`}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Rollback Modal */}
            {showRollbackModal && previousVersion && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setShowRollbackModal(null)}
                    />
                    <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-100 rounded-lg">
                                    <RotateCcw size={18} className="text-red-600" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">Confirm Rollback</h2>
                                    <p className="text-sm text-gray-500">Restore v{previousVersion.version}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowRollbackModal(null)}
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
                                        All {tenantCount} tenants will be reverted to v{previousVersion.version} instantly.
                                    </p>
                                </div>
                            </div>

                            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                                <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">Version Change</div>
                                <div className="flex items-center gap-3">
                                    <div className="px-3 py-1.5 bg-white border border-red-200 rounded-lg">
                                        <span className="font-mono text-sm text-red-600">v{productionVersion?.version}</span>
                                    </div>
                                    <span className="text-gray-400">&rarr;</span>
                                    <div className="px-3 py-1.5 bg-white border border-emerald-200 rounded-lg">
                                        <span className="font-mono text-sm text-emerald-600">v{previousVersion.version}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
                            <button
                                onClick={() => setShowRollbackModal(null)}
                                className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleRollback(previousVersion)}
                                disabled={isProcessing}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
                            >
                                <RotateCcw size={16} />
                                {isProcessing ? 'Rolling back...' : 'Confirm Rollback'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
