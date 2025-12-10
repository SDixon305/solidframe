#!/usr/bin/env node

/**
 * Vapi Assistant Full Configuration Update Script
 * Updates a Vapi assistant with complete configuration including:
 * - System prompt (with dynamic business name from Supabase)
 * - First message
 * - Voice settings
 * - Tools
 * - All other settings
 *
 * Usage: node update_full_assistant.js <ASSISTANT_ID> <API_KEY>
 *
 * The script fetches the active business name from Supabase demo_sessions
 * and replaces {{BUSINESS_NAME}} placeholders in the config.
 */

const fs = require('fs');
const path = require('path');

// Supabase configuration
const SUPABASE_URL = 'https://igitbonjrlksxeamqwjj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlnaXRib25qcmxrc3hlYW1xd2pqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5MTc4OTAsImV4cCI6MjA3OTQ5Mzg5MH0.0MEwVkz_eXXfR61VRnKrQtTKbTmyW0h5l76L_EjUzU8';

// Check command line arguments
if (process.argv.length !== 4) {
    console.error('Usage: node update_full_assistant.js <ASSISTANT_ID> <API_KEY>');
    console.error('Example: node update_full_assistant.js asst_abc123 your-api-key-here');
    process.exit(1);
}

const ASSISTANT_ID = process.argv[2];
const API_KEY = process.argv[3];

// Read the full configuration from the JSON file
const configFilePath = path.join(__dirname, 'VAPI_ASSISTANT_FULL_CONFIG.json');
const trainingNotesPath = path.join(__dirname, 'TRAINING_NOTES.md');

async function getBusinessNameFromSupabase() {
    try {
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/demo_sessions?is_active=eq.true&select=business_name&limit=1`,
            {
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`
                }
            }
        );

        if (response.ok) {
            const sessions = await response.json();
            if (sessions && sessions.length > 0 && sessions[0].business_name) {
                return sessions[0].business_name;
            }
        }
        console.log('⚠️ No active demo session found, using default business name');
        return 'HVAC Company'; // Default fallback
    } catch (error) {
        console.error('⚠️ Could not fetch from Supabase:', error.message);
        return 'HVAC Company'; // Default fallback
    }
}

function replaceBusinessName(obj, businessName) {
    if (typeof obj === 'string') {
        return obj.replace(/\{\{BUSINESS_NAME\}\}/g, businessName);
    }
    if (Array.isArray(obj)) {
        return obj.map(item => replaceBusinessName(item, businessName));
    }
    if (obj !== null && typeof obj === 'object') {
        const newObj = {};
        for (const key in obj) {
            newObj[key] = replaceBusinessName(obj[key], businessName);
        }
        return newObj;
    }
    return obj;
}

async function main() {
    // 1. Fetch business name from Supabase
    console.log('📡 Fetching active business name from Supabase...');
    const businessName = await getBusinessNameFromSupabase();
    console.log(`✓ Business name: ${businessName}`);

    // 2. Load config file
    let config;
    try {
        const configData = fs.readFileSync(configFilePath, 'utf8');
        config = JSON.parse(configData);
        console.log(`✓ Loaded config template from VAPI_ASSISTANT_FULL_CONFIG.json`);
    } catch (error) {
        console.error('Error reading VAPI_ASSISTANT_FULL_CONFIG.json:', error.message);
        process.exit(1);
    }

    // 3. Replace {{BUSINESS_NAME}} placeholders
    config = replaceBusinessName(config, businessName);
    console.log(`✓ Replaced {{BUSINESS_NAME}} placeholders with "${businessName}"`);

    // 4. Read and append training notes if they exist
    try {
        if (fs.existsSync(trainingNotesPath)) {
            const trainingNotes = fs.readFileSync(trainingNotesPath, 'utf8');
            const contentMatch = trainingNotes.match(/---\n\n([\s\S]*?)\n---\n\n## How This Works/);

            if (contentMatch && contentMatch[1].trim()) {
                const notesContent = contentMatch[1].trim();
                const hasRealContent = notesContent.split('\n').some(line =>
                    line.startsWith('- ') && !line.includes('Example:')
                );

                if (hasRealContent) {
                    config.model.systemPrompt += `\n\nADDITIONAL TRAINING NOTES:\n${notesContent}`;
                    console.log(`✓ Loaded training notes from TRAINING_NOTES.md`);
                } else {
                    console.log(`ℹ TRAINING_NOTES.md exists but has no custom notes yet`);
                }
            }
        }
    } catch (error) {
        console.log(`ℹ No training notes found (${error.message})`);
    }

    // 5. Show preview
    console.log('\n📤 Updating Vapi Assistant:', ASSISTANT_ID);
    console.log('  - Name:', config.name);
    console.log('  - First Message:', config.firstMessage);
    console.log('  - System Prompt (first 100 chars):', config.model?.systemPrompt?.substring(0, 100) + '...');

    // 6. Update Vapi
    try {
        const response = await fetch(`https://api.vapi.ai/assistant/${ASSISTANT_ID}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify(config)
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('❌ Error updating assistant:');
            console.error('Status:', response.status);
            console.error('Response:', JSON.stringify(data, null, 2));
            process.exit(1);
        }

        console.log('\n✅ Assistant updated successfully!');
        console.log(`  - ID: ${data.id}`);
        console.log(`  - Name: ${data.name}`);
        console.log(`  - First Message: ${data.firstMessage}`);
        console.log(`  - Tools: ${data.model?.tools?.length || 0}`);

        console.log('\n🎉 Your assistant is now ready to answer calls as:');
        console.log(`   "${businessName}"`);

    } catch (error) {
        console.error('❌ Error making API request:', error.message);
        process.exit(1);
    }
}

main();
