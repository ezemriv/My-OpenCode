export interface ModelLimits {
  requestsPer5h: number;
  requestsPerWeek: number;
  requestsPerMonth: number;
  costPer5h: number;
  costPerWeek: number;
  costPerMonth: number;
}

export interface ModelTier {
  task: 'complex-reasoning' | 'coding' | 'general-purpose' | 'fast-tasks';
  claudeComparison: 'opus-4.6' | 'sonnet-4.6' | 'haiku';
  description: string;
}

export interface ModelBenchmarks {
  humanEval: number | null;
  mbpp: number | null;
  sweBench: number | null;
  mmlu: number | null;
  gsm8k: number | null;
  lmsysElo: number | null;
  lmsysRank: number | null;
  costPer1kTokens: number;
  contextWindow: number;
}

export interface GoModel {
  id: string;
  name: string;
  provider: string;
  endpoint: string;
  limits: ModelLimits;
  tier: ModelTier;
  benchmarks: ModelBenchmarks;
  tags: string[];
  recommendedFor: string[];
}

export interface DashboardData {
  lastUpdated: string;
  models: GoModel[];
}

export type FilterTask = 'all' | ModelTier['task'];
export type FilterTier = 'all' | ModelTier['claudeComparison'];
export type SortBy = 'cost' | 'benchmark' | 'name' | 'requests';