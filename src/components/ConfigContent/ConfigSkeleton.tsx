export default function ConfigSkeleton() {
  return (
    <div className="flex gap-8">
      <aside className="w-64 bg-dark-card rounded-2xl shadow-xl border border-dark p-6 h-fit">
        <div className="animate-pulse space-y-2">
          <div className="h-10 bg-dark-secondary rounded-lg"></div>
          <div className="h-10 bg-dark-secondary rounded-lg"></div>
        </div>
      </aside>
      <div className="flex-1 bg-dark-card rounded-2xl shadow-xl border border-dark p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-dark-secondary rounded-lg w-1/3 mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-dark-secondary rounded w-full"></div>
            <div className="h-4 bg-dark-secondary rounded w-3/4"></div>
            <div className="h-4 bg-dark-secondary rounded w-1/2"></div>
          </div>
        </div>
      </div>
    </div>
  );
}