import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { MentorPortal } from './MentorPortal';
import { MenteePortal } from './MenteePortal';
import { CoachPortal } from './CoachPortal';
import { CommunityLeaderPortal } from './CommunityLeaderPortal';
import { LoginModal } from './LoginModal';
import { SignupModal } from './SignupModal';

type Page = 'home' | 'pathways' | 'about' | 'community';
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

export function Navigation({ onOpenCommunityPortal, currentPage, onNavigate, onMenteeStatusChange }: NavigationProps) {
  const [user, setUser] = useState<User | null>(null);
  const [showCoachLogin, setShowCoachLogin] = useState(false);
  const [showPlayerLogin, setShowPlayerLogin] = useState(false);
  const [showCoachPortal, setShowCoachPortal] = useState(false);
  const [showPlayerPortal, setShowPlayerPortal] = useState(false);
  const [showCommunityPortal, setShowCommunityPortal] = useState(false);
  const [showPortalDropdown, setShowPortalDropdown] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  const handleCoachLogin = (email: string, password: string) => {
    // Mock authentication - in production, this would call an API
    // For now: all coaches have access to Community Leader Portal
    const roles: UserRole[] = ['coach', 'community-leader'];
    
    setUser({ email, roles });
    setShowCoachLogin(false);
    setShowCoachPortal(true);
  };

  const handlePlayerLogin = (email: string, password: string) => {
    // Mock authentication
    setUser({ email, roles: ['player'] });
    setShowPlayerLogin(false);
    setShowPlayerPortal(true);
  };

  const handleLogout = () => {
    setUser(null);
    setShowCoachPortal(false);
    setShowPlayerPortal(false);
    setShowCommunityPortal(false);
  };

  const switchToCommunityPortal = () => {
    setShowCoachPortal(false);
    setShowCommunityPortal(true);
  };

  const switchToCoachPortal = () => {
    setShowCommunityPortal(false);
    setShowCoachPortal(true);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-slate-950/95 backdrop-blur-sm z-[100] border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
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
                <div className="text-left"> 
                  <span className="text-white block tracking-wider font-bold">ISO</span> 
                  <span className="text-slate-400 text-xs tracking-wide">In Search Of</span> 
                </div>
              </button>
            </div>
            
            <div className="flex items-center gap-6">
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
                  className={`transition-colors ${currentPage === 'community' ? 'text-white' : 'text-slate-400 hover:text-white'}`}
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

      {/* Coach Portal Modal */}
      {showCoachPortal && user && (
        <div className="fixed inset-0 z-[100]">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleLogout} />
          <div className="relative z-[101] h-full overflow-auto">
            <div className="min-h-full py-8">
              <div className="max-w-7xl mx-auto">
                <div className="fixed top-4 right-4 flex gap-2 z-[102]">
                  {/* Community Portal switch - temporarily hidden */}
                  {false && user.roles.includes('community-leader') && (
                    <button
                      onClick={switchToCommunityPortal}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full transition-colors"
                    >
                      Switch to Community Portal
                    </button>
                  )}
                  <button
                    onClick={handleLogout}
                    className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-full transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
                <CoachPortal />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Player Portal Modal */}
      {showPlayerPortal && user && (
        <div className="fixed inset-0 z-[100]">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleLogout} />
          <div className="relative z-[101] h-full overflow-auto">
            <div className="min-h-full py-8">
              <div className="max-w-7xl mx-auto">
                <button
                  onClick={handleLogout}
                  className="fixed top-4 right-4 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-full transition-colors z-[102]"
                >
                  Sign Out
                </button>
                <MenteePortal />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Community Leader Portal Modal - temporarily hidden */}
      {false && showCommunityPortal && user && (
        <div className="fixed inset-0 z-[100]">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleLogout} />
          <div className="relative z-[101] h-full overflow-auto">
            <div className="min-h-full py-8">
              <div className="max-w-7xl mx-auto">
                <div className="fixed top-4 right-4 flex gap-2 z-[102]">
                  {user.roles.includes('coach') && (
                    <button
                      onClick={switchToCoachPortal}
                      className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-full transition-colors"
                    >
                      Switch to Coach Portal
                    </button>
                  )}
                  <button
                    onClick={handleLogout}
                    className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-full transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
                <CommunityLeaderPortal />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {showSignupModal && (
        <SignupModal
          onClose={() => setShowSignupModal(false)}
          onSignupComplete={(userData) => {
            console.log('Account created:', userData);
            setShowSignupModal(false);
            // TODO: Handle successful signup (e.g., log user in, redirect, etc.)
          }}
        />
      )}
    </>
  );
}