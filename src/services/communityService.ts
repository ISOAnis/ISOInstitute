import { supabase } from '../lib/supabase';
import type {
  CommunityPostType,
  DbCommunityPost,
  DbLockerMessage,
} from '../types/database';

export interface CommunityPostWithMeta extends DbCommunityPost {
  encourages: number;
  encouragedByMe: boolean;
}

// ─── Forum ────────────────────────────────────────────────────────────────────

export async function fetchCommunityPosts(userId: string): Promise<CommunityPostWithMeta[]> {
  const { data: posts, error } = await supabase
    .from('community_posts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) throw error;
  if (!posts || posts.length === 0) return [];

  const postIds = posts.map((p) => p.id);
  const { data: encouragements, error: encError } = await supabase
    .from('post_encouragements')
    .select('post_id, user_id')
    .in('post_id', postIds);

  if (encError) throw encError;

  const counts = new Map<string, number>();
  const mine = new Set<string>();
  for (const row of encouragements ?? []) {
    counts.set(row.post_id, (counts.get(row.post_id) ?? 0) + 1);
    if (row.user_id === userId) mine.add(row.post_id);
  }

  return posts.map((post) => ({
    ...post,
    encourages: counts.get(post.id) ?? 0,
    encouragedByMe: mine.has(post.id),
  }));
}

export async function createCommunityPost(input: {
  authorId: string;
  authorName: string;
  authorRole: 'player' | 'coach';
  pathwayId: string;
  postType: CommunityPostType;
  content: string;
  goalTitle?: string;
}): Promise<DbCommunityPost> {
  const { data, error } = await supabase
    .from('community_posts')
    .insert({
      author_id: input.authorId,
      author_name: input.authorName,
      author_role: input.authorRole,
      pathway_id: input.pathwayId,
      post_type: input.postType,
      content: input.content,
      goal_title: input.goalTitle ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function setEncouragement(
  postId: string,
  userId: string,
  encouraged: boolean,
): Promise<void> {
  if (encouraged) {
    const { error } = await supabase
      .from('post_encouragements')
      .insert({ post_id: postId, user_id: userId });
    // Ignore duplicate encouragements (already liked)
    if (error && error.code !== '23505') throw error;
  } else {
    const { error } = await supabase
      .from('post_encouragements')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId);
    if (error) throw error;
  }
}

// ─── Locker Room channel chat ─────────────────────────────────────────────────

export async function fetchLockerMessages(
  channelPathwayId: string,
): Promise<DbLockerMessage[]> {
  const { data, error } = await supabase
    .from('locker_messages')
    .select('*')
    .eq('channel_pathway_id', channelPathwayId)
    .order('created_at', { ascending: true })
    .limit(200);

  if (error) throw error;
  return data ?? [];
}

export async function sendLockerMessage(input: {
  senderId: string;
  senderName: string;
  senderRole: 'player' | 'coach';
  senderPathwayId: string;
  channelPathwayId: string;
  body: string;
}): Promise<DbLockerMessage> {
  const { data, error } = await supabase
    .from('locker_messages')
    .insert({
      sender_id: input.senderId,
      sender_name: input.senderName,
      sender_role: input.senderRole,
      sender_pathway_id: input.senderPathwayId,
      channel_pathway_id: input.channelPathwayId,
      body: input.body,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/** Live messages for one pathway channel. Returns an unsubscribe function. */
export function subscribeToLockerChannel(
  channelPathwayId: string,
  onMessage: (message: DbLockerMessage) => void,
): () => void {
  const channel = supabase
    .channel(`locker-${channelPathwayId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'locker_messages',
        filter: `channel_pathway_id=eq.${channelPathwayId}`,
      },
      (payload) => onMessage(payload.new as DbLockerMessage),
    )
    .subscribe();

  return () => {
    void supabase.removeChannel(channel);
  };
}
