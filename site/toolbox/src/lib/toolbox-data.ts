
import {
    Zap,
    Target,
    FileText,
    Search,
    BarChart,
    DollarSign,
    Flag,
    MessageSquare,
    Layout,
    Users,
    Globe,
    Briefcase,
    Layers,
    List,
    Calendar,
    Mail,
    RefreshCw,
    CheckSquare,
    Cpu,
    Activity,
    Table,
    FileCheck,
    Phone,
    Mic,
    AlertTriangle,
    Video,
    PenTool,
    Megaphone,
    Smartphone,
    Eye,
    Receipt,
    ScrollText,
} from 'lucide-react'

// --- Icon Mapping ---
// --- Icon Mapping ---
export const IconMap: Record<string, any> = {
    'sales_demos': Target, // Sales & Demos
    'agent_config': Cpu,   // Building & Config
    'client_mgmt': Users,  // Client Management
    'data_ops': BarChart,  // Backend Data Ops

    // Tool Icons
    'calculator': DollarSign,
    'lightning': Zap,
    'theater': Layout,
    'search': Search,
    'code': PenTool,
    'mic': Mic,
    'database': Layers,
    'building': Briefcase,
    'credit-card': Receipt,
    'toggle': CheckSquare,
    'scraper': Globe,
    'filter': List,
    'send': Mail,
    'lock': AlertTriangle,
    'file': FileText,
    'chart': Activity,
    'star': Video, // Using video for "Training Clips" / reviews
    'sparkles': RefreshCw,
}

export type ToolStatus = 'priority' | 'building' | 'live' | 'planned';

export interface ToolSpec {
    label: string;
    completed: boolean;
}

export interface LogEntry {
    time: string;
    message: string;
    color: string; // text-emerald-500, etc.
}

export interface Tool {
    id: string;
    name: string;
    icon: string;
    status: ToolStatus;
    description: string;
    specs?: ToolSpec[];
    activityLog?: LogEntry[];
    image?: string;
}

export interface Folder {
    name: string;
    icon: string;
    description: string;
    tools: Tool[];
}

// THE COMMAND CENTER STRUCTURE
export const toolboxFolders: Record<string, Folder> = {
    sales_demos: {
        name: 'Sales & Demos',
        icon: 'sales_demos',
        description: 'Sales Weapons & Live Demos',
        tools: [
            {
                id: 'roi-projector',
                name: 'ROI Projector',
                icon: 'calculator',
                status: 'priority',
                description: 'Real-time "Lost Revenue" calculator to show them exactly what they are losing daily.',
                image: '/images/tools/roi-projector.png',
                specs: [
                    { label: "Dynamic input validation logic", completed: true },
                    { label: "Revenue loss projection algorithm", completed: true },
                    { label: "PDF export generation", completed: false },
                    { label: "Client-side state persistence", completed: true },
                    { label: "Mobile responsive layout", completed: false }
                ],
                activityLog: [
                    { time: "10:42", message: "Updated projection formula vars", color: "text-emerald-500" },
                    { time: "09:15", message: "Fixed layout shift on mobile", color: "text-amber-400" },
                    { time: "08:30", message: "Deploying build v0.4.2", color: "text-zinc-400" }
                ]
            },
            {
                id: 'instant-demo',
                name: 'Instant Agent Demo',
                icon: 'lightning',
                status: 'priority',
                description: 'Spin up a configured voice agent in 30 seconds grounded on their website data.',
                image: '/images/tools/instant-agent.png',
                specs: [
                    { label: "VAPI voice synthesis integration", completed: true },
                    { label: "Website scraping module", completed: true },
                    { label: "LLM context injection", completed: false },
                    { label: "Real-time audio visualization", completed: true },
                ],
                activityLog: [
                    { time: "11:20", message: "VAPI latency reduced to <500ms", color: "text-emerald-500" },
                    { time: "10:05", message: "Scraper hit rate improvements", color: "text-indigo-400" },
                ]
            },
            { id: 'scenario-deck', name: 'Live Scenario Deck', icon: 'theater', status: 'planned', description: 'Trigger specific audio calls: "The Angry Tenant", "The Price Shopper", "The Emergency".' },
            { id: 'competitor-recon', name: 'Competitor Recon', icon: 'search', status: 'priority', description: 'Pull their top competitor\'s reviews and pricing to show them what they are up against.' },
        ]
    },
    agent_config: {
        name: 'Agent Config',
        icon: 'agent_config',
        description: 'Agent Building & Configuration',
        tools: [
            { id: 'prompt-engineer', name: 'Prompt Engineer', icon: 'code', status: 'planned', description: 'Advanced system prompt editor with version control and diffing.' },
            { id: 'voice-lab', name: 'Voice Lab', icon: 'mic', status: 'planned', description: 'Test VAPI voice latency, tone, and filler words in a sandbox.' },
            { id: 'knowledge-base', name: 'Knowledge Base', icon: 'database', status: 'planned', description: 'Upload PDFs, price books, and manuals for the agent to reference (RAG).' },
            { id: 'training-clips', name: 'Training Clips', icon: 'star', status: 'planned', description: 'Save the best/worst calls to fine-tune the model.' },
        ]
    },
    client_mgmt: {
        name: 'Client Management',
        icon: 'client_mgmt',
        description: 'Manage Active Deployments',
        tools: [
            { id: 'client-list', name: 'Client Command', icon: 'building', status: 'planned', description: 'Master list of all active clients. Click to "Impersonate" and view their dashboard.' },
            { id: 'feature-toggles', name: 'Feature Toggles', icon: 'toggle', status: 'planned', description: 'Turn on/off specific modules (e.g. "Review Request") for specific clients.' },
            { id: 'billing-usage', name: 'Billing & Usage', icon: 'credit-card', status: 'planned', description: 'Live view of VAPI minutes used vs. their plan limits.' },
            { id: 'contracts', name: 'Paperwork', icon: 'file', status: 'planned', description: 'Generate and track status of service agreements.' },
        ]
    },
    data_ops: {
        name: 'Data Ops',
        icon: 'ops',
        description: 'Backend & Lead Generation',
        tools: [
            { id: 'lead-harvester', name: 'Lead Harvester', icon: 'scraper', status: 'planned', description: 'Mass scrape leads from Google Maps/Yelp/Angi per zip code.' },
            { id: 'enrichment-queue', name: 'Enrichment Queue', icon: 'sparkles', status: 'planned', description: 'Waterfall lookups for emails/phones on scraped leads.' },
            { id: 'outreach-blaster', name: 'Outreach Blaster', icon: 'send', status: 'planned', description: 'Execute cold email/SMS sequences to the harvested lists.' },
            { id: 'system-status', name: 'System Health', icon: 'chart', status: 'planned', description: 'Monitor worker node uptime, API latency, and error rates.' },
        ]
    },
}

export const statusColors: Record<string, string> = {
    priority: 'text-amber-400 border-amber-500/50 bg-amber-500/10 shadow-[0_0_10px_rgba(251,191,36,0.2)]',
    building: 'text-indigo-400 border-indigo-500/50 bg-indigo-500/10 shadow-[0_0_10px_rgba(99,102,241,0.2)]',
    live: 'text-emerald-400 border-emerald-500/50 bg-emerald-500/10 shadow-[0_0_10px_rgba(16,185,129,0.2)]',
    planned: 'text-zinc-500 border-zinc-700/50 bg-zinc-800/10',
}

export const statusLabels: Record<string, string> = {
    live: 'Live',
    priority: 'In Progress',
    building: 'In Progress',
    planned: 'Backlog'
}
