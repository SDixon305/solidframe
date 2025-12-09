// Mock call data for demo mode

export interface MockCall {
    id: string
    timestamp: string
    caller: string
    phone: string
    duration: string
    status: 'completed' | 'missed' | 'in-progress'
    isEmergency: boolean
    emergencyType?: string
    transcript: string[]
    aiSummary: string
}

export const mockCalls: MockCall[] = [
    {
        id: 'call-001',
        timestamp: '2 minutes ago',
        caller: 'Sarah Mitchell',
        phone: '(555) 234-5678',
        duration: '4:32',
        status: 'completed',
        isEmergency: true,
        emergencyType: 'No Heat',
        transcript: [
            'AI: Thank you for calling Trinity Cooling. How can I help you today?',
            'Caller: Hi, our heater stopped working and it\'s freezing in here. We have a baby.',
            'AI: I understand this is urgent. Let me get a technician dispatched right away. Can I confirm your address?',
            'Caller: Yes, it\'s 1234 Oak Street.',
            'AI: Perfect. I\'m dispatching our emergency technician now. They\'ll arrive within 45 minutes. Is there anything else I can help with?',
            'Caller: No, thank you so much!',
        ],
        aiSummary: 'Emergency no-heat call. Baby in home. Technician dispatched to 1234 Oak Street. ETA 45 min.',
    },
    {
        id: 'call-002',
        timestamp: '15 minutes ago',
        caller: 'Mike Johnson',
        phone: '(555) 345-6789',
        duration: '2:18',
        status: 'completed',
        isEmergency: false,
        transcript: [
            'AI: Thank you for calling Trinity Cooling. How can I help you today?',
            'Caller: I\'d like to schedule a routine AC maintenance.',
            'AI: Absolutely! I can help with that. What day works best for you?',
            'Caller: How about next Tuesday afternoon?',
            'AI: I have 2 PM available next Tuesday. Does that work?',
            'Caller: Perfect!',
        ],
        aiSummary: 'Routine AC maintenance scheduled for Tuesday 2 PM.',
    },
    {
        id: 'call-003',
        timestamp: '32 minutes ago',
        caller: 'Jennifer Lee',
        phone: '(555) 456-7890',
        duration: '3:45',
        status: 'completed',
        isEmergency: false,
        transcript: [
            'AI: Thank you for calling Trinity Cooling. How can I help you today?',
            'Caller: I got a quote from another company and wanted to compare.',
            'AI: Of course! I\'d be happy to help. What service are you looking for?',
            'Caller: A new AC unit installation.',
            'AI: We offer free in-home estimates for installations. Would you like me to schedule one?',
            'Caller: Yes please, that would be great.',
        ],
        aiSummary: 'Price comparison inquiry. Scheduled free in-home estimate for AC installation.',
    },
    {
        id: 'call-004',
        timestamp: '1 hour ago',
        caller: 'Robert Chen',
        phone: '(555) 567-8901',
        duration: '1:52',
        status: 'completed',
        isEmergency: true,
        emergencyType: 'Gas Smell',
        transcript: [
            'AI: Thank you for calling Trinity Cooling. How can I help you today?',
            'Caller: I smell gas near my furnace!',
            'AI: This is very important. Please leave your home immediately and call 911. I\'m also dispatching our emergency gas technician now.',
            'Caller: Okay, I\'m leaving now.',
            'AI: Good. Please stay outside and don\'t turn on any lights or appliances. Help is on the way.',
        ],
        aiSummary: 'URGENT: Gas leak reported. Caller advised to evacuate and call 911. Emergency dispatch activated.',
    },
    {
        id: 'call-005',
        timestamp: '2 hours ago',
        caller: 'Unknown Caller',
        phone: '(555) 678-9012',
        duration: '0:00',
        status: 'missed',
        isEmergency: false,
        transcript: [],
        aiSummary: 'Missed call - no voicemail left.',
    },
]

export const callStats = {
    today: {
        total: 12,
        answered: 11,
        missed: 1,
        emergencies: 3,
        bookings: 8,
    },
    week: {
        total: 67,
        answered: 64,
        missed: 3,
        emergencies: 9,
        bookings: 45,
    },
}
