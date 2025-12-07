import Vapi from '@vapi-ai/web'

const vapi = (typeof window !== 'undefined')
    ? new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || 'demo-public-key')
    : null

export const startVapiCall = async (config: {
    systemPrompt?: string,
    voiceId?: string,
    firstMessage?: string
}) => {
    try {
        // In a real implementation with dynamic config, we would fetch an ephemeral key
        // or use the 'assistant-overrides' feature of Vapi.
        // For now, we'll assume we can pass overrides to the start method if the SDK supports it,
        // or we start a call with a specific assistant ID.

        // NOTE: The Basic Vapi Web SDK start method typically takes an Assistant Object or ID.
        if (!vapi) {
            console.warn("Vapi not initialized (SSR or missing key)")
            return
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return await vapi.start({
            model: {
                provider: "openai",
                model: "gpt-4",
                messages: [
                    { role: "system", content: config.systemPrompt || "You are a helpful assistant." }
                ]
            },
            voice: {
                provider: "11labs",
                voiceId: config.voiceId || "josh"
            },
            firstMessage: config.firstMessage
        } as any)
    } catch (error) {
        console.error("Failed to start Vapi call", error)
        throw error
    }
}

export const stopVapiCall = () => {
    vapi?.stop()
}

export const useVapi = () => {
    // Hook implementation to return state (listening, speaking, etc.)
    // This is a placeholder for the actual hook logic
    return vapi
}
