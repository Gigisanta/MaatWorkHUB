"use server";

import { z } from "zod";
import { tenantActionClient } from "@maatwork/auth/safe-action";
import { db } from "@maatwork/database";
import { clients } from "@maatwork/database/schema";
import { revalidatePath } from "next/cache";

export const createClientSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address").optional().or(z.literal('')),
  phone: z.string().min(5, "Phone number too short").optional().or(z.literal('')),
  tenantId: z.string().uuid("Invalid tenant context"),
});

export const createClientAction = tenantActionClient
  .schema(createClientSchema)
  .action(async ({ parsedInput: { name, email, phone, tenantId }, ctx: { session } }) => {
    // 1. Security Check: Ensure user belongs to this tenant
    // (Note: middleware and Action Client already handle basic session, but we double-verify context)
    if (session.user.tenantId !== tenantId && session.user.role !== "founder") {
        throw new Error("Security Violation: Unauthorized tenant context mutation attempted.");
    }

    try {
      const [newClient] = await db.insert(clients).values({
        id: crypto.randomUUID(),
        name,
        email: email || null,
        phone: phone || null,
        tenantId,
      }).returning();

      revalidatePath(`/${session.user.tenantId}/clients`);
      
      return { success: true, client: newClient };
    } catch (error) {
      console.error("Failed to create client:", error);
      throw new Error("Database error occurred while creating client.");
    }
  });
