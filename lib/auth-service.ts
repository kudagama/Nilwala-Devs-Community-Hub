import { prisma } from './db';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export async function ensureUser(supabaseUser: SupabaseUser) {
  const { id, email, user_metadata } = supabaseUser;

  if (!email) return null;

  // Find or create the user in our Prisma DB
  const user = await prisma.user.upsert({
    where: { id },
    update: {
      name: user_metadata.full_name || user_metadata.name || user.name,
      image: user_metadata.avatar_url || user_metadata.picture || user.image,
    },
    create: {
      id,
      email,
      name: user_metadata.full_name || user_metadata.name,
      image: user_metadata.avatar_url || user_metadata.picture,
    },
  });

  return user;
}
