import React from 'react';
import { GoModel } from '../types';
import { Brain, Code, Zap, Rocket, TrendingUp, DollarSign, Hash } from 'lucide-react';

interface SummaryBarProps {
  models: GoModel[];
  filteredCount: number;
}

const taskIcons = {
  'complex-reasoning': Brain,
  'coding': Code,
  'general-purpose': Zap,
  'fast-tasks': Rocket,
};

export const SummaryBar: React.FC<SummaryBarProps> = ({ models, filteredCount }) => {
  if (models.length === 0) {
    return (
      <div className="bg-bg-secondary border-b border-border-color">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-text-secondary text-sm">No models available</p>
        </div>
      </div>
    );
  }

  const taskCounts = models.reduce((acc, model) => {
    acc[model.tier.task] = (acc[model.tier.task] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const avgCost = models.length > 0 
    ? models.reduce((sum, m) => sum + m.benchmarks.costPer1kTokens, 0) / models.length 
    : 0;
  const cheapest = models.length > 0 
    ? models.reduce((min, m) => m.benchmarks.costPer1kTokens < min.benchmarks.costPer1kTokens ? m : min, models[0])
    : null;
  const bestCoding = models.filter(m => m.tier.task === 'coding').sort((a, b) => 
    (b.benchmarks.humanEval || 0) - (a.benchmarks.humanEval || 0)
  )[0];

  return (
    <div className="bg-bg-secondary border-b border-border-color">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Total Models */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-accent-blue/20 rounded-lg flex items-center justify-center">
              <Hash size={16} className="text-accent-blue" />
            </div>
            <div>
              <p className="text-lg font-bold font-mono text-text-primary">{filteredCount}</p>
              <p className="text-xs text-text-secondary">Models shown</p>
            </div>
          </div>

          {/* Avg Cost */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-accent-green/20 rounded-lg flex items-center justify-center">
              <DollarSign size={16} className="text-accent-green" />
            </div>
            <div>
              <p className="text-lg font-bold font-mono text-text-primary">${avgCost.toFixed(4)}</p>
              <p className="text-xs text-text-secondary">Avg cost/1k tokens</p>
            </div>
          </div>

          {/* Cheapest */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-accent-yellow/20 rounded-lg flex items-center justify-center">
              <TrendingUp size={16} className="text-accent-yellow" />
            </div>
            <div>
              <p className="text-sm font-bold text-text-primary truncate">{cheapest?.name || 'N/A'}</p>
              <p className="text-xs text-text-secondary">Most cost-effective</p>
            </div>
          </div>

          {/* Best for Coding */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-accent-purple/20 rounded-lg flex items-center justify-center">
              <Code size={16} className="text-accent-purple" />
            </div>
            <div>
              <p className="text-sm font-bold text-text-primary truncate">{bestCoding?.name || 'N/A'}</p>
              <p className="text-xs text-text-secondary">Best for coding</p>
            </div>
          </div>
        </div>

        {/* Task Distribution */}
        <div className="flex flex-wrap gap-2 mt-4">
          {Object.entries(taskCounts).map(([task, count]) => {
            const Icon = taskIcons[task as keyof typeof taskIcons];
            return (
              <div key={task} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-bg-card rounded-full text-xs text-text-secondary">
                <Icon size={12} />
                <span className="capitalize">{task.replace('-', ' ')}</span>
                <span className="font-mono font-medium text-text-primary">{count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SummaryBar;