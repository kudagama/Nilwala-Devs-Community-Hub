'use client';

import { useState } from 'react';
import { ArrowBigUp } from 'lucide-react';
import { toggleVote } from '@/app/actions';

interface VoteButtonsProps {
  questionId: string;
  initialVotes: number;
  initialUserVote: number; // 0, 1, or -1
}

export default function VoteButtons({ questionId, initialVotes, initialUserVote }: VoteButtonsProps) {
  const [votes, setVotes] = useState(initialVotes);
  const [userVote, setUserVote] = useState(initialUserVote);
  const [isPending, setIsPending] = useState(false);

  const handleVote = async (value: number) => {
    if (isPending) return;
    
    // Store previous states for rollback
    const prevVotes = votes;
    const prevUserVote = userVote;

    // Optimistic Update
    if (userVote === value) {
      // Unvoting
      setVotes((prev) => prev - value);
      setUserVote(0);
    } else {
      // Changing vote or voting for first time
      const diff = value - userVote;
      setVotes((prev) => prev + diff);
      setUserVote(value);
    }

    setIsPending(true);

    try {
      await toggleVote(questionId, value);
    } catch (error) {
      console.error("Failed to vote:", error);
      // Rollback on error
      setVotes(prevVotes);
      setUserVote(prevUserVote);
      alert("Please sign in to vote.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex sm:flex-col items-center gap-3 shrink-0">
       <button 
          onClick={() => handleVote(1)}
          disabled={isPending}
          title="Upvote"
          className={`p-2 rounded-lg border transition-all ${
            userVote === 1 
              ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400' 
              : 'bg-white/5 border-white/10 text-zinc-400 hover:text-indigo-400 hover:border-indigo-400/50'
          } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
       >
          <ArrowBigUp className="h-8 w-8" />
       </button>
       <span className="text-xl font-bold text-white min-w-[2ch] text-center">{votes}</span>
       <button 
          onClick={() => handleVote(-1)}
          disabled={isPending}
          title="Downvote"
          className={`p-2 rounded-lg border transition-all rotate-180 ${
            userVote === -1 
              ? 'bg-pink-500/20 border-pink-500/50 text-pink-400' 
              : 'bg-white/5 border-white/10 text-zinc-400 hover:text-pink-400 hover:border-pink-400/50'
          } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
       >
          <ArrowBigUp className="h-8 w-8" />
       </button>
    </div>
  );
}
