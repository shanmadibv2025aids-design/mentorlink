import React from 'react';
import { AlertTriangle, RefreshCw, Home, Terminal } from 'lucide-react';
import { API_BASE_URL } from '../../services/api';

interface ErrorPageProps {
  title?: string;
  message?: string;
  endpoint?: string;
  onRetry?: () => void;
}

export const ErrorPage: React.FC<ErrorPageProps> = ({
  title = 'API Network Error',
  message = 'Could not reach backend endpoint. Ensure backend server is running on http://localhost:8000 or check network configuration.',
  endpoint,
  onRetry,
}) => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="p-4 rounded-3xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 mb-4 animate-bounce">
        <AlertTriangle className="w-10 h-10" />
      </div>

      <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
        {title}
      </h2>

      <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mb-4 leading-relaxed">
        {message}
      </p>

      {endpoint && (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300 mb-6">
          <Terminal className="w-3.5 h-3.5 text-indigo-500" />
          <span>Endpoint: {endpoint}</span>
        </div>
      )}

      <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/50 dark:border-indigo-800/30 text-left max-w-md w-full mb-6">
        <p className="text-xs font-semibold text-indigo-900 dark:text-indigo-300 mb-1">
          💡 Developer Note:
        </p>
        <p className="text-xs text-indigo-700/80 dark:text-indigo-300/80">
          The app is configured to fetch data from <code className="font-semibold">{API_BASE_URL}</code>. In fallback preview mode, MentorLink automatically serves structured mock responses so you can explore all features smoothly!
        </p>
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-all shadow-md shadow-indigo-500/20"
          >
            <RefreshCw className="w-4 h-4" />
            Retry API Request
          </button>
        )}

        <a
          href="/"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium text-sm transition-colors"
        >
          <Home className="w-4 h-4" />
          Return to Explore
        </a>
      </div>
    </div>
  );
};
