# OpenCode Go Dashboard — Design Spec

**Date:** 2026-05-04
**Author:** AI Agent (OpenCode)
**Status:** Approved (user authorized proceed without permission)

---

## 1. Overview

A static, interactive dashboard deployed to GitHub Pages that visualizes all OpenCode Go models, their benchmarks, usage limits, and task-based tiering with Claude comparisons. The dashboard auto-refreshes data weekly via GitHub Actions and can be manually refreshed via a button.

**Goals:**
- At-a-glance model comparison for task selection
- Visual cost/usage limit awareness
- Benchmark-backed model capability assessment
- Zero-cost hosting on GitHub Pages

---

## 2. Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  GitHub Actions (Weekly Cron + Manual Dispatch)            │
│  ├─ Fetch models from https://opencode.ai/zen/go/v1/models │
│  ├─ Scrape benchmark data (LMSYS, OpenCode docs)          │
│  ├─ Scrape usage limits from opencode.ai/go               │
│  └─ Commit JSON data to `data/` directory                  │
├─────────────────────────────────────────────────────────────┤
│  React + Vite + Tailwind SPA                               │
│  ├─ Reads static JSON data at build time                   │
│  ├─ Renders model cards with tier badges                   │
│  ├─ Interactive filters (task, cost tier, benchmark)       │
│  ├─ Usage limit visualization                              │
│  └─ "Refresh Data" button triggers GitHub Action           │
├─────────────────────────────────────────────────────────────┤
│  GitHub Pages (Static Hosting)                             │
│  └─ Auto-deploy on push to `main`                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Data Model

### 3.1 OpenCode Go Model Data

```typescript
interface GoModel {
  id: string;                    // e.g., "kimi-k2.6"
  name: string;                  // e.g., "Kimi K2.6"
  provider: string;              // e.g., "Moonshot AI"
  endpoint: string;              // API endpoint
  
  // Usage Limits (from OpenCode Go docs)
  limits: {
    requestsPer5h: number;
    requestsPerWeek: number;
    requestsPerMonth: number;
    costPer5h: number;           // $12
    costPerWeek: number;         // $30
    costPerMonth: number;        // $60
  };
  
  // Task-Based Tiering
  tier: {
    task: "complex-reasoning" | "coding" | "general-purpose" | "fast-tasks";
    claudeComparison: "opus-4.6" | "sonnet-4.6" | "haiku";
    description: string;
  };
  
  // Benchmarks
  benchmarks: {
    // Coding (Python focus)
    humanEval?: number;          // 0-100
    mbpp?: number;               // 0-100
    sweBench?: number;           // 0-100 (if available)
    
    // General reasoning
    mmlu?: number;               // 0-100
    gsm8k?: number;              // 0-100 (math)
    
    // LMSYS Arena
    lmsysElo?: number;           // Elo rating
    lmsysRank?: number;          // Overall rank
    
    // Cost efficiency
    costPer1kTokens: number;     // Estimated
    contextWindow: number;       // In tokens
  };
  
  // Metadata
  tags: string[];
  recommendedFor: string[];      // e.g., ["python-coding", "data-analysis"]
}
```

### 3.2 Dashboard State

```typescript
interface DashboardState {
  models: GoModel[];
  filterTask: string | "all";
  filterTier: string | "all";
  sortBy: "cost" | "benchmark" | "name";
  searchQuery: string;
  lastUpdated: string;           // ISO timestamp
}
```

---

## 4. Components

### 4.1 Layout

```
┌────────────────────────────────────────────────────────────┐
│  Header: OpenCode Go Dashboard        [Refresh] [Last Upd] │
├────────────────────────────────────────────────────────────┤
│  Summary Bar: Total Models | Avg Cost | Best for Coding   │
├────────────────────────────────────────────────────────────┤
│  Filters: [All Tasks ▼] [All Tiers ▼] [Sort ▼] [Search...]│
├────────────────────────────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │ Model Card  │ │ Model Card  │ │ Model Card  │          │
│  │ (Kimi K2.6) │ │ (DeepSeek)  │ │ (Qwen3.5)   │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │ Model Card  │ │ Model Card  │ │ Model Card  │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
├────────────────────────────────────────────────────────────┤
│  Usage Limits Section (collapsible)                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                   │
│  │ 5h: $12  │ │ Week: $30│ │ Month:$60│                   │
│  └──────────┘ └──────────┘ └──────────┘                   │
├────────────────────────────────────────────────────────────┤
│  Benchmark Comparison Chart (toggleable)                   │
└────────────────────────────────────────────────────────────┘
```

### 4.2 Model Card Design

Each card is a self-contained unit:

```
┌────────────────────────────────────────┐
│  🏆 Tier Badge (e.g., "Opus-class")   │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    │
│  Model Name               Provider     │
│  "Best for: Complex Python Coding"     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    │
│  Benchmarks:                           │
│  HumanEval: 92.7  ████████████░ 92%   │
│  MMLU:      85.4  ███████████░░ 85%   │
│  LMSYS:     1250  Elo                │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    │
│  Usage: 1,150 req/5h | $0.010/req     │
│  Context: 256K tokens                  │
│  [View Details →]                      │
└────────────────────────────────────────┘
```

### 4.3 Tier Badges

| Task | Claude Comparison | Badge Color | Icon |
|------|-------------------|-------------|------|
| Complex Reasoning | Opus 4.6 | Purple | 🧠 |
| Coding (Python) | Opus 4.6 | Blue | 🐍 |
| General Purpose | Sonnet 4.6 | Green | ⚡ |
| Fast Tasks | Haiku | Yellow | 🚀 |

---

## 5. Data Sources & Fetching Strategy

### 5.1 Static Data (Committed to Repo)

Since OpenCode Go data changes infrequently (weekly at most), we commit JSON data files:

- `data/models.json` — Model list from API + enriched metadata
- `data/benchmarks.json` — Scraped benchmark scores
- `data/usage-limits.json` — Usage limit definitions

### 5.2 GitHub Action: `update-data.yml`

```yaml
name: Update Dashboard Data
on:
  schedule:
    - cron: '0 0 * * 0'  # Weekly on Sunday
  workflow_dispatch:       # Manual trigger

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: node scripts/fetch-data.js
      - run: |
          git config user.name "github-actions"
          git config user.email "actions@github.com"
          git add data/
          git diff --staged --quiet || git commit -m "chore: update model data [$(date)]"
          git push
```

### 5.3 Data Fetch Script (`scripts/fetch-data.js`)

```javascript
// Pseudo-code
async function fetchData() {
  // 1. Fetch models from OpenCode Go API
  const models = await fetch('https://opencode.ai/zen/go/v1/models').then(r => r.json());
  
  // 2. Scrape usage limits from docs (or use known values)
  const limits = await scrapeUsageLimits();
  
  // 3. Fetch benchmark data from LMSYS API
  const benchmarks = await fetchLMSYSData();
  
  // 4. Merge and enrich with tier assignments
  const enriched = models.map(m => ({
    ...m,
    limits: getLimitsForModel(m.id),
    tier: assignTier(m, benchmarks),
    benchmarks: getBenchmarksForModel(m.id, benchmarks)
  }));
  
  // 5. Write JSON files
  fs.writeFileSync('data/models.json', JSON.stringify(enriched, null, 2));
}
```

---

## 6. Task-Based Tiering Logic

### 6.1 Tier Assignment Algorithm

```typescript
function assignTier(model: RawModel, benchmarks: BenchmarkData): Tier {
  const scores = {
    coding: benchmarks.humanEval || 0,
    reasoning: benchmarks.mmlu || 0,
    speed: 1 / (benchmarks.costPer1kTokens || 1),
    lmsys: benchmarks.lmsysElo || 0
  };
  
  // Complex Reasoning (Opus-class)
  if (scores.lmsys > 1250 && scores.reasoning > 85) {
    return { task: "complex-reasoning", claudeComparison: "opus-4.6", description: "Best for complex reasoning and analysis" };
  }
  
  // Coding (Opus-class)
  if (scores.coding > 90 && scores.lmsys > 1200) {
    return { task: "coding", claudeComparison: "opus-4.6", description: "Best for Python coding and software engineering" };
  }
  
  // General Purpose (Sonnet-class)
  if (scores.lmsys > 1150 && scores.reasoning > 75) {
    return { task: "general-purpose", claudeComparison: "sonnet-4.6", description: "Great all-rounder for most tasks" };
  }
  
  // Fast Tasks (Haiku-class)
  return { task: "fast-tasks", claudeComparison: "haiku", description: "Fast and cost-effective for simple tasks" };
}
```

---

## 7. UI/UX Design

### 7.1 Color Palette (Dark Mode Default)

```css
--bg-primary: #0f0f0f;
--bg-secondary: #1a1a1a;
--bg-card: #1e1e1e;
--border: #2a2a2a;
--text-primary: #e0e0e0;
--text-secondary: #888888;
--accent-purple: #a855f7;  /* Opus-class */
--accent-blue: #3b82f6;    /* Coding */
--accent-green: #22c55e;   /* Sonnet-class */
--accent-yellow: #eab308;  /* Haiku-class */
--accent-red: #ef4444;     /* Warning */
```

### 7.2 Typography

- **Headings:** Inter, 700 weight
- **Body:** Inter, 400 weight
- **Mono:** JetBrains Mono (for benchmark numbers)

### 7.3 Responsive Breakpoints

- Mobile: < 640px (1 column)
- Tablet: 640px - 1024px (2 columns)
- Desktop: > 1024px (3-4 columns)

---

## 8. File Structure

```
my-agents-setup/
├── dashboard/                    # React app
│   ├── public/
│   │   └── data/                # Static JSON data
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.tsx
│   │   │   ├── ModelCard.tsx
│   │   │   ├── TierBadge.tsx
│   │   │   ├── BenchmarkChart.tsx
│   │   │   ├── FilterBar.tsx
│   │   │   ├── UsageLimits.tsx
│   │   │   └── SummaryBar.tsx
│   │   ├── data/
│   │   │   └── models.json      # Imported at build time
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── utils/
│   │   │   └── tiering.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.json
├── scripts/
│   └── fetch-data.js            # Data fetching script
├── .github/
│   └── workflows/
│       ├── update-data.yml      # Weekly data update
│       └── deploy.yml           # Deploy to GH Pages
├── data/                        # Generated data files
│   ├── models.json
│   ├── benchmarks.json
│   └── usage-limits.json
└── README.md
```

---

## 9. Deployment

### 9.1 GitHub Pages Configuration

1. Repository Settings → Pages → Source: GitHub Actions
2. Workflow builds `dashboard/` and deploys `dist/` folder

### 9.2 Build & Deploy Workflow

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: cd dashboard && npm ci
      - run: cd dashboard && npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dashboard/dist
```

---

## 10. Error Handling

- **Data fetch failure:** Dashboard shows last known data with "Data may be stale" warning
- **Missing benchmarks:** Show "N/A" with tooltip explaining data unavailable
- **Network error on refresh:** Toast notification with retry button

---

## 11. Future Enhancements (Post-MVP)

- [ ] Personal usage tracking (if OpenCode API supports it)
- [ ] Historical benchmark trends
- [ ] Model comparison side-by-side
- [ ] Cost calculator ("How many requests can I make with $X?")
- [ ] Dark/light mode toggle
- [ ] Export to PDF/CSV

---

## 12. Success Criteria

- [ ] Dashboard renders correctly on GitHub Pages
- [ ] All 15 OpenCode Go models are displayed with correct data
- [ ] Task-based tiering is accurate and useful
- [ ] Usage limits are clearly visible
- [ ] Benchmarks are displayed with visual bars/charts
- [ ] Filters and search work correctly
- [ ] Data auto-updates weekly
- [ ] Manual refresh button works
- [ ] Mobile responsive
- [ ] Load time < 3 seconds

---

**Next Step:** Implementation plan via `writing-plans` skill.
