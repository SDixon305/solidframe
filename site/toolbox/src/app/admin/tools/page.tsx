'use client'

import { useState, useMemo } from 'react'
import { Search, Filter, Grid3X3, List, Plus } from 'lucide-react'
import { AdminToolCard } from '@/components/admin/ToolCard'
import { getMockTools, getMockTenantCount } from '@/lib/mock-data/tools'
import type { ToolCategory } from '@/types/tools'

type ViewMode = 'grid' | 'list'
type FilterType = 'all' | 'real' | 'mockup'

export default function ToolsPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [viewMode, setViewMode] = useState<ViewMode>('grid')
    const [filterType, setFilterType] = useState<FilterType>('all')
    const [categoryFilter, setCategoryFilter] = useState<ToolCategory | 'all'>('all')

    // Get tools data
    const tools = getMockTools()

    // Filter and search tools
    const filteredTools = useMemo(() => {
        return tools.filter(tool => {
            // Search filter
            const matchesSearch = searchQuery === '' ||
                tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                tool.description?.toLowerCase().includes(searchQuery.toLowerCase())

            // Real/Mockup filter
            const matchesType =
                filterType === 'all' ||
                (filterType === 'real' && tool.is_real) ||
                (filterType === 'mockup' && !tool.is_real)

            // Category filter
            const matchesCategory =
                categoryFilter === 'all' || tool.category === categoryFilter

            return matchesSearch && matchesType && matchesCategory
        })
    }, [tools, searchQuery, filterType, categoryFilter])

    // Get unique categories
    const categories = useMemo(() => {
        const cats = new Set(tools.map(t => t.category))
        return Array.from(cats)
    }, [tools])

    // Stats
    const stats = useMemo(() => {
        const realTools = tools.filter(t => t.is_real).length
        const mockupTools = tools.filter(t => !t.is_real).length
        const totalTenants = tools.reduce((sum, t) => sum + getMockTenantCount(t.id), 0)
        return { realTools, mockupTools, totalTenants }
    }, [tools])

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Tools</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage tool versions and deployments across {stats.totalTenants} tenant activations
                    </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors">
                    <Plus size={16} />
                    New Tool
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="text-2xl font-semibold text-gray-900">{tools.length}</div>
                    <div className="text-sm text-gray-500">Total Tools</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="text-2xl font-semibold text-emerald-600">{stats.realTools}</div>
                    <div className="text-sm text-gray-500">Real Tools</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="text-2xl font-semibold text-gray-600">{stats.mockupTools}</div>
                    <div className="text-sm text-gray-500">Mockup Tools</div>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search tools..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-300 transition-colors"
                        />
                    </div>

                    {/* Filter by type */}
                    <div className="flex items-center gap-2">
                        <Filter size={14} className="text-gray-400" />
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value as FilterType)}
                            className="px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-300"
                        >
                            <option value="all">All Types</option>
                            <option value="real">Real Only</option>
                            <option value="mockup">Mockup Only</option>
                        </select>
                    </div>

                    {/* Filter by category */}
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value as ToolCategory | 'all')}
                        className="px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-300"
                    >
                        <option value="all">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>
                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </option>
                        ))}
                    </select>

                    {/* View mode toggle */}
                    <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-md transition-colors ${
                                viewMode === 'grid'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <Grid3X3 size={16} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-md transition-colors ${
                                viewMode === 'list'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <List size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Tools Grid/List */}
            {filteredTools.length > 0 ? (
                <div className={
                    viewMode === 'grid'
                        ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4'
                        : 'space-y-3'
                }>
                    {filteredTools.map(tool => (
                        <AdminToolCard
                            key={tool.id}
                            tool={tool}
                            tenantCount={getMockTenantCount(tool.id)}
                        />
                    ))}
                </div>
            ) : (
                <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                        <Search size={24} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No tools found</h3>
                    <p className="text-sm text-gray-500">
                        Try adjusting your search or filter criteria
                    </p>
                </div>
            )}
        </div>
    )
}
