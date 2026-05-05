# Task 1: TypeScript Types Update

- Updated `ModelBenchmarks`:
  - Replaced `costPer1kTokens` with `costInput` and `costOutput` (per 1M tokens, both `number`)
  - Added `speedToksPerSec: number | null`
  - Added benchmark fields: `sweBenchVerified`, `mmluPro`, `gpqaDiamond`, `aime2026` (all `number | null`)
  - Kept existing: `humanEval`, `mbpp`, `sweBench`, `mmlu`, `gsm8k`, `lmsysElo`, `lmsysRank`, `contextWindow`
- Updated `SortBy` from `'cost' | 'benchmark' | 'name' | 'requests'` to `'cost' | 'speed' | 'context' | 'requests' | 'name'`
- Added new exports: `CompareSelection` (interface with `modelId` + `selected`) and `SelectedModels` (type alias for `string[]`)
- No changes to `GoModel`, `ModelLimits`, `ModelTier`, or `DashboardData`

# Task 8: BenchmarkChart.tsx - More Metrics

- Updated `MetricKey` to: `'humanEval' | 'sweBenchVerified' | 'gpqaDiamond' | 'aime2026' | 'mmluPro' | 'lmsysElo'`
  - Replaced: `mmlu` → `sweBenchVerified`, `gpqaDiamond`, `aime2026`, `mmluPro`
  - Removed: `costPer1kTokens` (not in updated ModelBenchmarks)
- Updated `metricConfig` colors to be distinguishable: blue, green, purple, yellow, red, cyan
- LMSYS Elo domain changed from `[1000, 1400]` to `[1200, 1500]`
- Data building now filters nulls via `.filter(model => model.benchmarks[activeMetric] !== null)` instead of `|| 0` coercion
- Added `hasData` flag; shows metric-specific "No data available for ${label}." when all models have null for the selected metric
- Kept same Recharts config, collapsible behavior, metric selector styling

# Task 4: UsageLimits.tsx Redesign - Horizontal Bar Chart

- Redesigned UsageLimits from cost cards to horizontal bar chart showing requestsPer5h per model
- Props changed from `{ costPer5h, costPerWeek, costPerMonth }` to `{ models: GoModel[] }`
- App.tsx updated to pass `<UsageLimits models={models} />` instead of hardcoded dollar values
- Horizontal bar chart in Recharts uses `layout="vertical"` with:
  - `<XAxis type="number" />` for request counts
  - `<YAxis type="category" dataKey="name" width={120} />` for model names
- Dynamic chart height: `Math.max(models.length * 30, 400)` to accommodate 15 models comfortably
- Bars colored by task tier: purple(complex-reasoning), blue(coding), green(general-purpose), yellow(fast-tasks)
- Added custom tooltip component showing model name, exact request count, and colored tier label
- Added color legend above the chart for task tier reference
- Collapsible behavior preserved (same button/header pattern as BenchmarkChart)
- No TypeScript errors introduced; pre-existing build errors in ModelCard.tsx and utils/tiering.ts remain

# Task 7: FilterBar.tsx Enhancement

- Added `GoModel` import from types and `Layers` icon from lucide-react
- Added new props: `models: GoModel[]`, `contextFilter: string`, `onContextFilterChange: (ctx: string) => void`
- Renamed static `taskOptions` → `taskOptionValues` (config stays outside component)
- Computed `taskOptions` inside component via `React.useMemo` — counts models per task tier and appends `(N)` to labels
- "All Tasks" gets total model count via `models.length`; others count by `model.tier.task`
- Added context filter dropdown with icon and options: Any Context, 128K, 256K, 1M
- Updated sort options labels: Cost → Cost (per1M), added Speed (tok/s), Context (size), Requests → Requests (per 5h)
- Removed `benchmark` from sortOptions (SortBy type no longer includes it)
- Made filter bar sticky: `sticky top-[73px] z-40` on outer `div`

# Task 5: ModelCard.tsx v2 Design

- Updated `ModelCardProps` to include `onCompareToggle?: (modelId: string, selected: boolean) => void`
- Added `formatCost` helper: values >= 1 use 2 decimal places, values < 1 use 4 decimal places
- Added `formatContext` helper inside component: formats context window as "1M" for >= 1M, "256K" for >= 1K
- Updated `BenchmarkBar` to show "—" instead of "N/A" for null values
- New card layout (top to bottom):
  1. **Header row:** Model name (left), TierBadge (right), provider below name
  2. **Context + Speed badges row:** Two prominent badges side by side with icons (RefreshCw for context, Zap for speed)
  3. **Cost row:** Displays "$X.XX in / $Y.YY out per 1M tokens" with DollarSign icon
  4. **Benchmarks section:** Category-grouped with uppercase tracking-wider headers:
     - Coding: SWE-bench Verified, HumanEval
     - Reasoning: GPQA Diamond, MMLU-Pro
     - Math: AIME 2026
     - Arena: LMSYS Elo (only shown if not null)
  5. **Tags row:** Kept existing tags display (first 3 tags)
  6. **Compare checkbox:** Bottom of card with accent-accent-blue checkbox
- Fixed TypeScript errors in `utils/tiering.ts`:
  - Replaced `costPer1kTokens` with `costInput` (per 1M tokens)
  - Replaced `'benchmark'` sort option with `'speed'` and `'context'` (matching updated SortBy type)
- Fixed TypeScript errors in `App.tsx`:
  - Added `contextFilter` state with default value `'any'`
  - Added missing props to FilterBar: `models`, `contextFilter`, `onContextFilterChange`
- Removed unnecessary section comments from ModelCard.tsx (code is self-explanatory)
- Build passes with no TypeScript errors

# Task 6: CompareModal.tsx - Model Comparison Modal

- Created `CompareModal.tsx` with props: `models: GoModel[]`, `isOpen: boolean`, `onClose: () => void`
- Modal layout:
  - Full-screen overlay with `bg-black/60 backdrop-blur-sm`
  - Centered panel: `bg-bg-card border border-border-color rounded-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto`
  - Sticky header with title and X close button
  - Comparison table using HTML `<table>` with proper semantic structure
- Comparison table rows:
  1. Model Name with TierBadge
  2. Provider
  3. Context Window (formatted as 1M, 256K, etc.)
  4. Speed (tok/s)
  5. Cost Input (per 1M tokens)
  6. Cost Output (per 1M tokens)
  7. Divider: "Coding Benchmarks" (SWE-bench Verified, HumanEval)
  8. Divider: "Reasoning Benchmarks" (GPQA Diamond, MMLU-Pro)
  9. Divider: "Math Benchmarks" (AIME 2026)
  10. Divider: "Arena" (LMSYS Elo)
- Best/worst highlighting logic:
  - `isHigherBetter()` function determines if higher or lower is better per metric
  - `getBestWorst()` calculates best/worst values across all models for each metric
  - `getValueClass()` returns CSS classes: `text-accent-green font-semibold` for best, `text-accent-red/70` for worst, `text-text-primary` for others
  - Cost metrics (costInput, costOutput) use lower-is-better logic
  - All other metrics use higher-is-better logic
- App.tsx integration:
  - Added `selectedModels: string[]` state and `isCompareOpen: boolean` state
  - Added `handleCompareToggle(modelId, selected)` handler with max 3 models limit
  - Passed `onCompareToggle={handleCompareToggle}` to each ModelCard
  - Added floating action button: `fixed bottom-6 right-6 z-50` with GitCompare icon
  - Button shows "Compare Selected (N)" with count, only visible when models selected
  - Renders CompareModal with filtered models array
- Formatting helpers:
  - `formatContext()`: formats context window (1M, 256K, etc.)
  - `formatCost()`: formats cost with 2 decimal places for >= 1, 4 decimal places for < 1
  - `formatNumber()`: formats large numbers with K suffix (removed as unused)
- Styling patterns:
  - Uses existing design tokens: bg-bg-card, border-border-color, text-text-primary, text-text-secondary
  - Icons from lucide-react: X, RefreshCw, Zap, DollarSign
  - Consistent with ModelCard styling patterns
- Build passes with no TypeScript errors
