import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Folder, Tool, ToolSpec, LogEntry, toolboxFolders as initialFolders } from '@/lib/toolbox-data'

export function useToolbox() {
    const [folders, setFolders] = useState<Record<string, Folder>>(initialFolders)
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch all tools
                const { data: toolsData, error: toolsError } = await supabase
                    .from('tools')
                    .select('*');

                if (toolsError) throw toolsError;

                // Fetch specs
                const { data: specsData, error: specsError } = await supabase
                    .from('tool_specs')
                    .select('*')
                    .order('order');

                if (specsError) throw specsError;

                // Fetch logs
                const { data: logsData, error: logsError } = await supabase
                    .from('tool_activity_logs')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (logsError) throw logsError;

                // Transform into existing structure
                const newFolders = { ...initialFolders } // Start with static shell for folders names/icons

                // Reset tools lists in folders to avoid duplication if we re-run (though logic below replaces)
                // Actually, our folders are keyed by 'category'.
                // 'sales_demos', 'agent_config', etc.

                // Group tools by category
                const toolsByCategory: Record<string, Tool[]> = {}

                // Helper to map DB tool to Frontend Tool
                // existing 'Tool' interface has: id, name, icon, status, description, specs, activityLog, image

                toolsData.forEach((t: any) => {
                    const specs = specsData.filter((s: any) => s.tool_id === t.id).map((s: any) => ({
                        label: s.label,
                        completed: s.completed
                    }));

                    const logs = logsData.filter((l: any) => l.tool_id === t.id).map((l: any) => ({
                        time: new Date(l.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        message: l.message,
                        color: l.category || 'text-zinc-400'
                    }));

                    const tool: Tool = {
                        id: t.id,
                        name: t.name,
                        description: t.description,
                        status: t.status,
                        icon: t.icon,
                        image: t.image_url || undefined,
                        specs: specs,
                        activityLog: logs
                    }

                    if (!toolsByCategory[t.category]) {
                        toolsByCategory[t.category] = []
                    }
                    toolsByCategory[t.category].push(tool)
                });

                // Update folders
                Object.keys(newFolders).forEach(key => {
                    if (toolsByCategory[key]) {
                        // Sort by some criteria? For now insert order or name?
                        // DB has no explicit order column for tools, but let's trust default or name
                        newFolders[key] = {
                            ...newFolders[key],
                            tools: toolsByCategory[key]
                        }
                    } else {
                        newFolders[key] = {
                            ...newFolders[key],
                            tools: []
                        }
                    }
                })

                setFolders(newFolders)

            } catch (error) {
                console.error("Error fetching toolbox data:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()

        // Setup Realtime subscription
        const channel = supabase.channel('toolbox-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'tools' }, fetchData)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'tool_specs' }, fetchData)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'tool_activity_logs' }, fetchData)
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }

    }, [])

    return { folders, loading }
}
