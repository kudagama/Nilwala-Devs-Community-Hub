import Link from "next/link";
import { Search, Plus } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/40 backdrop-blur-xl supports-[backdrop-filter]:bg-black/20 shadow-sm shadow-black/50 transition-all duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="group flex items-center gap-2">
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent transform group-hover:scale-105 transition-transform duration-300">
              SE Community Hub
            </span>
          </Link>

          {/* Search bar for larger screens */}
          <div className="hidden md:block relative w-[400px]">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-zinc-500 transition-colors group-focus-within:text-indigo-400" />
            </div>
            <input
              type="text"
              className="group peer block w-full rounded-full border border-white/10 bg-white/5 py-2 pl-10 pr-4 text-sm text-zinc-200 placeholder-zinc-500 backdrop-blur-md focus:border-indigo-500/50 focus:bg-white/10 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all duration-300"
              placeholder="Search questions, tags, or users..."
            />
          </div>
        </div>

        <div className="flex items-center gap-5">
          <Link
            href="/ask"
            className="group relative flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 sm:px-5 sm:py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-500 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 overflow-hidden"
          >
            {/* Glossy shine effect */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shimmer" />
            
            <Plus className="h-4 w-4 drop-shadow-sm" />
            <span className="hidden sm:inline drop-shadow-sm">Post a Question</span>
            <span className="sm:hidden">Ask</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
