import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Demo link logging - analytics for tracking generated links
export interface DemoLinkRecord {
    owner_name: string | null
    business_name: string | null
    token: string
    expires_at: string
    created_by?: string
}

export async function logDemoLink(record: DemoLinkRecord): Promise<{ success: boolean; error?: string }> {
    try {
        // Skip if Supabase is not configured (dev environment)
        if (!supabaseUrl || !supabaseAnonKey) {
            console.warn('Supabase not configured, skipping demo link logging')
            return { success: true }
        }

        const { error } = await supabase
            .from('demo_links')
            .insert([record])

        if (error) {
            console.error('Failed to log demo link:', error)
            return { success: false, error: error.message }
        }

        return { success: true }
    } catch (err) {
        console.error('Failed to log demo link:', err)
        return { success: false, error: 'Failed to connect to database' }
    }
}
