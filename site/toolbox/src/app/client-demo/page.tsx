'use client'

import { DashboardLayout, Header, Sidebar, ToolGrid } from '@/components/shared'
import { useDemoContext } from '@/lib/demo-context'
import { demoFolders, demoToolRoutes, demoTools } from '@/lib/demo-tools'
import { Sparkles } from 'lucide-react'

export default function ClientDemoPage() {
    const { ownerName, businessName } = useDemoContext()

    // Custom header with personalization
    const PersonalizedHeader = () => (
        <header className="min-h-[56px] md:h-16 border-b border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 md:px-6 py-3 sm:py-0 bg-white gap-2 sm:gap-0">
            <div className="flex items-center gap-3 md:gap-4">
                <div className="p-2 md:p-2.5 rounded-lg bg-[#5f3bff]/10 border border-[#5f3bff]/20 hidden sm:block">
                    <Sparkles size={22} className="text-[#5f3bff]" />
                </div>
                <div>
                    <h2 className="text-base md:text-xl font-semibold text-gray-900">
                        Welcome, {businessName}
                    </h2>
                    <p className="text-xs md:text-sm text-gray-500">
                        Explore what SolidFrame can do for {ownerName}
                    </p>
                </div>
            </div>

            {/* Demo Mode Badge */}
            <div className="flex items-center gap-3">
                <div className="px-2.5 py-1 md:px-3 md:py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-600 text-[10px] md:text-xs font-medium">
                    Demo Mode
                </div>
            </div>
        </header>
    )

    // Simplified sidebar for demo (no folder navigation)
    const DemoSidebar = () => (
        <Sidebar
            folders={demoFolders}
            activeFolder="demo_tools"
            brandName="SolidFrame"
            hideNav={true}
            footerContent={
                <div className="p-3 border-t border-gray-200">
                    <div className="p-4 rounded-md bg-gray-50">
                        <p className="text-xs text-gray-500 mb-3">
                            Ready to get started?
                        </p>
                        <a
                            href="https://solidframe.ai"
                            className="block w-full text-center px-4 py-2 bg-[#5f3bff] text-white rounded-md font-medium text-sm hover:bg-[#4f2fe0] transition-colors"
                        >
                            Contact Sales
                        </a>
                    </div>
                </div>
            }
        />
    )

    return (
        <DashboardLayout
            sidebar={<DemoSidebar />}
            header={<PersonalizedHeader />}
        >
            <ToolGrid
                tools={demoTools}
                folderId="sales_demos"
                getLinkOverride={(tool) => demoToolRoutes[tool.id]}
                getActionLabel={() => 'Explore'}
            />
        </DashboardLayout>
    )
}
