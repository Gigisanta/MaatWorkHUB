import { db } from './index';
import { tenants, users } from './schema';

async function main() {
  console.log('Seeding initial data...');
  
  // Create HQ Tenant
  await db.insert(tenants).values({
    id: 'maatwork-hq',
    slug: 'studio',
    name: 'Maatwork Studio',
    template: 'natatorio', // Template doesn't matter for HQ
    config: { theme: 'dark' }
  }).onConflictDoNothing();

  await db.insert(users).values({
    id: 'founder-1',
    tenantId: 'maatwork-hq',
    email: 'gio@maatwork.com',
    name: 'Gio',
    role: 'founder'
  }).onConflictDoNothing();

  await db.insert(users).values({
    id: 'founder-2',
    tenantId: 'maatwork-hq',
    email: 'tomi@maatwork.com',
    name: 'Tomi',
    role: 'founder'
  }).onConflictDoNothing();

  // Create Demo Tenants
  await db.insert(tenants).values({
    id: 'demo-natatorio',
    slug: 'natatorio',
    name: 'Natatorio Demo',
    template: 'natatorio',
    config: {}
  }).onConflictDoNothing();

  console.log('Seed completed successfully!');
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
