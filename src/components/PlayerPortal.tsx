import * as React from 'react';
import { useState, useEffect, useMemo } from 'react';
import {
  Trophy, Target, CheckCircle2, Circle, Award, TrendingUp, Calendar,
  MessageSquare, Plus, Lock, Clock, UserCircle, Users, X, Moon,
  Sprout, BookOpen, Star as StarIcon, Gem, Sparkles, AlertCircle,
  ArrowRight, Dumbbell, Activity, Settings, Rocket, Globe, LucideIcon,
  Home, GitBranch, Menu, Compass, CheckCheck, Zap, ChevronRight,
} from 'lucide-react';
import { PlayerProfileSection } from './PlayerProfileSection';
import { LockerRoom } from './LockerRoom';
import { CoachPlayerChat } from './CoachPlayerChat';
import { PortalTutorial } from './PortalTutorial';
import { ProfileCompletionModal } from './ProfileCompletionModal';
import { PathwaySelectionModal } from './PathwaySelectionModal';
import { PATHWAYS, PATHWAY_BY_ID } from '../data/pathways';

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
interface ExplorerUsage {
  chats: Record<string, number>;
  shadowingUsed: number;
  lastReset: string;
}
type PlayerSection = 'dashboard' | 'skill-tree' | 'progress' | 'messages' | 'profile';

interface PlayerPortalProps {
  onNavigate?: (page: any) => void;
}

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const PLAYER_TUTORIAL_KEY = 'iso_tutorial_completed_player_page';
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
  { id: 'messages',   label: 'Messages',    Icon: MessageSquare },
  { id: 'profile',    label: 'My Profile',  Icon: UserCircle },
];

const NAV_H = 72; // px — nav bar bottom clearance
const SIDEBAR_W_EXPANDED = 220;
const SIDEBAR_W_COLLAPSED = 64;

function PortalSidebar({
  active, onSelect, accentColor, expanded, onToggle, onLockerRoom,
}: {
  active: PlayerSection;
  onSelect: (s: PlayerSection) => void;
  accentColor: string;
  expanded: boolean;
  onToggle: () => void;
  onLockerRoom: () => void;
}) {
  const w = expanded ? SIDEBAR_W_EXPANDED : SIDEBAR_W_COLLAPSED;

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
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center',
                gap: 12, padding: expanded ? '13px 18px' : '13px 0',
                justifyContent: expanded ? 'flex-start' : 'center',
                background: isActive ? `${accentColor}15` : 'transparent',
                color: isActive ? '#fff' : 'rgba(255,255,255,0.4)',
                cursor: 'pointer', border: 'none', outline: 'none',
                position: 'relative', transition: 'color 0.15s, background 0.15s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.75)'; }}
              onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.4)'; }}
            >
              {/* Active indicator bar */}
              <span style={{
                position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
                background: isActive ? accentColor : 'transparent',
                borderRadius: '0 2px 2px 0', transition: 'background 0.15s',
              }} />
              <item.Icon size={17} style={{ flexShrink: 0 }} />
              {expanded && (
                <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 500 }}>
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Locker Room */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: expanded ? '12px 12px' : '12px 0', display: 'flex', justifyContent: expanded ? 'flex-start' : 'center' }}>
        <button
          onClick={onLockerRoom}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: expanded ? '10px 14px' : '10px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 10, color: 'rgba(255,255,255,0.5)',
            cursor: 'pointer', width: expanded ? '100%' : 'auto',
            whiteSpace: 'nowrap', transition: 'all 0.15s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#fff'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; }}
        >
          <Users size={16} style={{ flexShrink: 0 }} />
          {expanded && <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 500 }}>Locker Room</span>}
        </button>
      </div>
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

// ─── EXPLORER PORTAL ─────────────────────────────────────────────────────────
function getExplorerUsage(): ExplorerUsage {
  try {
    const saved = localStorage.getItem('iso_explorer_usage');
    if (!saved) return { chats: {}, shadowingUsed: 0, lastReset: new Date().toISOString().slice(0, 7) };
    const parsed = JSON.parse(saved) as ExplorerUsage;
    // Reset monthly
    const thisMonth = new Date().toISOString().slice(0, 7);
    if (parsed.lastReset !== thisMonth) {
      return { chats: {}, shadowingUsed: 0, lastReset: thisMonth };
    }
    return parsed;
  } catch {
    return { chats: {}, shadowingUsed: 0, lastReset: new Date().toISOString().slice(0, 7) };
  }
}

function ExplorerPortal({ onNavigate }: { onNavigate?: (page: any) => void }) {
  const [usage, setUsage] = useState<ExplorerUsage>(getExplorerUsage);
  const [activeSection, setActiveSection] = useState<'explore' | 'profile'>('explore');

  const saveUsage = (u: ExplorerUsage) => {
    setUsage(u);
    localStorage.setItem('iso_explorer_usage', JSON.stringify(u));
  };

  const chatUsed = (id: string) => (usage.chats[id] || 0) >= 1;
  const canShadow = (id: string) => chatUsed(id) && usage.shadowingUsed < 1;
  const shadowLimitReached = usage.shadowingUsed >= 1;

  const explorerSidebar = [
    { id: 'explore', label: 'Explore', Icon: Compass },
    { id: 'profile', label: 'My Profile', Icon: UserCircle },
  ] as const;

  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const w = sidebarExpanded ? SIDEBAR_W_EXPANDED : SIDEBAR_W_COLLAPSED;

  return (
    <div style={{ display: 'flex', minHeight: `calc(100vh - ${NAV_H}px)`, paddingTop: NAV_H }}>
      {/* Explorer sidebar */}
      <div style={{
        position: 'fixed', top: NAV_H, left: 0, bottom: 0,
        width: w, background: '#0A0A0A',
        borderRight: '1px solid rgba(255,255,255,0.07)',
        transition: 'width 0.25s ease', display: 'flex',
        flexDirection: 'column', zIndex: 40, overflow: 'hidden',
      }}>
        <button
          onClick={() => setSidebarExpanded(e => !e)}
          style={{
            height: 52, display: 'flex', alignItems: 'center',
            justifyContent: sidebarExpanded ? 'space-between' : 'center',
            padding: sidebarExpanded ? '0 18px' : '0',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            background: 'transparent', border: 'none',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            cursor: 'pointer', width: '100%', color: 'rgba(255,255,255,0.4)',
          }}
        >
          {sidebarExpanded && (
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)' }}>
              Explorer
            </span>
          )}
          <Menu size={16} />
        </button>
        <div style={{ flex: 1, paddingTop: 8 }}>
          {explorerSidebar.map(item => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                  padding: sidebarExpanded ? '13px 18px' : '13px 0',
                  justifyContent: sidebarExpanded ? 'flex-start' : 'center',
                  background: isActive ? 'rgba(249,115,22,0.12)' : 'transparent',
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.4)',
                  cursor: 'pointer', border: 'none', outline: 'none',
                  position: 'relative', transition: 'color 0.15s', whiteSpace: 'nowrap',
                }}
              >
                <span style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: isActive ? '#f97316' : 'transparent', borderRadius: '0 2px 2px 0' }} />
                <item.Icon size={17} style={{ flexShrink: 0 }} />
                {sidebarExpanded && <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 500 }}>{item.label}</span>}
              </button>
            );
          })}
        </div>
        {/* Upgrade banner in sidebar */}
        {sidebarExpanded && (
          <div style={{ padding: 12, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.25)', borderRadius: 10, padding: '12px 14px' }}>
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.5)', margin: '0 0 8px' }}>
                Unlock priority access & dedicated coaching
              </p>
              <button style={{ width: '100%', background: '#f97316', color: 'white', border: 'none', borderRadius: 8, padding: '8px 0', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: 1, cursor: 'pointer' }}>
                LOCKER ROOM · $10/MO
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Explorer content */}
      <main style={{ flex: 1, marginLeft: w, transition: 'margin-left 0.25s ease', padding: '32px 32px 60px', overflowY: 'auto' }}>
        {activeSection === 'explore' && (
          <>
            {/* Priority disclaimer */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.25)',
              borderRadius: 12, padding: '14px 20px', marginBottom: 32,
            }}>
              <Zap size={16} style={{ color: '#f97316', flexShrink: 0 }} />
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.6)', margin: 0 }}>
                <strong style={{ color: 'white' }}>Walk-On notice:</strong> Locker Room members have scheduling priority. You may experience longer wait times.
              </p>
            </div>

            <div style={{ marginBottom: 28 }}>
              <h2 style={{ color: '#F2F2F2', fontFamily: "'Bebas Neue', sans-serif", fontSize: 30, margin: '0 0 6px' }}>Explore Pathways</h2>
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
                1 free chat per pathway · Shadowing unlocks after you've chatted · 1 shadowing per month
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
              {PATHWAYS.map(pathway => {
                const IconComp = pathwayIconMap[pathway.id];
                const hex = PATHWAY_HEX[pathway.id];
                const used = chatUsed(pathway.id);
                const canSchedule = canShadow(pathway.id);

                return (
                  <div key={pathway.id} style={{
                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', gap: 16,
                  }}>
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 10, background: `${hex}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {IconComp && <IconComp size={20} style={{ color: hex }} />}
                      </div>
                      <div>
                        <div style={{ color: 'white', fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, lineHeight: 1 }}>{pathway.name}</div>
                        <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, fontFamily: "'Barlow', sans-serif", marginTop: 2 }}>{pathway.legacyName}</div>
                      </div>
                    </div>

                    {/* Blurred coach silhouettes */}
                    <div style={{ display: 'flex', gap: 8 }}>
                      {[1, 2].map(i => (
                        <div key={i} style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '12px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, position: 'relative', overflow: 'hidden' }}>
                          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
                          <div style={{ width: '70%', height: 7, background: 'rgba(255,255,255,0.06)', borderRadius: 4 }} />
                          <div style={{ width: '50%', height: 5, background: 'rgba(255,255,255,0.04)', borderRadius: 4 }} />
                          {/* Blur overlay until committed */}
                          <div style={{ position: 'absolute', inset: 0, backdropFilter: 'blur(4px)', background: 'rgba(10,10,10,0.3)' }} />
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    {!used ? (
                      <button
                        onClick={() => saveUsage({ ...usage, chats: { ...usage.chats, [pathway.id]: 1 } })}
                        style={{
                          padding: '10px 0', background: `${hex}18`, border: `1px solid ${hex}40`,
                          borderRadius: 10, color: hex, fontFamily: "'Barlow Condensed', sans-serif",
                          fontSize: 13, fontWeight: 700, letterSpacing: 1.5, cursor: 'pointer', transition: 'all 0.15s',
                        }}
                      >
                        START CHAT — 1 FREE
                      </button>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 12px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 8, color: 'rgba(34,197,94,0.8)', fontSize: 12, fontFamily: "'Barlow', sans-serif" }}>
                          <CheckCheck size={13} /> Chat used this month
                        </div>
                        <button
                          disabled={!canSchedule}
                          onClick={() => canSchedule && saveUsage({ ...usage, shadowingUsed: 1 })}
                          style={{
                            padding: '10px 0', background: canSchedule ? `${hex}18` : 'rgba(255,255,255,0.03)',
                            border: `1px solid ${canSchedule ? hex + '40' : 'rgba(255,255,255,0.06)'}`,
                            borderRadius: 10, color: canSchedule ? hex : 'rgba(255,255,255,0.2)',
                            fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: 1.5,
                            cursor: canSchedule ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                          }}
                        >
                          {shadowLimitReached && !canSchedule ? <><Lock size={11} /> SHADOWING USED</> : 'SCHEDULE SHADOWING'}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Commit CTA */}
            <div style={{ marginTop: 48, padding: 36, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, textAlign: 'center' }}>
              <h3 style={{ color: '#F2F2F2', fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, margin: '0 0 10px' }}>Found Your Path?</h3>
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 15, color: 'rgba(255,255,255,0.4)', margin: '0 0 24px' }}>
                Commit to a pathway and get assessed, placed, and matched with a dedicated coach. No re-onboarding needed.
              </p>
              <button
                onClick={() => onNavigate?.('join')}
                style={{
                  background: 'rgba(255,255,255,0.92)', color: '#111', border: 'none', borderRadius: 100,
                  padding: '13px 36px', fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, letterSpacing: 2.5,
                  cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 10,
                }}
              >
                COMMIT TO A PATHWAY <ArrowRight size={15} />
              </button>
            </div>
          </>
        )}

        {activeSection === 'profile' && (
          <div style={{ maxWidth: 900 }}>
            <PlayerProfileSection onProfileCompletionChange={() => {}} />
          </div>
        )}
      </main>
    </div>
  );
}

// ─── DASHBOARD VIEW ───────────────────────────────────────────────────────────
function DashboardView({
  gamesWon, totalGames, bucketsScored, totalBuckets, winPercentage,
  coachName, pathway, pathwayId, accentColor, onNavigate: onGoTo,
}: {
  gamesWon: number; totalGames: number; bucketsScored: number; totalBuckets: number;
  winPercentage: number; coachName: string; pathway: string; pathwayId: string;
  accentColor: string; onNavigate: (s: PlayerSection) => void;
}) {
  const currentTier = TIERS.slice().reverse().find(t => gamesWon >= t.minGames) || TIERS[0];
  const TierIcon = currentTier.Icon;

  return (
    <div style={{ padding: '32px 32px 60px' }}>
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
            With {coachName}
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
          { section: 'skill-tree' as PlayerSection, label: 'Skill Tree', sub: 'View your pathway nodes', Icon: GitBranch },
          { section: 'progress' as PlayerSection, label: 'My Progress', sub: 'Games, buckets & tier bar', Icon: Trophy },
          { section: 'messages' as PlayerSection, label: 'Messages', sub: `Chat with ${coachName.split(' ')[0]}`, Icon: MessageSquare },
          { section: 'profile' as PlayerSection, label: 'My Profile', sub: 'Update your info', Icon: UserCircle },
        ]).map(card => (
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

      {/* Upcoming session */}
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
    </div>
  );
}

// ─── PROGRESS VIEW ────────────────────────────────────────────────────────────
function ProgressView({
  games, setGames, gamesWon, totalBuckets, bucketsScored, winPercentage, accentColor,
}: {
  games: Game[]; setGames: (g: Game[]) => void;
  gamesWon: number; totalBuckets: number; bucketsScored: number; winPercentage: number;
  accentColor: string;
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
    setGames(games.map(game => {
      if (game.id !== gameId) return game;
      const updatedBuckets = game.buckets.map(b => b.id === bucketId ? { ...b, completed: !b.completed } : b);
      const allDone = updatedBuckets.every(b => b.completed);
      return { ...game, buckets: updatedBuckets, completed: allDone, completedDate: allDone ? new Date().toISOString().split('T')[0] : game.completedDate };
    }));
  };

  return (
    <div style={{ padding: '32px 32px 60px' }}>
      {/* Progress tier bar */}
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

      {/* Commitment tracker */}
      <div className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <Clock className="w-5 h-5 text-orange-500" />
          <h4 className="text-white">30-Day Commitment</h4>
        </div>
        <p className="text-slate-400 text-sm mb-4">Maintain your 30-day commitment before exploring other pathways.</p>
        <div className="bg-slate-700 rounded-full h-2 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-orange-400 h-full" style={{ width: '100%' }} />
        </div>
        <p className="text-green-400 text-sm mt-2">✓ Commitment period complete</p>
      </div>
    </div>
  );
}

// ─── MAIN PLAYER PORTAL ───────────────────────────────────────────────────────
export function PlayerPortal({ onNavigate }: PlayerPortalProps) {
  const [games, setGames] = useState<Game[]>(mockGames);
  const [activeSection, setActiveSection] = useState<PlayerSection>('dashboard');
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [showLockerRoom, setShowLockerRoom] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showProfileCompletionModal, setShowProfileCompletionModal] = useState(false);
  const [showPathwaySelectionModal, setShowPathwaySelectionModal] = useState(false);
  const [playerProfileCompletion, setPlayerProfileCompletion] = useState(() => {
    const s = localStorage.getItem('player_profile_completion');
    return s ? Number(s) : 0;
  });

  // Detect explorer track
  const isExplorer = useMemo(() => {
    try { return localStorage.getItem('iso_explorer') === 'true'; } catch { return false; }
  }, []);

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

  const activePathways: Array<'deen' | 'health' | 'medicine' | 'engineering' | 'entrepreneurship' | 'global'> =
    [selectedPathwayId as 'deen'];

  const currentCoachName = 'Imam Abdullah Rahman';

  const playerTutorialSteps = [
    { title: 'Welcome to Your Player Portal!', description: 'Your personal dashboard — skill tree, progress, messages, and more, all in the sidebar.' },
    { title: 'Sidebar Navigation', description: 'Use the left sidebar to switch between Dashboard, Skill Tree, Progress, Messages, and Profile.' },
    { title: 'Skill Tree', description: 'Unlock skills in your pathway by winning games. Each game unlocks new nodes on your tree.' },
    { title: 'Locker Room', description: 'Hit the Locker Room button at the bottom of the sidebar to connect with other players.' },
  ];

  useEffect(() => {
    const done = localStorage.getItem(PLAYER_TUTORIAL_KEY);
    if (!done) setTimeout(() => setShowTutorial(true), 200);
  }, []);

  useEffect(() => {
    localStorage.setItem('player_profile_completion', String(playerProfileCompletion));
  }, [playerProfileCompletion]);

  if (isExplorer) {
    return <ExplorerPortal onNavigate={onNavigate} />;
  }

  const sidebarW = sidebarExpanded ? SIDEBAR_W_EXPANDED : SIDEBAR_W_COLLAPSED;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', paddingTop: NAV_H }}>
      {/* Modals */}
      {showTutorial && (
        <PortalTutorial
          steps={playerTutorialSteps}
          onComplete={() => { setShowTutorial(false); localStorage.setItem(PLAYER_TUTORIAL_KEY, 'true'); if (!localStorage.getItem(PATHWAY_SELECTION_KEY)) setTimeout(() => setShowPathwaySelectionModal(true), 300); }}
          role="player"
        />
      )}
      {showPathwaySelectionModal && (
        <PathwaySelectionModal onClose={() => setShowPathwaySelectionModal(false)} onPathwaySelect={() => { setShowPathwaySelectionModal(false); setTimeout(() => setShowProfileCompletionModal(true), 300); }} />
      )}
      {showProfileCompletionModal && (
        <ProfileCompletionModal onClose={() => setShowProfileCompletionModal(false)} onComplete={() => { setShowProfileCompletionModal(false); setPlayerProfileCompletion(100); }} />
      )}
      {showLockerRoom && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full h-full max-w-7xl max-h-[90vh] rounded-2xl overflow-hidden">
            <LockerRoom userRole="player" isPaidMember={true} activePathways={activePathways} onClose={() => setShowLockerRoom(false)} />
          </div>
        </div>
      )}

      {/* Sidebar */}
      <PortalSidebar
        active={activeSection}
        onSelect={setActiveSection}
        accentColor={accentColor}
        expanded={sidebarExpanded}
        onToggle={() => setSidebarExpanded(e => !e)}
        onLockerRoom={() => setShowLockerRoom(true)}
      />

      {/* Main content */}
      <main style={{
        flex: 1, marginLeft: sidebarW, transition: 'margin-left 0.25s ease',
        minHeight: `calc(100vh - ${NAV_H}px)`, overflowY: 'auto',
        background: '#111111',
      }}>
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
          <DashboardView
            gamesWon={gamesWon} totalGames={totalGames}
            bucketsScored={bucketsScored} totalBuckets={totalBuckets}
            winPercentage={winPercentage} coachName={currentCoachName}
            pathway={pathway?.name || 'Your Pathway'} pathwayId={selectedPathwayId}
            accentColor={accentColor} onNavigate={setActiveSection}
          />
        )}
        {activeSection === 'skill-tree' && (
          <SkillTreeView pathwayId={selectedPathwayId} gamesWon={gamesWon} accentColor={accentColor} />
        )}
        {activeSection === 'progress' && (
          <ProgressView
            games={games} setGames={setGames}
            gamesWon={gamesWon} totalBuckets={totalBuckets}
            bucketsScored={bucketsScored} winPercentage={winPercentage}
            accentColor={accentColor}
          />
        )}
        {activeSection === 'messages' && (
          <div style={{ padding: '32px', height: 'calc(100vh - 72px)' }}>
            <CoachPlayerChat
              currentUserId="player-1" currentUserName="You" currentUserRole="player"
              otherUserId="coach-1" otherUserName={currentCoachName} otherUserRole="coach"
              category={pathway?.name || 'Your Pathway'} categoryIcon={pathwayIconMap[selectedPathwayId] || Moon}
            />
          </div>
        )}
        {activeSection === 'profile' && (
          <div style={{ padding: '32px', maxWidth: 900 }}>
            <PlayerProfileSection onProfileCompletionChange={setPlayerProfileCompletion} />
          </div>
        )}
      </main>
    </div>
  );
}
