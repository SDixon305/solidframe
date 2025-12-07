import { Trade } from './types'

export interface TranscriptMessage {
    role: 'agent' | 'user'
    text: string
    isEmergencyTrigger?: boolean
}

export interface CallScenario {
    id: string
    title: string
    classification: 'EMERGENCY' | 'ROUTINE' | 'SALES_INQUIRY'
    customerName: string
    issue: string
    action: string
    value: number
    transcript: TranscriptMessage[]
}

export const MOCK_SCENARIOS: Record<Trade, CallScenario[]> = {
    hvac: [
        {
            id: 'hvac-emergency-no-heat',
            title: 'Emergency - No Heat',
            classification: 'EMERGENCY',
            customerName: 'Margaret Wilson',
            issue: 'No heat, elderly homeowner, 28°F outside',
            action: 'SMS dispatched to John (on-call technician)',
            value: 450,
            transcript: [
                { role: 'agent', text: "Thanks for calling {businessName}. This is Sarah, your after-hours assistant. How can I help you tonight?" },
                { role: 'user', text: "Hi, my heat just went out and it's freezing in here. I'm 78 years old and I don't know what to do." },
                { role: 'agent', text: "I'm so sorry to hear that, and I want to make sure you're safe. I'm marking this as an emergency right now. Can you tell me—is there anyone else in the home with you?", isEmergencyTrigger: true },
                { role: 'user', text: "No, I live alone. The thermostat says it's already down to 55 degrees inside." },
                { role: 'agent', text: "I understand, and we're going to take care of you. I'm dispatching our on-call technician right now. He'll be there within 2 hours. Can I confirm your address?" },
                { role: 'user', text: "Yes, it's 4521 Maple Street." },
                { role: 'agent', text: "Got it—4521 Maple Street. John, our technician, will call you when he's on his way. In the meantime, please bundle up and stay warm. Is there anything else I can help with?" },
                { role: 'user', text: "No, thank you so much. I really appreciate you getting someone out tonight." },
                { role: 'agent', text: "Of course, Mrs. Wilson. Stay safe and warm. John will be there soon." },
            ]
        },
        {
            id: 'hvac-routine-maintenance',
            title: 'Routine - Seasonal Tune-Up',
            classification: 'ROUTINE',
            customerName: 'David Chen',
            issue: 'Requesting seasonal AC tune-up before summer',
            action: 'Appointment scheduled for next available slot',
            value: 189,
            transcript: [
                { role: 'agent', text: "Thanks for calling {businessName}. This is Sarah, your after-hours assistant. How can I help you?" },
                { role: 'user', text: "Hey, I wanted to schedule an AC tune-up before summer hits." },
                { role: 'agent', text: "Great idea to get ahead of the season! I can help you with that. Our next available appointment is Tuesday between 8 and 10 AM. Would that work for you?" },
                { role: 'user', text: "Tuesday works. What does a tune-up run?" },
                { role: 'agent', text: "Our seasonal tune-up is $189, and that includes a full system inspection, filter replacement, and refrigerant check. Should I lock in that Tuesday slot for you?" },
                { role: 'user', text: "Yeah, let's do it." },
                { role: 'agent', text: "Perfect, you're all set for Tuesday between 8 and 10 AM. You'll get a text confirmation shortly. Anything else I can help with?" },
                { role: 'user', text: "Nope, that's it. Thanks!" },
                { role: 'agent', text: "Thank you for choosing {businessName}. Have a great night!" },
            ]
        },
    ],
    plumbing: [
        {
            id: 'plumbing-emergency-burst',
            title: 'Emergency - Burst Pipe',
            classification: 'EMERGENCY',
            customerName: 'James Rodriguez',
            issue: 'Burst pipe in basement, water flooding',
            action: 'Emergency dispatch initiated, ETA 45 minutes',
            value: 650,
            transcript: [
                { role: 'agent', text: "Thanks for calling {businessName}. This is Sarah. How can I help you tonight?" },
                { role: 'user', text: "I've got water everywhere! A pipe burst in my basement and I can't stop it!" },
                { role: 'agent', text: "I understand this is stressful. First, do you know where your main water shut-off valve is? We need to stop the flow.", isEmergencyTrigger: true },
                { role: 'user', text: "I think it's by the water heater—hold on, let me try..." },
                { role: 'agent', text: "Take your time. Turn it clockwise to shut it off. I'm dispatching our emergency plumber right now while you do that." },
                { role: 'user', text: "Okay, I got it! The water stopped." },
                { role: 'agent', text: "Excellent work. Our technician Mike is on his way—he'll be there in about 45 minutes. Can you confirm your address for me?" },
                { role: 'user', text: "It's 892 Oak Lane." },
                { role: 'agent', text: "892 Oak Lane, got it. Mike will call when he's 10 minutes out. If you have towels, try to contain what you can. He'll take care of the rest." },
            ]
        },
        {
            id: 'plumbing-routine-drain',
            title: 'Routine - Slow Drain',
            classification: 'ROUTINE',
            customerName: 'Linda Park',
            issue: 'Kitchen sink draining slowly',
            action: 'Appointment scheduled for tomorrow afternoon',
            value: 175,
            transcript: [
                { role: 'agent', text: "Thanks for calling {businessName}. This is Sarah. How can I help you?" },
                { role: 'user', text: "Hi, my kitchen sink has been draining really slowly. It's not clogged, just slow." },
                { role: 'agent', text: "That's usually a buildup in the drain line. We can get that cleared out for you. Is this something that can wait until tomorrow, or is it urgent?" },
                { role: 'user', text: "Tomorrow is fine, it's just annoying." },
                { role: 'agent', text: "Perfect. I have an opening tomorrow between 2 and 4 PM. Would that work for you?" },
                { role: 'user', text: "That works great." },
                { role: 'agent', text: "You're all set. A drain clearing is $175, and if there's anything more serious, the tech will give you options before proceeding. You'll get a text reminder tomorrow morning." },
            ]
        },
    ],
    electrical: [
        {
            id: 'electrical-emergency-outage',
            title: 'Emergency - Partial Outage',
            classification: 'EMERGENCY',
            customerName: 'Robert Kim',
            issue: 'Half of house lost power, burning smell reported',
            action: 'Emergency electrician dispatched, homeowner advised to stay away from panel',
            value: 525,
            transcript: [
                { role: 'agent', text: "Thanks for calling {businessName}. This is Sarah. How can I help you tonight?" },
                { role: 'user', text: "Half my house just lost power and I smell something burning near the electrical panel!" },
                { role: 'agent', text: "I need you to stay away from that panel immediately. Do not touch it. Is everyone in the house safe right now?", isEmergencyTrigger: true },
                { role: 'user', text: "Yes, we're all in the living room. The smell isn't as strong now." },
                { role: 'agent', text: "Good. Keep everyone away from the panel. I'm dispatching our emergency electrician right now—this is exactly the kind of situation we don't want you handling alone. What's your address?" },
                { role: 'user', text: "1247 Pine Street." },
                { role: 'agent', text: "1247 Pine Street. Our electrician Tom is on call and will be there within an hour. If the burning smell gets stronger or you see smoke, call 911 immediately. Otherwise, Tom will assess and fix it tonight." },
                { role: 'user', text: "Thank you, I was really worried." },
                { role: 'agent', text: "You did the right thing by calling. Tom will take care of it. He'll call when he's on his way." },
            ]
        },
    ],
    roofing: [
        {
            id: 'roofing-storm-damage',
            title: 'Storm Damage Assessment',
            classification: 'SALES_INQUIRY',
            customerName: 'Patricia Brown',
            issue: 'Noticed missing shingles after last night\'s storm',
            action: 'Free inspection scheduled for tomorrow morning',
            value: 8500,
            transcript: [
                { role: 'agent', text: "Thanks for calling {businessName}. This is Sarah. How can I help you?" },
                { role: 'user', text: "We had that bad storm last night and I noticed some shingles in my yard. I think my roof might be damaged." },
                { role: 'agent', text: "I'm sorry to hear that. Storm damage is something we handle a lot. Are you seeing any leaks inside the house right now?" },
                { role: 'user', text: "No leaks yet, but I'm worried about the next rain." },
                { role: 'agent', text: "Smart to get ahead of it. We offer a free storm damage inspection—we'll document everything for your insurance claim if needed. I can have someone out tomorrow morning between 9 and 11. Would that work?" },
                { role: 'user', text: "That would be great. Do you work with insurance companies?" },
                { role: 'agent', text: "Absolutely. We handle insurance claims regularly and can walk you through the entire process. We'll take photos, write up the damage report, and help you file. You're set for tomorrow between 9 and 11 AM." },
                { role: 'user', text: "Perfect, thank you so much." },
                { role: 'agent', text: "You're welcome. You'll get a text confirmation shortly. Have a good night!" },
            ]
        },
    ],
}

export function getRandomScenario(trade: Trade): CallScenario {
    const scenarios = MOCK_SCENARIOS[trade]
    return scenarios[Math.floor(Math.random() * scenarios.length)]
}

export function getScenarioById(trade: Trade, id: string): CallScenario | undefined {
    return MOCK_SCENARIOS[trade].find(s => s.id === id)
}

export function personalizeTranscript(transcript: TranscriptMessage[], businessName: string): TranscriptMessage[] {
    return transcript.map(msg => ({
        ...msg,
        text: msg.text.replace(/{businessName}/g, businessName)
    }))
}
