import { Tool, Folder } from './toolbox-data'

// Demo-specific tools available in the client demo portal
export const demoTools: Tool[] = [
    {
        id: 'demo-roi',
        name: 'ROI Calculator',
        icon: 'calculator',
        status: 'live',
        description: 'See exactly how much revenue you\'re leaving on the table with missed calls.',
    },
    {
        id: 'demo-voice-agent',
        name: 'Voice Agent Demo',
        icon: 'mic',
        status: 'live',
        description: 'Experience how our AI receptionist handles calls for your business.',
    },
    {
        id: 'demo-lead-scraper',
        name: 'Lead Scraper',
        icon: 'scraper',
        status: 'live',
        description: 'See potential leads in your service area ready for outreach.',
    },
    {
        id: 'demo-reviews',
        name: 'Review Request Generator',
        icon: 'star',
        status: 'live',
        description: 'Automatically request reviews from satisfied customers via SMS.',
    },
    {
        id: 'demo-competitors',
        name: 'Competitive Analysis',
        icon: 'search',
        status: 'live',
        description: 'See how you stack up against competitors in your area.',
    },
    {
        id: 'demo-calls',
        name: 'Call Dashboard',
        icon: 'chart',
        status: 'live',
        description: 'Real-time view of incoming calls, transcripts, and emergency detection.',
    },
    {
        id: 'demo-training',
        name: 'Technician Training',
        icon: 'star', // Using star for training clips
        status: 'live',
        description: 'Onboard new technicians with AI-powered training scenarios.',
    },
    {
        id: 'demo-scheduler',
        name: 'Appointment Scheduler',
        icon: 'toggle', // Using toggle for scheduler
        status: 'live',
        description: 'Let customers book appointments directly through the AI agent.',
    },
]

// Demo folder structure
export const demoFolders: Record<string, Folder> = {
    demo_tools: {
        name: 'Demo Tools',
        icon: 'sales_demos',
        description: 'Explore what SolidFrame can do for your business',
        tools: demoTools,
    },
}

// Map demo tool IDs to their routes
export const demoToolRoutes: Record<string, string> = {
    'demo-roi': '/client-demo/roi',
    'demo-voice-agent': '/client-demo/voice-agent',
    'demo-lead-scraper': '/client-demo/lead-scraper',
    'demo-reviews': '/client-demo/reviews',
    'demo-competitors': '/client-demo/competitors',
    'demo-calls': '/client-demo/calls',
    'demo-training': '/client-demo/training',
    'demo-scheduler': '/client-demo/scheduler',
}
