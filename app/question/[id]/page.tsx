import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatDistanceToNow } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import { createAnswer } from "@/app/actions";
import Image from "next/image";
import { MessageSquare, User as UserIcon, ArrowLeft, Clock, Send, Code2, FileText } from "lucide-react";
import { notFound } from "next/navigation";
import VoteButtons from "@/components/VoteButtons";
import AnswerCard from "@/components/AnswerCard";

export default async function QuestionDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const question = await prisma.question.findUnique({
    where: { id },
    include: {
      author: true,
      answers: {
        include: { author: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!question) notFound();

  const supabase = await createClient();
  const user = (await supabase.auth.getUser()).data.user;

  let initialUserVote = 0;
  if (user) {
    const userVoteRecord = await prisma.questionVote.findUnique({
      where: { userId_questionId: { userId: user.id, questionId: question.id } },
    });
    if (userVoteRecord) initialUserVote = userVoteRecord.value;
  }

  return (
    <div className="min-h-screen">
      {/* Background glows */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[130px]" />
        <div className="absolute bottom-40 left-1/4 w-72 h-72 bg-purple-600/8 rounded-full blur-[110px]" />
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* Back Navigation */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-white text-sm font-medium mb-8 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Questions
        </Link>

        {/* Question Card */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl shadow-black/40 overflow-hidden mb-8">
          {/* Top shimmer line */}
          <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

          <div className="p-7 sm:p-10">
            {/* Tags row */}
            <div className="flex flex-wrap gap-2 mb-5">
              {question.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-lg bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-300"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-8 leading-tight tracking-tight">
              {question.title}
            </h1>

            <div className="flex flex-col sm:flex-row gap-8">
              {/* Vote Sidebar */}
              <div className="shrink-0">
                <VoteButtons
                  questionId={question.id}
                  initialVotes={question.votes}
                  initialUserVote={initialUserVote}
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="text-zinc-300 leading-relaxed whitespace-pre-wrap text-[15px] mb-8">
                  {question.content}
                </div>

                {/* Author + Meta */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/5">
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <Clock className="h-3.5 w-3.5" />
                    <span>asked {formatDistanceToNow(question.createdAt, { addSuffix: true })}</span>
                  </div>

                  <div className="flex items-center gap-3 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 border border-indigo-500/20 rounded-2xl px-4 py-2.5">
                    <div className="relative h-9 w-9 rounded-full overflow-hidden border-2 border-indigo-400/40 shrink-0">
                      {question.author.image ? (
                        <Image src={question.author.image} alt="Author" fill className="object-cover" />
                      ) : (
                        <div className="h-full w-full bg-indigo-600/30 flex items-center justify-center">
                          <UserIcon className="h-4 w-4 text-indigo-300" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{question.author.name}</div>
                      <div className="text-[11px] text-zinc-500">Question Author</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Answers Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl px-4 py-2">
              <MessageSquare className="h-5 w-5 text-indigo-400" />
              <span className="font-bold text-white text-lg">{question.answers.length}</span>
              <span className="text-zinc-400 font-medium">
                {question.answers.length === 1 ? "Answer" : "Answers"}
              </span>
            </div>
          </div>

          {question.answers.length === 0 ? (
            <div className="text-center py-16 bg-white/[0.02] border border-white/5 rounded-2xl">
              <div className="text-4xl mb-4">💭</div>
              <p className="text-zinc-400 font-medium mb-1">No answers yet</p>
              <p className="text-zinc-600 text-sm">Be the first to help!</p>
            </div>
          ) : (
            <div className="space-y-5">
              {question.answers.map((answer) => (
                <AnswerCard
                  key={answer.id}
                  answer={{ ...answer, codeSnippet: (answer as unknown as { codeSnippet: string | null }).codeSnippet ?? null }}
                  currentUserId={user?.id}
                />
              ))}
            </div>
          )}
        </div>

        {/* Answer Form */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
          <div className="h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
          <div className="p-7 sm:p-10">
            <div className="flex items-center gap-3 mb-7">
              <div className="bg-purple-500/20 p-2.5 rounded-xl">
                <MessageSquare className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Your Answer</h3>
                <p className="text-sm text-zinc-500">Share your knowledge with the community</p>
              </div>
            </div>

            {user ? (
              <form action={createAnswer} className="space-y-6">
                <input type="hidden" name="questionId" value={question.id} />

                {/* Explanation */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-zinc-300 mb-3">
                    <FileText className="h-4 w-4 text-indigo-400" />
                    Explanation
                  </label>
                  <textarea
                    name="content"
                    required
                    rows={5}
                    placeholder="Provide a clear, detailed explanation..."
                    className="w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-base text-zinc-200 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/15 transition-all outline-none resize-y placeholder:text-zinc-600"
                  />
                </div>

                {/* Code Snippet */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-zinc-300 mb-3">
                    <Code2 className="h-4 w-4 text-emerald-400" />
                    Code Snippet
                    <span className="text-zinc-600 font-normal text-xs">(Optional)</span>
                  </label>
                  <div className="rounded-2xl overflow-hidden border border-white/10">
                    <div className="flex items-center justify-between bg-white/5 border-b border-white/5 px-5 py-2.5">
                      <div className="flex gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-red-500/70" />
                        <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
                        <span className="w-3 h-3 rounded-full bg-green-500/70" />
                      </div>
                      <span className="text-[10px] text-zinc-600 uppercase tracking-widest font-mono font-semibold">Code Editor</span>
                    </div>
                    <textarea
                      name="codeSnippet"
                      rows={7}
                      spellCheck={false}
                      placeholder={"// Paste your code here..."}
                      className="w-full bg-[#0d1117] px-5 py-4 font-mono text-[13px] leading-relaxed text-[#a5b4fc] focus:outline-none resize-y placeholder:text-zinc-700"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 pt-2">
                  <p className="text-xs text-zinc-600 hidden sm:block">
                    Be kind and constructive in your answer
                  </p>
                  <button
                    type="submit"
                    className="group flex items-center gap-2.5 rounded-2xl bg-indigo-600 px-8 py-3.5 text-base font-bold text-white hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/25 active:scale-95"
                  >
                    <Send className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    Post Answer
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 bg-amber-500/5 border border-amber-500/20 rounded-2xl">
                <div>
                  <p className="font-semibold text-zinc-300 mb-1">Sign in to answer</p>
                  <p className="text-sm text-zinc-500">You need to be signed in to contribute an answer.</p>
                </div>
                <Link
                  href="/"
                  className="shrink-0 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-indigo-500 transition-all"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
