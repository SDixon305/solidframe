'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { CallStatus } from '@/components/LiveCallStatus';
import { inferRegionFromPhone } from '@/utils/areaCodeMapping';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

interface BusinessData {
    name: string;
    ownerName: string;
    ownerPhone: string;
}

export function useRealCallWorkflow(businessData: BusinessData) {
    const [callStatus, setCallStatus] = useState<CallStatus>('idle');
    const [transcript, setTranscript] = useState<string[]>([]);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [demoCallId, setDemoCallId] = useState<string | null>(null);
    const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

    // Initialize session when business is configured
    const initializeSession = useCallback(async () => {
        // Infer region from phone number area code
        const { region } = inferRegionFromPhone(businessData.ownerPhone);

        const { data, error } = await supabase
            .from('demo_sessions')
            .insert([{
                business_name: businessData.name,
                region: region,
                owner_name: businessData.ownerName,
                owner_phone: businessData.ownerPhone,
                is_active: true
            }])
            .select()
            .single();

        if (error) {
            console.error('Error creating session:', error);
            return null;
        }

        setSessionId(data.id);
        return data.id;
    }, [businessData]);

    // Start monitoring for calls
    const startCallMonitoring = useCallback(async () => {
        let currentSessionId = sessionId;

        if (!currentSessionId) {
            currentSessionId = await initializeSession();
            if (!currentSessionId) {
                console.error('Failed to initialize session');
                return;
            }
        }

        setCallStatus('connecting');
        setTranscript([]);

        // Call backend to create demo_call record
        try {
            const response = await fetch(`${BACKEND_URL}/api/demo/start-monitoring`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ session_id: currentSessionId }),
            });

            if (!response.ok) {
                throw new Error('Failed to start monitoring');
            }

            const result = await response.json();
            console.log('Started monitoring:', result);
            setDemoCallId(result.demo_call_id);

        } catch (error) {
            console.error('Error starting call monitoring:', error);
            setCallStatus('idle');
        }
    }, [sessionId, initializeSession]);

    // Subscribe to demo_calls updates
    useEffect(() => {
        if (callStatus === 'idle' || !sessionId) return;

        // Clean up existing channel
        if (channelRef.current) {
            supabase.removeChannel(channelRef.current);
        }

        console.log('Setting up Supabase real-time subscription for session:', sessionId);

        const channel = supabase
            .channel(`demo_calls_${sessionId}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'demo_calls',
                    filter: `session_id=eq.${sessionId}`
                },
                (payload) => {
                    console.log('Received real-time update:', payload);
                    const call = payload.new as any;

                    if (!call) return;

                    // Update demo call ID if this is a new record
                    if (payload.eventType === 'INSERT') {
                        setDemoCallId(call.id);
                    }

                    // Update status from the call record
                    if (call.status) {
                        const statusMap: Record<string, CallStatus> = {
                            'connecting': 'connecting',
                            'connected': 'connected',
                            'listening': 'listening',
                            'processing': 'processing',
                            'completed': 'completed'
                        };
                        const newStatus = statusMap[call.status] || call.status;
                        setCallStatus(newStatus as CallStatus);
                    }

                    // Update transcript
                    if (call.transcript) {
                        const lines = call.transcript
                            .split('\n')
                            .filter((line: string) => line.trim() !== '');
                        setTranscript(lines);
                    }
                }
            )
            .subscribe((status) => {
                console.log('Supabase subscription status:', status);
            });

        channelRef.current = channel;

        return () => {
            if (channelRef.current) {
                console.log('Cleaning up Supabase subscription');
                supabase.removeChannel(channelRef.current);
                channelRef.current = null;
            }
        };
    }, [callStatus, sessionId]);

    // Reset function for starting a new call
    const resetCall = useCallback(() => {
        setCallStatus('idle');
        setTranscript([]);
        setDemoCallId(null);
    }, []);

    return {
        callStatus,
        transcript,
        startCallMonitoring,
        resetCall,
        sessionId,
        demoCallId
    };
}
