import Link from "next/link";
import { Search, Plus, LogOut, User as UserIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { signInWithGoogle, signOut } from "@/app/auth/actions";
import Image from "next/image";

export default async function Navbar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

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

        <div className="flex items-center gap-4">
          <Link
            href="/ask"
            className="group relative flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 sm:px-5 sm:py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-500 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shimmer" />
            <Plus className="h-4 w-4 drop-shadow-sm" />
            <span className="hidden sm:inline">Post a Question</span>
            <span className="sm:hidden">Ask</span>
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              {/* Profile Shortcut */}
              <div className="flex items-center gap-2 rounded-full bg-white/5 border border-white/10 pl-1 pr-3 py-1 hover:bg-white/10 transition-all duration-300 cursor-pointer group">
                <div className="relative h-7 w-7 rounded-full overflow-hidden border border-indigo-400/30">
                  {user.user_metadata.avatar_url ? (
                    <Image
                      src={user.user_metadata.avatar_url}
                      alt="User Avatar"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <UserIcon className="h-4 w-4 m-auto mt-1.5 text-indigo-300" />
                  )}
                </div>
                <span className="text-xs font-bold text-zinc-300 group-hover:text-white transition-colors">
                  {user.user_metadata.name || user.email?.split("@")[0]}
                </span>
              </div>

              {/* Log out */}
              <form action={signOut}>
                <button
                  type="submit"
                  title="Sign Out"
                  className="p-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-300 group"
                >
                  <LogOut className="h-4 w-4 transform group-hover:scale-110 transition-transform" />
                </button>
              </form>
            </div>
          ) : (
            <form action={signInWithGoogle}>
              <button
                type="submit"
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-zinc-300 hover:bg-white/10 hover:border-indigo-500/30 hover:text-white transition-all duration-300 group shadow-lg shadow-black/20"
              >
                {/* Google SVG Icon Icon */}
                <svg className="h-4 w-4" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.64,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                  <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                  <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                  <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                </svg>
                Sign in with Google
              </button>
            </form>
          )}
        </div>
      </div>
    </nav>
  );
}
