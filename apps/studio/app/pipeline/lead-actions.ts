"use server";

import { db } from "@maatwork/database";
import { leads } from "@maatwork/database/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateLeadStatus(id: string, status: "new" | "contacted" | "proposal" | "won" | "lost") {
  try {
    await db.update(leads)
      .set({ status, updatedAt: new Date() })
      .where(eq(leads.id, id));
    
    revalidatePath("/pipeline");
    return { success: true };
  } catch (error) {
    console.error("Failed to update lead status:", error);
    return { success: false, error: "Failed to update lead status" };
  }
}

export async function getLeads() {
  return await db.select().from(leads);
}
