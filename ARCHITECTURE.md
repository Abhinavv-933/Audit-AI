# Architecture

## System Diagram

```mermaid
flowchart TD
    A[User visits Audit AI] --> B[Spend Input Form]
    B --> C[localStorage persistence]
    B --> D[Run Audit button]
    D --> E[auditEngine.ts]
    E --> F[Audit Results Page]
    F --> G[POST /api/summary]
    G --> H{Anthropic API}
    H -->|Success| I[AI Summary]
    H -->|Failure| J[Fallback Summary]
    I --> F
    J --> F
    F --> K[Lead Capture Modal]
    K --> L[POST /api/leads]
    L --> M[(Supabase DB)]
    L --> N[Unique Audit ID]
    N --> O[/audit/id - Public Page]
    O --> P[Open Graph Preview]
```

## Data Flow

1. User fills the spend input form — tool, plan, monthly spend, seats, team size, use case
2. Form state is saved to localStorage on every keystroke so it persists across reloads
3. On submit, the raw form data is passed to `runAudit()` in `lib/auditEngine.ts`
4. The audit engine runs each tool through its specific audit function — pure TypeScript, no AI, deterministic results
5. The results page renders immediately with the savings breakdown
6. In parallel, a POST request goes to `/api/summary` which calls the Anthropic API for a personalized paragraph
7. If the API fails, `generateFallbackSummary()` generates a templated paragraph from the same data
8. After 3 seconds, the lead capture modal appears — email is never asked before value is shown
9. On email submit, the lead and full audit data are saved to Supabase with a UUID
10. The user is redirected to `/audit/{uuid}` — a public shareable page with Open Graph meta tags

## Stack

- **Framework:** Next.js 16 with App Router and TypeScript
- **Styling:** Tailwind CSS + shadcn/ui (Luma preset)
- **Audit logic:** Pure TypeScript functions in `lib/auditEngine.ts`
- **AI summary:** Anthropic API (`claude-sonnet-4-6`) with templated fallback
- **Database:** Supabase (PostgreSQL) for lead and audit storage
- **Deployment:** Vercel

## Why this stack

Next.js was chosen because the App Router gives us both server components (for the public audit page with proper OG tags) and client components (for the interactive form) in the same codebase. The public `/audit/[id]` page uses a server component so Open Graph metadata is rendered server-side — critical for link previews to work on Twitter and Slack.

Supabase was chosen over a custom Postgres setup because it gives a real SQL database with a REST API out of the box, no server to manage, and a free tier that covers this use case easily.

The audit engine is intentionally pure TypeScript with no AI — consistent, testable, and defensible. AI is used only for the summary paragraph where variability is acceptable.

## What I would change for 10k audits per day

- Add a Redis cache layer for the Anthropic API calls — same audit inputs produce the same summary, no need to call the API twice
- Move the audit engine to an edge function for lower latency globally
- Add a queue (BullMQ or Inngest) for the lead capture so database writes don't block the UI
- Add rate limiting per IP on the `/api/leads` endpoint using Upstash
- Add a proper analytics layer (Posthog) to track funnel drop-off between form completion and email capture