// Mock review request data for demo mode

export interface ReviewTemplate {
    id: string
    name: string
    message: string
    platform: 'google' | 'yelp' | 'facebook'
}

export interface ReviewRequest {
    id: string
    customerName: string
    phone: string
    serviceDate: string
    serviceType: string
    status: 'pending' | 'sent' | 'opened' | 'completed'
    rating?: number
    sentAt?: string
}

export const reviewTemplates: ReviewTemplate[] = [
    {
        id: 'template-1',
        name: 'Standard Follow-up',
        platform: 'google',
        message: `Hi {customerName}! Thanks for choosing Trinity Cooling for your {serviceType}. We'd love to hear about your experience! Could you take a moment to leave us a Google review? {reviewLink}`,
    },
    {
        id: 'template-2',
        name: 'Emergency Service Thank You',
        platform: 'google',
        message: `Hi {customerName}, we're so glad we could help with your emergency {serviceType}. Your comfort and safety are our top priorities. If you have a moment, we'd appreciate a review: {reviewLink}`,
    },
    {
        id: 'template-3',
        name: 'Maintenance Reminder',
        platform: 'google',
        message: `Hi {customerName}! Hope your {serviceType} is running smoothly. As a reminder, regular maintenance keeps your system efficient. Got a minute to share your experience? {reviewLink}`,
    },
]

export const mockReviewRequests: ReviewRequest[] = [
    {
        id: 'req-001',
        customerName: 'Sarah Mitchell',
        phone: '(555) 234-5678',
        serviceDate: 'Today',
        serviceType: 'Emergency Heating Repair',
        status: 'completed',
        rating: 5,
        sentAt: '2 hours ago',
    },
    {
        id: 'req-002',
        customerName: 'Mike Johnson',
        phone: '(555) 345-6789',
        serviceDate: 'Yesterday',
        serviceType: 'AC Maintenance',
        status: 'opened',
        sentAt: '1 day ago',
    },
    {
        id: 'req-003',
        customerName: 'Lisa Chen',
        phone: '(555) 456-7890',
        serviceDate: 'Yesterday',
        serviceType: 'Thermostat Installation',
        status: 'sent',
        sentAt: '1 day ago',
    },
    {
        id: 'req-004',
        customerName: 'James Wilson',
        phone: '(555) 567-8901',
        serviceDate: '2 days ago',
        serviceType: 'Duct Cleaning',
        status: 'pending',
    },
    {
        id: 'req-005',
        customerName: 'Emily Davis',
        phone: '(555) 678-9012',
        serviceDate: '3 days ago',
        serviceType: 'AC Repair',
        status: 'completed',
        rating: 4,
        sentAt: '3 days ago',
    },
]

export const reviewStats = {
    totalSent: 156,
    responseRate: '34%',
    averageRating: 4.7,
    reviewsThisMonth: 23,
    googleReviews: 289,
}
