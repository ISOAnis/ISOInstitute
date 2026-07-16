import { supabase } from '../lib/supabase';
import type { DbMessage, PlayerCoachEntry } from '../types/database';

/** Full conversation between the current user and another user, oldest first. */
export async function fetchConversation(
  userId: string,
  otherUserId: string,
): Promise<DbMessage[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .or(
      `and(sender_id.eq.${userId},recipient_id.eq.${otherUserId}),` +
        `and(sender_id.eq.${otherUserId},recipient_id.eq.${userId})`,
    )
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function sendMessage(
  senderId: string,
  recipientId: string,
  body: string,
): Promise<DbMessage> {
  const { data, error } = await supabase
    .from('messages')
    .insert({ sender_id: senderId, recipient_id: recipientId, body })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/** Mark every unread message from otherUserId to the current user as read. */
export async function markConversationRead(
  userId: string,
  otherUserId: string,
): Promise<void> {
  const { error } = await supabase
    .from('messages')
    .update({ read_at: new Date().toISOString() })
    .eq('sender_id', otherUserId)
    .eq('recipient_id', userId)
    .is('read_at', null);

  if (error) throw error;
}

/**
 * Subscribe to new messages addressed to the current user.
 * Returns an unsubscribe function.
 */
export function subscribeToIncomingMessages(
  userId: string,
  onMessage: (message: DbMessage) => void,
): () => void {
  const channel = supabase
    .channel(`messages-${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `recipient_id=eq.${userId}`,
      },
      (payload) => onMessage(payload.new as DbMessage),
    )
    .subscribe();

  return () => {
    void supabase.removeChannel(channel);
  };
}

/** Coaches connected to the current player (via bookings or games). */
export async function fetchPlayerCoaches(): Promise<PlayerCoachEntry[]> {
  const { data, error } = await supabase.rpc('get_player_coaches');
  if (error) throw error;
  return data ?? [];
}
