// Acme HVAC Services - Comprehensive seed data generators
// Generates realistic demo data for all 8 tools using seeded randomization

import { PHOENIX_ADDRESSES, HVAC_EQUIPMENT_TYPES, SERVICE_TYPES } from './acme-addresses'

// Seeded random number generator for consistent data
function seededRandom(seed: number): () => number {
    return () => {
        seed = (seed * 9301 + 49297) % 233280
        return seed / 233280
    }
}

// Helper to create seed from string
function createSeed(str: string): number {
    return str.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
}

// Name pools for customers
const FIRST_NAMES = [
    'John', 'Sarah', 'Mike', 'Emily', 'David', 'Lisa', 'Chris', 'Amanda',
    'James', 'Jennifer', 'Robert', 'Michelle', 'William', 'Ashley', 'Thomas',
    'Jessica', 'Daniel', 'Nicole', 'Matthew', 'Stephanie', 'Andrew', 'Rachel',
    'Michael', 'Laura', 'Brian', 'Angela', 'Kevin', 'Melissa', 'Steven', 'Amy',
]

const LAST_NAMES = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller',
    'Davis', 'Rodriguez', 'Martinez', 'Wilson', 'Anderson', 'Taylor', 'Thomas',
    'Moore', 'Jackson', 'Martin', 'Lee', 'Thompson', 'White', 'Harris', 'Clark',
    'Lewis', 'Walker', 'Hall', 'Allen', 'Young', 'King', 'Wright', 'Lopez',
]

// ===== INTERFACES =====

export interface AcmeCustomer {
    id: string
    firstName: string
    lastName: string
    phone: string
    email: string
    address: string
    city: string
    zip: string
    equipment: string[]
    serviceHistory: {
        date: Date
        type: string
        technician: string
        notes: string
    }[]
    createdAt: Date
    hasContract: boolean
}

export interface AcmeCallRecord {
    id: string
    callerName: string
    callerPhone: string
    timestamp: Date
    duration: number
    type: 'scheduling' | 'emergency' | 'inquiry' | 'followup'
    outcome: 'booked' | 'dispatched' | 'callback' | 'resolved' | 'voicemail'
    transcript: string
    hasRecording: boolean
}

export interface AcmeQuote {
    id: string
    customerName: string
    customerPhone: string
    serviceType: string
    quoteAmount: number
    createdAt: Date
    status: 'new' | 'first-followup' | 'second-followup' | 'won' | 'lost'
    lastContactedAt?: Date
    nextFollowUp?: Date
}

export interface AcmeCampaign {
    id: string
    name: string
    recipientCount: number
    sentDate: Date
    openRate: number
    clickRate: number
    subject: string
}

export interface AcmeMaintenanceContract {
    id: string
    customerName: string
    customerPhone: string
    contractType: string
    startDate: Date
    expiryDate: Date
    planValue: number
    status: 'active' | 'expiring-soon' | 'expired' | 'renewed'
    lastReminderSent?: Date
    renewalDate?: Date
}

export interface AcmeReview {
    id: string
    customerName: string
    rating: number
    text: string | null
    date: Date
    serviceType: string
}

export interface AcmeAppointment {
    id: string
    customerName: string
    serviceType: string
    date: Date
    time: string
    address: string
    technician: string
    reminderSent: boolean
    confirmed: boolean
}

export interface AcmeTechTrainingProgress {
    technicianName: string
    modulesCompleted: {
        name: string
        completedAt: Date
        score: number
    }[]
    avgScore: number
    totalModules: number
}

// ===== TECHNICIAN TEAM =====

const ACME_TECHNICIANS = [
    { name: 'Trevor Martinez', phone: '(602) 555-0101', specialty: 'Emergency' },
    { name: 'Mike Johnson', phone: '(602) 555-0102', specialty: 'Residential' },
    { name: 'Sarah Chen', phone: '(602) 555-0103', specialty: 'Weekend' },
    { name: 'Dave Wilson', phone: '(602) 555-0104', specialty: 'Commercial' },
]

// ===== CALL TRANSCRIPTS =====

const CALL_TRANSCRIPTS = {
    scheduling: [
        "AI: Thanks for calling Acme HVAC Services! I'm the AI assistant. How can I help you today?\nCaller: Hi, I need to schedule an AC maintenance appointment.\nAI: I'd be happy to help you schedule that. What day works best for you?\nCaller: How about next Tuesday afternoon?\nAI: I have 2 PM available next Tuesday. Does that work?\nCaller: Perfect! Thank you.\nAI: Great! I've scheduled you for Tuesday at 2 PM. You'll receive a confirmation text shortly.",
        "AI: Good afternoon, thanks for calling Acme HVAC. How can I assist you?\nCaller: I'd like to book a furnace inspection before winter.\nAI: Smart planning! I have openings on Monday, Wednesday, and Friday next week. What time works best?\nCaller: Monday morning if possible.\nAI: Perfect, I've got you down for Monday at 9 AM. We'll send a reminder the day before.\nCaller: Sounds good, thanks!",
    ],
    emergency: [
        "AI: Thank you for calling Acme HVAC Services. How can I help?\nCaller: My AC just stopped working and it's 110 degrees outside!\nAI: I understand this is urgent, especially in this heat. Is there any unusual smell or noise?\nCaller: No, it just won't turn on at all.\nAI: I'm dispatching our emergency technician Trevor now. He'll arrive within 90 minutes. Can you confirm your address?\nCaller: Yes, it's 1234 E Camelback Road.\nAI: Got it. Trevor will call when he's 15 minutes away. Stay cool and we'll get this fixed today!\nCaller: Thank you so much!",
        "AI: Acme HVAC emergency line. How can I assist you?\nCaller: I smell gas near my furnace!\nAI: This is very important. Please leave your home immediately and don't use any light switches. Once you're outside, call 911 and your gas company. Are you able to do that now?\nCaller: Yes, I'm going outside now.\nAI: Good. I'm also dispatching our emergency gas-certified technician. Stay outside and away from the building. What's your address?\nCaller: 5678 N Scottsdale Road.\nAI: Help is on the way. Please stay on the line with 911.",
    ],
    inquiry: [
        "AI: Hello! You've reached Acme HVAC Services. How can I help you?\nCaller: Hi, what are your service hours?\nAI: We're available Monday through Friday, 7 AM to 6 PM, and Saturdays 8 AM to 2 PM. For emergencies, we have 24/7 service!\nCaller: Great, and what areas do you serve?\nAI: We service the entire Phoenix metro area, including Scottsdale, Mesa, Tempe, Gilbert, and Chandler.\nCaller: Perfect, that covers me. Thanks!",
        "AI: Thanks for calling Acme HVAC. How can I assist you today?\nCaller: I'm comparing quotes for a new AC installation. What do you charge?\nAI: Our pricing depends on the unit size and complexity. I'd be happy to schedule a free in-home estimate. When works for you?\nCaller: Maybe Thursday afternoon?\nAI: Thursday at 3 PM? I'll have one of our installation specialists come out.\nCaller: That works, thank you!",
    ],
    followup: [
        "AI: Thank you for calling Acme HVAC. How can I help?\nCaller: You guys serviced my AC last week and I have a question.\nAI: Of course! Can you tell me your name and address?\nCaller: It's Sarah Johnson at 3456 W Glendale Ave.\nAI: Got it, I see we replaced your capacitor last Thursday. What's your question?\nCaller: The thermostat seems off by a few degrees.\nAI: That might just need a quick recalibration. I can have Trevor swing by tomorrow at no charge since it's related to the service. Would 10 AM work?\nCaller: Perfect, thank you!",
    ],
}

// ===== GENERATOR FUNCTIONS =====

export function generateAcmeCustomers(tenantId: string = 'acme-hvac', count: number = 100): AcmeCustomer[] {
    const seed = createSeed(tenantId + 'customers')
    const random = seededRandom(seed)
    const customers: AcmeCustomer[] = []
    const now = new Date()

    // Ensure we have enough addresses
    if (PHOENIX_ADDRESSES.length < count) {
        console.warn(`Only ${PHOENIX_ADDRESSES.length} addresses available for ${count} customers`)
    }

    for (let i = 0; i < count; i++) {
        const firstName = FIRST_NAMES[Math.floor(random() * FIRST_NAMES.length)]
        const lastName = LAST_NAMES[Math.floor(random() * LAST_NAMES.length)]
        const address = PHOENIX_ADDRESSES[i % PHOENIX_ADDRESSES.length]

        // Phone number with Phoenix area codes
        const areaCodes = ['602', '480', '623']
        const areaCode = areaCodes[Math.floor(random() * areaCodes.length)]
        const phone = `(${areaCode}) 555-${String(Math.floor(random() * 9000) + 1000)}`

        // Email
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`

        // Customer age (days since first contact)
        const customerAge = Math.floor(random() * 730) // 0-2 years
        const createdAt = new Date(now)
        createdAt.setDate(createdAt.getDate() - customerAge)

        // Equipment (80% have AC, 60% have furnace)
        const equipment: string[] = []
        if (random() < 0.8 || i < count * 0.5) { // Ensure at least 50% have AC
            equipment.push(HVAC_EQUIPMENT_TYPES[Math.floor(random() * 15)]) // AC units
        }
        if (random() < 0.6) {
            equipment.push(HVAC_EQUIPMENT_TYPES[15 + Math.floor(random() * 8)]) // Furnaces
        }
        if (equipment.length === 0) {
            equipment.push(HVAC_EQUIPMENT_TYPES[Math.floor(random() * 15)])
        }

        // Service history based on customer age
        const serviceHistory: AcmeCustomer['serviceHistory'] = []
        let numServices = 0
        if (customerAge < 30) numServices = Math.floor(random() * 2) // 0-1 services
        else if (customerAge < 180) numServices = Math.floor(random() * 3) + 1 // 1-3 services
        else numServices = Math.floor(random() * 4) + 2 // 2-5 services

        for (let j = 0; j < numServices; j++) {
            const serviceDate = new Date(createdAt)
            const daysSinceCreated = Math.floor(random() * customerAge)
            serviceDate.setDate(serviceDate.getDate() + daysSinceCreated)

            const serviceType = SERVICE_TYPES[Math.floor(random() * SERVICE_TYPES.length)]
            const technician = ACME_TECHNICIANS[Math.floor(random() * ACME_TECHNICIANS.length)].name

            serviceHistory.push({
                date: serviceDate,
                type: serviceType,
                technician,
                notes: `Completed ${serviceType.toLowerCase()} service`,
            })
        }

        // 20% of customers have maintenance contracts
        const hasContract = random() < 0.45

        customers.push({
            id: `cust-acme-${i + 1}`,
            firstName,
            lastName,
            phone,
            email,
            address: address.street,
            city: address.city,
            zip: address.zip,
            equipment,
            serviceHistory: serviceHistory.sort((a, b) => a.date.getTime() - b.date.getTime()),
            createdAt,
            hasContract,
        })
    }

    return customers.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

export function generateAcmeCallRecords(
    tenantId: string = 'acme-hvac',
    tenantCreatedAt: Date,
    count: number = 50
): AcmeCallRecord[] {
    const seed = createSeed(tenantId + 'calls')
    const random = seededRandom(seed)
    const calls: AcmeCallRecord[] = []
    const now = new Date()
    const daysSinceTenantCreated = Math.floor(
        (now.getTime() - tenantCreatedAt.getTime()) / (1000 * 60 * 60 * 24)
    )

    // Distribution: more calls in recent weeks
    const callWeights = []
    const weeksTotal = Math.ceil(daysSinceTenantCreated / 7)

    // First month (weeks 1-4): 10% of calls
    // Second month (weeks 5-8): 20% of calls
    // Recent period (weeks 9+): 70% of calls
    for (let i = 0; i < count; i++) {
        const rand = random()
        let weekOffset
        if (rand < 0.1 && weeksTotal > 4) {
            // 10% in first month
            weekOffset = Math.floor(random() * Math.min(4, weeksTotal)) + (weeksTotal - Math.min(weeksTotal, 13))
        } else if (rand < 0.3 && weeksTotal > 8) {
            // 20% in second month
            weekOffset = Math.floor(random() * 4) + (weeksTotal - Math.min(weeksTotal, 9))
        } else {
            // 70% in recent 5 weeks
            weekOffset = Math.floor(random() * Math.min(5, weeksTotal))
        }

        // Day of week distribution
        const dayOfWeekRand = random()
        let dayOfWeek
        if (dayOfWeekRand < 0.20) dayOfWeek = 1 // Monday: 20%
        else if (dayOfWeekRand < 0.55) dayOfWeek = Math.floor(random() * 3) + 2 // Tue-Thu: 35%
        else if (dayOfWeekRand < 0.65) dayOfWeek = 5 // Friday: 10%
        else if (dayOfWeekRand < 0.73) dayOfWeek = 6 // Saturday: 8%
        else dayOfWeek = 0 // Sunday: 2%

        // Hour distribution
        const hourRand = random()
        let hour
        if (hourRand < 0.15) hour = Math.floor(random() * 2) + 7 // 7-9am: 15%
        else if (hourRand < 0.45) hour = Math.floor(random() * 3) + 9 // 9am-12pm: 30%
        else if (hourRand < 0.55) hour = Math.floor(random() * 2) + 12 // 12-2pm: 10%
        else if (hourRand < 0.80) hour = Math.floor(random() * 4) + 14 // 2-6pm: 25%
        else if (hourRand < 0.95) hour = Math.floor(random() * 4) + 18 // 6-10pm: 15%
        else hour = Math.floor(random() * 9) + 22 // 10pm-7am: 5%
        if (hour >= 24) hour -= 24

        const timestamp = new Date(now)
        timestamp.setDate(timestamp.getDate() - (weekOffset * 7 + (7 - dayOfWeek)))
        timestamp.setHours(hour, Math.floor(random() * 60), 0, 0)

        if (timestamp < tenantCreatedAt || timestamp > now) continue

        const firstName = FIRST_NAMES[Math.floor(random() * FIRST_NAMES.length)]
        const lastName = LAST_NAMES[Math.floor(random() * LAST_NAMES.length)]

        const areaCodes = ['602', '480', '623']
        const areaCode = areaCodes[Math.floor(random() * areaCodes.length)]
        const phone = `(${areaCode}) 555-${String(Math.floor(random() * 9000) + 1000)}`

        // Type weights: 50% scheduling, 15% emergency, 20% inquiry, 15% followup
        const typeRand = random()
        let type: AcmeCallRecord['type']
        if (typeRand < 0.50) type = 'scheduling'
        else if (typeRand < 0.65) type = 'emergency' // 15% emergency (30% of 50 total calls = 15 calls)
        else if (typeRand < 0.85) type = 'inquiry'
        else type = 'followup'

        // Outcome based on type
        let outcome: AcmeCallRecord['outcome']
        if (type === 'scheduling') outcome = random() < 0.85 ? 'booked' : 'callback'
        else if (type === 'emergency') outcome = random() < 0.90 ? 'dispatched' : 'callback'
        else if (type === 'inquiry') outcome = random() < 0.75 ? 'resolved' : 'callback'
        else outcome = random() < 0.70 ? 'resolved' : random() < 0.85 ? 'booked' : 'callback'

        // Get transcript
        const transcripts = CALL_TRANSCRIPTS[type]
        const transcript = transcripts[Math.floor(random() * transcripts.length)]
            .replace(/{business}/g, 'Acme HVAC Services')
            .replace(/{name}/g, firstName)

        calls.push({
            id: `call-acme-${i + 1}`,
            callerName: `${firstName} ${lastName}`,
            callerPhone: phone,
            timestamp,
            duration: Math.floor(random() * 240) + 60, // 1-5 minutes
            type,
            outcome,
            transcript,
            hasRecording: random() > 0.15, // 85% have recordings
        })
    }

    return calls.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}

export function generateAcmeQuotes(
    tenantId: string = 'acme-hvac',
    tenantCreatedAt: Date,
    count: number = 25
): AcmeQuote[] {
    const seed = createSeed(tenantId + 'quotes')
    const random = seededRandom(seed)
    const quotes: AcmeQuote[] = []
    const now = new Date()

    const quoteServiceTypes = [
        'AC Installation',
        'Furnace Replacement',
        'Heat Pump Installation',
        'Duct Replacement',
        'Full HVAC System',
        'Mini-Split Installation',
        'Package Unit Installation',
        'Duct Cleaning',
        'Maintenance Contract',
    ]

    for (let i = 0; i < count; i++) {
        const firstName = FIRST_NAMES[Math.floor(random() * FIRST_NAMES.length)]
        const lastName = LAST_NAMES[Math.floor(random() * LAST_NAMES.length)]

        const areaCodes = ['602', '480', '623']
        const areaCode = areaCodes[Math.floor(random() * areaCodes.length)]
        const phone = `(${areaCode}) 555-${String(Math.floor(random() * 9000) + 1000)}`

        const serviceType = quoteServiceTypes[Math.floor(random() * quoteServiceTypes.length)]

        // Quote amount: $800-$4500
        const quoteAmount = Math.floor(random() * 3700) + 800

        // Quote age: 1-45 days old
        const daysOld = Math.floor(random() * 45) + 1
        const createdAt = new Date(now)
        createdAt.setDate(createdAt.getDate() - daysOld)

        // Status distribution: 60% new, 25% first-followup, 10% second-followup, 5% won/lost
        const statusRand = random()
        let status: AcmeQuote['status']
        if (statusRand < 0.60) status = 'new'
        else if (statusRand < 0.85) status = 'first-followup'
        else if (statusRand < 0.95) status = 'second-followup'
        else status = random() < 0.5 ? 'won' : 'lost'

        // Last contacted and next follow-up dates
        let lastContactedAt: Date | undefined
        let nextFollowUp: Date | undefined

        if (status !== 'new') {
            lastContactedAt = new Date(createdAt)
            lastContactedAt.setDate(lastContactedAt.getDate() + Math.floor(random() * 5) + 1)
        }

        if (status === 'new' || status === 'first-followup') {
            nextFollowUp = new Date(now)
            nextFollowUp.setDate(nextFollowUp.getDate() + Math.floor(random() * 5) + 1)
        }

        quotes.push({
            id: `quote-acme-${i + 1}`,
            customerName: `${firstName} ${lastName}`,
            customerPhone: phone,
            serviceType,
            quoteAmount,
            createdAt,
            status,
            lastContactedAt,
            nextFollowUp,
        })
    }

    return quotes.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

export function generateAcmeCampaigns(tenantCreatedAt: Date): AcmeCampaign[] {
    const campaigns: AcmeCampaign[] = [
        {
            id: 'campaign-acme-1',
            name: 'Spring AC Tune-up Special',
            recipientCount: 287,
            sentDate: new Date(new Date(tenantCreatedAt).getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days after tenant created
            openRate: 23,
            clickRate: 8,
            subject: '🌡️ Beat the Heat! Spring AC Tune-up Special - $89',
        },
        {
            id: 'campaign-acme-2',
            name: 'Summer Heat Check',
            recipientCount: 312,
            sentDate: new Date(new Date(tenantCreatedAt).getTime() + 60 * 24 * 60 * 60 * 1000), // 60 days after
            openRate: 18,
            clickRate: 6,
            subject: '☀️ Stay Cool This Summer - Free AC System Check',
        },
        {
            id: 'campaign-acme-3',
            name: 'Fall Heating Prep',
            recipientCount: 245,
            sentDate: new Date(new Date(tenantCreatedAt).getTime() + 75 * 24 * 60 * 60 * 1000), // 75 days after
            openRate: 27,
            clickRate: 12,
            subject: '🍂 Winter is Coming - Furnace Inspection Special',
        },
    ]

    return campaigns
}

export function generateAcmeContracts(
    tenantId: string = 'acme-hvac',
    tenantCreatedAt: Date,
    count: number = 45
): AcmeMaintenanceContract[] {
    const seed = createSeed(tenantId + 'contracts')
    const random = seededRandom(seed)
    const contracts: AcmeMaintenanceContract[] = []
    const now = new Date()

    const contractTypes = [
        'Residential AC Maintenance',
        'Residential Full HVAC',
        'Commercial Quarterly',
        'Premium Year-Round',
    ]

    const contractValues = [299, 399, 599, 899]

    for (let i = 0; i < count; i++) {
        const firstName = FIRST_NAMES[Math.floor(random() * FIRST_NAMES.length)]
        const lastName = LAST_NAMES[Math.floor(random() * LAST_NAMES.length)]

        const areaCodes = ['602', '480', '623']
        const areaCode = areaCodes[Math.floor(random() * areaCodes.length)]
        const phone = `(${areaCode}) 555-${String(Math.floor(random() * 9000) + 1000)}`

        const contractType = contractTypes[Math.floor(random() * contractTypes.length)]
        const planValue = contractValues[Math.floor(random() * contractValues.length)]

        // Start date: 1-365 days ago
        const startDate = new Date(now)
        startDate.setDate(startDate.getDate() - Math.floor(random() * 365))

        // Expiry date: 1 year from start
        const expiryDate = new Date(startDate)
        expiryDate.setFullYear(expiryDate.getFullYear() + 1)

        // Status based on expiry
        const daysUntilExpiry = Math.floor((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        let status: AcmeMaintenanceContract['status']
        if (daysUntilExpiry < 0) status = random() < 0.3 ? 'renewed' : 'expired'
        else if (daysUntilExpiry <= 30) status = 'expiring-soon'
        else status = 'active'

        // Reminder sent date for expiring-soon contracts
        let lastReminderSent: Date | undefined
        if (status === 'expiring-soon') {
            lastReminderSent = new Date(now)
            lastReminderSent.setDate(lastReminderSent.getDate() - Math.floor(random() * 7))
        }

        // Renewal date if renewed
        let renewalDate: Date | undefined
        if (status === 'renewed') {
            renewalDate = new Date(expiryDate)
            renewalDate.setDate(renewalDate.getDate() + Math.floor(random() * 30))
        }

        contracts.push({
            id: `contract-acme-${i + 1}`,
            customerName: `${firstName} ${lastName}`,
            customerPhone: phone,
            contractType,
            startDate,
            expiryDate,
            planValue,
            status,
            lastReminderSent,
            renewalDate,
        })
    }

    return contracts.sort((a, b) => a.expiryDate.getTime() - b.expiryDate.getTime())
}

export function generateAcmeReviews(tenantId: string = 'acme-hvac', count: number = 42): AcmeReview[] {
    const seed = createSeed(tenantId + 'reviews')
    const random = seededRandom(seed)
    const reviews: AcmeReview[] = []
    const now = new Date()

    const reviewTexts = {
        5: [
            'Excellent service! Trevor arrived on time and fixed our AC quickly. Very professional.',
            'Best HVAC company in Phoenix! Mike was knowledgeable and friendly.',
            'Can\'t recommend Acme HVAC enough. Sarah went above and beyond to help us.',
            'Fast, professional, and reasonably priced. Our go-to for all HVAC needs.',
            'Trevor saved us during a heat wave! Emergency service was fantastic.',
        ],
        4: [
            'Great service overall. Small delay but they made it right.',
            'Very happy with the work. Would use again.',
            'Professional team and good communication throughout.',
            'Fixed our furnace quickly. Only minor issue was pricing could be clearer.',
        ],
        3: [
            'Service was okay. Took a bit longer than expected.',
            'Got the job done but communication could be better.',
        ],
    }

    for (let i = 0; i < count; i++) {
        const firstName = FIRST_NAMES[Math.floor(random() * FIRST_NAMES.length)]
        const lastName = LAST_NAMES[Math.floor(random() * LAST_NAMES.length)]

        // Rating distribution: 70% 5-star, 25% 4-star, 5% 3-star
        const ratingRand = random()
        let rating: number
        if (ratingRand < 0.70) rating = 5
        else if (ratingRand < 0.95) rating = 4
        else rating = 3

        // 70% of reviews have text
        let text: string | null = null
        if (random() < 0.70 && reviewTexts[rating as keyof typeof reviewTexts]) {
            const texts = reviewTexts[rating as keyof typeof reviewTexts]
            text = texts[Math.floor(random() * texts.length)]
        }

        const serviceType = SERVICE_TYPES[Math.floor(random() * SERVICE_TYPES.length)]

        // Review date: 1-90 days ago
        const date = new Date(now)
        date.setDate(date.getDate() - Math.floor(random() * 90))

        reviews.push({
            id: `review-acme-${i + 1}`,
            customerName: `${firstName} ${lastName}`,
            rating,
            text,
            date,
            serviceType,
        })
    }

    return reviews.sort((a, b) => b.date.getTime() - a.date.getTime())
}

export function generateAcmeAppointments(
    tenantId: string = 'acme-hvac',
    count: number = 15
): AcmeAppointment[] {
    const seed = createSeed(tenantId + 'appointments')
    const random = seededRandom(seed)
    const appointments: AcmeAppointment[] = []
    const now = new Date()

    const timeSlots = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM']

    for (let i = 0; i < count; i++) {
        const firstName = FIRST_NAMES[Math.floor(random() * FIRST_NAMES.length)]
        const lastName = LAST_NAMES[Math.floor(random() * LAST_NAMES.length)]

        const serviceType = SERVICE_TYPES[Math.floor(random() * SERVICE_TYPES.length)]
        const address = PHOENIX_ADDRESSES[Math.floor(random() * PHOENIX_ADDRESSES.length)]

        // Appointment date: 1-14 days from now
        const date = new Date(now)
        date.setDate(date.getDate() + Math.floor(random() * 14) + 1)

        // Avoid Sundays
        if (date.getDay() === 0) {
            date.setDate(date.getDate() + 1)
        }

        // Technician assignments: Trevor 40%, Mike 30%, Sarah 20%, Dave 10%
        const techRand = random()
        let technician: string
        if (techRand < 0.40) technician = 'Trevor Martinez'
        else if (techRand < 0.70) technician = 'Mike Johnson'
        else if (techRand < 0.90) technician = 'Sarah Chen'
        else technician = 'Dave Wilson'

        const time = timeSlots[Math.floor(random() * timeSlots.length)]

        // 92% confirmed, 6% no response, 2% cancelled
        const confirmRand = random()
        const confirmed = confirmRand < 0.92
        const reminderSent = random() < 0.80 // 80% have had reminders sent

        appointments.push({
            id: `appt-acme-${i + 1}`,
            customerName: `${firstName} ${lastName}`,
            serviceType,
            date,
            time,
            address: `${address.street}, ${address.city}, AZ ${address.zip}`,
            technician,
            reminderSent,
            confirmed,
        })
    }

    return appointments.sort((a, b) => a.date.getTime() - b.date.getTime())
}

export function generateAcmeTechTraining(): AcmeTechTrainingProgress[] {
    const modules = [
        'Safety Basics',
        'Customer Service Excellence',
        'HVAC Fundamentals',
        'Electrical Safety',
        'Advanced Diagnostics',
        'Commercial Systems',
        'Advanced Repair Techniques',
        'Business & Communication Skills',
    ]

    const now = new Date()

    const trainingProgress: AcmeTechTrainingProgress[] = [
        {
            technicianName: 'Trevor Martinez',
            modulesCompleted: modules.map((name, i) => ({
                name,
                completedAt: new Date(now.getTime() - (modules.length - i) * 7 * 24 * 60 * 60 * 1000),
                score: 90 + Math.floor(Math.random() * 10),
            })),
            avgScore: 94,
            totalModules: 8,
        },
        {
            technicianName: 'Mike Johnson',
            modulesCompleted: modules.slice(0, 6).map((name, i) => ({
                name,
                completedAt: new Date(now.getTime() - (6 - i) * 7 * 24 * 60 * 60 * 1000),
                score: 85 + Math.floor(Math.random() * 10),
            })),
            avgScore: 88,
            totalModules: 8,
        },
        {
            technicianName: 'Sarah Chen',
            modulesCompleted: modules.slice(0, 5).map((name, i) => ({
                name,
                completedAt: new Date(now.getTime() - (5 - i) * 7 * 24 * 60 * 60 * 1000),
                score: 88 + Math.floor(Math.random() * 10),
            })),
            avgScore: 91,
            totalModules: 8,
        },
        {
            technicianName: 'Dave Wilson',
            modulesCompleted: modules.slice(0, 4).map((name, i) => ({
                name,
                completedAt: new Date(now.getTime() - (4 - i) * 7 * 24 * 60 * 60 * 1000),
                score: 82 + Math.floor(Math.random() * 10),
            })),
            avgScore: 85,
            totalModules: 8,
        },
    ]

    return trainingProgress
}

// ===== SUMMARY FUNCTION =====

export function generateAllAcmeData(tenantId: string = 'acme-hvac', tenantCreatedAt: Date) {
    return {
        customers: generateAcmeCustomers(tenantId, 100),
        calls: generateAcmeCallRecords(tenantId, tenantCreatedAt, 50),
        quotes: generateAcmeQuotes(tenantId, tenantCreatedAt, 25),
        campaigns: generateAcmeCampaigns(tenantCreatedAt),
        contracts: generateAcmeContracts(tenantId, tenantCreatedAt, 45),
        reviews: generateAcmeReviews(tenantId, 42),
        appointments: generateAcmeAppointments(tenantId, 15),
        techTraining: generateAcmeTechTraining(),
    }
}
