import React from 'react';

export const LoadingSkeleton: React.FC<{ type?: 'grid' | 'card' | 'list' | 'profile' }> = ({ type = 'grid' }) => {
  if (type === 'card') {
    return (
      <div className="p-6 rounded-3xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 shadow-sm animate-pulse space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-200 dark:bg-slate-800 shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-3/4" />
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-md w-1/2" />
          </div>
        </div>
        <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        <div className="flex gap-2">
          <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-full w-16" />
          <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-full w-20" />
        </div>
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="p-4 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 shadow-sm animate-pulse flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded-md w-1/3" />
                <div className="h-2.5 bg-slate-200 dark:bg-slate-800 rounded-md w-1/4" />
              </div>
            </div>
            <div className="w-24 h-8 bg-slate-200 dark:bg-slate-800 rounded-xl shrink-0" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'profile') {
    return (
      <div className="p-8 rounded-3xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 shadow-sm animate-pulse space-y-6">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0" />
          <div className="space-y-3 flex-1">
            <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-md w-1/3" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-1/4" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-md w-full" />
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-md w-5/6" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((n) => (
        <LoadingSkeleton key={n} type="card" />
      ))}
    </div>
  );
};
