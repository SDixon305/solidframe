import { ReactNode } from 'react'

export default function PortalLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 flex">
            {/* Simple Client Sidebar */}
            <aside className="w-64 border-r border-zinc-800 p-6">
                <div className="font-bold text-lg mb-8">CLIENT PORTAL</div>
                <nav className="space-y-4">
                    <div className="text-zinc-500 text-sm">Overview</div>
                    <div className="text-zinc-500 text-sm">Call Logs</div>
                    <div className="text-zinc-500 text-sm">Settings</div>
                </nav>
            </aside>
            <main className="flex-1 p-8">
                {children}
            </main>
        </div>
    )
}
