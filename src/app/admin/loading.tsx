export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      <div className="mb-8">
        <div className="h-10 bg-slate-200 rounded-lg w-1/3 mb-2"></div>
        <div className="h-4 bg-slate-200 rounded-lg w-1/4"></div>
      </div>

      <div className="glass-panel p-6">
        <div className="h-8 bg-slate-200 rounded-lg w-1/4 mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-slate-100 rounded-xl"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
