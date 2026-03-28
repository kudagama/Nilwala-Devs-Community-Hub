export default function HomeLoading() {
  return (
    <div className="min-h-screen animate-pulse">
      {/* Hero Section Skeleton */}
      <div className="relative border-b border-white/5 py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Badge */}
            <div className="mx-auto h-7 w-40 bg-indigo-500/10 border border-indigo-500/10 rounded-full" />
            {/* Headline */}
            <div className="space-y-4 py-2">
              <div className="mx-auto h-14 w-3/4 bg-white/10 rounded-2xl" />
              <div className="mx-auto h-14 w-1/2 bg-indigo-500/10 rounded-2xl" />
            </div>
            {/* Sub */}
            <div className="space-y-2 max-w-md mx-auto">
              <div className="mx-auto h-4 w-full bg-white/5 rounded-lg" />
              <div className="mx-auto h-4 w-4/5 bg-white/5 rounded-lg" />
            </div>
            {/* Buttons */}
            <div className="flex items-center justify-center gap-4 pt-2">
              <div className="h-12 w-44 bg-indigo-600/30 rounded-2xl" />
              <div className="h-12 w-44 bg-white/5 border border-white/10 rounded-2xl" />
            </div>
          </div>

          {/* Stats Row */}
          <div className="mt-16 grid grid-cols-3 gap-4 max-w-lg mx-auto">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-center"
              >
                <div className="h-8 w-8 rounded-xl bg-white/10 mx-auto mb-2" />
                <div className="h-6 w-10 bg-white/10 rounded-lg mx-auto mb-1" />
                <div className="h-3 w-16 bg-white/5 rounded mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feed Section Skeleton */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="space-y-2">
            <div className="h-7 w-48 bg-white/10 rounded-xl" />
            <div className="h-4 w-32 bg-white/5 rounded-lg" />
          </div>
          <div className="h-10 w-64 bg-white/5 border border-white/10 rounded-xl" />
        </div>

        {/* Question Card Skeletons */}
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex flex-col sm:flex-row gap-6 rounded-2xl border border-white/5 bg-white/[0.02] p-6"
              style={{ opacity: 1 - (i - 1) * 0.15 }}
            >
              {/* Metrics Sidebar Skeleton */}
              <div className="flex sm:flex-col sm:items-end gap-5 sm:gap-3 shrink-0 w-24">
                <div className="flex flex-col items-end gap-1">
                  <div className="h-6 w-8 bg-white/10 rounded" />
                  <div className="h-3 w-10 bg-white/5 rounded" />
                </div>
                <div className="h-14 w-full bg-white/5 rounded-lg" />
              </div>

              {/* Content Skeleton */}
              <div className="flex-1 space-y-3">
                <div className="h-6 w-3/4 bg-indigo-500/10 rounded-xl" />
                <div className="space-y-2">
                  <div className="h-3.5 w-full bg-white/5 rounded" />
                  <div className="h-3.5 w-5/6 bg-white/5 rounded" />
                </div>
                <div className="pt-2 flex justify-between items-center">
                  <div className="flex gap-2">
                    <div className="h-6 w-16 bg-indigo-500/10 border border-indigo-500/10 rounded-lg" />
                    <div className="h-6 w-20 bg-indigo-500/10 border border-indigo-500/10 rounded-lg" />
                  </div>
                  <div className="h-7 w-32 bg-white/5 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
