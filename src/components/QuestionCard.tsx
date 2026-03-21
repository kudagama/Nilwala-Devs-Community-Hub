import Link from "next/link";
import { MessageSquare, ArrowBigUp } from "lucide-react";

export interface Question {
  id: string;
  title: string;
  description: string;
  tags: string[];
  votes: number;
  answers: number;
  author: string;
  timeAgo: string;
}

interface QuestionCardProps {
  question: Question;
}

export default function QuestionCard({ question }: QuestionCardProps) {
  return (
    <div className="group flex flex-col sm:flex-row gap-6 rounded-2xl border border-white/5 bg-white/[0.02] p-6 text-sm hover:bg-white/[0.04] hover:border-white/10 hover:shadow-[0_8px_30px_rgb(0,0,0,0.4)] transition-all duration-500 hover:-translate-y-1 relative overflow-hidden backdrop-blur-sm">
      
      {/* Decorative gradient blob background on hover */}
      <div className="absolute -inset-10 bg-gradient-to-r from-indigo-500/0 via-purple-500/0 to-pink-500/0 opacity-0 group-hover:opacity-10 group-hover:from-indigo-500 group-hover:via-purple-500 group-hover:to-pink-500 blur-2xl transition-all duration-700 pointer-events-none" />

      {/* Metrics Sidebar */}
      <div className="flex sm:flex-col sm:items-end gap-5 sm:gap-2 shrink-0 w-24 relative z-10">
        <div className="flex flex-col items-center sm:items-end gap-0.5 group/votes">
          <span className="font-bold text-lg text-white group-hover/votes:text-indigo-400 transition-colors">
            {question.votes}
          </span>
          <span className="text-zinc-500 text-xs uppercase tracking-wider font-semibold">
            votes
          </span>
        </div>
        
        <div
          className={`flex flex-col items-center sm:items-end gap-0.5 rounded-lg px-2 py-1 -mx-2 transition-colors duration-300 ${
            question.answers > 0
              ? "text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 shadow-[0_0_15px_rgba(52,211,153,0.15)]"
              : "text-zinc-500"
          }`}
        >
          <span className="font-bold text-base">{question.answers}</span>
          <span className="text-[10px] uppercase tracking-wider font-bold">
            answers
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex w-full flex-col relative z-10">
        <Link href={`/question/${question.id}`} className="w-fit">
          <h3 className="text-xl font-semibold text-indigo-300 group-hover:text-indigo-200 transition-colors mb-2 bg-gradient-to-r from-indigo-300 to-indigo-100 bg-clip-text">
            {question.title}
          </h3>
        </Link>
        <p className="line-clamp-2 text-zinc-400 leading-relaxed mb-5 font-light">
          {question.description}
        </p>

        {/* Footer Tags & Metadata */}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {question.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-lg bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-[11px] font-medium tracking-wide text-indigo-300 hover:bg-indigo-500/20 hover:text-indigo-100 cursor-pointer hover:shadow-[0_0_10px_rgba(99,102,241,0.2)] transition-all duration-300 uppercase"
                title={`Show questions tagged '${tag}'`}
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="text-xs flex items-center gap-1.5 text-zinc-500">
            <div className="flex items-center gap-1 bg-white/5 rounded-full px-2 py-1 cursor-pointer hover:bg-white/10 transition-colors">
              <span className="font-medium text-pink-300 drop-shadow-sm">
                {question.author}
              </span>
            </div>
            <span>asked <span className="text-zinc-400">{question.timeAgo}</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}
