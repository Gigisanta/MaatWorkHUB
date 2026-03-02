import { db } from "@maatwork/database";
import { analytics_events } from "@maatwork/database/schema";
import { v4 as uuid } from "uuid";

interface TrackOptions {
  tenantId?: string;
  eventType: string; // e.g., 'mrr.update', 'feature.used'
  source: 'studio' | 'tenant-app' | 'system';
  value?: number;
  metadata?: Record<string, unknown>;
}

/**
 * MaatAnalytics Engine - Proprietary tracking internal tool.
 * High-performance event ingestion for founder intelligence.
 */
export async function trackEvent({
  tenantId,
  eventType,
  source,
  value,
  metadata
}: TrackOptions) {
  try {
    // In a production scaling scenario, this would go to a queue (e.g. SQS/Redis)
    await db.insert(analytics_events).values({
      id: uuid(),
      tenantId,
      eventType,
      source,
      value: value?.toString(),
      metadata,
      createdAt: new Date(),
    });
  } catch (error) {
    // Graceful failure for analytics to ensure main flow continuity
    console.error(`[Analytics] Failed to track ${eventType}:`, error);
  }
}

/**
 * Specialized helper for financial tracking
 */
export async function trackFinancialEvent(
  amount: number, 
  type: 'subscription' | 'one-time',
  tenantId?: string
) {
  return trackEvent({
    tenantId,
    eventType: 'mrr.update',
    source: 'system',
    value: amount,
    metadata: { type }
  });
}
