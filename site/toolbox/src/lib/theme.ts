// ServiceTitan-inspired theme configuration
// Used across all toolbox variants (admin, client-demo, future client toolboxes)

// Primary accent - slate/amber palette matching the new design
export const accentTheme = {
    color: 'text-amber-500',
    bg: 'bg-slate-900',
    border: 'border-slate-700',
    hoverBg: 'hover:bg-slate-800',
}

// Folder themes - consistent professional slate/amber styling
export const folderThemes: Record<string, { color: string; bg: string; border: string; glow: string }> = {
    sales_demos: {
        color: 'text-amber-400',
        bg: 'bg-slate-900',
        border: 'border-slate-700',
        glow: 'shadow-lg shadow-slate-900/20'
    },
    agent_config: {
        color: 'text-amber-400',
        bg: 'bg-slate-900',
        border: 'border-slate-700',
        glow: 'shadow-lg shadow-slate-900/20'
    },
    client_mgmt: {
        color: 'text-amber-400',
        bg: 'bg-slate-900',
        border: 'border-slate-700',
        glow: 'shadow-lg shadow-slate-900/20'
    },
    data_ops: {
        color: 'text-amber-400',
        bg: 'bg-slate-900',
        border: 'border-slate-700',
        glow: 'shadow-lg shadow-slate-900/20'
    },
}

// Status colors using semantic colors - refined for professional look
export const statusColors: Record<string, string> = {
    priority: 'text-amber-700 border-amber-200 bg-amber-50',
    building: 'text-blue-700 border-blue-200 bg-blue-50',
    live: 'text-emerald-700 border-emerald-200 bg-emerald-50',
    planned: 'text-slate-500 border-slate-200 bg-slate-50',
}

export const statusLabels: Record<string, string> = {
    live: 'Active',
    priority: 'Ready',
    building: 'Building',
    planned: 'Planned'
}

export function getTheme(folderId: string) {
    return folderThemes[folderId] || folderThemes.sales_demos
}
