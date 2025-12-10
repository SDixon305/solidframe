'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

const BUSINESS_ID = '00000000-0000-0000-0000-000000000001';

export default function LiveCallMonitor({ onCallComplete }: { onCallComplete: (call: any) => void }) {
    const [status, setStatus] = useState<'idle' | 'listening' | 'answering' | 'connected'>('idle');
    const [transcript, setTranscript] = useState('');
    const [callId, setCallId] = useState<string | null>(null);

    const startMonitoring = () => {
        setStatus('listening');
        // In a real app, we might trigger a backend "ready" state here
        // For now, we just start polling/listening to Supabase
    };

    useEffect(() => {
        if (status === 'idle') return;

        // Polling-based approach for now (more reliable than realtime subscriptions)
        const pollInterval = setInterval(async () => {
            try {
                // Fetch the latest call
                const response = await fetch(`http://localhost:8000/api/businesses/${BUSINESS_ID}/calls/latest`);

                if (!response.ok) {
                    // No calls yet
                    return;
                }

                const latestCall = await response.json();
                console.log('📡 Polling latest call:', latestCall);

                // If we don't have a callId yet, or this is a new call
                if (!callId) {
                    console.log('📞 New call detected:', latestCall.id);
                    setCallId(latestCall.id);
                    setStatus('connected');
                    setTranscript(latestCall.transcript || '');
                } else if (latestCall.id === callId) {
                    // Update existing call
                    console.log('📝 Call updated:', latestCall.id, 'Status:', latestCall.status);
                    setTranscript(latestCall.transcript || '');

                    if (latestCall.status === 'completed') {
                        console.log('✅ Call completed');
                        clearInterval(pollInterval);
                        onCallComplete(latestCall);
                    }
                }
            } catch (error) {
                console.error('Error polling for calls:', error);
            }
        }, 2000); // Poll every 2 seconds

        return () => {
            clearInterval(pollInterval);
        };
    }, [status, callId, onCallComplete]);

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto min-h-[400px]">
            {status === 'idle' && (
                <div className="text-center space-y-6">
                    <div className="text-6xl font-bold text-white mb-4">
                        1-844-671-3994
                    </div>
                    <p className="text-gray-400 text-lg mb-8">
                        Call the number above, then click the button below.
                    </p>
                    <button
                        onClick={startMonitoring}
                        className="px-8 py-4 bg-green-500 hover:bg-green-400 text-white text-xl font-bold rounded-full shadow-lg shadow-green-500/30 transition-all transform hover:scale-105 animate-pulse"
                    >
                        I'm Calling Now
                    </button>
                </div>
            )}

            {status === 'listening' && (
                <div className="flex flex-col items-center animate-fade-in">
                    <div className="w-32 h-32 rounded-full border-4 border-blue-500/30 flex items-center justify-center mb-6 relative">
                        <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping"></div>
                        <span className="text-4xl">👂</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white">Listening...</h3>
                    <p className="text-gray-400 mt-2">Waiting for call to connect...</p>
                </div>
            )}

            {(status === 'answering' || status === 'connected') && (
                <div className="w-full bg-black/60 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-2xl">
                    <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                            <span className="text-red-400 font-mono font-bold">LIVE CALL</span>
                        </div>
                        <span className="text-gray-400 text-sm">Diamond Cooling Agent</span>
                    </div>

                    <div className="h-64 overflow-y-auto space-y-4 p-4 bg-black/20 rounded-lg font-mono text-sm">
                        {transcript ? (
                            <p className="text-green-400 whitespace-pre-wrap">{transcript}</p>
                        ) : (
                            <p className="text-gray-600 italic">Waiting for speech...</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
