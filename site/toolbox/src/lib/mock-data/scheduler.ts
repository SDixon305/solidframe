// Mock scheduler data for demo mode

export interface TimeSlot {
    id: string
    time: string
    available: boolean
    technicianName?: string
}

export interface DaySchedule {
    date: string
    dayName: string
    slots: TimeSlot[]
}

export interface Appointment {
    id: string
    customerName: string
    phone: string
    address: string
    serviceType: string
    date: string
    time: string
    technicianName: string
    status: 'confirmed' | 'pending' | 'completed' | 'cancelled'
    notes?: string
}

// Generate a week of schedule data
export function generateWeekSchedule(): DaySchedule[] {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const times = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM']
    const technicians = ['Mike T.', 'Sarah J.', 'Carlos R.']

    const today = new Date()

    return days.map((dayName, dayIndex) => {
        const date = new Date(today)
        date.setDate(today.getDate() + dayIndex + 1)

        return {
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            dayName,
            slots: times.map((time, timeIndex) => ({
                id: `${dayIndex}-${timeIndex}`,
                time,
                available: Math.random() > 0.4, // 60% availability
                technicianName: technicians[Math.floor(Math.random() * technicians.length)],
            })),
        }
    })
}

export const mockAppointments: Appointment[] = [
    {
        id: 'apt-001',
        customerName: 'Jennifer Martinez',
        phone: '(555) 123-4567',
        address: '789 Pine Street, Phoenix',
        serviceType: 'AC Maintenance',
        date: 'Tomorrow',
        time: '10:00 AM',
        technicianName: 'Mike T.',
        status: 'confirmed',
    },
    {
        id: 'apt-002',
        customerName: 'Robert Kim',
        phone: '(555) 234-5678',
        address: '456 Oak Avenue, Scottsdale',
        serviceType: 'Heating Repair',
        date: 'Tomorrow',
        time: '2:00 PM',
        technicianName: 'Sarah J.',
        status: 'confirmed',
    },
    {
        id: 'apt-003',
        customerName: 'Amanda Chen',
        phone: '(555) 345-6789',
        address: '123 Elm Road, Mesa',
        serviceType: 'New AC Installation',
        date: 'Wednesday',
        time: '9:00 AM',
        technicianName: 'Carlos R.',
        status: 'pending',
        notes: 'Customer requested morning appointment',
    },
]

export const schedulerStats = {
    todayAppointments: 8,
    weekAppointments: 34,
    completionRate: '96%',
    avgJobDuration: '1.5 hrs',
}
