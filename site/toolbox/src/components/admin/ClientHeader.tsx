'use client'

import Link from 'next/link'
import { ArrowLeft, ExternalLink, MoreHorizontal, Edit2, Trash2, Mail } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import type { TenantWithStats, BusinessType } from '@/types/tenants'

interface ClientHeaderProps {
    client: TenantWithStats
    onEdit?: () => void
    onDelete?: () => void
    onSendMagicLink?: () => void
}

const businessTypeColors: Record<BusinessType | string, { bg: string; text: string }> = {
    hvac: { bg: 'bg-blue-100', text: 'text-blue-700' },
    plumbing: { bg: 'bg-cyan-100', text: 'text-cyan-700' },
    electrical: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
    roofing: { bg: 'bg-orange-100', text: 'text-orange-700' },
    general: { bg: 'bg-slate-100', text: 'text-slate-700' },
    other: { bg: 'bg-purple-100', text: 'text-purple-700' },
}

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
    active: { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
    pending: { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
    suspended: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
    cancelled: { bg: 'bg-gray-100', text: 'text-gray-700', dot: 'bg-gray-500' },
}

export function ClientHeader({ client, onEdit, onDelete, onSendMagicLink }: ClientHeaderProps) {
    const [menuOpen, setMenuOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    const businessType = client.business_type || 'general'
    const colors = businessTypeColors[businessType] || businessTypeColors.general
    const status = statusConfig[client.status] || statusConfig.pending

    // Close menu on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className="bg-white border-b border-gray-200 px-6 py-4">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <Link href="/admin/clients" className="hover:text-violet-600 flex items-center gap-1">
                    <ArrowLeft className="w-4 h-4" />
                    Clients
                </Link>
                <span>/</span>
                <span className="text-gray-900 font-medium">{client.name}</span>
            </div>

            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                    {/* Logo */}
                    {client.logo_url ? (
                        <img
                            src={client.logo_url}
                            alt={client.name}
                            className="w-16 h-16 rounded-xl object-cover border border-gray-200"
                        />
                    ) : (
                        <div className={`w-16 h-16 rounded-xl flex items-center justify-center font-bold text-2xl ${colors.bg} ${colors.text}`}>
                            {client.name.charAt(0).toUpperCase()}
                        </div>
                    )}

                    {/* Info */}
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
                            {/* Status Badge */}
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                                {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                            </span>
                            {/* Business Type */}
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text} capitalize`}>
                                {businessType}
                            </span>
                        </div>

                        {/* Subdomain */}
                        <a
                            href={`https://${client.slug}.toolbox.solidframe.ai`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-violet-600 mt-1 font-mono"
                        >
                            {client.slug}.toolbox.solidframe.ai
                            <ExternalLink className="w-3 h-3" />
                        </a>

                        {/* Owner Info */}
                        {client.owner_email && (
                            <p className="text-sm text-gray-500 mt-1">
                                {client.owner_name && <span className="font-medium">{client.owner_name}</span>}
                                {client.owner_name && ' • '}
                                {client.owner_email}
                            </p>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <MoreHorizontal className="w-5 h-5" />
                    </button>

                    {menuOpen && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                            {onEdit && (
                                <button
                                    onClick={() => {
                                        setMenuOpen(false)
                                        onEdit()
                                    }}
                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    Edit Client
                                </button>
                            )}
                            {onSendMagicLink && (
                                <button
                                    onClick={() => {
                                        setMenuOpen(false)
                                        onSendMagicLink()
                                    }}
                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                    <Mail className="w-4 h-4" />
                                    Send Login Link
                                </button>
                            )}
                            {onDelete && (
                                <>
                                    <hr className="my-1 border-gray-100" />
                                    <button
                                        onClick={() => {
                                            setMenuOpen(false)
                                            onDelete()
                                        }}
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete Client
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
