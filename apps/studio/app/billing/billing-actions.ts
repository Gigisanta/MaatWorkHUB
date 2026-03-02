"use server";

import { db } from "@maatwork/database";
import { app_invoices, apps } from "@maatwork/database/schema";
import { sql, eq, desc } from "drizzle-orm";

export async function getGlobalBillingData() {
  const [
    [stats],
    recentInvoices,
    appsData
  ] = await Promise.all([
    db.select({
      totalMRR: sql<number>`COALESCE(sum(${app_invoices.amount}), 0)`,
      paidCount: sql<number>`count(*) FILTER (WHERE ${app_invoices.status} = 'paid')`,
      pendingCount: sql<number>`count(*) FILTER (WHERE ${app_invoices.status} = 'open')`
    }).from(app_invoices),
    db.select({
      id: app_invoices.id,
      amount: app_invoices.amount,
      status: app_invoices.status,
      createdAt: app_invoices.createdAt,
      appName: apps.name
    })
    .from(app_invoices)
    .innerJoin(apps, eq(app_invoices.appId, apps.id))
    .orderBy(desc(app_invoices.createdAt))
    .limit(10),
    db.select({
      id: apps.id,
      name: apps.name,
      mrr: sql<number>`COALESCE((SELECT sum(amount) FROM app_invoices WHERE app_id = apps.id AND status = 'paid'), 0)`
    }).from(apps)
  ]);

  return {
    stats,
    recentInvoices,
    apps: appsData
  };
}
