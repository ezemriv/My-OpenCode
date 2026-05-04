import React, { useState } from 'react';
import { GoModel } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { BarChart3, ChevronDown, ChevronUp } from 'lucide-react';

interface BenchmarkChartProps {
  models: GoModel[];
}

type MetricKey = 'humanEval' | 'mmlu' | 'lmsysElo' | 'costPer1kTokens';

const metricConfig: Record<MetricKey, { label: string; color: string; domain?: [number, number] }> = {
  humanEval: { label: 'HumanEval (%)', color: '#3b82f6', domain: [0, 100] },
  mmlu: { label: 'MMLU (%)', color: '#22c55e', domain: [0, 100] },
  lmsysElo: { label: 'LMSYS Elo', color: '#a855f7', domain: [1000, 1400] },
  costPer1kTokens: { label: 'Cost/1k tokens ($)', color: '#eab308', domain: [0, 0.02] },
};

export const BenchmarkChart: React.FC<BenchmarkChartProps> = ({ models }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeMetric, setActiveMetric] = useState<MetricKey>('humanEval');

  const data = models
    .map(model => ({
      name: model.name,
      value: model.benchmarks[activeMetric] || 0,
      tier: model.tier.task,
    }))
    .sort((a, b) => b.value - a.value);

  const config = metricConfig[activeMetric];

  return (
    <div className="bg-bg-secondary border-y border-border-color">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        aria-controls="benchmark-chart-panel"
        type="button"
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between text-left hover:bg-bg-card/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <BarChart3 size={16} className="text-accent-blue" />
          <span className="text-sm font-medium text-text-primary">Benchmark Comparison</span>
          <span className="text-xs text-text-secondary">(click to expand)</span>
        </div>
        {isExpanded ? <ChevronUp size={16} className="text-text-secondary" /> : <ChevronDown size={16} className="text-text-secondary" />}
      </button>

      {isExpanded && (
        <div id="benchmark-chart-panel" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
          {models.length === 0 ? (
            <div className="text-center py-12 text-text-secondary text-sm">
              No models to display. Adjust filters to see benchmarks.
            </div>
          ) : (
            <>
              {/* Metric Selector */}
              <div className="flex gap-2 mb-4">
                {(Object.keys(metricConfig) as MetricKey[]).map(metric => (
                  <button
                    key={metric}
                    onClick={() => setActiveMetric(metric)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      activeMetric === metric
                        ? 'bg-accent-blue/20 text-accent-blue border border-accent-blue/30'
                        : 'bg-bg-card text-text-secondary border border-border-color hover:border-accent-blue/30'
                    }`}
                  >
                    {metricConfig[metric].label}
                  </button>
                ))}
              </div>

              {/* Chart */}
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#888888" 
                      fontSize={10}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis 
                      stroke="#888888" 
                      fontSize={10}
                      domain={config.domain}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e1e1e',
                        border: '1px solid #2a2a2a',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                      labelStyle={{ color: '#e0e0e0' }}
                      itemStyle={{ color: '#e0e0e0' }}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {data.map((entry) => (
                        <Cell key={`cell-${entry.name}`} fill={config.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default BenchmarkChart;