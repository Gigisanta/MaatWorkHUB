-- setup-rls.sql
-- Run this script in your Neon SQL console to enable RLS across all tenant tables.

-- We assume the setting name is 'app.current_tenant'

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_users ON users USING (tenant_id = current_setting('app.current_tenant', true));

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_clients ON clients USING (tenant_id = current_setting('app.current_tenant', true));

ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_groups ON groups USING (tenant_id = current_setting('app.current_tenant', true));

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_subscriptions ON subscriptions USING (tenant_id = current_setting('app.current_tenant', true));

ALTER TABLE attendances ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_attendances ON attendances USING (tenant_id = current_setting('app.current_tenant', true));

ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_invoices ON invoices USING (tenant_id = current_setting('app.current_tenant', true));

ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_time_entries ON time_entries USING (tenant_id = current_setting('app.current_tenant', true));

ALTER TABLE whatsapp_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_whatsapp_messages ON whatsapp_messages USING (tenant_id = current_setting('app.current_tenant', true));

ALTER TABLE pricing_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_pricing_plans ON pricing_plans USING (tenant_id = current_setting('app.current_tenant', true));

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_settings ON settings USING (tenant_id = current_setting('app.current_tenant', true));

ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_activity_logs ON activity_logs USING (tenant_id = current_setting('app.current_tenant', true));

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_notifications ON notifications USING (tenant_id = current_setting('app.current_tenant', true));
