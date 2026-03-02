# MaatWorkStudio SaaS Platform (v1.0.0)

MaatWork is a specialized SaaS platform designed for high-performance management of natatories and member-based businesses. Built with a modern, scalable monorepo architecture, it provides a unified control panel for founders and focused dashboards for apps.

## 🚀 Technology Stack

- **Framework:** [Next.js 16 (App Router)](https://nextjs.org/)
- **Monorepo Management:** [Turborepo](https://turbo.build/repo)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Database:** [Neon Serverless Postgres](https://neon.tech/)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication:** [Auth.js (v5)](https://authjs.dev/)
- **Runtime:** [Node.js 20+](https://nodejs.org/)
- **Package Manager:** [pnpm](https://pnpm.io/)

## 🏗️ Architecture Architecture Overview

The project follows a **C4 Component approach** within a Turborepo monorepo:

- `apps/studio`: The founder's "Command Center" for global application health, app management, and system auditing.
- `apps/app`: Client-facing dashboards tailored for individual businesses.
- `packages/auth`: Centralized authentication logic and session management.
- `packages/database`: Shared schema, migrations, and database client.
- `packages/ui`: A shared design system built with Radix UI and Tailwind CSS.
- `packages/utils`: Composable utility functions used across the stack.

## 🛠️ Getting Started

### 1. Prerequisites

- Node.js >= 20
- pnpm >= 9
- A Neon.io database project

### 2. Environment Setup

Copy the example environment file and configure your credentials:

```bash
cp .env.example .env
```

Update `DATABASE_URL` with your Neon connection string.

### 3. Installation

```bash
pnpm install
```

### 4. Database Initialization

```bash
pnpm db:push
pnpm seed
```

### 5. Development

```bash
pnpm dev
```

## 🔐 Security & Compliance

MaatWork is built with security as a first-class citizen:

- **App Isolation:** Row-Level Security (RLS) ensures strict data separation between clients.
- **Audit Logging:** Every critical action is recorded in the Audit Vault for compliance.
- **Modern Auth:** Secure session management via Auth.js with Google and Credentials support.

---

Built with ❤️ by the **MaatWork Team**.
