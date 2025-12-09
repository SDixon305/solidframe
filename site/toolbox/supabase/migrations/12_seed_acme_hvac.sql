-- Seed Acme HVAC Services as the first demo client
-- This migration creates a complete tenant setup with all tools activated

DO $$
DECLARE
    acme_tenant_id UUID;
    acme_created_at TIMESTAMPTZ := NOW() - INTERVAL '90 days';
    tool_after_hours UUID;
    tool_textback UUID;
    tool_review UUID;
    tool_appt UUID;
    tool_quote UUID;
    tool_campaign UUID;
    tool_renewal UUID;
    tool_training UUID;
BEGIN
    -- 1. Create Acme HVAC tenant
    INSERT INTO tenants (id, name, slug, status, created_at, updated_at)
    VALUES (
        gen_random_uuid(),
        'Acme HVAC Services',
        'acme-hvac',
        'active',
        acme_created_at,
        acme_created_at
    )
    RETURNING id INTO acme_tenant_id;

    -- 2. Create owner account
    INSERT INTO users (tenant_id, email, role, first_name, last_name, created_at)
    VALUES (
        acme_tenant_id,
        'john@acmehvac.com',
        'admin',
        'John',
        'Smith',
        acme_created_at
    );

    -- 3. Create technician accounts
    INSERT INTO users (tenant_id, email, role, first_name, last_name, created_at)
    VALUES
        (acme_tenant_id, 'trevor@acmehvac.com', 'user', 'Trevor', 'Martinez', acme_created_at),
        (acme_tenant_id, 'mike@acmehvac.com', 'user', 'Mike', 'Johnson', acme_created_at),
        (acme_tenant_id, 'sarah@acmehvac.com', 'user', 'Sarah', 'Chen', acme_created_at),
        (acme_tenant_id, 'dave@acmehvac.com', 'user', 'Dave', 'Wilson', acme_created_at);

    -- 4. Get tool IDs
    SELECT id INTO tool_after_hours FROM tools WHERE slug = 'after-hours-agent';
    SELECT id INTO tool_textback FROM tools WHERE slug = 'missed-call-textback';
    SELECT id INTO tool_review FROM tools WHERE slug = 'review-request-bot';
    SELECT id INTO tool_appt FROM tools WHERE slug = 'appointment-reminders';
    SELECT id INTO tool_quote FROM tools WHERE slug = 'quote-reviver';
    SELECT id INTO tool_campaign FROM tools WHERE slug = 'seasonal-campaigns';
    SELECT id INTO tool_renewal FROM tools WHERE slug = 'maintenance-renewal';
    SELECT id INTO tool_training FROM tools WHERE slug = 'tech-training';

    -- 5. Activate all 8 tools for Acme
    INSERT INTO tenant_tools (tenant_id, tool_id, is_active, activated_at, created_at)
    VALUES
        (acme_tenant_id, tool_after_hours, true, acme_created_at + INTERVAL '1 hour', acme_created_at),
        (acme_tenant_id, tool_textback, true, acme_created_at + INTERVAL '2 hours', acme_created_at),
        (acme_tenant_id, tool_review, true, acme_created_at + INTERVAL '2 hours', acme_created_at),
        (acme_tenant_id, tool_appt, true, acme_created_at + INTERVAL '3 hours', acme_created_at),
        (acme_tenant_id, tool_quote, true, acme_created_at + INTERVAL '3 hours', acme_created_at),
        (acme_tenant_id, tool_campaign, true, acme_created_at + INTERVAL '4 hours', acme_created_at),
        (acme_tenant_id, tool_renewal, true, acme_created_at + INTERVAL '4 hours', acme_created_at),
        (acme_tenant_id, tool_training, true, acme_created_at + INTERVAL '5 hours', acme_created_at);

    -- 6. Configure After Hours Agent tool
    INSERT INTO tenant_tool_configs (tenant_id, tool_id, config, created_at)
    VALUES (
        acme_tenant_id,
        tool_after_hours,
        jsonb_build_object(
            'businessName', 'Acme HVAC Services',
            'businessHours', jsonb_build_object(
                'start', '07:00',
                'end', '18:00',
                'timezone', 'America/Phoenix',
                'daysOfWeek', array['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
            ),
            'saturdayHours', jsonb_build_object(
                'start', '08:00',
                'end', '14:00'
            ),
            'emergencyPhone', '(602) 555-0101',
            'emergencyRate', 150,
            'emergencyMinimum', 89,
            'address', '123 Main Street, Phoenix, AZ 85001',
            'serviceArea', 'Phoenix metro area (85001-85099)',
            'voiceId', 'nova',
            'voiceName', 'Nova',
            'greeting', 'Thanks for calling Acme HVAC Services! I''m the AI assistant. I can help you schedule appointments, answer questions, or connect you with our team for emergencies. How can I help you today?',
            'emergencyKeywords', array['gas leak', 'no heat', 'no AC', 'no air', 'flooding', 'emergency', 'urgent', 'smell gas']
        ),
        acme_created_at
    );

    -- 7. Configure Missed Call Text-Back tool
    INSERT INTO tenant_tool_configs (tenant_id, tool_id, config, created_at)
    VALUES (
        acme_tenant_id,
        tool_textback,
        jsonb_build_object(
            'enabled', true,
            'messageTemplate', 'Hi {name}! Sorry we missed your call at Acme HVAC. We''re available Mon-Fri 7am-6pm, Sat 8am-2pm. For emergencies call (602) 555-0101. How can we help you?',
            'responseWindowSeconds', 30,
            'onlyDuringBusinessHours', false
        ),
        acme_created_at
    );

    -- 8. Configure Review Request Bot tool
    INSERT INTO tenant_tool_configs (tenant_id, tool_id, config, created_at)
    VALUES (
        acme_tenant_id,
        tool_review,
        jsonb_build_object(
            'messageTemplate', 'Hi {name}! Thanks for choosing Acme HVAC for your {serviceType}. We''d love your feedback! Please leave us a review: {reviewLink}',
            'reviewUrl', 'https://g.page/r/acme-hvac-phoenix-reviews',
            'hoursDelayBeforeSending', 4,
            'reviewPlatforms', jsonb_build_object(
                'google', jsonb_build_object('enabled', true, 'url', 'https://g.page/r/acme-hvac-phoenix-reviews'),
                'facebook', jsonb_build_object('enabled', false),
                'yelp', jsonb_build_object('enabled', false)
            )
        ),
        acme_created_at
    );

    -- 9. Configure Appointment Reminders tool
    INSERT INTO tenant_tool_configs (tenant_id, tool_id, config, created_at)
    VALUES (
        acme_tenant_id,
        tool_appt,
        jsonb_build_object(
            'dayBefore', true,
            'twoHoursBefore', true,
            'dayBeforeTemplate', 'Hi {name}! This is a reminder about your {serviceType} appointment with Acme HVAC tomorrow at {time}. We''ll see you at {address}. Reply YES to confirm.',
            'twoHourTemplate', 'Hi {name}! Your Acme HVAC technician will arrive in about 2 hours for your {serviceType} appointment. See you soon!',
            'allowTextConfirmations', true,
            'autoRescheduleLink', false
        ),
        acme_created_at
    );

    -- 10. Configure Quote Reviver tool
    INSERT INTO tenant_tool_configs (tenant_id, tool_id, config, created_at)
    VALUES (
        acme_tenant_id,
        tool_quote,
        jsonb_build_object(
            'sequenceSteps', jsonb_build_array(
                jsonb_build_object('enabled', true, 'delayDays', 1, 'type', 'sms', 'template', 'Hi {name}, John from Acme HVAC here. Just wanted to check if you had any questions about the {serviceType} quote we sent for ${amount}?'),
                jsonb_build_object('enabled', true, 'delayDays', 3, 'type', 'email', 'template', 'Hi {name}, following up on your quote for {serviceType}. We''d love to earn your business!'),
                jsonb_build_object('enabled', true, 'delayDays', 7, 'type', 'call', 'template', 'Personal call from sales team'),
                jsonb_build_object('enabled', false, 'delayDays', 14, 'type', 'email', 'template', 'Final follow-up')
            )
        ),
        acme_created_at
    );

    -- 11. Configure Seasonal Campaigns tool
    INSERT INTO tenant_tool_configs (tenant_id, tool_id, config, created_at)
    VALUES (
        acme_tenant_id,
        tool_campaign,
        jsonb_build_object(
            'availableVariables', array['customer_name', 'quote_amount', 'company_name', 'company_phone', 'service_type']
        ),
        acme_created_at
    );

    -- 12. Configure Maintenance Renewal tool
    INSERT INTO tenant_tool_configs (tenant_id, tool_id, config, created_at)
    VALUES (
        acme_tenant_id,
        tool_renewal,
        jsonb_build_object(
            'reminderSettings', jsonb_build_object(
                'sendReminderBefore', 30,
                'includeAutoRenewal', true,
                'escalationAfterDays', 7
            ),
            'messageTemplate', 'Hi {name}! Your Acme HVAC maintenance agreement expires on {expiryDate}. Renew now to keep your system running smoothly: {renewalLink}'
        ),
        acme_created_at
    );

    -- 13. Configure Tech Training tool (no specific config needed)
    INSERT INTO tenant_tool_configs (tenant_id, tool_id, config, created_at)
    VALUES (
        acme_tenant_id,
        tool_training,
        jsonb_build_object(),
        acme_created_at
    );

    -- 14. Mark onboarding complete
    INSERT INTO onboarding_progress (
        tenant_id,
        current_step,
        completed_steps,
        is_complete,
        started_at,
        completed_at,
        data,
        created_at,
        updated_at
    )
    VALUES (
        acme_tenant_id,
        'complete',
        ARRAY['welcome', 'business_info', 'team_setup', 'business_hours', 'service_area', 'pricing', 'phone_number', 'ai_voice', 'test_call', 'complete'],
        true,
        acme_created_at,
        acme_created_at + INTERVAL '2 hours',
        jsonb_build_object(
            'businessName', 'Acme HVAC Services',
            'ownerName', 'John Smith',
            'address', '123 Main Street, Phoenix, AZ 85001',
            'phone', '(602) 555-0100',
            'industry', 'HVAC',
            'businessType', 'hvac',
            'serviceArea', 'Phoenix metro area',
            'zipCodes', array['85001', '85002', '85003', '85004', '85006', '85007', '85008', '85009', '85012', '85013', '85014', '85015', '85016', '85017', '85018', '85019', '85020', '85021'],
            'teamSize', 4,
            'emergencyRate', 150,
            'minimumCharge', 89
        ),
        acme_created_at,
        acme_created_at + INTERVAL '2 hours'
    );

    -- 15. Create subscription record
    INSERT INTO subscriptions (
        tenant_id,
        status,
        current_period_start,
        current_period_end,
        trial_end,
        created_at,
        updated_at
    )
    VALUES (
        acme_tenant_id,
        'active',
        acme_created_at + INTERVAL '14 days',
        NOW() + INTERVAL '30 days',
        acme_created_at + INTERVAL '14 days',
        acme_created_at,
        acme_created_at
    );

    RAISE NOTICE 'Acme HVAC Services (%) successfully seeded!', acme_tenant_id;

END $$;
