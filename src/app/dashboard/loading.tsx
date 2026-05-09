export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      <div className="mb-8">
        <div className="h-10 bg-slate-200 rounded-lg w-1/3 mb-2"></div>
        <div className="h-4 bg-slate-200 rounded-lg w-1/4"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-panel p-6 flex flex-col gap-4">
            <div className="w-12 h-12 bg-slate-200 rounded-2xl"></div>
            <div>
              <div className="h-4 bg-slate-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-slate-200 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-panel h-96 bg-slate-100/50"></div>
        <div className="glass-panel h-96 bg-slate-100/50"></div>
      </div>
    </div>
  );
}
