import { User as UserIcon, MessageSquare, ArrowBigUp } from "lucide-react";

export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse">
      <div className="absolute top-10 right-20 w-72 h-72 bg-indigo-600/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

      {/* Question Skeleton */}
      <div className="mb-12">
        <div className="h-10 bg-white/10 rounded-xl w-3/4 mb-6" />

        <div className="flex flex-col sm:flex-row gap-6 mb-10">
          {/* Vote Sidebar Skeleton */}
          <div className="flex sm:flex-col items-center gap-3 shrink-0">
             <div className="p-2 rounded-lg bg-white/5 border border-white/10 w-12 h-12" />
             <div className="h-6 w-6 bg-white/10 rounded" />
             <div className="p-2 rounded-lg bg-white/5 border border-white/10 w-12 h-12" />
          </div>

          <div className="flex-1">
             <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 sm:p-8 mb-6 h-48 ml-auto" />

             <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                   {[1, 2, 3].map((i) => (
                      <div key={i} className="h-6 w-16 bg-white/5 rounded-lg border border-white/5" />
                   ))}
                </div>

                <div className="h-12 w-40 bg-indigo-600/5 border border-indigo-500/10 rounded-xl" />
             </div>
          </div>
        </div>
      </div>

      {/* Answers Skeleton */}
      <div className="border-t border-white/10 pt-10">
        <div className="flex items-center gap-3 mb-8">
           <MessageSquare className="h-6 w-6 text-zinc-600" />
           <div className="h-8 w-32 bg-white/10 rounded-lg" />
        </div>

        <div className="space-y-6">
           {[1, 2].map((i) => (
              <div key={i} className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 h-32" />
           ))}
        </div>
      </div>
    </div>
  );
}
