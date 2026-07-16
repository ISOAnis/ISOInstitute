import { supabase } from '../lib/supabase';
import type {
  BucketStatus,
  CoachRosterEntry,
  DbBucket,
  DbBucketComment,
  DbGame,
} from '../types/database';

export interface BucketWithComments extends DbBucket {
  comments: DbBucketComment[];
}

export interface GameWithBuckets extends DbGame {
  buckets: BucketWithComments[];
}

/**
 * Fetch games (with buckets + comments) for a player.
 * RLS scopes results to games the caller participates in, so a coach calling
 * this only sees the games they assigned to that player.
 */
export async function fetchGamesForPlayer(playerId: string): Promise<GameWithBuckets[]> {
  const { data: games, error } = await supabase
    .from('games')
    .select('*')
    .eq('player_id', playerId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  if (!games || games.length === 0) return [];

  const gameIds = games.map((g) => g.id);
  const { data: buckets, error: bucketsError } = await supabase
    .from('buckets')
    .select('*')
    .in('game_id', gameIds)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  if (bucketsError) throw bucketsError;

  let comments: DbBucketComment[] = [];
  const bucketIds = (buckets ?? []).map((b) => b.id);
  if (bucketIds.length > 0) {
    const { data: commentRows, error: commentsError } = await supabase
      .from('bucket_comments')
      .select('*')
      .in('bucket_id', bucketIds)
      .order('created_at', { ascending: true });

    if (commentsError) throw commentsError;
    comments = commentRows ?? [];
  }

  const commentsByBucket = new Map<string, DbBucketComment[]>();
  for (const comment of comments) {
    const list = commentsByBucket.get(comment.bucket_id) ?? [];
    list.push(comment);
    commentsByBucket.set(comment.bucket_id, list);
  }

  const bucketsByGame = new Map<string, BucketWithComments[]>();
  for (const bucket of buckets ?? []) {
    const list = bucketsByGame.get(bucket.game_id) ?? [];
    list.push({ ...bucket, comments: commentsByBucket.get(bucket.id) ?? [] });
    bucketsByGame.set(bucket.game_id, list);
  }

  return games.map((game) => ({
    ...game,
    buckets: bucketsByGame.get(game.id) ?? [],
  }));
}

/** Players who booked a try-out with the calling coach or have games from them. */
export async function fetchCoachRoster(): Promise<CoachRosterEntry[]> {
  const { data, error } = await supabase.rpc('get_coach_roster');
  if (error) throw error;
  return data ?? [];
}

export async function createGame(
  coachId: string,
  playerId: string,
  title: string,
  description: string,
): Promise<DbGame> {
  const { data, error } = await supabase
    .from('games')
    .insert({
      coach_id: coachId,
      player_id: playerId,
      title,
      description: description || null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function addBucket(
  gameId: string,
  title: string,
  description: string,
  dueDate?: string,
): Promise<DbBucket> {
  const { data, error } = await supabase
    .from('buckets')
    .insert({
      game_id: gameId,
      title,
      description: description || null,
      due_date: dueDate || null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/** Player marks a bucket done (pending_approval) or un-marks it (open). */
export async function setBucketStatus(bucketId: string, status: BucketStatus): Promise<void> {
  const { error } = await supabase
    .from('buckets')
    .update({
      status,
      completed_at: status === 'open' ? null : new Date().toISOString(),
    })
    .eq('id', bucketId);

  if (error) throw error;
}

/**
 * Coach approves a bucket; if every bucket in the game is now approved the
 * game is marked completed. Returns whether the game is completed.
 */
export async function approveBucket(gameId: string, bucketId: string): Promise<boolean> {
  await setBucketStatus(bucketId, 'approved');

  const { data: buckets, error } = await supabase
    .from('buckets')
    .select('status')
    .eq('game_id', gameId);

  if (error) throw error;

  const allApproved =
    (buckets?.length ?? 0) > 0 && (buckets ?? []).every((b) => b.status === 'approved');

  const { error: gameError } = await supabase
    .from('games')
    .update({
      completed: allApproved,
      completed_at: allApproved ? new Date().toISOString() : null,
    })
    .eq('id', gameId);

  if (gameError) throw gameError;
  return allApproved;
}

export async function addBucketComment(
  bucketId: string,
  authorId: string,
  authorName: string,
  body: string,
): Promise<DbBucketComment> {
  const { data, error } = await supabase
    .from('bucket_comments')
    .insert({
      bucket_id: bucketId,
      author_id: authorId,
      author_name: authorName,
      body,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
