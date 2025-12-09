'use client'

export type DateRange = 7 | 30 | 90

interface DateRangeFilterProps {
    value: DateRange
    onChange: (range: DateRange) => void
}

const options: { value: DateRange; label: string }[] = [
    { value: 7, label: '7d' },
    { value: 30, label: '30d' },
    { value: 90, label: '90d' },
]

export function DateRangeFilter({ value, onChange }: DateRangeFilterProps) {
    return (
        <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1">
            {options.map((option) => (
                <button
                    key={option.value}
                    onClick={() => onChange(option.value)}
                    className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                        value === option.value
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                    {option.label}
                </button>
            ))}
        </div>
    )
}
