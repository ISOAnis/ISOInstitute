import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Moon, Dumbbell, Activity, Settings, Rocket, Globe, Award, Users, MessageSquare, TrendingUp, ArrowLeft, ArrowRight, Medal, Trophy, Gem, Star, Calendar, Zap, GraduationCap, Briefcase, BookOpen, ArrowUp, Target, Clock } from 'lucide-react';

const getAccentColor = (gradientString) => {

  const colorMap = {

    'from-emerald-500 to-teal-600': '#10b981',

    'from-red-500 to-rose-600': '#ef4444',

    'from-blue-500 to-cyan-600': '#3b82f6',

    'from-purple-500 to-indigo-600': '#a855f7',

    'from-orange-500 to-amber-600': '#f97316',

    'from-cyan-500 to-blue-600': '#06b6d4',

  };

  return colorMap[gradientString] || '#3b82f6';

};



const hexToRgba = (hex, alpha) => {

  const r = parseInt(hex.slice(1, 3), 16);

  const g = parseInt(hex.slice(3, 5), 16);

  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;

};



// Coach Card Component

function CoachCard({ overall, isFlipped, onFlip }) {

  const getTier = (rating) => {

    if (rating >= 90) return { name: 'Premium', gradient: 'from-purple-500 to-orange-500', color: '#a855f7' };

    if (rating >= 80) return { name: 'Gold', gradient: 'from-yellow-400 to-yellow-600', color: '#ffd700' };

    if (rating >= 70) return { name: 'Silver', gradient: 'from-slate-300 to-slate-500', color: '#c0c0c0' };

    return { name: 'Bronze', gradient: 'from-amber-700 to-amber-900', color: '#cd7f32' };

  };



  const tier = getTier(overall);



  if (isFlipped) {

    const isPremium = tier.name === 'Premium';
    
    return (
      <div 
        className="relative rounded-3xl cursor-pointer transition-all duration-300"
        style={{
          padding: isPremium ? '2px' : '2px',
          background: isPremium 
            ? 'linear-gradient(135deg, #a855f7 0%, #f97316 100%)' 
            : tier.color,
          boxShadow: isPremium 
            ? '0 0 40px rgba(168, 85, 247, 0.4)' 
            : `0 0 40px ${tier.color}40`
        }}
        onClick={onFlip}
      >
        <div 
          className="rounded-3xl p-8 h-full w-full"
          style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          }}
        >

        <div className="flex justify-between items-start mb-6">

          <div className="text-sm text-white">Click to flip back</div>

          <button className="px-4 py-2 bg-white/10 text-white rounded-full text-sm font-semibold">BACK</button>

        </div>



        <div className="mb-6">

          <div className="flex items-center gap-3 mb-4">

            <h3 className="text-white text-2xl font-bold" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>IMAM ABDULLAH RAHMAN</h3>

            <span className="px-3 py-1 bg-orange-500/20 border border-orange-500/30 rounded-full text-orange-400 text-sm font-semibold">

              {overall}% player satisfaction

            </span>

          </div>

          <p className="text-white text-base leading-relaxed">

            Dedicated to helping young Muslims navigate faith in modern society. 15+ years of experience in youth development and Islamic education.

          </p>

        </div>



        <div className="mb-6">

          <div className="flex items-center gap-2 mb-3">

            <GraduationCap className="w-5 h-5 text-orange-400" />

            <h4 className="text-white font-semibold">Education</h4>

          </div>

          <ul className="text-white text-sm space-y-1 ml-7">

            <li>• BS Computer Science, Stanford University</li>

            <li>• MS Engineering, MIT</li>

          </ul>

        </div>



        <div className="mb-6">

          <div className="flex items-center gap-2 mb-3">

            <Briefcase className="w-5 h-5 text-purple-400" />

            <h4 className="text-white font-semibold">Career Timeline</h4>

          </div>

          <div className="space-y-3 ml-7">

            <div className="flex gap-4">

              <span className="text-orange-400 font-bold text-sm">2019</span>

              <div>

                <div className="text-white font-semibold text-sm">Software Engineer</div>

                <div className="text-white text-sm">Apple</div>

              </div>

            </div>

            <div className="flex gap-4">

              <span className="text-orange-400 font-bold text-sm">2021</span>

              <div>

                <div className="text-white font-semibold text-sm">Senior Engineer</div>

                <div className="text-white text-sm">Zoox</div>

              </div>

            </div>

            <div className="flex gap-4">

              <span className="text-orange-400 font-bold text-sm">2023</span>

              <div>

                <div className="text-white font-semibold text-sm">Lead Engineer</div>

                <div className="text-white text-sm">Zoox</div>

              </div>

            </div>

            <div className="flex gap-4">

              <span className="text-orange-400 font-bold text-sm">2024</span>

              <div>

                <div className="text-white font-semibold text-sm">Mentor & Community Builder</div>

                <div className="text-white text-sm">ISO Institute</div>

              </div>

            </div>

          </div>

        </div>



        <div className="mb-4">

          <div className="flex items-center gap-2 mb-3">

            <BookOpen className="w-5 h-5 text-blue-400" />

            <h4 className="text-white font-semibold">Expertise</h4>

          </div>

          <div className="flex flex-wrap gap-2 ml-7">

            <span className="px-3 py-1 bg-slate-700/50 border border-slate-600 rounded-full text-white text-sm">Quran Study</span>

            <span className="px-3 py-1 bg-slate-700/50 border border-slate-600 rounded-full text-white text-sm">Youth Development</span>

            <span className="px-3 py-1 bg-slate-700/50 border border-slate-600 rounded-full text-white text-sm">Spiritual Counseling</span>

          </div>

        </div>



        <div className="pt-4 border-t border-white/10">

          <div className="flex items-center gap-2 mb-2">

            <Award className="w-5 h-5 text-yellow-400" />

            <h4 className="text-white font-semibold">Coach-Specific Benefits</h4>

          </div>

          <p className="text-white text-sm ml-7">Direct support and dedicated check-ins...</p>

        </div>
        </div>
      </div>

    );

  }



  const isPremium = tier.name === 'Premium';

  return (
    <div 
      className="relative rounded-3xl cursor-pointer transition-all duration-300"
      style={{
        padding: '2px',
        background: isPremium 
          ? 'linear-gradient(135deg, #a855f7 0%, #f97316 100%)' 
          : tier.color,
        boxShadow: isPremium 
          ? '0 0 40px rgba(168, 85, 247, 0.4)' 
          : `0 0 40px ${tier.color}40`
      }}
      onClick={onFlip}
    >
      <div 
        className="rounded-3xl p-8 h-full w-full"
        style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        }}
      >

      <div className="flex justify-between items-start mb-4">

        <h3 className="text-white text-xl">The Seeker Pathway</h3>

        <div className="flex items-center gap-1 px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full">

          <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />

          <span className="text-yellow-300 text-sm font-semibold">{tier.name.toUpperCase()}</span>

        </div>

      </div>



      <div className="mb-6 rounded-2xl overflow-hidden" style={{ height: '200px', background: '#334155' }}>

        <div className="w-full h-full flex items-center justify-center text-white/40">

          [Coach Photo]

        </div>

      </div>



      <div className="mb-6">

        <div className="flex items-center gap-3 mb-2">

          <h3 className="text-white text-2xl font-bold" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>IMAM ABDULLAH RAHMAN</h3>

          <span className="px-3 py-1 bg-orange-500/20 border border-orange-500/30 rounded-full text-orange-400 text-sm font-semibold">

            {overall}% player satisfaction

          </span>

        </div>

        <p className="text-orange-400 font-semibold">Islamic Scholar & Youth Mentor</p>

      </div>



      <div className="grid grid-cols-3 gap-3 mb-6">

        <div className="bg-slate-800/50 rounded-xl p-3 text-center">

          <Star className="w-6 h-6 text-yellow-400 mx-auto mb-1" />

          <div className="text-white text-2xl font-bold">{overall}</div>

          <div className="text-white text-xs">Overall</div>

        </div>

        <div className="bg-slate-800/50 rounded-xl p-3 text-center">

          <Calendar className="w-6 h-6 text-blue-400 mx-auto mb-1" />

          <div className="text-white text-2xl font-bold">150</div>

          <div className="text-white text-xs">Sessions</div>

        </div>

        <div className="bg-slate-800/50 rounded-xl p-3 text-center">

          <Zap className="w-6 h-6 text-green-400 mx-auto mb-1" />

          <div className="text-white text-2xl font-bold">&lt; 24hrs</div>

          <div className="text-white text-xs">Response</div>

        </div>

      </div>



      <div className="flex flex-wrap gap-2 mb-4">

        <span className="px-3 py-1 bg-slate-700/50 border border-slate-600 rounded-full text-white text-sm">Quran Study</span>

        <span className="px-3 py-1 bg-slate-700/50 border border-slate-600 rounded-full text-white text-sm">Youth Development</span>

        <span className="px-3 py-1 bg-slate-700/50 border border-slate-600 rounded-full text-white text-sm">Spiritual Counseling</span>

      </div>



      <div className="text-center pt-4 border-t border-white/10">

        <p className="text-orange-400 text-sm font-semibold flex items-center justify-center gap-2">

          Click card to flip and see more <ArrowRight className="w-4 h-4" />

        </p>

      </div>
      </div>
    </div>

  );

}



function PathwayCard({ pathway, isSelected, onClick }) {

  const IconComponent = pathway.icon;

  const accentColor = getAccentColor(pathway.color);

  const [isHovered, setIsHovered] = useState(false);

  

  return (

    <div

      className={`relative overflow-hidden rounded-3xl border border-white/10 backdrop-blur-md p-12 cursor-pointer transition-all duration-300 ${isSelected ? 'ring-4 ring-orange-500/50' : ''}`}

      style={{

        backgroundColor: 'rgba(0, 0, 0, 0.4)',

        boxShadow: isHovered ? `0 0 40px ${hexToRgba(accentColor, 0.4)}, 0 0 80px ${hexToRgba(accentColor, 0.2)}` : '0 0 60px rgba(0,0,0,0.55)',

        transform: isHovered ? 'scale(1.02)' : 'scale(1)',

      }}

      onClick={onClick}

      onMouseEnter={() => setIsHovered(true)}

      onMouseLeave={() => setIsHovered(false)}

    >

      <div 

        className="pointer-events-none absolute inset-0 rounded-3xl"

        style={{ backgroundColor: hexToRgba(accentColor, 0.15) }}

      />

      <div className="absolute left-0 top-0 h-full w-[2px] opacity-60" style={{ backgroundColor: accentColor }} />

      

      <div className="flex flex-col items-center justify-center gap-6 relative z-10 text-center">

        <div className="flex h-24 w-24 items-center justify-center rounded-2xl shadow-lg" style={{ backgroundColor: accentColor }}>

          <IconComponent className="w-10 h-10 text-white" />

        </div>

        <h3 className="text-white text-3xl" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{pathway.name}</h3>
        {pathway.legacyName && (
          <p className="text-sm tracking-wide !text-white" style={{ color: '#ffffff' }}>{pathway.legacyName}</p>
        )}

      </div>

    </div>

  );

}



const FlowConnector = () => (

  <div className="flex items-center self-center gap-2 md:gap-3 text-white h-full">

    <div className="h-px w-10 md:w-16 bg-gradient-to-r from-white/0 via-white/40 to-white/0 rounded-full" style={{ boxShadow: '0 0 12px rgba(255,255,255,0.25)' }} />

    <div className="flex items-center justify-center w-12 h-12 rounded-full border border-white/25 bg-white/10" style={{ boxShadow: '0 0 18px rgba(255,255,255,0.35)' }}>

      <ArrowRight className="w-5 h-5 text-white" strokeWidth={2.5} />

    </div>

    <div className="h-px w-10 md:w-16 bg-gradient-to-r from-white/0 via-white/40 to-white/0 rounded-full" style={{ boxShadow: '0 0 12px rgba(255,255,255,0.25)' }} />

  </div>

);



export default function ForCoaches() {

  const [selectedPathway, setSelectedPathway] = useState(null);

  const [hoveredTier, setHoveredTier] = useState(null);

  const [overallRating, setOverallRating] = useState(95);

  const [isCardFlipped, setIsCardFlipped] = useState(false);

  

  useEffect(() => {

    window.scrollTo({ top: 0, behavior: 'smooth' });

  }, []);



  const pathways = [

    {

      id: 'deen',

      icon: Moon,

      name: 'The Seeker Pathway',
      legacyName: 'Deen and Purpose',

      coachDescription: 'Guide young Muslims in developing their spiritual foundation, Islamic knowledge, and balancing worldly pursuits with faith. Help mentees build consistent prayer habits, deepen Quran understanding, and navigate modern challenges while staying rooted in Islamic principles.',

      coachRole: 'Spiritual Guide & Faith Mentor',

      color: 'from-emerald-500 to-teal-600',

    },

    {

      id: 'health',

      icon: Dumbbell,

      name: 'The Warrior Pathway',
      legacyName: 'Health and Wellness',

      coachDescription: 'Train mentees in building disciplined fitness routines, proper nutrition, and mental wellness habits. Support their journey in strength training, cardio consistency, injury prevention, and developing a healthy relationship with their body as an act of worship.',

      coachRole: 'Fitness Coach & Wellness Mentor',

      color: 'from-red-500 to-rose-600',

    },

    {

      id: 'medicine',

      icon: Activity,

      name: 'The Healer Pathway',
      legacyName: 'Medicine and healthcare',

      coachDescription: 'Mentor aspiring healthcare professionals through pre-med preparation, MCAT strategy, medical school applications, clinical experience, and career planning. Share insights on balancing rigorous academic demands with ethical patient care and maintaining faith in medicine.',

      coachRole: 'Medical Mentor & Career Guide',

      color: 'from-blue-500 to-cyan-600',

    },

    {

      id: 'engineering',

      icon: Settings,

      name: 'The Builder Pathway',
      legacyName: 'Engineering and Tech',

      coachDescription: 'Guide future engineers and technologists through technical skill development, project building, internship preparation, and career navigation in STEM fields. Help mentees master coding, system design, problem-solving, and leveraging technology for positive impact.',

      coachRole: 'Technical Mentor & Industry Guide',

      color: 'from-purple-500 to-indigo-600',

    },

    {

      id: 'entrepreneurship',

      icon: Rocket,

      name: 'The Founder Pathway',
      legacyName: 'Entrepreneurship and business',

      coachDescription: 'Support aspiring entrepreneurs in validating business ideas, building MVPs, navigating fundraising, and scaling ventures. Share experience in leadership, strategic thinking, ethical business practices, and building enterprises that create lasting value.',

      coachRole: 'Business Coach & Startup Advisor',

      color: 'from-orange-500 to-amber-600',

    },

    {

      id: 'global',

      icon: Globe,

      name: 'The Reformer Pathway',
      legacyName: 'Global Affairs, Law, and Policy',

      coachDescription: 'Mentor future leaders in international relations, law, public policy, and diplomacy. Guide mentees through law school preparation, policy analysis, understanding global systems, and developing the skills to lead with ethical principles and strategic insight.',

      coachRole: 'Policy Mentor & Leadership Guide',

      color: 'from-cyan-500 to-blue-600',

    },

  ];



  const rankingTiers = [

    { range: '60-69', tier: 'Bronze', icon: Medal, color: '#cd7f32', gradient: 'from-amber-700 to-amber-900', description: 'Building your foundation as a coach. Focus on consistency and player engagement.' },

    { range: '70-79', tier: 'Silver', icon: Medal, color: '#c0c0c0', gradient: 'from-slate-300 to-slate-500', description: 'Established coach with solid performance. Growing reputation and impact.' },

    { range: '80-89', tier: 'Gold', icon: Trophy, color: '#ffd700', gradient: 'from-yellow-400 to-yellow-600', description: 'High-performing coach with excellent player outcomes and satisfaction.' },

    { range: '90-99', tier: 'Premium', icon: Gem, color: '#a855f7', gradient: 'from-purple-500 to-orange-500', description: 'Elite-tier coach. Exceptional mentorship, transformation, and community leadership.' }

  ];

  const tierDetails = {
    'Bronze': {
      title: 'Building Your Foundation',
      description: 'Focus on consistency, building your coaching style, and establishing strong relationships with your mentees. This tier emphasizes steady growth and player engagement.',
      requirements: 'Maintain regular sessions, respond to player inquiries promptly, and build a track record of positive outcomes.',
      gear: 'Unlock basic coaching gear and ISO merchandise as you build your foundation and complete your first successful coaching cycles.'
    },
    'Silver': {
      title: 'Established Performance',
      description: 'You\'ve proven your coaching effectiveness with solid performance metrics. Your reputation is growing, and players recognize your value as a mentor.',
      requirements: 'Continue delivering quality sessions, maintain high satisfaction ratings, and demonstrate consistent commitment to your mentees\' growth.',
      gear: 'Access exclusive Silver-tier gear, premium ISO apparel, and coaching resources to enhance your mentorship capabilities.'
    },
    'Gold': {
      title: 'High-Performing Coach',
      description: 'Excellent player outcomes and satisfaction ratings demonstrate your expertise. You\'re recognized as a top-tier coach in your pathway.',
      requirements: 'Sustain exceptional performance, maintain outstanding ratings, and continue to deliver transformative mentorship experiences.',
      gear: 'Unlock Gold-tier exclusive gear, limited edition ISO merchandise, and premium coaching tools to support your high-level mentorship.'
    },
    'Premium': {
      title: 'Elite-Tier Excellence',
      description: 'The highest tier of coaching excellence. You demonstrate exceptional mentorship, drive transformation, and serve as a community leader. Premium coaches set the standard for others.',
      requirements: 'Maintain elite performance across all metrics, serve as a mentor to other coaches, and contribute significantly to the ISO community.',
      gear: 'Access the most exclusive Premium-tier gear, signature ISO collections, and elite coaching resources reserved for top performers.'
    }
  };



  const selectedPathwayData = selectedPathway ? pathways.find(p => p.id === selectedPathway) : null;



  const getTierFromRating = (rating) => {

    if (rating >= 90) return rankingTiers[3]; // Premium

    if (rating >= 80) return rankingTiers[2]; // Gold

    if (rating >= 70) return rankingTiers[1]; // Silver

    return rankingTiers[0]; // Bronze

  };



  const currentTier = getTierFromRating(overallRating);



  if (selectedPathwayData) {

    return (

      <div className="min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8" style={{ background: '#030305' }}>

        <div className="max-w-6xl mx-auto">

          <button onClick={() => setSelectedPathway(null)} className="flex items-center gap-2 text-white hover:text-white/90 mb-8 transition-colors">

            <ArrowLeft size={20} />

            <span style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Back to For Coaches</span>

          </button>



          <div className="text-center mb-12">

            <div className="inline-flex items-center gap-3 mb-6">

              <div className={`w-16 h-16 bg-gradient-to-br ${selectedPathwayData.color} rounded-2xl flex items-center justify-center shadow-lg`}>

                <selectedPathwayData.icon className="w-8 h-8 text-white" />

              </div>

              <h1 className="text-white text-4xl md:text-5xl" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{selectedPathwayData.name}</h1>

            </div>

            <div className="inline-block mb-4 px-4 py-2 bg-orange-500/20 border border-orange-500/30 rounded-full">

              <span className="text-orange-400 font-semibold">{selectedPathwayData.coachRole}</span>

            </div>

            <p className="text-white text-lg max-w-3xl mx-auto leading-relaxed">{selectedPathwayData.coachDescription}</p>

          </div>



          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">

            <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6">

              <div className="flex items-start gap-4">

                <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center flex-shrink-0">

                  <Users className="w-6 h-6 text-orange-400" />

                </div>

                <div>

                  <h3 className="text-white text-xl font-semibold mb-2">1-on-1 Mentorship</h3>

                  <p className="text-white text-sm">Conduct personalized coaching sessions, set goals with mentees, provide accountability, and track their progress over 30-day commitment periods.</p>

                </div>

              </div>

            </div>



            <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6">

              <div className="flex items-start gap-4">

                <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center flex-shrink-0">

                  <MessageSquare className="w-6 h-6 text-orange-400" />

                </div>

                <div>

                  <h3 className="text-white text-xl font-semibold mb-2">Ongoing Support</h3>

                  <p className="text-white text-sm">Provide guidance between sessions, answer questions, share resources, and help mentees overcome obstacles as they work toward their goals.</p>

                </div>

              </div>

            </div>



            <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6">

              <div className="flex items-start gap-4">

                <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center flex-shrink-0">

                  <TrendingUp className="w-6 h-6 text-orange-400" />

                </div>

                <div>

                  <h3 className="text-white text-xl font-semibold mb-2">Progress Tracking</h3>

                  <p className="text-white text-sm">Monitor micro-goals, celebrate wins, help mentees level up through the ISO system, and provide constructive feedback to accelerate their growth.</p>

                </div>

              </div>

            </div>



            <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6">

              <div className="flex items-start gap-4">

                <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center flex-shrink-0">

                  <Award className="w-6 h-6 text-orange-400" />

                </div>

                <div>

                  <h3 className="text-white text-xl font-semibold mb-2">Community Leadership</h3>

                  <p className="text-white text-sm">Represent excellence in your pathway, inspire others through your journey, and contribute to building a culture of growth and faith-centered achievement.</p>

                </div>

              </div>

            </div>

          </div>



          <div className="text-center">

            <button onClick={() => setSelectedPathway(null)} className="px-8 py-4 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors font-semibold">

              View Other Pathways

            </button>

          </div>

        </div>

      </div>

    );

  }



  return (

    <div className="min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8" style={{ background: '#030305' }}>

      <div className="max-w-6xl mx-auto">

        

        {/* How It Works */}

        <div className="text-center mb-16">

          <div className="inline-block mb-6">

            <span className="px-4 py-2 text-white rounded-full backdrop-blur-[10px]" style={{ background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.3)' }}>

              The Coach Journey

            </span>

          </div>

          <h2 className="text-white mb-6 text-5xl md:text-6xl" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>

            How Coaching Works

          </h2>

          

          <div className="max-w-6xl mx-auto">

            <div className="relative flex items-center gap-8 overflow-x-auto pb-4 px-2 md:px-0 md:justify-center text-center">

              <div className="pointer-events-none absolute left-0 right-0 top-1/2 hidden md:block">

                <div className="mx-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              </div>



              <div className="relative min-w-[260px] md:min-w-0 md:flex-1 max-w-sm flex flex-col items-center text-center">

                <h3 className="text-white mb-4 text-2xl text-center" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>

                  Build Your Profile

                </h3>

                <p className="text-white text-base leading-relaxed md:text-lg text-center mx-auto">

                  Create a comprehensive coach profile highlighting your expertise, experience, and coaching style in your chosen pathway.

                </p>

              </div>



              <FlowConnector />

              

              <div className="relative min-w-[260px] md:min-w-0 md:flex-1 max-w-sm flex flex-col items-center text-center">

                <h3 className="text-white mb-4 text-2xl text-center" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>

                  Connect With Players

                </h3>

                <p className="text-white text-base leading-relaxed md:text-lg text-center mx-auto">

                  Players browse coach profiles and book sessions with you. Accept commitments and begin guiding their growth journey.

                </p>

              </div>



              <FlowConnector />

              

              <div className="relative min-w-[260px] md:min-w-0 md:flex-1 max-w-sm flex flex-col items-center text-center">

                <h3 className="text-white mb-4 text-2xl text-center" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>

                  Level Up Together

                </h3>

                <p className="text-white text-base leading-relaxed md:text-lg text-center mx-auto">

                  Guide your mentees through goals, earn ratings, and progress through coach tiers as you make a lasting impact.

                </p>

              </div>

            </div>

          </div>

        </div>



        {/* Coach Ranking System with Interactive Card */}

        <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6 mb-12 max-w-4xl mx-auto">

          <h2 className="text-white text-center mb-3 text-5xl md:text-6xl uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>

            COACH RANKING SYSTEM

          </h2>

          <p className="text-white text-center mb-6 max-w-2xl mx-auto text-sm">

            Your coach ranking is based on player satisfaction, session consistency, response time, and mentee outcomes. 

            <span className="text-orange-400"> Coaches can start at higher overalls depending on experience. No coach can start at Platinum.</span> Platinum status is earned through exceptional performance over time.

          </p>

          

          {/* Interactive Card Preview */}

          <div className="mb-6">

            <h3 className="text-white text-center text-lg mb-2 font-semibold">Preview Your Coach Card</h3>

            <p className="text-white text-center mb-4 text-sm">Adjust the slider to see how your card looks at different rating levels</p>

            

            <div className="max-w-md mx-auto mb-6">

              <div className="flex justify-between items-center mb-2">

                <span className="text-white text-sm">Overall Rating:</span>

                <span className="text-white font-bold text-xl">{overallRating}</span>

                <span className={`px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-br ${currentTier.gradient}`} style={{ color: 'white' }}>

                  {currentTier.tier}

                </span>

              </div>

              <input

                type="range"

                min="60"

                max="99"

                value={overallRating}

                onChange={(e) => {

                  setOverallRating(parseInt(e.target.value));

                  setIsCardFlipped(false);

                }}

                className="w-full h-2 rounded-full appearance-none cursor-pointer"

                style={{

                  background: `linear-gradient(to right, ${currentTier.color} 0%, ${currentTier.color} ${((overallRating - 60) / 39) * 100}%, rgba(255,255,255,0.2) ${((overallRating - 60) / 39) * 100}%, rgba(255,255,255,0.2) 100%)`

                }}

              />

            </div>



            <div className="max-w-md mx-auto scale-90">

              <CoachCard overall={overallRating} isFlipped={isCardFlipped} onFlip={() => setIsCardFlipped(!isCardFlipped)} />

            </div>

          </div>



          {/* Smaller Tier Badges */}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">

            {rankingTiers.map((tier) => {

              const IconComponent = tier.icon;

              const isHovered = hoveredTier === tier.tier;

              

              const isPremium = tier.tier === 'Premium';
              
              return (
                <div
                  key={tier.tier}
                  onMouseEnter={() => setHoveredTier(tier.tier)}
                  onMouseLeave={() => setHoveredTier(null)}
                  className={`rounded-xl transition-all duration-300 cursor-pointer ${
                    hoveredTier !== null && !isHovered ? 'opacity-40' : 'opacity-100'
                  }`}
                  style={{
                    padding: isPremium ? '2px' : '2px',
                    background: isPremium 
                      ? (isHovered 
                          ? 'linear-gradient(135deg, #a855f7 0%, #f97316 100%)' 
                          : 'linear-gradient(135deg, rgba(168, 85, 247, 0.5) 0%, rgba(249, 115, 22, 0.5) 100%)')
                      : 'transparent',
                    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                    boxShadow: isPremium
                      ? (isHovered 
                          ? '0 0 20px rgba(168, 85, 247, 0.4)' 
                          : '0 0 8px rgba(168, 85, 247, 0.2)')
                      : (isHovered 
                          ? `0 0 20px ${tier.color}40` 
                          : `0 0 8px ${tier.color}20`)
                  }}
                >
                  <div 
                    className={`rounded-xl p-3 ${
                      isPremium ? 'bg-slate-800/50' : 'bg-slate-800/50 border-2'
                    }`}
                    style={{
                      borderColor: !isPremium ? (isHovered ? tier.color : `${tier.color}80`) : 'transparent',
                    }}
                  >
                    <div className="flex flex-col items-center text-center">

                    <div 

                      className={`w-10 h-10 bg-gradient-to-br ${tier.gradient} rounded-xl flex items-center justify-center mb-1 transition-transform duration-300`}

                      style={{ transform: isHovered ? 'scale(1.1)' : 'scale(1)' }}

                    >

                      <IconComponent className={`w-5 h-5 text-white transition-all duration-300 ${
                        isHovered ? 'scale-125' : 'scale(1)'
                      }`} />

                    </div>

                    <h3 className={`text-white text-sm font-bold mb-0.5 transition-all duration-300 ${
                      isHovered ? 'scale-105' : 'scale(1)'
                    }`}>{tier.tier}</h3>

                    <div className="text-white text-xs font-mono">{tier.range}</div>

                    </div>
                  </div>
                </div>

              );

            })}

          </div>



          <div className="pt-4 border-t border-slate-700/50">
            {hoveredTier && tierDetails[hoveredTier] ? (
              <motion.div
                key={hoveredTier}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <div className="flex items-start gap-3">
                  <ArrowUp className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-white text-sm font-semibold mb-1">
                      {tierDetails[hoveredTier].title}
                    </h4>
                    <p className="text-white text-xs">
                      {tierDetails[hoveredTier].description}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-white text-sm font-semibold mb-1">Requirements</h4>
                    <p className="text-white text-xs">
                      {tierDetails[hoveredTier].requirements}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-white text-sm font-semibold mb-1">Gear Rewards</h4>
                    <p className="text-white text-xs">
                      {tierDetails[hoveredTier].gear}
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-white text-sm font-semibold mb-1">Player Satisfaction</h4>
                    <p className="text-white text-xs">Based on post-session ratings and feedback from your mentees.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-white text-sm font-semibold mb-1">Session Consistency</h4>
                    <p className="text-white text-xs">Regular sessions and completion of 30-day commitment periods.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MessageSquare className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-white text-sm font-semibold mb-1">Response Time</h4>
                    <p className="text-white text-xs">Quick responses to player questions and booking requests.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>



        {/* Hall of Fame Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <div className="inline-block mb-6">
              <span className="px-4 py-2 text-white rounded-full backdrop-blur-[10px]" style={{ background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.3)' }}>
                Ultimate Recognition
              </span>
            </div>
            <h2 className="text-white mb-6 text-5xl md:text-6xl" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              Hall of Fame
            </h2>
            <p className="text-white text-xl max-w-3xl mx-auto mb-8">
              The highest honor in the ISO coaching community. Premium tier coaches who consistently outperform others can be selected for this exclusive recognition.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/50 rounded-3xl border border-slate-700/50 p-8 md:p-12 backdrop-blur-md">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  <div className="mb-4 flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                      <Trophy className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-white text-xl font-semibold mb-3" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                    Hall of Fame Status
                  </h3>
                  <p className="text-white text-sm leading-relaxed">
                    Premium coaches who demonstrate exceptional performance and consistently outperform their peers earn the ultimate recognition as Hall of Fame coaches.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-center"
                >
                  <div className="mb-4 flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-orange-500 flex items-center justify-center">
                      <BookOpen className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-white text-xl font-semibold mb-3" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                    ISO Issue Magazine
                  </h3>
                  <p className="text-white text-sm leading-relaxed">
                    Hall of Fame coaches are featured in ISO Issue Magazine, sharing their journey, coaching philosophy, and impact on the community with the entire ISO network.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-center"
                >
                  <div className="mb-4 flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
                      <Star className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-white text-xl font-semibold mb-3" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                    Legacy Recognition
                  </h3>
                  <p className="text-white text-sm leading-relaxed">
                    Your achievements are permanently recognized in the ISO Hall of Fame, inspiring future generations of coaches and players in the community.
                  </p>
                </motion.div>
              </div>

              <div className="mt-12 pt-8 border-t border-slate-700/50">
                <div className="bg-gradient-to-r from-purple-500/10 via-orange-500/10 to-purple-500/10 rounded-2xl p-6 border border-purple-500/20">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <Medal className="w-8 h-8 text-yellow-400" />
                    </div>
                    <div>
                      <h4 className="text-white text-lg font-semibold mb-2">How to Achieve Hall of Fame</h4>
                      <p className="text-white text-sm leading-relaxed">
                        Reach Premium tier status and consistently outperform other coaches across all metrics. Hall of Fame selection is based on exceptional player outcomes, community leadership, and sustained excellence over time. Only the most outstanding Premium coaches are selected for this honor.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>



        {/* Pathways Section */}

        <div className="text-center mb-12">

          <div className="inline-block mb-6">

            <span className="px-4 py-2 text-white rounded-full backdrop-blur-[10px]" style={{ background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.3)' }}>

              Six Coaching Pathways

            </span>

          </div>

          <h1 className="text-white mb-4 text-5xl md:text-6xl" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>

            Choose Your Coaching Pathway

          </h1>

          <p className="text-white text-xl max-w-3xl mx-auto">

            Select the area where you want to mentor and guide the next generation. Each pathway represents a unique opportunity to make lasting impact.

          </p>

        </div>



        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {pathways.map((pathway) => (

            <PathwayCard 

              key={pathway.id}

              pathway={pathway}

              isSelected={selectedPathway === pathway.id}

              onClick={() => setSelectedPathway(pathway.id)}

            />

          ))}

        </div>

      </div>

    </div>

  );

}

