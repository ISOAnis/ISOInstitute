import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Smile, Check, CheckCheck, Clock, User, MessageSquare } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderRole: 'mentor' | 'mentee';
  timestamp: Date;
  read: boolean;
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
  }>;
}

type CategoryIconType = string | React.ComponentType<{ className?: string }>;

interface MentorMenteeChatProps {
  currentUserId: string;
  currentUserName: string;
  currentUserRole: 'mentor' | 'mentee';
  otherUserId: string;
  otherUserName: string;
  otherUserRole: 'mentor' | 'mentee';
  otherUserAvatar?: string;
  category?: string;
  categoryIcon?: CategoryIconType;
}

// Mock messages - in production this would come from backend
const mockMessages: Message[] = [
  {
    id: '1',
    content: 'Assalamu alaikum! Welcome to our coaching journey. I\'m excited to work with you.',
    senderId: 'mentor-1',
    senderName: 'Imam Abdullah Rahman',
    senderRole: 'mentor',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: '2',
    content: 'Wa alaikum assalam! Thank you so much. I\'m really looking forward to learning from you.',
    senderId: 'mentee-1',
    senderName: 'You',
    senderRole: 'mentee',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000),
    read: true,
  },
  {
    id: '3',
    content: 'Great! Let\'s start by setting up your daily prayer routine. How are you doing with your current prayer schedule?',
    senderId: 'mentor-1',
    senderName: 'Imam Abdullah Rahman',
    senderRole: 'mentor',
    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: '4',
    content: 'I\'ve been trying to pray all five prayers, but sometimes I miss Fajr. I really want to be more consistent.',
    senderId: 'mentee-1',
    senderName: 'You',
    senderRole: 'mentee',
    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000 + 10 * 60 * 1000),
    read: true,
  },
  {
    id: '5',
    content: 'That\'s completely normal! Let\'s work on building that consistency. I\'ve created your first game focused on establishing a daily prayer routine. Check it out in your progress tab!',
    senderId: 'mentor-1',
    senderName: 'Imam Abdullah Rahman',
    senderRole: 'mentor',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: '6',
    content: 'Thank you! I just saw it. I\'m going to start working on it right away.',
    senderId: 'mentee-1',
    senderName: 'You',
    senderRole: 'mentee',
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: '7',
    content: 'Excellent progress on your prayer routine! I noticed you completed the first bucket. Keep up the great work! 🎉',
    senderId: 'mentor-1',
    senderName: 'Imam Abdullah Rahman',
    senderRole: 'mentor',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    read: true,
  },
];

export function MentorMenteeChat({
  currentUserId,
  currentUserName,
  currentUserRole,
  otherUserId,
  otherUserName,
  otherUserRole,
  otherUserAvatar,
  category,
  categoryIcon,
}: MentorMenteeChatProps) {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const previousMessagesLengthRef = useRef(mockMessages.length);
  const hasInitializedRef = useRef(false);

  // Auto-scroll to bottom only when new messages are added (not on mount or tab switch)
  useEffect(() => {
    // Skip auto-scroll on initial mount
    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;
      previousMessagesLengthRef.current = messages.length;
      return;
    }

    // Only scroll if message count increased (new message added)
    if (messages.length > previousMessagesLengthRef.current) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
    
    previousMessagesLengthRef.current = messages.length;
  }, [messages]);

  const formatTime = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
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
    if (!messageInput.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: messageInput.trim(),
      senderId: currentUserId,
      senderName: currentUserName,
      senderRole: currentUserRole,
      timestamp: new Date(),
      read: false,
    };

    setMessages([...messages, newMessage]);
    setMessageInput('');

    // Simulate typing indicator from other user (optional)
    // In production, this would be handled by WebSocket or similar
    setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const isCurrentUser = (message: Message) => message.senderId === currentUserId;

  const renderCategoryIcon = () => {
    if (!categoryIcon) return null;
    if (typeof categoryIcon === 'string') {
      return <span>{categoryIcon}</span>;
    }
    try {
      const IconComponent = categoryIcon;
      return <IconComponent className="w-3 h-3 text-slate-400" />;
    } catch (error) {
      console.error('Failed to render category icon:', error);
      return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 rounded-2xl overflow-hidden border border-slate-800">
      {/* Chat Header */}
      <div className="bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={otherUserAvatar} alt={otherUserName} />
            <AvatarFallback className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
              {otherUserName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-white font-semibold">{otherUserName}</h3>
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              {renderCategoryIcon()}
              {category && <span>{category}</span>}
              <span>•</span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Active
              </span>
            </div>
          </div>
        </div>
        <div className="text-slate-500 text-xs">
          Private Chat
        </div>
      </div>

      {/* Messages Area */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950"
        style={{ scrollBehavior: 'auto' }}
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="w-8 h-8 text-slate-500" />
            </div>
            <h3 className="text-white font-semibold mb-2">No messages yet</h3>
            <p className="text-slate-400 text-sm max-w-md">
              Start the conversation with {otherUserName}. This is a private, secure channel for your coaching communication.
            </p>
          </div>
        ) : (
          messages.map((message) => {
            const isCurrent = isCurrentUser(message);
            return (
              <div
                key={message.id}
                className={`flex gap-3 ${isCurrent ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                {!isCurrent && (
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarImage src={otherUserAvatar} alt={otherUserName} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xs">
                      {otherUserName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                )}

                {/* Message Content */}
                <div className={`flex flex-col ${isCurrent ? 'items-end' : 'items-start'} max-w-[70%]`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-slate-400 text-xs">{message.senderName}</span>
                    <span className="text-slate-600 text-xs">{formatTime(message.timestamp)}</span>
                  </div>
                  <div
                    className={`rounded-2xl px-4 py-2 ${
                      isCurrent
                        ? 'bg-orange-500 text-white rounded-br-sm'
                        : 'bg-slate-800 text-slate-100 rounded-bl-sm'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                  </div>
                  {isCurrent && (
                    <div className="flex items-center gap-1 mt-1">
                      {message.read ? (
                        <CheckCheck className="w-3 h-3 text-blue-400" />
                      ) : (
                        <Check className="w-3 h-3 text-slate-500" />
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex gap-3">
            <Avatar className="w-8 h-8 flex-shrink-0">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xs">
                {otherUserName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="bg-slate-800 rounded-2xl rounded-bl-sm px-4 py-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t border-slate-800 bg-slate-900 p-4">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Message ${otherUserName}...`}
              rows={1}
              className="w-full bg-slate-800 text-white rounded-xl px-4 py-3 border border-slate-700 focus:border-orange-500 focus:outline-none resize-none max-h-32 overflow-y-auto"
              style={{ minHeight: '44px' }}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!messageInput.trim()}
            className="bg-orange-500 text-white p-3 rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            aria-label="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 hover:text-slate-400 transition-colors">
              <Paperclip className="w-4 h-4" />
              <span>Attach</span>
            </button>
            <button className="flex items-center gap-1 hover:text-slate-400 transition-colors">
              <Smile className="w-4 h-4" />
              <span>Emoji</span>
            </button>
          </div>
          <span className="text-slate-600">End-to-end encrypted</span>
        </div>
      </div>
    </div>
  );
}

