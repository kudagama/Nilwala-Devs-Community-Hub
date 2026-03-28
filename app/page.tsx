import QuestionCard, { Question } from "@/components/QuestionCard";
import { prisma } from "@/lib/db";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { MessageSquareText, TrendingUp, Flame, Sparkles, Plus } from "lucide-react";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  const dbQuestions = await prisma.question.findMany({
    include: {
      author: true,
      _count: {
        select: { answers: true }
      }
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const questions: Question[] = dbQuestions.map((q) => ({
    id: q.id,
    title: q.title,
    description: q.content,
    tags: q.tags,
    votes: q.votes,
    answers: q._count.answers,
    author: q.author.name || "Software Engineer",
    authorImage: q.author.image || undefined,
    timeAgo: formatDistanceToNow(q.createdAt, { addSuffix: true }),
  }));

  const totalVotes = questions.reduce((sum, q) => sum + q.votes, 0);
  const totalAnswers = questions.reduce((sum, q) => sum + q.answers, 0);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-indigo-600/15 rounded-full blur-[120px]" />
          <div className="absolute top-10 right-1/4 w-[400px] h-[250px] bg-purple-600/10 rounded-full blur-[100px]" />
          <div className="absolute -bottom-10 left-1/2 w-[600px] h-[200px] bg-pink-600/8 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-6xl mx-auto px-4 py-16 sm:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 text-sm font-medium text-indigo-300 mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              SE Community Hub
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.05] mb-6">
              <span className="bg-gradient-to-br from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
                Ask. Answer.
              </span>
              <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Grow Together.
              </span>
            </h1>
            <p className="text-zinc-400 text-lg sm:text-xl font-light leading-relaxed mb-10 max-w-xl mx-auto">
              A community platform for Software Engineers to ask questions,
              share knowledge, and grow together.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/ask"
                className="group relative inline-flex items-center gap-2.5 rounded-2xl bg-indigo-600 px-7 py-3.5 text-base font-bold text-white shadow-2xl shadow-indigo-500/30 hover:bg-indigo-500 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                <Plus className="h-5 w-5" />
                Ask a Question
              </Link>
              <a
                href="#questions"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-7 py-3.5 text-base font-semibold text-zinc-300 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all duration-300"
              >
                <MessageSquareText className="h-5 w-5" />
                Browse Questions
              </a>
            </div>
          </div>

          {/* Stats Row */}
          <div className="mt-16 grid grid-cols-3 gap-4 max-w-lg mx-auto">
            {[
              { label: "Questions", value: questions.length, icon: "💬" },
              { label: "Answers", value: totalAnswers, icon: "✅" },
              { label: "Votes", value: totalVotes, icon: "👍" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 text-center backdrop-blur-sm hover:bg-white/[0.05] transition-colors"
              >
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-2xl font-black text-white">{stat.value}</div>
                <div className="text-xs text-zinc-500 font-medium mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Questions Feed */}
      <div id="questions" className="max-w-5xl mx-auto px-4 py-12 relative">
        <div className="absolute top-10 right-10 w-64 h-64 bg-indigo-600/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

        {/* Feed Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Latest Questions
            </h2>
            <p className="text-zinc-500 text-sm mt-1">
              {questions.length} question{questions.length !== 1 ? "s" : ""} in the community
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-1 shadow-inner shadow-black/50 text-xs font-semibold self-start">
            <button className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 shadow-md shadow-indigo-600/40 text-white rounded-lg transition-all hover:scale-105 active:scale-95 duration-200">
              <Flame className="h-3.5 w-3.5" />
              Newest
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 text-zinc-400 hover:text-white transition-colors hover:bg-white/5 rounded-lg ml-1">
              <TrendingUp className="h-3.5 w-3.5" />
              Top
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 text-zinc-400 hover:text-white transition-colors hover:bg-white/5 rounded-lg ml-1">
              <MessageSquareText className="h-3.5 w-3.5" />
              Unanswered
            </button>
          </div>
        </div>

        {/* Question List */}
        <div className="space-y-4">
          {questions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-28 bg-white/[0.02] border border-white/5 rounded-3xl shadow-xl shadow-black/40 backdrop-blur-sm text-center">
              <div className="text-6xl mb-6">🌟</div>
              <h3 className="text-2xl font-bold text-zinc-300 mb-3">
                Be the first to ask!
              </h3>
              <p className="text-zinc-500 mb-8 max-w-sm leading-relaxed">
                No questions yet. Spark the community by asking the first question!
              </p>
              <Link
                href="/ask"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
              >
                <Plus className="h-4 w-4" />
                Ask First Question
              </Link>
            </div>
          ) : (
            questions.map((q) => (
              <QuestionCard key={q.id} question={q} />
            ))
          )}
        </div>

        {/* Load more hint */}
        {questions.length > 0 && (
          <div className="mt-10 text-center">
            <p className="text-zinc-600 text-sm">
              Showing all {questions.length} question{questions.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
