"use server";

import { z } from "zod";
import { founderActionClient } from "@maatwork/auth/safe-action";
import { db } from "@maatwork/database";
import { apps, users, pricing_plans, app_subscriptions, activity_logs } from "@maatwork/database/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const createAppSchema = z.object({
  name: z.string().min(2, "Nombre muy corto"),
  slug: z.string().min(3, "Subdominio muy corto").regex(/^[a-z0-9-]+$/),
  template: z.enum(["base", "natatorio", "peluqueria"]),
  githubRepo: z.string().optional(),
  vercelProjectId: z.string().optional(),
  vercelUrl: z.string().optional(),
  neonUrl: z.string().optional(),
  isInternal: z.boolean().default(false),
});

export const createAppAction = founderActionClient
  .schema(createAppSchema)
  .action(async ({ parsedInput: { name, slug, template, githubRepo, vercelProjectId, vercelUrl, neonUrl, isInternal } }) => {
    // 1. Validate Uniqueness
    const existing = await db.query.apps.findFirst({
        where: (t, { eq }) => eq(t.slug, slug)
    });
    
    if (existing) {
        throw new Error("El subdominio ya está en uso.");
    }

    const appId = crypto.randomUUID();

    // 2. ACID Transaction for Core Onboarding
    await db.transaction(async (tx) => {
      // Create App
      await tx.insert(apps).values({
        id: appId,
        name,
        slug,
        template,
        githubRepo,
        vercelProjectId,
        vercelUrl,
        neonUrl,
        isInternal,
      });

      // Auto-create HQ Admin for this app (using a system/placeholder email for now)
      const adminId = crypto.randomUUID();
      await tx.insert(users).values({
        id: adminId,
        appId: appId,
        email: `admin@${slug}.maat.work`,
        name: `Admin ${name}`,
        role: "admin",
      });

      // Seed Default Pricing based on template
      const defaultPrice = template === "natatorio" ? "45000" : "25000";
      await tx.insert(pricing_plans).values({
        id: crypto.randomUUID(),
        appId: appId,
        name: "Plan Initial",
        price: defaultPrice,
        features: { onboarding: true, priority: "normal" }
      });

      // Set initial subscription status
      await tx.insert(app_subscriptions).values({
        id: crypto.randomUUID(),
        appId: appId,
        planId: "pro_yearly",
        status: "active",
      });

      // Log the event
      await tx.insert(activity_logs).values({
        id: crypto.randomUUID(),
        appId: appId,
        userId: adminId, // Initially attributed to the new admin
        action: "APP_LAUNCHED",
        details: { name, template, timestamp: new Date().toISOString() }
      });
    });

    console.log(`[FOUNDER ENGINE] Center ${slug} successfully launched and seeded.`);

    revalidatePath("/apps");
    redirect("/apps");
  });
const toggleAppStatusSchema = z.object({
  appId: z.string(),
  currentStatus: z.enum(["active", "past_due", "canceled", "trialing"]),
});

export const toggleAppStatusAction = founderActionClient
  .schema(toggleAppStatusSchema)
  .action(async ({ parsedInput: { appId, currentStatus }, ctx: { session } }) => {
    const newStatus = currentStatus === "active" ? "canceled" : "active";
    
    await db.update(app_subscriptions)
      .set({ status: newStatus })
      .where(eq(app_subscriptions.appId, appId));

    await db.insert(activity_logs).values({
      id: crypto.randomUUID(),
      appId: appId,
      userId: session.user.id,
      action: newStatus === "active" ? "APP_RESUMED" : "APP_PAUSED",
      details: { timestamp: new Date().toISOString() }
    });

    revalidatePath("/apps");
    return { success: true, newStatus };
  });

const updateProjectHubSchema = z.object({
  appId: z.string(),
  githubRepo: z.string().optional(),
  vercelProjectId: z.string().optional(),
  vercelUrl: z.string().optional(),
  neonUrl: z.string().optional(),
});

export const updateProjectHubAction = founderActionClient
  .schema(updateProjectHubSchema)
  .action(async ({ parsedInput: { appId, githubRepo, vercelProjectId, vercelUrl, neonUrl }, ctx: { session } }) => {
    await db.update(apps)
      .set({
        githubRepo,
        vercelProjectId,
        vercelUrl,
        neonUrl,
      })
      .where(eq(apps.id, appId));

    await db.insert(activity_logs).values({
      id: crypto.randomUUID(),
      appId: appId,
      userId: session.user.id,
      action: "PROJECT_HUB_LINKED",
      details: { githubRepo, vercelProjectId, neonUrl, timestamp: new Date().toISOString() }
    });

    revalidatePath(`/apps/${appId}`);
    return { success: true };
  });
