import ToolboxDashboard from '@/components/ToolboxDashboard'

export default function AdminPage() {
    // Hardcoded dev user for now as seen in original page.tsx
    const user = { email: 'dev@solidframe.ai' }
    return <ToolboxDashboard userEmail={user.email} />
}
