export default function PetsSkeleton() {
  return (
    <div className="min-h-screen bg-dark-primary p-6">
      <div className="mb-8">
        <div className="h-10 w-64 bg-dark-secondary rounded-xl mb-4 animate-pulse"></div>
        <div className="h-6 w-96 bg-dark-secondary rounded-lg animate-pulse"></div>
      </div>

      <div className="mb-8 text-center">
        <div className="h-12 w-48 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl mx-auto animate-pulse"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gradient-card border border-dark-hover rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl animate-pulse"></div>
              <div className="flex-1">
                <div className="h-6 bg-dark-secondary rounded-lg mb-2 animate-pulse"></div>
                <div className="h-4 bg-dark-secondary rounded w-3/4 animate-pulse"></div>
              </div>
            </div>
            <div className="space-y-3 mb-6">
              {[...Array(4)].map((_, j) => (
                <div key={j} className="flex justify-between">
                  <div className="h-4 bg-dark-secondary rounded w-1/3 animate-pulse"></div>
                  <div className="h-4 bg-dark-secondary rounded w-1/4 animate-pulse"></div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <div className="h-10 bg-blue-500 rounded-xl flex-1 animate-pulse"></div>
              <div className="h-10 bg-purple-500 rounded-xl flex-1 animate-pulse"></div>
              <div className="h-10 bg-red-500 rounded-xl flex-1 animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}