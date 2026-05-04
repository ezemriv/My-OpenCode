import React from 'react';
import { GoModel } from '../types';
import TierBadge from './TierBadge';
import { DollarSign, Layers, MessageSquare } from 'lucide-react';

interface ModelCardProps {
  model: GoModel;
}

const formatNumber = (num: number): string => {
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
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
          {value !== null ? value.toFixed(1) : 'N/A'}
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

export const ModelCard: React.FC<ModelCardProps> = ({ model }) => {
  return (
    <div className="card hover:border-accent-blue/50 transition-colors group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-text-primary group-hover:text-accent-blue transition-colors">
            {model.name}
          </h3>
          <p className="text-sm text-text-secondary">{model.provider}</p>
        </div>
        <TierBadge tier={model.tier} size="sm" />
      </div>

      {/* Task Description */}
      <p className="text-sm text-text-secondary mb-4">
        {model.tier.description}
      </p>

      {/* Benchmarks */}
      <div className="space-y-3 mb-4">
        <BenchmarkBar label="HumanEval" value={model.benchmarks.humanEval} />
        <BenchmarkBar label="MMLU" value={model.benchmarks.mmlu} />
        <BenchmarkBar label="LMSYS Elo" value={model.benchmarks.lmsysElo} max={1400} />
      </div>

      {/* Usage Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-bg-secondary rounded-lg p-2.5">
          <div className="flex items-center gap-1.5 text-text-secondary text-xs mb-1">
            <MessageSquare size={12} />
            <span>Requests/5h</span>
          </div>
          <p className="font-mono text-sm font-medium text-text-primary">
            {formatNumber(model.limits.requestsPer5h)}
          </p>
        </div>
        <div className="bg-bg-secondary rounded-lg p-2.5">
          <div className="flex items-center gap-1.5 text-text-secondary text-xs mb-1">
            <DollarSign size={12} />
            <span>Cost/1k tokens</span>
          </div>
          <p className="font-mono text-sm font-medium text-text-primary">
            ${model.benchmarks.costPer1kTokens.toFixed(4)}
          </p>
        </div>
      </div>

      {/* Context & Tags */}
      <div className="flex items-center justify-between text-xs text-text-secondary">
        <div className="flex items-center gap-1.5">
          <Layers size={12} />
          <span>{formatNumber(model.benchmarks.contextWindow)} tokens</span>
        </div>
        <div className="flex gap-1">
          {model.tags.slice(0, 3).map(tag => (
            <span key={tag} className="px-1.5 py-0.5 bg-bg-secondary rounded text-[10px]">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModelCard;