"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { createQuestion } from "../actions";

export default function AskQuestion() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        await createQuestion(formData);
        router.push("/");
      } catch (error) {
        console.error("Failed to post question:", error);
        alert("Failed to post your question. Please try again.");
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 relative">
      
      {/* Decorative Blur Bubble */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] -z-10 pointer-events-none animate-pulse" />

      <div className="mb-10 pl-2 border-l-4 border-indigo-500 rounded-sm">
        <h1 className="text-4xl font-extrabold text-white tracking-tight leading-tight">
          Ask a Public Question
        </h1>
        <p className="text-zinc-400 mt-2 font-light">
          Get help from thousands of developers around the world.
        </p>
      </div>

      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-black/60 relative overflow-hidden">
        
        {/* Subtle inner top glow */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          
          <div className="space-y-3 group">
            <div>
              <label htmlFor="title" className="block text-base font-bold text-zinc-100 tracking-wide mb-1">
                Title
              </label>
              <p className="text-sm text-zinc-500 font-medium">
                Be specific and imagine you&apos;re asking a question to another person.
              </p>
            </div>
            <input
              type="text"
              id="title"
              name="title"
              required
              placeholder="e.g. How to leverage Server Actions in Next.js 15?"
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3.5 text-base text-zinc-200 placeholder-zinc-600 focus:border-indigo-500/50 focus:bg-white-[0.05] focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all duration-300 shadow-inner group-hover:border-white/20"
            />
          </div>

          <div className="space-y-3 group">
            <div>
              <label htmlFor="description" className="block text-base font-bold text-zinc-100 tracking-wide mb-1">
                Problem Description
              </label>
              <p className="text-sm text-zinc-500 font-medium">
                Introduce the problem, share what you&apos;ve tried, and expand on the title.
              </p>
            </div>
            <textarea
              id="description"
              name="description"
              required
              rows={8}
              placeholder="Write your question here... Markdown is supported by the community."
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3.5 text-base text-zinc-200 placeholder-zinc-600 focus:border-indigo-500/50 focus:bg-white-[0.05] focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all duration-300 shadow-inner group-hover:border-white/20 resize-y"
            ></textarea>
          </div>

          <div className="space-y-3 group">
            <div>
              <label htmlFor="tags" className="block text-base font-bold text-zinc-100 tracking-wide mb-1">
                Tags
              </label>
              <p className="text-sm text-zinc-500 font-medium">
                Add up to 5 space-separated tags to describe what your question is about.
              </p>
            </div>
            <input
              type="text"
              id="tags"
              name="tags"
              placeholder="e.g. reactjs nodejs docker"
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3.5 text-base text-zinc-200 placeholder-zinc-600 focus:border-indigo-500/50 focus:bg-white-[0.05] focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all duration-300 shadow-inner group-hover:border-white/20"
            />
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center gap-5 border-t border-white/10">
            <button
              type="submit"
              disabled={isPending}
              className={`relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-3.5 text-base font-bold text-white shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 w-full sm:w-auto ${
                isPending ? "opacity-70 cursor-not-allowed grayscale-[0.3]" : ""
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:animate-[shimmer_1.5s_infinite]" />
              <span className="relative drop-shadow-md">
                {isPending ? "Broadcasting..." : "Publish Question"}
              </span>
            </button>
            
            {isPending && (
              <div className="flex items-center gap-2 text-sm font-medium text-zinc-400 animate-pulse">
                <div className="w-4 h-4 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                Encrypting to database...
              </div>
            )}
          </div>

        </form>
      </div>
    </div>
  );
}
