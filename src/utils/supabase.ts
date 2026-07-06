import { supabase } from '../lib/supabase';

interface WaitlistEntry {
  fullName: string;
  email: string;
  phone: string;
}

export async function saveWaitlistEntry(entry: WaitlistEntry) {
  const { error } = await supabase.from('waitlist_entries').insert({
    full_name: entry.fullName.trim(),
    email: entry.email.trim(),
    phone: entry.phone.trim(),
  });

  if (error) throw error;
}
