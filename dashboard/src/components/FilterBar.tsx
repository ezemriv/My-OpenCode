import React from 'react';
import { Filter, Search, ArrowUpDown, Layers } from 'lucide-react';
import { FilterTask, FilterTier, SortBy, GoModel } from '../types';

interface FilterBarProps {
  filterTask: FilterTask;
  filterTier: FilterTier;
  sortBy: SortBy;
  searchQuery: string;
  models: GoModel[];
  contextFilter: string;
  onFilterTaskChange: (task: FilterTask) => void;
  onFilterTierChange: (tier: FilterTier) => void;
  onSortChange: (sort: SortBy) => void;
  onSearchChange: (query: string) => void;
  onContextFilterChange: (ctx: string) => void;
}

const taskOptionValues: { value: FilterTask; label: string }[] = [
  { value: 'all', label: 'All Tasks' },
  { value: 'complex-reasoning', label: 'Complex Reasoning' },
  { value: 'coding', label: 'Coding' },
  { value: 'general-purpose', label: 'General Purpose' },
  { value: 'fast-tasks', label: 'Fast Tasks' },
];

const tierOptions: { value: FilterTier; label: string }[] = [
  { value: 'all', label: 'All Tiers' },
  { value: 'opus-4.6', label: 'Opus 4.6' },
  { value: 'sonnet-4.6', label: 'Sonnet 4.6' },
  { value: 'haiku', label: 'Haiku' },
];

const sortOptions: { value: SortBy; label: string }[] = [
  { value: 'name', label: 'Name' },
  { value: 'cost', label: 'Cost (per1M)' },
  { value: 'speed', label: 'Speed (tok/s)' },
  { value: 'context', label: 'Context (size)' },
  { value: 'requests', label: 'Requests (per 5h)' },
];

const contextOptions: { value: string; label: string }[] = [
  { value: 'any', label: 'Any Context' },
  { value: '128000', label: '128K' },
  { value: '256000', label: '256K' },
  { value: '1000000', label: '1M' },
];

export const FilterBar: React.FC<FilterBarProps> = ({
  filterTask,
  filterTier,
  sortBy,
  searchQuery,
  models,
  contextFilter,
  onFilterTaskChange,
  onFilterTierChange,
  onSortChange,
  onSearchChange,
  onContextFilterChange,
}) => {
  const taskOptions = React.useMemo(() => {
    const counts: Record<string, number> = {};
    for (const model of models) {
      counts[model.tier.task] = (counts[model.tier.task] || 0) + 1;
    }
    return taskOptionValues.map(opt => ({
      ...opt,
      label:
        opt.value === 'all'
          ? `All Tasks (${models.length})`
          : `${opt.label} (${counts[opt.value] || 0})`,
    }));
  }, [models]);

  return (
    <div className="sticky top-[73px] z-40 bg-bg-secondary border-b border-border-color">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <label htmlFor="model-search" className="sr-only">Search models</label>
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" aria-hidden="true" />
            <input
              id="model-search"
              type="text"
              placeholder="Search models..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-bg-card border border-border-color rounded-lg text-sm text-text-primary placeholder:text-text-secondary focus-visible:ring-2 focus-visible:ring-accent-blue/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-secondary focus-visible:border-accent-blue/50 outline-none"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <div className="relative">
              <Filter size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-secondary" />
              <select
                value={filterTask}
                onChange={(e) => onFilterTaskChange(e.target.value as FilterTask)}
                aria-label="Filter by task"
                className="pl-8 pr-8 py-2 bg-bg-card border border-border-color rounded-lg text-sm text-text-primary focus-visible:ring-2 focus-visible:ring-accent-blue/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-secondary focus-visible:border-accent-blue/50 outline-none appearance-none cursor-pointer"
              >
                {taskOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <select
              value={filterTier}
              onChange={(e) => onFilterTierChange(e.target.value as FilterTier)}
              aria-label="Filter by Claude tier"
              className="px-3 py-2 bg-bg-card border border-border-color rounded-lg text-sm text-text-primary focus-visible:ring-2 focus-visible:ring-accent-blue/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-secondary focus-visible:border-accent-blue/50 outline-none appearance-none cursor-pointer"
            >
              {tierOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            <div className="relative">
              <Layers size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-secondary" />
              <select
                value={contextFilter}
                onChange={(e) => onContextFilterChange(e.target.value)}
                aria-label="Filter by context size"
                className="pl-8 pr-8 py-2 bg-bg-card border border-border-color rounded-lg text-sm text-text-primary focus-visible:ring-2 focus-visible:ring-accent-blue/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-secondary focus-visible:border-accent-blue/50 outline-none appearance-none cursor-pointer"
              >
                {contextOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div className="relative">
              <ArrowUpDown size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-secondary" />
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as SortBy)}
                aria-label="Sort models"
                className="pl-8 pr-8 py-2 bg-bg-card border border-border-color rounded-lg text-sm text-text-primary focus-visible:ring-2 focus-visible:ring-accent-blue/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-secondary focus-visible:border-accent-blue/50 outline-none appearance-none cursor-pointer"
              >
                {sortOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
