'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { Download, TrendingUp, Settings, Phone, CheckCircle2, ArrowRight, AlertTriangle, Lightbulb } from 'lucide-react'

export default function ROICalculator() {
    // --- State: Current State (Column 1) ---
    const [currentProvider, setCurrentProvider] = useState('None (Voicemail)')
    const [weeklyMissedCalls, setWeeklyMissedCalls] = useState(7)
    const [emergencyRate, setEmergencyRate] = useState(40)
    const [avgEmergencyRev, setAvgEmergencyRev] = useState(400)
    const [avgNextDayRev, setAvgNextDayRev] = useState(140)
    const [currentEmergencyCaptureRate, setCurrentEmergencyCaptureRate] = useState(30)
    const [callbackBookingRate, setCallbackBookingRate] = useState(35)

    // --- State: AI Scenario (Column 2) ---
    const [aiCaptureRate, setAiCaptureRate] = useState(100)
    const [aiEmergencyBookingRate, setAiEmergencyBookingRate] = useState(95)
    const [aiNextDayBookingRate, setAiNextDayBookingRate] = useState(85)

    // --- State: Dynamic Insight ---
    const defaultInsight = "It doesn't just take a message. It follows your script to qualify the lead and book the job immediately, stopping them from calling a competitor."
    const [activeInsight, setActiveInsight] = useState(defaultInsight)
    const [isFading, setIsFading] = useState(false)
    const targetInsight = useRef(defaultInsight)

    // --- Effect: Update defaults based on Provider ---
    useEffect(() => {
        if (currentProvider === 'None (Voicemail)') {
            setCurrentEmergencyCaptureRate(30)
            setCallbackBookingRate(35)
        } else if (currentProvider === 'Answering Service') {
            setCurrentEmergencyCaptureRate(60)
            setCallbackBookingRate(55)
        } else if (currentProvider === 'Call Center') {
            setCurrentEmergencyCaptureRate(80)
            setCallbackBookingRate(65)
        }
    }, [currentProvider])

    // --- Calculations ---
    const metrics = useMemo(() => {
        const weeksPerMonth = 4.33
        const monthlyCalls = weeklyMissedCalls * weeksPerMonth
        const monthlyEmergencies = monthlyCalls * (emergencyRate / 100)
        const monthlyNonEmergencies = monthlyCalls * ((100 - emergencyRate) / 100)

        // 1. Current Reality
        const currentRevenueEmergencies = monthlyEmergencies * (currentEmergencyCaptureRate / 100) * avgEmergencyRev
        const currentRevenueNonEmergencies = monthlyNonEmergencies * (callbackBookingRate / 100) * avgNextDayRev
        const currentRevenue = currentRevenueEmergencies + currentRevenueNonEmergencies

        const potentialRevenue = (monthlyEmergencies * avgEmergencyRev) + (monthlyNonEmergencies * avgNextDayRev)
        const currentlyLostRevenue = potentialRevenue - currentRevenue

        // 2. AI Scenario
        const aiCapturedCalls = monthlyCalls * (aiCaptureRate / 100)
        const aiCapturedEmergencies = aiCapturedCalls * (emergencyRate / 100)
        const aiCapturedNonEmergencies = aiCapturedCalls * ((100 - emergencyRate) / 100)

        const aiRevenueEmergencies = aiCapturedEmergencies * (aiEmergencyBookingRate / 100) * avgEmergencyRev
        const aiRevenueNonEmergencies = aiCapturedNonEmergencies * (aiNextDayBookingRate / 100) * avgNextDayRev
        const aiRevenue = aiRevenueEmergencies + aiRevenueNonEmergencies

        // 3. Comparison
        const recoveredRevenue = aiRevenue - currentRevenue

        // Volume-based pricing (threshold: 25 calls/week)
        const isLowVolume = weeklyMissedCalls <= 25

        // Operational Savings
        let currentProviderCost = 0
        let aiCost = 0

        if (isLowVolume) {
            // Low Volume (≤25 calls/week)
            aiCost = 299
            if (currentProvider === 'Answering Service') currentProviderCost = 400
            if (currentProvider === 'Call Center') currentProviderCost = 700
        } else {
            // High Volume (>25 calls/week)
            aiCost = 400
            if (currentProvider === 'Answering Service') currentProviderCost = 410
            if (currentProvider === 'Call Center') currentProviderCost = 1100
        }

        const operationalSavings = currentProviderCost - aiCost

        const monthlyNetGain = recoveredRevenue + operationalSavings
        const annualNetGain = monthlyNetGain * 12
        const annualROI = aiCost > 0 ? (annualNetGain / (aiCost * 12)) * 100 : 0

        return { currentlyLostRevenue, recoveredRevenue, operationalSavings, monthlyNetGain, annualNetGain, annualROI }
    }, [weeklyMissedCalls, emergencyRate, avgEmergencyRev, avgNextDayRev, currentEmergencyCaptureRate, callbackBookingRate, aiCaptureRate, aiEmergencyBookingRate, aiNextDayBookingRate, currentProvider])

    // --- Interaction Handler ---
    const handleValueChange = (setter: (val: any) => void, value: any, insight: string) => {
        setter(value)
        if (targetInsight.current !== insight) {
            targetInsight.current = insight
            setIsFading(true)
            setTimeout(() => {
                setActiveInsight(insight)
                setIsFading(false)
            }, 200)
        }
    }

    const isNegativeSavings = metrics.operationalSavings < 0;

    return (
        <div className="w-full max-w-7xl mx-auto font-sans text-slate-900">
            {/* Header */}
            <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">
                    Calculate Your Revenue Recovery
                </h2>
                <p className="text-slate-600 text-lg">
                    See exactly how much revenue you're losing—and how much you could recover with AI
                </p>
            </div>

            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col lg:flex-row">

                {/* Column 1: Current State (The Problem) */}
                <div className="lg:w-[30%] bg-slate-50/80 p-5 border-r border-slate-200 flex flex-col gap-4 relative group">
                    {/* "Inferior" Indicator */}
                    <div className="absolute top-0 left-0 w-1 h-full bg-red-400/50"></div>

                    <div>
                        <h3 className="text-lg font-bold text-slate-700 flex items-center gap-2">
                            <Settings className="w-5 h-5 text-slate-500" />
                            Current Setup
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">Where are you losing money?</p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1.5">Current Solution</label>
                            <select
                                value={currentProvider}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    let message = "Your provider determines how many leads you burn.";

                                    // Update rates based on provider
                                    if (val === 'None (Voicemail)') {
                                        message = "Voicemail is where leads go to die. 80% of callers hang up immediately.";
                                    }
                                    if (val === 'Answering Service') {
                                        message = "They take messages, not bookings. You still have to play phone tag to get the job.";
                                    }
                                    if (val === 'Call Center') {
                                        message = "They can book, but they cost a fortune and often lack the technical knowledge to triage correctly.";
                                    }

                                    handleValueChange(setCurrentProvider, val, message);
                                }}
                                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none text-slate-700 shadow-sm"
                            >
                                <option>None (Voicemail)</option>
                                <option>Answering Service</option>
                                <option>Call Center</option>
                            </select>
                        </div>

                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-slate-600 font-medium">Avg Missed Calls/Week</span>
                                <span className="font-bold text-slate-900 bg-white px-2 rounded border border-slate-200">{weeklyMissedCalls}</span>
                            </div>
                            <input
                                type="range" min="1" max="50"
                                value={weeklyMissedCalls}
                                onChange={(e) => handleValueChange(setWeeklyMissedCalls, Number(e.target.value), "More missed calls = more revenue gifted to your competitors.")}
                                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-500"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-slate-600 font-medium">% Emergencies</span>
                                <span className="font-bold text-slate-900">{emergencyRate}%</span>
                            </div>
                            <input
                                type="range" min="0" max="100" step="5"
                                value={emergencyRate}
                                onChange={(e) => handleValueChange(setEmergencyRate, Number(e.target.value), "Emergencies are high-value. Missing them is the most expensive mistake.")}
                                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-500"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Emergency Service Fee</label>
                                <div className="relative">
                                    <span className="absolute left-2 top-1.5 text-slate-400 text-xs">$</span>
                                    <input
                                        type="number"
                                        value={avgEmergencyRev}
                                        onChange={(e) => handleValueChange(setAvgEmergencyRev, Number(e.target.value), "The value of a single emergency job.")}
                                        className="w-full bg-white border border-slate-200 rounded px-2 pl-5 py-1 text-sm font-medium outline-none focus:border-red-400"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Routine Service Fee</label>
                                <div className="relative">
                                    <span className="absolute left-2 top-1.5 text-slate-400 text-xs">$</span>
                                    <input
                                        type="number"
                                        value={avgNextDayRev}
                                        onChange={(e) => handleValueChange(setAvgNextDayRev, Number(e.target.value), "The value of a standard maintenance visit.")}
                                        className="w-full bg-white border border-slate-200 rounded px-2 pl-5 py-1 text-sm font-medium outline-none focus:border-red-400"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-200/60 space-y-4 opacity-75 hover:opacity-100 transition-opacity">
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-slate-600">Emergency Dispatch Rate</span>
                                    <span className="font-bold text-red-600">{currentEmergencyCaptureRate}%</span>
                                </div>
                                <input
                                    type="range" min="0" max="100" step="5"
                                    value={currentEmergencyCaptureRate}
                                    onChange={(e) => handleValueChange(setCurrentEmergencyCaptureRate, Number(e.target.value), "Most people hang up on voicemail. You lose 95% of these leads instantly.")}
                                    className="w-full h-1.5 bg-red-100 rounded-lg appearance-none cursor-pointer accent-red-500"
                                />
                            </div>
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-slate-600">Callback Conversion Rate</span>
                                    <span className="font-bold text-red-600">{callbackBookingRate}%</span>
                                </div>
                                <input
                                    type="range" min="0" max="100" step="5"
                                    value={callbackBookingRate}
                                    onChange={(e) => handleValueChange(setCallbackBookingRate, Number(e.target.value), "Phone tag kills deals. Only a fraction of callbacks actually book.")}
                                    className="w-full h-1.5 bg-red-100 rounded-lg appearance-none cursor-pointer accent-red-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Column 2: AI Scenario (The Solution) */}
                <div className="lg:w-[35%] bg-white p-5 relative z-10 shadow-2xl flex flex-col gap-4 border-x border-slate-100 transform lg:scale-[1.02] lg:-my-2 lg:rounded-xl lg:border-y ring-1 ring-black/5">
                    <div>
                        <h3 className="text-lg font-bold text-emerald-900 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-emerald-500" />
                            AI Triage Scenario
                        </h3>
                        <p className="text-xs text-emerald-600/80 mt-1">Superior performance, 24/7.</p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-slate-700 font-medium">AI Answer Rate</span>
                                <span className="font-bold text-emerald-600">{aiCaptureRate}%</span>
                            </div>
                            <input
                                type="range" min="50" max="100"
                                value={aiCaptureRate}
                                onChange={(e) => handleValueChange(setAiCaptureRate, Number(e.target.value), "AI answers instantly, every time. No hold times, no missed calls.")}
                                className="w-full h-1.5 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-slate-700 font-medium">AI Emergency Dispatch</span>
                                <span className="font-bold text-emerald-600">{aiEmergencyBookingRate}%</span>
                            </div>
                            <input
                                type="range" min="50" max="100"
                                value={aiEmergencyBookingRate}
                                onChange={(e) => handleValueChange(setAiEmergencyBookingRate, Number(e.target.value), "AI follows your exact protocol to dispatch emergencies immediately.")}
                                className="w-full h-1.5 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-slate-700 font-medium">AI Next-Day Booking</span>
                                <span className="font-bold text-emerald-600">{aiNextDayBookingRate}%</span>
                            </div>
                            <input
                                type="range" min="50" max="100"
                                value={aiNextDayBookingRate}
                                onChange={(e) => handleValueChange(setAiNextDayBookingRate, Number(e.target.value), "AI books routine maintenance directly to your calendar while you sleep.")}
                                className="w-full h-1.5 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            />
                        </div>
                    </div>

                    {/* Dynamic Insight Box */}
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mt-3 min-h-[110px] flex items-start gap-3 transition-all duration-300 relative overflow-hidden">
                        <Lightbulb className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-900 leading-relaxed z-10">
                            <span className="font-bold block mb-1 text-blue-700">Why is AI better?</span>
                            <span
                                className={`block transition-opacity duration-200 ${isFading ? 'opacity-0' : 'opacity-100'}`}
                            >
                                {activeInsight}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Column 3: Comparison (The Result) */}
                <div className="lg:w-[35%] bg-slate-900 p-6 text-white flex flex-col justify-between relative overflow-hidden">
                    {/* Background Glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                    <div className="space-y-5 relative z-10">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            Comparison
                        </h3>

                        {/* Metric: Lost */}
                        <div className="relative opacity-90 hover:opacity-100 transition-opacity">
                            <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Monthly Revenue Lost</p>
                            <p className="text-3xl font-bold text-red-400">${Math.round(metrics.currentlyLostRevenue).toLocaleString()}</p>
                            <p className="text-[10px] text-red-400/60 mt-1">Money left on the table right now</p>
                        </div>

                        {/* Metric: Recovered */}
                        <div className="relative">
                            <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Monthly Revenue Recovered</p>
                            <p className="text-4xl font-bold text-emerald-400">${Math.round(metrics.recoveredRevenue).toLocaleString()}</p>
                            <p className="text-[10px] text-emerald-400/60 mt-1">New revenue captured by AI</p>
                        </div>

                        {/* Metric: Operational Savings (Highlighted) */}
                        <div className={`rounded-lg p-3 relative overflow-hidden border ${isNegativeSavings ? 'bg-slate-800/40 border-slate-700/50' : 'bg-emerald-900/20 border-emerald-500/30'}`}>
                            <div className={`absolute top-0 left-0 w-1 h-full ${isNegativeSavings ? 'bg-slate-600' : 'bg-emerald-500'}`}></div>
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className={`${isNegativeSavings ? 'text-slate-300' : 'text-emerald-100'} text-xs font-medium`}>Operational Savings</p>
                                    <p className="text-xl font-bold text-white mt-0.5">
                                        {isNegativeSavings ? '-' : '+'}${Math.abs(metrics.operationalSavings)}
                                    </p>
                                </div>
                                {!isNegativeSavings && <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full font-bold">BONUS</span>}
                            </div>
                            <p className={`text-[9px] mt-1 ${isNegativeSavings ? 'text-slate-400' : 'text-emerald-400/70'}`}>
                                {currentProvider === 'Call Center' ? 'Save big vs. expensive call centers.' :
                                    currentProvider === 'Answering Service' ? 'Cheaper than your answering service.' :
                                        'Compared to basic voicemail.'}
                            </p>
                        </div>
                    </div>

                    <div className="border-t border-slate-800 pt-4 mt-3 space-y-3 relative z-10">
                        <div className="flex justify-between items-end">
                            <p className="text-slate-400 text-sm">Monthly Net Gain</p>
                            <p className="text-xl font-bold text-emerald-400">${Math.round(metrics.monthlyNetGain).toLocaleString()}</p>
                        </div>

                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-white font-bold text-lg">Annual Net Gain</p>
                                <p className="text-[10px] text-slate-500">Revenue + Savings - AI Cost</p>
                            </div>
                            <p className="text-3xl font-bold text-emerald-400">${Math.round(metrics.annualNetGain).toLocaleString()}</p>
                        </div>

                        <div className="mt-6 space-y-3">
                            <button
                                onClick={() => {
                                    const demoSection = document.getElementById('demo-section');
                                    if (demoSection) {
                                        demoSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                    }
                                }}
                                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-lg text-base font-bold transition-all shadow-lg shadow-emerald-900/20 hover:shadow-emerald-900/40 transform hover:-translate-y-0.5"
                            >
                                See Your Custom Demo
                            </button>
                            <button className="w-full px-5 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-all border border-slate-700 hover:border-slate-600 flex items-center justify-center gap-2 text-xs font-medium hover:shadow-md transform hover:-translate-y-0.5">
                                <Download className="w-3.5 h-3.5" />
                                Download Report
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
