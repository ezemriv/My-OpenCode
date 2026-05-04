import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Clock, Calendar, Timer } from 'lucide-react';

interface UsageLimitsProps {
  costPer5h: number;
  costPerWeek: number;
  costPerMonth: number;
}

interface LimitCardProps {
  icon: React.ReactNode;
  period: string;
  cost: number;
  color: string;
}

const LimitCard: React.FC<LimitCardProps> = ({ icon, period, cost, color }) => (
  <div className="bg-bg-card border border-border-color rounded-xl p-4 flex items-center gap-4">
    <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}>
      {icon}
    </div>
    <div>
      <p className="text-xs text-text-secondary uppercase tracking-wider">{period}</p>
      <p className="text-2xl font-bold font-mono text-text-primary">${cost}</p>
    </div>
  </div>
);

export const UsageLimits: React.FC<UsageLimitsProps> = ({ costPer5h, costPerWeek, costPerMonth }) => {
  const [isExpanded, setIsExpanded] = useState(false);

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
          <Timer size={16} className="text-accent-blue" />
          <span className="text-sm font-medium text-text-primary">Usage Limits</span>
          <span className="text-xs text-text-secondary">(click to expand)</span>
        </div>
        {isExpanded ? <ChevronUp size={16} className="text-text-secondary" /> : <ChevronDown size={16} className="text-text-secondary" />}
      </button>

      {isExpanded && (
        <div id="usage-limits-panel" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <LimitCard
              icon={<Clock size={18} className="text-accent-blue" />}
              period="Per 5 Hours"
              cost={costPer5h}
              color="bg-accent-blue/20"
            />
            <LimitCard
              icon={<Calendar size={18} className="text-accent-green" />}
              period="Per Week"
              cost={costPerWeek}
              color="bg-accent-green/20"
            />
            <LimitCard
              icon={<Timer size={18} className="text-accent-purple" />}
              period="Per Month"
              cost={costPerMonth}
              color="bg-accent-purple/20"
            />
          </div>
          <p className="mt-3 text-xs text-text-secondary">
            Limits are defined in dollar value. Actual request count depends on the model used.
            Cheaper models allow more requests. When limits are reached, you can continue using free models or top up credits.
          </p>
        </div>
      )}
    </div>
  );
};

export default UsageLimits;