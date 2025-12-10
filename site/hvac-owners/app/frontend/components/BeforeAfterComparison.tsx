'use client'

import { X, Check, PhoneOff, Phone, DollarSign, Frown, Smile, Clock, Zap } from 'lucide-react'

interface ComparisonItemProps {
    icon: React.ReactNode
    text: string
    type: 'before' | 'after'
}

function ComparisonItem({ icon, text, type }: ComparisonItemProps) {
    const isAfter = type === 'after'
    return (
        <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${isAfter ? 'bg-green-100' : 'bg-red-100'} flex-shrink-0`}>
                {icon}
            </div>
            <p className="text-sm text-gray-700 flex-1">{text}</p>
        </div>
    )
}

export default function BeforeAfterComparison() {
    return (
        <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                The Transformation
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Before AI */}
                <div className="bg-red-50 rounded-lg p-6 border-2 border-red-200">
                    <div className="flex items-center gap-2 mb-4">
                        <X className="w-6 h-6 text-red-600" />
                        <h3 className="text-xl font-bold text-gray-900">Before AI</h3>
                    </div>

                    <div className="space-y-4">
                        <ComparisonItem
                            icon={<PhoneOff className="w-5 h-5 text-red-600" />}
                            text="65% of after-hours calls go to voicemail"
                            type="before"
                        />
                        <ComparisonItem
                            icon={<DollarSign className="w-5 h-5 text-red-600" />}
                            text="Losing $16,200/month in missed opportunities"
                            type="before"
                        />
                        <ComparisonItem
                            icon={<Frown className="w-5 h-5 text-red-600" />}
                            text="Customers frustrated by no response"
                            type="before"
                        />
                        <ComparisonItem
                            icon={<Clock className="w-5 h-5 text-red-600" />}
                            text="Owner woken up at 2 AM for emergencies"
                            type="before"
                        />
                        <ComparisonItem
                            icon={<X className="w-5 h-5 text-red-600" />}
                            text="Inconsistent service quality"
                            type="before"
                        />
                        <ComparisonItem
                            icon={<PhoneOff className="w-5 h-5 text-red-600" />}
                            text="Competitors capture your customers"
                            type="before"
                        />
                    </div>

                    <div className="mt-6 bg-red-100 rounded-lg p-4 text-center">
                        <p className="text-sm font-bold text-red-700">
                            Missing 42 calls per month
                        </p>
                        <p className="text-xs text-red-600 mt-1">
                            That's $200K+ in lost annual revenue
                        </p>
                    </div>
                </div>

                {/* After AI */}
                <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
                    <div className="flex items-center gap-2 mb-4">
                        <Check className="w-6 h-6 text-green-600" />
                        <h3 className="text-xl font-bold text-gray-900">With AI</h3>
                    </div>

                    <div className="space-y-4">
                        <ComparisonItem
                            icon={<Phone className="w-5 h-5 text-green-600" />}
                            text="95% of calls answered and handled instantly"
                            type="after"
                        />
                        <ComparisonItem
                            icon={<DollarSign className="w-5 h-5 text-green-600" />}
                            text="Capturing $23,500/month in new revenue"
                            type="after"
                        />
                        <ComparisonItem
                            icon={<Smile className="w-5 h-5 text-green-600" />}
                            text="98% customer satisfaction rating"
                            type="after"
                        />
                        <ComparisonItem
                            icon={<Zap className="w-5 h-5 text-green-600" />}
                            text="AI handles calls while you sleep soundly"
                            type="after"
                        />
                        <ComparisonItem
                            icon={<Check className="w-5 h-5 text-green-600" />}
                            text="Professional, consistent service 24/7"
                            type="after"
                        />
                        <ComparisonItem
                            icon={<Phone className="w-5 h-5 text-green-600" />}
                            text="Never lose a customer to competition"
                            type="after"
                        />
                    </div>

                    <div className="mt-6 bg-green-100 rounded-lg p-4 text-center">
                        <p className="text-sm font-bold text-green-700">
                            Capturing 47 calls per month
                        </p>
                        <p className="text-xs text-green-600 mt-1">
                            That's $282K+ in captured annual revenue
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom CTA */}
            <div className="mt-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6 text-center border-2 border-blue-200">
                <p className="text-lg font-bold text-gray-900 mb-2">
                    The difference? <span className="text-green-600">$16,200/month</span> in captured revenue
                </p>
                <p className="text-sm text-gray-600">
                    Plus peace of mind, better customer service, and 15+ hours saved per week
                </p>
            </div>
        </div>
    )
}
