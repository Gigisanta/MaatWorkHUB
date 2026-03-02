-- setup-rls.sql
-- Run this script in your Neon SQL console to enable RLS across all app tables.

-- We assume the setting name is 'app.current_app'

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY app_isolation_users ON users USING (app_id = current_setting('app.current_app', true));

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY app_isolation_clients ON clients USING (app_id = current_setting('app.current_app', true));

ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
CREATE POLICY app_isolation_groups ON groups USING (app_id = current_setting('app.current_app', true));

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY app_isolation_subscriptions ON subscriptions USING (app_id = current_setting('app.current_app', true));

ALTER TABLE attendances ENABLE ROW LEVEL SECURITY;
CREATE POLICY app_isolation_attendances ON attendances USING (app_id = current_setting('app.current_app', true));

ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY app_isolation_invoices ON invoices USING (app_id = current_setting('app.current_app', true));

ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY app_isolation_time_entries ON time_entries USING (app_id = current_setting('app.current_app', true));

ALTER TABLE whatsapp_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY app_isolation_whatsapp_messages ON whatsapp_messages USING (app_id = current_setting('app.current_app', true));

ALTER TABLE pricing_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY app_isolation_pricing_plans ON pricing_plans USING (app_id = current_setting('app.current_app', true));

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY app_isolation_settings ON settings USING (app_id = current_setting('app.current_app', true));

ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY app_isolation_activity_logs ON activity_logs USING (app_id = current_setting('app.current_app', true));

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY app_isolation_notifications ON notifications USING (app_id = current_setting('app.current_app', true));
