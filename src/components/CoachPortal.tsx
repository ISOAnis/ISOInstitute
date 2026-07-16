import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import {
  Trophy, Target, CheckCircle2, Circle, Award, Calendar,
  MessageSquare, Plus, Edit3, Save, X, Clock, AlertCircle, Users, Sparkles,
  UserCircle, Moon, ArrowRight, Home, Menu, ChevronRight, ShoppingBag, MessageCircle, Video,
} from 'lucide-react';
import { PORTAL_ACCENT } from '../utils/portalTheme';
import {
  getCoachTutorialSteps,
  isTutorialComplete,
  markTutorialComplete,
} from '../utils/portalTutorial';
import { PortalTutorial } from './PortalTutorial';
import { CoachProfileSection } from './CoachProfileSection';
import { AIMatchingDashboard } from './AIMatchingDashboard';
import { LockerRoomChat } from './LockerRoomChat';
import { ISOCommunityForum } from './ISOCommunityForum';
import { CoachStoreSection } from './portal-store';
import { CoachISODashboard } from './CoachISODashboard';
import { CoachOverallProgressBar } from './CoachOverallProgressBar';
import { CoachPlayerChat } from './CoachPlayerChat';
import { CoachISOCard } from './CoachISOCard';
import { PortalChromeBar } from './PortalChromeBar';
import { getCoachPathwayChannelId } from '../utils/coachProgress';
import {
  resolveCoachIdentity, resolveCoachCard, isCoachCardPendingReview,
  type CoachCardDisplay, type CoachIdentity,
} from '../utils/coachProfile';
import { loadPhotoFrame, type CoachPhotoFrame } from '../utils/coachPhotoStorage';
import { useAuth } from '../contexts/AuthContext';
import {
  addBucket as addBucketDb,
  addBucketComment,
  approveBucket as approveBucketDb,
  createGame,
  fetchCoachRoster,
  fetchGamesForPlayer,
  type BucketWithComments,
  type GameWithBuckets,
} from '../services/gamesService';
import { getPathwayName } from '../data/pathways';
import type { CoachRosterEntry } from '../types/database';

// ─── TYPES & MOCK DATA ────────────────────────────────────────────────────────

interface Comment {
  id: string;
  text: string;
  createdAt: string;
  coachName: string;
}

interface Bucket {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate?: string;
  coachApproved: boolean;
  comments: Comment[];
  pendingApproval?: boolean;
}

interface Game {
  id: string;
  title: string;
  buckets: Bucket[];
  completed: boolean;
  completedDate?: string;
  description?: string;
}

interface Player {
  id: string;
  name: string;
  email: string;
  category: string;
  categoryIcon: string | typeof Moon;
  joinedDate: string;
  games: Game[];
  avatar?: string;
}

const mockPlayers: Player[] = [
  {
    id: '1',
    name: 'Ahmed Hassan',
    email: 'ahmed.hassan@email.com',
    category: 'The Seeker Pathway',
    categoryIcon: Moon,
    joinedDate: '2024-09-01',
    games: [
      {
        id: '1',
        title: 'Establish Daily Prayer Routine',
        description: 'Build foundational prayer habits',
        completed: true,
        completedDate: '2024-10-15',
        buckets: [
          {
            id: '1-1',
            title: 'Pray Fajr on time for 7 days',
            description: 'Build consistency with morning prayer',
            completed: true,
            coachApproved: true,
            comments: [
              { id: 'c1', text: 'Excellent work! Your consistency is inspiring.', createdAt: '2024-10-14', coachName: 'Imam Abdullah' },
            ],
          },
          {
            id: '1-2',
            title: 'Learn proper wudu technique',
            description: 'Master the ablution process',
            completed: true,
            coachApproved: true,
            comments: [],
          },
        ],
      },
      {
        id: '2',
        title: 'Build Spiritual Foundation',
        description: 'Deepen understanding of faith',
        completed: false,
        buckets: [
          {
            id: '2-1',
            title: 'Read 10 pages of Quran daily',
            description: 'Consistent engagement with scripture',
            completed: true,
            coachApproved: false,
            pendingApproval: true,
            comments: [],
          },
          {
            id: '2-2',
            title: 'Attend Friday Jummah for 4 weeks',
            description: 'Connect with community',
            completed: false,
            coachApproved: false,
            dueDate: '2024-11-22',
            comments: [],
          },
        ],
      },
    ],
  },
  {
    id: '2',
    name: 'Fatima Ali',
    email: 'fatima.ali@email.com',
    category: 'The Seeker Pathway',
    categoryIcon: Moon,
    joinedDate: '2024-10-01',
    games: [
      {
        id: '1',
        title: 'Quranic Memorization',
        description: 'Begin memorizing key surahs',
        completed: false,
        buckets: [
          {
            id: '1-1',
            title: 'Memorize Surah Al-Mulk',
            description: 'Complete memorization with tajweed',
            completed: false,
            coachApproved: false,
            dueDate: '2024-12-01',
            comments: [],
          },
        ],
      },
    ],
  },
];

// ─── DB → UI MAPPING ──────────────────────────────────────────────────────────
function dbBucketToUi(bucket: BucketWithComments): Bucket {
  return {
    id: bucket.id,
    title: bucket.title,
    description: bucket.description ?? '',
    completed: bucket.status !== 'open',
    dueDate: bucket.due_date ?? undefined,
    coachApproved: bucket.status === 'approved',
    pendingApproval: bucket.status === 'pending_approval',
    comments: bucket.comments.map((c) => ({
      id: c.id,
      text: c.body,
      createdAt: c.created_at,
      coachName: c.author_name,
    })),
  };
}

function dbGameToUi(game: GameWithBuckets): Game {
  return {
    id: game.id,
    title: game.title,
    description: game.description ?? undefined,
    completed: game.completed,
    completedDate: game.completed_at ? game.completed_at.split('T')[0] : undefined,
    buckets: game.buckets.map(dbBucketToUi),
  };
}

function rosterEntryToPlayer(entry: CoachRosterEntry, games: GameWithBuckets[]): Player {
  const name = [entry.first_name, entry.last_name].filter(Boolean).join(' ') || entry.email;
  return {
    id: entry.player_id,
    name,
    email: entry.email,
    category: entry.pathway_id ? getPathwayName(entry.pathway_id) : 'Exploring pathways',
    categoryIcon: Moon,
    joinedDate: entry.joined_at,
    games: games.map(dbGameToUi),
    avatar: entry.avatar_url ?? undefined,
  };
}

const NAV_H = 72;
const SIDEBAR_W_EXPANDED = 220;
const SIDEBAR_W_COLLAPSED = 64;

type CoachSection = 'dashboard' | 'players' | 'messages' | 'matching' | 'community' | 'locker-room' | 'store' | 'profile';

const SIDEBAR_ITEMS: { id: CoachSection; label: string; Icon: React.ComponentType<{ size: number; style?: React.CSSProperties }> }[] = [
  { id: 'dashboard', label: 'Dashboard', Icon: Home },
  { id: 'players', label: 'My Players', Icon: Users },
  { id: 'messages', label: 'Messages', Icon: MessageSquare },
  { id: 'matching', label: 'AI Matching', Icon: Sparkles },
  { id: 'community', label: 'ISO Community', Icon: MessageCircle },
  { id: 'locker-room', label: 'Locker Room', Icon: Video },
  { id: 'store', label: 'Coach Store', Icon: ShoppingBag },
  { id: 'profile', label: 'My Profile', Icon: UserCircle },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function PlayerAvatar({ name, src, size = 40, accentColor = PORTAL_ACCENT }: { name: string; src?: string; size?: number; accentColor?: string }) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2);
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: `${accentColor}25`, overflow: 'hidden',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Barlow Condensed', sans-serif", fontSize: size * 0.35, fontWeight: 700, color: accentColor,
    }}>
      {src ? <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
    </div>
  );
}

function StatCard({ label, value, sub, Icon, color }: {
  label: string; value: string | number; sub: string;
  Icon: React.ComponentType<{ size: number; style?: React.CSSProperties }>; color: string;
}) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <Icon size={20} style={{ color }} />
        <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: 1.5, textTransform: 'uppercase' }}>{label}</span>
      </div>
      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: '#F2F2F2', lineHeight: 1, marginBottom: 4 }}>{value}</div>
      <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>{sub}</div>
    </div>
  );
}

function Panel({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 14, ...style,
    }}>
      {children}
    </div>
  );
}

function BtnPrimary({ children, onClick, small, accentColor = PORTAL_ACCENT }: { children: React.ReactNode; onClick?: () => void; small?: boolean; accentColor?: string }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: `${accentColor}20`, border: `1px solid ${accentColor}40`, borderRadius: small ? 8 : 10,
        padding: small ? '8px 16px' : '10px 20px', color: accentColor,
        fontFamily: "'Barlow Condensed', sans-serif", fontSize: small ? 12 : 13,
        fontWeight: 700, letterSpacing: 1, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6,
      }}
    >
      {children}
    </button>
  );
}

function BtnGhost({ children, onClick, small }: { children: React.ReactNode; onClick?: () => void; small?: boolean }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', borderRadius: small ? 8 : 10,
        padding: small ? '8px 16px' : '10px 20px', color: 'rgba(255,255,255,0.5)',
        fontFamily: "'Barlow', sans-serif", fontSize: small ? 12 : 13, cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', gap: 6,
      }}
    >
      {children}
    </button>
  );
}

function calculatePlayerStats(player: Player) {
  const totalGames = player.games.length;
  const gamesWon = player.games.filter(g => g.completed).length;
  const totalBuckets = player.games.reduce((sum, game) => sum + game.buckets.length, 0);
  const bucketsScored = player.games.reduce(
    (sum, game) => sum + game.buckets.filter(b => b.completed && b.coachApproved).length, 0,
  );
  const pendingApprovals = player.games.reduce(
    (sum, game) => sum + game.buckets.filter(b => b.pendingApproval).length, 0,
  );
  return { totalGames, gamesWon, totalBuckets, bucketsScored, pendingApprovals, isChampion: gamesWon >= 6 };
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────

function CoachSidebar({
  active, onSelect, expanded, onToggle, accentColor,
}: {
  active: CoachSection;
  onSelect: (s: CoachSection) => void;
  expanded: boolean;
  onToggle: () => void;
  accentColor: string;
}) {
  const w = expanded ? SIDEBAR_W_EXPANDED : SIDEBAR_W_COLLAPSED;

  return (
    <div style={{
      position: 'fixed', top: NAV_H, left: 0, bottom: 0, width: w,
      background: '#0A0A0A', borderRight: '1px solid rgba(255,255,255,0.07)',
      transition: 'width 0.25s ease', display: 'flex', flexDirection: 'column', zIndex: 40, overflow: 'hidden',
    }}>
      <button
        onClick={onToggle}
        style={{
          height: 52, display: 'flex', alignItems: 'center',
          justifyContent: expanded ? 'space-between' : 'center',
          padding: expanded ? '0 18px' : '0',
          background: 'transparent', border: 'none',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          cursor: 'pointer', width: '100%', color: 'rgba(255,255,255,0.4)',
          gap: 8,
        }}
      >
        {expanded ? (
          <span style={{
            fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 700,
            letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)',
          }}>
            Coach Portal
          </span>
        ) : null}
        <Menu size={16} style={{ flexShrink: 0 }} />
      </button>

      <div style={{ flex: 1, paddingTop: 8, overflowY: 'auto' }}>
        {SIDEBAR_ITEMS.map(item => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              data-tutorial-id={`coach-nav-${item.id}`}
              onClick={() => onSelect(item.id)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                padding: expanded ? '13px 18px' : '13px 0',
                justifyContent: expanded ? 'flex-start' : 'center',
                background: isActive ? `${accentColor}15` : 'transparent',
                color: isActive ? '#fff' : 'rgba(255,255,255,0.4)',
                cursor: 'pointer', border: 'none', position: 'relative',
                transition: 'color 0.15s, background 0.15s', whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.75)'; }}
              onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.4)'; }}
            >
              <span style={{
                position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
                background: isActive ? accentColor : 'transparent', borderRadius: '0 2px 2px 0',
              }} />
              <item.Icon size={17} style={{ flexShrink: 0 }} />
              {expanded && (
                <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 500 }}>{item.label}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────

function CoachDashboardView({
  allStats, coachIdentity, coachCard, pendingReview, accentColor, onNavigate,
}: {
  allStats: { totalPlayers: number; totalPendingApprovals: number; totalActiveGames: number; champions: number };
  coachIdentity: CoachIdentity;
  coachCard: CoachCardDisplay | null;
  pendingReview: boolean;
  accentColor: string;
  onNavigate: (s: CoachSection) => void;
}) {
  return (
    <CoachISODashboard
      coachIdentity={coachIdentity}
      coachCard={coachCard}
      pendingReview={pendingReview}
      accentColor={accentColor}
      stats={allStats}
      onNavigate={onNavigate}
    />
  );
}

// ─── PLAYERS VIEW ─────────────────────────────────────────────────────────────

function CoachPlayersView({
  players, selectedPlayer, selectedGame, onSelectPlayer, onSelectGame,
  showNewGameForm, setShowNewGameForm, newGameTitle, setNewGameTitle,
  newGameDescription, setNewGameDescription, onAddGame,
  newBucketGameId, setNewBucketGameId, newBucketTitle, setNewBucketTitle,
  newBucketDescription, setNewBucketDescription, newBucketDueDate, setNewBucketDueDate, onAddBucket,
  editingComment, setEditingComment, commentText, setCommentText,
  onAddComment, onApprove,   onGoToMessages, accentColor,
}: {
  players: Player[];
  selectedPlayer: Player | null;
  selectedGame: Game | null;
  onSelectPlayer: (p: Player) => void;
  onSelectGame: (g: Game | null) => void;
  showNewGameForm: boolean;
  setShowNewGameForm: (v: boolean) => void;
  newGameTitle: string;
  setNewGameTitle: (v: string) => void;
  newGameDescription: string;
  setNewGameDescription: (v: string) => void;
  onAddGame: () => void;
  newBucketGameId: string | null;
  setNewBucketGameId: (v: string | null) => void;
  newBucketTitle: string;
  setNewBucketTitle: (v: string) => void;
  newBucketDescription: string;
  setNewBucketDescription: (v: string) => void;
  newBucketDueDate: string;
  setNewBucketDueDate: (v: string) => void;
  onAddBucket: (gameId: string) => void;
  editingComment: string | null;
  setEditingComment: (v: string | null) => void;
  commentText: string;
  setCommentText: (v: string) => void;
  onAddComment: (playerId: string, gameId: string, bucketId: string) => void;
  onApprove: (playerId: string, gameId: string, bucketId: string) => void;
  onGoToMessages: (player: Player) => void;
  accentColor: string;
}) {
  return (
    <div style={{ padding: '32px 32px 60px' }}>
      <h2 style={{ color: '#F2F2F2', fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, margin: '0 0 6px', letterSpacing: 0.5 }}>
        My Players
      </h2>
      <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.4)', margin: '0 0 28px' }}>
        Track progress, approve buckets, and assign new games
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(240px, 1fr) minmax(0, 2fr)', gap: 24 }}>
        {/* Player list */}
        <Panel style={{ padding: 20 }}>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, letterSpacing: 2, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 16 }}>
            Your Roster
          </div>
          {players.length === 0 && (
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.35)', margin: 0 }}>
              No players yet. Players appear here after they book a try-out with you.
            </p>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {players.map(player => {
              const stats = calculatePlayerStats(player);
              const isSelected = selectedPlayer?.id === player.id;
              return (
                <button
                  key={player.id}
                  onClick={() => { onSelectPlayer(player); onSelectGame(null); }}
                  style={{
                    width: '100%', textAlign: 'left', padding: 14, borderRadius: 12, cursor: 'pointer',
                    background: isSelected ? `${accentColor}12` : 'rgba(255,255,255,0.02)',
                    border: isSelected ? `1px solid ${accentColor}40` : '1px solid rgba(255,255,255,0.06)',
                    display: 'flex', alignItems: 'center', gap: 12, transition: 'all 0.15s',
                  }}
                >
                  <PlayerAvatar name={player.name} src={player.avatar} size={40} accentColor={accentColor} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 600, color: '#F2F2F2', marginBottom: 2 }}>{player.name}</div>
                    <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
                      {stats.gamesWon}/{stats.totalGames} games won
                    </div>
                    {stats.pendingApprovals > 0 && (
                      <span style={{
                        display: 'inline-block', marginTop: 6, padding: '2px 8px', borderRadius: 100,
                        background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.3)',
                        fontFamily: "'Barlow', sans-serif", fontSize: 11, color: '#f97316',
                      }}>
                        {stats.pendingApprovals} pending
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </Panel>

        {/* Player detail */}
        <div>
          {selectedPlayer ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <Panel style={{ padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <PlayerAvatar name={selectedPlayer.name} src={selectedPlayer.avatar} size={56} />
                    <div>
                      <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: '#F2F2F2', margin: '0 0 4px' }}>{selectedPlayer.name}</h3>
                      <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: 0 }}>{selectedPlayer.email}</p>
                      <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.25)', margin: '4px 0 0' }}>
                        Joined {new Date(selectedPlayer.joinedDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <BtnPrimary onClick={() => onGoToMessages(selectedPlayer)} small accentColor={accentColor}>
                    <MessageSquare size={14} /> Message
                  </BtnPrimary>
                </div>
                {(() => {
                  const stats = calculatePlayerStats(selectedPlayer);
                  return (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 20, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      {[
                        { label: 'Buckets', value: `${stats.bucketsScored}/${stats.totalBuckets}`, color: accentColor },
                        { label: 'Games', value: `${stats.gamesWon}/${stats.totalGames}`, color: '#f97316' },
                        { label: 'Champion', value: stats.isChampion ? '✓' : `${6 - stats.gamesWon} to go`, color: stats.isChampion ? '#a855f7' : 'rgba(255,255,255,0.3)' },
                      ].map(s => (
                        <div key={s.label} style={{ textAlign: 'center' }}>
                          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: s.color, marginBottom: 4 }}>{s.value}</div>
                          <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{s.label}</div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </Panel>

              <Panel style={{ padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: '#F2F2F2', margin: 0, letterSpacing: 0.5 }}>Games & Goals</h3>
                  <BtnPrimary onClick={() => setShowNewGameForm(!showNewGameForm)} small accentColor={accentColor}>
                    <Plus size={14} /> New Game
                  </BtnPrimary>
                </div>

                {showNewGameForm && (
                  <div style={{ marginBottom: 20, padding: 16, background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 600, color: '#F2F2F2', marginBottom: 12 }}>Create New Game</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <input
                        type="text"
                        value={newGameTitle}
                        onChange={e => setNewGameTitle(e.target.value)}
                        placeholder="Game title"
                        style={{
                          width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: 8, padding: '10px 14px', color: '#fff', fontFamily: "'Barlow', sans-serif", fontSize: 14, outline: 'none', boxSizing: 'border-box',
                        }}
                      />
                      <input
                        type="text"
                        value={newGameDescription}
                        onChange={e => setNewGameDescription(e.target.value)}
                        placeholder="Brief description"
                        style={{
                          width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: 8, padding: '10px 14px', color: '#fff', fontFamily: "'Barlow', sans-serif", fontSize: 14, outline: 'none', boxSizing: 'border-box',
                        }}
                      />
                      <div style={{ display: 'flex', gap: 8 }}>
                        <BtnPrimary onClick={onAddGame} small>Create Game</BtnPrimary>
                        <BtnGhost onClick={() => { setShowNewGameForm(false); setNewGameTitle(''); setNewGameDescription(''); }} small>Cancel</BtnGhost>
                      </div>
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {selectedPlayer.games.map(game => {
                    const bucketsCompleted = game.buckets.filter(b => b.completed && b.coachApproved).length;
                    const totalBucketsInGame = game.buckets.length;
                    const progress = totalBucketsInGame > 0 ? Math.round((bucketsCompleted / totalBucketsInGame) * 100) : 0;
                    const pendingInGame = game.buckets.filter(b => b.pendingApproval).length;
                    const isExpanded = selectedGame?.id === game.id;

                    return (
                      <div key={game.id} style={{ borderRadius: 12, border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                        <div
                          onClick={() => onSelectGame(isExpanded ? null : game)}
                          style={{
                            padding: 16, cursor: 'pointer',
                            background: game.completed ? 'rgba(34,197,94,0.08)' : 'rgba(255,255,255,0.02)',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <div style={{
                                width: 40, height: 40, borderRadius: '50%',
                                background: game.completed ? 'rgba(34,197,94,0.2)' : `${accentColor}20`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                              }}>
                                {game.completed ? <Trophy size={18} style={{ color: '#22c55e' }} /> : <Target size={18} style={{ color: accentColor }} />}
                              </div>
                              <div>
                                <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 15, fontWeight: 600, color: '#F2F2F2' }}>{game.title}</div>
                                {game.description && (
                                  <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{game.description}</div>
                                )}
                              </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
                                {bucketsCompleted}/{totalBucketsInGame} buckets
                              </div>
                              {pendingInGame > 0 && (
                                <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: '#f97316' }}>{pendingInGame} pending</span>
                              )}
                            </div>
                          </div>
                          {!game.completed && totalBucketsInGame > 0 && (
                            <div style={{ marginTop: 12, background: 'rgba(255,255,255,0.06)', borderRadius: 100, height: 4, overflow: 'hidden' }}>
                              <div style={{ background: accentColor, height: '100%', width: `${progress}%`, transition: 'width 0.3s' }} />
                            </div>
                          )}
                        </div>

                        {isExpanded && (
                          <div style={{ padding: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                              {game.buckets.map(bucket => (
                                <div
                                  key={bucket.id}
                                  style={{
                                    padding: 14, borderRadius: 10,
                                    background: bucket.coachApproved ? 'rgba(34,197,94,0.06)' : bucket.pendingApproval ? 'rgba(249,115,22,0.06)' : 'rgba(255,255,255,0.02)',
                                    border: `1px solid ${bucket.coachApproved ? 'rgba(34,197,94,0.2)' : bucket.pendingApproval ? 'rgba(249,115,22,0.2)' : 'rgba(255,255,255,0.06)'}`,
                                  }}
                                >
                                  <div style={{ display: 'flex', gap: 12 }}>
                                    <div style={{ flexShrink: 0, paddingTop: 2 }}>
                                      {bucket.coachApproved ? <CheckCircle2 size={20} style={{ color: '#22c55e' }} />
                                        : bucket.completed ? <Clock size={20} style={{ color: '#f97316' }} />
                                        : <Circle size={20} style={{ color: 'rgba(255,255,255,0.25)' }} />}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                      <div style={{
                                        fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 600,
                                        color: bucket.coachApproved ? 'rgba(255,255,255,0.4)' : '#F2F2F2',
                                        textDecoration: bucket.coachApproved ? 'line-through' : 'none', marginBottom: 4,
                                      }}>
                                        {bucket.title}
                                      </div>
                                      <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.35)', margin: '0 0 8px' }}>{bucket.description}</p>

                                      {bucket.dueDate && !bucket.completed && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: "'Barlow', sans-serif", fontSize: 12, color: '#f97316', marginBottom: 8 }}>
                                          <Calendar size={12} /> Due: {new Date(bucket.dueDate).toLocaleDateString()}
                                        </div>
                                      )}

                                      {bucket.pendingApproval && (
                                        <BtnPrimary onClick={() => onApprove(selectedPlayer.id, game.id, bucket.id)} small>
                                          <CheckCircle2 size={14} /> Approve Completion
                                        </BtnPrimary>
                                      )}

                                      {bucket.comments.length > 0 && (
                                        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                          {bucket.comments.map(comment => (
                                            <div key={comment.id} style={{ padding: 10, background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
                                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                                <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: accentColor }}>{comment.coachName}</span>
                                                <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>
                                                  {new Date(comment.createdAt).toLocaleDateString()}
                                                </span>
                                              </div>
                                              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.6)', margin: 0 }}>{comment.text}</p>
                                            </div>
                                          ))}
                                        </div>
                                      )}

                                      {editingComment === bucket.id ? (
                                        <div style={{ marginTop: 12 }}>
                                          <textarea
                                            value={commentText}
                                            onChange={e => setCommentText(e.target.value)}
                                            placeholder="Write feedback or encouragement..."
                                            rows={3}
                                            style={{
                                              width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                                              borderRadius: 8, padding: '10px 14px', color: '#fff', fontFamily: "'Barlow', sans-serif",
                                              fontSize: 13, resize: 'vertical', outline: 'none', boxSizing: 'border-box', marginBottom: 8,
                                            }}
                                          />
                                          <div style={{ display: 'flex', gap: 8 }}>
                                            <BtnPrimary onClick={() => onAddComment(selectedPlayer.id, game.id, bucket.id)} small>
                                              <Save size={14} /> Post
                                            </BtnPrimary>
                                            <BtnGhost onClick={() => { setEditingComment(null); setCommentText(''); }} small>
                                              <X size={14} /> Cancel
                                            </BtnGhost>
                                          </div>
                                        </div>
                                      ) : (
                                        <button
                                          onClick={() => setEditingComment(bucket.id)}
                                          style={{
                                            marginTop: 10, background: 'transparent', border: 'none', cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', gap: 6,
                                            fontFamily: "'Barlow', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.35)',
                                          }}
                                        >
                                          <Edit3 size={12} /> Add comment
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {newBucketGameId === game.id ? (
                              <div style={{ marginTop: 14, padding: 14, background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' }}>
                                <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 600, color: '#F2F2F2', marginBottom: 10 }}>Add Bucket</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                  <input
                                    type="text"
                                    value={newBucketTitle}
                                    onChange={e => setNewBucketTitle(e.target.value)}
                                    placeholder="Bucket title"
                                    style={{
                                      width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                                      borderRadius: 8, padding: '9px 12px', color: '#fff', fontFamily: "'Barlow', sans-serif", fontSize: 13, outline: 'none', boxSizing: 'border-box',
                                    }}
                                  />
                                  <input
                                    type="text"
                                    value={newBucketDescription}
                                    onChange={e => setNewBucketDescription(e.target.value)}
                                    placeholder="Brief description"
                                    style={{
                                      width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                                      borderRadius: 8, padding: '9px 12px', color: '#fff', fontFamily: "'Barlow', sans-serif", fontSize: 13, outline: 'none', boxSizing: 'border-box',
                                    }}
                                  />
                                  <input
                                    type="date"
                                    value={newBucketDueDate}
                                    onChange={e => setNewBucketDueDate(e.target.value)}
                                    style={{
                                      width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                                      borderRadius: 8, padding: '9px 12px', color: '#fff', fontFamily: "'Barlow', sans-serif", fontSize: 13, outline: 'none', boxSizing: 'border-box',
                                    }}
                                  />
                                  <div style={{ display: 'flex', gap: 8 }}>
                                    <BtnPrimary onClick={() => onAddBucket(game.id)} small accentColor={accentColor}>Add Bucket</BtnPrimary>
                                    <BtnGhost onClick={() => { setNewBucketGameId(null); setNewBucketTitle(''); setNewBucketDescription(''); setNewBucketDueDate(''); }} small>Cancel</BtnGhost>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => setNewBucketGameId(game.id)}
                                style={{
                                  marginTop: 12, background: 'transparent', border: 'none', cursor: 'pointer',
                                  display: 'flex', alignItems: 'center', gap: 6,
                                  fontFamily: "'Barlow', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.4)',
                                }}
                              >
                                <Plus size={12} /> Add bucket
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Panel>
            </div>
          ) : (
            <Panel style={{ padding: 48, textAlign: 'center' }}>
              <Users size={40} style={{ color: 'rgba(255,255,255,0.15)', marginBottom: 16 }} />
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#F2F2F2', margin: '0 0 8px' }}>Select a Player</h3>
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.35)', margin: 0 }}>
                Choose a player from your roster to view progress and manage goals
              </p>
            </Panel>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── MESSAGES VIEW ────────────────────────────────────────────────────────────

function CoachMessagesView({
  players, selectedPlayer, onSelectPlayer, coachName, accentColor,
}: {
  players: Player[];
  selectedPlayer: Player | null;
  onSelectPlayer: (p: Player) => void;
  coachName: string;
  accentColor: string;
}) {
  return (
    <div style={{ padding: '32px 32px 60px' }}>
      <h2 style={{ color: '#F2F2F2', fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, margin: '0 0 6px', letterSpacing: 0.5 }}>
        Messages
      </h2>
      <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.4)', margin: '0 0 28px' }}>
        Direct chat with your players
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(220px, 1fr) minmax(0, 3fr)', gap: 20, minHeight: 'calc(100vh - 280px)' }}>
        <Panel style={{ padding: 16, overflowY: 'auto' }}>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, letterSpacing: 2, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 12 }}>
            Your Players
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {players.map(player => {
              const isSelected = selectedPlayer?.id === player.id;
              return (
                <button
                  key={player.id}
                  onClick={() => onSelectPlayer(player)}
                  style={{
                    width: '100%', textAlign: 'left', padding: 12, borderRadius: 10, cursor: 'pointer',
                    background: isSelected ? `${accentColor}12` : 'transparent',
                    border: isSelected ? `1px solid ${accentColor}35` : '1px solid transparent',
                    display: 'flex', alignItems: 'center', gap: 10,
                  }}
                >
                  <PlayerAvatar name={player.name} src={player.avatar} size={36} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 600, color: '#F2F2F2' }}>{player.name}</div>
                    <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.35)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{player.category}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </Panel>

        <Panel style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {selectedPlayer ? (
            <div style={{ flex: 1, minHeight: 500 }}>
              <CoachPlayerChat
                currentUserId="coach-1"
                currentUserName={coachName}
                currentUserRole="coach"
                otherUserId={selectedPlayer.id}
                otherUserName={selectedPlayer.name}
                otherUserRole="player"
                otherUserAvatar={selectedPlayer.avatar}
                category={selectedPlayer.category}
                categoryIcon={selectedPlayer.categoryIcon}
                accentColor={accentColor}
              />
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
              <div style={{ textAlign: 'center' }}>
                <MessageSquare size={40} style={{ color: 'rgba(255,255,255,0.15)', marginBottom: 16 }} />
                <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#F2F2F2', margin: '0 0 8px' }}>Select a Player</h3>
                <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.35)', margin: 0 }}>Choose a player to start chatting</p>
              </div>
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export function CoachPortal() {
  const { user } = useAuth();
  const [players, setPlayers] = useState<Player[]>(mockPlayers);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(mockPlayers[0]?.id ?? null);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [newGameTitle, setNewGameTitle] = useState('');
  const [newGameDescription, setNewGameDescription] = useState('');
  const [showNewGameForm, setShowNewGameForm] = useState(false);
  const [newBucketGameId, setNewBucketGameId] = useState<string | null>(null);
  const [newBucketTitle, setNewBucketTitle] = useState('');
  const [newBucketDescription, setNewBucketDescription] = useState('');
  const [newBucketDueDate, setNewBucketDueDate] = useState('');
  const [selectedPlayerForChat, setSelectedPlayerForChat] = useState<Player | null>(mockPlayers[0]);

  const selectedPlayer = players.find(p => p.id === selectedPlayerId) ?? null;

  // Logged-in coaches see their real roster (try-out bookings + assigned games).
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      try {
        const roster = await fetchCoachRoster();
        const withGames = await Promise.all(
          roster.map(async (entry) =>
            rosterEntryToPlayer(entry, await fetchGamesForPlayer(entry.player_id)),
          ),
        );
        if (cancelled) return;
        setPlayers(withGames);
        setSelectedPlayerId(withGames[0]?.id ?? null);
        setSelectedPlayerForChat(withGames[0] ?? null);
      } catch (err) {
        console.error('Failed to load roster:', err);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);
  const [showTutorial, setShowTutorial] = useState(false);
  const [highlightProfileGaps, setHighlightProfileGaps] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(() => {
    const saved = localStorage.getItem('coach_profile_completion');
    return saved ? Number(saved) : 0;
  });
  const [coachProfilePicture, setCoachProfilePicture] = useState<string | null>(() => localStorage.getItem('coach_profile_picture'));
  const [coachPhotoFrame, setCoachPhotoFrame] = useState<CoachPhotoFrame>(() => loadPhotoFrame());
  const [activeSection, setActiveSection] = useState<CoachSection>('dashboard');
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [coachIdentity] = useState(() => resolveCoachIdentity());
  const [coachCard, setCoachCard] = useState(() => resolveCoachCard());
  const [pendingReview] = useState(() => isCoachCardPendingReview());
  const accentColor = coachIdentity.pathwayColor;
  const pathwayChannelId = getCoachPathwayChannelId();
  const pathwayChannelName = coachIdentity.pathwayName;
  const profileSectionRef = useRef<HTMLDivElement | null>(null);

  const goToProfileWithHighlights = () => {
    setActiveSection('profile');
    setHighlightProfileGaps(true);
    setTimeout(() => {
      profileSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const currentCoach = {
    name: coachIdentity.fullName,
    category: `${coachIdentity.pathwayName} Pathway`,
    categoryIcon: Moon,
    profilePicture: coachProfilePicture,
  };

  const coachTutorialSteps = getCoachTutorialSteps('base');

  useEffect(() => {
    if (!isTutorialComplete('coach', 'base')) {
      setTimeout(() => setShowTutorial(true), 300);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('coach_profile_completion', String(profileCompletion));
  }, [profileCompletion]);

  useEffect(() => {
    if (coachProfilePicture) localStorage.setItem('coach_profile_picture', coachProfilePicture);
    else localStorage.removeItem('coach_profile_picture');
    if (coachCard) {
      const updated = {
        ...coachCard,
        photo: coachProfilePicture,
        photoFrame: coachPhotoFrame,
      };
      setCoachCard(updated);
      localStorage.setItem('iso_coach_card', JSON.stringify(updated));
    }
  }, [coachProfilePicture, coachPhotoFrame]);

  const addComment = (playerId: string, gameId: string, bucketId: string) => {
    if (!commentText.trim()) return;
    const newComment: Comment = {
      id: `c-${Date.now()}`, text: commentText,
      createdAt: new Date().toISOString(), coachName: currentCoach.name,
    };
    if (user) {
      void addBucketComment(bucketId, user.id, currentCoach.name, commentText.trim())
        .catch(err => console.error('Failed to save comment:', err));
    }
    setPlayers(prev => prev.map(player => {
      if (player.id !== playerId) return player;
      return {
        ...player,
        games: player.games.map(game => {
          if (game.id !== gameId) return game;
          return {
            ...game,
            buckets: game.buckets.map(bucket =>
              bucket.id === bucketId ? { ...bucket, comments: [...bucket.comments, newComment] } : bucket,
            ),
          };
        }),
      };
    }));
    setCommentText('');
    setEditingComment(null);
  };

  const approveBucket = (playerId: string, gameId: string, bucketId: string) => {
    if (user) {
      void approveBucketDb(gameId, bucketId)
        .catch(err => console.error('Failed to approve bucket:', err));
    }
    setPlayers(prev => prev.map(player => {
      if (player.id !== playerId) return player;
      return {
        ...player,
        games: player.games.map(game => {
          if (game.id !== gameId) return game;
          const updatedBuckets = game.buckets.map(bucket =>
            bucket.id === bucketId ? { ...bucket, coachApproved: true, pendingApproval: false } : bucket,
          );
          const allApproved = updatedBuckets.every(b => b.completed && b.coachApproved);
          return {
            ...game, buckets: updatedBuckets,
            completed: allApproved,
            completedDate: allApproved ? new Date().toISOString().split('T')[0] : game.completedDate,
          };
        }),
      };
    }));
  };

  const addNewGame = async (playerId: string) => {
    if (!newGameTitle.trim() || !selectedPlayer) return;
    let newGame: Game = {
      id: `g-${Date.now()}`, title: newGameTitle, description: newGameDescription,
      completed: false, buckets: [],
    };
    if (user) {
      try {
        const row = await createGame(user.id, playerId, newGameTitle.trim(), newGameDescription.trim());
        newGame = { id: row.id, title: row.title, description: row.description ?? undefined, completed: false, buckets: [] };
      } catch (err) {
        console.error('Failed to create game:', err);
        return;
      }
    }
    setPlayers(prev => prev.map(p => p.id === playerId ? { ...p, games: [...p.games, newGame] } : p));
    setNewGameTitle('');
    setNewGameDescription('');
    setShowNewGameForm(false);
  };

  const addNewBucket = async (playerId: string, gameId: string) => {
    if (!newBucketTitle.trim()) return;
    let bucket: Bucket = {
      id: `b-${Date.now()}`, title: newBucketTitle.trim(), description: newBucketDescription.trim(),
      completed: false, coachApproved: false, dueDate: newBucketDueDate || undefined, comments: [],
    };
    if (user) {
      try {
        const row = await addBucketDb(gameId, newBucketTitle.trim(), newBucketDescription.trim(), newBucketDueDate || undefined);
        bucket = {
          id: row.id, title: row.title, description: row.description ?? '',
          completed: false, coachApproved: false, dueDate: row.due_date ?? undefined, comments: [],
        };
      } catch (err) {
        console.error('Failed to add bucket:', err);
        return;
      }
    }
    setPlayers(prev => prev.map(p => p.id !== playerId ? p : {
      ...p,
      games: p.games.map(g => g.id !== gameId ? g : { ...g, buckets: [...g.buckets, bucket] }),
    }));
    setNewBucketTitle('');
    setNewBucketDescription('');
    setNewBucketDueDate('');
    setNewBucketGameId(null);
  };

  const allStats = {
    totalPlayers: players.length,
    totalPendingApprovals: players.reduce((sum, p) =>
      sum + p.games.reduce((gs, g) => gs + g.buckets.filter(b => b.pendingApproval).length, 0), 0),
    totalActiveGames: players.reduce((sum, p) => sum + p.games.filter(g => !g.completed).length, 0),
    champions: players.filter(p => p.games.filter(g => g.completed).length >= 6).length,
  };

  const sidebarW = sidebarExpanded ? SIDEBAR_W_EXPANDED : SIDEBAR_W_COLLAPSED;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', paddingTop: NAV_H }}>
      {showTutorial && (
        <PortalTutorial
          steps={coachTutorialSteps}
          tutorialScope="base"
          role="coach"
          onNavigate={(section) => setActiveSection(section as CoachSection)}
          onExpandSidebar={setSidebarExpanded}
          onComplete={() => {
            markTutorialComplete('coach', 'base');
            setShowTutorial(false);
          }}
        />
      )}

      <CoachSidebar
        active={activeSection}
        onSelect={setActiveSection}
        expanded={sidebarExpanded}
        onToggle={() => setSidebarExpanded(e => !e)}
        accentColor={accentColor}
      />

      <main style={{
        flex: 1, marginLeft: sidebarW, transition: 'margin-left 0.25s ease',
        minHeight: `calc(100vh - ${NAV_H}px)`, overflowY: 'auto', background: '#111111',
      }}>
        <PortalChromeBar role="coach" portalLabel="Coach Portal" accentColor={accentColor} />

        {profileCompletion < 85 && (
          <div style={{
            margin: '24px 32px 0', background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.35)',
            borderRadius: 14, padding: '16px 20px', display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', gap: 16, flexWrap: 'wrap',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <AlertCircle size={20} style={{ color: '#f97316', flexShrink: 0 }} />
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.7)', margin: 0 }}>
                Complete your coach profile to get published on ISO.
              </p>
            </div>
            <button
              onClick={goToProfileWithHighlights}
              style={{
                background: '#f97316', color: '#fff', border: 'none', borderRadius: 10,
                padding: '10px 20px', fontFamily: "'Barlow', sans-serif", fontSize: 13,
                fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap',
              }}
            >
              Complete Profile <ArrowRight size={14} />
            </button>
          </div>
        )}

        {activeSection === 'dashboard' && (
          <CoachDashboardView
            allStats={allStats}
            coachIdentity={coachIdentity}
            coachCard={coachCard}
            pendingReview={pendingReview}
            accentColor={accentColor}
            onNavigate={setActiveSection}
          />
        )}

        {activeSection === 'players' && (
          <CoachPlayersView
            players={players}
            selectedPlayer={selectedPlayer}
            selectedGame={selectedGame}
            onSelectPlayer={p => setSelectedPlayerId(p.id)}
            onSelectGame={setSelectedGame}
            showNewGameForm={showNewGameForm}
            setShowNewGameForm={setShowNewGameForm}
            newGameTitle={newGameTitle}
            setNewGameTitle={setNewGameTitle}
            newGameDescription={newGameDescription}
            setNewGameDescription={setNewGameDescription}
            onAddGame={() => selectedPlayer && addNewGame(selectedPlayer.id)}
            newBucketGameId={newBucketGameId}
            setNewBucketGameId={setNewBucketGameId}
            newBucketTitle={newBucketTitle}
            setNewBucketTitle={setNewBucketTitle}
            newBucketDescription={newBucketDescription}
            setNewBucketDescription={setNewBucketDescription}
            newBucketDueDate={newBucketDueDate}
            setNewBucketDueDate={setNewBucketDueDate}
            onAddBucket={gameId => selectedPlayer && addNewBucket(selectedPlayer.id, gameId)}
            editingComment={editingComment}
            setEditingComment={setEditingComment}
            commentText={commentText}
            setCommentText={setCommentText}
            onAddComment={addComment}
            onApprove={approveBucket}
            onGoToMessages={p => { setSelectedPlayerForChat(p); setActiveSection('messages'); }}
            accentColor={accentColor}
          />
        )}

        {activeSection === 'messages' && (
          <CoachMessagesView
            players={players}
            selectedPlayer={selectedPlayerForChat}
            onSelectPlayer={setSelectedPlayerForChat}
            coachName={currentCoach.name}
            accentColor={accentColor}
          />
        )}

        {activeSection === 'matching' && (
          <div style={{ padding: '32px 32px 60px' }}>
            <h2 style={{ color: '#F2F2F2', fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, margin: '0 0 6px', letterSpacing: 0.5 }}>
              AI Matching
            </h2>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.4)', margin: '0 0 28px' }}>
              Review player match scores and accept new requests
            </p>
            <AIMatchingDashboard />
          </div>
        )}

        {activeSection === 'community' && (
          <div style={{ padding: '32px 32px 60px' }}>
            <h2 style={{ color: '#F2F2F2', fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, margin: '0 0 6px', letterSpacing: 0.5 }}>ISO Community</h2>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.4)', margin: '0 0 24px' }}>
              Share wins, celebrate goals, and encourage players & coaches across every pathway.
            </p>
            <ISOCommunityForum
              lockedPathwayId={pathwayChannelId}
              lockedPathwayName={pathwayChannelName}
            />
          </div>
        )}

        {activeSection === 'locker-room' && (
          <div style={{ padding: '32px 32px 60px' }}>
            <h2 style={{ color: '#F2F2F2', fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, margin: '0 0 6px', letterSpacing: 0.5 }}>Locker Room</h2>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.4)', margin: '0 0 24px' }}>
              Pathway channels & video library · coaches can access all pathways
            </p>
            <LockerRoomChat
              lockedPathwayId={pathwayChannelId}
              userRole="coach"
              coachName={coachIdentity.fullName}
            />
          </div>
        )}

        {activeSection === 'store' && (
          <div style={{ padding: '32px 32px 60px' }}>
            <CoachStoreSection accentColor={accentColor} />
          </div>
        )}

        {activeSection === 'profile' && (
          <div style={{ padding: '32px 32px 60px' }} ref={profileSectionRef}>
            <h2 style={{ color: '#F2F2F2', fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, margin: '0 0 6px', letterSpacing: 0.5 }}>
              My Profile
            </h2>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.4)', margin: '0 0 28px' }}>
              How players see you on ISO — review your card and refine your details
            </p>

            {coachCard && (
              <div style={{
                display: 'flex', flexWrap: 'wrap', gap: 32, alignItems: 'flex-start',
                marginBottom: 32, padding: 24,
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14,
              }}>
                <CoachISOCard card={coachCard} pendingReview={pendingReview} pathwayColor={accentColor} />
                <div style={{ flex: 1, minWidth: 240 }}>
                  <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#F2F2F2', margin: '0 0 12px' }}>
                    {coachIdentity.fullName}
                  </h3>
                  <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.45)', margin: '0 0 16px', lineHeight: 1.6 }}>
                    {coachCard.result.reasoning}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                    <span style={{ padding: '4px 12px', borderRadius: 100, fontSize: 11, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, letterSpacing: 1, color: accentColor, background: `${accentColor}15`, border: `1px solid ${accentColor}30` }}>
                      OVR {coachCard.result.overall}
                    </span>
                    <span style={{ padding: '4px 12px', borderRadius: 100, fontSize: 11, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, letterSpacing: 1, color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      {coachCard.result.tierLabel} Tier
                    </span>
                    {pendingReview && (
                      <span style={{ padding: '4px 12px', borderRadius: 100, fontSize: 11, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, letterSpacing: 1, color: '#f97316', background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.3)' }}>
                        Not Yet Public
                      </span>
                    )}
                  </div>
                  <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.35)', margin: '0 0 20px' }}>
                    Fields below were pre-filled from your onboarding intake. Update availability and preferences to complete your profile.
                  </p>
                  <CoachOverallProgressBar accentColor={accentColor} compact />
                </div>
              </div>
            )}

            <CoachProfileSection
              accentColor={accentColor}
              onProfileCompletionChange={(pct) => {
                setProfileCompletion(pct);
                if (pct >= 100) setHighlightProfileGaps(false);
              }}
              onProfilePictureChange={setCoachProfilePicture}
              onPhotoFrameChange={setCoachPhotoFrame}
              initialProfilePicture={coachProfilePicture}
              initialPhotoFrame={coachPhotoFrame}
              highlightIncomplete={highlightProfileGaps}
              onHighlightDismiss={() => setHighlightProfileGaps(false)}
            />
          </div>
        )}
      </main>
    </div>
  );
}
