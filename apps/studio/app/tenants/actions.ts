"use server";

import { z } from "zod";
import { founderActionClient } from "@maatwork/auth/safe-action";
import { db } from "@maatwork/database";
import { tenants, users, pricing_plans, tenant_subscriptions, activity_logs } from "@maatwork/database/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const createTenantSchema = z.object({
  name: z.string().min(2, "Nombre muy corto"),
  slug: z.string().min(3, "Subdominio muy corto").regex(/^[a-z0-9-]+$/),
  template: z.enum(["base", "natatorio", "peluqueria"]),
  githubRepo: z.string().optional(),
  vercelProjectId: z.string().optional(),
  vercelUrl: z.string().optional(),
  isInternal: z.boolean().default(false),
});

export const createTenantAction = founderActionClient
  .schema(createTenantSchema)
  .action(async ({ parsedInput: { name, slug, template, githubRepo, vercelProjectId, vercelUrl, isInternal } }) => {
    // 1. Validate Uniqueness
    const existing = await db.query.tenants.findFirst({
        where: (t, { eq }) => eq(t.slug, slug)
    });
    
    if (existing) {
        throw new Error("El subdominio ya está en uso.");
    }

    const tenantId = crypto.randomUUID();

    // 2. ACID Transaction for Core Onboarding
    await db.transaction(async (tx) => {
      // Create Tenant
      await tx.insert(tenants).values({
        id: tenantId,
        name,
        slug,
        template,
        githubRepo,
        vercelProjectId,
        vercelUrl,
        isInternal,
      });

      // Auto-create HQ Admin for this tenant (using a system/placeholder email for now)
      const adminId = crypto.randomUUID();
      await tx.insert(users).values({
        id: adminId,
        tenantId: tenantId,
        email: `admin@${slug}.maat.work`,
        name: `Admin ${name}`,
        role: "admin",
      });

      // Seed Default Pricing based on template
      const defaultPrice = template === "natatorio" ? "45000" : "25000";
      await tx.insert(pricing_plans).values({
        id: crypto.randomUUID(),
        tenantId: tenantId,
        name: "Plan Initial",
        price: defaultPrice,
        features: { onboarding: true, priority: "normal" }
      });

      // Set initial subscription status
      await tx.insert(tenant_subscriptions).values({
        id: crypto.randomUUID(),
        tenantId: tenantId,
        planId: "pro_yearly",
        status: "active",
      });

      // Log the event
      await tx.insert(activity_logs).values({
        id: crypto.randomUUID(),
        tenantId: tenantId,
        userId: adminId, // Initially attributed to the new admin
        action: "TENANT_LAUNCHED",
        details: { name, template, timestamp: new Date().toISOString() }
      });
    });

    console.log(`[FOUNDER ENGINE] Center ${slug} successfully launched and seeded.`);

    revalidatePath("/tenants");
    redirect("/tenants");
  });
const toggleTenantStatusSchema = z.object({
  tenantId: z.string(),
  currentStatus: z.enum(["active", "past_due", "canceled", "trialing"]),
});

export const toggleTenantStatusAction = founderActionClient
  .schema(toggleTenantStatusSchema)
  .action(async ({ parsedInput: { tenantId, currentStatus } }) => {
    const newStatus = currentStatus === "active" ? "canceled" : "active";
    
    await db.update(tenant_subscriptions)
      .set({ status: newStatus })
      .where(eq(tenant_subscriptions.tenantId, tenantId));

    await db.insert(activity_logs).values({
      id: crypto.randomUUID(),
      tenantId: tenantId,
      action: newStatus === "active" ? "TENANT_RESUMED" : "TENANT_PAUSED",
      details: { timestamp: new Date().toISOString() }
    });

    revalidatePath("/tenants");
    return { success: true, newStatus };
  });

const updateProjectHubSchema = z.object({
  tenantId: z.string(),
  githubRepo: z.string().optional(),
  vercelProjectId: z.string().optional(),
  vercelUrl: z.string().optional(),
});

export const updateProjectHubAction = founderActionClient
  .schema(updateProjectHubSchema)
  .action(async ({ parsedInput: { tenantId, githubRepo, vercelProjectId, vercelUrl } }) => {
    await db.update(tenants)
      .set({
        githubRepo,
        vercelProjectId,
        vercelUrl,
      })
      .where(eq(tenants.id, tenantId));

    await db.insert(activity_logs).values({
      id: crypto.randomUUID(),
      tenantId: tenantId,
      action: "PROJECT_HUB_LINKED",
      details: { githubRepo, vercelProjectId, timestamp: new Date().toISOString() }
    });

    revalidatePath(`/tenants/${tenantId}`);
    return { success: true };
  });
