'use client'

import { useState } from 'react'
import { Phone, Settings, BarChart3, Zap, CheckCircle, ArrowRight } from 'lucide-react'
import BusinessSetup from '@/components/BusinessSetup'
import ROICalculator from '@/components/ROICalculator'
import Header from '@/components/Header'
import ExplainerSection from '@/components/ExplainerSection'
import Link from 'next/link'

import LiveCallStatus, { CallStatus } from '@/components/LiveCallStatus'
import { useRealCallWorkflow } from '@/hooks/useRealCallWorkflow'

export default function Home() {
    const [businessConfigured, setBusinessConfigured] = useState(false)
    const [demoPhoneNumber, setDemoPhoneNumber] = useState('+1 (844) 671-3994') // Real Vapi number
    const [businessData, setBusinessData] = useState({
        name: '',
        ownerName: '',
        ownerPhone: '',
    })

    // Real Call Workflow (replaces simulation)
    const { callStatus, transcript, startCallMonitoring } = useRealCallWorkflow(businessData)

    return (
        <main className="min-h-screen bg-slate-50">
            <Header />
            {/* New Premium Explainer Section */}
            <ExplainerSection />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-24">


                {/* ROI Calculator */}
                <div id="roi-calculator" className="scroll-mt-24">
                    <ROICalculator />
                </div>

                {/* Demo Section */}
                <div id="demo-section" className="relative bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-800">
                    {/* Background Effects */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl mix-blend-screen" />
                        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-3xl mix-blend-screen" />
                    </div>

                    <div className="relative p-6 md:p-8">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                                Try It Yourself
                            </h2>
                            <p className="text-base text-slate-400 max-w-2xl mx-auto">
                                Enter your company info and call the AI agent to test it live.
                            </p>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-6 items-start">
                            {/* Business Setup Card */}
                            <div className="bg-white rounded-xl p-5 shadow-xl shadow-black/10 relative z-10">
                                <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-3">
                                    <div className="p-2 bg-slate-100 rounded-lg">
                                        <Settings className="w-4 h-4 text-slate-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-slate-900">
                                            Step 1: Configure Demo
                                        </h3>
                                        <p className="text-xs text-slate-500">
                                            Set up your virtual HVAC company
                                        </p>
                                    </div>
                                </div>

                                <BusinessSetup
                                    data={businessData}
                                    onUpdate={setBusinessData}
                                    onConfigured={() => setBusinessConfigured(true)}
                                    onPhoneNumberSet={setDemoPhoneNumber}
                                />
                            </div>

                            {/* Demo Instructions / Live Call Card */}
                            <div className="h-full min-h-[400px]">
                                {businessConfigured ? (
                                    <LiveCallStatus
                                        phoneNumber={demoPhoneNumber}
                                        status={callStatus}
                                        transcript={transcript}
                                        onStartCall={startCallMonitoring}
                                    />
                                ) : (
                                    <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 h-full flex flex-col items-center justify-center text-center border-dashed min-h-[300px]">
                                        <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-3 shadow-inner">
                                            <Phone className="w-6 h-6 text-slate-600" />
                                        </div>
                                        <h3 className="text-base font-bold text-slate-300 mb-1">Waiting for Configuration</h3>
                                        <p className="text-sm text-slate-500 max-w-xs mx-auto">
                                            Complete the business setup on the left to generate your unique demo phone number.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
