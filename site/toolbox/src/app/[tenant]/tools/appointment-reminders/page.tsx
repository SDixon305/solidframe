'use client'

import React, { useState, useMemo } from 'react'
import { LayoutGrid, Settings, Activity } from 'lucide-react'
import { addDays, addHours, setHours, setMinutes } from 'date-fns'
import { useTenantContext } from '@/lib/tenant-context'
import { ToolLayout, ToolHeader, ToolTabs, Tab, ActivityLog, MessageTemplateEditor } from '@/components/tools'
import { ReminderConfig, ConfirmationRate, UpcomingReminders, UpcomingAppointment } from '@/components/tools/reminders'
import { generateActivityLog } from '@/lib/fake-data'

const TABS: Tab[] = [
    { id: 'overview', label: 'Overview', icon: LayoutGrid },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'activity', label: 'Activity', icon: Activity },
]

const DAY_BEFORE_TEMPLATE = `Hi {firstName}! This is a reminder that you have an appointment with {businessName} tomorrow at {time}. Reply YES to confirm or call us to reschedule.`

const TWO_HOUR_TEMPLATE = `Hi {firstName}! Just a reminder: your {serviceType} appointment is in 2 hours at {time}. Our technician is looking forward to helping you!`

const TEMPLATE_VARIABLES = [
    { key: 'firstName', label: 'First Name', example: 'John' },
    { key: 'businessName', label: 'Business Name', example: 'Acme HVAC' },
    { key: 'serviceType', label: 'Service Type', example: 'AC maintenance' },
    { key: 'time', label: 'Time', example: '2:00 PM' },
    { key: 'date', label: 'Date', example: 'Tuesday, Dec 10' },
]

// Seeded random for consistent data
function seededRandom(seed: number): () => number {
    return () => {
        seed = (seed * 9301 + 49297) % 233280
        return seed / 233280
    }
}

const SERVICE_TYPES = [
    'AC Maintenance',
    'Furnace Inspection',
    'HVAC Repair',
    'Duct Cleaning',
    'Thermostat Installation',
    'System Tune-Up',
]

const FIRST_NAMES = [
    'John', 'Sarah', 'Mike', 'Emily', 'David', 'Lisa', 'Chris', 'Amanda',
    'James', 'Jennifer', 'Robert', 'Michelle', 'William', 'Ashley',
]

const LAST_NAMES = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller',
    'Davis', 'Rodriguez', 'Martinez', 'Wilson', 'Anderson',
]

const STREETS = [
    'Oak Street', 'Maple Avenue', 'Main Street', 'Cedar Lane', 'Pine Road',
    'Elm Drive', 'Walnut Way', 'Cherry Court', 'Birch Boulevard',
]

export default function AppointmentRemindersPage() {
    const { tenant, getTool } = useTenantContext()
    const tool = getTool('appointment-reminders')

    const [activeTab, setActiveTab] = useState('overview')
    const [reminderSettings, setReminderSettings] = useState({
        dayBefore: true,
        twoHoursBefore: true,
    })
    const [dayBeforeTemplate, setDayBeforeTemplate] = useState(
        DAY_BEFORE_TEMPLATE.replace('{businessName}', tenant.name)
    )
    const [twoHourTemplate, setTwoHourTemplate] = useState(
        TWO_HOUR_TEMPLATE.replace('{businessName}', tenant.name)
    )

    // Generate fake confirmation stats
    const confirmationStats = useMemo(() => {
        const seed = tenant.id.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
        const random = seededRandom(seed)

        const createdAt = new Date(tenant.created_at)
        const daysSince = Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24))

        const total = Math.floor(daysSince * 2.5) + 30
        const rate = 91 + Math.floor(random() * 6)
        const confirmed = Math.floor(total * (rate / 100))
        const cancelled = Math.floor(total * 0.03)
        const noResponse = total - confirmed - cancelled

        return {
            rate,
            confirmed,
            noResponse,
            cancelled,
            trend: 2 + Math.floor(random() * 3),
        }
    }, [tenant.id, tenant.created_at])

    // Generate upcoming appointments
    const upcomingAppointments = useMemo((): UpcomingAppointment[] => {
        const seed = (tenant.id + 'appointments').split('').reduce((a, b) => a + b.charCodeAt(0), 0)
        const random = seededRandom(seed)

        const appointments: UpcomingAppointment[] = []
        const now = new Date()

        for (let i = 0; i < 15; i++) {
            const daysFromNow = Math.floor(random() * 7)
            const hour = 8 + Math.floor(random() * 9) // 8 AM to 5 PM
            const minute = random() > 0.5 ? 0 : 30

            const date = addDays(now, daysFromNow)
            const appointmentDate = setMinutes(setHours(date, hour), minute)

            const firstName = FIRST_NAMES[Math.floor(random() * FIRST_NAMES.length)]
            const lastName = LAST_NAMES[Math.floor(random() * LAST_NAMES.length)]
            const streetNum = 100 + Math.floor(random() * 900)
            const street = STREETS[Math.floor(random() * STREETS.length)]

            appointments.push({
                id: `apt-${i}`,
                customerName: `${firstName} ${lastName}`,
                serviceType: SERVICE_TYPES[Math.floor(random() * SERVICE_TYPES.length)],
                date: appointmentDate,
                time: `${hour > 12 ? hour - 12 : hour}:${minute.toString().padStart(2, '0')} ${hour >= 12 ? 'PM' : 'AM'}`,
                address: `${streetNum} ${street}`,
                reminderSent: daysFromNow <= 1,
                confirmed: random() > 0.15,
            })
        }

        return appointments.sort((a, b) => a.date.getTime() - b.date.getTime())
    }, [tenant.id])

    const activity = useMemo(() =>
        generateActivityLog(new Date(tenant.created_at), 'appointment-reminders', tenant.id, 30),
        [tenant.created_at, tenant.id]
    )

    const handleSaveReminderSettings = (settings: typeof reminderSettings) => {
        setReminderSettings(settings)
        console.log('Saved reminder settings:', settings)
    }

    if (!tool) {
        return <div>Tool not found</div>
    }

    return (
        <ToolLayout>
            <ToolHeader
                slug="appointment-reminders"
                name={tool.name}
                description={tool.description}
                metrics={tool.metrics}
                isReal={false}
            />

            <ToolTabs
                tabs={TABS}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <div className="space-y-6">
                    {/* Top Stats */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <ConfirmationRate
                            rate={confirmationStats.rate}
                            confirmed={confirmationStats.confirmed}
                            noResponse={confirmationStats.noResponse}
                            cancelled={confirmationStats.cancelled}
                            trend={confirmationStats.trend}
                        />

                        <ReminderConfig
                            settings={reminderSettings}
                            onSave={handleSaveReminderSettings}
                        />
                    </div>

                    {/* Upcoming Appointments */}
                    <UpcomingReminders
                        appointments={upcomingAppointments}
                        maxDisplay={8}
                    />

                    {/* Recent Activity */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Recent Activity</h3>
                        <ActivityLog
                            entries={activity}
                            maxEntries={5}
                            onViewAll={() => setActiveTab('activity')}
                        />
                    </div>
                </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
                <div className="space-y-6">
                    <ReminderConfig
                        settings={reminderSettings}
                        onSave={handleSaveReminderSettings}
                    />

                    <MessageTemplateEditor
                        label="24-Hour Reminder Message"
                        template={dayBeforeTemplate}
                        onSave={setDayBeforeTemplate}
                        variables={TEMPLATE_VARIABLES}
                        maxLength={300}
                    />

                    <MessageTemplateEditor
                        label="2-Hour Reminder Message"
                        template={twoHourTemplate}
                        onSave={setTwoHourTemplate}
                        variables={TEMPLATE_VARIABLES}
                        maxLength={300}
                    />

                    {/* Confirmation Settings */}
                    <div className="bg-white border border-gray-200 rounded-xl p-5">
                        <h3 className="font-semibold text-gray-900 mb-4">Confirmation Settings</h3>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <div className="font-medium text-gray-900">Allow text confirmations</div>
                                    <div className="text-sm text-gray-500">
                                        Customers can reply YES to confirm
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    role="switch"
                                    aria-checked={true}
                                    className="relative inline-flex h-6 w-11 items-center rounded-full bg-[#5f3bff]"
                                >
                                    <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <div className="font-medium text-gray-900">Auto-reschedule link</div>
                                    <div className="text-sm text-gray-500">
                                        Include a link to reschedule online
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    role="switch"
                                    aria-checked={true}
                                    className="relative inline-flex h-6 w-11 items-center rounded-full bg-[#5f3bff]"
                                >
                                    <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Activity Tab */}
            {activeTab === 'activity' && (
                <ActivityLog
                    entries={activity}
                    showViewAll={false}
                />
            )}
        </ToolLayout>
    )
}
