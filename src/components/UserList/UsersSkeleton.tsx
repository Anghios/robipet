import { Icon } from '@iconify/react';

export default function UsersSkeleton() {
  return (
    <div className="p-6 space-y-8">
      <div className="bg-dark-secondary rounded-xl p-6">
        <div className="h-6 bg-dark-card rounded w-32 mb-4 animate-pulse"></div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 h-10 bg-dark-card rounded animate-pulse"></div>
          <div className="h-10 w-20 bg-dark-card rounded animate-pulse"></div>
          <div className="h-10 w-28 bg-dark-card rounded animate-pulse"></div>
        </div>
      </div>

      <div className="bg-dark-secondary rounded-xl p-6">
        <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-40 mb-4 animate-pulse"></div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 h-10 bg-dark-card rounded animate-pulse"></div>
          <div className="flex-1 h-10 bg-dark-card rounded animate-pulse"></div>
          <div className="h-10 w-32 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
        </div>
      </div>

      <div>
        <div className="h-6 bg-dark-card rounded w-36 mb-4 animate-pulse"></div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-dark-card border border-dark rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="h-5 bg-dark-secondary rounded w-24 animate-pulse"></div>
                <div className="h-5 bg-dark-secondary rounded w-16 animate-pulse"></div>
              </div>
              <div className="h-4 bg-dark-secondary rounded w-32 mb-2 animate-pulse"></div>
              <div className="h-3 bg-dark-secondary rounded w-20 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}