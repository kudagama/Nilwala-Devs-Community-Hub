"use client";

import { useTransition, useState, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { createQuestion } from "../actions";
import { X } from "lucide-react";

export default function AskQuestion() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

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
    const formData = new FormData(e.currentTarget);
    
    // Add the tags array as a space-separated string to match the Server Action's expectations
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
                Type a tag and press **Space** or **Enter** to add it (max 5).
              </p>
            </div>
            
            <div className="w-full min-h-[54px] rounded-xl border border-white/10 bg-black/40 px-4 py-2 flex flex-wrap items-center gap-2 focus-within:border-indigo-500/50 focus-within:ring-4 focus-within:ring-indigo-500/20 transition-all duration-300 shadow-inner group-hover:border-white/20">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="flex items-center gap-1.5 rounded-lg bg-indigo-500/20 border border-indigo-500/30 px-3 py-1 text-sm font-medium text-indigo-300 transition-all"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="hover:text-indigo-100 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              
              <input
                type="text"
                id="tags-input"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={tags.length >= 5}
                placeholder={tags.length === 0 ? "e.g. react nextjs prisma" : ""}
                className="flex-1 bg-transparent border-none outline-none text-base text-zinc-200 placeholder-zinc-600 min-w-[120px] disabled:opacity-0"
              />
            </div>
            <input type="hidden" name="tags" value={tags.join(" ")} />
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
