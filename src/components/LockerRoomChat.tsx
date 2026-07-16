import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Send, Users, Video, MapPin } from 'lucide-react';
import { PATHWAYS, PATHWAY_BY_ID, type PathwayId } from '../data/pathways';
import { useAuth } from '../contexts/AuthContext';
import {
  fetchLockerMessages,
  sendLockerMessage,
  subscribeToLockerChannel,
} from '../services/communityService';
import type { DbLockerMessage } from '../types/database';

const PATHWAY_HEX: Record<string, string> = {
  deen: '#10b981', health: '#ef4444', medicine: '#3b82f6',
  engineering: '#a855f7', entrepreneurship: '#f97316', global: '#06b6d4',
};

interface ChatMessage {
  id: string;
  userName: string;
  userLocation?: string;
  lockedPathwayId: PathwayId;
  content: string;
  timestamp: Date;
  channelPathwayId: PathwayId;
}

const MOCK_MESSAGES: ChatMessage[] = [
  { id: '1', userName: 'Ahmad K.', userLocation: 'California', lockedPathwayId: 'engineering', content: 'Just started my Engineering journey — excited to connect!', timestamp: new Date(Date.now() - 3600000), channelPathwayId: 'engineering' },
  { id: '2', userName: 'Fatima M.', userLocation: 'Texas', lockedPathwayId: 'engineering', content: 'Welcome Ahmad! Happy to share what worked for me in month one.', timestamp: new Date(Date.now() - 3300000), channelPathwayId: 'engineering' },
  { id: '3', userName: 'Aisha R.', userLocation: 'New York', lockedPathwayId: 'deen', content: 'Building my spiritual foundation has been transformative. Grateful for this community!', timestamp: new Date(Date.now() - 1800000), channelPathwayId: 'deen' },
  { id: '4', userName: 'Omar H.', userLocation: 'Illinois', lockedPathwayId: 'global', content: 'Anyone going to the next ISO pop-up? Would love to meet up.', timestamp: new Date(Date.now() - 900000), channelPathwayId: 'global' },
  { id: '5', userName: 'Marcus T.', userLocation: 'Michigan', lockedPathwayId: 'health', content: 'Great discussion in the Deen channel — love hearing different perspectives.', timestamp: new Date(Date.now() - 600000), channelPathwayId: 'deen' },
];

const MOCK_VIDEOS = [
  { id: '1', title: 'Building Your Foundation', duration: '15:30', pathwayId: null as PathwayId | null },
  { id: '2', title: 'ISO Community Event Highlights', duration: '12:20', pathwayId: null },
  { id: '3', title: `${PATHWAY_BY_ID.deen.name}: Spiritual Resilience`, duration: '22:15', pathwayId: 'deen' as PathwayId },
  { id: '4', title: `${PATHWAY_BY_ID.health.name}: Discipline Through the Body`, duration: '18:30', pathwayId: 'health' as PathwayId },
];

function formatTime(date: Date) {
  const mins = Math.floor((Date.now() - date.getTime()) / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return date.toLocaleDateString();
}

interface LockerRoomChatProps {
  lockedPathwayId: string;
  userRole?: 'player' | 'coach';
  coachName?: string;
}

function dbToChatMessage(m: DbLockerMessage, overridePathwayId?: string): ChatMessage {
  const pathway =
    (overridePathwayId as PathwayId) ||
    (m.sender_pathway_id as PathwayId) ||
    'deen';
  return {
    id: m.id,
    userName: m.sender_role === 'coach' ? `${m.sender_name} (Coach)` : m.sender_name,
    lockedPathwayId: pathway,
    content: m.body,
    timestamp: new Date(m.created_at),
    channelPathwayId: (m.channel_pathway_id as PathwayId) || 'deen',
  };
}

export function LockerRoomChat({ lockedPathwayId, userRole = 'player', coachName }: LockerRoomChatProps) {
  const { user, profile } = useAuth();
  const [selectedChannel, setSelectedChannel] = useState<PathwayId>((lockedPathwayId as PathwayId) || 'deen');
  const [activeTab, setActiveTab] = useState<'chat' | 'videos'>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>(user ? [] : MOCK_MESSAGES);
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);
  const hex = PATHWAY_HEX[selectedChannel] ?? '#f97316';
  const lockedHex = PATHWAY_HEX[lockedPathwayId] ?? '#f97316';
  const lockedName = PATHWAY_BY_ID[lockedPathwayId as keyof typeof PATHWAY_BY_ID]?.name ?? lockedPathwayId;
  const isCoach = userRole === 'coach';
  const postingInOtherChannel = !isCoach && selectedChannel !== lockedPathwayId;
  const filteredMessages = messages.filter((m) => m.channelPathwayId === selectedChannel);
  const filteredVideos = MOCK_VIDEOS.filter(
    (v) => v.pathwayId === null || v.pathwayId === selectedChannel,
  );
  // Decorative presence count until we wire real presence.
  const onlineCount = 3 + (filteredMessages.length % 5);

  const profileName = profile
    ? [profile.first_name, profile.last_name].filter(Boolean).join(' ')
    : '';
  const senderName = profileName || (isCoach ? coachName ?? 'Coach' : 'You');

  // Signed-in members get the real channel with live updates; guests see the demo.
  // Own messages use the current locked pathway so stale demo pathway badges don't stick.
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    const mapRow = (m: DbLockerMessage) =>
      dbToChatMessage(m, m.sender_id === user.id ? lockedPathwayId : undefined);

    fetchLockerMessages(selectedChannel)
      .then((rows) => {
        if (!cancelled) setMessages(rows.map(mapRow));
      })
      .catch((err) => console.error('Failed to load locker room messages:', err));

    const unsubscribe = subscribeToLockerChannel(selectedChannel, (m) => {
      setMessages((prev) => (prev.some((x) => x.id === m.id) ? prev : [...prev, mapRow(m)]));
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [user?.id, selectedChannel, lockedPathwayId]);

  const sendMessage = () => {
    const content = input.trim();
    if (!content || !lockedPathwayId) return;
    setInput('');

    if (user) {
      void sendLockerMessage({
        senderId: user.id,
        senderName,
        senderRole: userRole,
        senderPathwayId: lockedPathwayId,
        channelPathwayId: selectedChannel,
        body: content,
      })
        .then((row) => {
          setMessages((prev) =>
            prev.some((x) => x.id === row.id)
              ? prev
              : [...prev, dbToChatMessage(row, lockedPathwayId)],
          );
          setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
        })
        .catch((err) => console.error('Failed to send locker room message:', err));
      return;
    }

    const msg: ChatMessage = {
      id: Date.now().toString(),
      userName: isCoach ? (coachName ?? 'Coach') : 'You',
      userLocation: 'Your Location',
      lockedPathwayId: lockedPathwayId as PathwayId,
      content,
      timestamp: new Date(),
      channelPathwayId: selectedChannel,
    };
    setMessages(prev => [...prev, msg]);
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  const PathwayBadge = ({ pathwayId, small }: { pathwayId: string; small?: boolean }) => {
    const pHex = PATHWAY_HEX[pathwayId] ?? '#888';
    const pName = PATHWAY_BY_ID[pathwayId as keyof typeof PATHWAY_BY_ID]?.name ?? pathwayId;
    return (
      <span style={{
        fontFamily: "'Barlow Condensed', sans-serif", fontSize: small ? 9 : 10, fontWeight: 700, letterSpacing: 1,
        color: pHex, background: `${pHex}18`, border: `1px solid ${pHex}40`,
        borderRadius: 100, padding: small ? '1px 7px' : '2px 9px', textTransform: 'uppercase',
      }}>
        {pName}
      </span>
    );
  };

  return (
    <div style={{ display: 'flex', gap: 0, minHeight: 520, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden' }}>
      <div style={{ width: 200, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.07)', background: '#0A0A0A', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: '#F2F2F2', letterSpacing: 1 }}>CHANNELS</div>
          <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>
            {isCoach
              ? `All pathways · posting as ${coachName ?? 'Coach'}`
              : `Browse all · you post as ${lockedName}`}
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 8 }}>
          {PATHWAYS.map(p => {
            const active = selectedChannel === p.id;
            const pHex = PATHWAY_HEX[p.id];
            const isHome = p.id === lockedPathwayId;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedChannel(p.id)}
                style={{
                  width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: 10, marginBottom: 4,
                  background: active ? `${pHex}18` : 'transparent',
                  border: active ? `1px solid ${pHex}40` : '1px solid transparent',
                  color: active ? '#fff' : 'rgba(255,255,255,0.45)', cursor: 'pointer',
                  fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: active ? 600 : 400,
                  display: 'flex', alignItems: 'center', gap: 8,
                }}
              >
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: pHex, flexShrink: 0 }} />
                <span style={{ flex: 1 }}>{p.name}</span>
                {isHome && !isCoach && <span style={{ fontSize: 9, color: pHex, opacity: 0.7 }}>HOME</span>}
                {isCoach && p.id === lockedPathwayId && <span style={{ fontSize: 9, color: pHex, opacity: 0.7 }}>YOURS</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: hex, letterSpacing: 0.5 }}>
              {PATHWAY_BY_ID[selectedChannel]?.name ?? 'Locker Room'}
            </div>
            <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
              <Users size={12} /> {onlineCount} online
            </div>
          </div>
          <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: 4 }}>
            {(['chat', 'videos'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
                  fontFamily: "'Barlow Condensed', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: 1,
                  background: activeTab === tab ? hex : 'transparent',
                  color: activeTab === tab ? '#fff' : 'rgba(255,255,255,0.4)',
                  textTransform: 'uppercase',
                }}
              >
                {tab === 'chat' ? 'Chat' : 'Videos'}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'chat' ? (
          <>
            {postingInOtherChannel && (
              <div style={{ padding: '10px 20px', background: `${lockedHex}08`, borderBottom: `1px solid ${lockedHex}20`, fontFamily: "'Barlow', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                Commenting in another channel as a <PathwayBadge pathwayId={lockedPathwayId} small /> member
              </div>
            )}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14, maxHeight: 400 }}>
              {filteredMessages.length === 0 && (
                <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginTop: 40 }}>
                  No messages yet in this channel. Start the conversation!
                </p>
              )}
              {filteredMessages.map(msg => (
                <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 600, color: '#F2F2F2' }}>{msg.userName}</span>
                    <PathwayBadge pathwayId={msg.lockedPathwayId} small />
                    {msg.userLocation && (
                      <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', gap: 3 }}>
                        <MapPin size={10} /> {msg.userLocation}
                      </span>
                    )}
                    <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.25)', marginLeft: 'auto' }}>{formatTime(msg.timestamp)}</span>
                  </div>
                  <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.65)', margin: 0, lineHeight: 1.5 }}>{msg.content}</p>
                </div>
              ))}
              <div ref={endRef} />
            </div>
            <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: 10, alignItems: 'center' }}>
              {isCoach ? (
                <span style={{
                  fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 1,
                  color: hex, background: `${hex}18`, border: `1px solid ${hex}40`,
                  borderRadius: 100, padding: '2px 9px', textTransform: 'uppercase',
                }}>
                  Coach
                </span>
              ) : (
                <PathwayBadge pathwayId={lockedPathwayId} />
              )}
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder={`Message ${PATHWAY_BY_ID[selectedChannel]?.name} channel...`}
                style={{
                  flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 10, padding: '10px 14px', color: '#fff', fontFamily: "'Barlow', sans-serif", fontSize: 14, outline: 'none',
                }}
              />
              <button
                onClick={sendMessage}
                style={{ background: hex, border: 'none', borderRadius: 10, padding: '10px 16px', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center' }}
              >
                <Send size={16} />
              </button>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
            {filteredVideos.map(v => (
              <div key={v.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ height: 100, background: `linear-gradient(135deg, ${hex}30, rgba(0,0,0,0.4))`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Video size={28} style={{ color: 'rgba(255,255,255,0.4)' }} />
                </div>
                <div style={{ padding: '12px 14px' }}>
                  <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 600, color: '#F2F2F2', marginBottom: 4, lineHeight: 1.3 }}>{v.title}</div>
                  <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{v.duration}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
