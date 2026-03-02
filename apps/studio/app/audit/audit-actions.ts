import { db } from "@maatwork/database";
import { audit_logs, tenants, users } from "@maatwork/database/schema";
import { desc, eq, and, sql } from "drizzle-orm";

export async function getAuditLogs(options: { 
  tenantId?: string;
  entityType?: string;
  limit?: number;
} = {}) {
  const query = db
    .select({
      id: audit_logs.id,
      action: audit_logs.action,
      entityType: audit_logs.entityType,
      entityId: audit_logs.entityId,
      metadata: audit_logs.metadata,
      createdAt: audit_logs.createdAt,
      tenantName: tenants.name,
      userName: users.name,
      ipAddress: audit_logs.ipAddress
    })
    .from(audit_logs)
    .leftJoin(tenants, eq(audit_logs.tenantId, tenants.id))
    .leftJoin(users, eq(audit_logs.userId, users.id))
    .orderBy(desc(audit_logs.createdAt))
    .limit(options.limit || 50);

  // Note: Filtering can be expanded here as needed
  
  return await query;
}
