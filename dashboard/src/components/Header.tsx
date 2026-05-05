import React from 'react';
import { RefreshCw, Github } from 'lucide-react';

interface HeaderProps {
  lastUpdated: string;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const Header: React.FC<HeaderProps> = ({ lastUpdated, onRefresh, isRefreshing }) => {
  const formattedDate = new Date(lastUpdated).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <header className="border-b border-border-color bg-bg-secondary/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-accent-blue rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">Go</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-text-primary">OpenCode Go Dashboard</h1>
              <p className="text-xs text-text-secondary">Model benchmarks & usage limits</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-text-secondary hidden sm:inline">
              Updated: {formattedDate}
            </span>
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              aria-label="Refresh dashboard data"
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-bg-card border border-border-color rounded-lg text-sm text-text-primary hover:border-accent-blue/50 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} aria-hidden="true" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <a
              href="https://github.com/ezemriv/My-OpenCode"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View source on GitHub"
              className="p-2 text-text-secondary hover:text-text-primary transition-colors flex items-center justify-center min-w-[44px] min-h-[44px]"
            >
              <Github size={18} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;