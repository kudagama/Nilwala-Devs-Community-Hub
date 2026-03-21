import QuestionCard, { Question } from "@/components/QuestionCard";
import { prisma } from "@/lib/db";
import { formatDistanceToNow } from "date-fns";

// Prevent Next.js from statically prerendering this page at build time.
// Data is fetched live from Supabase on every request.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  const dbQuestions = await prisma.question.findMany({
    include: {
      author: true, // Fetch the real author info!
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Transform db records into the shape our QuestionCard expects
  const MOCK_QUESTIONS: Question[] = dbQuestions.map((q) => ({
    id: q.id,
    title: q.title,
    description: q.content,
    tags: q.tags,
    votes: q.votes,
    answers: 0, // Future: fetch answers count
    author: q.author.name || "Software Engineer",
    authorImage: q.author.image || undefined, // Passing the avatar URL!
    timeAgo: formatDistanceToNow(q.createdAt, { addSuffix: true }),
  }));

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 relative z-0">
      
      {/* Decorative Glow */}
      <div className="absolute top-10 right-20 w-72 h-72 bg-indigo-600/20 rounded-full blur-[100px] -z-10 animate-pulse pointer-events-none" />

      <div className="flex items-center justify-between mb-10 pb-4 border-b border-white/5">
        <h1 className="text-4xl font-black bg-gradient-to-br from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent drop-shadow-sm tracking-tighter">
          Top Questions
        </h1>
        
        <div className="flex bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-1 shadow-inner shadow-black/50 text-xs font-semibold">
          <button className="px-5 py-2.5 bg-indigo-600 shadow-md shadow-indigo-600/40 text-white rounded-lg transition-transform hover:scale-105 active:scale-95 duration-200">
            Interesting
          </button>
          <button className="px-5 py-2.5 text-zinc-400 hover:text-white transition-colors hover:bg-white/5 rounded-lg ml-1">
            Bountied
          </button>
          <button className="px-5 py-2.5 text-zinc-400 hover:text-white transition-colors hover:bg-white/5 rounded-lg ml-1">
            Hot
          </button>
        </div>
      </div>

      <div className="space-y-5">
        {MOCK_QUESTIONS.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-20 bg-white/[0.02] border border-white/5 rounded-3xl shadow-xl shadow-black/40 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-zinc-300 mb-2">It&apos;s quiet here...</h3>
            <p className="text-zinc-500 mb-6 text-center max-w-sm">
              Be the first to post a question and spark a conversation in the community!
            </p>
          </div>
        ) : (
          MOCK_QUESTIONS.map((q) => (
            <QuestionCard key={q.id} question={q} />
          ))
        )}
      </div>
    </div>
  );
}
