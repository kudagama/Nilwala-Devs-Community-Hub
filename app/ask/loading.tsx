export default function AskLoading() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 animate-pulse">
      {/* Header */}
      <div className="mb-10 space-y-3">
        <div className="h-10 w-64 bg-white/10 rounded-2xl" />
        <div className="h-4 w-80 bg-white/5 rounded-lg" />
      </div>

      {/* Step Progress Bar */}
      <div className="flex items-center gap-1 mb-10">
        {[1, 2, 3, 4].map((_, i) => (
          <div key={i} className="flex items-center flex-1">
            <div
              className={`h-9 rounded-xl flex-1 ${
                i === 0
                  ? "bg-indigo-600/40"
                  : "bg-white/5 border border-white/5"
              }`}
            />
            {i < 3 && <div className="h-px w-2 bg-white/10" />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Main Form Skeleton */}
        <div className="lg:col-span-3">
          <div className="bg-white/[0.03] border border-white/10 rounded-3xl overflow-hidden">
            {/* Step Header */}
            <div className="px-8 pt-8 pb-6 border-b border-white/5 flex items-center gap-3">
              <div className="h-10 w-10 bg-indigo-500/20 rounded-xl" />
              <div className="space-y-2">
                <div className="h-5 w-40 bg-white/10 rounded-lg" />
                <div className="h-3 w-56 bg-white/5 rounded" />
              </div>
            </div>

            {/* Content */}
            <div className="p-8 space-y-4">
              <div className="h-16 bg-indigo-500/5 border border-indigo-500/10 rounded-xl" />
              <div className="h-12 bg-white/5 border border-white/10 rounded-xl" />
              <div className="flex justify-between">
                <div className="h-3 w-36 bg-white/5 rounded" />
                <div className="h-3 w-16 bg-white/5 rounded" />
              </div>
            </div>

            {/* Navigation */}
            <div className="px-8 pb-8 flex justify-between">
              <div className="h-10 w-24 bg-white/5 border border-white/10 rounded-xl" />
              <div className="h-10 w-28 bg-indigo-600/30 rounded-xl" />
            </div>
          </div>
        </div>

        {/* Side Panel Skeleton */}
        <div className="lg:col-span-2 space-y-4">
          {/* Preview */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-4">
            <div className="h-3 w-24 bg-white/5 rounded" />
            <div className="h-5 w-3/4 bg-white/10 rounded-xl" />
            <div className="space-y-2">
              <div className="h-3 w-full bg-white/5 rounded" />
              <div className="h-3 w-4/5 bg-white/5 rounded" />
              <div className="h-3 w-3/5 bg-white/5 rounded" />
            </div>
            <div className="flex gap-2">
              <div className="h-5 w-14 bg-indigo-500/10 rounded-md" />
              <div className="h-5 w-18 bg-indigo-500/10 rounded-md" />
            </div>
          </div>

          {/* Tips */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-3">
            <div className="h-3 w-24 bg-white/5 rounded" />
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-2.5 items-center">
                <div className="h-4 w-4 rounded-full bg-white/5 shrink-0" />
                <div className="h-3 bg-white/5 rounded flex-1" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
