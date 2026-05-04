import React from 'react';
import { Brain, Code, Zap, Rocket } from 'lucide-react';
import { ModelTier } from '../types';

interface TierBadgeProps {
  tier: ModelTier;
  size?: 'sm' | 'md';
}

const tierConfig = {
  'complex-reasoning': {
    icon: Brain,
    color: 'bg-accent-purple/20 text-accent-purple border-accent-purple/30',
    label: 'Opus-class',
  },
  'coding': {
    icon: Code,
    color: 'bg-accent-blue/20 text-accent-blue border-accent-blue/30',
    label: 'Opus-class',
  },
  'general-purpose': {
    icon: Zap,
    color: 'bg-accent-green/20 text-accent-green border-accent-green/30',
    label: 'Sonnet-class',
  },
  'fast-tasks': {
    icon: Rocket,
    color: 'bg-accent-yellow/20 text-accent-yellow border-accent-yellow/30',
    label: 'Haiku-class',
  },
};

const claudeLabel = {
  'opus-4.6': 'Opus 4.6',
  'sonnet-4.6': 'Sonnet 4.6',
  'haiku': 'Haiku',
};

export const TierBadge: React.FC<TierBadgeProps> = ({ tier, size = 'md' }) => {
  const config = tierConfig[tier.task];
  const Icon = config.icon;
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';
  
  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full border ${config.color} ${sizeClasses}`}>
      <Icon size={size === 'sm' ? 12 : 14} />
      <span className="font-medium">{claudeLabel[tier.claudeComparison]}</span>
    </div>
  );
};

export default TierBadge;