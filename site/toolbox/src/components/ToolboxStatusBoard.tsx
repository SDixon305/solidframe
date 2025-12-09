'use client'

import React, { useState, useMemo } from 'react'
import { AnimatePresence } from 'framer-motion'
import {
    DndContext,
    DragOverlay,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragEndEvent,
} from '@dnd-kit/core'
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
    CheckCircle2,
    Clock,
    Construction,
    Zap,
    LayoutDashboard,
    GripVertical,
} from 'lucide-react'

import { DashboardLayout, Header, Sidebar } from './shared'
import ToolDetailModal from './modals/ToolDetailModal'
import { IconMap, Tool } from '@/lib/toolbox-data'
import { useToolbox } from '@/hooks/use-toolbox'
import { useToolOrder } from '@/hooks/use-tool-order'

// Sortable tool card component
function SortableToolCard({
    tool,
    dotColor,
    onClick,
}: {
    tool: Tool
    dotColor: string
    onClick: () => void
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: tool.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    }

    const ToolIcon = IconMap[tool.icon] || Zap

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="cursor-pointer"
        >
            <div className={`bg-white rounded-lg p-4 border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-200 group ${isDragging ? 'shadow-lg ring-2 ring-amber-400/50' : ''}`}>
                <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                        {/* Drag handle */}
                        <button
                            {...attributes}
                            {...listeners}
                            className="p-1 -ml-1 text-slate-300 hover:text-slate-500 cursor-grab active:cursor-grabbing touch-none"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <GripVertical size={16} />
                        </button>
                        <div
                            className="p-2 rounded-lg bg-slate-900 text-amber-400 shrink-0 cursor-pointer"
                            onClick={onClick}
                        >
                            <ToolIcon size={16} />
                        </div>
                        <div
                            className="font-semibold text-sm text-slate-900 group-hover:text-slate-700 truncate cursor-pointer"
                            onClick={onClick}
                        >
                            {tool.name}
                        </div>
                    </div>
                    <div className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${dotColor}`} />
                </div>
                <div onClick={onClick} className="cursor-pointer">
                    <p className="text-xs text-slate-500 leading-relaxed mb-3 line-clamp-2">
                        {tool.description}
                    </p>
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                            {tool.id}
                        </span>
                        <span className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                            Click for details
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Drag overlay card (shows while dragging)
function DragOverlayCard({ tool }: { tool: Tool }) {
    const ToolIcon = IconMap[tool.icon] || Zap

    return (
        <div className="bg-white rounded-lg p-4 border-2 border-amber-400 shadow-2xl w-[300px] rotate-2">
            <div className="flex items-center gap-2">
                <div className="p-1 text-slate-400">
                    <GripVertical size={16} />
                </div>
                <div className="p-2 rounded-lg bg-slate-900 text-amber-400 shrink-0">
                    <ToolIcon size={16} />
                </div>
                <div className="font-semibold text-sm text-slate-900">
                    {tool.name}
                </div>
            </div>
        </div>
    )
}

export default function ToolboxStatusBoard() {
    const [selectedTool, setSelectedTool] = useState<Tool | null>(null)
    const [activeId, setActiveId] = useState<string | null>(null)
    const { folders, loading } = useToolbox()
    const { isLoaded, sortTools, reorderTools } = useToolOrder()

    // Flatten tools into a single list
    const allTools: Tool[] = useMemo(() =>
        Object.values(folders).flatMap(folder => folder.tools),
        [folders]
    )

    // Group and sort tools by status
    const liveTools = useMemo(() =>
        sortTools(allTools.filter(t => t.status === 'live'), 'live'),
        [allTools, sortTools]
    )
    const buildingTools = useMemo(() =>
        sortTools(allTools.filter(t => t.status === 'priority' || t.status === 'building'), 'building'),
        [allTools, sortTools]
    )
    const backlogTools = useMemo(() =>
        sortTools(allTools.filter(t => t.status === 'planned'), 'planned'),
        [allTools, sortTools]
    )

    const columns = [
        {
            id: 'live',
            title: 'Live',
            icon: CheckCircle2,
            tools: liveTools,
            headerColor: 'text-emerald-700',
            headerBg: 'bg-emerald-50',
            headerBorder: 'border-emerald-200',
            dotColor: 'bg-emerald-500'
        },
        {
            id: 'building',
            title: 'In Progress',
            icon: Construction,
            tools: buildingTools,
            headerColor: 'text-amber-700',
            headerBg: 'bg-amber-50',
            headerBorder: 'border-amber-200',
            dotColor: 'bg-amber-500'
        },
        {
            id: 'planned',
            title: 'Planned',
            icon: Clock,
            tools: backlogTools,
            headerColor: 'text-slate-600',
            headerBg: 'bg-slate-100',
            headerBorder: 'border-slate-200',
            dotColor: 'bg-slate-400'
        },
    ]

    // Find which column a tool belongs to
    const findColumn = (toolId: string) => {
        for (const col of columns) {
            if (col.tools.find(t => t.id === toolId)) {
                return col
            }
        }
        return null
    }

    // Get the active tool for drag overlay
    const activeTool = activeId ? allTools.find(t => t.id === activeId) : null

    // DnD sensors
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // 8px movement required before drag starts
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string)
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        setActiveId(null)

        if (!over || active.id === over.id) return

        const activeColumn = findColumn(active.id as string)
        const overColumn = findColumn(over.id as string)

        // Only allow reorder within the same column
        if (!activeColumn || !overColumn || activeColumn.id !== overColumn.id) {
            return
        }

        reorderTools(
            activeColumn.id,
            active.id as string,
            over.id as string,
            activeColumn.tools
        )
    }

    const handleDragCancel = () => {
        setActiveId(null)
    }

    return (
        <DashboardLayout
            loading={loading || !isLoaded}
            loadingMessage="Loading status board..."
            sidebar={
                <Sidebar
                    folders={folders}
                    activeSystemLink="status"
                    loading={loading}
                />
            }
            header={
                <Header
                    title="Tool Status"
                    subtitle="Track the development progress of all SolidFrame tools"
                    icon={LayoutDashboard}
                    rightContent={
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <span className="px-2 py-1 bg-slate-100 rounded-md font-medium">{allTools.length} tools</span>
                        </div>
                    }
                />
            }
        >
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragCancel={handleDragCancel}
            >
                {/* Kanban Board - stacks on mobile, horizontal scroll on tablet+ */}
                <div className="h-full overflow-x-auto pb-4">
                    <div className="flex flex-col md:flex-row gap-4 md:gap-6 min-h-[400px] md:min-w-max">
                        {columns.map((col) => (
                            <div key={col.id} className="flex-1 flex flex-col md:min-w-[300px] md:max-w-[360px]">
                                {/* Column Header */}
                                <div className={`flex items-center gap-2 mb-3 px-3 py-2.5 rounded-lg ${col.headerBg} border ${col.headerBorder}`}>
                                    <col.icon size={16} className={col.headerColor} />
                                    <h3 className={`font-semibold text-sm ${col.headerColor}`}>{col.title}</h3>
                                    <span className={`ml-auto text-xs font-medium ${col.headerColor} bg-white/60 px-2 py-0.5 rounded-full`}>
                                        {col.tools.length}
                                    </span>
                                </div>

                                {/* Cards Container */}
                                <SortableContext
                                    items={col.tools.map(t => t.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    <div className="flex-1 space-y-3 md:overflow-y-auto md:max-h-[calc(100vh-220px)] pr-1 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                                        {col.tools.map((tool) => (
                                            <SortableToolCard
                                                key={tool.id}
                                                tool={tool}
                                                dotColor={col.dotColor}
                                                onClick={() => setSelectedTool(tool)}
                                            />
                                        ))}

                                        {col.tools.length === 0 && (
                                            <div className="flex items-center justify-center h-24 text-sm text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                                                No tools yet
                                            </div>
                                        )}
                                    </div>
                                </SortableContext>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Drag overlay - shows the card being dragged */}
                <DragOverlay>
                    {activeTool ? <DragOverlayCard tool={activeTool} /> : null}
                </DragOverlay>
            </DndContext>

            <AnimatePresence>
                {selectedTool && (
                    <ToolDetailModal tool={selectedTool} onClose={() => setSelectedTool(null)} />
                )}
            </AnimatePresence>
        </DashboardLayout>
    )
}
