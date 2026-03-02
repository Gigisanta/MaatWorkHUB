import { pgTable, text, timestamp, boolean, jsonb, decimal, uuid } from 'drizzle-orm/pg-core';

export const tenants = pgTable('tenants', {
  id: text('id').primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  domain: text("domain").unique(), // Custom domain (optional)
  template: text("template", { enum: ["base", "natatorio", "peluqueria"] }).notNull().default("base"),
  config: jsonb('config'),
  githubRepo: text('github_repo'), // e.g., "username/repo"
  vercelProjectId: text('vercel_project_id'),
  vercelUrl: text('vercel_url'),
  isInternal: boolean('is_internal').default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull().references(() => tenants.id),
  email: text('email').unique().notNull(),
  name: text('name'),
  role: text('role').$type<'founder' | 'admin' | 'employee'>().notNull().default('employee'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const clients = pgTable('clients', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull().references(() => tenants.id),
  name: text('name').notNull(),
  phone: text('phone'),
  email: text('email'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const groups = pgTable('groups', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull().references(() => tenants.id),
  name: text('name').notNull(),
  schedule: text('schedule'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const subscriptions = pgTable('subscriptions', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull().references(() => tenants.id),
  clientId: text('client_id').notNull().references(() => clients.id),
  groupId: text('group_id').references(() => groups.id),
  plan: text('plan'),
  status: text('status').$type<'active' | 'inactive'>().default('active'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const attendances = pgTable('attendances', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull().references(() => tenants.id),
  clientId: text('client_id').notNull().references(() => clients.id),
  date: timestamp('date').defaultNow(),
});

export const invoices = pgTable('invoices', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull().references(() => tenants.id),
  clientId: text('client_id').notNull().references(() => clients.id),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  status: text('status').$type<'paid' | 'pending' | 'cancelled'>().default('pending'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const time_entries = pgTable('time_entries', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull().references(() => tenants.id),
  userId: text('user_id').notNull().references(() => users.id),
  clockIn: timestamp('clock_in').defaultNow(),
  clockOut: timestamp('clock_out'),
});

export const whatsapp_messages = pgTable('whatsapp_messages', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull().references(() => tenants.id),
  clientId: text('client_id').notNull().references(() => clients.id),
  message: text('message').notNull(),
  status: text('status').$type<'sent' | 'delivered' | 'read' | 'failed'>().default('sent'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const pricing_plans = pgTable('pricing_plans', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull().references(() => tenants.id),
  name: text('name').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  features: jsonb('features'),
});

export const settings = pgTable('settings', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull().references(() => tenants.id),
  key: text('key').notNull(),
  value: jsonb('value').notNull(),
});

export const activity_logs = pgTable('activity_logs', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull().references(() => tenants.id),
  userId: text('user_id').notNull().references(() => users.id),
  action: text('action').notNull(),
  details: jsonb('details'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const notifications = pgTable('notifications', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull().references(() => tenants.id),
  userId: text('user_id').notNull().references(() => users.id),
  title: text('title').notNull(),
  body: text('body').notNull(),
  read: boolean('read').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// Maatwork Hub -> Tenant Billing
export const tenant_subscriptions = pgTable('tenant_subscriptions', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull().references(() => tenants.id),
  stripeCustomerId: text('stripe_customer_id'),
  stripeSubscriptionId: text('stripe_subscription_id'),
  planId: text('plan_id').notNull(),
  status: text('status').$type<'active' | 'past_due' | 'canceled' | 'trialing'>().default('active'),
  currentPeriodEnd: timestamp('current_period_end'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const tenant_invoices = pgTable('tenant_invoices', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull().references(() => tenants.id),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  currency: text('currency').default('ARS'),
  status: text('status').$type<'paid' | 'open' | 'void' | 'uncollectible'>().default('open'),
  invoiceUrl: text('invoice_url'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const studio_todos = pgTable('studio_todos', {
  id: text('id').primaryKey(),
  text: text('text').notNull(),
  completed: boolean('completed').notNull().default(false),
  priority: text('priority').$type<'low' | 'medium' | 'high'>().notNull().default('medium'),
  dueDate: timestamp('due_date'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const leads = pgTable('leads', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email'),
  company: text('company'),
  status: text('status').$type<'new' | 'contacted' | 'proposal' | 'won' | 'lost'>().notNull().default('new'),
  value: decimal('value', { precision: 10, scale: 2 }),
  notes: text('notes'),
  externalSyncId: text('external_sync_id'), // Integration with HubSpot/Salesforce
  lastSyncedAt: timestamp('last_synced_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const audit_logs = pgTable("audit_logs", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").references(() => tenants.id),
  userId: text("user_id").references(() => users.id),
  action: text("action").notNull(), // e.g., 'lead.exported', 'tenant.status_changed'
  entityType: text("entity_type").notNull(), // e.g., 'leads', 'tenants'
  entityId: text("entity_id"),
  metadata: jsonb("metadata"), // Contextual data: { format: 'csv', count: 50 }
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const analytics_events = pgTable("analytics_events", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").references(() => tenants.id),
  eventType: text("event_type").notNull(), // 'mrr.update', 'session.start', 'feature.usage'
  source: text("source").notNull(), // 'studio', 'tenant-app', 'system'
  value: decimal("value", { precision: 15, scale: 2 }), // Useful for MRR or durations
  metadata: jsonb("metadata"), // { feature: 'billing', duration: 120 }
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

