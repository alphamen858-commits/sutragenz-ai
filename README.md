# Sutragenz.ai

**See • Think • Create** — an AI operating system for students and future builders.

This is a working Next.js 15 scaffold: real auth, a real database schema, a
real chat pipeline hitting live AI providers, and functional pages for every
one of the 13 tools in the brief. It's built to run today with a database and
one AI provider key — treat it as a strong, honest foundation to keep
building on, not a finished, battle-tested SaaS.

## What's fully wired up

- **Auth** — email/password + Google via NextAuth, Prisma adapter, JWT sessions
- **AI chat pipeline** — Tutor, Coding Assistant, Research, Career Coach, Prompt
  Generator all run through `/api/chat`, with per-feature system prompts,
  multi-provider routing (OpenAI / Anthropic / Gemini) and automatic fallback,
  rate limiting, and message persistence
- **Notes, Quiz, Resume, Study Planner, Image Generator, Project Builder** —
  each has a real API route calling an AI provider and persisting output
- **Video Generator** — real integration with Runway's async video API
  (`/api/video-gen` creates a task, `/api/video-gen/[id]` polls it every 5s
  per Runway's guidance). Needs a `RUNWAY_API_KEY` — Runway's API has no free
  tier, it's credit-metered, so this will cost real money per generation.
- **Coding Playground** — Monaco editor with live HTML/CSS preview and
  in-browser JS execution. Python and AI/ML tracks run for real too, via
  Pyodide loaded lazily from a CDN on first Python run (~10MB, cached after)
- **Gamification** — XP and streak increments on real actions, shown in the
  dashboard topbar
- **Admin panel** — users, subscriptions, and per-user AI usage, gated by role
- **Billing scaffolding** — Stripe Checkout + webhook, Razorpay webhook with
  signature verification

## What's intentionally a stub

- **File/image upload in chat** — the UI accepts a file and drops its name
  into the message; actually sending file bytes to the model (vision, PDF
  parsing) needs a small addition to `/api/chat` to read multipart data.
- **Runway API specifics may drift** — this is a fast-moving API (new models
  ship regularly). `src/lib/video/runway.ts` is small and isolated
  specifically so it's easy to update if Runway changes endpoint shapes.

## Tech stack

Next.js 15 (App Router) · TypeScript · Tailwind CSS · Framer Motion ·
Prisma · PostgreSQL · NextAuth · Stripe · Razorpay · Monaco Editor ·
OpenAI / Anthropic / Google Gemini SDKs

## Folder structure

```
src/
  app/
    (auth)/sign-in, sign-up          — auth pages
    admin/                           — role-gated admin panel
    api/
      auth/[...nextauth], auth/signup
      chat/                          — main multi-feature chat endpoint
      notes/ quiz/ quiz/[id]/ resume/ study-planner/
      image-gen/ project-builder/ projects/
      billing/checkout, billing/webhook/stripe, billing/webhook/razorpay
    dashboard/
      tutor/ coding-assistant/ research/ career-coach/ prompt-gen/  — chat UIs
      notes/ quiz/ resume/ study-planner/ image-gen/ video-gen/
      playground/ project-builder/ settings/
      layout.tsx, page.tsx
    layout.tsx, page.tsx (landing), globals.css
  components/
    landing/   — Navbar, Hero, StatsStrip, ToolSwitcher, PointOfView, Pricing, ClosingCTA, Footer
    dashboard/ — Sidebar, Topbar, StatsCard
    chat/      — ChatInterface (shared by 5 tools)
    playground/— CodeEditor (Monaco)
    ui/        — Logo, Button
    providers/ — NextAuth SessionProvider wrapper
  lib/
    ai/router.ts     — multi-model routing + per-feature system prompts
    auth.ts           — NextAuth config
    prisma.ts         — Prisma client singleton
    rate-limit.ts     — Upstash-based rate limiting (no-op if unconfigured)
    validation.ts     — Zod schemas
    utils.ts
  data/features.ts    — the 13-tool catalog (landing page + sidebar + tool switcher)
  types/next-auth.d.ts
prisma/schema.prisma
```

## Database schema notes

The schema tracks `User`, `Chat`/`Message`, `Project`, `Note`, `Quiz`,
`Achievement`, `Subscription`, plus the `Account`/`Session`/`VerificationToken`
tables NextAuth's Prisma adapter requires. It does **not** have dedicated
`StudyPlan` or `Resume` tables — those features reuse `Note` (titled
`"Study Plan — …"` / `"Resume — …"`) to avoid adding tables beyond what was
asked for. If usage grows, split them into their own models with proper
fields (examDate, structured resume JSON, etc.) rather than string-matching
titles.

## Deploying for free (no credit card, anywhere)

Every piece of this stack has a genuine, permanent free tier as of 2026.
This gets you **11 of the 13 tools working for $0** — everything except
Image Generator and Video Generator, which depend on paid APIs with no
free tier (see the honest limits below).

1. **Code hosting** — push this repo to GitHub (free).
2. **Database** — [Neon](https://neon.tech) free tier: no credit card,
   doesn't expire, commercial use allowed. Create a project, copy the
   connection string as `DATABASE_URL`.
3. **AI provider** — [Google AI Studio](https://aistudio.google.com):
   sign in with a Google account, create an API key, no credit card, no
   billing setup. This gives you `GOOGLE_GEMINI_API_KEY`, which powers
   Gemini 2.5 Flash — free, ~1,500 requests/day, doesn't expire. That's
   enough for every text-based tool: Tutor, Coding Assistant, Research,
   Career Coach, Notes, Quiz, Resume, Study Planner, Prompt Generator, and
   Project Builder. The Coding Playground needs no AI key at all.
4. **Hosting** — [Vercel](https://vercel.com) Hobby plan: free forever, no
   credit card. One real restriction: Hobby is scoped to **personal,
   non-commercial** use in Vercel's terms — fine for testing and personal
   use, but if you start actually charging people via the pricing page,
   that's what Vercel's paid Pro plan is for.

What stays paid no matter what: **Image Generator** (OpenAI's DALL-E has no
free tier) and **Video Generator** (Runway is credit-metered with no free
tier). Leave `OPENAI_API_KEY` and `RUNWAY_API_KEY` unset and those two
pages will show a clear "not configured" message instead of failing
silently — the other 11 tools are unaffected.

Rate limiting (Upstash Redis) also has a free tier if you want it — see
below — but the app works fine without it for personal use.

## The landing page's 3D core

The hero and "Every tool, connected to one core" section render a real,
interactive Three.js scene (`src/components/landing/three/`) — a rotating
icosahedron core with a wireframe shell and particle field, responding to
pointer movement. It's isolated deliberately:

- `AICoreScene.tsx` is the actual Three.js/React Three Fiber scene
- `AICore.tsx` wraps it with three safety nets: it's lazy-loaded (`next/dynamic`,
  `ssr: false`) so it doesn't block initial page load; it checks
  `prefers-reduced-motion` and falls back to a static glowing circle if the
  visitor has that setting on; it checks for WebGL support and falls back
  the same way on devices/browsers without it
- Every card, headline, and button around the 3D core is normal HTML/CSS —
  only the core itself is WebGL. This keeps the whole page accessible,
  readable, and far less likely to break than an all-3D UI

**If you added this after already running `npm install` once**, you need
to run it again — this added new packages:
```
npm install
```
Skipping this will show an error like `Module not found: Can't resolve 'three'`.

## Local setup

```bash
npm install
cp .env.example .env        # fill in DATABASE_URL and at least one AI provider key
npx prisma migrate dev --name init
npm run dev
```

You need **at least one** of `OPENAI_API_KEY` / `ANTHROPIC_API_KEY` /
`GOOGLE_GEMINI_API_KEY` set for the AI tools to respond — the router falls
back automatically if your primary provider for a feature isn't configured.

Rate limiting is a no-op until `UPSTASH_REDIS_REST_URL` /
`UPSTASH_REDIS_REST_TOKEN` are set — fine for local dev, but set these before
opening this up publicly so one user can't exhaust your API budget.

## Deploying to Vercel

1. Push this repo to GitHub.
2. Import it in Vercel → it auto-detects Next.js.
3. Add all variables from `.env.example` in Project Settings → Environment
   Variables (use your production DB URL, real API keys, real Stripe/Razorpay
   keys).
4. Provision Postgres — Vercel Postgres, Neon, or Supabase all work. Run
   `npx prisma migrate deploy` against the production `DATABASE_URL` (e.g. via
   a one-off Vercel deploy hook or locally against the prod URL).
5. Set `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` to your production domain.
6. Add the Stripe webhook endpoint (`/api/billing/webhook/stripe`) in the
   Stripe dashboard, and the Razorpay webhook (`/api/billing/webhook/razorpay`)
   in the Razorpay dashboard.
7. Deploy.

## Honest next steps, roughly in priority order

1. Add real per-plan gating (block Pro-only tools on the Free plan server-side,
   not just via rate limits).
2. Move file/image chat uploads to actually reach the model (multipart parsing
   + provider-specific vision APIs).
3. Split Resume/StudyPlan out of `Note` into their own tables once you're
   past the prototype stage.
4. Consider a queue (rather than client-side polling) for video generation
   once you have real traffic — polling from the browser is fine for a
   prototype but wastes requests at scale.
5. Add tests — none are included here.
