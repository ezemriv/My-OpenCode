import React from 'react';
import { Filter, Search, ArrowUpDown } from 'lucide-react';
import { FilterTask, FilterTier, SortBy } from '../types';

interface FilterBarProps {
  filterTask: FilterTask;
  filterTier: FilterTier;
  sortBy: SortBy;
  searchQuery: string;
  onFilterTaskChange: (task: FilterTask) => void;
  onFilterTierChange: (tier: FilterTier) => void;
  onSortChange: (sort: SortBy) => void;
  onSearchChange: (query: string) => void;
}

const taskOptions: { value: FilterTask; label: string }[] = [
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
  { value: 'cost', label: 'Cost' },
  { value: 'requests', label: 'Requests' },
  { value: 'benchmark', label: 'Benchmark' },
];

export const FilterBar: React.FC<FilterBarProps> = ({
  filterTask,
  filterTier,
  sortBy,
  searchQuery,
  onFilterTaskChange,
  onFilterTierChange,
  onSortChange,
  onSearchChange,
}) => {
  return (
    <div className="bg-bg-secondary border-b border-border-color">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
            <input
              type="text"
              placeholder="Search models..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-bg-card border border-border-color rounded-lg text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent-blue/50"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <div className="relative">
              <Filter size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-secondary" />
              <select
                value={filterTask}
                onChange={(e) => onFilterTaskChange(e.target.value as FilterTask)}
                className="pl-8 pr-8 py-2 bg-bg-card border border-border-color rounded-lg text-sm text-text-primary focus:outline-none focus:border-accent-blue/50 appearance-none cursor-pointer"
              >
                {taskOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <select
              value={filterTier}
              onChange={(e) => onFilterTierChange(e.target.value as FilterTier)}
              className="px-3 py-2 bg-bg-card border border-border-color rounded-lg text-sm text-text-primary focus:outline-none focus:border-accent-blue/50 appearance-none cursor-pointer"
            >
              {tierOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            <div className="relative">
              <ArrowUpDown size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-secondary" />
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as SortBy)}
                className="pl-8 pr-8 py-2 bg-bg-card border border-border-color rounded-lg text-sm text-text-primary focus:outline-none focus:border-accent-blue/50 appearance-none cursor-pointer"
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