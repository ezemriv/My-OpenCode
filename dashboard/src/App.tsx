import { useState, useEffect, useCallback } from 'react';
import { GoModel, FilterTask, FilterTier, SortBy, DashboardData } from './types';
import Header from './components/Header';
import FilterBar from './components/FilterBar';
import SummaryBar from './components/SummaryBar';
import ModelCard from './components/ModelCard';
import UsageLimits from './components/UsageLimits';
import BenchmarkChart from './components/BenchmarkChart';
import { filterModels, sortModels } from './utils/tiering';
import { AlertCircle } from 'lucide-react';

function App() {
  const [models, setModels] = useState<GoModel[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [filterTask, setFilterTask] = useState<FilterTask>('all');
  const [filterTier, setFilterTier] = useState<FilterTier>('all');
  const [sortBy, setSortBy] = useState<SortBy>('name');
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('./data/models.json');
      if (!response.ok) throw new Error('Failed to load model data');
      
      const data: DashboardData = await response.json();
      setModels(data.models);
      setLastUpdated(data.lastUpdated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
    setIsRefreshing(false);
  };

  const filteredModels = sortModels(
    filterModels(models, filterTask, filterTier, searchQuery),
    sortBy
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-accent-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <AlertCircle size={32} className="text-accent-red mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-text-primary mb-2">Failed to load data</h2>
          <p className="text-text-secondary mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-accent-blue text-white rounded-lg hover:bg-accent-blue/90 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <Header 
        lastUpdated={lastUpdated} 
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />
      
      <SummaryBar models={models} filteredCount={filteredModels.length} />
      
      <UsageLimits 
        costPer5h={12} 
        costPerWeek={30} 
        costPerMonth={60}
      />
      
      <BenchmarkChart models={filteredModels} />
      
      <FilterBar
        filterTask={filterTask}
        filterTier={filterTier}
        sortBy={sortBy}
        searchQuery={searchQuery}
        onFilterTaskChange={setFilterTask}
        onFilterTierChange={setFilterTier}
        onSortChange={setSortBy}
        onSearchChange={setSearchQuery}
      />

      {/* Model Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {filteredModels.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-text-secondary">No models match your filters.</p>
            <button
              onClick={() => {
                setFilterTask('all');
                setFilterTier('all');
                setSearchQuery('');
              }}
              className="mt-2 text-accent-blue hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredModels.map(model => (
              <ModelCard key={model.id} model={model} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border-color py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-text-secondary">
          <p>OpenCode Go Dashboard · Data from opencode.ai</p>
          <p className="mt-1">Benchmarks updated manually · Usage limits subject to change</p>
        </div>
      </footer>
    </div>
  );
}

export default App;