import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { LoginModal } from './LoginModal';
import { SignupModal } from './SignupModal';
import { RoleSelectionModal } from './RoleSelectionModal';

type Page = 'home' | 'pathways' | 'about' | 'community' | 'coach-portal' | 'player-portal' | 'call-iso';
type UserRole = 'coach' | 'player' | 'community-leader';

interface User {
  email: string;
  roles: UserRole[];
  name?: string;
}

interface NavigationProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const STORAGE_KEY = 'iso_demo_user';
const STORAGE_PORTAL_KEY = 'iso_demo_portal';

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const [user, setUser] = useState<User | null>(null);
  const [showCoachLogin, setShowCoachLogin] = useState(false);
  const [showPlayerLogin, setShowPlayerLogin] = useState(false);
  const [showPortalDropdown, setShowPortalDropdown] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [pendingUserData, setPendingUserData] = useState<{ name: string; email: string; password: string } | null>(null);

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
    const roles: UserRole[] = ['coach', 'community-leader'];
    const userData = { email, roles };
    
    setUser(userData);
    setShowCoachLogin(false);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    localStorage.setItem(STORAGE_PORTAL_KEY, 'coach');
    onNavigate('coach-portal');
  };

  const handlePlayerLogin = (email: string, password: string) => {
    const userData = { email, roles: ['player'] as UserRole[] };
    setUser(userData);
    setShowPlayerLogin(false);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    localStorage.setItem(STORAGE_PORTAL_KEY, 'player');
    onNavigate('player-portal');
  };

  return (
    <>
      <nav className="fixed top-4 left-0 right-0 z-[110] flex justify-center px-4">
        <div className="w-full max-w-6xl">
          <div className="flex items-center justify-between rounded-full border border-[#1e212c] bg-[#11131c]/95 px-7 py-3 shadow-[0_25px_65px_rgba(5,5,12,0.9)] backdrop-blur-2xl transition-all duration-300">
            <div className="flex items-center gap-3">
              <button onClick={() => onNavigate('home')} className="flex items-center gap-3 group hover:opacity-80 transition-opacity cursor-pointer">
                <img 
                  src="/ISOV1Logo.jpg" 
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
            
            <div className="flex items-center gap-6 text-sm font-medium">
              <button 
                onClick={() => onNavigate('pathways')}
                className={`transition-colors ${
                  currentPage === 'pathways'
                    ? 'text-[#9BFF7E]'
                    : 'text-slate-200 hover:text-white active:text-white active:opacity-80'
                }`}
              >
                Pathways
              </button>
              {/* Community tab - temporarily hidden */}
              {false && (
              <button 
                onClick={() => onNavigate('community')}
                className={`transition-colors ${
                  currentPage === 'community'
                    ? 'text-[#9BFF7E]'
                    : 'text-slate-200 hover:text-white active:text-white active:opacity-80'
                }`}
              >
                Community
              </button>
              )}
              <button 
                onClick={() => onNavigate('about')}
                className={`transition-colors ${
                  currentPage === 'about'
                    ? 'text-[#9BFF7E]'
                    : 'text-slate-200 hover:text-white active:text-white active:opacity-80'
                }`}
              >
                About
              </button>
              
              {/* Portal Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setShowPortalDropdown(!showPortalDropdown)}
                  onBlur={() => setTimeout(() => setShowPortalDropdown(false), 200)}
                  className={`flex items-center gap-1 transition-colors ${
                    showPortalDropdown ? 'text-[#9BFF7E]' : 'text-slate-200 hover:text-white active:text-white active:opacity-80'
                  }`}
                >
                  Portals
                  <ChevronDown className={`w-4 h-4 transition-transform ${showPortalDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {showPortalDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-[#151721] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
                    <button
                      onClick={() => {
                        setShowCoachLogin(true);
                        setShowPortalDropdown(false);
                      }}
                      className="w-full text-left px-4 py-3 text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                      Coach Portal
                    </button>
                    <button
                      onClick={() => {
                        setShowPlayerLogin(true);
                        setShowPortalDropdown(false);
                      }}
                      className="w-full text-left px-4 py-3 text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
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
            setPendingUserData(userData);
            setShowRoleSelection(true);
          }}
        />
      )}

      {/* Role Selection Modal */}
      {showRoleSelection && pendingUserData && (
        <RoleSelectionModal
          onClose={() => {
            setShowRoleSelection(false);
            setPendingUserData(null);
          }}
          onSelectRole={(role) => {
            setShowRoleSelection(false);
            const userDataForLogin = { 
              email: pendingUserData.email, 
              roles: [role] as UserRole[],
              name: pendingUserData.name
            };
            setUser(userDataForLogin);
            
            // Save to localStorage
            localStorage.setItem(STORAGE_KEY, JSON.stringify(userDataForLogin));
            localStorage.setItem(STORAGE_PORTAL_KEY, role);
            
            onNavigate(role === 'coach' ? 'coach-portal' : 'player-portal');
            
            setPendingUserData(null);
          }}
          userName={pendingUserData.name}
        />
      )}
    </>
  );
}