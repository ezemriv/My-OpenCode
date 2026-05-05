import React, { useState } from 'react';
import { GoModel } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ChevronDown, ChevronUp, BarChart3 } from 'lucide-react';

interface UsageLimitsProps {
  models: GoModel[];
}

const taskColors: Record<string, string> = {
  'complex-reasoning': '#a855f7',
  'coding': '#3b82f6',
  'general-purpose': '#22c55e',
  'fast-tasks': '#eab308',
};

const taskLabels: Record<string, string> = {
  'complex-reasoning': 'Complex Reasoning',
  'coding': 'Coding',
  'general-purpose': 'General Purpose',
  'fast-tasks': 'Fast Tasks',
};

interface TooltipPayloadItem {
  name: string;
  value: number;
  payload: {
    name: string;
    requests: number;
    tier: string;
  };
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div
        className="bg-bg-card border border-border-color rounded-lg p-3 shadow-lg"
        style={{ fontSize: '12px' }}
      >
        <p className="font-medium text-text-primary mb-1">{data.name}</p>
        <p className="text-text-secondary">
          Requests: <span className="text-text-primary font-mono">{data.requests.toLocaleString()}</span>
        </p>
        <p className="text-text-secondary">
          Tier: <span style={{ color: taskColors[data.tier] || '#888' }}>{taskLabels[data.tier] || data.tier}</span>
        </p>
      </div>
    );
  }
  return null;
};

export const UsageLimits: React.FC<UsageLimitsProps> = ({ models }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const data = models
    .map(model => ({
      name: model.name,
      requests: model.limits.requestsPer5h,
      tier: model.tier.task,
    }))
    .sort((a, b) => b.requests - a.requests);

  const chartHeight = Math.max(models.length * 30, 400);

  return (
    <div className="bg-bg-secondary border-y border-border-color">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        aria-controls="usage-limits-panel"
        type="button"
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between text-left hover:bg-bg-card/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <BarChart3 size={16} className="text-accent-blue" />
          <span className="text-sm font-medium text-text-primary">Usage Limits</span>
          <span className="text-xs text-text-secondary">(click to expand)</span>
        </div>
        {isExpanded ? <ChevronUp size={16} className="text-text-secondary" /> : <ChevronDown size={16} className="text-text-secondary" />}
      </button>

      {isExpanded && (
        <div id="usage-limits-panel" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
          {models.length === 0 ? (
            <div className="text-center py-12 text-text-secondary text-sm">
              No models to display.
            </div>
          ) : (
            <>
              <div className="flex flex-wrap gap-3 mb-4">
                {Object.entries(taskLabels).map(([task, label]) => (
                  <div key={task} className="flex items-center gap-1.5">
                    <div
                      className="w-3 h-3 rounded-sm"
                      style={{ backgroundColor: taskColors[task] }}
                    />
                    <span className="text-xs text-text-secondary">{label}</span>
                  </div>
                ))}
              </div>

              <div style={{ height: chartHeight }} className="w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={data}
                    margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" horizontal={false} />
                    <XAxis
                      type="number"
                      stroke="#888888"
                      fontSize={10}
                      tickFormatter={(value) => value.toLocaleString()}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      stroke="#888888"
                      fontSize={10}
                      width={120}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="requests" radius={[0, 4, 4, 0]}>
                      {data.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={taskColors[entry.tier] || '#888'}
                        />
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

export default UsageLimits;
