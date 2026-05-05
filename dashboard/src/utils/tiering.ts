import { GoModel, FilterTask, FilterTier, SortBy } from '../types';

export function filterModels(
  models: GoModel[],
  filterTask: FilterTask,
  filterTier: FilterTier,
  searchQuery: string
): GoModel[] {
  return models.filter(model => {
    if (filterTask !== 'all' && model.tier.task !== filterTask) return false;
    if (filterTier !== 'all' && model.tier.claudeComparison !== filterTier) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const searchable = [
        model.name,
        model.provider,
        model.tier.description,
        ...model.tags,
        ...model.recommendedFor,
      ].join(' ').toLowerCase();
      if (!searchable.includes(query)) return false;
    }
    return true;
  });
}

export function sortModels(models: GoModel[], sortBy: SortBy): GoModel[] {
  const sorted = [...models];
  switch (sortBy) {
    case 'cost':
      return sorted.sort((a, b) => a.benchmarks.costInput - b.benchmarks.costInput);
    case 'requests':
      return sorted.sort((a, b) => b.limits.requestsPer5h - a.limits.requestsPer5h);
    case 'speed':
      return sorted.sort((a, b) => (b.benchmarks.speedToksPerSec || 0) - (a.benchmarks.speedToksPerSec || 0));
    case 'context':
      return sorted.sort((a, b) => b.benchmarks.contextWindow - a.benchmarks.contextWindow);
    case 'name':
    default:
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
  }
}