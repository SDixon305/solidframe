// Mock competitor data for demo mode

export interface MockCompetitor {
    id: string
    name: string
    rating: number
    reviewCount: number
    priceRange: string
    responseTime: string
    services: string[]
    strengths: string[]
    weaknesses: string[]
    recentReviews: {
        rating: number
        text: string
        date: string
    }[]
}

export const mockCompetitors: MockCompetitor[] = [
    {
        id: 'comp-001',
        name: 'CoolBreeze HVAC',
        rating: 4.6,
        reviewCount: 342,
        priceRange: '$$$',
        responseTime: '2-4 hours',
        services: ['AC Repair', 'Heating', 'Installation', 'Maintenance'],
        strengths: ['Fast response', 'Professional technicians', 'Warranty on parts'],
        weaknesses: ['Higher prices', 'Limited weekend availability'],
        recentReviews: [
            { rating: 5, text: 'Great service! Fixed my AC in no time.', date: '2 days ago' },
            { rating: 4, text: 'Good work but a bit pricey.', date: '1 week ago' },
            { rating: 5, text: 'Very professional and knowledgeable.', date: '2 weeks ago' },
        ],
    },
    {
        id: 'comp-002',
        name: 'Desert Air Pros',
        rating: 4.2,
        reviewCount: 187,
        priceRange: '$$',
        responseTime: '4-6 hours',
        services: ['AC Repair', 'Heating', 'Duct Cleaning'],
        strengths: ['Affordable prices', 'Good communication'],
        weaknesses: ['Slower response', 'Limited services'],
        recentReviews: [
            { rating: 4, text: 'Fair prices and did the job well.', date: '3 days ago' },
            { rating: 3, text: 'Took longer than expected to arrive.', date: '1 week ago' },
            { rating: 5, text: 'Best value in the area!', date: '2 weeks ago' },
        ],
    },
    {
        id: 'comp-003',
        name: 'Valley Climate Control',
        rating: 3.9,
        reviewCount: 94,
        priceRange: '$',
        responseTime: 'Next day',
        services: ['AC Repair', 'Basic Maintenance'],
        strengths: ['Lowest prices', 'No service fee'],
        weaknesses: ['Slow response', 'Limited expertise', 'No emergency service'],
        recentReviews: [
            { rating: 3, text: 'Cheap but you get what you pay for.', date: '1 week ago' },
            { rating: 4, text: 'Good for basic maintenance.', date: '2 weeks ago' },
            { rating: 2, text: 'Had to call back for same issue.', date: '3 weeks ago' },
        ],
    },
    {
        id: 'comp-004',
        name: 'Elite Comfort Systems',
        rating: 4.8,
        reviewCount: 521,
        priceRange: '$$$$',
        responseTime: '1-2 hours',
        services: ['AC Repair', 'Heating', 'Installation', 'Smart Home', 'Commercial'],
        strengths: ['Premium service', '24/7 availability', 'Latest technology'],
        weaknesses: ['Very expensive', 'Busy schedule'],
        recentReviews: [
            { rating: 5, text: 'Worth every penny! Amazing service.', date: '1 day ago' },
            { rating: 5, text: 'The best in the business.', date: '4 days ago' },
            { rating: 4, text: 'Excellent but had to wait for appointment.', date: '1 week ago' },
        ],
    },
]

export const competitorComparison = {
    yourBusiness: {
        name: 'Trinity Cooling',
        rating: 4.7,
        reviewCount: 289,
        priceRange: '$$',
        responseTime: '30 min - 1 hour',
        uniqueAdvantages: ['AI-powered 24/7 answering', 'Instant emergency dispatch', 'Real-time tracking'],
    },
}
