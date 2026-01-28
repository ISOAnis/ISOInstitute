import * as React from 'react';
import { useState, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { LoginModal } from './LoginModal';
import { SignupModal } from './SignupModal';

type Page = 'home' | 'pathways' | 'about' | 'community' | 'coach-portal' | 'player-portal' | 'call-iso' | 'store' | 'for-coaches';
type UserRole = 'coach' | 'player' | 'community-leader';

interface User {
  email: string;
  roles: UserRole[];
}

interface NavigationProps {
  onOpenCommunityPortal?: () => void;
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onMenteeStatusChange?: (status: {
    isCommitted: boolean;
    mentorName?: string;
    category?: string;
    daysRemaining?: number;
  } | null) => void;
}

const STORAGE_KEY = 'iso_demo_user';
const STORAGE_PORTAL_KEY = 'iso_demo_portal';

export function Navigation({ onOpenCommunityPortal, currentPage, onNavigate, onMenteeStatusChange }: NavigationProps) {
  const [user, setUser] = useState<User | null>(null);
  const [showCoachLogin, setShowCoachLogin] = useState(false);
  const [showPlayerLogin, setShowPlayerLogin] = useState(false);
  const [showPortalDropdown, setShowPortalDropdown] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [pendingPortalType, setPendingPortalType] = useState<'player' | 'coach' | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load saved user state from localStorage on mount and sync with changes
  useEffect(() => {
    const checkUserState = () => {
      try {
        const savedUser = localStorage.getItem(STORAGE_KEY);
        
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Failed to load saved user state:', error);
        setUser(null);
      }
    };
    
    // Check on mount
    checkUserState();
    
    // Listen for storage events (from other tabs/windows)
    window.addEventListener('storage', checkUserState);
    
    // Poll localStorage periodically to catch changes in the same tab
    const interval = setInterval(checkUserState, 500);
    
    return () => {
      window.removeEventListener('storage', checkUserState);
      clearInterval(interval);
    };
  }, []);

  const handleCoachLogin = (email: string, password: string) => {
    // Mock authentication - in production, this would call an API
    // For now: all coaches have access to Community Leader Portal
    const roles: UserRole[] = ['coach', 'community-leader'];
    const userData = { email, roles };
    
    setUser(userData);
    setShowCoachLogin(false);
    setShowPortalDropdown(false);
    onNavigate('coach-portal');
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    localStorage.setItem(STORAGE_PORTAL_KEY, 'coach');
  };

  const handlePlayerLogin = (email: string, password: string) => {
    // Mock authentication
    const userData = { email, roles: ['player'] as UserRole[] };
    setUser(userData);
    setShowPlayerLogin(false);
    setShowPortalDropdown(false);
    onNavigate('player-portal');
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    localStorage.setItem(STORAGE_PORTAL_KEY, 'player');
  };

  const handleLogout = () => {
    setUser(null);
    
    // Clear localStorage
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_PORTAL_KEY);
    onNavigate('home');
  };

  // Handle sign out confirmation
  const handleConfirmSignOut = () => {
    handleLogout();
    setShowSignOutModal(false);
    if (pendingPortalType === 'player') {
      setShowPlayerLogin(true);
    } else if (pendingPortalType === 'coach') {
      setShowCoachLogin(true);
    }
    setPendingPortalType(null);
  };

  // Handle cancel sign out
  const handleCancelSignOut = () => {
    setShowSignOutModal(false);
    setPendingPortalType(null);
  };

  return (
    <>
      <nav className="fixed top-4 left-0 right-0 z-[100] flex justify-center px-4">
        <div className="w-full max-w-5xl">
          <div
            className={`flex items-center justify-between rounded-full pl-5 pr-5 py-2 shadow-lg transition-all duration-300 ${
              isScrolled
                ? 'bg-black/90 shadow-black/60 backdrop-blur-[40px]'
                : 'bg-black/65 shadow-black/30 backdrop-blur-[16px]'
            }`}
            style={{ border: '1px solid rgba(255, 255, 255, 0.3)' }}
          >
            <div className="flex items-center pl-4">
              <button 
                onClick={() => onNavigate('home')} 
                className="transition-opacity cursor-pointer"
                onMouseEnter={() => setHoveredItem('logo')}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <span 
                  className="text-white text-lg font-semibold tracking-wide transition-all" 
                  style={{ 
                    fontFamily: "'Bebas Neue', sans-serif",
                    textShadow: hoveredItem === 'logo' ? '0 0 12px rgba(255, 255, 255, 0.8)' : 'none',
                    color: hoveredItem === 'logo' ? '#ffffff' : 'rgba(255, 255, 255, 0.9)'
                  }}
                >
                  ISO Institute
                </span>
              </button>
            </div>
            
            <div className="flex items-center gap-6 text-sm">
              <button 
                onClick={() => onNavigate('pathways')}
                onMouseEnter={() => setHoveredItem('pathways')}
                onMouseLeave={() => setHoveredItem(null)}
                style={{ 
                  color: hoveredItem === 'pathways' || currentPage === 'pathways' ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
                  textShadow: hoveredItem === 'pathways' || currentPage === 'pathways' ? '0 0 12px rgba(255, 255, 255, 0.8)' : 'none',
                  transition: 'all 0.3s ease'
                }}
              >
                For Players
              </button>
              {/* Community tab - temporarily hidden */}
              {false && (
                <button 
                  onClick={() => onNavigate('community')}
                  className={`transition-colors ${currentPage === 'community' ? 'text-white' : 'text-white/70 hover:text-white'}`}
                >
                  Community
                </button>
              )}
              <button 
                onClick={() => onNavigate('for-coaches')}
                onMouseEnter={() => setHoveredItem('for-coaches')}
                onMouseLeave={() => setHoveredItem(null)}
                style={{ 
                  color: hoveredItem === 'for-coaches' || currentPage === 'for-coaches' ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
                  textShadow: hoveredItem === 'for-coaches' || currentPage === 'for-coaches' ? '0 0 12px rgba(255, 255, 255, 0.8)' : 'none',
                  transition: 'all 0.3s ease'
                }}
              >
                For Coaches
              </button>
              <button 
                onClick={() => onNavigate('about')}
                onMouseEnter={() => setHoveredItem('about')}
                onMouseLeave={() => setHoveredItem(null)}
                style={{ 
                  color: hoveredItem === 'about' || currentPage === 'about' ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
                  textShadow: hoveredItem === 'about' || currentPage === 'about' ? '0 0 12px rgba(255, 255, 255, 0.8)' : 'none',
                  transition: 'all 0.3s ease'
                }}
              >
                About
              </button>

              <button 
                onClick={() => onNavigate('store')}
                onMouseEnter={() => setHoveredItem('store')}
                onMouseLeave={() => setHoveredItem(null)}
                style={{ 
                  color: hoveredItem === 'store' || currentPage === 'store' ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
                  textShadow: hoveredItem === 'store' || currentPage === 'store' ? '0 0 12px rgba(255, 255, 255, 0.8)' : 'none',
                  transition: 'all 0.3s ease'
                }}
              >
                Store
              </button>
              
              {/* Portal Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setShowPortalDropdown(!showPortalDropdown)}
                  onBlur={() => setTimeout(() => setShowPortalDropdown(false), 200)}
                  onMouseEnter={() => setHoveredItem('portals')}
                  onMouseLeave={() => setHoveredItem(null)}
                  className="flex items-center gap-1"
                  style={{ 
                    color: hoveredItem === 'portals' || showPortalDropdown || currentPage === 'coach-portal' || currentPage === 'player-portal' ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
                    textShadow: hoveredItem === 'portals' || showPortalDropdown || currentPage === 'coach-portal' || currentPage === 'player-portal' ? '0 0 12px rgba(255, 255, 255, 0.8)' : 'none',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Portals
                  <ChevronDown className={`w-4 h-4 transition-transform ${showPortalDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {showPortalDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-48 border border-white/10 rounded-xl shadow-xl overflow-hidden" style={{ background: '#0a0a0f' }}>
                    <button
                      onClick={() => {
                        const savedPortal = localStorage.getItem(STORAGE_PORTAL_KEY);
                        if (user && savedPortal === 'coach') {
                          onNavigate('coach-portal');
                          setShowPortalDropdown(false);
                        } else if (user && savedPortal === 'player') {
                          // User is logged in as player, show sign out modal
                          setPendingPortalType('coach');
                          setShowSignOutModal(true);
                          setShowPortalDropdown(false);
                        } else {
                          setShowCoachLogin(true);
                          setShowPortalDropdown(false);
                        }
                      }}
                      onMouseEnter={() => setHoveredItem('coach-portal')}
                      onMouseLeave={() => setHoveredItem(null)}
                      className="w-full text-left px-4 py-3 transition-all"
                      style={{
                        color: hoveredItem === 'coach-portal' || currentPage === 'coach-portal' ? '#ffffff' : 'rgba(203, 213, 225, 0.8)',
                        textShadow: hoveredItem === 'coach-portal' || currentPage === 'coach-portal' ? '0 0 12px rgba(255, 255, 255, 0.8)' : 'none',
                        backgroundColor: hoveredItem === 'coach-portal' || currentPage === 'coach-portal' ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
                      }}
                    >
                      Coach Portal
                    </button>
                    <button
                      onClick={() => {
                        const savedPortal = localStorage.getItem(STORAGE_PORTAL_KEY);
                        if (user && savedPortal === 'player') {
                          onNavigate('player-portal');
                          setShowPortalDropdown(false);
                        } else if (user && savedPortal === 'coach') {
                          // User is logged in as coach, show sign out modal
                          setPendingPortalType('player');
                          setShowSignOutModal(true);
                          setShowPortalDropdown(false);
                        } else {
                          setShowPlayerLogin(true);
                          setShowPortalDropdown(false);
                        }
                      }}
                      onMouseEnter={() => setHoveredItem('player-portal')}
                      onMouseLeave={() => setHoveredItem(null)}
                      className="w-full text-left px-4 py-3 transition-all"
                      style={{
                        color: hoveredItem === 'player-portal' || currentPage === 'player-portal' ? '#ffffff' : 'rgba(203, 213, 225, 0.8)',
                        textShadow: hoveredItem === 'player-portal' || currentPage === 'player-portal' ? '0 0 12px rgba(255, 255, 255, 0.8)' : 'none',
                        backgroundColor: hoveredItem === 'player-portal' || currentPage === 'player-portal' ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
                      }}
                    >
                      Player Portal
                    </button>
                    {/* Community Portal - temporarily hidden */}
                    {false && (
                      <button
                        onClick={() => {
                          setShowCoachLogin(true);
                          setShowPortalDropdown(false);
                        }}
                        className="w-full text-left px-4 py-3 text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                      >
                        Community Portal
                      </button>
                    )}
                  </div>
                )}
              </div>
              
              {user ? (
                <button 
                  onClick={handleLogout}
                  className="create-account-btn relative px-6 py-2 rounded-full overflow-hidden ml-2 mr-2"
                >
                  <span className="relative z-10 transition-colors duration-500 inline-block font-medium">Sign Out</span>
                </button>
              ) : (
                <button 
                  onClick={() => setShowPlayerLogin(true)}
                  className="create-account-btn relative px-6 py-2 rounded-full overflow-hidden ml-2 mr-2"
                >
                  <span className="relative z-10 transition-colors duration-500 inline-block font-medium">Log In</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Coach Login Modal */}
      {showCoachLogin && (
        <LoginModal
          title="Coach Portal Sign In"
          onClose={() => setShowCoachLogin(false)}
          onLogin={handleCoachLogin}
          onSignupClick={() => {
            setShowCoachLogin(false);
            setShowSignupModal(true);
          }}
        />
      )}

      {/* Player Login Modal */}
      {showPlayerLogin && (
        <LoginModal
          title="Log In"
          onClose={() => setShowPlayerLogin(false)}
          onLogin={handlePlayerLogin}
          onSignupClick={() => {
            setShowPlayerLogin(false);
            setShowSignupModal(true);
          }}
        />
      )}

      {/* Signup Modal */}
      {showSignupModal && (
        <SignupModal
          onClose={() => setShowSignupModal(false)}
          onSignupComplete={(userData) => {
            console.log('Account created:', userData);
            setShowSignupModal(false);
            const userDataForLogin = { email: userData.email, roles: ['player'] as UserRole[] };
            setUser(userDataForLogin);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(userDataForLogin));
            localStorage.setItem(STORAGE_PORTAL_KEY, 'player');
            onNavigate('player-portal');
          }}
        />
      )}

      {/* Sign Out Confirmation Modal */}
      {showSignOutModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={handleCancelSignOut}>
          <div className="bg-slate-900 rounded-3xl max-w-md w-full p-8 border border-slate-800" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-xl font-semibold">Sign Out Required</h2>
              <button
                onClick={handleCancelSignOut}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-slate-300 mb-8">
              You are currently signed in as a {pendingPortalType === 'player' ? 'coach' : 'player'}. 
              Please sign out to access the {pendingPortalType === 'player' ? 'player' : 'coach'} portal.
            </p>

            <div className="flex gap-4">
              <button
                onClick={handleCancelSignOut}
                className="flex-1 bg-slate-800 text-white py-3 rounded-full hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSignOut}
                className="flex-1 bg-orange-500 text-white py-3 rounded-full hover:bg-orange-600 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}