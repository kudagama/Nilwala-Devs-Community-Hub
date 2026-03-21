"use client";

import { useTransition, useState, KeyboardEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createQuestion } from "../actions";
import { X, Lock, LogIn } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { signInWithGoogle } from "../auth/actions";

import { User } from "@supabase/supabase-js";

export default function AskQuestion() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setIsLoading(false);
    });
  }, []);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (newTag && !tags.includes(newTag)) {
        if (tags.length < 5) {
          setTags([...tags, newTag]);
          setTagInput("");
        }
      }
    } else if (e.key === "Backspace" && !tagInput && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  const removeTag = (indexToRemove: number) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    const formData = new FormData(e.currentTarget);
    formData.set("tags", tags.join(" "));

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

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-32 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 relative text-center">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
        
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-12 shadow-2xl shadow-black/60 inline-flex flex-col items-center max-w-md mx-auto">
          <div className="bg-indigo-500/20 p-4 rounded-full mb-6">
            <Lock className="h-8 w-8 text-indigo-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Authentication Required</h2>
          <p className="text-zinc-400 mb-8 leading-relaxed">
            Please sign in with Google to post questions and start contributing to the community.
          </p>
          
          <form action={signInWithGoogle}>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-3.5 text-base font-bold text-white shadow-xl shadow-indigo-500/30 hover:bg-indigo-500 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
            >
              <LogIn className="h-5 w-5" />
              Sign in with Google
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 relative">
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
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          <div className="space-y-3 group">
            <label htmlFor="title" className="block text-base font-bold text-zinc-100 mb-1">Title</label>
            <p className="text-sm text-zinc-500 mb-1">Be specific about your question.</p>
            <input
              type="text"
              id="title"
              name="title"
              required
              placeholder="e.g. How to leverage Server Actions in Next.js 15?"
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3.5 text-base text-zinc-200 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/20 transition-all outline-none"
            />
          </div>

          <div className="space-y-3 group">
            <label htmlFor="description" className="block text-base font-bold text-zinc-100 mb-1">Problem Description</label>
            <textarea
              id="description"
              name="description"
              required
              rows={8}
              placeholder="Write your question here..."
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3.5 text-base text-zinc-200 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/20 transition-all outline-none"
            ></textarea>
          </div>

          <div className="space-y-3 group">
            <label htmlFor="tags" className="block text-base font-bold text-zinc-100 mb-1">Tags</label>
            <div className="w-full min-h-[54px] rounded-xl border border-white/10 bg-black/40 px-4 py-2 flex flex-wrap items-center gap-2">
              {tags.map((tag, index) => (
                <span key={index} className="flex items-center gap-1.5 rounded-lg bg-indigo-500/20 border border-indigo-500/30 px-3 py-1 font-medium text-indigo-300">
                  {tag}
                  <button type="button" onClick={() => removeTag(index)}><X className="h-3 w-3" /></button>
                </span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={tags.length >= 5}
                placeholder={tags.length === 0 ? "e.g. react nextjs prisma" : ""}
                className="flex-1 bg-transparent border-none outline-none text-zinc-200"
              />
            </div>
            <input type="hidden" name="tags" value={tags.join(" ")} />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className={`w-full sm:w-auto rounded-xl bg-indigo-600 px-8 py-3.5 text-base font-bold text-white transition-all ${isPending ? "opacity-50" : "hover:bg-indigo-500"}`}
          >
            {isPending ? "Publishing..." : "Publish Question"}
          </button>
        </form>
      </div>
    </div>
  );
}
