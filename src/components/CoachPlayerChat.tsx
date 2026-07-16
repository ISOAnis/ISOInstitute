import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Smile, Check, CheckCheck, MessageSquare } from 'lucide-react';
import {
  PORTAL_ACCENT, PORTAL_PANEL_BG, PORTAL_PANEL_BORDER,
  PORTAL_INPUT_BG, PORTAL_INPUT_BORDER, PORTAL_TEXT_PRIMARY, PORTAL_TEXT_MUTED, PORTAL_TEXT_DIM,
} from '../utils/portalTheme';
import { useAuth } from '../contexts/AuthContext';
import {
  fetchConversation,
  markConversationRead,
  sendMessage,
  subscribeToIncomingMessages,
} from '../services/messagesService';
import type { DbMessage } from '../types/database';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderRole: 'coach' | 'player';
  timestamp: Date;
  read: boolean;
}

type CategoryIconType = string | React.ComponentType<{ className?: string }>;

interface CoachPlayerChatProps {
  currentUserId: string;
  currentUserName: string;
  currentUserRole: 'coach' | 'player';
  otherUserId: string;
  otherUserName: string;
  otherUserRole: 'coach' | 'player';
  otherUserAvatar?: string;
  category?: string;
  categoryIcon?: CategoryIconType;
  accentColor?: string;
}

const mockMessages: Message[] = [
  {
    id: '1',
    content: 'Assalamu alaikum! Welcome to our coaching journey. I\'m excited to work with you.',
    senderId: 'coach-1',
    senderName: 'Imam Abdullah Rahman',
    senderRole: 'coach',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: '2',
    content: 'Wa alaikum assalam! Thank you so much. I\'m really looking forward to learning from you.',
    senderId: 'player-1',
    senderName: 'You',
    senderRole: 'player',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000),
    read: true,
  },
  {
    id: '3',
    content: 'Great! Let\'s start by setting up your daily prayer routine. How are you doing with your current prayer schedule?',
    senderId: 'coach-1',
    senderName: 'Imam Abdullah Rahman',
    senderRole: 'coach',
    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: '4',
    content: 'I\'ve been trying to pray all five prayers, but sometimes I miss Fajr. I really want to be more consistent.',
    senderId: 'player-1',
    senderName: 'You',
    senderRole: 'player',
    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000 + 10 * 60 * 1000),
    read: true,
  },
  {
    id: '5',
    content: 'That\'s completely normal! Let\'s work on building that consistency. I\'ve created your first game focused on establishing a daily prayer routine. Check it out in your progress tab!',
    senderId: 'coach-1',
    senderName: 'Imam Abdullah Rahman',
    senderRole: 'coach',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: '6',
    content: 'Thank you! I just saw it. I\'m going to start working on it right away.',
    senderId: 'player-1',
    senderName: 'You',
    senderRole: 'player',
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: '7',
    content: 'Excellent progress on your prayer routine! I noticed you completed the first bucket. Keep up the great work!',
    senderId: 'coach-1',
    senderName: 'Imam Abdullah Rahman',
    senderRole: 'coach',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    read: true,
  },
];

function ChatAvatar({ name, src, size = 36 }: { name: string; src?: string; size?: number }) {
  const initials = name.charAt(0).toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0, overflow: 'hidden',
      background: `${PORTAL_ACCENT}20`, display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Barlow Condensed', sans-serif", fontSize: size * 0.38, fontWeight: 700, color: PORTAL_ACCENT,
    }}>
      {src ? <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
    </div>
  );
}

export function CoachPlayerChat({
  currentUserId,
  currentUserName,
  currentUserRole,
  otherUserId,
  otherUserName,
  otherUserRole,
  otherUserAvatar,
  category,
  categoryIcon,
  accentColor = PORTAL_ACCENT,
}: CoachPlayerChatProps) {
  const { user } = useAuth();
  // Real chat when signed in and talking to a real profile (UUID); demo otherwise.
  const dbMode = Boolean(user && UUID_RE.test(otherUserId));
  const effectiveUserId = dbMode && user ? user.id : currentUserId;

  const [messages, setMessages] = useState<Message[]>(dbMode ? [] : mockMessages);
  const [messageInput, setMessageInput] = useState('');
  const [isTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const previousMessagesLengthRef = useRef(mockMessages.length);
  const hasInitializedRef = useRef(false);

  const dbToMessage = (m: DbMessage): Message => {
    const mine = m.sender_id === effectiveUserId;
    return {
      id: m.id,
      content: m.body,
      senderId: m.sender_id,
      senderName: mine ? currentUserName : otherUserName,
      senderRole: mine ? currentUserRole : otherUserRole,
      timestamp: new Date(m.created_at),
      read: m.read_at != null,
    };
  };

  useEffect(() => {
    if (!dbMode || !user) return;
    let cancelled = false;
    setMessages([]);
    fetchConversation(user.id, otherUserId)
      .then((rows) => {
        if (!cancelled) setMessages(rows.map(dbToMessage));
      })
      .catch((err) => console.error('Failed to load messages:', err));
    void markConversationRead(user.id, otherUserId).catch(() => {});

    const unsubscribe = subscribeToIncomingMessages(user.id, (m) => {
      if (m.sender_id !== otherUserId) return;
      setMessages((prev) => (prev.some((x) => x.id === m.id) ? prev : [...prev, dbToMessage(m)]));
      void markConversationRead(user.id, otherUserId).catch(() => {});
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dbMode, user?.id, otherUserId]);

  useEffect(() => {
    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;
      previousMessagesLengthRef.current = messages.length;
      return;
    }
    if (messages.length > previousMessagesLengthRef.current) {
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
    previousMessagesLengthRef.current = messages.length;
  }, [messages]);

  const formatTime = (date: Date): string => {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const handleSendMessage = () => {
    const content = messageInput.trim();
    if (!content) return;
    setMessageInput('');

    if (dbMode && user) {
      void sendMessage(user.id, otherUserId, content)
        .then((row) => setMessages((prev) => [...prev, dbToMessage(row)]))
        .catch((err) => console.error('Failed to send message:', err));
      return;
    }

    setMessages((prev) => [...prev, {
      id: Date.now().toString(),
      content,
      senderId: currentUserId,
      senderName: currentUserName,
      senderRole: currentUserRole,
      timestamp: new Date(),
      read: false,
    }]);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const isCurrentUser = (message: Message) => message.senderId === effectiveUserId;

  const renderCategoryIcon = () => {
    if (!categoryIcon) return null;
    if (typeof categoryIcon === 'string') return <span>{categoryIcon}</span>;
    try {
      const IconComponent = categoryIcon;
      return <IconComponent className="w-3 h-3" />;
    } catch {
      return null;
    }
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%',
      background: PORTAL_PANEL_BG, border: `1px solid ${PORTAL_PANEL_BORDER}`, borderRadius: 14, overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px', borderBottom: `1px solid ${PORTAL_PANEL_BORDER}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(255,255,255,0.02)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <ChatAvatar name={otherUserName} src={otherUserAvatar} size={40} />
          <div>
            <h3 style={{ fontFamily: "'Barlow', sans-serif", fontSize: 15, fontWeight: 600, color: PORTAL_TEXT_PRIMARY, margin: 0 }}>
              {otherUserName}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: "'Barlow', sans-serif", fontSize: 12, color: PORTAL_TEXT_DIM, marginTop: 2 }}>
              {renderCategoryIcon()}
              {category && <span>{category}</span>}
              <span>·</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: accentColor }} />
                Active
              </span>
            </div>
          </div>
        </div>
        <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: PORTAL_TEXT_DIM, letterSpacing: 1 }}>
          Private Chat
        </span>
      </div>

      {/* Messages */}
      <div ref={chatContainerRef} style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
        {messages.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', padding: 40 }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: PORTAL_PANEL_BG, border: `1px solid ${PORTAL_PANEL_BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <MessageSquare size={24} style={{ color: PORTAL_TEXT_DIM }} />
            </div>
            <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: PORTAL_TEXT_PRIMARY, margin: '0 0 8px' }}>No messages yet</h3>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: PORTAL_TEXT_MUTED, maxWidth: 320, margin: 0 }}>
              Start the conversation with {otherUserName}.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {messages.map(message => {
              const isCurrent = isCurrentUser(message);
              return (
                <div key={message.id} style={{ display: 'flex', gap: 10, flexDirection: isCurrent ? 'row-reverse' : 'row' }}>
                  {!isCurrent && <ChatAvatar name={otherUserName} src={otherUserAvatar} size={32} />}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: isCurrent ? 'flex-end' : 'flex-start', maxWidth: '72%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: PORTAL_TEXT_DIM }}>{message.senderName}</span>
                      <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>{formatTime(message.timestamp)}</span>
                    </div>
                    <div style={{
                      borderRadius: 14, padding: '10px 14px',
                      background: isCurrent ? `${accentColor}22` : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${isCurrent ? `${accentColor}35` : PORTAL_PANEL_BORDER}`,
                      borderBottomRightRadius: isCurrent ? 4 : 14,
                      borderBottomLeftRadius: isCurrent ? 14 : 4,
                    }}>
                      <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: PORTAL_TEXT_PRIMARY, margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                        {message.content}
                      </p>
                    </div>
                    {isCurrent && (
                      <div style={{ marginTop: 4 }}>
                        {message.read
                          ? <CheckCheck size={12} style={{ color: accentColor }} />
                          : <Check size={12} style={{ color: PORTAL_TEXT_DIM }} />}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {isTyping && (
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <ChatAvatar name={otherUserName} size={32} />
            <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.05)', borderRadius: 14, borderBottomLeftRadius: 4 }}>
              <div style={{ display: 'flex', gap: 4 }}>
                {[0, 150, 300].map(delay => (
                  <div key={delay} style={{ width: 6, height: 6, borderRadius: '50%', background: PORTAL_TEXT_DIM, animation: 'bounce 1s infinite', animationDelay: `${delay}ms` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '16px 20px', borderTop: `1px solid ${PORTAL_PANEL_BORDER}`, background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
          <textarea
            value={messageInput}
            onChange={e => setMessageInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Message ${otherUserName}...`}
            rows={1}
            style={{
              flex: 1, background: PORTAL_INPUT_BG, border: `1px solid ${PORTAL_INPUT_BORDER}`,
              borderRadius: 10, padding: '12px 14px', color: PORTAL_TEXT_PRIMARY,
              fontFamily: "'Barlow', sans-serif", fontSize: 14, outline: 'none', resize: 'none',
              minHeight: 44, maxHeight: 120, boxSizing: 'border-box',
            }}
          />
          <button
            onClick={handleSendMessage}
            disabled={!messageInput.trim()}
            style={{
              background: messageInput.trim() ? accentColor : 'rgba(255,255,255,0.08)',
              border: 'none', borderRadius: 10, padding: 12, cursor: messageInput.trim() ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: messageInput.trim() ? 1 : 0.5,
            }}
            aria-label="Send message"
          >
            <Send size={18} style={{ color: messageInput.trim() ? '#fff' : PORTAL_TEXT_DIM }} />
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
          <div style={{ display: 'flex', gap: 16 }}>
            {[{ Icon: Paperclip, label: 'Attach' }, { Icon: Smile, label: 'Emoji' }].map(({ Icon, label }) => (
              <button key={label} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Barlow', sans-serif", fontSize: 11, color: PORTAL_TEXT_DIM }}>
                <Icon size={13} /> {label}
              </button>
            ))}
          </div>
          <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>End-to-end encrypted</span>
        </div>
      </div>
    </div>
  );
}
