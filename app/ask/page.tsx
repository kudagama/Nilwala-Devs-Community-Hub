"use client";

import { useTransition, useState, KeyboardEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createQuestion } from "../actions";
import {
  X,
  Lock,
  LogIn,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Lightbulb,
  FileText,
  Code2,
  Tag,
  Send,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { signInWithGoogle } from "../auth/actions";
import { User } from "@supabase/supabase-js";

const STEPS = [
  { id: 1, title: "Title", icon: Lightbulb, hint: "What is your question about?" },
  { id: 2, title: "Description", icon: FileText, hint: "Explain your problem in detail" },
  { id: 3, title: "Code", icon: Code2, hint: "Paste relevant code (optional)" },
  { id: 4, title: "Tags & Submit", icon: Tag, hint: "Add tags and publish" },
];

export default function AskQuestion() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [currentStep, setCurrentStep] = useState(1);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Form field states for live preview
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [codeSnippet, setCodeSnippet] = useState("");

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient();
      if (!supabase) { setIsLoading(false); return; }
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setIsLoading(false);
    }
    loadUser();
  }, []);

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (newTag && !tags.includes(newTag) && tags.length < 5) {
        setTags([...tags, newTag]);
        setTagInput("");
      }
    } else if (e.key === "Backspace" && !tagInput && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  const removeTag = (indexToRemove: number) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const canProceed = () => {
    if (currentStep === 1) return title.trim().length >= 10;
    if (currentStep === 2) return description.trim().length >= 20;
    return true;
  };

  const handleSubmit = () => {
    if (!user || !title || !description) return;

    const formData = new FormData();
    formData.set("title", title);
    formData.set("description", description);
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
            Please sign in with Google to post questions and contribute to the community.
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

  const StepIcon = STEPS[currentStep - 1].icon;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 relative">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] -z-10 pointer-events-none animate-pulse" />
      <div className="absolute bottom-20 left-10 w-64 h-64 bg-indigo-600/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-white tracking-tight leading-tight mb-2">
          Ask a Question
        </h1>
        <p className="text-zinc-400 font-light">
          Good questions get great answers. Fill in each step carefully.
        </p>
      </div>

      {/* Step Progress Bar */}
      <div className="flex items-center gap-0 mb-10">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;
          return (
            <div key={step.id} className="flex items-center flex-1">
              <button
                type="button"
                onClick={() => isCompleted && setCurrentStep(step.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                    : isCompleted
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-pointer hover:bg-emerald-500/30"
                    : "bg-white/5 text-zinc-500 border border-white/5 cursor-default"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                ) : (
                  <Icon className="h-4 w-4 shrink-0" />
                )}
                <span className="hidden sm:inline">{step.title}</span>
                <span className="sm:hidden">{step.id}</span>
              </button>
              {i < STEPS.length - 1 && (
                <div className={`h-px flex-1 mx-1 transition-all duration-500 ${currentStep > step.id ? "bg-emerald-500/40" : "bg-white/10"}`} />
              )}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Main Form Area */}
        <div className="lg:col-span-3">
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl shadow-black/60 overflow-hidden">
            {/* Step Header */}
            <div className="px-8 pt-8 pb-6 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-500/20 p-2.5 rounded-xl">
                  <StepIcon className="h-5 w-5 text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">
                    Step {currentStep}: {STEPS[currentStep - 1].title}
                  </h2>
                  <p className="text-sm text-zinc-500">{STEPS[currentStep - 1].hint}</p>
                </div>
              </div>
            </div>

            {/* Step Content */}
            <div className="p-8">
              {/* Step 1: Title */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <p className="text-zinc-400 text-sm leading-relaxed bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-4">
                    💡 <strong className="text-indigo-300">Tip:</strong> A good title is specific and concise. 
                    Example: <em className="text-zinc-300">&quot;How to fix hydration error in Next.js 15 when using localStorage?&quot;</em>
                  </p>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. How to fix hydration error in Next.js 15?"
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-4 text-base text-zinc-200 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/20 transition-all outline-none"
                    autoFocus
                  />
                  <div className="flex justify-between text-xs text-zinc-600">
                    <span>{title.length < 10 ? `${10 - title.length} more characters needed` : "✓ Title looks good!"}</span>
                    <span className={title.length > 120 ? "text-red-400" : ""}>{title.length}/150</span>
                  </div>
                </div>
              )}

              {/* Step 2: Description */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <p className="text-zinc-400 text-sm leading-relaxed bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-4">
                    💡 <strong className="text-indigo-300">Tip:</strong> Describe what you tried, what happened, and what you expected. The more detail, the better the answer.
                  </p>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={10}
                    placeholder={"Describe your problem in detail...\n\n- What are you trying to do?\n- What have you tried?\n- What error are you getting?"}
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-4 text-base text-zinc-200 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/20 transition-all outline-none resize-y"
                    autoFocus
                  />
                  <div className="flex justify-between text-xs text-zinc-600">
                    <span>{description.length < 20 ? `${20 - description.length} more characters needed` : "✓ Description looks good!"}</span>
                    <span>{description.length} characters</span>
                  </div>
                </div>
              )}

              {/* Step 3: Code */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <p className="text-zinc-400 text-sm leading-relaxed bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-4">
                    💡 <strong className="text-indigo-300">Optional:</strong> If your question involves code, paste a minimal reproducible example here.
                  </p>
                  <div className="rounded-xl overflow-hidden border border-white/10">
                    <div className="bg-white/5 border-b border-white/5 px-4 py-2.5 flex items-center justify-between">
                      <div className="flex gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-red-500/70"></span>
                        <span className="w-3 h-3 rounded-full bg-yellow-500/70"></span>
                        <span className="w-3 h-3 rounded-full bg-green-500/70"></span>
                      </div>
                      <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Code Editor</span>
                    </div>
                    <textarea
                      value={codeSnippet}
                      onChange={(e) => setCodeSnippet(e.target.value)}
                      rows={12}
                      spellCheck={false}
                      placeholder={"// Paste your code here...\n// This step is optional"}
                      className="w-full bg-[#0d1117] px-5 py-4 font-mono text-[13px] leading-relaxed text-[#a5b4fc] focus:outline-none resize-y"
                      autoFocus
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Tags */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-zinc-300 mb-2">
                      Tags <span className="text-zinc-500 font-normal">(up to 5)</span>
                    </label>
                    <p className="text-xs text-zinc-500 mb-3">Type a tag and press Space or Enter to add it.</p>
                    <div className="w-full min-h-[54px] rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 flex flex-wrap items-center gap-2 focus-within:border-indigo-500/50 focus-within:ring-4 focus-within:ring-indigo-500/20 transition-all">
                      {tags.map((tag, index) => (
                        <span key={index} className="flex items-center gap-1.5 rounded-lg bg-indigo-500/20 border border-indigo-500/30 px-3 py-1 text-sm font-medium text-indigo-300">
                          {tag}
                          <button type="button" onClick={() => removeTag(index)} className="hover:text-white transition-colors">
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleTagKeyDown}
                        disabled={tags.length >= 5}
                        placeholder={tags.length === 0 ? "e.g. nextjs react typescript" : tags.length >= 5 ? "Max 5 tags reached" : ""}
                        className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-zinc-200 text-sm"
                        autoFocus
                      />
                    </div>
                  </div>

                  {/* Final Summary */}
                  <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                      <span className="font-bold text-emerald-400 text-sm">Ready to publish!</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex gap-2">
                        <span className="text-zinc-500 shrink-0">Title:</span>
                        <span className="text-zinc-300 truncate">{title}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-zinc-500 shrink-0">Description:</span>
                        <span className="text-zinc-400 truncate">{description.slice(0, 60)}{description.length > 60 ? "..." : ""}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-zinc-500 shrink-0">Code:</span>
                        <span className="text-zinc-400">{codeSnippet ? "✓ Included" : "Not added"}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-zinc-500 shrink-0">Tags:</span>
                        <span className="text-zinc-400">{tags.length > 0 ? tags.join(", ") : "No tags yet"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="px-8 pb-8 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
                disabled={currentStep === 1}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-zinc-300 hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </button>

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep((s) => Math.min(4, s + 1))}
                  disabled={!canProceed()}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isPending || !title || !description}
                  className="flex items-center gap-2 px-8 py-2.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/20 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Publish Question
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Live Preview Panel */}
        <div className="lg:col-span-2">
          <div className="sticky top-24 space-y-4">
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Live Preview</h3>
              
              {title ? (
                <h4 className="text-lg font-bold text-indigo-300 leading-snug mb-3">{title}</h4>
              ) : (
                <div className="h-6 bg-white/5 rounded-lg mb-3 animate-pulse" />
              )}

              {description ? (
                <p className="text-sm text-zinc-400 leading-relaxed line-clamp-4 mb-4">{description}</p>
              ) : (
                <div className="space-y-2 mb-4">
                  <div className="h-3 bg-white/5 rounded animate-pulse" />
                  <div className="h-3 bg-white/5 rounded animate-pulse w-4/5" />
                  <div className="h-3 bg-white/5 rounded animate-pulse w-3/5" />
                </div>
              )}

              {codeSnippet && (
                <div className="rounded-lg overflow-hidden bg-[#0d1117] border border-white/10 mb-4">
                  <div className="px-3 py-1.5 bg-white/5 text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Code</div>
                  <pre className="p-3 text-[11px] text-[#a5b4fc] font-mono overflow-hidden line-clamp-4">{codeSnippet}</pre>
                </div>
              )}

              {tags.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <span key={tag} className="rounded-md bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 text-[11px] font-medium text-indigo-300">
                      {tag}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="flex gap-1.5">
                  {[40, 56, 32].map((w, i) => (
                    <div key={i} className="h-5 bg-white/5 rounded animate-pulse" style={{ width: w }} />
                  ))}
                </div>
              )}
            </div>

            {/* Tips */}
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-3">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Writing Tips</h3>
              {[
                "Summarize the problem in the title",
                "Include what you've already tried",
                "Add a minimal code example",
                "Use specific tags for better reach",
              ].map((tip, i) => (
                <div key={i} className={`flex gap-2.5 text-xs text-zinc-400 ${i + 1 <= currentStep ? "text-zinc-300" : "opacity-50"}`}>
                  <span className={`mt-0.5 h-4 w-4 rounded-full border flex items-center justify-center shrink-0 text-[9px] font-bold ${i + 1 < currentStep ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400" : i + 1 === currentStep ? "border-indigo-400 text-indigo-400" : "border-white/10 text-zinc-600"}`}>
                    {i + 1 < currentStep ? "✓" : i + 1}
                  </span>
                  {tip}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
