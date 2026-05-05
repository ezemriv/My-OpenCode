import React from 'react';
import { GoModel } from '../types';
import TierBadge from './TierBadge';
import { X, RefreshCw, Zap, DollarSign } from 'lucide-react';

interface CompareModalProps {
  models: GoModel[];
  isOpen: boolean;
  onClose: () => void;
}

const formatContext = (context: number): string => {
  if (context >= 1000000) return `${(context / 1000000).toFixed(0)}M`;
  if (context >= 1000) return `${(context / 1000).toFixed(0)}K`;
  return context.toString();
};

const formatCost = (cost: number): string => {
  if (cost >= 1) return `$${cost.toFixed(2)}`;
  return `$${cost.toFixed(4)}`;
};

const isHigherBetter = (metric: string): boolean => {
  const lowerIsBetter = ['costInput', 'costOutput'];
  return !lowerIsBetter.includes(metric);
};

const getBestWorst = (
  models: GoModel[],
  metric: keyof GoModel['benchmarks'] | 'contextWindow' | 'speedToksPerSec' | 'costInput' | 'costOutput'
): { best: number | null; worst: number | null } => {
  const values = models
    .map(model => {
      if (metric === 'contextWindow' || metric === 'speedToksPerSec' || metric === 'costInput' || metric === 'costOutput') {
        return model.benchmarks[metric];
      }
      return model.benchmarks[metric as keyof GoModel['benchmarks']];
    })
    .filter((v): v is number => v !== null);

  if (values.length === 0) return { best: null, worst: null };

  const higherBetter = isHigherBetter(metric);
  const best = higherBetter ? Math.max(...values) : Math.min(...values);
  const worst = higherBetter ? Math.min(...values) : Math.max(...values);

  return { best, worst: values.length > 1 ? worst : null };
};

const getValueClass = (
  value: number | null,
  best: number | null,
  worst: number | null
): string => {
  if (value === null || best === null) return 'text-text-secondary';
  if (value === best) return 'text-accent-green font-semibold';
  if (worst !== null && value === worst) return 'text-accent-red/70';
  return 'text-text-primary';
};

export const CompareModal: React.FC<CompareModalProps> = ({ models, isOpen, onClose }) => {
  if (!isOpen || models.length === 0) return null;

  const contextStats = getBestWorst(models, 'contextWindow');
  const speedStats = getBestWorst(models, 'speedToksPerSec');
  const costInputStats = getBestWorst(models, 'costInput');
  const costOutputStats = getBestWorst(models, 'costOutput');
  const sweBenchStats = getBestWorst(models, 'sweBenchVerified');
  const humanEvalStats = getBestWorst(models, 'humanEval');
  const gpqaStats = getBestWorst(models, 'gpqaDiamond');
  const mmluProStats = getBestWorst(models, 'mmluPro');
  const aimeStats = getBestWorst(models, 'aime2026');
  const eloStats = getBestWorst(models, 'lmsysElo');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-bg-card border border-border-color rounded-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-bg-card border-b border-border-color px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-semibold text-text-primary">Model Comparison</h2>
          <button
            onClick={onClose}
            className="p-2 text-text-secondary hover:text-text-primary transition-colors rounded-lg hover:bg-bg-secondary"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left text-sm font-medium text-text-secondary pb-4 pr-4 w-48">Metric</th>
                  {models.map(model => (
                    <th key={model.id} className="text-left text-sm font-medium text-text-secondary pb-4 px-4 min-w-[150px]">
                      {model.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border-color">
                <tr>
                  <td className="py-3 pr-4 text-sm text-text-secondary">Model</td>
                  {models.map(model => (
                    <td key={model.id} className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-text-primary">{model.name}</span>
                        <TierBadge tier={model.tier} size="sm" />
                      </div>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="py-3 pr-4 text-sm text-text-secondary">Provider</td>
                  {models.map(model => (
                    <td key={model.id} className="py-3 px-4 text-text-primary">{model.provider}</td>
                  ))}
                </tr>

                <tr>
                  <td className="py-3 pr-4 text-sm text-text-secondary">
                    <div className="flex items-center gap-2">
                      <RefreshCw size={14} className="text-text-secondary" />
                      Context Window
                    </div>
                  </td>
                  {models.map(model => {
                    const value = model.benchmarks.contextWindow;
                    const cellClass = getValueClass(value, contextStats.best, contextStats.worst);
                    return (
                      <td key={model.id} className={`py-3 px-4 font-mono ${cellClass}`}>
                        {value !== null ? formatContext(value) : '—'}
                      </td>
                    );
                  })}
                </tr>

                <tr>
                  <td className="py-3 pr-4 text-sm text-text-secondary">
                    <div className="flex items-center gap-2">
                      <Zap size={14} className="text-accent-yellow" />
                      Speed (tok/s)
                    </div>
                  </td>
                  {models.map(model => {
                    const value = model.benchmarks.speedToksPerSec;
                    const cellClass = getValueClass(value, speedStats.best, speedStats.worst);
                    return (
                      <td key={model.id} className={`py-3 px-4 font-mono ${cellClass}`}>
                        {value !== null ? value : '—'}
                      </td>
                    );
                  })}
                </tr>

                <tr>
                  <td className="py-3 pr-4 text-sm text-text-secondary">
                    <div className="flex items-center gap-2">
                      <DollarSign size={14} className="text-accent-green" />
                      Cost Input (per 1M)
                    </div>
                  </td>
                  {models.map(model => {
                    const value = model.benchmarks.costInput;
                    const cellClass = getValueClass(value, costInputStats.best, costInputStats.worst);
                    return (
                      <td key={model.id} className={`py-3 px-4 font-mono ${cellClass}`}>
                        {formatCost(value)}
                      </td>
                    );
                  })}
                </tr>

                <tr>
                  <td className="py-3 pr-4 text-sm text-text-secondary">
                    <div className="flex items-center gap-2">
                      <DollarSign size={14} className="text-accent-green" />
                      Cost Output (per 1M)
                    </div>
                  </td>
                  {models.map(model => {
                    const value = model.benchmarks.costOutput;
                    const cellClass = getValueClass(value, costOutputStats.best, costOutputStats.worst);
                    return (
                      <td key={model.id} className={`py-3 px-4 font-mono ${cellClass}`}>
                        {formatCost(value)}
                      </td>
                    );
                  })}
                </tr>

                <tr>
                  <td colSpan={models.length + 1} className="py-4">
                    <div className="text-xs font-medium text-text-secondary uppercase tracking-wider">Coding Benchmarks</div>
                  </td>
                </tr>

                <tr>
                  <td className="py-3 pr-4 text-sm text-text-secondary">SWE-bench Verified</td>
                  {models.map(model => {
                    const value = model.benchmarks.sweBenchVerified;
                    const cellClass = getValueClass(value, sweBenchStats.best, sweBenchStats.worst);
                    return (
                      <td key={model.id} className={`py-3 px-4 font-mono ${cellClass}`}>
                        {value !== null ? value.toFixed(1) : '—'}
                      </td>
                    );
                  })}
                </tr>

                <tr>
                  <td className="py-3 pr-4 text-sm text-text-secondary">HumanEval</td>
                  {models.map(model => {
                    const value = model.benchmarks.humanEval;
                    const cellClass = getValueClass(value, humanEvalStats.best, humanEvalStats.worst);
                    return (
                      <td key={model.id} className={`py-3 px-4 font-mono ${cellClass}`}>
                        {value !== null ? value.toFixed(1) : '—'}
                      </td>
                    );
                  })}
                </tr>

                <tr>
                  <td colSpan={models.length + 1} className="py-4">
                    <div className="text-xs font-medium text-text-secondary uppercase tracking-wider">Reasoning Benchmarks</div>
                  </td>
                </tr>

                <tr>
                  <td className="py-3 pr-4 text-sm text-text-secondary">GPQA Diamond</td>
                  {models.map(model => {
                    const value = model.benchmarks.gpqaDiamond;
                    const cellClass = getValueClass(value, gpqaStats.best, gpqaStats.worst);
                    return (
                      <td key={model.id} className={`py-3 px-4 font-mono ${cellClass}`}>
                        {value !== null ? value.toFixed(1) : '—'}
                      </td>
                    );
                  })}
                </tr>

                <tr>
                  <td className="py-3 pr-4 text-sm text-text-secondary">MMLU-Pro</td>
                  {models.map(model => {
                    const value = model.benchmarks.mmluPro;
                    const cellClass = getValueClass(value, mmluProStats.best, mmluProStats.worst);
                    return (
                      <td key={model.id} className={`py-3 px-4 font-mono ${cellClass}`}>
                        {value !== null ? value.toFixed(1) : '—'}
                      </td>
                    );
                  })}
                </tr>

                <tr>
                  <td colSpan={models.length + 1} className="py-4">
                    <div className="text-xs font-medium text-text-secondary uppercase tracking-wider">Math Benchmarks</div>
                  </td>
                </tr>

                <tr>
                  <td className="py-3 pr-4 text-sm text-text-secondary">AIME 2026</td>
                  {models.map(model => {
                    const value = model.benchmarks.aime2026;
                    const cellClass = getValueClass(value, aimeStats.best, aimeStats.worst);
                    return (
                      <td key={model.id} className={`py-3 px-4 font-mono ${cellClass}`}>
                        {value !== null ? value.toFixed(1) : '—'}
                      </td>
                    );
                  })}
                </tr>

                <tr>
                  <td colSpan={models.length + 1} className="py-4">
                    <div className="text-xs font-medium text-text-secondary uppercase tracking-wider">Arena</div>
                  </td>
                </tr>

                <tr>
                  <td className="py-3 pr-4 text-sm text-text-secondary">LMSYS Elo</td>
                  {models.map(model => {
                    const value = model.benchmarks.lmsysElo;
                    const cellClass = getValueClass(value, eloStats.best, eloStats.worst);
                    return (
                      <td key={model.id} className={`py-3 px-4 font-mono ${cellClass}`}>
                        {value !== null ? value.toFixed(0) : '—'}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompareModal;