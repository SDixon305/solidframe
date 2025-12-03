'use client'

import { Star, Quote } from 'lucide-react'

interface Testimonial {
    quote: string
    author: string
    business: string
    location: string
    metric: string
    rating: number
}

const testimonials: Testimonial[] = [
    {
        quote: "We captured $18,000 in after-hours calls in the first month alone. The AI never sleeps, never misses a call, and customers love the instant response. This has been a game-changer for our business.",
        author: "Bob Thompson",
        business: "Bob's HVAC",
        location: "Tampa, FL",
        metric: "$18K first month",
        rating: 5
    },
    {
        quote: "I finally sleep through the night! The AI handles emergency calls professionally, dispatches our on-call tech, and I wake up to a detailed report. It's like having a full-time receptionist for a fraction of the cost.",
        author: "Sarah Martinez",
        business: "Sarah's Heating & Air",
        location: "Charlotte, NC",
        metric: "15 hrs/week saved",
        rating: 5
    },
    {
        quote: "Our customer satisfaction scores went from 82% to 98% after implementing the AI system. People are amazed they get a real conversation at 2 AM, not just a voicemail. It's helping us dominate our market.",
        author: "Mike Chen",
        business: "Mike's HVAC Solutions",
        location: "Atlanta, GA",
        metric: "98% satisfaction",
        rating: 5
    }
]

export default function TestimonialCards() {
    return (
        <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                What HVAC Owners Are Saying
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
                {testimonials.map((testimonial, index) => (
                    <div
                        key={index}
                        className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border-2 border-blue-200 hover:shadow-lg transition-shadow"
                    >
                        {/* Quote Icon */}
                        <div className="mb-4">
                            <Quote className="w-8 h-8 text-blue-600 opacity-50" />
                        </div>

                        {/* Rating */}
                        <div className="flex gap-1 mb-3">
                            {[...Array(testimonial.rating)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            ))}
                        </div>

                        {/* Quote */}
                        <p className="text-sm text-gray-700 mb-4 italic">
                            "{testimonial.quote}"
                        </p>

                        {/* Metric Highlight */}
                        <div className="bg-white rounded-lg p-3 mb-4 border border-blue-200">
                            <p className="text-center font-bold text-green-600 text-lg">
                                {testimonial.metric}
                            </p>
                        </div>

                        {/* Author */}
                        <div className="border-t border-blue-200 pt-4">
                            <p className="font-bold text-gray-900">{testimonial.author}</p>
                            <p className="text-sm text-gray-600">{testimonial.business}</p>
                            <p className="text-xs text-gray-500">{testimonial.location}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom Stats */}
            <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">127</p>
                    <p className="text-xs text-gray-600">HVAC Businesses</p>
                </div>
                <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">$2.1M</p>
                    <p className="text-xs text-gray-600">Revenue Captured</p>
                </div>
                <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">4.9/5</p>
                    <p className="text-xs text-gray-600">Avg Rating</p>
                </div>
            </div>
        </div>
    )
}
