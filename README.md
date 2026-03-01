# Dev Factory Hub

A comprehensive business management system for software development factories. Built with a Hono backend, React 19 frontend, PostgreSQL, Drizzle ORM, Clerk authentication, and S3 document storage.

## Features

- **Client Management**: Track clients, projects, and contacts.
- **Collaborator Management**: Manage collaborators and their specific roles with distinct fee and cost rates.
- **Financial Operations**:
  - **Timesheets**: Log work hours with automated rate locking.
  - **Proformas**: Generate proformas with line items and automatic totals.
  - **Invoices**: Manage issued invoices and their lifecycle.
  - **Collections**: Track client payments with S3 proof of payment storage.
  - **Money Exchanges**: Record currency conversions with rate tracking.
  - **Transactions**: Track general business expenses and income.
- **Payroll & Taxes**:
  - **Payroll**: Manage salary payments and pension contributions.
  - **Tax Payments**: Track tax obligations and payments.
- **Financial Dashboards**:
  - **Bank Balance**: Real-time summary of all liquid assets across all financial modules.
  - **Collaborator Balance**: Monitor net salary earned vs. payments confirmed per collaborator.
  - **Client Balance**: track proformas issued vs. collections confirmed per client.

## Structure

```
dev-factory-hub/
├── apps/
│   ├── backend/                # Hono API server
│   │   ├── src/
│   │   │   ├── database/       # Drizzle client, schemas, migrations
│   │   │   ├── features/       # Feature modules (endpoints + table + schemas)
│   │   │   ├── middlewares/    # Auth, error handling, not-found
│   │   │   ├── app.ts         # Hono app with route registration
│   │   │   ├── env.ts         # Environment validation (Zod)
│   │   │   ├── extensions.ts  # RFC 9457 error helpers
│   │   │   └── validator.ts   # Custom zValidator wrapper
│   │   ├── tests/              # Integration tests (node:test)
│   │   └── Dockerfile          # Multi-stage production build
│   └── frontend/               # React 19 + Vite app
│       └── src/
│           ├── components/     # Shared UI (shadcn/ui, layout)
│           ├── features/       # Feature modules (pages, components, stores)
│           ├── stores/         # React Query hooks and API clients
│           └── routes.tsx      # React Router config
├── .gemini/
│   └── skills/                 # Gemini CLI skills for code generation
├── docker-compose.yml          # Dev environment (PostgreSQL, Seq)
├── docker-compose-coolify.yml  # Production deployment config
└── package.json                # Root workspace config
```

## Getting Started

### Prerequisites

- Node.js 22+
- npm 10+
- Docker (for PostgreSQL)
- A [Clerk](https://clerk.com) account (for authentication)
- S3-compatible storage (e.g., AWS S3, Cloudflare R2, or MinIO)

### Installation

```bash
npm install
```

### Environment Setup

Copy the example env files and fill in your values:

```bash
# Backend
cp apps/backend/.env.example apps/backend/.env

# Frontend
cp apps/frontend/.env.example apps/frontend/.env
```

**Key Backend Variables**:

- `DATABASE_URL`: PostgreSQL connection string.
- `CLERK_SECRET_KEY`: From your Clerk dashboard.
- `S3_ENDPOINT`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`: For document storage.
- `S3_COLLECTIONS_BUCKET_NAME`, `S3_TRANSACTIONS_BUCKET_NAME`, etc.: Specific buckets for each module.

### Database Setup

Start PostgreSQL via Docker:

```bash
npm run database:up
```

Apply migrations:

```bash
npm run database:migrate -w @node-monorepo/backend
```

### Development

Run both backend and frontend concurrently:

```bash
npm run dev
```

## Available Scripts

| Script              | Description                                                   |
| ------------------- | ------------------------------------------------------------- |
| `dev`               | Start both backend and frontend concurrently                  |
| `build`             | Build both apps                                               |
| `lint`              | Run ESLint across the monorepo                                |
| `format`            | Format code with Prettier                                     |
| `database:up`       | Start PostgreSQL container                                    |
| `database:generate` | Generate Drizzle migrations (use `-w @node-monorepo/backend`) |
| `database:migrate`  | Apply Drizzle migrations (use `-w @node-monorepo/backend`)    |
| `test`              | Run backend integration tests (110+ tests)                    |

## Tech Stack

### Backend

- **Framework**: [Hono](https://hono.dev)
- **ORM**: [Drizzle](https://orm.drizzle.team)
- **Auth**: [Clerk](https://clerk.com)
- **Storage**: AWS SDK (S3)
- **Testing**: Native `node:test`

### Frontend

- **Framework**: [React 19](https://react.dev) + [Vite 6](https://vite.dev)
- **Routing**: [React Router 7](https://reactrouter.com)
- **Data Fetching**: [TanStack Query v5](https://tanstack.com/query)
- **UI**: [shadcn/ui](https://ui.shadcn.com) + [Tailwind CSS v4](https://tailwindcss.com)

## Deployment

The project includes a `docker-compose-coolify.yml` optimized for deployment on platforms like [Coolify](https://coolify.io). It manages the automatic application of migrations before starting the API server.

## License

MIT
