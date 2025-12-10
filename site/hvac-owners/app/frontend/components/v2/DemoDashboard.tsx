'use client';

import { useState } from 'react';

export default function DemoDashboard({ lastCall }: { lastCall: any }) {
    // Dummy data for static calls
    const staticCalls = [
        {
            id: 'static-1',
            type: 'Booking',
            status: 'Scheduled',
            transcript: 'Customer needed routine maintenance. Booked for Tuesday morning.',
            time: '2 hours ago',
            tech: 'Trevor'
        },
        {
            id: 'static-2',
            type: 'Emergency',
            status: 'Resolved',
            transcript: 'System failure reported. Resolved over phone with troubleshooting steps.',
            time: 'Yesterday',
            tech: 'Trevor'
        }
    ];

    return (
        <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in-up">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-2">Call Dashboard</h2>
                <p className="text-gray-400">Real-time insights from your AI Agent</p>
            </div>

            {/* Latest Call (The one just finished) */}
            {lastCall && (
                <div className="bg-gradient-to-br from-blue-900/40 to-black border border-blue-500/30 rounded-2xl p-6 shadow-lg shadow-blue-900/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4">
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-bold rounded-full border border-blue-500/30">
                            JUST NOW
                        </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <span className="text-2xl">📞</span> New Call Received
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-black/30 p-4 rounded-lg">
                            <span className="text-gray-500 text-xs uppercase tracking-wider">Status</span>
                            <p className="text-green-400 font-bold text-lg">{lastCall.status || 'Completed'}</p>
                        </div>
                        <div className="bg-black/30 p-4 rounded-lg">
                            <span className="text-gray-500 text-xs uppercase tracking-wider">Technician</span>
                            <p className="text-white font-bold text-lg">Trevor</p>
                        </div>
                        <div className="bg-black/30 p-4 rounded-lg">
                            <span className="text-gray-500 text-xs uppercase tracking-wider">Action</span>
                            <p className="text-white font-bold text-lg">Dispatched</p>
                        </div>
                    </div>
                    <div className="bg-black/40 p-4 rounded-lg border border-white/5">
                        <span className="text-gray-500 text-xs uppercase tracking-wider block mb-2">Transcript Summary</span>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            {lastCall.transcript || 'No transcript available.'}
                        </p>
                    </div>
                </div>
            )}

            {/* Static History */}
            <div className="space-y-4">
                <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider ml-2">Recent History</h3>
                {staticCalls.map((call) => (
                    <div key={call.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between hover:bg-white/10 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${call.type === 'Emergency' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                                {call.type === 'Emergency' ? '🚨' : '📅'}
                            </div>
                            <div>
                                <h4 className="text-white font-bold">{call.type} Call</h4>
                                <p className="text-gray-500 text-xs">{call.time} • Tech: {call.tech}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="block text-white font-medium">{call.status}</span>
                            <button className="text-blue-400 text-xs hover:text-blue-300">View Details</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
