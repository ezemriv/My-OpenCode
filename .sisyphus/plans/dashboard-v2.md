# Dashboard v2 Overhaul Plan

> **Goal:** Transform the OpenCode Go dashboard into a quick model evaluation tool with static benchmarks, request-based usage limits, per-1M-token pricing, clearer context display, and a side-by-side model comparison feature.

**Tech Stack:** React 18, TypeScript, Vite 5, Tailwind CSS 3, Recharts, Lucide React

---

## TODOs

### [LOW-COMPLEX] Task 1: Update TypeScript Types for v2

- [x] Add `costInput` and `costOutput` fields to `ModelBenchmarks` (cost per 1M tokens)
- [x] Add `speedToksPerSec` field to `ModelBenchmarks` for comparison
- [x] Add `sweBenchVerified`, `mmluPro`, `gpqaDiamond`, `aime2026` benchmark categories to `ModelBenchmarks`
- [x] Remove `costPer1kTokens` from `ModelBenchmarks`
- [x] Keep `ModelTier` as-is (already clear labels)
- [x] Add `CompareSelection` and `SelectedModels` types for the comparison feature
- [x] Update `SortBy` to include `speed` and `context`, remove `benchmark`

**Files:**
- Modify: `dashboard/src/types/index.ts`

---

### [HIGH-COMPLEX] Task 2: Populate Static Benchmark Data

**Depends on:** Task 1

- [x] Update `data/models.json` with researched benchmark values for all 15 models
- [x] Fill `humanEval`, `mmlu`, `mmluPro`, `gpqaDiamond`, `aime2026`, `sweBenchVerified`, `lmsysElo`
- [x] Add cost per 1M tokens input/output for all models
- [x] Add context window correction for models (1M for DeepSeek V4, Qwen3.6+, MiMo-V2.5, etc.)
- [x] Add speed (tokens/sec) estimates per model
- [x] Copy updated JSON to `dashboard/public/data/models.json`
- [x] Update `lastUpdated` timestamp

**Files:**
- Modify: `data/models.json`
- Modify: `dashboard/public/data/models.json`

---

### [LOW-COMPLEX] Task 3: Remove Summary Bar from Top

- [x] Remove `SummaryBar` import and rendering from `App.tsx`
- [x] Delete `dashboard/src/components/SummaryBar.tsx`
- [x] Reorder components: Header → FilterBar → model grid → UsageLimits → BenchmarkChart

**Files:**
- Modify: `dashboard/src/App.tsx`
- Delete: `dashboard/src/components/SummaryBar.tsx`

---

### [HIGH-COMPLEX] Task 4: Redesign UsageLimits as Bar Plot

- [x] Redesign `UsageLimits.tsx` to show a horizontal bar chart comparing model request limits
- [x] Display requests per 5 hours as a bar for each model (not dollars)
- [x] Show model names on Y-axis, request count on X-axis
- [x] Color bars by task tier (purple/blue/green/yellow)
- [x] Keep collapsible behavior
- [x] Remove hardcoded cost values from App.tsx (pass models array instead)
- [x] Add tooltip showing exact request count

**Files:**
- Modify: `dashboard/src/components/UsageLimits.tsx`
- Modify: `dashboard/src/App.tsx`

---

### [HIGH-COMPLEX] Task 5: Update Model Card with v2 Design

**Depends on:** Task 1, Task 2

- [x] Show cost as "per 1M tokens" with input/output columns
- [x] Add prominent context window badge with size
- [x] Show benchmark scores from static data (not N/A)
- [x] Add speed indicator (tokens/sec) to each card
- [x] Add "Compare" checkbox/selector on each card
- [x] Show more benchmarks in card: coding (SWE-bench, HumanEval), reasoning (GPQA, MMLU), math (AIME)
- [x] Category-based benchmark grouping with clear labels

**Files:**
- Modify: `dashboard/src/components/ModelCard.tsx`

---

### [HIGH-COMPLEX] Task 6: Create Model Comparison Modal

**Depends on:** Task 5

- [x] Create `CompareModal.tsx` component
- [x] Allow selecting up to 3 models via checkboxes on ModelCards
- [x] "Compare Selected" floating action button (shows count of selected)
- [x] Modal with side-by-side comparison table:
- [x] Visual highlights: best value in green, worst in red per category
- [x] Close/backdrop dismiss

**Files:**
- Create: `dashboard/src/components/CompareModal.tsx`
- Modify: `dashboard/src/App.tsx`

---

### [LOW-COMPLEX] Task 7: Enhance Filter Bar

- [x] Add clearer labels with icons for each filter option
- [x] Show filter counts (e.g., "Coding (5)")
- [x] Add "Context Size" filter range (e.g., 128K, 256K, 1M)
- [x] Add speed sort option
- [x] Make filter bar sticky below header

**Files:**
- Modify: `dashboard/src/components/FilterBar.tsx`

---

### [LOW-COMPLEX] Task 8: Update BenchmarkChart

**Depends on:** Task 1, Task 2

- [x] Add more metrics: SWE-bench Verified, GPQA Diamond, AIME 2026
- [x] Use actual benchmark values (no longer all zeros)
- [x] Show "N/A" for models with missing values (don't render zero bars)
- [x] Better metric selectors with icons

**Files:**
- Modify: `dashboard/src/components/BenchmarkChart.tsx`

---

## Final Verification Wave

### F1: TypeScript Build Check
- [x] `cd dashboard && npx tsc --noEmit` passes with zero errors
- [x] `cd dashboard && npm run build` succeeds

### F2: Manual Code Review
- [x] Every changed file read and verified
- [x] No stubs, TODOs, or hardcoded values
- [x] No scope creep beyond listed tasks

### F3: Hands-on QA (Browser)
- [x] Dashboard loads without errors (dev server tested)
- [x] All 15 models display with benchmark values (no N/A)
- [x] Usage limits bar chart renders correctly
- [x] Compare modal works (select, compare, close)
- [x] Filters work correctly
- [x] Cost displayed per 1M tokens input/output
- [x] Mobile responsive

### F4: Data Integrity Check
- [x] All 14 models have populated benchmark values
- [x] Context windows correct per research
- [x] Cost per 1M tokens matches research data
- [x] No SummaryBar rendered
