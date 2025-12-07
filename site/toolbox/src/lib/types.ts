export type Trade = 'hvac' | 'plumbing' | 'electrical' | 'roofing'

export interface AgentConfig {
    id: string
    org_id: string
    trade: Trade
    name: string
    system_prompt: string
    voice_id: string
    first_message: string
    is_active: boolean
    updated_at?: string
}

export interface ClientOrg {
    id: string
    slug: string // e.g. 'trinity-cooling'
    name: string
    status: 'active' | 'inactive' | 'demo'
    trade: Trade
    config: AgentConfig
}

// Default configuration helpers
export const DEFAULT_PROMPTS: Record<Trade, string> = {
    hvac: "You are a friendly dispatch agent for an HVAC company. Your goal is to book an appointment.",
    plumbing: "You are a knowledgeable plumbing dispatcher. Ask about the leak severity.",
    electrical: "You are an electrical service coordinator. Prioritize safety and immediate hazards.",
    roofing: "You are a roofing intake specialist. Ask about storm damage and insurance claims."
}

export const DEFAULT_VOICES: Record<Trade, string> = {
    hvac: "josh",
    plumbing: "josh",
    electrical: "josh",
    roofing: "josh"
}
