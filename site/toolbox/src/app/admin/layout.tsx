import { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { getAuthUser } from '@/lib/supabase-server'
import { AdminLayoutClient } from '@/components/admin/AdminLayoutClient'

export default async function AdminLayout({ children }: { children: ReactNode }) {
    const user = await getAuthUser()

    // Auth check - middleware handles redirect, but double-check here
    if (!user || user.role !== 'super_admin') {
        redirect('/login?error=Access denied. Super admin role required.')
    }

    const userName = user.firstName && user.lastName
        ? `${user.firstName} ${user.lastName}`
        : user.email.split('@')[0]

    return (
        <AdminLayoutClient
            userName={userName}
            userEmail={user.email}
        >
            {children}
        </AdminLayoutClient>
    )
}
