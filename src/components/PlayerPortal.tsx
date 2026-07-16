import * as React from 'react';
import { useState, useEffect, useMemo } from 'react';
import '../pages/JoinISOPage.css';
import {
  Trophy, Target, CheckCircle2, Circle, Award, TrendingUp, Calendar,
  MessageSquare, Plus, Lock, Clock, UserCircle, Users, X, Moon,
  Sprout, BookOpen, Star as StarIcon, Gem, Sparkles, AlertCircle,
  ArrowRight, Dumbbell, Activity, Settings, Rocket, Globe, LucideIcon,
  Home, GitBranch, Menu, Compass, CheckCheck, Zap, ChevronRight, ShoppingBag, MessageCircle, Video,
} from 'lucide-react';
import { PlayerProfileSection } from './PlayerProfileSection';
import { LockerRoomChat } from './LockerRoomChat';
import { LockerRoomGoals } from './LockerRoomGoals';
import { ISOCommunityForum, CommunityUpgradeGate } from './ISOCommunityForum';
import { ExplorerUpgradeGate } from './ExplorerUpgradeGate';
import { ISOStoreSection } from './portal-store';
import { PathwayLockConfirmModal } from './PathwayLockConfirmModal';
import { PathwayChangeRequestModal } from './PathwayChangeRequestModal';
import { CoachPlayerChat } from './CoachPlayerChat';
import { PortalTutorial } from './PortalTutorial';
import {
  getPlayerTutorialScope,
  getPlayerTutorialSteps,
  isTutorialComplete,
  markTutorialComplete,
  type PlayerTutorialScope,
} from '../utils/portalTutorial';
import { ProfileCompletionModal } from './ProfileCompletionModal';
import { PathwaySelectionModal } from './PathwaySelectionModal';
import { LockerRoomCheckoutModal } from './LockerRoomCheckoutModal';
import { VarsityInterestModal } from './VarsityInterestModal';
import { ConsultationModal } from './ConsultationModal';
import { PortalGreeting } from './PortalGreeting';
import { PortalChromeBar } from './PortalChromeBar';
import { PlayerISODashboard } from './PlayerISODashboard';
import { PATHWAYS, PATHWAY_BY_ID } from '../data/pathways';
import {
  getUserPlan, setUserPlan, usesExplorerPortal,
  type MembershipPlan, PLAN_LABELS, canAccessLockerRoomChat, canAccessOnlineStore,
  isPathwayLocked, getActivePathway, getLockedPathway, getExploringPathway, lockPathway,
  setExploringPathway,
} from '../utils/membership';
import {
  type ExplorerUsage,
  getExplorerUsage,
  saveExplorerUsage as saveLocalExplorerUsage,
  canScheduleCoachCall,
  chatUsedWithCoach,
  chatUsedForPathway,
  discoveryCallsRemaining,
  LOCKER_ROOM_MONTHLY_CALLS,
  LOCKER_ROOM_PRICE_USD,
  TRYOUT_MINUTES,
} from '../utils/explorerUsage';
import { useDiscoverableCoaches } from '../hooks/useDiscoverableCoaches';
import { useAuth } from '../contexts/AuthContext';
import {
  fetchExplorerUsage as fetchDbExplorerUsage,
  saveExplorerUsage as saveDbExplorerUsage,
  resetExplorerUsage,
} from '../services/discoveryService';
import { saveExploringPathway, saveLockedPathway } from '../services/pathwayService';
import {
  fetchGamesForPlayer,
  setBucketStatus,
  type GameWithBuckets,
} from '../services/gamesService';
import { fetchPlayerCoaches } from '../services/messagesService';
import type { PlayerCoachEntry } from '../types/database';
import { type ExplorerCoachView as ExplorerCoach, toExplorerCoachView } from '../types/discoverableCoach';

// ─── TYPES ────────────────────────────────────────────────────────────────────
interface Bucket {
  id: string; title: string; description: string;
  completed: boolean; dueDate?: string;
}
interface Game {
  id: string; title: string; buckets: Bucket[];
  completed: boolean; completedDate?: string;
}
interface SkillNodeDef {
  id: string; label: string; sublabel: string;
  row: number; col: number; unlocksAt: number;
}
type WalkOnSection = 'explore' | 'goals' | 'community' | 'locker-room' | 'store' | 'profile';
type PlayerSection = 'dashboard' | 'skill-tree' | 'progress' | 'messages' | 'store' | 'profile' | 'locker-room';

interface PlayerPortalProps {
  onNavigate?: (page: any) => void;
}

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const PATHWAY_SELECTION_KEY = 'iso_pathway_selection_completed';

const PATHWAY_HEX: Record<string, string> = {
  deen: '#10b981', health: '#ef4444', medicine: '#3b82f6',
  engineering: '#a855f7', entrepreneurship: '#f97316', global: '#06b6d4',
};

const pathwayIconMap: Record<string, LucideIcon> = {
  deen: Moon, health: Dumbbell, medicine: Activity,
  engineering: Settings, entrepreneurship: Rocket, global: Globe,
};

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const mockGames: Game[] = [
  {
    id: '1', title: 'Establish Daily Prayer Routine', completed: true,
    completedDate: '2024-10-15',
    buckets: [
      { id: '1-1', title: 'Pray Fajr on time for 7 days', description: 'Build consistency with morning prayer', completed: true },
      { id: '1-2', title: 'Learn proper wudu technique', description: 'Master the ablution process', completed: true },
      { id: '1-3', title: 'Memorize Al-Fatiha perfectly', description: 'Essential surah for every prayer', completed: true },
      { id: '1-4', title: 'Set up prayer space at home', description: 'Create dedicated worship area', completed: true },
    ],
  },
  {
    id: '2', title: 'Build Spiritual Foundation', completed: false,
    buckets: [
      { id: '2-1', title: 'Read 10 pages of Quran daily', description: 'Consistent engagement with scripture', completed: true },
      { id: '2-2', title: 'Attend Friday Jummah for 4 weeks', description: 'Connect with community', completed: true },
      { id: '2-3', title: 'Complete tafsir course on Surah Yusuf', description: 'Deepen understanding', completed: true },
      { id: '2-4', title: 'Start daily dhikr practice', description: 'Remembrance after each prayer', completed: false, dueDate: '2024-11-20' },
      { id: '2-5', title: 'Journal spiritual reflections weekly', description: 'Track your journey', completed: false, dueDate: '2024-11-25' },
    ],
  },
  {
    id: '3', title: 'Academic Excellence', completed: false,
    buckets: [
      { id: '3-1', title: 'Achieve 3.5 GPA this semester', description: 'Improve academic performance', completed: false, dueDate: '2024-12-15' },
      { id: '3-2', title: 'Complete 2 practice SAT tests', description: 'Prepare for standardized testing', completed: false, dueDate: '2024-11-30' },
      { id: '3-3', title: 'Meet with guidance counselor', description: 'Plan college pathway', completed: false, dueDate: '2024-11-18' },
    ],
  },
];

/** Map a Supabase game row (with buckets) to the portal's UI shape. */
function dbGameToUiGame(game: GameWithBuckets): Game {
  return {
    id: game.id,
    title: game.title,
    completed: game.completed,
    completedDate: game.completed_at ? game.completed_at.split('T')[0] : undefined,
    buckets: game.buckets.map((b) => ({
      id: b.id,
      title: b.title,
      description: b.description ?? '',
      completed: b.status !== 'open',
      dueDate: b.due_date ?? undefined,
    })),
  };
}

// ─── SKILL TREE DATA ──────────────────────────────────────────────────────────
// Diamond connection graph — same topology for every pathway
const SKILL_CONNECTIONS: [string, string][] = [
  ['root', 'left1'], ['root', 'right1'],
  ['left1', 'midL'], ['left1', 'midC'],
  ['right1', 'midC'], ['right1', 'midR'],
  ['midL', 'advL'], ['midC', 'advL'],
  ['midC', 'advR'], ['midR', 'advR'],
  ['advL', 'mastery'], ['advR', 'mastery'],
];

const getNodeXY = (row: number, col: number) => ({ x: col * 200 + 100, y: row * 100 + 60 });

const SKILL_TREES: Record<string, SkillNodeDef[]> = {
  deen: [
    { id: 'root',    row: 0, col: 1, label: 'Daily Salah',          sublabel: 'Foundation',         unlocksAt: 0 },
    { id: 'left1',   row: 1, col: 0, label: 'Quran Study',          sublabel: 'Core Habit',          unlocksAt: 1 },
    { id: 'right1',  row: 1, col: 2, label: 'Sunnah Lifestyle',     sublabel: 'Core Habit',          unlocksAt: 1 },
    { id: 'midL',    row: 2, col: 0, label: 'Islamic Knowledge',    sublabel: 'Fiqh & Hadith',       unlocksAt: 3 },
    { id: 'midC',    row: 2, col: 1, label: 'Dhikr & Reflection',   sublabel: 'Inner Practice',      unlocksAt: 3 },
    { id: 'midR',    row: 2, col: 2, label: 'Community Service',    sublabel: 'Mosque & Ummah',      unlocksAt: 3 },
    { id: 'advL',    row: 3, col: 0, label: 'Teaching Others',      sublabel: 'Dawah',               unlocksAt: 6 },
    { id: 'advR',    row: 3, col: 2, label: 'Spiritual Leadership', sublabel: 'Guiding Others',      unlocksAt: 6 },
    { id: 'mastery', row: 4, col: 1, label: 'Spiritual Excellence', sublabel: 'Full Integration',    unlocksAt: 10 },
  ],
  health: [
    { id: 'root',    row: 0, col: 1, label: 'Movement Habit',       sublabel: 'Foundation',         unlocksAt: 0 },
    { id: 'left1',   row: 1, col: 0, label: 'Strength Training',    sublabel: 'Core Skill',          unlocksAt: 1 },
    { id: 'right1',  row: 1, col: 2, label: 'Nutrition Protocol',   sublabel: 'Core Skill',          unlocksAt: 1 },
    { id: 'midL',    row: 2, col: 0, label: 'Athletic Performance', sublabel: 'Sport Specific',      unlocksAt: 3 },
    { id: 'midC',    row: 2, col: 1, label: 'Mental Resilience',    sublabel: 'Mind Training',       unlocksAt: 3 },
    { id: 'midR',    row: 2, col: 2, label: 'Recovery Science',     sublabel: 'Sleep & Rest',        unlocksAt: 3 },
    { id: 'advL',    row: 3, col: 0, label: 'Elite Training',       sublabel: 'Peak Performance',    unlocksAt: 6 },
    { id: 'advR',    row: 3, col: 2, label: 'Coach Others',         sublabel: 'Share Knowledge',     unlocksAt: 6 },
    { id: 'mastery', row: 4, col: 1, label: 'Warrior Standard',     sublabel: 'Full Mastery',        unlocksAt: 10 },
  ],
  medicine: [
    { id: 'root',    row: 0, col: 1, label: 'Academic Foundation',  sublabel: 'Foundation',         unlocksAt: 0 },
    { id: 'left1',   row: 1, col: 0, label: 'Clinical Exposure',    sublabel: 'Shadowing',           unlocksAt: 1 },
    { id: 'right1',  row: 1, col: 2, label: 'Research Basics',      sublabel: 'Methodology',         unlocksAt: 1 },
    { id: 'midL',    row: 2, col: 0, label: 'MCAT Preparation',     sublabel: 'Test Strategy',       unlocksAt: 3 },
    { id: 'midC',    row: 2, col: 1, label: 'Patient Empathy',      sublabel: 'Communication',       unlocksAt: 3 },
    { id: 'midR',    row: 2, col: 2, label: 'Healthcare Service',   sublabel: 'Volunteering',        unlocksAt: 3 },
    { id: 'advL',    row: 3, col: 0, label: 'Research Project',     sublabel: 'Independent Work',    unlocksAt: 6 },
    { id: 'advR',    row: 3, col: 2, label: 'Med School Strategy',  sublabel: 'Application',         unlocksAt: 6 },
    { id: 'mastery', row: 4, col: 1, label: "Healer's Path",        sublabel: 'Full Readiness',      unlocksAt: 10 },
  ],
  engineering: [
    { id: 'root',    row: 0, col: 1, label: 'Core Fundamentals',    sublabel: 'Foundation',         unlocksAt: 0 },
    { id: 'left1',   row: 1, col: 0, label: 'Programming',          sublabel: 'Code Basics',         unlocksAt: 1 },
    { id: 'right1',  row: 1, col: 2, label: 'Design Thinking',      sublabel: 'Problem Solving',     unlocksAt: 1 },
    { id: 'midL',    row: 2, col: 0, label: 'Build Projects',       sublabel: 'Portfolio Work',      unlocksAt: 3 },
    { id: 'midC',    row: 2, col: 1, label: 'Engineering Math',     sublabel: 'Applied Math',        unlocksAt: 3 },
    { id: 'midR',    row: 2, col: 2, label: 'Team Collaboration',   sublabel: 'Group Projects',      unlocksAt: 3 },
    { id: 'advL',    row: 3, col: 0, label: 'Open Source',          sublabel: 'Real Codebase',       unlocksAt: 6 },
    { id: 'advR',    row: 3, col: 2, label: 'Industry Experience',  sublabel: 'Internship',          unlocksAt: 6 },
    { id: 'mastery', row: 4, col: 1, label: "Builder's Mark",       sublabel: 'Shipped Impact',      unlocksAt: 10 },
  ],
  entrepreneurship: [
    { id: 'root',    row: 0, col: 1, label: 'Business Mindset',     sublabel: 'Foundation',         unlocksAt: 0 },
    { id: 'left1',   row: 1, col: 0, label: 'Idea Validation',      sublabel: 'Test First',          unlocksAt: 1 },
    { id: 'right1',  row: 1, col: 2, label: 'Market Research',      sublabel: 'Know Your Space',     unlocksAt: 1 },
    { id: 'midL',    row: 2, col: 0, label: 'Build Your MVP',       sublabel: 'First Version',       unlocksAt: 3 },
    { id: 'midC',    row: 2, col: 1, label: 'Financial Literacy',   sublabel: 'Money & Models',      unlocksAt: 3 },
    { id: 'midR',    row: 2, col: 2, label: 'Network Building',     sublabel: 'Connections',         unlocksAt: 3 },
    { id: 'advL',    row: 3, col: 0, label: 'First Revenue',        sublabel: 'Earn Dollar One',     unlocksAt: 6 },
    { id: 'advR',    row: 3, col: 2, label: 'Build Your Team',      sublabel: 'Recruit & Lead',      unlocksAt: 6 },
    { id: 'mastery', row: 4, col: 1, label: 'Founder Mode',         sublabel: 'Sustainable Biz',     unlocksAt: 10 },
  ],
  global: [
    { id: 'root',    row: 0, col: 1, label: 'Global Awareness',     sublabel: 'Foundation',         unlocksAt: 0 },
    { id: 'left1',   row: 1, col: 0, label: 'Research & Writing',   sublabel: 'Policy Skills',       unlocksAt: 1 },
    { id: 'right1',  row: 1, col: 2, label: 'Economics Basics',     sublabel: 'Systems Thinking',    unlocksAt: 1 },
    { id: 'midL',    row: 2, col: 0, label: 'Public Speaking',      sublabel: 'Persuasion',          unlocksAt: 3 },
    { id: 'midC',    row: 2, col: 1, label: 'Intl Relations',       sublabel: 'Diplomacy',           unlocksAt: 3 },
    { id: 'midR',    row: 2, col: 2, label: 'Local Organizing',     sublabel: 'Grassroots',          unlocksAt: 3 },
    { id: 'advL',    row: 3, col: 0, label: 'Policy Development',   sublabel: 'Draft & Advocate',    unlocksAt: 6 },
    { id: 'advR',    row: 3, col: 2, label: 'Intl Experience',      sublabel: 'Work/Study Abroad',   unlocksAt: 6 },
    { id: 'mastery', row: 4, col: 1, label: 'The Reformer',         sublabel: 'Sustained Impact',    unlocksAt: 10 },
  ],
};

// ─── TIER DATA ────────────────────────────────────────────────────────────────
const TIERS = [
  { id: 'freshman', name: 'Freshman', Icon: Sprout,   minGames: 0,  color: 'from-green-500 to-emerald-600',  hex: '#10b981', darkHex: '#065f46' },
  { id: 'jv',       name: 'JV',       Icon: BookOpen, minGames: 3,  color: 'from-blue-500 to-cyan-600',      hex: '#3b82f6', darkHex: '#1e3a8a' },
  { id: 'varsity',  name: 'Varsity',  Icon: StarIcon, minGames: 6,  color: 'from-purple-500 to-indigo-600',  hex: '#a855f7', darkHex: '#4c1d95' },
  { id: 'd1',       name: 'D1',       Icon: Trophy,   minGames: 10, color: 'from-orange-500 to-amber-600',   hex: '#f97316', darkHex: '#7c2d12' },
  { id: 'professional', name: 'Pro',  Icon: Gem,      minGames: 15, color: 'from-orange-500 to-orange-600',  hex: '#ea580c', darkHex: '#7c2d12' },
];

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
const SIDEBAR_ITEMS: { id: PlayerSection; label: string; Icon: React.ComponentType<{ size: number; style?: React.CSSProperties }> }[] = [
  { id: 'dashboard',  label: 'Dashboard',   Icon: Home },
  { id: 'skill-tree', label: 'Skill Tree',  Icon: GitBranch },
  { id: 'progress',   label: 'My Progress', Icon: Trophy },
  { id: 'store',      label: 'ISO Store',   Icon: ShoppingBag },
  { id: 'messages',   label: 'Messages',    Icon: MessageSquare },
  { id: 'locker-room', label: 'Locker Room', Icon: Video },
  { id: 'profile',    label: 'My Profile',  Icon: UserCircle },
];

const SECTIONS_BY_PLAN: Record<MembershipPlan, PlayerSection[]> = {
  'walk-on': ['dashboard', 'profile'],
  'locker-room': ['dashboard', 'progress', 'profile'],
  varsity: ['dashboard', 'skill-tree', 'progress', 'store', 'messages', 'locker-room', 'profile'],
};

const NAV_H = 72; // px — nav bar bottom clearance
const SIDEBAR_W_EXPANDED = 220;
const SIDEBAR_W_COLLAPSED = 64;

function PortalSidebar({
  active, onSelect, accentColor, expanded, onToggle,
  membershipPlan, onUpgrade,
}: {
  active: PlayerSection;
  onSelect: (s: PlayerSection) => void;
  accentColor: string;
  expanded: boolean;
  onToggle: () => void;
  membershipPlan: MembershipPlan;
  onUpgrade: (plan: MembershipPlan) => void;
}) {
  const w = expanded ? SIDEBAR_W_EXPANDED : SIDEBAR_W_COLLAPSED;
  const visibleSections = SECTIONS_BY_PLAN[membershipPlan];

  return (
    <div
      style={{
        position: 'fixed', top: NAV_H, left: 0, bottom: 0,
        width: w, background: '#0A0A0A',
        borderRight: '1px solid rgba(255,255,255,0.07)',
        transition: 'width 0.25s ease', display: 'flex',
        flexDirection: 'column', zIndex: 40, overflow: 'hidden',
      }}
    >
      {/* Hamburger toggle */}
      <button
        onClick={onToggle}
        style={{
          height: 52, display: 'flex', alignItems: 'center',
          justifyContent: expanded ? 'space-between' : 'center',
          padding: expanded ? '0 18px' : '0',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          background: 'transparent', border: 'none',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          cursor: 'pointer', width: '100%', color: 'rgba(255,255,255,0.4)',
        }}
      >
        {expanded && (
          <span style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 11, fontWeight: 700, letterSpacing: 3,
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)',
          }}>
            Portal
          </span>
        )}
        <Menu size={16} />
      </button>

      {/* Nav items */}
      <div style={{ flex: 1, paddingTop: 8, overflowY: 'auto', overflowX: 'hidden' }}>
        {SIDEBAR_ITEMS.map(item => {
          const isVisible = visibleSections.includes(item.id);
          const isActive = active === item.id;
          const label = membershipPlan === 'locker-room' && item.id === 'progress' ? 'My Goals' : item.label;
          return (
            <button
              key={item.id}
              data-tutorial-id={`player-nav-${item.id}`}
              onClick={() => isVisible ? onSelect(item.id) : onUpgrade(item.id === 'skill-tree' || item.id === 'messages' ? 'varsity' : 'locker-room')}
              style={{
                width: '100%', display: 'flex', alignItems: 'center',
                gap: 12, padding: expanded ? '13px 18px' : '13px 0',
                justifyContent: expanded ? 'flex-start' : 'center',
                background: isActive ? `${accentColor}15` : 'transparent',
                color: isActive ? '#fff' : isVisible ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.2)',
                cursor: 'pointer', border: 'none', outline: 'none',
                position: 'relative', transition: 'color 0.15s, background 0.15s',
                whiteSpace: 'nowrap', opacity: isVisible ? 1 : 0.55,
              }}
              onMouseEnter={e => { if (!isActive && isVisible) (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.75)'; }}
              onMouseLeave={e => { if (!isActive && isVisible) (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.4)'; }}
            >
              {/* Active indicator bar */}
              <span style={{
                position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
                background: isActive ? accentColor : 'transparent',
                borderRadius: '0 2px 2px 0', transition: 'background 0.15s',
              }} />
              <item.Icon size={17} style={{ flexShrink: 0 }} />
              {expanded && (
                <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
                  {label}
                  {!isVisible && <Lock size={11} style={{ opacity: 0.5 }} />}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {expanded && membershipPlan !== 'varsity' && (
        <div style={{ padding: 12, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ background: `${accentColor}12`, border: `1px solid ${accentColor}30`, borderRadius: 10, padding: '12px 14px' }}>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.5)', margin: '0 0 8px' }}>
              {membershipPlan === 'walk-on'
                ? 'Upgrade for Locker Room chat, goals & priority shadowing'
                : 'Upgrade to ISO Pass for dedicated coaching & skill tree'}
            </p>
            <button
              data-tutorial-id={membershipPlan === 'walk-on' ? 'explorer-upgrade-locker-room' : 'player-upgrade-varsity'}
              onClick={() => onUpgrade(membershipPlan === 'walk-on' ? 'locker-room' : 'varsity')}
              style={{ width: '100%', background: accentColor, color: 'white', border: 'none', borderRadius: 8, padding: '8px 0', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: 1, cursor: 'pointer' }}
            >
              {membershipPlan === 'walk-on' ? `LOCKER ROOM · $${LOCKER_ROOM_PRICE_USD}/MO` : 'ISO PASS'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SKILL TREE VIEW ──────────────────────────────────────────────────────────
function SkillTreeView({ pathwayId, gamesWon, accentColor }: { pathwayId: string; gamesWon: number; accentColor: string }) {
  const nodes = SKILL_TREES[pathwayId] || SKILL_TREES.deen;
  const pathway = PATHWAY_BY_ID[pathwayId as keyof typeof PATHWAY_BY_ID];

  const nodeMap = useMemo(() => {
    const m: Record<string, SkillNodeDef> = {};
    nodes.forEach(n => { m[n.id] = n; });
    return m;
  }, [nodes]);

  const isUnlocked = (n: SkillNodeDef) => gamesWon >= n.unlocksAt;
  const isNext = (n: SkillNodeDef) => !isUnlocked(n) && gamesWon >= n.unlocksAt - 2 && gamesWon < n.unlocksAt;

  const unlockedCount = nodes.filter(n => isUnlocked(n)).length;

  return (
    <div style={{ padding: '32px 32px 40px' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: `${accentColor}20`, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <GitBranch size={18} style={{ color: accentColor }} />
          </div>
          <div>
            <h2 style={{ color: '#F2F2F2', fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, margin: 0, lineHeight: 1 }}>
              Skill Tree
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontFamily: "'Barlow', sans-serif", fontSize: 13, margin: 0 }}>
              {pathway?.name} · {unlockedCount}/{nodes.length} unlocked
            </p>
          </div>
        </div>
        <div style={{
          display: 'flex', gap: 24, marginTop: 16, flexWrap: 'wrap',
        }}>
          {[
            { label: 'Unlocked', value: `${unlockedCount}`, color: accentColor },
            { label: 'Locked', value: `${nodes.length - unlockedCount}`, color: 'rgba(255,255,255,0.25)' },
            { label: 'Games won', value: `${gamesWon}`, color: 'rgba(255,255,255,0.5)' },
          ].map(s => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: s.color, lineHeight: 1 }}>{s.value}</span>
              <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: 1 }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SVG Tree — viewBox 600 × 560 */}
      <div style={{ maxWidth: 640, margin: '0 auto', position: 'relative' }}>
        <svg viewBox="0 0 600 560" style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
          {/* Connection lines */}
          {SKILL_CONNECTIONS.map(([fromId, toId]) => {
            const from = nodeMap[fromId];
            const to = nodeMap[toId];
            if (!from || !to) return null;
            const fp = getNodeXY(from.row, from.col);
            const tp = getNodeXY(to.row, to.col);
            const bothUnlocked = isUnlocked(from) && isUnlocked(to);
            const fromUnlocked = isUnlocked(from);
            return (
              <line
                key={`${fromId}-${toId}`}
                x1={fp.x} y1={fp.y} x2={tp.x} y2={tp.y}
                stroke={bothUnlocked ? accentColor : fromUnlocked ? accentColor : 'rgba(255,255,255,0.1)'}
                strokeWidth={bothUnlocked ? 2 : 1.5}
                strokeOpacity={bothUnlocked ? 0.7 : fromUnlocked ? 0.3 : 0.15}
                strokeDasharray={!fromUnlocked ? '5,4' : undefined}
              />
            );
          })}

          {/* Nodes */}
          {nodes.map(node => {
            const { x, y } = getNodeXY(node.row, node.col);
            const unlocked = isUnlocked(node);
            const next = isNext(node);

            return (
              <g key={node.id} transform={`translate(${x},${y})`}>
                {/* Glow ring for unlocked */}
                {unlocked && (
                  <circle r={38} fill={accentColor} fillOpacity={0.07} />
                )}
                {/* Dashed ring for "next up" */}
                {next && !unlocked && (
                  <circle r={36} fill="none" stroke={accentColor} strokeWidth={1.5} strokeOpacity={0.35} strokeDasharray="4 3" />
                )}
                {/* Main circle */}
                <circle
                  r={28}
                  fill={unlocked ? accentColor : 'rgba(255,255,255,0.04)'}
                  stroke={unlocked ? accentColor : next ? accentColor : 'rgba(255,255,255,0.12)'}
                  strokeWidth={1.5}
                  fillOpacity={unlocked ? 1 : 1}
                  strokeOpacity={unlocked ? 1 : next ? 0.5 : 0.4}
                />
                {/* Icon text */}
                <text
                  textAnchor="middle" dominantBaseline="central"
                  fontSize={16}
                  fill={unlocked ? 'white' : next ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.15)'}
                  style={{ userSelect: 'none' }}
                >
                  {unlocked ? '✓' : next ? '→' : '🔒'}
                </text>
                {/* Label */}
                <text
                  y={44} textAnchor="middle"
                  fontSize={9.5}
                  fontFamily="'Barlow Condensed', sans-serif"
                  fontWeight={700} letterSpacing={0.5}
                  fill={unlocked ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.25)'}
                  style={{ textTransform: 'uppercase' as const }}
                >
                  {node.label}
                </text>
                <text
                  y={56} textAnchor="middle"
                  fontSize={8.5}
                  fontFamily="'Barlow', sans-serif"
                  fill={unlocked ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.15)'}
                >
                  {node.sublabel}
                </text>
                {/* "Next up" badge */}
                {next && !unlocked && (
                  <text y={-38} textAnchor="middle" fontSize={8} fontFamily="'Barlow Condensed', sans-serif"
                    fill={accentColor} fontWeight={700} letterSpacing={1}
                    style={{ textTransform: 'uppercase' as const }}
                  >
                    NEXT UP
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 24, marginTop: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
        {[
          { symbol: '✓', label: 'Unlocked', color: accentColor },
          { symbol: '→', label: 'Next Up (almost there)', color: 'rgba(255,255,255,0.4)' },
          { symbol: '🔒', label: 'Locked', color: 'rgba(255,255,255,0.2)' },
        ].map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 14 }}>{l.symbol}</span>
            <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── EXPLORER COACHES (loaded from Supabase) ─────────────────────────────────

const TIER_COLORS: Record<string, string> = { Bronze: '#cd7f32', Silver: '#A8A8A8', Gold: '#F5C842', Platinum: '#a855f7' };

// ─── COACH CARD MODAL ────────────────────────────────────────────────────────
const TIER_BORDER: Record<string, { gradient: string; glow: string; animation: string }> = {
  Platinum: {
    gradient: 'linear-gradient(135deg, #9333ea 0%, #f97316 100%)',
    glow: '0 0 30px rgba(249,115,22,0.7), 0 0 50px rgba(147,51,234,0.5)',
    animation: 'glow-pulse 2s cubic-bezier(0.4,0,0.6,1) infinite',
  },
  Gold: {
    gradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
    glow: '0 0 25px rgba(234,179,8,0.7), 0 0 45px rgba(245,158,11,0.5)',
    animation: 'gold-glow 2s cubic-bezier(0.4,0,0.6,1) infinite',
  },
  Silver: {
    gradient: 'linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)',
    glow: '0 0 16px rgba(209,213,219,0.3)',
    animation: 'none',
  },
  Bronze: {
    gradient: 'linear-gradient(135deg, #cd7f32 0%, #a0522d 100%)',
    glow: '0 0 16px rgba(205,127,50,0.35)',
    animation: 'none',
  },
};

function CoachCardModal({
  coach, membershipPlan, chatUsed, callsRemaining, callBlockedReason,
  canShadow, shadowBlockedReason, hasLockerRoomPriority,
  onScheduleChat, onScheduleShadow, onRequestVarsity, onClose,
}: {
  coach: ExplorerCoach;
  membershipPlan: MembershipPlan;
  chatUsed: boolean;
  callsRemaining?: number;
  callBlockedReason?: string;
  canShadow: boolean;
  shadowBlockedReason?: string;
  hasLockerRoomPriority: boolean;
  onScheduleChat: () => void;
  onScheduleShadow: () => void;
  onRequestVarsity: () => void;
  onClose: () => void;
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const hex = PATHWAY_HEX[coach.pathwayId] ?? '#888';
  const tierColor = TIER_COLORS[coach.tier] ?? '#888';
  const tierBorder = TIER_BORDER[coach.tier] ?? TIER_BORDER.Silver;
  const pathwayName = PATHWAYS.find(p => p.id === coach.pathwayId)?.name ?? '';
  const PathwayIcon = pathwayIconMap[coach.pathwayId];

  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 16px' }}>
      <div onClick={e => e.stopPropagation()} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, width: '100%', maxWidth: 340 }}>

        {/* Close */}
        <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.7)' }}>
            <X size={16} />
          </button>
        </div>

        {/* Flip container */}
        <div style={{ width: 290, height: 480, perspective: '1000px', perspectiveOrigin: 'center center', cursor: 'pointer' }} onClick={() => setIsFlipped(f => !f)}>
          <div style={{ transformStyle: 'preserve-3d', width: '100%', height: '100%', position: 'relative', transition: 'transform 0.6s ease-in-out', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>

            {/* ── FRONT ── */}
            <div style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', position: 'absolute', inset: 0, borderRadius: 16, overflow: 'hidden' }}>
              {/* Tier gradient border wrapper */}
              <div style={{ position: 'absolute', inset: 0, borderRadius: 16, padding: 3, background: tierBorder.gradient, boxShadow: tierBorder.glow, animation: tierBorder.animation }}>
                <div style={{ width: '100%', height: '100%', borderRadius: 14, background: 'linear-gradient(160deg, #10101C 0%, #0C0C16 40%, #070710 100%)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  {/* Top bar */}
                  <div style={{ height: 3, background: `linear-gradient(90deg, transparent 5%, ${hex}60 35%, ${hex} 50%, ${hex}60 65%, transparent 95%)`, flexShrink: 0 }} />
                  {/* Scanlines */}
                  <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.04) 3px, rgba(0,0,0,0.04) 4px)', pointerEvents: 'none', zIndex: 8 }} />

                  {/* Photo area */}
                  <div style={{ position: 'relative', height: 180, flexShrink: 0, background: `linear-gradient(180deg, ${hex}18 0%, #090912 60%, #060610 100%)`, overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -54%)', fontFamily: "'Bebas Neue', sans-serif", fontSize: 80, letterSpacing: -3, color: 'rgba(255,255,255,0.04)', userSelect: 'none', pointerEvents: 'none', zIndex: 1 }}>ISO</div>
                    {/* Initials avatar */}
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
                      <div style={{ width: 80, height: 80, borderRadius: '50%', background: `${hex}25`, border: `2px solid ${hex}60`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Bebas Neue', sans-serif", fontSize: 30, color: hex }}>
                        {coach.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                      </div>
                    </div>
                    {/* Rating top-left */}
                    <div style={{ position: 'absolute', top: 10, left: 12, zIndex: 5 }}>
                      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 34, color: tierColor, lineHeight: 1 }}>{coach.rating}</div>
                      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 2, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' as const }}>Overall</div>
                    </div>
                    {/* Tier badge top-right */}
                    <div style={{ position: 'absolute', top: 10, right: 12, zIndex: 5 }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: `${tierColor}25`, border: `1px solid ${tierColor}55`, borderRadius: 100, padding: '3px 9px' }}>
                        <StarIcon size={10} style={{ color: tierColor }} />
                        <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: tierColor, textTransform: 'uppercase' as const }}>{coach.tier}</span>
                      </div>
                    </div>
                    {/* Bottom fade */}
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 48, background: 'linear-gradient(0deg, #060610 0%, transparent 100%)', zIndex: 3 }} />
                  </div>

                  {/* Card body */}
                  <div style={{ padding: '12px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 2.5, color: hex, textTransform: 'uppercase' as const }}>{pathwayName} Pathway</div>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 21, color: '#F2F2F2', lineHeight: 1 }}>{coach.name.toUpperCase()}</div>
                    <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: hex }}>{coach.specialty} · {coach.title.split(',')[0]}</div>
                    <div style={{ height: 1, background: 'rgba(255,255,255,0.07)' }} />
                    {/* Stats */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
                      {[{ val: coach.rating, key: 'Rating' }, { val: coach.skills.length, key: 'Skills' }, { val: coach.tier[0], key: 'Tier' }].map(s => (
                        <div key={s.key} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: '7px 4px', textAlign: 'center' as const }}>
                          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 17, color: '#F2F2F2', lineHeight: 1 }}>{s.val}</div>
                          <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 9, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{s.key}</div>
                        </div>
                      ))}
                    </div>
                    {/* Skills */}
                    <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 4 }}>
                      {coach.skills.map(s => (
                        <span key={s} style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${hex}22`, borderRadius: 100, padding: '2px 8px', fontFamily: "'Barlow', sans-serif", fontSize: 9, color: 'rgba(255,255,255,0.5)' }}>{s}</span>
                      ))}
                    </div>
                    {/* Flip hint */}
                    <div style={{ marginTop: 'auto', paddingTop: 6, textAlign: 'center' as const }}>
                      <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: hex, opacity: 0.7 }}>Click card to flip and see more →</span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div style={{ padding: '8px 16px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', background: 'rgba(0,0,0,0.2)', flexShrink: 0 }}>
                    <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 2, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase' as const }}>ISO Institute</span>
                    <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 2, color: `${tierColor}90`, textTransform: 'uppercase' as const }}>{coach.tier} Coach</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── BACK ── */}
            <div style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', position: 'absolute', inset: 0, borderRadius: 16, overflow: 'hidden', transform: 'rotateY(180deg)' }}>
              <div style={{ position: 'absolute', inset: 0, borderRadius: 16, padding: 3, background: tierBorder.gradient, boxShadow: tierBorder.glow }}>
                <div style={{ width: '100%', height: '100%', borderRadius: 14, background: 'linear-gradient(160deg, #10101C 0%, #0C0C16 40%, #070710 100%)', overflow: 'hidden', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ height: 3, background: `linear-gradient(90deg, transparent 5%, ${hex}60 35%, ${hex} 50%, ${hex}60 65%, transparent 95%)`, flexShrink: 0 }} />
                  <div style={{ padding: '18px 18px 16px', flex: 1 }}>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 19, color: '#F2F2F2', marginBottom: 6, lineHeight: 1 }}>{coach.name.toUpperCase()}</div>
                    <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: hex, marginBottom: 12 }}>{coach.title}</div>
                    <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65, marginBottom: 14 }}>{coach.bio}</p>
                    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 2, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' as const, marginBottom: 8 }}>Specialties</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6, marginBottom: 16 }}>
                      {coach.skills.map(s => (
                        <span key={s} style={{ background: `${hex}15`, border: `1px solid ${hex}35`, borderRadius: 100, padding: '4px 10px', fontFamily: "'Barlow', sans-serif", fontSize: 11, color: hex }}>{s}</span>
                      ))}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', background: `${hex}10`, border: `1px solid ${hex}25`, borderRadius: 10, marginBottom: 8 }}>
                      {PathwayIcon && <PathwayIcon size={14} style={{ color: hex, flexShrink: 0 }} />}
                      <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{pathwayName} Pathway Coach</span>
                    </div>
                    <div style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, marginBottom: 8 }}>
                      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 2, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' as const, marginBottom: 6 }}>Coach Availability</div>
                      <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.45)', margin: 0, lineHeight: 1.5 }}>
                        {coach.acceptsShadowing
                          ? `Open to shadowing · ~every ${coach.shadowingCadenceMonths} mo per player`
                          : 'Not currently offering shadowing'}
                        <br />
                        {membershipPlan === 'locker-room'
                          ? `${TRYOUT_MINUTES}-min try outs · different coaches each month`
                          : '1 try out per pathway per month on Walk-On'}
                        <br />
                        ISO Pass with {coach.name.split(' ')[0]}: ${coach.varsityMonthlyPrice}/mo (coach sets rate)
                      </p>
                    </div>
                    <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.3)', textAlign: 'center' as const, marginTop: 8 }}>Click to flip back</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Action buttons */}
        <div style={{ width: 290, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {membershipPlan === 'locker-room' && callsRemaining !== undefined && (
            <div style={{ textAlign: 'center', fontFamily: "'Barlow', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
              {callsRemaining} of {LOCKER_ROOM_MONTHLY_CALLS} try outs left this month
            </div>
          )}
          {!chatUsed && callBlockedReason ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: 'rgba(255,255,255,0.35)', fontSize: 12, fontFamily: "'Barlow', sans-serif", textAlign: 'center' }}>
              <Lock size={13} /> {callBlockedReason}
            </div>
          ) : !chatUsed ? (
            <button onClick={e => { e.stopPropagation(); onScheduleChat(); }} style={{ width: '100%', padding: '13px 0', background: `${hex}20`, border: `1px solid ${hex}50`, borderRadius: 12, color: hex, fontFamily: "'Bebas Neue', sans-serif", fontSize: 15, letterSpacing: 2, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <MessageSquare size={14} /> BOOK TRY OUT
            </button>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px 14px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 10, color: 'rgba(34,197,94,0.8)', fontSize: 13, fontFamily: "'Barlow', sans-serif" }}>
                <CheckCheck size={14} /> Try out booked this month
              </div>
              {membershipPlan === 'locker-room' && (
                <button onClick={e => { e.stopPropagation(); onRequestVarsity(); }} style={{ width: '100%', padding: '13px 0', background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.4)', borderRadius: 12, color: '#a855f7', fontFamily: "'Bebas Neue', sans-serif", fontSize: 14, letterSpacing: 2, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  CALL AN ISO · ${coach.varsityMonthlyPrice}/MO
                </button>
              )}
              <button disabled={!canShadow} onClick={e => { e.stopPropagation(); canShadow && onScheduleShadow(); }} style={{ width: '100%', padding: '13px 0', background: canShadow ? `${hex}20` : 'rgba(255,255,255,0.03)', border: `1px solid ${canShadow ? hex + '50' : 'rgba(255,255,255,0.07)'}`, borderRadius: 12, color: canShadow ? hex : 'rgba(255,255,255,0.2)', fontFamily: "'Bebas Neue', sans-serif", fontSize: 15, letterSpacing: 2, cursor: canShadow ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexDirection: 'column' }}>
                {canShadow ? <><Calendar size={14} /> SCHEDULE SHADOWING{hasLockerRoomPriority ? ' · PRIORITY' : ''}</> : <><Lock size={13} /> {shadowBlockedReason ?? 'SHADOWING UNAVAILABLE'}</>}
                {canShadow && !hasLockerRoomPriority && (
                  <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, letterSpacing: 0.5, color: 'rgba(255,255,255,0.35)', fontWeight: 400 }}>Standard wait · Locker Room gets priority</span>
                )}
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}

function ExplorerPortal({ onNavigate, onPlanChange }: { onNavigate?: (page: any) => void; onPlanChange?: (plan: MembershipPlan) => void }) {
  const { user, isAdmin, updatePlan, plan: dbPlan, loading: authLoading } = useAuth();
  const { coaches: discoverableCoaches, loading: coachesLoading } = useDiscoverableCoaches();
  const matchedCoaches = useMemo(
    () => discoverableCoaches.map(toExplorerCoachView),
    [discoverableCoaches],
  );
  const [usage, setUsage] = useState<ExplorerUsage>(getExplorerUsage);
  const [activeSection, setActiveSection] = useState<WalkOnSection>('explore');
  const [selectedPathway, setSelectedPathway] = useState<string | null>(null);
  const [selectedCoach, setSelectedCoach] = useState<ExplorerCoach | null>(null);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [membershipPlan, setMembershipPlan] = useState<MembershipPlan>(getUserPlan);
  const [currentPathwayId, setCurrentPathwayId] = useState(() => getActivePathway(getUserPlan()));
  const [showLockConfirm, setShowLockConfirm] = useState(false);
  const [showChangeRequest, setShowChangeRequest] = useState(false);
  const [showLockerCheckout, setShowLockerCheckout] = useState(false);
  const [showVarsityInterest, setShowVarsityInterest] = useState(false);
  const [varsityInterestCoach, setVarsityInterestCoach] = useState<ExplorerCoach | null>(null);
  const [pendingUpgradePlan, setPendingUpgradePlan] = useState<MembershipPlan>('locker-room');
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialScope, setTutorialScope] = useState<PlayerTutorialScope>('walk-on');
  const [showTryOutBooking, setShowTryOutBooking] = useState(false);

  const explorerTutorialSteps = getPlayerTutorialSteps(tutorialScope);

  useEffect(() => {
    const scope = getPlayerTutorialScope(membershipPlan);
    if (isTutorialComplete('player', scope)) {
      setShowTutorial(false);
      return;
    }
    setTutorialScope(scope);
    const timer = window.setTimeout(() => setShowTutorial(true), 300);
    return () => window.clearTimeout(timer);
  }, [membershipPlan]);

  useEffect(() => {
    if (!user?.id) return;
    void fetchDbExplorerUsage(user.id)
      .then(setUsage)
      .catch((err) => console.error('Failed to load explorer usage:', err));
  }, [user?.id]);

  // Keep portal plan in sync with the DB subscription once auth loads.
  useEffect(() => {
    if (!authLoading && dbPlan !== membershipPlan) {
      setMembershipPlan(dbPlan);
      setUserPlan(dbPlan);
      onPlanChange?.(dbPlan);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, dbPlan]);

  useEffect(() => {
    const initial = localStorage.getItem('iso_portal_initial_section');
    if (initial === 'store') {
      setActiveSection('store');
      localStorage.removeItem('iso_portal_initial_section');
    }
  }, []);

  // Heal locker-room/varsity state: ensure a locked pathway exists so My Coaches isn't blank
  useEffect(() => {
    if (!isPathwayLocked(membershipPlan)) return;
    const locked = getLockedPathway();
    if (locked) {
      setCurrentPathwayId(locked);
      setSelectedPathway(locked);
      return;
    }
    const exploring = getExploringPathway();
    if (exploring) {
      lockPathway(exploring);
      if (user?.id) {
        void saveLockedPathway(user.id, exploring)
          .catch((err) => console.error('Failed to persist locked pathway:', err));
      }
      setCurrentPathwayId(exploring);
      setSelectedPathway(exploring);
      return;
    }
    setShowLockConfirm(true);
    setPendingUpgradePlan(membershipPlan);
  }, [membershipPlan]);

  const pathwayIsLocked = isPathwayLocked(membershipPlan);
  const lockedPathwayId = getLockedPathway() || currentPathwayId || getExploringPathway() || null;
  const hasLockerRoomPriority = membershipPlan === 'locker-room';
  const hasLockerRoomAccess = canAccessLockerRoomChat(membershipPlan);

  const handleUpgrade = (plan: MembershipPlan) => {
    setUserPlan(plan);
    setMembershipPlan(plan);
    onPlanChange?.(plan);
    void updatePlan(plan).catch((err) => console.error('Failed to persist plan:', err));
    if (plan === 'locker-room') setActiveSection('locker-room');
  };

  const handleUpgradeClick = (plan: MembershipPlan) => {
    if (plan === 'walk-on') return;
    if (plan === 'locker-room' && membershipPlan === 'walk-on') {
      setPendingUpgradePlan(plan);
      setShowLockerCheckout(true);
      return;
    }
    if ((plan === 'locker-room' || plan === 'varsity') && !getLockedPathway()) {
      setPendingUpgradePlan(plan);
      setShowLockConfirm(true);
      return;
    }
    handleUpgrade(plan);
  };

  const handleLockerCheckoutSuccess = () => {
    setShowLockerCheckout(false);
    if (!getLockedPathway()) {
      setPendingUpgradePlan('locker-room');
      setShowLockConfirm(true);
      return;
    }
    handleUpgrade('locker-room');
  };

  const handleLockConfirmed = (plan: MembershipPlan) => {
    setShowLockConfirm(false);
    setPendingUpgradePlan('locker-room');
    const locked = getLockedPathway() || '';
    if (locked) {
      setCurrentPathwayId(locked);
      setSelectedPathway(locked);
    }
    setMembershipPlan(plan);
    onPlanChange?.(plan);
    if (plan === 'locker-room') setActiveSection('explore');
  };

  const saveUsage = (u: ExplorerUsage) => {
    setUsage(u);
    if (user?.id) {
      void saveDbExplorerUsage(user.id, u).catch((err) => console.error('Failed to save usage:', err));
    } else {
      saveLocalExplorerUsage(u);
    }
  };

  const handleResetTryouts = async () => {
    if (!user?.id) return;
    try {
      await resetExplorerUsage(user.id);
      saveLocalExplorerUsage({
        pathwayChats: {},
        coachChats: [],
        shadowUsedThisMonth: false,
        lastReset: new Date().toISOString().slice(0, 7),
      });
      setUsage({
        pathwayChats: {},
        coachChats: [],
        shadowUsedThisMonth: false,
        lastReset: new Date().toISOString().slice(0, 7),
      });
    } catch (err) {
      console.error('Failed to reset try-outs:', err);
      alert(err instanceof Error ? err.message : 'Could not reset try-outs');
    }
  };

  const coachChatUsed = (coach: ExplorerCoach) =>
    membershipPlan === 'locker-room'
      ? chatUsedWithCoach(usage, coach.id)
      : chatUsedForPathway(usage, coach.pathwayId);

  const getShadowState = (coach: ExplorerCoach) => {
    if (!coachChatUsed(coach)) return { canShadow: false, reason: 'BOOK TRY OUT FIRST' };
    if (!coach.acceptsShadowing) return { canShadow: false, reason: 'COACH NOT OFFERING SHADOWING' };
    if (usage.shadowUsedThisMonth) return { canShadow: false, reason: 'SHADOWING USED THIS MONTH' };
    return { canShadow: true, reason: '' };
  };

  const handleSectionSelect = (section: WalkOnSection) => {
    setActiveSection(section);
    if (section !== 'explore') setSelectedPathway(null);
  };

  const selectExplorePathway = (pathwayId: string) => {
    if (!pathwayIsLocked) {
      setCurrentPathwayId(pathwayId);
      setExploringPathway(pathwayId);
      if (user?.id) {
        void saveExploringPathway(user.id, pathwayId)
          .catch((err) => console.error('Failed to persist exploring pathway:', err));
      }
    }
    setSelectedPathway(pathwayId);
  };

  useEffect(() => {
    if (pathwayIsLocked && lockedPathwayId) {
      setSelectedPathway(lockedPathwayId);
    }
  }, [pathwayIsLocked, lockedPathwayId]);

  const explorePathwayId = pathwayIsLocked ? lockedPathwayId : selectedPathway;
  const w = sidebarExpanded ? SIDEBAR_W_EXPANDED : SIDEBAR_W_COLLAPSED;
  const activeHex = selectedPathway ? (PATHWAY_HEX[selectedPathway] ?? '#888') : (currentPathwayId ? (PATHWAY_HEX[currentPathwayId] ?? '#f97316') : '#f97316');
  const explorePathway = explorePathwayId ? PATHWAYS.find(p => p.id === explorePathwayId) : null;
  const explorePathwayCoaches = explorePathwayId ? matchedCoaches.filter(c => c.pathwayId === explorePathwayId) : [];
  const exploreHex = explorePathwayId ? (PATHWAY_HEX[explorePathwayId] ?? '#f97316') : activeHex;
  const currentPathwayName = currentPathwayId ? PATHWAY_BY_ID[currentPathwayId as keyof typeof PATHWAY_BY_ID]?.name : null;

  const sidebarItems: { id: WalkOnSection; label: string; Icon: React.ComponentType<{ size: number }>; locked?: boolean }[] = [
    { id: 'explore', label: pathwayIsLocked ? 'My Coaches' : 'Explore Coaches', Icon: Compass },
    { id: 'goals', label: 'My Goals', Icon: Target, locked: membershipPlan === 'walk-on' },
    { id: 'community', label: 'ISO Community', Icon: MessageCircle, locked: !hasLockerRoomAccess },
    { id: 'locker-room', label: 'Locker Room', Icon: Users, locked: !hasLockerRoomAccess },
    { id: 'store', label: 'ISO Store', Icon: ShoppingBag, locked: !canAccessOnlineStore(membershipPlan) },
    { id: 'profile', label: 'My Profile', Icon: UserCircle },
  ];

  const activePathway = selectedPathway ? PATHWAYS.find(p => p.id === selectedPathway) : null;
  const activePathwayCoaches = selectedPathway ? matchedCoaches.filter(c => c.pathwayId === selectedPathway) : [];

  return (
    <div style={{ display: 'flex', minHeight: `calc(100vh - ${NAV_H}px)`, paddingTop: NAV_H, background: '#0C0C0C' }}>
      {showTutorial && (
        <PortalTutorial
          steps={explorerTutorialSteps}
          tutorialScope={tutorialScope}
          role="player"
          onNavigate={(section) => handleSectionSelect(section as WalkOnSection)}
          onExpandSidebar={setSidebarExpanded}
          onComplete={() => {
            markTutorialComplete('player', tutorialScope);
            setShowTutorial(false);
          }}
        />
      )}
      {/* Sidebar */}
      <div style={{ position: 'fixed', top: NAV_H, left: 0, bottom: 0, width: w, background: '#0A0A0A', borderRight: '1px solid rgba(255,255,255,0.07)', transition: 'width 0.25s ease', display: 'flex', flexDirection: 'column', zIndex: 40, overflow: 'hidden' }}>
        <button onClick={() => setSidebarExpanded(e => !e)} style={{ height: 52, display: 'flex', alignItems: 'center', justifyContent: sidebarExpanded ? 'space-between' : 'center', padding: sidebarExpanded ? '0 18px' : '0', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer', width: '100%', color: 'rgba(255,255,255,0.4)' }}>
          {sidebarExpanded && <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.25)' }}>ISO Portal</span>}
          <Menu size={16} />
        </button>
        <div style={{ flex: 1, paddingTop: 8, overflowY: 'auto' }}>
          {sidebarItems.map(item => {
            const isActive = activeSection === item.id;
            const isLocked = item.locked;
            return (
              <button
                key={item.id}
                data-tutorial-id={`explorer-nav-${item.id}`}
                onClick={() => handleSectionSelect(item.id)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: sidebarExpanded ? '13px 18px' : '13px 0', justifyContent: sidebarExpanded ? 'flex-start' : 'center', background: isActive ? 'rgba(249,115,22,0.12)' : 'transparent', color: isActive ? '#fff' : isLocked ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.4)', cursor: 'pointer', border: 'none', outline: 'none', position: 'relative', transition: 'color 0.15s', whiteSpace: 'nowrap' as const, opacity: isLocked && !isActive ? 0.75 : 1 }}>
                <span style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: isActive ? '#f97316' : 'transparent', borderRadius: '0 2px 2px 0' }} />
                <item.Icon size={17} style={{ flexShrink: 0 }} />
                {sidebarExpanded && <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>{item.label}{isLocked && <Lock size={11} />}</span>}
              </button>
            );
          })}
              </div>
        {sidebarExpanded && (
          <div style={{ padding: 12, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 2, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase' as const }}>{PLAN_LABELS[membershipPlan]} Plan</div>
            {membershipPlan === 'walk-on' && (
              <div style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.25)', borderRadius: 10, padding: '12px 14px' }}>
                <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.5)', margin: '0 0 8px' }}>Locker Room: 3 try outs/mo, community, store & goals · ${LOCKER_ROOM_PRICE_USD}/mo</p>
                <button data-tutorial-id="explorer-upgrade-locker-room" onClick={() => handleUpgradeClick('locker-room')} style={{ width: '100%', background: '#f97316', color: 'white', border: 'none', borderRadius: 8, padding: '8px 0', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: 1, cursor: 'pointer' }}>LOCKER ROOM · ${LOCKER_ROOM_PRICE_USD}/MO</button>
              </div>
            )}
            {membershipPlan !== 'varsity' && (
              <div style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.25)', borderRadius: 10, padding: '12px 14px' }}>
                <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.5)', margin: '0 0 8px' }}>ISO Pass: dedicated coach, skill tree, real progress bar</p>
                <button onClick={() => handleUpgradeClick('varsity')} style={{ width: '100%', background: 'rgba(168,85,247,0.8)', color: 'white', border: 'none', borderRadius: 8, padding: '8px 0', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: 1, cursor: 'pointer' }}>ISO PASS</button>
            </div>
            )}
            {hasLockerRoomAccess && onNavigate && (
              <button onClick={() => setActiveSection('store')} style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '8px 0', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: 1, cursor: 'pointer', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <ShoppingBag size={13} /> ISO STORE
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main content */}
      <main style={{ flex: 1, marginLeft: w, transition: 'margin-left 0.25s ease', overflowY: 'auto' as const }}>
        <PortalChromeBar role="player" portalLabel="Explorer Portal" accentColor={activeHex} />
        <div style={{ padding: '32px 32px 60px' }}>

        {activeSection === 'explore' && (
          <PortalGreeting
            role="player"
            accentColor={exploreHex}
            subline={`${PLAN_LABELS[membershipPlan]} · ${currentPathwayName ?? 'Explore pathways'}`}
          />
        )}
        {activeSection === 'community' && hasLockerRoomAccess && (
          <PortalGreeting
            role="player"
            accentColor={activeHex}
            subline={`ISO Community · ${currentPathwayName ?? 'All pathways'}`}
          />
        )}

        {/* ── MY COACHES — locked plan, pathway missing or invalid ── */}
        {activeSection === 'explore' && pathwayIsLocked && (!explorePathwayId || !explorePathway) && (
          <div style={{ padding: 48, textAlign: 'center' as const, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16 }}>
            <Compass size={32} style={{ color: 'rgba(255,255,255,0.2)', marginBottom: 12 }} />
            <h3 style={{ color: '#F2F2F2', fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, margin: '0 0 8px' }}>Lock Your Pathway</h3>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.4)', margin: '0 0 20px', lineHeight: 1.6 }}>
              Locker Room requires a committed pathway before coaches appear. Choose yours to see matched coaches.
            </p>
            <button onClick={() => { setPendingUpgradePlan(membershipPlan); setShowLockConfirm(true); }} style={{ background: '#f97316', color: '#fff', border: 'none', borderRadius: 100, padding: '12px 28px', fontFamily: "'Bebas Neue', sans-serif", fontSize: 15, letterSpacing: 2, cursor: 'pointer' }}>
              CHOOSE PATHWAY
            </button>
          </div>
        )}

        {/* ── EXPLORE (walk-on pathway grid) ── */}
        {activeSection === 'explore' && !pathwayIsLocked && !selectedPathway && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.25)', borderRadius: 12, padding: '14px 20px', marginBottom: 24 }}>
              <Zap size={16} style={{ color: '#f97316', flexShrink: 0 }} />
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.6)', margin: 0, flex: 1 }}>
                <strong style={{ color: 'white' }}>{PLAN_LABELS[membershipPlan]}:</strong>{' '}
                {membershipPlan === 'locker-room'
                  ? `${discoveryCallsRemaining(membershipPlan, usage)} of ${LOCKER_ROOM_MONTHLY_CALLS} try outs left · different coaches only · ${TRYOUT_MINUTES} min each.`
                  : pathwayIsLocked
                    ? '1 try out per month in your pathway.'
                    : '1 try out per pathway per month.'}
                {membershipPlan === 'walk-on' && ' No online merch — grab gear at in-person ISO events.'}
                {hasLockerRoomPriority && ' Loved your try out? Call an ISO to upgrade to the ISO Pass.'}
              </p>
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => void handleResetTryouts()}
                  style={{ flexShrink: 0, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '6px 12px', color: 'rgba(255,255,255,0.6)', fontFamily: "'Barlow', sans-serif", fontSize: 11, cursor: 'pointer', whiteSpace: 'nowrap' as const }}
                >
                  Reset try-outs
                </button>
              )}
            </div>
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ color: '#F2F2F2', fontFamily: "'Bebas Neue', sans-serif", fontSize: 34, margin: '0 0 6px', letterSpacing: 1 }}>Explore Pathways</h2>
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.4)', margin: 0 }}>1 try out per pathway · Shadowing unlocks after your try out (if coach allows)</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 18 }}>
              {PATHWAYS.map(pathway => {
                const IconComp = pathwayIconMap[pathway.id];
                const hex = PATHWAY_HEX[pathway.id];
                const pathwayCoaches = matchedCoaches.filter(c => c.pathwayId === pathway.id);
                const chatUsed = chatUsedForPathway(usage, pathway.id);
                return (
                  <button key={pathway.id} onClick={() => selectExplorePathway(pathway.id)} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '22px 22px 20px', textAlign: 'left' as const, cursor: 'pointer', transition: 'all 0.2s', width: '100%' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = hex + '50'; (e.currentTarget as HTMLButtonElement).style.background = hex + '08'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.08)'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.03)'; }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 10, background: hex + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {IconComp && <IconComp size={20} style={{ color: hex }} />}
                      </div>
                      <div>
                        <div style={{ color: '#F2F2F2', fontFamily: "'Bebas Neue', sans-serif", fontSize: 19, lineHeight: 1 }}>{pathway.name}</div>
                        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, fontFamily: "'Barlow', sans-serif", marginTop: 3 }}>{pathway.legacyName}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                      <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{pathwayCoaches.length} coaches available</span>
                      {chatUsed && <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: "'Barlow', sans-serif", fontSize: 11, color: 'rgba(34,197,94,0.7)' }}><CheckCheck size={11} /> Chat used</span>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px 0', background: hex + '18', border: '1px solid ' + hex + '35', borderRadius: 10, color: hex, fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: 1.5 }}>
                      <Users size={13} /> VIEW COACHES <ChevronRight size={13} />
                    </div>
          </button>
                );
              })}
        </div>
            <div style={{ marginTop: 52, padding: 36, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, textAlign: 'center' as const }}>
              <h3 style={{ color: '#F2F2F2', fontFamily: "'Bebas Neue', sans-serif", fontSize: 30, margin: '0 0 10px', letterSpacing: 0.5 }}>Ready to Go Deeper?</h3>
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 15, color: 'rgba(255,255,255,0.4)', margin: '0 0 24px', lineHeight: 1.7 }}>Take the full assessment to get placed and unlock your ISO Pass journey with a dedicated coach.</p>
              <button onClick={() => onNavigate?.('join')} style={{ background: 'rgba(255,255,255,0.92)', color: '#111', border: 'none', borderRadius: 100, padding: '13px 36px', fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, letterSpacing: 2.5, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                TAKE ASSESSMENT <ArrowRight size={15} />
            </button>
          </div>
          </>
        )}

        {/* ── COACH LIST ── */}
        {activeSection === 'explore' && explorePathwayId && explorePathway && (
          <>
            {pathwayIsLocked && currentPathwayName && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 20, padding: '12px 18px', background: `${exploreHex}10`, border: `1px solid ${exploreHex}25`, borderRadius: 12 }}>
                <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Lock size={14} style={{ color: exploreHex }} /> Coaches in your <strong style={{ color: exploreHex }}>{currentPathwayName}</strong> pathway
              </div>
                <button onClick={() => setShowChangeRequest(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '6px 14px', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: 1 }}>
                  <Lock size={12} /> REQUEST PATHWAY CHANGE
                </button>
            </div>
          )}
            <div style={{ marginBottom: 28 }}>
              {!pathwayIsLocked && (
                <button onClick={() => setSelectedPathway(null)} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontFamily: "'Barlow', sans-serif", fontSize: 13, padding: '0 0 18px' }}>← Back to Pathways</button>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: exploreHex + '20', border: '1px solid ' + exploreHex + '40', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {(() => { const I = pathwayIconMap[explorePathwayId]; return I ? <I size={22} style={{ color: exploreHex }} /> : null; })()}
                </div>
                <div>
                  <h2 style={{ color: '#F2F2F2', fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, margin: 0, letterSpacing: 0.5 }}>{explorePathway.name} Coaches</h2>
                  <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
                    {membershipPlan === 'locker-room'
                      ? `${discoveryCallsRemaining(membershipPlan, usage)} of ${LOCKER_ROOM_MONTHLY_CALLS} try outs left · different coaches only`
                      : chatUsedForPathway(usage, explorePathwayId)
                        ? 'Try out used for this pathway'
                        : '1 try out available for this pathway'}
                  </p>
                </div>
              </div>
            </div>
            {coachesLoading ? (
              <div style={{ padding: 48, textAlign: 'center' as const, color: 'rgba(255,255,255,0.4)', fontFamily: "'Barlow', sans-serif" }}>
                Loading coaches…
              </div>
            ) : explorePathwayCoaches.length === 0 ? (
              <div style={{ padding: 48, textAlign: 'center' as const, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16 }}>
                <Users size={32} style={{ color: 'rgba(255,255,255,0.2)', marginBottom: 12 }} />
                <h3 style={{ color: '#F2F2F2', fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, margin: '0 0 8px' }}>No Coaches Available</h3>
                <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.4)', margin: '0 0 20px' }}>
                  No coaches are available for this pathway yet. Check back as new coaches complete onboarding.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {explorePathwayCoaches.map(coach => {
                  const hex = PATHWAY_HEX[coach.pathwayId] ?? '#888';
                  const tierColor = TIER_COLORS[coach.tier] ?? '#888';
                  const used = coachChatUsed(coach);
                    return (
                    <div key={coach.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' as const }}>
                      <div style={{ width: 50, height: 50, borderRadius: '50%', background: hex + '20', border: '2px solid ' + hex + '40', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: hex, flexShrink: 0 }}>
                        {coach.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                      </div>
                      <div style={{ flex: 1, minWidth: 160 }}>
                        <div style={{ color: '#F2F2F2', fontFamily: "'Bebas Neue', sans-serif", fontSize: 17, lineHeight: 1.1, marginBottom: 2 }}>{coach.name}</div>
                        <div style={{ color: 'rgba(255,255,255,0.4)', fontFamily: "'Barlow', sans-serif", fontSize: 12 }}>{coach.title}</div>
                      </div>
                      <div style={{ textAlign: 'right' as const, flexShrink: 0 }}>
                        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: tierColor, lineHeight: 1 }}>{coach.rating}</div>
                        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: tierColor, textTransform: 'uppercase' as const }}>{coach.tier}</div>
                      </div>
                      {used && <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 100, color: 'rgba(34,197,94,0.8)', fontSize: 11, fontFamily: "'Barlow', sans-serif" }}><CheckCheck size={11} /> Chatted</div>}
                      <button onClick={() => setSelectedCoach(coach)} style={{ padding: '9px 18px', background: hex + '18', border: '1px solid ' + hex + '40', borderRadius: 10, color: hex, fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: 1.5, cursor: 'pointer', whiteSpace: 'nowrap' as const }}>VIEW COACH CARD</button>
                    </div>
                    );
                  })}
              </div>
            )}
          </>
        )}

        {/* ── MY GOALS (Locker Room) ── */}
        {activeSection === 'goals' && (
          hasLockerRoomAccess ? (
          <>
            {pathwayIsLocked && currentPathwayName && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 20, padding: '12px 18px', background: `${activeHex}10`, border: `1px solid ${activeHex}25`, borderRadius: 12 }}>
                <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Lock size={14} style={{ color: activeHex }} /> Goals for <strong style={{ color: activeHex }}>{currentPathwayName}</strong>
                </div>
                <button onClick={() => setShowChangeRequest(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '6px 14px', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: 1 }}>
                  <Lock size={12} /> REQUEST PATHWAY CHANGE
                </button>
              </div>
            )}
            <LockerRoomGoals
            membershipPlan={membershipPlan}
            onUpgrade={() => handleUpgradeClick('varsity')}
            accentColor={activeHex}
            lockedPathwayId={lockedPathwayId}
            lockedPathwayName={currentPathwayName ?? undefined}
          />
          </>
          ) : (
            <>
              <h2 style={{ color: '#F2F2F2', fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, margin: '0 0 6px', letterSpacing: 0.5 }}>My Goals</h2>
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.4)', margin: '0 0 24px' }}>
                Self-guided goal keeping on your pathway — track milestones and build momentum before ISO Pass coaching.
              </p>
              <ExplorerUpgradeGate
                title="My Goals"
                description="Locker Room unlocks self-guided goal keeping on your locked pathway. Set milestones, check off wins, and stay accountable between try outs."
                benefits={[
                  'Pathway-locked goal lists you control',
                  'Track milestones & celebrate completions',
                  'Build habits before coach-assigned ISO Pass goals',
                  'Share wins in ISO Community when you upgrade',
                ]}
                onUpgrade={() => handleUpgradeClick('locker-room')}
              />
            </>
          )
        )}

        {/* ── ISO COMMUNITY FORUM ── */}
        {activeSection === 'community' && (
          hasLockerRoomAccess ? (
            <div>
              <h2 style={{ color: '#F2F2F2', fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, margin: '0 0 6px', letterSpacing: 0.5 }}>ISO Community</h2>
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.4)', margin: '0 0 24px' }}>
                Share wins, celebrate goals, and encourage players & coaches across every pathway.
              </p>
              <ISOCommunityForum lockedPathwayId={lockedPathwayId} lockedPathwayName={currentPathwayName ?? undefined} />
            </div>
          ) : (
            <>
              <h2 style={{ color: '#F2F2F2', fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, margin: '0 0 6px', letterSpacing: 0.5 }}>ISO Community</h2>
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.4)', margin: '0 0 24px' }}>
                Share wins, celebrate goals, and encourage players & coaches across every pathway.
              </p>
              <CommunityUpgradeGate onUpgrade={() => handleUpgradeClick('locker-room')} />
            </>
          )
        )}

        {/* ── LOCKER ROOM CHAT ── */}
        {activeSection === 'locker-room' && (
          hasLockerRoomAccess ? (
          <div>
            <h2 style={{ color: '#F2F2F2', fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, margin: '0 0 6px', letterSpacing: 0.5 }}>Locker Room</h2>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.4)', margin: '0 0 24px' }}>Pathway channels & video library · you post as {currentPathwayName}</p>
            <LockerRoomChat lockedPathwayId={lockedPathwayId} />
          </div>
          ) : (
            <>
              <h2 style={{ color: '#F2F2F2', fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, margin: '0 0 6px', letterSpacing: 0.5 }}>Locker Room</h2>
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.4)', margin: '0 0 24px' }}>
                Pathway channels, video library, and group chat with players on your pathway.
              </p>
              <ExplorerUpgradeGate
                title="Locker Room"
                description="Locker Room is your pathway hangout — group chat, coach video drops, and monthly try outs to find your ISO."
                benefits={[
                  `${LOCKER_ROOM_MONTHLY_CALLS} coach try outs every month`,
                  'Pathway group chat & video library',
                  'Connect with players on your locked pathway',
                  'ISO Community forum & self-guided goals included',
                ]}
                onUpgrade={() => handleUpgradeClick('locker-room')}
              />
            </>
          )
        )}

        {/* ── ISO STORE ── */}
        {activeSection === 'store' && (
          <ISOStoreSection
            membershipPlan={membershipPlan}
            accentColor={activeHex}
            onUpgrade={handleUpgradeClick}
          />
        )}

        {/* ── PROFILE ── */}
        {activeSection === 'profile' && (
          <PlayerProfileSection
            accentColor={activeHex}
            onProfileCompletionChange={() => {}}
            onGenderChange={g => setPlayerGender(g)}
          />
        )}
        </div>
      </main>

      {selectedCoach && (() => {
        const shadow = getShadowState(selectedCoach);
        const callState = canScheduleCoachCall(membershipPlan, usage, selectedCoach.id, selectedCoach.pathwayId);
        const used = coachChatUsed(selectedCoach);
        return (
          <CoachCardModal
            coach={selectedCoach}
            membershipPlan={membershipPlan}
            chatUsed={used}
            callsRemaining={membershipPlan === 'locker-room' ? discoveryCallsRemaining(membershipPlan, usage) : undefined}
            callBlockedReason={!used && !callState.allowed ? callState.reason : undefined}
            canShadow={shadow.canShadow}
            shadowBlockedReason={shadow.reason}
            hasLockerRoomPriority={hasLockerRoomPriority}
            onScheduleChat={() => setShowTryOutBooking(true)}
            onScheduleShadow={() => { saveUsage({ ...usage, shadowUsedThisMonth: true }); }}
            onRequestVarsity={() => {
              setVarsityInterestCoach(selectedCoach);
              setShowVarsityInterest(true);
              setSelectedCoach(null);
            }}
            onClose={() => setSelectedCoach(null)}
          />
        );
      })()}

      {showTryOutBooking && selectedCoach && (
        <ConsultationModal
          coachName={selectedCoach.name}
          coachId={selectedCoach.id}
          categoryId={selectedCoach.pathwayId}
          onClose={() => setShowTryOutBooking(false)}
          onScheduleComplete={() => {
            setShowTryOutBooking(false);
            if (user?.id) {
              void fetchDbExplorerUsage(user.id)
                .then(setUsage)
                .catch((err) => console.error('Failed to refresh usage:', err));
            }
          }}
        />
      )}

      {showLockerCheckout && (
        <LockerRoomCheckoutModal
          onClose={() => setShowLockerCheckout(false)}
          onSuccess={handleLockerCheckoutSuccess}
        />
      )}

      {showVarsityInterest && varsityInterestCoach && (
        <VarsityInterestModal
          coachName={varsityInterestCoach.name}
          coachMonthlyPrice={varsityInterestCoach.varsityMonthlyPrice}
          onClose={() => { setShowVarsityInterest(false); setVarsityInterestCoach(null); }}
          onRequestVarsity={() => {
            setShowVarsityInterest(false);
            setVarsityInterestCoach(null);
            if (getLockedPathway()) {
              handleUpgrade('varsity');
            } else {
              setPendingUpgradePlan('varsity');
              setShowLockConfirm(true);
            }
          }}
          onScholarshipInfo={() => alert('ISO Foundation scholarships: apply at iso.foundation/scholarships. Coaches may sponsor pro bono ISO Pass spots — never off-platform.')}
        />
      )}

      {showLockConfirm && (
        <PathwayLockConfirmModal
          targetPlan={pendingUpgradePlan}
          onClose={() => { setShowLockConfirm(false); setPendingUpgradePlan('locker-room'); }}
          onConfirmed={handleLockConfirmed}
        />
      )}
      {showChangeRequest && (
        <PathwayChangeRequestModal
          onClose={() => setShowChangeRequest(false)}
          onPathwayChanged={newId => { setCurrentPathwayId(newId); setShowChangeRequest(false); }}
        />
      )}
                </div>
  );
}



// ─── DASHBOARD VIEW ───────────────────────────────────────────────────────────
function DashboardView({
  gamesWon, totalGames, bucketsScored, totalBuckets, winPercentage,
  coachName, pathway, pathwayId, accentColor, onNavigate: onGoTo, membershipPlan,
}: {
  gamesWon: number; totalGames: number; bucketsScored: number; totalBuckets: number;
  winPercentage: number; coachName: string; pathway: string; pathwayId: string;
  accentColor: string; onNavigate: (s: PlayerSection) => void; membershipPlan: MembershipPlan;
}) {
  const showDedicatedCoach = membershipPlan === 'varsity';
  const currentTier = TIERS.slice().reverse().find(t => gamesWon >= t.minGames) || TIERS[0];
  const TierIcon = currentTier.Icon;
                  
                  return (
    <div style={{ padding: '32px 32px 60px' }}>
      <PortalGreeting
        role="player"
        accentColor={accentColor}
        subline={`${pathway}${showDedicatedCoach ? ` · with ${coachName}` : ''}`}
      />
      {/* Player card */}
      <div style={{
        background: `linear-gradient(135deg, ${accentColor}18 0%, rgba(255,255,255,0.03) 100%)`,
        border: `1px solid ${accentColor}30`, borderRadius: 20,
        padding: 28, marginBottom: 32, display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap',
      }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: `${accentColor}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <TierIcon size={32} style={{ color: accentColor }} />
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.35)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>
            Your Season
          </div>
          <h2 style={{ color: '#F2F2F2', fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, margin: '0 0 4px', lineHeight: 1 }}>
            {pathway}
          </h2>
          <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.45)', margin: 0 }}>
            {showDedicatedCoach ? `With ${coachName}` : 'Self-guided goals · Call an ISO to upgrade to the ISO Pass'}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: `${accentColor}20`, border: `1px solid ${accentColor}40`, borderRadius: 100, padding: '8px 18px' }}>
          <TierIcon size={16} style={{ color: accentColor }} />
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: accentColor, letterSpacing: 1 }}>
            {currentTier.name}
                        </span>
                      </div>
                    </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Buckets Scored', value: `${bucketsScored}/${totalBuckets}`, sub: 'Goals completed', Icon: Target, color: accentColor },
          { label: 'Games Won', value: `${gamesWon}/${totalGames}`, sub: 'Milestones reached', Icon: Trophy, color: '#f97316' },
          { label: 'Win Rate', value: `${winPercentage}%`, sub: 'Success rate', Icon: TrendingUp, color: '#22c55e' },
          { label: 'Current Level', value: currentTier.name, sub: `${TIERS.slice().reverse().find(t => gamesWon < t.minGames)?.minGames ?? '—'} games to next`, Icon: Sparkles, color: '#a855f7' },
        ].map(s => (
          <div key={s.label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '20px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <s.Icon size={20} style={{ color: s.color }} />
              <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: 1.5, textTransform: 'uppercase' }}>{s.label}</span>
            </div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: '#F2F2F2', lineHeight: 1, marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Quick nav cards */}
      <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 16 }}>
        Quick Access
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
        {([
          { section: 'skill-tree' as PlayerSection, label: 'Skill Tree', sub: 'View your pathway nodes', Icon: GitBranch, plan: 'varsity' as MembershipPlan },
          { section: 'progress' as PlayerSection, label: membershipPlan === 'locker-room' ? 'My Goals' : 'My Progress', sub: membershipPlan === 'locker-room' ? 'Self-guided goal keeping' : 'Games, buckets & tier bar', Icon: Trophy, plan: 'locker-room' as MembershipPlan },
          { section: 'messages' as PlayerSection, label: 'Messages', sub: `Chat with ${coachName.split(' ')[0]}`, Icon: MessageSquare, plan: 'varsity' as MembershipPlan },
          { section: 'profile' as PlayerSection, label: 'My Profile', sub: 'Update your info', Icon: UserCircle, plan: 'walk-on' as MembershipPlan },
        ]).filter(card => {
          if (card.section === 'profile') return true;
          if (card.plan === 'varsity') return membershipPlan === 'varsity';
          if (card.plan === 'locker-room') return membershipPlan === 'locker-room' || membershipPlan === 'varsity';
          return false;
        }).map(card => (
          <button
            key={card.section}
            onClick={() => onGoTo(card.section)}
            style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 14, padding: '18px 20px', textAlign: 'left', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 14, transition: 'all 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)'; }}
          >
            <card.Icon size={18} style={{ color: 'rgba(255,255,255,0.4)', flexShrink: 0 }} />
            <div>
              <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.85)', marginBottom: 2 }}>{card.label}</div>
              <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>{card.sub}</div>
                        </div>
            <ChevronRight size={14} style={{ color: 'rgba(255,255,255,0.2)', marginLeft: 'auto' }} />
          </button>
        ))}
                        </div>

      {/* Upcoming session — Varsity only */}
      {showDedicatedCoach && (
      <div style={{ marginTop: 32, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Calendar size={20} style={{ color: accentColor }} />
          <div>
            <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 15, fontWeight: 600, color: '#F2F2F2' }}>Weekly Check-in</div>
            <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>with {coachName} · Nov 15, 2:00 PM</div>
                          </div>
                          </div>
        <button
          onClick={() => onGoTo('messages')}
          style={{
            background: `${accentColor}20`, border: `1px solid ${accentColor}40`, borderRadius: 8,
            padding: '8px 18px', color: accentColor, fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 13, fontWeight: 700, letterSpacing: 1, cursor: 'pointer',
          }}
        >
          MESSAGE COACH
        </button>
                          </div>
                        )}
                      </div>
                    );
}

// ─── PROGRESS VIEW ────────────────────────────────────────────────────────────
function ProgressView({
  games, setGames, gamesWon, totalBuckets, bucketsScored, winPercentage, accentColor, showTierBar,
  onPersistBucketToggle,
}: {
  games: Game[]; setGames: (g: Game[]) => void;
  gamesWon: number; totalBuckets: number; bucketsScored: number; winPercentage: number;
  accentColor: string; showTierBar: boolean;
  onPersistBucketToggle?: (bucketId: string, completed: boolean) => void;
}) {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const overallProgress = Math.min(100, (gamesWon / 15) * 100);
  const isChampion = gamesWon >= 6;

  const currentTier = useMemo(() => {
    if (gamesWon >= 15) return { tier: 'professional', level: 5, progress: 100 };
    if (gamesWon >= 10) return { tier: 'd1',       level: 4, progress: ((gamesWon - 10) / 5) * 100 };
    if (gamesWon >= 6)  return { tier: 'varsity',   level: 3, progress: ((gamesWon - 6) / 4) * 100 };
    if (gamesWon >= 3)  return { tier: 'jv',        level: 2, progress: ((gamesWon - 3) / 3) * 100 };
    return { tier: 'freshman', level: 1, progress: (gamesWon / 3) * 100 };
  }, [gamesWon]);

  const toggleBucket = (gameId: string, bucketId: string) => {
    const targetBucket = games.find(g => g.id === gameId)?.buckets.find(b => b.id === bucketId);
    if (targetBucket) onPersistBucketToggle?.(bucketId, !targetBucket.completed);

    setGames(games.map(game => {
      if (game.id !== gameId) return game;
      const updatedBuckets = game.buckets.map(b => b.id === bucketId ? { ...b, completed: !b.completed } : b);
      if (onPersistBucketToggle) {
        // DB mode: the game is only "won" once the coach approves every bucket.
        return { ...game, buckets: updatedBuckets };
      }
      const allDone = updatedBuckets.every(b => b.completed);
      return { ...game, buckets: updatedBuckets, completed: allDone, completedDate: allDone ? new Date().toISOString().split('T')[0] : game.completedDate };
    }));
  };

  return (
    <div style={{ padding: '32px 32px 60px' }}>
      {/* Progress tier bar — Varsity only */}
      {showTierBar && (
      <div style={{ background: `${accentColor}0d`, border: `1px solid ${accentColor}25`, borderRadius: 20, padding: 28, marginBottom: 32 }}>
        <h2 style={{ color: '#F2F2F2', fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, textAlign: 'center', margin: '0 0 4px' }}>Your Progress Level</h2>
        <p style={{ color: 'rgba(255,255,255,0.35)', textAlign: 'center', fontSize: 13, fontFamily: "'Barlow', sans-serif", marginBottom: 24 }}>
          Level up by completing games and achieving your goals
        </p>

        {/* Segmented bar */}
        <div className="relative mb-6">
          <div className="h-6 bg-slate-800 rounded-full overflow-hidden relative w-full">
            {TIERS.map((tier, index) => {
              const isCompleted = gamesWon >= tier.minGames && currentTier.level > index + 1;
              if (isCompleted) {
                return <div key={`c-${tier.id}`} className={`absolute top-0 h-full ${tier.color}`} style={{ left: `${index * 20}%`, width: '20%', zIndex: 10 }} />;
              }
              return null;
            })}
                  {(() => {
              const t = TIERS.find(t2 => t2.id === currentTier.tier);
              if (!t) return null;
              const idx = currentTier.level - 1;
              const filled = (currentTier.progress / 100) * 20;
              return (
                <React.Fragment key="cur">
                  <div className={`absolute top-0 h-full`} style={{ left: `${idx * 20}%`, width: '20%', zIndex: 10, background: t.darkHex }} />
                  {currentTier.progress > 0 && (
                    <div className={`absolute top-0 h-full ${t.color}`} style={{ left: `${idx * 20}%`, width: `${Math.max(filled, 2)}%`, zIndex: 35 }} />
                  )}
                </React.Fragment>
              );
            })()}
            {TIERS.map((_, i) => i > 0 ? <div key={`d-${i}`} className="absolute top-0 h-full bg-white" style={{ left: `${i * 20}%`, width: 2, zIndex: 30 }} /> : null)}
                </div>
          <div className="flex justify-between mt-3">
            {TIERS.map((tier, i) => {
              const TierIcon = tier.Icon;
              const isCur = currentTier.tier === tier.id;
              const done = gamesWon >= tier.minGames;
              const next = TIERS[i + 1];
              return (
                <div key={tier.id} className="flex flex-col items-center flex-1">
                  <TierIcon className={`w-5 h-5 mb-1 ${isCur ? 'scale-125' : ''}`} style={{ color: isCur ? accentColor : done ? 'white' : 'rgba(255,255,255,0.25)' }} />
                  <span className="text-xs font-semibold text-center" style={{ color: isCur ? accentColor : done ? 'white' : 'rgba(255,255,255,0.3)' }}>{tier.name}</span>
                  {isCur && next && <span className="text-xs mt-0.5" style={{ color: accentColor }}>{next.minGames - gamesWon} more</span>}
              </div>
              );
            })}
            </div>
                </div>
              </div>
      )}

      {!showTierBar && (
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 24, marginBottom: 32 }}>
          <h2 style={{ color: '#F2F2F2', fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, margin: '0 0 4px' }}>My Goals</h2>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, fontFamily: "'Barlow', sans-serif", margin: 0 }}>
            Self-guided goal keeping · Call an ISO for coach-tracked ISO progress
          </p>
                </div>
      )}

      {/* Championship banner */}
            {isChampion && (
              <div className="bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-yellow-500/20 border-2 border-yellow-500/50 rounded-2xl p-8 mb-8 text-center">
          <Trophy className="w-14 h-14 text-yellow-400 mx-auto mb-3" />
          <h2 className="text-white mb-2">Championship Ring Earned!</h2>
          <p className="text-slate-300 max-w-xl mx-auto">You've demonstrated exceptional growth and commitment. Your coach considers you ready to advance.</p>
              </div>
            )}

      {/* Games list */}
      <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#F2F2F2', marginBottom: 16 }}>Your Games</h3>
      <div className="space-y-5">
        {games.map(game => {
          const done = game.buckets.filter(b => b.completed).length;
          const total = game.buckets.length;
          const pct = Math.round((done / total) * 100);
                return (
                  <div key={game.id} className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
              <div
                className={`p-6 cursor-pointer transition-colors ${game.completed ? 'bg-gradient-to-r from-green-900/30 to-green-800/20' : 'bg-slate-800/50 hover:bg-slate-800'}`}
                      onClick={() => setSelectedGame(selectedGame?.id === game.id ? null : game)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center ${game.completed ? 'bg-green-500/20' : 'bg-orange-500/20'}`}>
                      {game.completed ? <Trophy className="w-5 h-5 text-green-500" /> : <Target className="w-5 h-5 text-orange-500" />}
                            </div>
                          <div>
                            <h4 className="text-white mb-1">{game.title}</h4>
                      <p className="text-slate-400 text-sm">{done}/{total} buckets scored</p>
                          </div>
                        </div>
                        <div className="text-right">
                    {game.completed ? <span className="text-green-400 text-sm">Game Won!</span> : <span className="text-orange-400 text-sm">{pct}% Complete</span>}
                            </div>
                        </div>
                      {!game.completed && (
                        <div className="mt-4 bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-orange-500 to-orange-400 h-full transition-all" style={{ width: `${pct}%` }} />
                        </div>
                      )}
                    </div>
                    {selectedGame?.id === game.id && (
                <div className="p-6 border-t border-slate-800">
                        <h5 className="text-white mb-4">Get These Buckets:</h5>
                        <div className="space-y-3">
                    {game.buckets.map(bucket => (
                      <div key={bucket.id} className={`p-4 rounded-xl border transition-all ${bucket.completed ? 'bg-green-900/20 border-green-700/50' : 'bg-slate-800 border-slate-700 hover:border-orange-500/50'}`}>
                              <div className="flex items-start gap-3">
                          <button onClick={() => toggleBucket(game.id, bucket.id)} className="flex-shrink-0 mt-1">
                            {bucket.completed ? <CheckCircle2 className="w-6 h-6 text-green-500" /> : <Circle className="w-6 h-6 text-slate-500 hover:text-orange-500 transition-colors" />}
                                </button>
                                <div className="flex-1">
                            <h6 className={`mb-1 ${bucket.completed ? 'text-slate-400 line-through' : 'text-white'}`}>{bucket.title}</h6>
                                  <p className="text-slate-500 text-sm">{bucket.description}</p>
                                  {bucket.dueDate && !bucket.completed && (
                                    <div className="flex items-center gap-2 mt-2 text-orange-400 text-sm">
                                <Calendar className="w-4 h-4" />Due: {new Date(bucket.dueDate).toLocaleDateString()}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

      {/* Commitment tracker — Varsity portal only */}
      <div className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <Clock className="w-5 h-5 text-orange-500" />
          <h4 className="text-white">30-Day Commitment</h4>
                      </div>
        <p className="text-slate-400 text-sm mb-4">Maintain your 30-day commitment with your dedicated coach before exploring other pathways.</p>
        <div className="bg-slate-700 rounded-full h-2 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-orange-400 h-full" style={{ width: '100%' }} />
                    </div>
        <p className="text-green-400 text-sm mt-2">✓ Commitment period complete</p>
                  </div>
                </div>
  );
}

// ─── UPGRADE PROMPT ───────────────────────────────────────────────────────────
function UpgradePrompt({
  targetPlan, accentColor, onUpgrade, onBack,
}: {
  targetPlan: MembershipPlan;
  accentColor: string;
  onUpgrade: () => void;
  onBack: () => void;
}) {
  const isVarsity = targetPlan === 'varsity';
  return (
    <div style={{ padding: '48px 32px', maxWidth: 560, margin: '0 auto', textAlign: 'center' as const }}>
      <Lock size={40} style={{ color: accentColor, marginBottom: 20, opacity: 0.7 }} />
      <h2 style={{ color: '#F2F2F2', fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, margin: '0 0 12px' }}>
        {isVarsity ? 'ISO Pass Required' : 'Locker Room Required'}
      </h2>
      <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 15, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, margin: '0 0 28px' }}>
        {isVarsity
          ? 'Dedicated coaching, skill tree, coach messages, and ISO progress tracking are part of the ISO Pass.'
          : `Locker Room chat, self-guided goals, and ${LOCKER_ROOM_MONTHLY_CALLS} try outs require Locker Room ($${LOCKER_ROOM_PRICE_USD}/mo).`}
      </p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' as const }}>
        <button onClick={onUpgrade} style={{ background: accentColor, color: '#fff', border: 'none', borderRadius: 100, padding: '12px 28px', fontFamily: "'Bebas Neue', sans-serif", fontSize: 15, letterSpacing: 2, cursor: 'pointer' }}>
          UPGRADE TO {PLAN_LABELS[targetPlan].toUpperCase()}
        </button>
        <button onClick={onBack} style={{ background: 'transparent', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 100, padding: '12px 28px', fontFamily: "'Barlow', sans-serif", fontSize: 14, cursor: 'pointer' }}>
          Back to Dashboard
                </button>
              </div>
            </div>
  );
}

// ─── MAIN PLAYER PORTAL ───────────────────────────────────────────────────────
export function PlayerPortal({ onNavigate }: PlayerPortalProps) {
  const { user, plan: dbPlan, updatePlan, loading: authLoading } = useAuth();
  const [games, setGames] = useState<Game[]>(mockGames);
  const [activeSection, setActiveSection] = useState<PlayerSection>('dashboard');
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialScope, setTutorialScope] = useState<PlayerTutorialScope>('varsity');
  const [showProfileCompletionModal, setShowProfileCompletionModal] = useState(false);
  const [showPathwaySelectionModal, setShowPathwaySelectionModal] = useState(false);
  const [membershipPlan, setMembershipPlan] = useState<MembershipPlan>(getUserPlan);
  const [playerProfileCompletion, setPlayerProfileCompletion] = useState(() => {
    const s = localStorage.getItem('player_profile_completion');
    return s ? Number(s) : 0;
  });

  useEffect(() => {
    const initial = localStorage.getItem('iso_portal_initial_section');
    if (initial === 'store') {
      setActiveSection('store');
      localStorage.removeItem('iso_portal_initial_section');
    }
  }, []);

  // Keep portal plan in sync with the DB subscription once auth loads.
  useEffect(() => {
    if (!authLoading && dbPlan !== membershipPlan) {
      setMembershipPlan(dbPlan);
      setUserPlan(dbPlan);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, dbPlan]);

  // Logged-in players get their real games from the DB; guests keep the demo set.
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    fetchGamesForPlayer(user.id)
      .then((rows) => {
        if (!cancelled) setGames(rows.map(dbGameToUiGame));
      })
      .catch((err) => console.error('Failed to load games:', err));
    return () => { cancelled = true; };
  }, [user?.id]);

  // Marking a bucket done sends it to the coach for approval.
  const persistBucketToggle = user
    ? (bucketId: string, completed: boolean) => {
        void setBucketStatus(bucketId, completed ? 'pending_approval' : 'open')
          .catch((err) => console.error('Failed to save bucket:', err));
      }
    : undefined;

  // Coaches connected to this player (try-out bookings or assigned games).
  const [myCoaches, setMyCoaches] = useState<PlayerCoachEntry[]>([]);
  const [selectedCoachId, setSelectedCoachId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    fetchPlayerCoaches()
      .then((rows) => {
        if (cancelled) return;
        setMyCoaches(rows);
        setSelectedCoachId((prev) => prev ?? rows[0]?.coach_id ?? null);
      })
      .catch((err) => console.error('Failed to load coaches:', err));
    return () => { cancelled = true; };
  }, [user?.id]);

  const selectedCoach = myCoaches.find((c) => c.coach_id === selectedCoachId) ?? null;
  const coachDisplayName = (c: PlayerCoachEntry) =>
    [c.first_name, c.last_name].filter(Boolean).join(' ') || c.email;

  const handleUpgrade = (plan: MembershipPlan) => {
    setUserPlan(plan);
    setMembershipPlan(plan);
    void updatePlan(plan).catch((err) => console.error('Failed to persist plan:', err));
  };

  const canAccessSection = (section: PlayerSection) => SECTIONS_BY_PLAN[membershipPlan].includes(section);
  const isPaidMember = membershipPlan === 'locker-room' || membershipPlan === 'varsity';
  const showTierBar = membershipPlan === 'varsity';

  // Selected pathway
  const [selectedPathwayId, setSelectedPathwayId] = useState(() => {
    try { return localStorage.getItem('iso_selected_pathway') || 'deen'; } catch { return 'deen'; }
  });
  useEffect(() => {
    const check = () => {
      try { const s = localStorage.getItem('iso_selected_pathway'); if (s) setSelectedPathwayId(s); } catch {}
    };
    check();
    window.addEventListener('storage', check);
    const iv = setInterval(check, 500);
    return () => { window.removeEventListener('storage', check); clearInterval(iv); };
  }, []);

  const accentColor = PATHWAY_HEX[selectedPathwayId] || '#f97316';
  const pathway = PATHWAY_BY_ID[selectedPathwayId as keyof typeof PATHWAY_BY_ID];

  // Stats
  const gamesWon = games.filter(g => g.completed).length;
  const totalGames = games.length;
  const totalBuckets = games.reduce((s, g) => s + g.buckets.length, 0);
  const bucketsScored = games.reduce((s, g) => s + g.buckets.filter(b => b.completed).length, 0);
  const winPercentage = totalGames > 0 ? Math.round((gamesWon / totalGames) * 100) : 0;

  const currentCoachName = selectedCoach
    ? coachDisplayName(selectedCoach)
    : 'Your Coach';

  const skillTreeNodes = SKILL_TREES[selectedPathwayId] || SKILL_TREES.deen;
  const skillNodesUnlocked = skillTreeNodes.filter(n => gamesWon >= n.unlocksAt).length;
  const activeGame = games.find(g => !g.completed) ?? null;
  const openBuckets = activeGame ? activeGame.buckets.filter(b => !b.completed).length : 0;

  const playerTutorialSteps = getPlayerTutorialSteps(tutorialScope);

  useEffect(() => {
    const scope = getPlayerTutorialScope(membershipPlan);
    if (isTutorialComplete('player', scope)) {
      setShowTutorial(false);
      return;
    }
    setTutorialScope(scope);
    const timer = window.setTimeout(() => setShowTutorial(true), 300);
    return () => window.clearTimeout(timer);
  }, [membershipPlan]);

  useEffect(() => {
    localStorage.setItem('player_profile_completion', String(playerProfileCompletion));
  }, [playerProfileCompletion]);

  if (usesExplorerPortal(membershipPlan)) {
    return <ExplorerPortal onNavigate={onNavigate} onPlanChange={setMembershipPlan} />;
  }

  const sidebarW = sidebarExpanded ? SIDEBAR_W_EXPANDED : SIDEBAR_W_COLLAPSED;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', paddingTop: NAV_H }}>
      {/* Modals */}
      {showTutorial && (
        <PortalTutorial
          steps={playerTutorialSteps}
          tutorialScope={tutorialScope}
          role="player"
          onNavigate={(section) => setActiveSection(section as PlayerSection)}
          onExpandSidebar={setSidebarExpanded}
          onComplete={() => {
            markTutorialComplete('player', tutorialScope);
            setShowTutorial(false);
            if (tutorialScope === 'varsity' && !localStorage.getItem(PATHWAY_SELECTION_KEY)) {
              setTimeout(() => setShowPathwaySelectionModal(true), 300);
            }
          }}
        />
      )}
      {showPathwaySelectionModal && (
        <PathwaySelectionModal onClose={() => setShowPathwaySelectionModal(false)} onPathwaySelect={() => { setShowPathwaySelectionModal(false); setTimeout(() => setShowProfileCompletionModal(true), 300); }} />
      )}
      {showProfileCompletionModal && (
        <ProfileCompletionModal onClose={() => setShowProfileCompletionModal(false)} onComplete={() => { setShowProfileCompletionModal(false); setPlayerProfileCompletion(100); }} />
      )}

      {/* Sidebar */}
      <PortalSidebar
        active={activeSection}
        onSelect={setActiveSection}
        accentColor={accentColor}
        expanded={sidebarExpanded}
        onToggle={() => setSidebarExpanded(e => !e)}
        membershipPlan={membershipPlan}
        onUpgrade={handleUpgrade}
      />

      {/* Main content */}
      <main style={{
        flex: 1, marginLeft: sidebarW, transition: 'margin-left 0.25s ease',
        minHeight: `calc(100vh - ${NAV_H}px)`, overflowY: 'auto',
        background: '#111111',
      }}>
        <PortalChromeBar role="player" portalLabel="Player Portal" accentColor={accentColor} />

        {/* Profile completion banner */}
        {playerProfileCompletion < 100 && (
          <div className="mx-8 mt-6 bg-gradient-to-r from-orange-500/20 to-orange-600/20 border-2 border-orange-500/50 rounded-2xl p-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
              <AlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0" />
              <p className="text-white text-sm">Complete your player profile to get the most out of ISO.</p>
            </div>
            <button onClick={() => { setActiveSection('profile'); setShowProfileCompletionModal(true); }} className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap">
              Complete Profile
                    </button>
                  </div>
        )}

        {/* Section views */}
        {activeSection === 'dashboard' && (
          <PlayerISODashboard
            gamesWon={gamesWon}
            totalGames={totalGames}
            bucketsScored={bucketsScored}
            totalBuckets={totalBuckets}
            winPercentage={winPercentage}
            coachName={currentCoachName}
            pathway={pathway?.name || 'Your Pathway'}
            pathwayId={selectedPathwayId}
            accentColor={accentColor}
            skillNodesUnlocked={skillNodesUnlocked}
            totalSkillNodes={skillTreeNodes.length}
            activeGameTitle={activeGame?.title}
            openBuckets={openBuckets}
            onNavigate={(section) => setActiveSection(section as PlayerSection)}
          />
        )}
        {activeSection === 'skill-tree' && (
          canAccessSection('skill-tree')
            ? <SkillTreeView pathwayId={selectedPathwayId} gamesWon={gamesWon} accentColor={accentColor} />
            : <UpgradePrompt targetPlan="varsity" accentColor={accentColor} onUpgrade={() => handleUpgrade('varsity')} onBack={() => setActiveSection('dashboard')} />
        )}
        {activeSection === 'progress' && (
          canAccessSection('progress')
            ? <ProgressView
                games={games} setGames={setGames}
                gamesWon={gamesWon} totalBuckets={totalBuckets}
                bucketsScored={bucketsScored} winPercentage={winPercentage}
                accentColor={accentColor} showTierBar={showTierBar}
                onPersistBucketToggle={persistBucketToggle}
              />
            : <UpgradePrompt targetPlan="locker-room" accentColor={accentColor} onUpgrade={() => handleUpgrade('locker-room')} onBack={() => setActiveSection('dashboard')} />
        )}
        {activeSection === 'messages' && (
          canAccessSection('messages')
            ? <div style={{ padding: '32px', height: 'calc(100vh - 72px)', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {user && myCoaches.length > 1 && (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {myCoaches.map((c) => {
                    const isSelected = c.coach_id === selectedCoachId;
                    return (
                      <button
                        key={c.coach_id}
                        onClick={() => setSelectedCoachId(c.coach_id)}
                        style={{
                          padding: '8px 16px', borderRadius: 100, cursor: 'pointer',
                          background: isSelected ? `${accentColor}20` : 'rgba(255,255,255,0.04)',
                          border: `1px solid ${isSelected ? `${accentColor}50` : 'rgba(255,255,255,0.1)'}`,
                          fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 600,
                          color: isSelected ? accentColor : 'rgba(255,255,255,0.6)',
                        }}
                      >
                        {coachDisplayName(c)}
                      </button>
                    );
                  })}
                </div>
              )}
              {user && myCoaches.length === 0 ? (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14 }}>
                  <div style={{ textAlign: 'center', padding: 40 }}>
                    <MessageSquare size={40} style={{ color: 'rgba(255,255,255,0.15)', marginBottom: 16 }} />
                    <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#F2F2F2', margin: '0 0 8px' }}>No coach yet</h3>
                    <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.35)', margin: 0 }}>
                      Book a try-out with a coach and they'll show up here.
                    </p>
                  </div>
                </div>
              ) : (
                <div style={{ flex: 1, minHeight: 0 }}>
                  <CoachPlayerChat
                    currentUserId={user?.id ?? 'player-1'} currentUserName="You" currentUserRole="player"
                    otherUserId={user && selectedCoach ? selectedCoach.coach_id : 'coach-1'}
                    otherUserName={user && selectedCoach ? coachDisplayName(selectedCoach) : currentCoachName}
                    otherUserRole="coach"
                    otherUserAvatar={user && selectedCoach ? selectedCoach.avatar_url ?? undefined : undefined}
                    category={
                      user && selectedCoach?.pathway_id
                        ? PATHWAY_BY_ID[selectedCoach.pathway_id as keyof typeof PATHWAY_BY_ID]?.name ?? selectedCoach.pathway_id
                        : pathway?.name || 'Your Pathway'
                    }
                    categoryIcon={pathwayIconMap[user && selectedCoach?.pathway_id ? selectedCoach.pathway_id : selectedPathwayId] || Moon}
                    accentColor={accentColor}
                  />
                </div>
              )}
            </div>
            : <UpgradePrompt targetPlan="varsity" accentColor={accentColor} onUpgrade={() => handleUpgrade('varsity')} onBack={() => setActiveSection('dashboard')} />
        )}
        {activeSection === 'store' && (
          canAccessSection('store')
            ? <div style={{ padding: '32px 32px 60px' }}>
                <ISOStoreSection membershipPlan={membershipPlan} accentColor={accentColor} onUpgrade={handleUpgrade} />
              </div>
            : <UpgradePrompt targetPlan="varsity" accentColor={accentColor} onUpgrade={() => handleUpgrade('varsity')} onBack={() => setActiveSection('dashboard')} />
        )}
        {activeSection === 'locker-room' && (
          canAccessSection('locker-room')
            ? <div style={{ padding: '32px 32px 60px' }}>
                <h2 style={{ color: '#F2F2F2', fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, margin: '0 0 6px', letterSpacing: 0.5 }}>Locker Room</h2>
                <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.4)', margin: '0 0 24px' }}>
                  Pathway channels & video library · connect with other ISO Pass players
                </p>
                <LockerRoomChat lockedPathwayId={getLockedPathway() || selectedPathwayId} />
              </div>
            : <UpgradePrompt targetPlan="varsity" accentColor={accentColor} onUpgrade={() => handleUpgrade('varsity')} onBack={() => setActiveSection('dashboard')} />
        )}
        {activeSection === 'profile' && (
          <div style={{ padding: '32px 32px 60px', maxWidth: 960 }}>
            <PlayerProfileSection
              accentColor={accentColor}
              onProfileCompletionChange={setPlayerProfileCompletion}
              onGenderChange={() => {}}
            />
          </div>
        )}
      </main>
    </div>
  );
}
