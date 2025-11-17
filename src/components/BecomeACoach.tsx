import { useState, useEffect, useRef } from 'react';
import { ArrowRight, Sparkles, TrendingUp, Users, Video, Award, Clock, Zap, ChevronRight, Star } from 'lucide-react';

export function BecomeACoach() {
  const [hoveredTier, setHoveredTier] = useState<string | null>(null);
  const [hoveredBadge, setHoveredBadge] = useState<string | null>(null);
  const [expandedTier, setExpandedTier] = useState<string | null>(null);
  const [selectedRange, setSelectedRange] = useState<'70-79' | '80-89' | '90-99' | null>(null);
  
  // Scroll animation states
  const [isVisible, setIsVisible] = useState({
    hero: false,
    why: false,
    structure: false,
    experience: false,
    isoRank: false,
    startingLevel: false,
    cta: false,
  });

  // Animated counter states
  const [counterValues, setCounterValues] = useState({
    coaches: 0,
    mentees: 0,
    sessions: 0,
  });

  const heroRef = useRef<HTMLDivElement>(null);
  const whyRef = useRef<HTMLDivElement>(null);
  const structureRef = useRef<HTMLDivElement>(null);
  const experienceRef = useRef<HTMLDivElement>(null);
  const isoRankRef = useRef<HTMLDivElement>(null);
  const startingLevelRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const section = entry.target.getAttribute('data-section');
          if (section) {
            setIsVisible(prev => ({ ...prev, [section]: true }));
          }
        }
      });
    }, observerOptions);

    const refs = [
      { ref: heroRef, section: 'hero' },
      { ref: whyRef, section: 'why' },
      { ref: structureRef, section: 'structure' },
      { ref: experienceRef, section: 'experience' },
      { ref: isoRankRef, section: 'isoRank' },
      { ref: startingLevelRef, section: 'startingLevel' },
      { ref: ctaRef, section: 'cta' },
    ];

    const timeoutId = setTimeout(() => {
      refs.forEach(({ ref, section }) => {
        if (ref.current) {
          ref.current.setAttribute('data-section', section);
          observer.observe(ref.current);
        }
      });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []);

  // Animated counter effect
  useEffect(() => {
    if (isVisible.why) {
      const duration = 2000;
      const steps = 60;
      const interval = duration / steps;

      let currentStep = 0;
      const targets = { coaches: 150, mentees: 500, sessions: 1200 };

      const timer = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        
        setCounterValues({
          coaches: Math.floor(targets.coaches * progress),
          mentees: Math.floor(targets.mentees * progress),
          sessions: Math.floor(targets.sessions * progress),
        });

        if (currentStep >= steps) {
          clearInterval(timer);
          setCounterValues(targets);
        }
      }, interval);

      return () => clearInterval(timer);
    }
  }, [isVisible.why]);

  const tiers = [
    {
      name: 'Entry',
      description: 'Starting your coaching journey with foundational experience.',
      startingOverall: '70-75',
      badge: 'Standard',
      gradient: 'from-slate-600 to-slate-700',
      icon: '🎯',
      examples: ['Recent graduates', 'Early career professionals', 'New to coaching'],
    },
    {
      name: 'Pro',
      description: 'Established professionals with proven track records in their field.',
      startingOverall: '76-80',
      badge: 'Standard/Specialist Provisional',
      gradient: 'from-orange-500 to-orange-600',
      icon: '⭐',
      examples: ['5+ years experience', 'Industry recognition', 'Strong network'],
    },
    {
      name: 'Expert',
      description: 'Recognized leaders with extensive experience and industry expertise.',
      startingOverall: '81-88',
      badge: 'Specialist Provisional',
      gradient: 'from-orange-600 to-orange-700',
      icon: '🏆',
      examples: ['10+ years experience', 'Senior roles', 'Thought leadership'],
    },
    {
      name: 'Master',
      description: 'Elite professionals who have achieved mastery and are recognized as top-tier coaches.',
      startingOverall: '81-88',
      badge: 'Specialist Provisional',
      gradient: 'from-orange-700 via-orange-600 to-orange-700',
      icon: '👑',
      examples: ['15+ years experience', 'C-suite executives', 'Industry pioneers'],
    },
  ];

  const badges = [
    {
      name: 'Standard',
      range: '70-79',
      description: 'Entry-level coaches',
      gradient: 'from-slate-600 to-slate-700',
      borderColor: 'border-slate-600',
      features: ['Basic profile', 'Pathway access', 'Monthly check-ins'],
    },
    {
      name: 'Specialist',
      range: '80-89',
      description: 'Proven impact',
      gradient: 'from-orange-500 to-orange-600',
      borderColor: 'border-orange-500',
      features: ['Enhanced visibility', 'Priority matching', 'Workshop access'],
    },
    {
      name: 'Premium',
      range: '90-99',
      description: 'Elite coaching',
      gradient: 'from-orange-500 via-orange-600 to-orange-700',
      borderColor: 'border-orange-500',
      features: ['Featured placement', 'Exclusive events', 'Leadership opportunities'],
    },
  ];

  const waysToIncrease = [
    { icon: Users, text: 'Coaching nights participation and leadership', points: '+5-15' },
    { icon: Video, text: 'Adding videos to The Locker Room', points: '+3-10' },
    { icon: Sparkles, text: 'Community contribution and engagement', points: '+2-8' },
    { icon: Clock, text: 'Completing sessions with players', points: '+5-12' },
    { icon: Award, text: 'Receiving positive reviews', points: '+3-10' },
    { icon: TrendingUp, text: 'Hosting and leading workshops', points: '+8-20' },
    { icon: Zap, text: 'Consistent activity and engagement over time', points: '+1-5/mo' },
  ];

  const rangeDetails = {
    '70-79': {
      title: 'Standard Coach',
      description: 'Building your ISO presence and establishing your coaching foundation.',
      activities: ['Complete onboarding', 'Attend coaching nights', 'Connect with first players'],
      nextMilestone: 'Reach 80+ for Specialist badge',
    },
    '80-89': {
      title: 'Specialist Coach',
      description: 'Demonstrating consistent impact and value to the ISO community.',
      activities: ['Lead workshops', 'Create Locker Room content', 'Coach multiple pathways'],
      nextMilestone: 'Earn Premium status (90+) through exceptional impact',
    },
    '90-99': {
      title: 'Premium Coach',
      description: 'Elite coaches who\'ve achieved transformative coaching within ISO.',
      activities: ['Coaching leadership roles', 'Shape community initiatives', 'Set industry standards'],
      nextMilestone: 'Maintain excellence and coach other coaches',
    },
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-32 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Hero Section */}
        <div
          ref={heroRef}
          className={`text-center mb-20 transition-all duration-1000 ${
            isVisible.hero
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-10'
          }`}
        >
          <h1
            className="text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 animate-gradient"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(3rem, 8vw, 5rem)',
              letterSpacing: '0.1em',
            }}
          >
            Become an ISO Coach
          </h1>
          <p className="text-slate-300 text-xl md:text-2xl max-w-2xl mx-auto">
            Uplift the next generation through coaching, integrity, and community.
          </p>
        </div>

        {/* Stats Section */}
        {isVisible.why && (
          <div className="grid md:grid-cols-3 gap-6 mb-20">
            {[
              { label: 'Active Coaches', value: counterValues.coaches, icon: Users, color: 'text-orange-500' },
              { label: 'Players Helped', value: counterValues.mentees, icon: Star, color: 'text-orange-400' },
              { label: 'Sessions Completed', value: counterValues.sessions, icon: Award, color: 'text-orange-600' },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-2xl border border-slate-800 p-6 hover:border-orange-500/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/10"
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                  }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center ${stat.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">
                    {stat.value.toLocaleString()}+
                  </div>
                  <div className="text-slate-400 text-sm">{stat.label}</div>
                </div>
              );
            })}
          </div>
        )}

        {/* Why Become a Coach */}
        <section
          ref={whyRef}
          className={`mb-20 transition-all duration-1000 delay-100 ${
            isVisible.why ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-8 md:p-12 hover:border-orange-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10 hover:scale-[1.01] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/5 to-orange-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <h2
                className="text-white text-3xl md:text-4xl font-bold mb-6 flex items-center gap-3"
                style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.1em' }}
              >
                <Sparkles className="w-8 h-8 text-orange-500 animate-pulse" />
                Why Become a Coach
              </h2>
              <p className="text-slate-300 text-lg md:text-xl leading-relaxed">
                ISO is built on sincerity, impact, and uplift. As a coach, you're not just teaching — you're{' '}
                <span className="text-orange-500 font-semibold relative group/span">
                  transforming a generation
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 group-hover/span:w-full transition-all duration-300"></span>
                </span>{' '}
                of first-gen, low-income, and underserved youth, all while{' '}
                <span className="text-orange-500 font-semibold relative group/span">
                  building your personal brand
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 group-hover/span:w-full transition-all duration-300"></span>
                </span>{' '}
                and coaching skills.
              </p>
            </div>
          </div>
        </section>

        {/* How the Coach Structure Works */}
        <section
          ref={structureRef}
          className={`mb-20 transition-all duration-1000 delay-200 ${
            isVisible.structure ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-8 md:p-12 mb-8">
            <h2
              className="text-white text-3xl md:text-4xl font-bold mb-8"
              style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.1em' }}
            >
              How the Coach Structure Works
            </h2>

            {/* Experience Tier */}
            <div
              ref={experienceRef}
              className={`mb-12 transition-all duration-1000 delay-300 ${
                isVisible.experience ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <h3 className="text-white text-2xl font-semibold mb-6 text-orange-500 flex items-center gap-2">
                <Sparkles className="w-6 h-6" />
                Experience Tier (Static)
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {tiers.map((tier, index) => (
                  <div
                    key={tier.name}
                    onClick={() => setExpandedTier(expandedTier === tier.name ? null : tier.name)}
                    onMouseEnter={() => setHoveredTier(tier.name)}
                    onMouseLeave={() => setHoveredTier(null)}
                    className={`bg-gradient-to-br ${tier.gradient} rounded-xl border-2 ${
                      hoveredTier === tier.name || expandedTier === tier.name
                        ? 'border-orange-400 scale-105 shadow-2xl shadow-orange-500/50'
                        : 'border-slate-700'
                    } p-6 transition-all duration-300 cursor-pointer relative overflow-hidden group`}
                    style={{
                      transitionDelay: `${index * 50}ms`,
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{tier.icon}</span>
                          <h4 className="text-white text-xl font-semibold">{tier.name}</h4>
                        </div>
                        <ChevronRight 
                          className={`w-5 h-5 text-white transition-transform duration-300 ${
                            expandedTier === tier.name ? 'rotate-90' : ''
                          }`} 
                        />
                      </div>
                      <p className="text-slate-200 text-sm leading-relaxed mb-2">{tier.description}</p>
                      <div className={`overflow-hidden transition-all duration-300 ${
                        expandedTier === tier.name ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      }`}>
                        <div className="pt-4 border-t border-white/20 mt-4">
                          <p className="text-white text-xs font-semibold mb-2">Starting Overall: {tier.startingOverall}</p>
                          <p className="text-slate-200 text-xs mb-3">Badge: {tier.badge}</p>
                          <div className="space-y-1">
                            <p className="text-slate-300 text-xs font-semibold">Examples:</p>
                            {tier.examples.map((example, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div>
                                <p className="text-slate-200 text-xs">{example}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ISO Rank */}
            <div
              ref={isoRankRef}
              className={`transition-all duration-1000 delay-400 ${
                isVisible.isoRank ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <h3 className="text-white text-2xl font-semibold mb-6 text-orange-500 flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                ISO Rank (Dynamic)
              </h3>

              {/* Interactive Scale with Clickable Ranges */}
              <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6 mb-6 hover:border-orange-500/50 transition-all duration-300">
                <h4 className="text-white text-xl font-semibold mb-4">Scale: 70–99</h4>
                <p className="text-slate-300 mb-6">
                  Your ISO overall rating reflects your impact, consistency, and contributions within the community.
                  <span className="text-orange-400 font-semibold ml-2">Click a range to learn more</span>
                </p>

                {/* Interactive Visual Progress Bar */}
                <div className="relative h-12 bg-slate-900 rounded-full overflow-hidden mb-6 cursor-pointer group">
                  <div className="absolute inset-0 flex">
                    <div 
                      className={`flex-1 bg-gradient-to-r from-slate-600 to-slate-700 transition-all duration-300 ${
                        selectedRange === '70-79' ? 'brightness-125 scale-105' : 'group-hover:brightness-110'
                      }`}
                      onClick={() => setSelectedRange(selectedRange === '70-79' ? null : '70-79')}
                    ></div>
                    <div 
                      className={`flex-1 bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-300 ${
                        selectedRange === '80-89' ? 'brightness-125 scale-105' : 'group-hover:brightness-110'
                      }`}
                      onClick={() => setSelectedRange(selectedRange === '80-89' ? null : '80-89')}
                    ></div>
                    <div 
                      className={`flex-1 bg-gradient-to-r from-orange-600 to-orange-700 transition-all duration-300 ${
                        selectedRange === '90-99' ? 'brightness-125 scale-105' : 'group-hover:brightness-110'
                      }`}
                      onClick={() => setSelectedRange(selectedRange === '90-99' ? null : '90-99')}
                    ></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white pointer-events-none">
                    70 ————————— 80 ————————— 90 ———————— 99
                  </div>
                </div>

                {/* Range Details Panel */}
                {selectedRange && rangeDetails[selectedRange] && (
                  <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 rounded-xl border border-orange-500/30 p-6 mb-4 animate-fadeIn">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="text-orange-400 font-bold text-lg">{rangeDetails[selectedRange].title}</h5>
                      <button
                        onClick={() => setSelectedRange(null)}
                        className="text-slate-400 hover:text-white transition-colors"
                      >
                        ×
                      </button>
                    </div>
                    <p className="text-slate-300 text-sm mb-4">{rangeDetails[selectedRange].description}</p>
                    <div className="space-y-2">
                      <p className="text-white text-xs font-semibold">Key Activities:</p>
                      {rangeDetails[selectedRange].activities.map((activity, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <ChevronRight className="w-3 h-3 text-orange-500" />
                          <p className="text-slate-300 text-xs">{activity}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-orange-500/20">
                      <p className="text-orange-400 text-xs font-semibold">Next: {rangeDetails[selectedRange].nextMilestone}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {[
                    { range: '70-79', label: 'Standard', color: 'text-slate-400' },
                    { range: '80-89', label: 'Specialist', color: 'text-orange-500' },
                    { range: '90-99', label: 'Premium (earned only through ISO impact)', color: 'text-orange-400' },
                  ].map((item, index) => (
                    <div
                      key={item.range}
                      className={`flex items-center gap-4 p-3 rounded-lg bg-slate-900/50 hover:bg-slate-900/70 transition-all duration-300 cursor-pointer ${
                        selectedRange === item.range ? 'ring-2 ring-orange-500 bg-orange-500/10' : ''
                      }`}
                      onClick={() => setSelectedRange(selectedRange === item.range ? null : item.range as any)}
                      style={{
                        animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                      }}
                    >
                      <span className={`font-semibold w-24 ${item.color}`}>{item.range}:</span>
                      <span className="text-white">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Badges with Hover Effects and Details */}
              <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6 mb-6 hover:border-orange-500/50 transition-all duration-300">
                <h4 className="text-white text-xl font-semibold mb-4">Badges</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  {badges.map((badge, index) => (
                    <div
                      key={badge.name}
                      onMouseEnter={() => setHoveredBadge(badge.name)}
                      onMouseLeave={() => setHoveredBadge(null)}
                      className={`bg-gradient-to-br ${badge.gradient} rounded-lg p-5 border-2 ${
                        hoveredBadge === badge.name
                          ? `${badge.borderColor} scale-110 shadow-2xl shadow-orange-500/50 z-10`
                          : `${badge.borderColor}/50`
                      } transition-all duration-300 cursor-pointer relative overflow-hidden group`}
                      style={{
                        transitionDelay: `${index * 50}ms`,
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative z-10">
                        <p className={`text-sm mb-2 font-semibold ${
                          badge.name === 'Premium' ? 'text-orange-200' : badge.name === 'Specialist' ? 'text-orange-300' : 'text-slate-300'
                        }`}>
                          {badge.name}
                        </p>
                        <p className="text-orange-400 text-xs mb-1 font-mono">{badge.range}</p>
                        <p className="text-white font-semibold text-sm mb-3">{badge.description}</p>
                        {hoveredBadge === badge.name && (
                          <div className="space-y-1 mt-3 pt-3 border-t border-white/20 animate-fadeIn">
                            {badge.features.map((feature, idx) => (
                              <p key={idx} className="text-white/90 text-xs">• {feature}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* How to Increase Overall with Points */}
              <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6 hover:border-orange-500/50 transition-all duration-300">
                <h4 className="text-white text-xl font-semibold mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-orange-500" />
                  How to Increase Your Overall
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {waysToIncrease.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-4 rounded-lg bg-slate-900/50 hover:bg-slate-900/70 hover:border-orange-500/30 border border-transparent transition-all duration-300 group"
                        style={{
                          animation: `fadeInLeft 0.5s ease-out ${index * 0.1}s both`,
                        }}
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-slate-300 text-sm leading-relaxed group-hover:text-white transition-colors">
                            {item.text}
                          </p>
                          <span className="inline-block mt-2 px-2 py-1 bg-orange-500/20 text-orange-400 text-xs font-semibold rounded">
                            {item.points}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Starting Level for Experienced Coaches */}
        <section
          ref={startingLevelRef}
          className={`mb-20 transition-all duration-1000 delay-500 ${
            isVisible.startingLevel ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-2xl border border-orange-500/30 p-8 md:p-12 hover:border-orange-500/50 hover:shadow-xl hover:shadow-orange-500/20 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/10 to-orange-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <h2
                className="text-white text-3xl md:text-4xl font-bold mb-6"
                style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.1em' }}
              >
                Starting Level for Experienced Coaches
              </h2>
              <p className="text-slate-300 text-lg md:text-xl leading-relaxed mb-4">
                Coaches with strong experience don't start from zero. Based on your Experience Tier, you'll begin
                at a higher ISO overall (e.g., 81–88 Specialist Provisional for Expert and Master tiers),
                recognizing your existing expertise and track record.
              </p>
              <p className="text-slate-300 text-lg md:text-xl leading-relaxed">
                However,{' '}
                <span className="font-semibold text-orange-500 animate-pulse inline-flex items-center gap-1">
                  Premium (90-99) can only be earned inside ISO
                  <Sparkles className="w-4 h-4" />
                </span>{' '}
                through coaching impact, community contribution, and sustained excellence within our ecosystem.
                This ensures that Premium status reflects not just experience, but transformative coaching and
                authentic community engagement.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section
          ref={ctaRef}
          className={`text-center transition-all duration-1000 delay-600 ${
            isVisible.cta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-8 md:p-12 hover:border-orange-500/50 transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/5 to-orange-500/0 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <h2
                className="text-white text-3xl md:text-4xl font-bold mb-6"
                style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.1em' }}
              >
                Ready to Transform Lives?
              </h2>
              <p className="text-slate-300 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
                Join the ISO community and help shape the next generation of leaders, innovators, and
                change-makers.
              </p>
              <button
                onClick={() => {
                  // TODO: Link to /apply-coach route
                  window.location.href = '/apply-coach';
                }}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 inline-flex items-center gap-2 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-110 active:scale-105 relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Apply to Become a Coach
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              </button>
              <p className="text-slate-400 text-sm mt-4">(Application form coming soon)</p>
            </div>
          </div>
        </section>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out both;
        }
      `}</style>
    </div>
  );
}
