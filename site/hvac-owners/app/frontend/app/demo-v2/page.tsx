'use client';

import { useState } from 'react';
import DemoConfigForm from '@/components/v2/DemoConfigForm';
import LiveCallMonitor from '@/components/v2/LiveCallMonitor';
import DemoDashboard from '@/components/v2/DemoDashboard';

export default function DemoV2Page() {
    const [step, setStep] = useState<'config' | 'call' | 'dashboard'>('config');
    const [configData, setConfigData] = useState<any>(null);
    const [lastCallData, setLastCallData] = useState<any>(null);

    const handleConfigured = (data: any) => {
        setConfigData(data);
        setStep('call');
    };

    const handleCallComplete = (call: any) => {
        setLastCallData(call);
        setStep('dashboard');
    };

    return (
        <main className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-600/20 rounded-full blur-[120px]"></div>
            </div>

            {/* Header */}
            <header className="relative z-10 w-full p-6 flex justify-between items-center border-b border-white/5 bg-black/50 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center font-bold text-black">
                        D
                    </div>
                    <span className="font-bold text-xl tracking-tight">Diamond Cooling <span className="text-xs font-normal text-gray-500 ml-2 border border-gray-700 px-2 py-0.5 rounded-full">DEMO V2</span></span>
                </div>
                {configData && (
                    <div className="text-sm text-gray-400">
                        Owner: <span className="text-white">{configData.owner_name}</span>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <div className="relative z-10 flex-1 flex items-center justify-center p-6">
                {step === 'config' && (
                    <DemoConfigForm onConfigured={handleConfigured} />
                )}

                {step === 'call' && (
                    <LiveCallMonitor onCallComplete={handleCallComplete} />
                )}

                {step === 'dashboard' && (
                    <DemoDashboard lastCall={lastCallData} />
                )}
            </div>

            {/* Footer */}
            <footer className="relative z-10 p-6 text-center text-gray-600 text-xs">
                HVAC AI Agent Demo • Powered by Vapi
            </footer>
        </main>
    );
}
