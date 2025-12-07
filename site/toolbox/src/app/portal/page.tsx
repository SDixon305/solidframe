export default function PortalPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">Welcome Back.</h1>
            <p className="text-zinc-400">Your custom agent is active and handling calls.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50">
                    <div className="text-2xl font-bold">24</div>
                    <div className="text-sm text-zinc-500">Calls Today</div>
                </div>
                <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50">
                    <div className="text-2xl font-bold">$1,200</div>
                    <div className="text-sm text-zinc-500">Pipeline Generated</div>
                </div>
                <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50">
                    <div className="text-2xl font-bold text-green-400">Active</div>
                    <div className="text-sm text-zinc-500">Agent Status</div>
                </div>
            </div>
        </div>
    )
}
