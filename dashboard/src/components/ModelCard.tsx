import React from 'react';
import { GoModel } from '../types';
import TierBadge from './TierBadge';
import { RefreshCw, Zap, DollarSign } from 'lucide-react';

interface ModelCardProps {
  model: GoModel;
  onCompareToggle?: (modelId: string, selected: boolean) => void;
}

const formatCost = (cost: number): string => {
  if (cost >= 1) return cost.toFixed(2);
  return cost.toFixed(4);
};

const BenchmarkBar: React.FC<{ label: string; value: number | null; max?: number }> = ({ 
  label, value, max = 100 
}) => {
  const percentage = value ? (value / max) * 100 : 0;
  
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-text-secondary">{label}</span>
        <span className="font-mono text-text-primary">
          {value !== null ? value.toFixed(1) : '—'}
        </span>
      </div>
      <div className="h-1.5 bg-bg-secondary rounded-full overflow-hidden">
        <div 
          className="h-full bg-accent-blue rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export const ModelCard: React.FC<ModelCardProps> = ({ model, onCompareToggle }) => {
  const formatContext = (context: number): string => {
    if (context >= 1000000) return `${(context / 1000000).toFixed(0)}M`;
    if (context >= 1000) return `${(context / 1000).toFixed(0)}K`;
    return context.toString();
  };

  return (
    <div className="card hover:border-accent-blue/50 transition-colors group">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-text-primary group-hover:text-accent-blue transition-colors">
            {model.name}
          </h3>
          <p className="text-sm text-text-secondary">{model.provider}</p>
        </div>
        <TierBadge tier={model.tier} size="sm" />
      </div>

      <div className="flex gap-2 mb-3">
        <div className="flex-1 bg-bg-secondary rounded-lg px-3 py-1.5 text-xs font-mono flex items-center gap-1.5">
          <RefreshCw size={12} className="text-text-secondary" />
          <span>{formatContext(model.benchmarks.contextWindow)} context</span>
        </div>
        {model.benchmarks.speedToksPerSec !== null && (
          <div className="flex-1 bg-bg-secondary rounded-lg px-3 py-1.5 text-xs font-mono flex items-center gap-1.5">
            <Zap size={12} className="text-accent-yellow" />
            <span>{model.benchmarks.speedToksPerSec} tok/s</span>
          </div>
        )}
      </div>

      <div className="bg-bg-secondary rounded-lg px-3 py-2 mb-4 flex items-center gap-1.5 text-xs">
        <DollarSign size={12} className="text-accent-green" />
        <span className="font-mono">
          ${formatCost(model.benchmarks.costInput)} in / ${formatCost(model.benchmarks.costOutput)} out per 1M tokens
        </span>
      </div>

      <div className="space-y-4 mb-4">
        <div>
          <h4 className="text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">Coding</h4>
          <div className="space-y-2">
            <BenchmarkBar label="SWE-bench Verified [real-world code]" value={model.benchmarks.sweBenchVerified} />
            <BenchmarkBar label="HumanEval [code generation]" value={model.benchmarks.humanEval} />
          </div>
        </div>

        <div>
          <h4 className="text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">Reasoning</h4>
          <div className="space-y-2">
            <BenchmarkBar label="GPQA Diamond [science reasoning]" value={model.benchmarks.gpqaDiamond} />
            <BenchmarkBar label="MMLU-Pro [general knowledge]" value={model.benchmarks.mmluPro} />
          </div>
        </div>

        <div>
          <h4 className="text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">Math</h4>
          <div className="space-y-2">
            <BenchmarkBar label="AIME 2026 [math reasoning]" value={model.benchmarks.aime2026} />
          </div>
        </div>

        {model.benchmarks.lmsysElo !== null && (
          <div>
            <h4 className="text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">Arena</h4>
            <div className="space-y-2">
              <BenchmarkBar label="LMSYS Elo [chat arena]" value={model.benchmarks.lmsysElo} max={1500} />
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-1 mb-3">
        {model.tags.slice(0, 3).map(tag => (
          <span key={tag} className="px-1.5 py-0.5 bg-bg-secondary rounded text-[10px] text-text-secondary">
            {tag}
          </span>
        ))}
      </div>

      <label className="flex items-center gap-2 text-xs text-text-secondary cursor-pointer mt-3 pt-3 border-t border-border-color">
        <input 
          type="checkbox" 
          className="accent-accent-blue" 
          onChange={(e) => onCompareToggle?.(model.id, e.target.checked)}
        />
        <span>Compare</span>
      </label>
    </div>
  );
};

export default ModelCard;