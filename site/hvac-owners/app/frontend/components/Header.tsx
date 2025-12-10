import Link from 'next/link'
import { Phone, ArrowRight } from 'lucide-react'

export default function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo Section */}
                    <Link href="/" className="flex items-center gap-3 group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="/logo.png"
                            alt="Solid Frame Logo"
                            className="h-20 w-auto object-contain filter invert"
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        <Link href="#how-it-works" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                            How It Works
                        </Link>
                        <Link href="#roi-calculator" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                            ROI Calculator
                        </Link>
                        <Link href="#demo-section" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                            Live Demo
                        </Link>
                    </nav>

                    {/* Right Section: Phone & CTA */}
                    <div className="flex items-center gap-6">
                        <a
                            href="tel:5614314060"
                            className="hidden lg:flex items-center gap-2 text-slate-300 hover:text-white transition-colors group"
                        >
                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                                <Phone className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-medium">561 431 4060</span>
                        </a>

                        <a
                            href="https://calendly.com/seth-solidframe/30min"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hidden sm:flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:shadow-lg hover:shadow-blue-500/25"
                        >
                            Schedule Demo
                            <ArrowRight className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </div>
        </header>
    )
}
