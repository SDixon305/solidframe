'use client'

import React from 'react'
import { Star } from 'lucide-react'

interface StarRatingDisplayProps {
    averageRating: number
    totalReviews: number
    distribution: {
        5: number
        4: number
        3: number
        2: number
        1: number
    }
}

export default function StarRatingDisplay({
    averageRating,
    totalReviews,
    distribution,
}: StarRatingDisplayProps) {
    const total = Object.values(distribution).reduce((a, b) => a + b, 0)

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
            {/* Main Rating */}
            <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-100">
                <div className="text-center">
                    <div className="text-5xl font-bold text-gray-900 mb-1">
                        {averageRating.toFixed(1)}
                    </div>
                    <div className="flex items-center gap-0.5 justify-center mb-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                size={16}
                                className={
                                    star <= Math.round(averageRating)
                                        ? 'text-amber-400 fill-amber-400'
                                        : 'text-gray-200'
                                }
                            />
                        ))}
                    </div>
                    <div className="text-sm text-gray-500">
                        {totalReviews} reviews
                    </div>
                </div>

                {/* Distribution Bars */}
                <div className="flex-1 space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => {
                        const count = distribution[rating as keyof typeof distribution]
                        const percentage = total > 0 ? (count / total) * 100 : 0

                        return (
                            <div key={rating} className="flex items-center gap-2">
                                <div className="flex items-center gap-0.5 w-12">
                                    <span className="text-sm text-gray-600">{rating}</span>
                                    <Star size={12} className="text-amber-400 fill-amber-400" />
                                </div>
                                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-amber-400 rounded-full transition-all duration-500"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                                <div className="w-8 text-right text-xs text-gray-400">
                                    {count}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Rating Breakdown */}
            <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                    <div className="text-2xl font-bold text-emerald-600">
                        {Math.round((distribution[5] + distribution[4]) / total * 100)}%
                    </div>
                    <div className="text-xs text-gray-500">Positive</div>
                </div>
                <div>
                    <div className="text-2xl font-bold text-gray-400">
                        {Math.round(distribution[3] / total * 100)}%
                    </div>
                    <div className="text-xs text-gray-500">Neutral</div>
                </div>
                <div>
                    <div className="text-2xl font-bold text-red-500">
                        {Math.round((distribution[2] + distribution[1]) / total * 100)}%
                    </div>
                    <div className="text-xs text-gray-500">Negative</div>
                </div>
            </div>
        </div>
    )
}
