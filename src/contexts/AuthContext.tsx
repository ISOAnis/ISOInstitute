import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import {
  approveCoachApplication,
  clearLegacyLocalStorage,
  ensureUserRecords,
  fetchProfile,
  fetchSubscription,
  syncLegacyLocalStorage,
  updateActiveRole,
} from '../services/profileService';
import {
  fetchPlayerPathway,
  resolveDuePathwayChange,
  setOwnPlan,
} from '../services/pathwayService';
import type { MembershipPlan, Profile, Subscription, UserRole } from '../types/database';

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  subscription: Subscription | null;
  plan: MembershipPlan;
  loading: boolean;
  isAdmin: boolean;
  isLoggedIn: boolean;
  isPlayerOnboarded: boolean;
  isCoachOnboarded: boolean;
  isCoachPending: boolean;
  canAccessPlayerPortal: boolean;
  canAccessCoachPortal: boolean;
  refreshProfile: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<{ needsEmailConfirmation: boolean }>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithOAuth: (provider: 'google' | 'apple') => Promise<void>;
  signOut: () => Promise<void>;
  switchPortalRole: (role: UserRole) => Promise<void>;
  approveCoach: (coachUserId: string) => Promise<void>;
  updatePlan: (plan: MembershipPlan) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/** Mirror DB pathway state to the legacy localStorage keys the portals read. */
async function syncPathwayState(userId: string) {
  try {
    // Auto-approve any pathway change past its 7-day window first.
    await resolveDuePathwayChange().catch(() => null);

    const pathway = await fetchPlayerPathway(userId);
    if (!pathway) return;

    if (pathway.locked_pathway_id) {
      localStorage.setItem('iso_locked_pathway', pathway.locked_pathway_id);
      localStorage.setItem('iso_selected_pathway', pathway.locked_pathway_id);
    }
    if (pathway.exploring_pathway_id) {
      localStorage.setItem('iso_exploring_pathway', pathway.exploring_pathway_id);
      if (!pathway.locked_pathway_id) {
        localStorage.setItem('iso_selected_pathway', pathway.exploring_pathway_id);
      }
    }
  } catch (error) {
    console.error('Failed to sync pathway state:', error);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUserData = useCallback(async (userId: string, authUser?: User | null) => {
    try {
      const user = authUser ?? (await supabase.auth.getUser()).data.user;
      if (!user || user.id !== userId) {
        const [nextProfile, nextSubscription] = await Promise.all([
          fetchProfile(userId),
          fetchSubscription(userId),
        ]);
        setProfile(nextProfile);
        setSubscription(nextSubscription);
        if (nextProfile) syncLegacyLocalStorage(nextProfile, nextSubscription);
        return;
      }

      const { profile: nextProfile, subscription: nextSubscription } = await ensureUserRecords(user);
      setProfile(nextProfile);
      setSubscription(nextSubscription);
      syncLegacyLocalStorage(nextProfile, nextSubscription);
      await syncPathwayState(userId);
    } catch (error) {
      console.error('Failed to load user profile:', error);
      setProfile(null);
      setSubscription(null);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!session?.user?.id) return;
    await loadUserData(session.user.id);
  }, [loadUserData, session?.user?.id]);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(initialSession);
      if (initialSession?.user?.id) {
        await loadUserData(initialSession.user.id, initialSession.user);
      }
      if (mounted) setLoading(false);
    };

    init();

    const { data: { subscription: authListener } } = supabase.auth.onAuthStateChange(
      async (_event, nextSession) => {
        setSession(nextSession);
        if (nextSession?.user?.id) {
          await loadUserData(nextSession.user.id, nextSession.user);
        } else {
          setProfile(null);
          setSubscription(null);
          clearLegacyLocalStorage();
        }
        setLoading(false);
      },
    );

    return () => {
      mounted = false;
      authListener.unsubscribe();
    };
  }, [loadUserData]);

  const signUp = useCallback(async (email: string, password: string) => {
    const redirectTo = `${window.location.origin}?page=join`;
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { emailRedirectTo: redirectTo },
    });
    if (error) throw error;
    const needsEmailConfirmation = !data.session;
    if (data.session?.user?.id) {
      await loadUserData(data.session.user.id, data.session.user);
    }
    return { needsEmailConfirmation };
  }, [loadUserData]);

  const signIn = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) throw error;
    if (data.session?.user?.id) {
      await loadUserData(data.session.user.id, data.session.user);
    }
  }, [loadUserData]);

  const signInWithOAuth = useCallback(async (provider: 'google' | 'apple') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}?page=join` },
    });
    if (error) throw error;
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    clearLegacyLocalStorage();
    setProfile(null);
    setSubscription(null);
    setSession(null);
  }, []);

  const switchPortalRole = useCallback(async (role: UserRole) => {
    if (!session?.user?.id || !profile) return;
    if (!profile.roles.includes(role)) return;
    const updated = await updateActiveRole(session.user.id, role);
    setProfile(updated);
    syncLegacyLocalStorage(updated, subscription);
  }, [profile, session?.user?.id, subscription]);

  const approveCoach = useCallback(async (coachUserId: string) => {
    if (!session?.user?.id || !profile?.is_admin) {
      throw new Error('Only admins can approve coach applications.');
    }
    await approveCoachApplication(coachUserId, session.user.id);
    await refreshProfile();
  }, [profile?.is_admin, refreshProfile, session?.user?.id]);

  const updatePlan = useCallback(async (nextPlan: MembershipPlan) => {
    if (!session?.user?.id) throw new Error('Not signed in');
    await setOwnPlan(nextPlan);
    const nextSubscription = await fetchSubscription(session.user.id);
    setSubscription(nextSubscription);
    if (profile) syncLegacyLocalStorage(profile, nextSubscription);
  }, [profile, session?.user?.id]);

  const plan: MembershipPlan = subscription?.plan ?? 'walk-on';
  const isLoggedIn = !!session?.user;
  const isPlayerOnboarded = !!profile?.player_onboarding_complete;
  const isCoachOnboarded =
    !!profile?.coach_onboarding_complete &&
    profile.coach_application_status === 'approved';
  const isCoachPending = profile?.coach_application_status === 'pending';
  const canAccessPlayerPortal = isLoggedIn && isPlayerOnboarded;
  const canAccessCoachPortal = isLoggedIn && isCoachOnboarded;

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      subscription,
      plan,
      loading,
      isAdmin: !!profile?.is_admin,
      isLoggedIn,
      isPlayerOnboarded,
      isCoachOnboarded,
      isCoachPending,
      canAccessPlayerPortal,
      canAccessCoachPortal,
      refreshProfile,
      signUp,
      signIn,
      signInWithOAuth,
      signOut,
      switchPortalRole,
      approveCoach,
      updatePlan,
    }),
    [
      session,
      profile,
      subscription,
      plan,
      loading,
      isLoggedIn,
      isPlayerOnboarded,
      isCoachOnboarded,
      isCoachPending,
      canAccessPlayerPortal,
      canAccessCoachPortal,
      refreshProfile,
      signUp,
      signIn,
      signInWithOAuth,
      signOut,
      switchPortalRole,
      approveCoach,
      updatePlan,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
