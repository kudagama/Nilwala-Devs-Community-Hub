import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatDistanceToNow } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import { createAnswer } from "@/app/actions";
import Image from "next/image";
import { ArrowBigUp, User as UserIcon, MessageSquare } from "lucide-react";
import { notFound } from "next/navigation";

export default async function QuestionDetails({ params }: { params: { id: string } }) {
  const { id } = await params;

  const question = await prisma.question.findUnique({
    where: { id },
    include: {
      author: true,
      answers: {
        include: {
          author: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!question) {
    notFound();
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 relative">
      <div className="absolute top-10 right-20 w-72 h-72 bg-indigo-600/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

      {/* Question Section */}
      <div className="mb-12">
        <h1 className="text-3xl font-extrabold text-white mb-6 leading-tight">
          {question.title}
        </h1>

        <div className="flex flex-col sm:flex-row gap-6 mb-10">
          {/* Vote Sidebar */}
          <div className="flex sm:flex-col items-center gap-3 shrink-0">
             <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-indigo-400 hover:border-indigo-400/50 transition-all">
                <ArrowBigUp className="h-8 w-8" />
             </button>
             <span className="text-xl font-bold text-white">{question.votes}</span>
             <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-pink-400 hover:border-pink-400/50 transition-all rotate-180">
                <ArrowBigUp className="h-8 w-8" />
             </button>
          </div>

          <div className="flex-1">
             <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 mb-6 shadow-xl text-zinc-300 leading-relaxed whitespace-pre-wrap">
                {question.content}
             </div>

             <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                   {question.tags.map((tag) => (
                      <span key={tag} className="rounded-lg bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-xs font-medium text-indigo-300">
                         {tag}
                      </span>
                   ))}
                </div>

                <div className="flex items-center gap-3 bg-indigo-600/10 border border-indigo-500/20 rounded-xl px-4 py-2">
                   <div className="relative h-8 w-8 rounded-full overflow-hidden border border-indigo-400/30">
                      {question.author.image ? (
                        <Image src={question.author.image} alt="Author Avatar" fill className="object-cover" />
                      ) : (
                        <UserIcon className="h-4 w-4 m-auto mt-2 text-indigo-300" />
                      )}
                   </div>
                   <div className="text-xs">
                      <div className="font-bold text-white">{question.author.name}</div>
                      <div className="text-zinc-500">asked {formatDistanceToNow(question.createdAt, { addSuffix: true })}</div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Answers List */}
      <div className="border-t border-white/10 pt-10 mb-12">
        <div className="flex items-center gap-3 mb-8">
           <MessageSquare className="h-6 w-6 text-indigo-400" />
           <h2 className="text-2xl font-bold text-white">
              {question.answers.length} Answers
           </h2>
        </div>

        <div className="space-y-6">
           {question.answers.map((answer) => (
              <div key={answer.id} className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 shadow-lg">
                 <div className="text-zinc-300 mb-6 leading-relaxed whitespace-pre-wrap">
                    {answer.content}
                 </div>
                 <div className="flex justify-end">
                    <div className="flex items-center gap-3 bg-white/5 rounded-xl px-3 py-1.5 border border-white/5">
                       <div className="relative h-6 w-6 rounded-full overflow-hidden border border-white/10">
                         {answer.author.image ? (
                           <Image src={answer.author.image} alt="Author Avatar" fill className="object-cover" />
                         ) : (
                           <UserIcon className="h-3 w-3 m-auto mt-1.5 text-zinc-400" />
                         )}
                       </div>
                       <div className="text-[11px]">
                          <span className="font-bold text-zinc-300">{answer.author.name}</span>
                          <span className="text-zinc-500 ml-2">{formatDistanceToNow(answer.createdAt, { addSuffix: true })}</span>
                       </div>
                    </div>
                 </div>
              </div>
           ))}
        </div>
      </div>

      {/* Answer Form */}
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
        <h3 className="text-xl font-bold text-white mb-6">Your Answer</h3>
        {user ? (
          <form action={createAnswer} className="space-y-4">
            <input type="hidden" name="questionId" value={question.id} />
            <textarea
              name="content"
              required
              rows={6}
              placeholder="Provide a detailed solution..."
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3.5 text-base text-zinc-200 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/20 transition-all outline-none resize-none"
            ></textarea>
            <button
              type="submit"
              className="rounded-xl bg-indigo-600 px-8 py-3.5 text-base font-bold text-white hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
            >
              Post Your Answer
            </button>
          </form>
        ) : (
          <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-xl text-center">
             <p className="text-zinc-400 mb-4">You must be signed in to contribute an answer.</p>
             <Link href="/" className="text-indigo-400 font-bold hover:underline">Return Home to Sign In</Link>
          </div>
        )}
      </div>
    </div>
  );
}
