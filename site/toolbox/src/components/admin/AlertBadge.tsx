interface AlertBadgeProps {
    count: number
    max?: number
}

export function AlertBadge({ count, max = 99 }: AlertBadgeProps) {
    if (count <= 0) return null

    const displayCount = count > max ? `${max}+` : count.toString()

    return (
        <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-semibold text-white bg-red-500 rounded-full">
            {displayCount}
        </span>
    )
}
