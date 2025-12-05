'use client'

import { useEffect, useState } from 'react'
import { Phone, AlertTriangle, Clock, CheckCircle, ArrowLeft } from 'lucide-react'
import CallCard from '@/components/CallCard'
import Link from 'next/link'

interface Call {
    id: string
    customer_name?: string
    customer_phone?: string
    customer_address?: string
    issue_description?: string
    transcript?: string
    priority_level: 'emergency' | 'standard'
    status: string
    created_at: string
    duration_seconds?: number
}

export default function Dashboard() {
    const [calls, setCalls] = useState<Call[]>([])
    const [stats, setStats] = useState({
        total: 0,
        emergency: 0,
        standard: 0,
        active: 0,
    })
    const [selectedCall, setSelectedCall] = useState<Call | null>(null)

    // Mock data for demo
    useEffect(() => {
        const mockCalls: Call[] = [
            {
                id: '1',
                customer_name: 'Sarah Mitchell',
                customer_phone: '+1 (555) 123-4567',
                customer_address: '847 Oak Street',
                issue_description: 'Furnace stopped working, strong gas smell, two young children in house',
                transcript: 'Full transcript would appear here...',
                priority_level: 'emergency',
                status: 'dispatched',
                created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
                duration_seconds: 180,
            },
            {
                id: '2',
                customer_name: 'John Davis',
                customer_phone: '+1 (555) 987-6543',
                customer_address: '123 Main Street',
                issue_description: 'AC tune-up needed before summer',
                priority_level: 'standard',
                status: 'received',
                created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
                duration_seconds: 120,
            },
        ]

        setCalls(mockCalls)
        setStats({
            total: mockCalls.length,
            emergency: mockCalls.filter(c => c.priority_level === 'emergency').length,
            standard: mockCalls.filter(c => c.priority_level === 'standard').length,
            active: mockCalls.filter(c => c.status !== 'completed').length,
        })
    }, [])

    if (selectedCall) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <button
                        onClick={() => setSelectedCall(null)}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </button>

                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Call Details</h2>
                            <div className={`
                px-4 py-2 rounded-full text-sm font-semibold
                ${selectedCall.priority_level === 'emergency' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}
              `}>
                                {selectedCall.priority_level === 'emergency' ? '🚨 EMERGENCY' : '📋 STANDARD'}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h3 className="font-semibold text-gray-700 mb-2">Customer Information</h3>
                                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                    <p><span className="font-medium">Name:</span> {selectedCall.customer_name}</p>
                                    <p><span className="font-medium">Phone:</span> {selectedCall.customer_phone}</p>
                                    <p><span className="font-medium">Address:</span> {selectedCall.customer_address}</p>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-700 mb-2">Issue Description</h3>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p>{selectedCall.issue_description}</p>
                                </div>
                            </div>

                            {selectedCall.transcript && (
                                <div>
                                    <h3 className="font-semibold text-gray-700 mb-2">Call Transcript</h3>
                                    <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                            {selectedCall.transcript}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div>
                                <h3 className="font-semibold text-gray-700 mb-2">Status</h3>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="capitalize">{selectedCall.status}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Live Dashboard</h1>
                            <p className="mt-1 text-sm text-gray-500">
                                Real-time call monitoring and management
                            </p>
                        </div>
                        <Link
                            href="/"
                            className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
                        >
                            ← Back to Demo
                        </Link>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Total Calls</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                            </div>
                            <Phone className="w-8 h-8 text-blue-500" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Emergency</p>
                                <p className="text-3xl font-bold text-red-600">{stats.emergency}</p>
                            </div>
                            <AlertTriangle className="w-8 h-8 text-red-500" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Standard</p>
                                <p className="text-3xl font-bold text-blue-600">{stats.standard}</p>
                            </div>
                            <CheckCircle className="w-8 h-8 text-blue-500" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Active</p>
                                <p className="text-3xl font-bold text-yellow-600">{stats.active}</p>
                            </div>
                            <Clock className="w-8 h-8 text-yellow-500" />
                        </div>
                    </div>
                </div>

                {/* Call List */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Calls</h2>

                    {calls.length === 0 ? (
                        <div className="text-center py-12">
                            <Phone className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">No calls yet. Make a test call to see it appear here!</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {calls.map((call) => (
                                <CallCard
                                    key={call.id}
                                    call={call}
                                    onClick={() => setSelectedCall(call)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
