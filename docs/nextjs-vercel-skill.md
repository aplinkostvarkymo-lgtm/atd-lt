---
name: nextjs-vercel
description: >
  Full setup and deployment workflow for Next.js 14 (App Router) projects with Tailwind CSS,
  GitHub, and Vercel. Use this skill whenever the user mentions building a Next.js website,
  deploying to Vercel, setting up a new web project from scratch, adding API routes, configuring
  shadow deployment, or migrating from an old site to a new one. Also use when the user asks
  about project structure, folder conventions, environment variables, or Vercel deployment settings.
  Specifically tuned for ATD.LT: Lithuanian landscaping business site with Anthropic API routes,
  Airtable integration, and Zapier webhooks.
---

# Next.js + Vercel Skill

## Stack

| Layer | Technology | Notes |
|---|---|---|
| Framework | Next.js 14 App Router | SSG + SSR, best for SEO |
| Styling | Tailwind CSS | Utility-first, no CSS files |
| Deployment | Vercel | Auto-deploy on GitHub push |
| Version control | GitHub | One branch per feature |
| API routes | Next.js `/app/api/` | Solves CORS for Anthropic API |
| Database | Airtable | Via REST API or `airtable` npm |
| Automation | Zapier | Webhook triggers from API routes |

---

## 1. Project Bootstrap

```bash
npx create-next-app@latest atd-lt \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"
cd atd-lt
```

### Folder structure (ATD.LT)

```
src/
├── app/
│   ├── layout.tsx          # Root layout, metadata, fonts
│   ├── page.tsx            # Homepage
│   ├── paslaugos/
│   │   ├── veja/page.tsx
│   │   ├── apzeldinimas/page.tsx
│   │   └── trinkelės/page.tsx
│   ├── darbai/page.tsx     # Portfolio
│   ├── kaina/page.tsx      # Calculator page
│   ├── apie/page.tsx
│   ├── kontaktai/page.tsx
│   └── api/
│       ├── calculate/route.ts    # AI calculator (Anthropic API)
│       ├── lead/route.ts         # Save lead → Airtable → Zapier
│       └── chat/route.ts         # Chatbot proxy
├── components/
│   ├── ui/                 # Reusable: Button, Card, Input
│   ├── sections/           # Hero, Services, Portfolio, FAQ
│   ├── Calculator.tsx      # Kalkuliatorius Režimas A (maži projektai)
│   ├── ProjectCalculator.tsx  # Kalkuliatorius Režimas B (Excel upload)
│   └── Chatbot.tsx
├── lib/
│   ├── airtable.ts         # Airtable client
│   ├── claude.ts           # Anthropic client wrapper
│   └── utils.ts
public/
├── llms.txt                # LLM indexing (see llms-aeo skill)
├── robots.txt
└── sitemap.xml
```

---

## 2. Environment Variables

Create `.env.local` (never commit):

```env
ANTHROPIC_API_KEY=sk-ant-...
AIRTABLE_API_KEY=pat...
AIRTABLE_BASE_ID=app...
ZAPIER_WEBHOOK_URL=https://hooks.zapier.com/...
NEXT_PUBLIC_SITE_URL=https://atd.lt
```

In Vercel dashboard: Settings → Environment Variables → add same keys.

---

## 3. Anthropic API Route (solves CORS)

All Claude API calls go through a Next.js API route — never directly from the browser.

```typescript
// src/app/api/calculate/route.ts
import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const { excelData, systemPrompt } = await req.json();

  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4000,
    system: systemPrompt,
    messages: [{ role: "user", content: excelData }],
  });

  return NextResponse.json({ result: message.content[0] });
}
```

Install SDK: `npm install @anthropic-ai/sdk`

---

## 4. Airtable Lead Capture

```typescript
// src/lib/airtable.ts
const AIRTABLE_URL = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}`;

export async function saveLead(data: {
  name?: string;
  phone?: string;
  service?: string;
  amount?: number;
  source?: string;
}) {
  await fetch(`${AIRTABLE_URL}/Leads`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fields: {
        Vardas: data.name || "",
        Telefonas: data.phone || "",
        Paslauga: data.service || "",
        Suma: data.amount || 0,
        Šaltinis: data.source || "atd.lt",
        Data: new Date().toISOString().split("T")[0],
        Statusas: "Naujas",
      },
    }),
  });
}
```

After Airtable save → trigger Zapier webhook → email to Robertas.

---

## 5. GitHub + Vercel Deployment

### First deploy
1. `git init && git add . && git commit -m "init"`
2. Create GitHub repo, push
3. vercel.com → New Project → Import from GitHub → Deploy
4. Vercel auto-assigns `atd-lt.vercel.app`

### Shadow mode (develop without breaking live site)
```
Production:  atd.lt          → old site (DNS unchanged)
Preview:     new.atd.lt      → Vercel preview deployment
             or atd-lt.vercel.app
```

In Vercel: Settings → Domains → Add `new.atd.lt` as custom domain.
Point `new.atd.lt` CNAME → `cname.vercel-dns.com` in DNS registrar.

### Go live (cutover)
When new site is ready:
1. Add `atd.lt` to Vercel domains
2. Update DNS: `atd.lt` A record → Vercel IPs (76.76.21.21)
3. Old site stays at `old.atd.lt` as backup
4. TTL: set to 300s (5 min) before cutover for fast propagation

---

## 6. Metadata & SEO in App Router

```typescript
// src/app/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "ATD — Aplinkos Tvarkymas Vilnius", template: "%s | ATD" },
  description: "Profesionalus aplinkos tvarkymas Vilniuje. Vejos įrengimas, apželdinimas pagal projektą, trinkelių klojimas.",
  metadataBase: new URL("https://atd.lt"),
  openGraph: { type: "website", locale: "lt_LT", siteName: "ATD" },
  alternates: { canonical: "https://atd.lt" },
};
```

Per-page metadata: export `metadata` const from each `page.tsx`.

---

## 7. Fonts (Lithuanian characters support)

```typescript
// src/app/layout.tsx
import { Playfair_Display, DM_Sans } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin", "latin-ext"], // latin-ext covers Lithuanian ą č ę etc.
  variable: "--font-display",
});

const dmSans = DM_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-body",
});
```

---

## 8. Common Patterns

### Conditional client/server component
- Default: Server Component (better SEO, faster)
- Add `"use client"` only when: useState, useEffect, onClick, browser APIs

### Image optimization
```typescript
import Image from "next/image";
// Always use Next Image — automatic WebP, lazy loading, correct dimensions
<Image src="/darbai/projektas-1.jpg" alt="Vejos įrengimas Vilniuje" width={800} height={600} />
```

### Loading states for API calls
```typescript
const [loading, setLoading] = useState(false);
const handleSubmit = async () => {
  setLoading(true);
  try {
    const res = await fetch("/api/calculate", { method: "POST", body: ... });
    const data = await res.json();
  } finally {
    setLoading(false);
  }
};
```

---

## 9. Checklist before go-live

- [ ] All env vars set in Vercel dashboard
- [ ] `robots.txt` allows AI crawlers (see llms-aeo skill)
- [ ] `sitemap.xml` submitted to Google Search Console
- [ ] `llms.txt` in `/public`
- [ ] Schema.org JSON-LD on all pages (see llms-aeo skill)
- [ ] Mobile tested (Chrome DevTools → responsive)
- [ ] PageSpeed score >85 (vercel analytics + next/image)
- [ ] DNS TTL lowered before cutover
- [ ] Old site backed up at `old.atd.lt`
