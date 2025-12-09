// Mock lead data for demo mode

export interface MockLead {
    id: string
    businessName: string
    ownerName: string
    phone: string
    email: string
    address: string
    city: string
    rating: number
    reviewCount: number
    status: 'new' | 'contacted' | 'qualified' | 'not-interested'
    services: string[]
    lastActivity: string
}

export const mockLeads: MockLead[] = [
    {
        id: 'lead-001',
        businessName: 'Comfort Zone HVAC',
        ownerName: 'David Martinez',
        phone: '(555) 111-2233',
        email: 'david@comfortzoneHVAC.com',
        address: '456 Industrial Blvd',
        city: 'Phoenix, AZ',
        rating: 4.2,
        reviewCount: 87,
        status: 'new',
        services: ['AC Repair', 'Heating', 'Installation'],
        lastActivity: 'Scraped 2 hours ago',
    },
    {
        id: 'lead-002',
        businessName: 'Arctic Air Solutions',
        ownerName: 'Lisa Thompson',
        phone: '(555) 222-3344',
        email: 'lisa@arcticair.com',
        address: '789 Commerce Dr',
        city: 'Phoenix, AZ',
        rating: 3.8,
        reviewCount: 42,
        status: 'new',
        services: ['AC Repair', 'Maintenance'],
        lastActivity: 'Scraped 2 hours ago',
    },
    {
        id: 'lead-003',
        businessName: 'Desert Heat & Cool',
        ownerName: 'James Wilson',
        phone: '(555) 333-4455',
        email: 'james@desertheatcool.com',
        address: '123 Main Street',
        city: 'Scottsdale, AZ',
        rating: 4.7,
        reviewCount: 156,
        status: 'contacted',
        services: ['AC Repair', 'Heating', 'Duct Work', 'Installation'],
        lastActivity: 'Email sent 1 day ago',
    },
    {
        id: 'lead-004',
        businessName: 'Valley Comfort Systems',
        ownerName: 'Maria Garcia',
        phone: '(555) 444-5566',
        email: 'maria@valleycomfort.com',
        address: '567 Oak Avenue',
        city: 'Mesa, AZ',
        rating: 4.5,
        reviewCount: 203,
        status: 'qualified',
        services: ['AC Repair', 'Heating', 'Commercial'],
        lastActivity: 'Call scheduled tomorrow',
    },
    {
        id: 'lead-005',
        businessName: 'Quick Cool Services',
        ownerName: 'Tom Anderson',
        phone: '(555) 555-6677',
        email: 'tom@quickcool.com',
        address: '890 Pine Road',
        city: 'Tempe, AZ',
        rating: 3.2,
        reviewCount: 28,
        status: 'not-interested',
        services: ['AC Repair'],
        lastActivity: 'Declined 3 days ago',
    },
    {
        id: 'lead-006',
        businessName: 'Premier Climate Control',
        ownerName: 'Nancy Roberts',
        phone: '(555) 666-7788',
        email: 'nancy@premierclimate.com',
        address: '234 Sunset Blvd',
        city: 'Gilbert, AZ',
        rating: 4.9,
        reviewCount: 312,
        status: 'new',
        services: ['AC Repair', 'Heating', 'Installation', 'Maintenance'],
        lastActivity: 'Scraped 2 hours ago',
    },
]

export const leadStats = {
    totalScraped: 156,
    newLeads: 23,
    contacted: 45,
    qualified: 12,
    conversionRate: '8.3%',
}
