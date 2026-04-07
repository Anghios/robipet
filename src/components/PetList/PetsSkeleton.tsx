import PetsCompactHeader from './PetsCompactHeader';

export default function PetsSkeleton() {
  return (
    <div className="flex-1 bg-slate-900">
      {/* Header */}
      <PetsCompactHeader />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {/* Button skeleton */}
        <div className="mb-6">
          <div className="h-10 w-40 bg-slate-800 rounded-xl animate-pulse"></div>
        </div>

        {/* Title skeleton */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-7 h-7 bg-slate-800 rounded animate-pulse"></div>
          <div className="h-7 w-48 bg-slate-800 rounded animate-pulse"></div>
        </div>

        {/* Cards grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-slate-700 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-5 bg-slate-700 rounded mb-2 animate-pulse"></div>
                  <div className="h-3 bg-slate-700 rounded w-2/3 animate-pulse"></div>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="flex justify-between">
                    <div className="h-3 bg-slate-700 rounded w-1/3 animate-pulse"></div>
                    <div className="h-3 bg-slate-700 rounded w-1/4 animate-pulse"></div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <div className="h-8 bg-slate-700 rounded-lg flex-1 animate-pulse"></div>
                <div className="h-8 bg-slate-700 rounded-lg flex-1 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}