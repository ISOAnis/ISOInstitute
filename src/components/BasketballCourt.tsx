import * as React from 'react';
import { useState, useEffect } from 'react';
import { CategoryBubble } from './CategoryBubble';
import { MentorModal } from './MentorModal';
import { SignupModal } from './SignupModal';
import { Lock, Clock, Moon, Dumbbell, Activity, Settings, Rocket, Globe } from 'lucide-react';

interface CommitmentStatus {
  isCommitted: boolean;
  mentorName?: string;
  category?: string;
  daysRemaining?: number;
}

interface BasketballCourtProps {
  commitmentStatus?: CommitmentStatus | null;
  onNavigateToCallIso?: (coachName: string, categoryId?: string) => void;
  selectedCategoryId?: string | null;
  onCategorySelect?: (categoryId: string) => void;
  forceOpenCategoryId?: string | null;
  onForceOpenHandled?: () => void;
}

const categories = [
  {
    id: 'deen',
    title: 'Deen & Purpose',
    icon: Moon,
    iconName: 'Moon',
    description: 'Spiritual development, Islamic knowledge, reflection, and balance between dunya and akhirah. This is the core of all growth — everything flows from this center.',
    tagline: '"Center your faith before your function."',
    color: 'from-emerald-500 to-teal-600',
    position: { bottom: '12%', left: '50%', transform: 'translateX(-50%)' },
    zIndex: 10,
  },
  {
    id: 'health',
    title: 'Health & Fitness',
    icon: Dumbbell,
    iconName: 'Dumbbell',
    description: 'Discipline through the body — physical wellness, gym consistency, mental health, nutrition, and self-discipline.',
    tagline: '"Train your body. Strengthen your mind."',
    color: 'from-red-500 to-rose-600',
    position: { bottom: '20%', right: '20%' },
    zIndex: 10,
  },
  {
    id: 'medicine',
    title: 'Medicine & Healthcare',
    icon: Activity,
    iconName: 'Activity',
    description: 'Serving through healing — for those exploring pre-med, nursing, public health, or medical professions.',
    tagline: '"Serve through science and compassion."',
    color: 'from-blue-500 to-cyan-600',
    position: { top: '20%', right: '14%' },
    zIndex: 10,
  },
  {
    id: 'engineering',
    title: 'Engineering & Technology',
    icon: Settings,
    iconName: 'Settings',
    description: 'Building and solving — for innovators in STEM and design who want to leave a real-world impact.',
    tagline: '"Design, build, and solve for tomorrow."',
    color: 'from-purple-500 to-indigo-600',
    position: { top: '8%', left: '50%', transform: 'translateX(-50%)' },
    zIndex: 10,
  },
  {
    id: 'entrepreneurship',
    title: 'Entrepreneurship & Business',
    icon: Rocket,
    iconName: 'Rocket',
    description: 'For builders, dreamers, and leaders turning ideas into reality — from startups to social ventures.',
    tagline: '"Build something that outlasts you."',
    color: 'from-orange-500 to-amber-600',
    position: { top: '20%', left: '14%' },
    zIndex: 10,
  },
  {
    id: 'global',
    title: 'Global Affairs, Law, & Policy',
    icon: Globe,
    iconName: 'Globe',
    description: 'For those navigating global impact — economics, diplomacy, international organizations, and ethical leadership.',
    tagline: '"Lead globally. Move with purpose."',
    color: 'from-indigo-500 to-blue-600',
    position: { bottom: '20%', left: '20%' },
    zIndex: 10,
  },
];

export function BasketballCourt({ commitmentStatus, onNavigateToCallIso, selectedCategoryId, onCategorySelect, forceOpenCategoryId, onForceOpenHandled }: BasketballCourtProps) {
  const [selectedCategory, setSelectedCategory] = useState<typeof categories[0] | null>(null);

  // Restore selected category when coming back from Call ISO page
  useEffect(() => {
    if (selectedCategoryId) {
      const category = categories.find(c => c.id === selectedCategoryId);
      if (category && (!selectedCategory || selectedCategory.id !== category.id)) {
        setSelectedCategory(category);
      }
    }
  }, [selectedCategoryId, selectedCategory]);
  const [showCommitmentWarning, setShowCommitmentWarning] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  // Check localStorage for saved login state
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {
      const savedUser = localStorage.getItem('iso_demo_user');
      return savedUser !== null;
    } catch {
      return false;
    }
  });
  const [hoveredCategoryId, setHoveredCategoryId] = useState<string | null>(null);
  
  // Update login state when localStorage changes (e.g., user logs in/out in another component)
  useEffect(() => {
    const checkLoginState = () => {
      try {
        const savedUser = localStorage.getItem('iso_demo_user');
        setIsLoggedIn(savedUser !== null);
      } catch {
        setIsLoggedIn(false);
      }
    };
    
    // Check on mount and when component becomes visible
    checkLoginState();
    
    // Listen for storage changes (in case user logs in/out in another tab or component)
    window.addEventListener('storage', checkLoginState);
    
    // Also check periodically in case localStorage was updated in same window
    const interval = setInterval(checkLoginState, 500);
    
    return () => {
      window.removeEventListener('storage', checkLoginState);
      clearInterval(interval);
    };
  }, []);

  // Add staggered bounce animation for arrows
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes staggered-bounce {
        0%, 20%, 50%, 80%, 100% {
          transform: translateY(0);
        }
        40% {
          transform: translateY(-10px);
        }
        60% {
          transform: translateY(-5px);
        }
      }
      
      .court-arrow-1 {
        animation: staggered-bounce 1.5s ease-in-out 0s infinite;
      }
      
      .court-arrow-2 {
        animation: staggered-bounce 1.5s ease-in-out 0.2s infinite;
      }
      
      .court-arrow-3 {
        animation: staggered-bounce 1.5s ease-in-out 0.4s infinite;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  const handleCategoryClick = (category: typeof categories[0]) => {
    if (commitmentStatus?.isCommitted) {
      setShowCommitmentWarning(true);
    } else if (!isLoggedIn) {
      setShowSignupModal(true);
      // Store the category they wanted to see for after signup
      setSelectedCategory(category);
    } else {
      setSelectedCategory(category);
    }
  };

  const handleSignupComplete = (userData: any) => {
    console.log('User signed up:', userData);
    
    // Save to localStorage to persist login state (same as Navigation component)
    try {
      const userDataForLogin = { email: userData.email, roles: ['player'] as any[] };
      localStorage.setItem('iso_demo_user', JSON.stringify(userDataForLogin));
      localStorage.setItem('iso_demo_portal', 'player');
    } catch (error) {
      console.error('Failed to save user to localStorage:', error);
    }
    
    setIsLoggedIn(true);
    setShowSignupModal(false);
    // selectedCategory is already set, so the MentorModal will open automatically
  };

  useEffect(() => {
    if (forceOpenCategoryId) {
      const category = categories.find(c => c.id === forceOpenCategoryId);
      if (category) {
        setIsLoggedIn(true);
        setSelectedCategory(category);
        if (onForceOpenHandled) {
          onForceOpenHandled();
        }
      }
    }
  }, [forceOpenCategoryId, onForceOpenHandled]);

  return (
    <>
      <section id="iso-court" className="pt-4 pb-20 px-4 sm:px-6 lg:px-8 bg-slate-1050">
        <div className="max-w-7xl mx-auto">

          <div className="relative aspect-[20/12] max-w-7xl mx-auto">
            {/* Basketball Court SVG - Half Court */}
            <svg 
              viewBox="0 0 800 600" 
              className="w-full h-full"
              style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))' }}
            >
              {/* Court background */}
              <rect x="0" y="50" width="800" height="540" fill="#1e293b" rx="8" />
              
              {/* Court lines */}
              <g stroke="#475569" strokeWidth="3" fill="none">
                {/* Outer boundary */}
                <rect x="10" y="60" width="780" height="520" rx="4" />
                
                {/* Key/paint area */}
                <rect x="310" y="60" width="180" height="290" />
                
                {/* Free throw circle */}
                <circle cx="400" cy="350" r="60" />
                
                {/* Three-point line - wide arc tangent to free throw circle, centered at hoop */}
                <path d="M 140 60 L 140 225 A 225 175 0 0 0 660 225 L 660 60" strokeWidth="3" />
                
                {/* Hoop backboard */}
                <line x1="350" y1="60" x2="450" y2="60" strokeWidth="4" stroke="#475569" />
                <circle cx="400" cy="85" r="15" fill="none" strokeWidth="3" />
              </g>
            </svg>

            {/* Category Bubbles */}
            {categories.map((category) => (
              <div
                key={category.id}
                onMouseEnter={() => setHoveredCategoryId(category.id)}
                onMouseLeave={() => setHoveredCategoryId(null)}
              >
                <CategoryBubble
                category={category}
                onClick={() => handleCategoryClick(category)}
                isSelected={selectedCategory?.id === category.id}
                  isOtherHovered={hoveredCategoryId !== null && hoveredCategoryId !== category.id}
              />
              </div>
            ))}

            {/* Lock Overlay when in commitment period */}
            {commitmentStatus?.isCommitted && (
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <div className="bg-slate-900 border-2 border-orange-500/50 rounded-2xl p-8 max-w-lg mx-4 text-center">
                  <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-8 h-8 text-orange-400" />
                  </div>
                  <h3 className="text-white mb-3">Commitment Period Active</h3>
                  <p className="text-slate-400 mb-4">
                    You're currently committed to <span className="text-orange-400">{commitmentStatus.category}</span> with {commitmentStatus.mentorName}.
                  </p>
                  <div className="flex items-center justify-center gap-2 text-slate-400 mb-6">
                    <Clock className="w-5 h-5" />
                    <span>{commitmentStatus.daysRemaining} days remaining until you can explore other pathways</span>
                  </div>
                  <p className="text-slate-500 text-sm">
                    This ensures you stay focused and give your mentorship the commitment it deserves. 
                    Check your Player Portal to track your progress!
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>
      </section>

      {selectedCategory && !commitmentStatus?.isCommitted && isLoggedIn && (
        <MentorModal
          category={selectedCategory}
          onClose={() => {
            setSelectedCategory(null);
            if (onCategorySelect) {
              onCategorySelect('');
            }
          }}
          onNavigateToCallIso={onNavigateToCallIso}
        />
      )}

      {/* Commitment Warning Modal */}
      {showCommitmentWarning && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          onClick={() => setShowCommitmentWarning(false)}
        >
          <div 
            className="bg-slate-900 rounded-3xl max-w-md w-full p-8 border-2 border-orange-500/50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-orange-400" />
            </div>
            <h3 className="text-white text-center mb-4">Already Committed</h3>
            <p className="text-slate-400 text-center mb-6">
              You're currently working with {commitmentStatus?.mentorName} in <span className="text-orange-400">{commitmentStatus?.category}</span>. 
              Complete your 30-day commitment period before exploring other pathways.
            </p>
            <button
              onClick={() => setShowCommitmentWarning(false)}
              className="w-full bg-orange-500 text-white py-3 rounded-full hover:bg-orange-600 transition-colors"
            >
              Got It
            </button>
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {showSignupModal && (
        <SignupModal
          onClose={() => setShowSignupModal(false)}
          onSignupComplete={handleSignupComplete}
        />
      )}
    </>
  );
}
