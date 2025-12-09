// Fake data generators for After Hours AI Agent
import { CallRecord } from '@/components/tools/agent/CallHistory'
import { AgentConfig, AgentPerformanceData } from '@/components/tools/agent'

// Seeded random for consistent data
function seededRandom(seed: number): () => number {
    return () => {
        seed = (seed * 9301 + 49297) % 233280
        return seed / 233280
    }
}

const FIRST_NAMES = [
    'John', 'Sarah', 'Mike', 'Emily', 'David', 'Lisa', 'Chris', 'Amanda',
    'James', 'Jennifer', 'Robert', 'Michelle', 'William', 'Ashley', 'Thomas',
    'Jessica', 'Daniel', 'Nicole', 'Matthew', 'Stephanie', 'Andrew', 'Rachel',
]

const LAST_NAMES = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller',
    'Davis', 'Rodriguez', 'Martinez', 'Wilson', 'Anderson', 'Taylor', 'Thomas',
    'Moore', 'Jackson', 'Martin', 'Lee', 'Thompson', 'White', 'Harris', 'Clark',
]

const CALL_TRANSCRIPTS = {
    scheduling: [
        "AI: Thanks for calling! I'm the AI assistant for {business}. How can I help you today?\nCaller: Hi, I need to schedule a service appointment.\nAI: I'd be happy to help you schedule that. What type of service do you need?\nCaller: Just regular maintenance on my AC unit.\nAI: Great! I have availability tomorrow afternoon or Thursday morning. Which works better for you?\nCaller: Thursday morning would be perfect.\nAI: Excellent! I've scheduled you for Thursday at 9 AM. You'll receive a confirmation text shortly. Is there anything else I can help with?\nCaller: No, that's all. Thanks!\nAI: You're welcome! Have a great day!",
        "AI: Good evening, thank you for calling {business}. This is the after-hours AI assistant. How may I help you?\nCaller: I'd like to book an appointment for next week.\nAI: Of course! What type of service do you need?\nCaller: Furnace inspection before winter.\nAI: Smart thinking! I have openings on Monday, Wednesday, and Friday next week. What time works best?\nCaller: Monday afternoon if possible.\nAI: Perfect, I've got you down for Monday at 2 PM. We'll send a reminder the day before. Anything else?\nCaller: That's it, thank you!\nAI: Thank you for calling. Stay warm!",
    ],
    emergency: [
        "AI: Thank you for calling {business}. I'm the AI assistant. How can I help?\nCaller: My furnace just stopped working and it's freezing outside!\nAI: I understand this is urgent. Let me get some details. Is there any gas smell or unusual odors?\nCaller: No, nothing like that. It just won't turn on.\nAI: Good that there's no gas smell. Given the cold temperatures, I'm classifying this as an emergency. I'm dispatching our on-call technician now. They should arrive within 2 hours. Can you confirm your address?\nCaller: Yes, it's 123 Main Street.\nAI: Got it. The technician will call when they're on their way. In the meantime, try to keep warm and we'll have this resolved tonight.\nCaller: Thank you so much!\nAI: Of course. Help is on the way!",
        "AI: {business} after-hours line. How can I assist you?\nCaller: I smell gas near my water heater!\nAI: I need you to listen carefully. Please leave the house immediately and don't use any light switches or electronics. Once you're outside, call 911 and your gas company. Are you able to do that now?\nCaller: Yes, I'm going outside now.\nAI: Good. Stay on the line with me. I'm dispatching our emergency technician and they'll meet you at your location. What's your address?\nCaller: 456 Oak Avenue.\nAI: A technician is on the way. Stay outside and away from the building until emergency services arrive.\nCaller: Okay, thank you.",
    ],
    inquiry: [
        "AI: Hello! You've reached {business}. How can I help you this evening?\nCaller: Hi, I just wanted to know what your service hours are.\nAI: We're available Monday through Friday, 8 AM to 6 PM, and Saturdays 9 AM to 2 PM. For emergencies, we have 24/7 service like right now!\nCaller: Great, and what areas do you serve?\nAI: We service the entire metro area including surrounding suburbs within a 30-mile radius. Is there a specific location you're wondering about?\nCaller: No, that covers me. Thanks!\nAI: Happy to help! Feel free to call back if you have any other questions.",
    ],
    followup: [
        "AI: Thank you for calling {business}. How can I assist you?\nCaller: Hi, you guys did some work at my place last week and I had a quick question.\nAI: Of course! Can you tell me your name and address so I can pull up your service record?\nCaller: Sure, it's John Smith at 789 Elm Street.\nAI: Got it, I see we replaced your thermostat last Thursday. What's your question?\nCaller: The new thermostat seems to be showing the wrong temperature.\nAI: I understand. That might just need a quick recalibration. I can have a technician swing by tomorrow morning at no charge since it's related to the recent service. Would 10 AM work?\nCaller: That would be perfect.\nAI: Great, you're all set. See you tomorrow!",
    ],
}

const CALL_TYPES: CallRecord['type'][] = ['scheduling', 'emergency', 'inquiry', 'followup']
const CALL_OUTCOMES: Record<CallRecord['type'], CallRecord['outcome'][]> = {
    scheduling: ['booked', 'callback'],
    emergency: ['dispatched', 'callback'],
    inquiry: ['resolved', 'callback'],
    followup: ['resolved', 'booked', 'callback'],
}

export function generateCallRecords(
    tenantId: string,
    businessName: string,
    createdAt: Date,
    count: number = 50
): CallRecord[] {
    const seed = tenantId.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
    const random = seededRandom(seed)

    const calls: CallRecord[] = []
    const now = new Date()

    for (let i = 0; i < count; i++) {
        // Random timestamp within last 30 days (but after tenant creation)
        const daysAgo = Math.floor(random() * 30)
        const hoursAgo = Math.floor(random() * 24)
        const timestamp = new Date(now)
        timestamp.setDate(timestamp.getDate() - daysAgo)
        timestamp.setHours(hoursAgo)

        if (timestamp < createdAt) continue

        const firstName = FIRST_NAMES[Math.floor(random() * FIRST_NAMES.length)]
        const lastName = LAST_NAMES[Math.floor(random() * LAST_NAMES.length)]

        // Weight towards scheduling calls
        const typeWeights = [0.5, 0.15, 0.2, 0.15] // scheduling, emergency, inquiry, followup
        let typeRandom = random()
        let typeIndex = 0
        let cumulative = 0
        for (let j = 0; j < typeWeights.length; j++) {
            cumulative += typeWeights[j]
            if (typeRandom <= cumulative) {
                typeIndex = j
                break
            }
        }
        const type = CALL_TYPES[typeIndex]

        const possibleOutcomes = CALL_OUTCOMES[type]
        const outcome = possibleOutcomes[Math.floor(random() * possibleOutcomes.length)]

        const transcripts = CALL_TRANSCRIPTS[type]
        const transcript = transcripts[Math.floor(random() * transcripts.length)]
            .replace(/{business}/g, businessName)

        calls.push({
            id: `call-${tenantId}-${i}`,
            callerName: `${firstName} ${lastName}`,
            callerPhone: `(555) ${String(Math.floor(random() * 900) + 100)}-${String(Math.floor(random() * 10000)).padStart(4, '0')}`,
            timestamp,
            duration: Math.floor(random() * 300) + 60, // 1-6 minutes
            type,
            outcome,
            transcript,
            hasRecording: random() > 0.2, // 80% have recordings
        })
    }

    return calls.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}

export function generateAgentConfig(businessName: string): AgentConfig {
    return {
        voiceId: 'nova',
        voiceName: 'Nova',
        greeting: `Thanks for calling ${businessName}! I'm the AI assistant. I can help you schedule appointments, answer questions, or connect you with our team for emergencies. How can I help you today?`,
        businessHours: {
            start: '08:00',
            end: '18:00',
            timezone: 'America/New_York',
        },
        emergencyKeywords: ['gas leak', 'no heat', 'no AC', 'flooding', 'emergency', 'urgent'],
        escalationEnabled: true,
        escalationPhone: '(555) 555-0100',
    }
}

export function generateAgentPerformance(
    tenantId: string,
    createdAt: Date
): AgentPerformanceData {
    const seed = (tenantId + 'perf').split('').reduce((a, b) => a + b.charCodeAt(0), 0)
    const random = seededRandom(seed)

    const daysSinceCreation = Math.floor(
        (new Date().getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
    )

    const baseCalls = Math.floor(daysSinceCreation * 3.5)
    const totalCalls = baseCalls + Math.floor(random() * 20)

    return {
        totalCalls,
        callsTrend: Math.floor(random() * 20) - 5,
        avgDuration: 150 + Math.floor(random() * 60),
        emergencyRate: 10 + Math.floor(random() * 8),
        resolutionRate: 85 + Math.floor(random() * 10),
        callsByType: {
            scheduling: Math.floor(totalCalls * 0.5),
            emergency: Math.floor(totalCalls * 0.15),
            inquiry: Math.floor(totalCalls * 0.2),
            followup: Math.floor(totalCalls * 0.15),
        },
        callsByOutcome: {
            booked: Math.floor(totalCalls * 0.35),
            dispatched: Math.floor(totalCalls * 0.1),
            callback: Math.floor(totalCalls * 0.15),
            resolved: Math.floor(totalCalls * 0.3),
            voicemail: Math.floor(totalCalls * 0.1),
        },
        weeklyCallVolume: [
            Math.floor(random() * 15) + 5,
            Math.floor(random() * 20) + 10,
            Math.floor(random() * 25) + 12,
            Math.floor(random() * 22) + 10,
            Math.floor(random() * 25) + 12,
            Math.floor(random() * 20) + 8,
            Math.floor(random() * 12) + 3,
        ],
    }
}
