import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { LoginModal } from './LoginModal';
import { SignupModal } from './SignupModal';

type Page = 'home' | 'pathways' | 'about' | 'community' | 'coach-portal' | 'player-portal' | 'call-iso';
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
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load saved user state from localStorage on mount (but don't auto-open portals)
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEY);
      
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        // Don't auto-open portals on page load - user must manually click to open
      }
    } catch (error) {
      console.error('Failed to load saved user state:', error);
    }
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

  return (
    <>
      <nav className="fixed top-4 left-0 right-0 z-[100] flex justify-center px-4">
        <div className="w-full max-w-5xl">
          <div
            className={`flex items-center justify-between rounded-full border px-5 py-2 shadow-lg transition-all duration-300 ${
              isScrolled
                ? 'border-slate-800 bg-black/90 shadow-black/60 backdrop-blur-[40px]'
                : 'border-slate-800 bg-black/65 shadow-black/30 backdrop-blur-[16px]'
            }`}
          >
            <div className="flex items-center gap-3">
              <button onClick={() => onNavigate('home')} className="flex items-center gap-3 group hover:opacity-80 transition-opacity cursor-pointer">
                <img 
                  src="/ISO-logo-v2.jpg" 
                  alt="ISO Logo" 
                  className="h-10 w-auto object-contain cursor-pointer" onClick={() => onNavigate('home')} 
                  onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => { 
                    const target = e.currentTarget; 
                    target.style.display = 'none'; 
                    const fallback = target.nextElementSibling as HTMLElement; 
                    if (fallback) { 
                      fallback.style.display = 'flex'; 
                    } 
                  }} 
                /> 
                <div 
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:shadow-orange-500/40 transition-shadow" 
                  style={{ display: 'none' }} 
                > 
                  <span className="text-white text-lg">☪️</span> 
                </div> 
                <span className="text-white text-lg font-semibold tracking-wide" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  ISO Institute
                </span>
              </button>
            </div>
            
            <div className="flex items-center gap-6 text-sm">
              <button 
                onClick={() => onNavigate('pathways')}
                className={`transition-colors ${currentPage === 'pathways' ? 'text-white' : 'text-slate-400 hover:text-white'}`}
              >
                Pathways
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
                onClick={() => onNavigate('about')}
                className={`transition-colors ${currentPage === 'about' ? 'text-white' : 'text-slate-400 hover:text-white'}`}
              >
                About
              </button>
              
              {/* Portal Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setShowPortalDropdown(!showPortalDropdown)}
                  onBlur={() => setTimeout(() => setShowPortalDropdown(false), 200)}
                  className="text-slate-400 hover:text-white transition-colors flex items-center gap-1"
                >
                  Portals
                  <ChevronDown className={`w-4 h-4 transition-transform ${showPortalDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {showPortalDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden">
                    <button
                      onClick={() => {
                        setShowCoachLogin(true);
                        setShowPortalDropdown(false);
                      }}
                      className="w-full text-left px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                      Coach Portal
                    </button>
                    <button
                      onClick={() => {
                        setShowPlayerLogin(true);
                        setShowPortalDropdown(false);
                      }}
                      className="w-full text-left px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
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
                        className="w-full text-left px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                      >
                        Community Portal
                      </button>
                    )}
                  </div>
                )}
              </div>
              
              <button 
                onClick={() => setShowSignupModal(true)}
                className="create-account-btn relative bg-orange-500 text-white px-6 py-2 rounded-full overflow-hidden"
              >
                <span className="relative z-10 transition-colors duration-500 inline-block">Create an Account</span>
              </button>
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
        />
      )}

      {/* Player Login Modal */}
      {showPlayerLogin && (
        <LoginModal
          title="Player Portal Sign In"
          onClose={() => setShowPlayerLogin(false)}
          onLogin={handlePlayerLogin}
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
    </>
  );
}