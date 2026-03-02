---
name: maatwork-multi-app-drizzle-rls-neon
description: Core conventions for Maatwork database access using Drizzle, Neon, and RLS. Use this when writing database queries or schemas.
---

# Maatwork Multi-App DB Rules

1. **Never write `where(eq(clients.appId, currentApp))` manually.**
2. We use Postgres Row Level Security (RLS) configured in Neon.
3. Every table must have a `app_id` column.
4. To establish the context before queries, use the `SET app.current_app = ?` transaction flow.
5. All schema changes must be done via Drizzle Kit (`pnpm db:push` or migrate).
