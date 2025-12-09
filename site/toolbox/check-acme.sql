-- Check Acme HVAC setup
SELECT 'Tenant:' as type, name, slug, status, created_at FROM tenants WHERE slug = 'acme-hvac'
UNION ALL
SELECT 'Users:' as type, first_name || ' ' || last_name as name, email as slug, role as status, created_at FROM users WHERE tenant_id = (SELECT id FROM tenants WHERE slug = 'acme-hvac')
UNION ALL
SELECT 'Tools:' as type, t.name, t.slug, CASE WHEN tt.is_active THEN 'active' ELSE 'inactive' END as status, tt.created_at 
FROM tenant_tools tt 
JOIN tools t ON tt.tool_id = t.id 
WHERE tt.tenant_id = (SELECT id FROM tenants WHERE slug = 'acme-hvac');
