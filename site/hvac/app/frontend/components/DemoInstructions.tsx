'use client';

interface DemoInstructionsProps {
    region: 'south' | 'north';
}

export default function DemoInstructions({ region }: DemoInstructionsProps) {
    const emergencyScript = region === 'south'
        ? "My AC is broken and my 95-year-old grandmother is here. It's over 100 degrees!"
        : "My furnace is broken and it's freezing. My elderly mother is here and I'm worried!";

    const normalScript = region === 'south'
        ? "My AC isn't cooling as well as it used to. Can I schedule a maintenance check?"
        : "My furnace is making a strange noise. Can someone take a look this week?";

    return (
        <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50 space-y-4">
            <div>
                <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    Emergency Script
                </h4>
                <p className="text-xs text-slate-300 bg-slate-900/50 p-3 rounded-lg border border-red-500/20 font-mono">
                    "{emergencyScript}"
                </p>
                <p className="text-[10px] text-slate-500 mt-1">
                    ✓ Triggers SMS to owner • Dispatches technician
                </p>
            </div>

            <div>
                <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Normal Booking Script
                </h4>
                <p className="text-xs text-slate-300 bg-slate-900/50 p-3 rounded-lg border border-blue-500/20 font-mono">
                    "{normalScript}"
                </p>
                <p className="text-[10px] text-slate-500 mt-1">
                    ✓ Books appointment • Sends confirmation
                </p>
            </div>
        </div>
    );
}
