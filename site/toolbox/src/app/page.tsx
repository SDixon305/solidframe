// import { createClient } from '@/utils/supabase/server'
// import { redirect } from 'next/navigation'
import ToolboxDashboard from '@/components/ToolboxDashboard'

export default async function ToolboxHome() {
    // const supabase = createClient()
    // const { data: { user } } = await (await supabase).auth.getUser()

    // if (!user) {
    //   return redirect('/login')
    // }
    const user = { email: 'dev@solidframe.ai' }

    // Pass user details to the client component if needed
    return <ToolboxDashboard userEmail={user.email} />
}
