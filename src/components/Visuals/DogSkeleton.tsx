export default function DogSkeleton() {
  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <header className="mb-8 p-8 bg-gradient-dark rounded-3xl shadow-2xl">
        <div className="flex items-center gap-8 max-md:flex-col max-md:text-center">
          <div className="w-32 h-32 bg-white/20 rounded-full animate-pulse flex items-center justify-center">
            <div className="w-24 h-24 bg-white/30 rounded-full animate-pulse"></div>
          </div>
          <div className="flex-1">
            <div className="h-12 w-64 bg-white/20 rounded-xl mb-4 animate-pulse"></div>
            <div className="h-6 w-48 bg-white/20 rounded-lg mb-6 animate-pulse"></div>
            <div className="flex gap-4 max-md:justify-center">
              <div className="h-8 w-24 bg-white/20 rounded-full animate-pulse"></div>
              <div className="h-8 w-32 bg-white/20 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>

      <nav className="mb-8 p-2 bg-slate-800 rounded-2xl border border-slate-700">
        <div className="flex gap-1">
          <div className="flex-1 h-12 bg-slate-700 rounded-xl animate-pulse"></div>
          <div className="flex-1 h-12 bg-slate-800 rounded-xl animate-pulse"></div>
          <div className="flex-1 h-12 bg-slate-800 rounded-xl animate-pulse"></div>
          <div className="flex-1 h-12 bg-slate-800 rounded-xl animate-pulse"></div>
        </div>
      </nav>

      <main className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="h-48 bg-slate-800 rounded-2xl animate-pulse"></div>
          <div className="h-40 bg-slate-800 rounded-2xl animate-pulse"></div>
        </div>
        <div className="space-y-6">
          <div className="h-64 bg-slate-800 rounded-2xl animate-pulse"></div>
          <div className="h-48 bg-slate-800 rounded-2xl animate-pulse"></div>
        </div>
      </main>
    </div>
  );
}