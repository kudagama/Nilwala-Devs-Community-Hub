'use server'

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function createQuestion(formData: FormData) {
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
      // For votes, it will default to 0 per schema
      // I am assuming the author field isn't in schema, but for UI sake we can mock it on fetch or add it later.
    },
  });

  revalidatePath('/');
  return { success: true, id: question.id };
}
