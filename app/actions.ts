'use server'

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function createQuestion(formData: FormData) {
  const supabase = await createClient();
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

  const question = await prisma.question.create({
    data: {
      title,
      content,
      tags,
      authorId: user.id,
    },
  });

  revalidatePath('/');
  return { success: true, id: question.id };
}

export async function createAnswer(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('You must be signed in to post an answer.');
  }

  const content = formData.get('content') as string;
  const questionId = formData.get('questionId') as string;

  if (!content || !questionId) {
    throw new Error('Content is required.');
  }

  const answer = await prisma.answer.create({
    data: {
      content,
      questionId,
      authorId: user.id,
    },
  });

  revalidatePath(`/question/${questionId}`);
  return { success: true, id: answer.id };
}
