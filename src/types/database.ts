export type MembershipPlan = 'walk-on' | 'locker-room' | 'varsity';
export type UserRole = 'player' | 'coach';
export type CoachApplicationStatus = 'pending' | 'approved' | 'rejected';
export type AssessedLevel = 'freshman' | 'jv' | 'varsity' | 'd1' | 'professional';
export type CoachTier = 'bronze' | 'silver' | 'gold' | 'premium';
export type PathwayChangeStatus = 'pending' | 'approved' | 'denied';

export interface Profile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  gender: 'male' | 'female' | null;
  avatar_url: string | null;
  roles: UserRole[];
  active_role: UserRole | null;
  player_onboarding_complete: boolean;
  coach_onboarding_complete: boolean;
  coach_application_status: CoachApplicationStatus | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan: MembershipPlan;
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
}

export interface PlayerAssessment {
  user_id: string;
  assessed_level: AssessedLevel;
  score: number;
  reasoning: string | null;
  breakthrough: string | null;
  assessed_at: string;
}

export interface CoachAssessment {
  user_id: string;
  overall_rating: number;
  tier: CoachTier;
  tier_label: string | null;
  strengths: string[];
  opportunities: string[];
  reasoning: string | null;
  application_status: CoachApplicationStatus;
  reviewed_at: string | null;
  reviewed_by: string | null;
  assessed_at: string;
}

export interface OnboardingSession {
  id: string;
  user_id: string;
  role: UserRole | 'explorer';
  screen: string | null;
  answers: Record<string, unknown>;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PlayerPathway {
  user_id: string;
  exploring_pathway_id: string | null;
  locked_pathway_id: string | null;
  pathway_selection_completed: boolean;
  updated_at: string;
}

export interface PathwayChangeRequest {
  id: string;
  player_id: string;
  current_pathway: string;
  requested_pathway: string;
  justification: string;
  status: PathwayChangeStatus;
  auto_approve_at: string;
  reviewed_by: string | null;
  submitted_at: string;
  resolved_at: string | null;
}

export interface DiscoveryBooking {
  id: string;
  player_id: string;
  coach_id: string;
  pathway_id: string;
  plan: MembershipPlan;
  scheduled_at: string;
  duration_minutes: number;
  status: 'scheduled' | 'completed' | 'canceled' | 'no_show';
  created_at: string;
}

export interface UsageCounter {
  user_id: string;
  month: string;
  pathway_chats: Record<string, boolean>;
  coach_chat_ids: string[];
  shadow_used: boolean;
  updated_at: string;
}

export type BucketStatus = 'open' | 'pending_approval' | 'approved';

export interface DbGame {
  id: string;
  coach_id: string;
  player_id: string;
  title: string;
  description: string | null;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbBucket {
  id: string;
  game_id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  status: BucketStatus;
  sort_order: number;
  completed_at: string | null;
  created_at: string;
}

export interface DbBucketComment {
  id: string;
  bucket_id: string;
  author_id: string;
  author_name: string;
  body: string;
  created_at: string;
}

export interface CoachRosterEntry {
  player_id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  avatar_url: string | null;
  pathway_id: string | null;
  joined_at: string;
}

export interface DbMessage {
  id: string;
  sender_id: string;
  recipient_id: string;
  body: string;
  read_at: string | null;
  created_at: string;
}

export type CommunityPostType = 'goal' | 'win' | 'encourage' | 'milestone';

export interface DbCommunityPost {
  id: string;
  author_id: string;
  author_name: string;
  author_role: 'player' | 'coach';
  pathway_id: string;
  post_type: CommunityPostType;
  content: string;
  goal_title: string | null;
  created_at: string;
}

export interface DbPostEncouragement {
  post_id: string;
  user_id: string;
  created_at: string;
}

export interface DbLockerMessage {
  id: string;
  sender_id: string;
  sender_name: string;
  sender_role: 'player' | 'coach';
  sender_pathway_id: string;
  channel_pathway_id: string;
  body: string;
  created_at: string;
}

export interface PlayerCoachEntry {
  coach_id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  avatar_url: string | null;
  pathway_id: string | null;
  connected_at: string;
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & { id: string; email: string };
        Update: Partial<Profile>;
        Relationships: [];
      };
      subscriptions: {
        Row: Subscription;
        Insert: Partial<Subscription> & { user_id: string };
        Update: Partial<Subscription>;
        Relationships: [];
      };
      player_assessments: {
        Row: PlayerAssessment;
        Insert: Partial<PlayerAssessment> & { user_id: string };
        Update: Partial<PlayerAssessment>;
        Relationships: [];
      };
      coach_assessments: {
        Row: CoachAssessment;
        Insert: Partial<CoachAssessment> & { user_id: string };
        Update: Partial<CoachAssessment>;
        Relationships: [];
      };
      onboarding_sessions: {
        Row: OnboardingSession;
        Insert: Partial<OnboardingSession> & { user_id: string; role: OnboardingSession['role'] };
        Update: Partial<OnboardingSession>;
        Relationships: [];
      };
      player_pathways: {
        Row: PlayerPathway;
        Insert: Partial<PlayerPathway> & { user_id: string };
        Update: Partial<PlayerPathway>;
        Relationships: [];
      };
      pathway_change_requests: {
        Row: PathwayChangeRequest;
        Insert: Partial<PathwayChangeRequest> & {
          player_id: string;
          current_pathway: string;
          requested_pathway: string;
          justification: string;
        };
        Update: Partial<PathwayChangeRequest>;
        Relationships: [];
      };
      discovery_bookings: {
        Row: DiscoveryBooking;
        Insert: Partial<DiscoveryBooking> & {
          player_id: string;
          coach_id: string;
          pathway_id: string;
          plan: MembershipPlan;
          scheduled_at: string;
        };
        Update: Partial<DiscoveryBooking>;
        Relationships: [];
      };
      usage_counters: {
        Row: UsageCounter;
        Insert: Partial<UsageCounter> & { user_id: string; month: string };
        Update: Partial<UsageCounter>;
        Relationships: [];
      };
      games: {
        Row: DbGame;
        Insert: Partial<DbGame> & { coach_id: string; player_id: string; title: string };
        Update: Partial<DbGame>;
        Relationships: [];
      };
      buckets: {
        Row: DbBucket;
        Insert: Partial<DbBucket> & { game_id: string; title: string };
        Update: Partial<DbBucket>;
        Relationships: [];
      };
      bucket_comments: {
        Row: DbBucketComment;
        Insert: Partial<DbBucketComment> & {
          bucket_id: string;
          author_id: string;
          author_name: string;
          body: string;
        };
        Update: Partial<DbBucketComment>;
        Relationships: [];
      };
      messages: {
        Row: DbMessage;
        Insert: Partial<DbMessage> & {
          sender_id: string;
          recipient_id: string;
          body: string;
        };
        Update: Partial<DbMessage>;
        Relationships: [];
      };
      community_posts: {
        Row: DbCommunityPost;
        Insert: Partial<DbCommunityPost> & {
          author_id: string;
          author_name: string;
          pathway_id: string;
          content: string;
        };
        Update: Partial<DbCommunityPost>;
        Relationships: [];
      };
      post_encouragements: {
        Row: DbPostEncouragement;
        Insert: { post_id: string; user_id: string };
        Update: Partial<DbPostEncouragement>;
        Relationships: [];
      };
      locker_messages: {
        Row: DbLockerMessage;
        Insert: Partial<DbLockerMessage> & {
          sender_id: string;
          sender_name: string;
          sender_pathway_id: string;
          channel_pathway_id: string;
          body: string;
        };
        Update: Partial<DbLockerMessage>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      set_own_plan: {
        Args: { new_plan: MembershipPlan };
        Returns: undefined;
      };
      resolve_due_pathway_change: {
        Args: Record<string, never>;
        Returns: string | null;
      };
      review_pathway_change: {
        Args: { request_id: string; decision: 'approved' | 'denied' };
        Returns: undefined;
      };
      get_coach_roster: {
        Args: Record<string, never>;
        Returns: CoachRosterEntry[];
      };
      get_player_coaches: {
        Args: Record<string, never>;
        Returns: PlayerCoachEntry[];
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
