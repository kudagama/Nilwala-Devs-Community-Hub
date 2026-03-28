'use client';

import { useState } from 'react';
import Image from 'next/image';
import { User as UserIcon, Edit2, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { updateAnswer, deleteAnswer } from '@/app/actions';

interface AnswerCardProps {
  answer: {
    id: string;
    content: string;
    codeSnippet: string | null;
    createdAt: Date;
    questionId: string;
    author: {
      id: string;
      name: string | null;
      image: string | null;
    };
  };
  currentUserId?: string | null;
}

export default function AnswerCard({ answer, currentUserId }: AnswerCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const isOwner = currentUserId === answer.author.id;

  async function handleDelete() {
    if (confirm("Are you sure you want to delete this answer?")) {
      setIsDeleting(true);
      try {
        await deleteAnswer(answer.id, answer.questionId);
      } catch (error) {
        console.error("Failed to delete", error);
        setIsDeleting(false);
      }
    }
  }

  if (isDeleting) {
     return <div className="bg-white/[0.02] border border-red-500/20 rounded-2xl p-6 shadow-lg animate-pulse text-center text-red-400">Deleting answer...</div>;
  }

  if (isEditing) {
    return (
      <div className="bg-white/[0.05] border border-indigo-500/30 rounded-2xl p-6 shadow-xl relative">
        <h3 className="text-lg font-bold text-white mb-4">Edit Answer</h3>
        <form 
           action={async (formData) => {
             await updateAnswer(formData);
             setIsEditing(false);
           }} 
           className="space-y-4"
        >
          <input type="hidden" name="answerId" value={answer.id} />
          <input type="hidden" name="questionId" value={answer.questionId} />
          
          <div>
            <label className="block text-sm font-semibold text-zinc-300 mb-2 ml-1">Explanation</label>
            <textarea
              name="content"
              required
              rows={4}
              defaultValue={answer.content}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3.5 text-base text-zinc-200 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/20 transition-all outline-none resize-y"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-semibold text-zinc-300 mb-2 ml-1">Code Snippet <span className="text-zinc-500 font-normal">(Optional)</span></label>
            <textarea
              name="codeSnippet"
              rows={6}
              defaultValue={answer.codeSnippet || ''}
              className="w-full rounded-xl border border-white/10 bg-[#0d1117]/80 px-5 py-4 font-mono text-[13px] leading-relaxed text-[#a5b4fc] focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/20 transition-all outline-none resize-y shadow-inner shadow-black/50"
              spellCheck={false}
            ></textarea>
          </div>
          
          <div className="flex gap-3 justify-end pt-2">
            <button
               type="button"
               onClick={() => setIsEditing(false)}
               className="px-5 py-2.5 rounded-xl border border-white/10 text-zinc-300 hover:bg-white/5 transition-colors"
            >
               Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 shadow-lg group">
       <div className="text-zinc-300 mb-6 leading-relaxed whitespace-pre-wrap">
          {answer.content}
       </div>
       
       {answer.codeSnippet && (
         <div className="mb-6 rounded-xl overflow-hidden border border-white/10 bg-[#0d1117] shadow-inner shadow-black/50">
           <div className="bg-white/5 border-b border-white/5 px-4 py-2.5 flex items-center justify-between">
             <div className="flex gap-1.5 items-center">
               <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
               <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
               <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
             </div>
             <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest font-semibold">Code Snippet</span>
           </div>
           <pre className="p-5 overflow-x-auto text-[13px] leading-relaxed font-mono text-[#e2e8f0] scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
             <code>{answer.codeSnippet}</code>
           </pre>
         </div>
       )}

       <div className="flex items-center justify-between">
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {isOwner && (
               <>
                 <button 
                   onClick={() => setIsEditing(true)}
                   className="p-1.5 text-zinc-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors border border-transparent hover:border-indigo-500/20"
                   title="Edit answer"
                 >
                   <Edit2 className="w-4 h-4" />
                 </button>
                 <button 
                   onClick={handleDelete}
                   className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
                   title="Delete answer"
                 >
                   <Trash2 className="w-4 h-4" />
                 </button>
               </>
            )}
          </div>

          <div className="flex items-center gap-3 bg-white/5 rounded-xl px-3 py-1.5 border border-white/5 ml-auto">
             <div className="relative h-6 w-6 rounded-full overflow-hidden border border-white/10">
               {answer.author.image ? (
                 <Image src={answer.author.image} alt="Author Avatar" fill className="object-cover" />
               ) : (
                 <UserIcon className="h-3 w-3 m-auto mt-1.5 text-zinc-400" />
               )}
             </div>
             <div className="text-[11px]">
                <span className="font-bold text-zinc-300">{answer.author.name}</span>
                <span className="text-zinc-500 ml-2">{formatDistanceToNow(new Date(answer.createdAt), { addSuffix: true })}</span>
             </div>
          </div>
       </div>
    </div>
  );
}
