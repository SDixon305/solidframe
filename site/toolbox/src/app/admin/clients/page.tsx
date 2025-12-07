import { ExternalLink, Edit2, MoreHorizontal } from 'lucide-react'

export default function ClientManager() {
    const clients = [
        { id: 1, name: "Trinity Cooling", subdomain: "trinity", trade: "HVAC", status: "Active", users: 4, lastActive: "10m ago" },
        { id: 2, name: "Sparky's Electric", subdomain: "sparkys", trade: "Electrical", status: "Trial", users: 1, lastActive: "2d ago" },
        { id: 3, name: "Apex Roofing", subdomain: "apex-roofing", trade: "Roofing", status: "Onboarding", users: 0, lastActive: "-" },
    ]

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Client Command</h1>
                    <p className="text-zinc-500">Manage active deployments and subdomains.</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium shadow-lg shadow-blue-500/20 transition-all">
                    + Provision Client
                </button>
            </div>

            <div className="grid gap-4">
                {clients.map((client) => (
                    <div key={client.id} className="group flex items-center justify-between p-6 bg-zinc-900/50 border border-white/5 hover:border-white/10 rounded-xl transition-all hover:bg-zinc-900/80">
                        <div className="flex items-center gap-6">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg 
                                ${client.trade === 'HVAC' ? 'bg-blue-500/10 text-blue-500' :
                                    client.trade === 'Electrical' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-orange-500/10 text-orange-500'}`}>
                                {client.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-white group-hover:text-blue-200 transition-colors">{client.name}</h3>
                                <div className="flex items-center gap-2 text-sm text-zinc-500 font-mono">
                                    <span>{client.subdomain}.toolbox.solidframe.ai</span>
                                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-12">
                            <div className="text-right">
                                <div className="text-xs uppercase text-zinc-600 font-bold mb-1">Trade</div>
                                <div className={`text-sm font-medium ${client.trade === 'HVAC' ? 'text-blue-400' :
                                        client.trade === 'Electrical' ? 'text-yellow-400' : 'text-orange-400'
                                    }`}>{client.trade}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs uppercase text-zinc-600 font-bold mb-1">Status</div>
                                <div className="flex items-center justify-end gap-2">
                                    <div className={`w-2 h-2 rounded-full ${client.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-500'}`} />
                                    <span className="text-sm text-zinc-300">{client.status}</span>
                                </div>
                            </div>
                            <button className="p-2 hover:bg-white/10 rounded-lg text-zinc-500 hover:text-white transition-colors">
                                <MoreHorizontal className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
