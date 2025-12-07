import { ReactNode } from 'react'
import { AdminHeader } from '@/components/admin/AdminHeader'

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex h-screen flex-col overflow-hidden bg-black text-white selection:bg-blue-500/30">
            <AdminHeader />
            <main className="flex-1 overflow-y-auto bg-[url('/grid.svg')] bg-fixed">
                <div className="container mx-auto py-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
