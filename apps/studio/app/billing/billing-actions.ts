"use server";

import { db } from "@maatwork/database";
import { tenant_invoices, tenants } from "@maatwork/database/schema";
import { sql, eq, desc } from "drizzle-orm";

export async function getGlobalBillingData() {
  const [
    [stats],
    recentInvoices,
    tenantsData
  ] = await Promise.all([
    db.select({
      totalMRR: sql<number>`COALESCE(sum(${tenant_invoices.amount}), 0)`,
      paidCount: sql<number>`count(*) FILTER (WHERE ${tenant_invoices.status} = 'paid')`,
      pendingCount: sql<number>`count(*) FILTER (WHERE ${tenant_invoices.status} = 'open')`
    }).from(tenant_invoices),
    db.select({
      id: tenant_invoices.id,
      amount: tenant_invoices.amount,
      status: tenant_invoices.status,
      createdAt: tenant_invoices.createdAt,
      tenantName: tenants.name
    })
    .from(tenant_invoices)
    .innerJoin(tenants, eq(tenant_invoices.tenantId, tenants.id))
    .orderBy(desc(tenant_invoices.createdAt))
    .limit(10),
    db.select({
      id: tenants.id,
      name: tenants.name,
      mrr: sql<number>`COALESCE((SELECT sum(amount) FROM tenant_invoices WHERE tenant_id = tenants.id AND status = 'paid'), 0)`
    }).from(tenants)
  ]);

  return {
    stats,
    recentInvoices,
    tenants: tenantsData
  };
}
