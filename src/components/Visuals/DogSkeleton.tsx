export default function DogSkeleton() {
  return (
    <div className="flex-1 bg-slate-900">
      {/* Header skeleton */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-800 rounded-lg animate-pulse"></div>
              <div className="h-5 w-16 bg-slate-800 rounded animate-pulse hidden sm:block"></div>
              <div className="h-6 w-px bg-slate-700 mx-1"></div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-slate-800 rounded-full animate-pulse"></div>
                <div className="h-4 w-20 bg-slate-800 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-slate-800 rounded-lg animate-pulse"></div>
              <div className="w-9 h-9 bg-slate-800 rounded-lg animate-pulse"></div>
              <div className="w-9 h-9 bg-slate-800 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {/* Section nav skeleton */}
        <div className="mb-6 flex gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 w-24 bg-slate-800 rounded-xl animate-pulse"></div>
          ))}
        </div>

        {/* Content skeleton */}
        <div className="min-h-[60vh] space-y-6">
          <div className="h-32 bg-slate-800/50 rounded-xl animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-48 bg-slate-800/50 rounded-xl animate-pulse"></div>
            <div className="h-48 bg-slate-800/50 rounded-xl animate-pulse"></div>
          </div>
          <div className="h-40 bg-slate-800/50 rounded-xl animate-pulse"></div>
        </div>
      </main>
    </div>
  );
}