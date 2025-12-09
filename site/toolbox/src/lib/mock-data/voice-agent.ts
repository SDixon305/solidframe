// Mock voice agent conversation data for demo mode

export interface ConversationMessage {
    id: string
    role: 'ai' | 'caller'
    text: string
    timestamp: number // ms delay from start
}

export interface MockScenario {
    id: string
    name: string
    description: string
    icon: string
    messages: ConversationMessage[]
    outcome: string
    tags: string[]
}

export const mockScenarios: MockScenario[] = [
    {
        id: 'emergency-no-heat',
        name: 'Emergency: No Heat',
        description: 'Urgent call about heating failure with family at home',
        icon: 'alert',
        tags: ['Emergency', 'Heating', 'Dispatch'],
        outcome: 'Emergency technician dispatched within 45 minutes',
        messages: [
            { id: '1', role: 'ai', text: 'Thank you for calling Trinity Cooling, this is your AI assistant. How can I help you today?', timestamp: 0 },
            { id: '2', role: 'caller', text: 'Hi, our heater just stopped working and it\'s really cold. We have kids at home.', timestamp: 3000 },
            { id: '3', role: 'ai', text: 'I understand this is an urgent situation, especially with children at home. Let me get you help right away. Can you confirm your address for me?', timestamp: 6000 },
            { id: '4', role: 'caller', text: 'Yes, it\'s 1234 Oak Street, Phoenix.', timestamp: 10000 },
            { id: '5', role: 'ai', text: 'Thank you. I\'m dispatching our emergency heating technician to 1234 Oak Street right now. They\'ll arrive within 45 minutes. In the meantime, do you have any space heaters you can use safely?', timestamp: 13000 },
            { id: '6', role: 'caller', text: 'Yes, we have one. Thank you so much!', timestamp: 18000 },
            { id: '7', role: 'ai', text: 'Great. You\'ll receive a text message with the technician\'s name and ETA shortly. Is there anything else I can help you with?', timestamp: 21000 },
            { id: '8', role: 'caller', text: 'No, that\'s all. Thanks!', timestamp: 25000 },
            { id: '9', role: 'ai', text: 'You\'re welcome. Stay warm, and our technician will be there soon. Goodbye!', timestamp: 28000 },
        ],
    },
    {
        id: 'service-scheduling',
        name: 'Service Scheduling',
        description: 'Customer wants to schedule routine AC maintenance',
        icon: 'calendar',
        tags: ['Maintenance', 'Scheduling'],
        outcome: 'Appointment booked for Tuesday 2 PM',
        messages: [
            { id: '1', role: 'ai', text: 'Thank you for calling Trinity Cooling, this is your AI assistant. How can I help you today?', timestamp: 0 },
            { id: '2', role: 'caller', text: 'Hi, I\'d like to schedule a tune-up for my AC before summer.', timestamp: 3000 },
            { id: '3', role: 'ai', text: 'Great idea to get ahead of the summer heat! I can help you schedule that. Do you have a preferred day of the week?', timestamp: 6000 },
            { id: '4', role: 'caller', text: 'Tuesday or Wednesday would work best, preferably afternoon.', timestamp: 10000 },
            { id: '5', role: 'ai', text: 'I have availability next Tuesday at 2 PM or Wednesday at 3 PM. Which works better for you?', timestamp: 13000 },
            { id: '6', role: 'caller', text: 'Tuesday at 2 sounds perfect.', timestamp: 17000 },
            { id: '7', role: 'ai', text: 'Excellent! I\'ve booked you for Tuesday at 2 PM for an AC tune-up. Can I confirm this is for the address we have on file at 456 Maple Drive?', timestamp: 20000 },
            { id: '8', role: 'caller', text: 'Yes, that\'s correct.', timestamp: 24000 },
            { id: '9', role: 'ai', text: 'Perfect. You\'ll receive a confirmation text shortly and a reminder the day before. Our technician will call 30 minutes before arrival. Anything else I can help with?', timestamp: 27000 },
            { id: '10', role: 'caller', text: 'No, that\'s everything. Thank you!', timestamp: 32000 },
            { id: '11', role: 'ai', text: 'You\'re welcome! We\'ll see you Tuesday. Have a great day!', timestamp: 35000 },
        ],
    },
    {
        id: 'price-inquiry',
        name: 'Price Inquiry',
        description: 'Potential customer asking about pricing and services',
        icon: 'dollar',
        tags: ['Sales', 'Quote'],
        outcome: 'In-home estimate scheduled',
        messages: [
            { id: '1', role: 'ai', text: 'Thank you for calling Trinity Cooling, this is your AI assistant. How can I help you today?', timestamp: 0 },
            { id: '2', role: 'caller', text: 'Hi, I\'m shopping around for a new AC unit. Can you give me a price?', timestamp: 3000 },
            { id: '3', role: 'ai', text: 'Absolutely, I\'d be happy to help! AC prices vary based on your home\'s size and your specific needs. We offer free in-home estimates to give you an accurate quote. Would you like me to schedule one?', timestamp: 6000 },
            { id: '4', role: 'caller', text: 'How long does the estimate take?', timestamp: 11000 },
            { id: '5', role: 'ai', text: 'Usually about 30-45 minutes. Our technician will assess your current system, measure your space, and discuss your options with you. There\'s no obligation to purchase.', timestamp: 14000 },
            { id: '6', role: 'caller', text: 'Okay, let\'s schedule it. What do you have available this week?', timestamp: 19000 },
            { id: '7', role: 'ai', text: 'I have Thursday at 10 AM or Friday at 2 PM available. Which works better for your schedule?', timestamp: 22000 },
            { id: '8', role: 'caller', text: 'Friday at 2 works.', timestamp: 26000 },
            { id: '9', role: 'ai', text: 'Perfect! I\'ll book you for Friday at 2 PM for a free AC installation estimate. Can I get your address and the best number to reach you?', timestamp: 29000 },
        ],
    },
]

export const voiceAgentStats = {
    callsHandled: 1247,
    avgResponseTime: '1.2s',
    satisfactionRate: '94%',
    emergenciesDetected: 89,
    appointmentsBooked: 456,
}
