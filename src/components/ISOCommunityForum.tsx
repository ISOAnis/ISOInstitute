import * as React from 'react';
import { useState } from 'react';
import {
  Heart, MessageCircle, Target, Trophy, Sparkles, Send,
  Lock, ArrowRight, Flame, Users,
} from 'lucide-react';
import { PATHWAY_BY_ID, type PathwayId } from '../data/pathways';
import { LOCKER_ROOM_PRICE_USD } from '../utils/explorerUsage';
import { getPortalFirstName } from '../utils/portalGreeting';

const PATHWAY_HEX: Record<string, string> = {
  deen: '#10b981', health: '#ef4444', medicine: '#3b82f6',
  engineering: '#a855f7', entrepreneurship: '#f97316', global: '#06b6d4',
};

type PostType = 'goal' | 'win' | 'encourage' | 'milestone';

interface ForumPost {
  id: string;
  authorName: string;
  authorRole: 'player' | 'coach';
  pathwayId: PathwayId;
  type: PostType;
  content: string;
  goalTitle?: string;
  timestamp: Date;
  encourages: number;
  comments: number;
  encouragedByMe?: boolean;
}

const MOCK_POSTS: ForumPost[] = [
  {
    id: '1', authorName: 'Fatima M.', authorRole: 'player', pathwayId: 'engineering',
    type: 'goal', goalTitle: 'Ship my first portfolio project',
    content: 'Just marked this done — 3 weeks of consistent work. Thanks to everyone who checked in on me in the forum last week.',
    timestamp: new Date(Date.now() - 7200000), encourages: 14, comments: 3,
  },
  {
    id: '2', authorName: 'Coach Marcus W.', authorRole: 'coach', pathwayId: 'health',
    type: 'encourage',
    content: 'Proud of this community. Saw three players hit their weekly movement goals before Friday — that\'s the ISO standard. Keep stacking wins.',
    timestamp: new Date(Date.now() - 14400000), encourages: 28, comments: 7,
  },
  {
    id: '3', authorName: 'Ahmad K.', authorRole: 'player', pathwayId: 'deen',
    type: 'win',
    content: '30 days of Fajr on time. Small daily reps add up — wanted to share with the squad.',
    timestamp: new Date(Date.now() - 28800000), encourages: 41, comments: 12,
  },
  {
    id: '4', authorName: 'Priya S.', authorRole: 'player', pathwayId: 'medicine',
    type: 'goal', goalTitle: 'Complete MCAT study block 1',
    content: 'Finished block 1 today. Anyone else grinding applications this month? Let\'s hold each other accountable.',
    timestamp: new Date(Date.now() - 43200000), encourages: 9, comments: 5,
  },
  {
    id: '5', authorName: 'Coach Naomi C.', authorRole: 'coach', pathwayId: 'entrepreneurship',
    type: 'milestone',
    content: 'Shoutout to Zara — validated her MVP idea and got 5 user interviews this week. This is what Locker Room momentum looks like.',
    timestamp: new Date(Date.now() - 86400000), encourages: 22, comments: 4,
  },
];

const POST_TYPE_META: Record<PostType, { label: string; Icon: React.ComponentType<{ size?: number }>; color: string }> = {
  goal: { label: 'Goal completed', Icon: Target, color: '#22c55e' },
  win: { label: 'Win shared', Icon: Trophy, color: '#f97316' },
  encourage: { label: 'Encouragement', Icon: Heart, color: '#ec4899' },
  milestone: { label: 'Milestone', Icon: Sparkles, color: '#a855f7' },
};

function formatTime(date: Date) {
  const mins = Math.floor((Date.now() - date.getTime()) / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return date.toLocaleDateString();
}

interface ISOCommunityForumProps {
  lockedPathwayId?: string;
  lockedPathwayName?: string;
}

export function ISOCommunityForum({ lockedPathwayId, lockedPathwayName }: ISOCommunityForumProps) {
  const [posts, setPosts] = useState<ForumPost[]>(MOCK_POSTS);
  const [filter, setFilter] = useState<'all' | PostType>('all');
  const [compose, setCompose] = useState('');
  const [postType, setPostType] = useState<PostType>('win');
  const playerName = getPortalFirstName('player');
  const pathwayId = (lockedPathwayId as PathwayId) || 'engineering';
  const pathwayHex = PATHWAY_HEX[pathwayId] ?? '#f97316';

  const filtered = filter === 'all' ? posts : posts.filter(p => p.type === filter);

  const toggleEncourage = (id: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id !== id) return p;
      const encouraged = !p.encouragedByMe;
      return {
        ...p,
        encouragedByMe: encouraged,
        encourages: p.encourages + (encouraged ? 1 : -1),
      };
    }));
  };

  const sharePost = () => {
    if (!compose.trim()) return;
    const post: ForumPost = {
      id: Date.now().toString(),
      authorName: playerName,
      authorRole: 'player',
      pathwayId,
      type: postType,
      content: compose.trim(),
      goalTitle: postType === 'goal' ? compose.trim().slice(0, 48) : undefined,
      timestamp: new Date(),
      encourages: 0,
      comments: 0,
    };
    setPosts(prev => [post, ...prev]);
    setCompose('');
  };

  return (
    <div>
      {/* Stats bar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        {[
          { label: 'Active today', value: '47', Icon: Users },
          { label: 'Wins shared', value: String(posts.filter(p => p.type === 'win' || p.type === 'goal').length), Icon: Trophy },
          { label: 'Encouragements', value: String(posts.reduce((s, p) => s + p.encourages, 0)), Icon: Flame },
        ].map(s => (
          <div key={s.label} style={{ flex: '1 1 140px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <s.Icon size={18} style={{ color: pathwayHex, opacity: 0.8 }} />
            <div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#F2F2F2', lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Compose */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${pathwayHex}30`, borderRadius: 16, padding: 20, marginBottom: 24 }}>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 2, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginBottom: 12 }}>
          Share with the ISO community
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
          {(Object.keys(POST_TYPE_META) as PostType[]).map(t => {
            const meta = POST_TYPE_META[t];
            const active = postType === t;
            return (
              <button key={t} onClick={() => setPostType(t)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 100, border: `1px solid ${active ? meta.color + '60' : 'rgba(255,255,255,0.1)'}`, background: active ? `${meta.color}18` : 'transparent', color: active ? meta.color : 'rgba(255,255,255,0.45)', cursor: 'pointer', fontFamily: "'Barlow', sans-serif", fontSize: 12 }}>
                <meta.Icon size={12} /> {meta.label}
              </button>
            );
          })}
        </div>
        <textarea
          value={compose}
          onChange={e => setCompose(e.target.value)}
          placeholder={postType === 'goal' ? 'What goal did you just complete?' : 'Encourage someone, share a win, or celebrate a milestone...'}
          rows={3}
          style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '12px 14px', color: '#fff', fontFamily: "'Barlow', sans-serif", fontSize: 14, resize: 'vertical', boxSizing: 'border-box', marginBottom: 12 }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
            Posting as <strong style={{ color: pathwayHex }}>{playerName}</strong>
            {lockedPathwayName && <> · {lockedPathwayName}</>}
          </span>
          <button onClick={sharePost} disabled={!compose.trim()} style={{ display: 'flex', alignItems: 'center', gap: 8, background: compose.trim() ? pathwayHex : 'rgba(255,255,255,0.08)', color: '#fff', border: 'none', borderRadius: 100, padding: '10px 22px', fontFamily: "'Bebas Neue', sans-serif", fontSize: 14, letterSpacing: 1.5, cursor: compose.trim() ? 'pointer' : 'not-allowed', opacity: compose.trim() ? 1 : 0.5 }}>
            <Send size={14} /> POST
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20, overflowX: 'auto', paddingBottom: 4 }}>
        {(['all', 'goal', 'win', 'encourage', 'milestone'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: '8px 16px', borderRadius: 100, border: 'none', cursor: 'pointer', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: 1, whiteSpace: 'nowrap', background: filter === f ? `${pathwayHex}25` : 'rgba(255,255,255,0.05)', color: filter === f ? pathwayHex : 'rgba(255,255,255,0.4)' }}>
            {f === 'all' ? 'ALL POSTS' : POST_TYPE_META[f].label.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {filtered.map(post => {
          const meta = POST_TYPE_META[post.type];
          const hex = PATHWAY_HEX[post.pathwayId] ?? '#888';
          const pathwayName = PATHWAY_BY_ID[post.pathwayId]?.name ?? post.pathwayId;
          return (
            <article key={post.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '20px 22px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: `${hex}20`, border: `2px solid ${hex}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, color: hex, flexShrink: 0 }}>
                  {post.authorName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                    <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 600, color: '#F2F2F2' }}>{post.authorName}</span>
                    {post.authorRole === 'coach' && (
                      <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: '#f97316', background: 'rgba(249,115,22,0.15)', padding: '2px 8px', borderRadius: 100 }}>COACH</span>
                    )}
                    <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{formatTime(post.timestamp)}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: hex, background: `${hex}15`, padding: '2px 8px', borderRadius: 100 }}>{pathwayName}</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: "'Barlow', sans-serif", fontSize: 11, color: meta.color }}>
                      <meta.Icon size={11} /> {meta.label}
                    </span>
                  </div>
                </div>
              </div>
              {post.goalTitle && post.type === 'goal' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, padding: '10px 14px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 10 }}>
                  <CheckIcon />
                  <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'rgba(34,197,94,0.9)', fontWeight: 600 }}>{post.goalTitle}</span>
                </div>
              )}
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.65, margin: '0 0 16px' }}>{post.content}</p>
              <div style={{ display: 'flex', gap: 16, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <button onClick={() => toggleEncourage(post.id)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: post.encouragedByMe ? '#ec4899' : 'rgba(255,255,255,0.4)', fontFamily: "'Barlow', sans-serif", fontSize: 13 }}>
                  <Heart size={15} fill={post.encouragedByMe ? '#ec4899' : 'none'} /> Encourage · {post.encourages}
                </button>
                <button style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', fontFamily: "'Barlow', sans-serif", fontSize: 13 }}>
                  <MessageCircle size={15} /> {post.comments} replies
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

interface CommunityUpgradeGateProps {
  onUpgrade: () => void;
}

export function CommunityUpgradeGate({ onUpgrade }: CommunityUpgradeGateProps) {
  return (
    <div style={{ padding: 48, textAlign: 'center', background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.25)', borderRadius: 20 }}>
      <Lock size={36} style={{ color: '#f97316', marginBottom: 16, opacity: 0.7 }} />
      <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: '#F2F2F2', margin: '0 0 10px' }}>ISO Community</h3>
      <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 15, color: 'rgba(255,255,255,0.45)', margin: '0 auto 24px', maxWidth: 420, lineHeight: 1.7 }}>
        Locker Room members get the ISO forum — share goals you finished, encourage players across pathways, and build real momentum with coaches in the mix.
      </p>
      <ul style={{ textAlign: 'left', maxWidth: 360, margin: '0 auto 28px', padding: '0 0 0 20px', fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8 }}>
        <li>Post goal completions & wins</li>
        <li>Encourage players in other pathways</li>
        <li>Coach shoutouts & milestone celebrations</li>
        <li>Cross-pathway community — not just chat</li>
      </ul>
      <button onClick={onUpgrade} style={{ background: '#f97316', color: '#fff', border: 'none', borderRadius: 100, padding: '13px 32px', fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, letterSpacing: 2, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        JOIN LOCKER ROOM · ${LOCKER_ROOM_PRICE_USD}/MO <ArrowRight size={14} />
      </button>
    </div>
  );
}
