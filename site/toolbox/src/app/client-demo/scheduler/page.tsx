'use client'

import { useState, useMemo } from 'react'
import { ArrowLeft, Calendar, Clock, User, MapPin, Check, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Sidebar } from '@/components/shared'
import { demoFolders } from '@/lib/demo-tools'
import { useDemoContext } from '@/lib/demo-context'
import { generateWeekSchedule, mockAppointments, schedulerStats } from '@/lib/mock-data'
import { motion, AnimatePresence } from 'framer-motion'

export default function DemoSchedulerPage() {
    const { businessName } = useDemoContext()
    const searchParams = useSearchParams()
    const token = searchParams.get('token')

    const weekSchedule = useMemo(() => generateWeekSchedule(), [])
    const [selectedDay, setSelectedDay] = useState(weekSchedule[0])
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
    const [showConfirmation, setShowConfirmation] = useState(false)
    const [bookingComplete, setBookingComplete] = useState(false)

    const tokenParam = token ? `?token=${token}` : ''

    const handleSlotSelect = (slotId: string) => {
        const slot = selectedDay.slots.find(s => s.id === slotId)
        if (slot?.available) {
            setSelectedSlot(slotId)
            setShowConfirmation(true)
        }
    }

    const handleConfirmBooking = () => {
        setBookingComplete(true)
        setTimeout(() => {
            setBookingComplete(false)
            setShowConfirmation(false)
            setSelectedSlot(null)
        }, 3000)
    }

    const selectedSlotData = selectedDay.slots.find(s => s.id === selectedSlot)

    return (
        <div className="flex h-screen font-sans text-white transition-colors duration-500">
            <Sidebar
                folders={demoFolders}
                activeFolder="demo_tools"
                brandName="SolidFrame"
                hideNav={true}
            />

            <main className="flex-1 relative overflow-hidden flex flex-col z-10 bg-[#09090b]">
                {/* Header */}
                <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-black/20 backdrop-blur-sm z-20">
                    <div className="flex items-center gap-6">
                        <Link href={`/client-demo${tokenParam}`} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-zinc-400 hover:text-white">
                            <ArrowLeft size={24} />
                        </Link>
                        <div className="p-3 rounded-xl border bg-teal-500/10 border-teal-500/30 shadow-[0_0_20px_rgba(20,184,166,0.2)]">
                            <Calendar size={24} className="text-teal-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold tracking-tight text-white">
                                Appointment Scheduler
                            </h2>
                            <p className="text-sm text-zinc-500">
                                Let customers book with {businessName}
                            </p>
                        </div>
                    </div>

                    <div className="px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
                        Demo Mode
                    </div>
                </header>

                {/* Content */}
                <div className="flex-1 overflow-hidden flex">
                    {/* Calendar View */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {/* Stats */}
                        <div className="grid grid-cols-4 gap-4 mb-6">
                            <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/5">
                                <div className="text-2xl font-bold text-white">{schedulerStats.todayAppointments}</div>
                                <div className="text-xs text-zinc-500">Today</div>
                            </div>
                            <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/20">
                                <div className="text-2xl font-bold text-teal-400">{schedulerStats.weekAppointments}</div>
                                <div className="text-xs text-zinc-500">This Week</div>
                            </div>
                            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                <div className="text-2xl font-bold text-emerald-400">{schedulerStats.completionRate}</div>
                                <div className="text-xs text-zinc-500">Completion</div>
                            </div>
                            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                <div className="text-2xl font-bold text-blue-400">{schedulerStats.avgJobDuration}</div>
                                <div className="text-xs text-zinc-500">Avg Duration</div>
                            </div>
                        </div>

                        {/* Day Selector */}
                        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
                            {weekSchedule.map((day) => (
                                <button
                                    key={day.date}
                                    onClick={() => setSelectedDay(day)}
                                    className={`px-4 py-3 rounded-xl text-center transition-all flex-shrink-0 min-w-[100px] ${
                                        selectedDay.date === day.date
                                            ? 'bg-teal-500/20 border border-teal-500/30'
                                            : 'bg-zinc-900/50 border border-white/5 hover:border-white/10'
                                    }`}
                                >
                                    <div className="text-xs text-zinc-500">{day.dayName}</div>
                                    <div className={`font-bold ${selectedDay.date === day.date ? 'text-teal-400' : 'text-white'}`}>
                                        {day.date}
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Time Slots Grid */}
                        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-4">
                            Available Times - {selectedDay.dayName}, {selectedDay.date}
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {selectedDay.slots.map((slot) => (
                                <button
                                    key={slot.id}
                                    onClick={() => handleSlotSelect(slot.id)}
                                    disabled={!slot.available}
                                    className={`p-4 rounded-xl transition-all ${
                                        slot.available
                                            ? selectedSlot === slot.id
                                                ? 'bg-teal-500/30 border-teal-500/50'
                                                : 'bg-zinc-900/50 border-white/5 hover:border-teal-500/30'
                                            : 'bg-zinc-900/20 border-zinc-800 opacity-50 cursor-not-allowed'
                                    } border`}
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <Clock size={14} className={slot.available ? 'text-teal-400' : 'text-zinc-600'} />
                                        <span className={`font-bold ${slot.available ? 'text-white' : 'text-zinc-600'}`}>
                                            {slot.time}
                                        </span>
                                    </div>
                                    <div className="text-xs text-zinc-500">
                                        {slot.available ? `w/ ${slot.technicianName}` : 'Booked'}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar: Upcoming Appointments */}
                    <div className="w-96 border-l border-white/5 overflow-y-auto">
                        <div className="p-4 border-b border-white/5">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                                Upcoming Appointments
                            </h3>
                        </div>
                        <div className="p-4 space-y-3">
                            {mockAppointments.map((apt, index) => (
                                <motion.div
                                    key={apt.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="p-4 rounded-xl bg-zinc-900/50 border border-white/5"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <h4 className="font-medium text-white">{apt.customerName}</h4>
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                                            apt.status === 'confirmed'
                                                ? 'bg-emerald-500/20 text-emerald-400'
                                                : 'bg-amber-500/20 text-amber-400'
                                        }`}>
                                            {apt.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-teal-400 mb-2">{apt.serviceType}</p>
                                    <div className="space-y-1 text-xs text-zinc-500">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={12} />
                                            {apt.date} at {apt.time}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <User size={12} />
                                            {apt.technicianName}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin size={12} />
                                            {apt.address}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Booking Confirmation Modal */}
                <AnimatePresence>
                    {showConfirmation && selectedSlotData && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 flex items-center justify-center p-8 z-50"
                        >
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                className="bg-zinc-900 border border-white/10 rounded-2xl p-8 max-w-md w-full"
                            >
                                {!bookingComplete ? (
                                    <>
                                        <h3 className="text-xl font-bold text-white mb-2">Confirm Booking</h3>
                                        <p className="text-zinc-400 mb-6">
                                            You're about to book an appointment:
                                        </p>

                                        <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/30 mb-6">
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <div className="text-zinc-500">Date</div>
                                                    <div className="text-white font-medium">{selectedDay.dayName}, {selectedDay.date}</div>
                                                </div>
                                                <div>
                                                    <div className="text-zinc-500">Time</div>
                                                    <div className="text-white font-medium">{selectedSlotData.time}</div>
                                                </div>
                                                <div className="col-span-2">
                                                    <div className="text-zinc-500">Technician</div>
                                                    <div className="text-white font-medium">{selectedSlotData.technicianName}</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => {
                                                    setShowConfirmation(false)
                                                    setSelectedSlot(null)
                                                }}
                                                className="flex-1 py-3 px-4 rounded-xl bg-zinc-800 text-white font-medium hover:bg-zinc-700 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleConfirmBooking}
                                                className="flex-1 py-3 px-4 rounded-xl bg-white text-black font-bold hover:scale-[1.02] transition-transform"
                                            >
                                                Confirm Booking
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-4">
                                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                                            <Check size={32} className="text-emerald-400" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2">Booking Confirmed!</h3>
                                        <p className="text-zinc-400">
                                            A confirmation has been sent to the customer.
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    )
}
