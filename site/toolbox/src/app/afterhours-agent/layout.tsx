import { ReactNode } from 'react'

export default function DemoLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen h-full bg-black text-white relative overflow-y-auto">
            {/* Background decoration */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[128px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[128px]" />
            </div>

            <main className="relative z-10 w-full">
                {children}
            </main>
        </div>
    )
}
