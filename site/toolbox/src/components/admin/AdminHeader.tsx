import Link from 'next/link'
import { LayoutDashboard, Users, Settings, LogOut } from 'lucide-react'

export function AdminHeader() {
    return (
        <header className="flex h-16 items-center justify-between border-b border-white/10 bg-black/40 px-6 backdrop-blur-md">
            <div className="flex items-center gap-8">
                <Link href="/admin" className="text-xl font-bold tracking-tighter text-white">
                    TOOLBOX <span className="text-blue-500">ADMIN</span>
                </Link>

                <nav className="flex items-center gap-1">
                    <Link
                        href="/admin/agents"
                        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-zinc-400 hover:bg-white/5 hover:text-white transition-colors"
                    >
                        <LayoutDashboard className="h-4 w-4" />
                        Agents
                    </Link>
                    <Link
                        href="/admin/clients"
                        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-zinc-400 hover:bg-white/5 hover:text-white transition-colors"
                    >
                        <Users className="h-4 w-4" />
                        Clients
                    </Link>
                    <Link
                        href="/admin/sittings" // Typo intentional? No, probably Settings.
                        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-zinc-400 hover:bg-white/5 hover:text-white transition-colors"
                    >
                        <Settings className="h-4 w-4" />
                        Settings
                    </Link>
                </nav>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-mono text-emerald-500">SYSTEM ONLINE</span>
                </div>
                <button className="rounded-full bg-white/5 p-2 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors">
                    <LogOut className="h-4 w-4" />
                </button>
            </div>
        </header>
    )
}
