import { createClient } from '@supabase/supabase-js';

// Supabase configuration
// TODO: Replace these with your actual Supabase project credentials
// Get these from: https://supabase.com/dashboard -> Your Project -> Settings -> API
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create Supabase client (use placeholder values if not configured to avoid errors)
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

// Waitlist data interface
export interface WaitlistEntry {
  fullName: string;
  email: string;
  phone?: string;
  createdAt?: string;
}

/**
 * Save waitlist entry to database
 */
export async function saveWaitlistEntry(data: WaitlistEntry): Promise<{ success: boolean; error?: string }> {
  try {
    // If Supabase is not configured, fall back to console log
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('Supabase not configured. Logging to console instead:', data);
      return { success: true };
    }

    const { error } = await supabase
      .from('waitlist')
      .insert([
        {
          full_name: data.fullName,
          email: data.email,
          phone: data.phone || null,
          created_at: new Date().toISOString(),
        },
      ]);

    if (error) {
      console.error('Error saving waitlist entry:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Unexpected error saving waitlist entry:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

