'use server'

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function createQuestion(formData: FormData) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase client not initialized");
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('You must be signed in to post a question.');
  }

  const title = formData.get('title') as string;
  const content = formData.get('description') as string;
  const tagsString = formData.get('tags') as string;
  
  const tags = tagsString.split(' ').map(tag => tag.trim()).filter(Boolean);

  if (!title || !content) {
    throw new Error('Title and description are required.');
  }

  await prisma.question.create({
    data: {
      title,
      content,
      tags,
      authorId: user.id,
    },
  });

  revalidatePath('/');
}

export async function createAnswer(formData: FormData) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase client not initialized");
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('You must be signed in to post an answer.');
  }

  const content = formData.get('content') as string;
  const codeSnippet = formData.get('codeSnippet') as string;
  const questionId = formData.get('questionId') as string;

  if (!content || !questionId) {
    throw new Error('Content is required.');
  }

  await prisma.answer.create({
    data: {
      content,
      codeSnippet: codeSnippet ? codeSnippet : null,
      questionId,
      authorId: user.id,
    },
  });

  revalidatePath(`/question/${questionId}`);
}

export async function toggleVote(questionId: string, value: number) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase client not initialized");
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('You must be signed in to vote.');
  }

  if (value !== 1 && value !== -1) throw new Error('Invalid vote value');

  const existingVote = await prisma.questionVote.findUnique({
    where: {
      userId_questionId: {
        userId: user.id,
        questionId: questionId,
      },
    },
  });

  if (existingVote) {
    if (existingVote.value === value) {
      // remove vote
      await prisma.$transaction([
        prisma.questionVote.delete({ where: { id: existingVote.id } }),
        prisma.question.update({
          where: { id: questionId },
          data: { votes: { decrement: value } },
        }),
      ]);
    } else {
      // change vote
      await prisma.$transaction([
        prisma.questionVote.update({
          where: { id: existingVote.id },
          data: { value },
        }),
        prisma.question.update({
          where: { id: questionId },
          data: { votes: { increment: value * 2 } },
        }),
      ]);
    }
  } else {
    // new vote
    await prisma.$transaction([
      prisma.questionVote.create({
        data: {
          userId: user.id,
          questionId,
          value,
        },
      }),
      prisma.question.update({
        where: { id: questionId },
        data: { votes: { increment: value } },
      }),
    ]);
  }

  revalidatePath(`/question/${questionId}`);
  revalidatePath(`/`);
}

export async function deleteAnswer(answerId: string, questionId: string) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase client not initialized");
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('You must be signed in to delete an answer.');
  }

  const answer = await prisma.answer.findUnique({
    where: { id: answerId },
  });

  if (!answer || answer.authorId !== user.id) {
    throw new Error("Unauthorized to delete this answer.");
  }

  await prisma.answer.delete({
    where: { id: answerId },
  });

  revalidatePath(`/question/${questionId}`);
}

export async function updateAnswer(formData: FormData) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase client not initialized");
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('You must be signed in to update an answer.');
  }

  const answerId = formData.get('answerId') as string;
  const content = formData.get('content') as string;
  const codeSnippet = formData.get('codeSnippet') as string;
  const questionId = formData.get('questionId') as string;

  if (!content || !answerId) {
    throw new Error('Answer ID and content are required.');
  }

  const answer = await prisma.answer.findUnique({
    where: { id: answerId },
  });

  if (!answer || answer.authorId !== user.id) {
    throw new Error("Unauthorized to edit this answer.");
  }

  await prisma.answer.update({
    where: { id: answerId },
    data: {
      content,
      codeSnippet: codeSnippet ? codeSnippet : null,
    },
  });

  revalidatePath(`/question/${questionId}`);
}
