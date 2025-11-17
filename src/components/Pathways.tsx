type Page = 'home' | 'pathways' | 'about' | 'community';

interface PathwaysProps {
  onNavigate: (page: Page) => void;
}

export function Pathways({ onNavigate }: PathwaysProps) {
  const pathways = [
    {
      id: 'deen',
      icon: '☪️',
      name: 'Deen & Purpose',
      description: 'Spiritual development, Islamic knowledge, reflection, and balance between dunya and akhirah. This is the core of all growth — everything flows from this center.',
      tagline: '"Center your faith before your function."',
      color: 'from-emerald-500 to-teal-600',
      borderColor: 'border-emerald-500/30',
      bgColor: 'from-emerald-500/10 to-teal-600/10',
    },
    {
      id: 'health',
      icon: '💪🏽',
      name: 'Health & Fitness',
      description: 'Discipline through the body — physical wellness, gym consistency, mental health, nutrition, and self-discipline.',
      tagline: '"Train your body. Strengthen your mind."',
      color: 'from-red-500 to-rose-600',
      borderColor: 'border-red-500/30',
      bgColor: 'from-red-500/10 to-rose-600/10',
    },
    {
      id: 'medicine',
      icon: '⚕️',
      name: 'Medicine & Healthcare',
      description: 'Serving through healing — for those exploring pre-med, nursing, public health, or medical professions.',
      tagline: '"Serve through science and compassion."',
      color: 'from-blue-500 to-cyan-600',
      borderColor: 'border-blue-500/30',
      bgColor: 'from-blue-500/10 to-cyan-600/10',
    },
    {
      id: 'engineering',
      icon: '⚙️',
      name: 'Engineering & Technology',
      description: 'Building and solving — for innovators in STEM and design who want to leave a real-world impact.',
      tagline: '"Design, build, and solve for tomorrow."',
      color: 'from-purple-500 to-indigo-600',
      borderColor: 'border-purple-500/30',
      bgColor: 'from-purple-500/10 to-indigo-600/10',
    },
    {
      id: 'entrepreneurship',
      icon: '🚀',
      name: 'Entrepreneurship & Innovation',
      description: 'For builders, dreamers, and leaders turning ideas into reality — from startups to social ventures.',
      tagline: '"Build something that outlasts you."',
      color: 'from-orange-500 to-amber-600',
      borderColor: 'border-orange-500/30',
      bgColor: 'from-orange-500/10 to-amber-600/10',
    },
    {
      id: 'global',
      icon: '🌍',
      name: 'Global Affairs & Business',
      description: 'For those navigating global impact — economics, diplomacy, international organizations, and ethical leadership.',
      tagline: '"Lead globally. Move with purpose."',
      color: 'from-teal-500 to-green-600',
      borderColor: 'border-teal-500/30',
      bgColor: 'from-teal-500/10 to-green-600/10',
    },
  ];

  const handleExploreCourt = () => {
    onNavigate('home');
    // Scroll to basketball court after navigation
    setTimeout(() => {
      const courtElement = document.getElementById('basketball-court');
      if (courtElement) {
        courtElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-32 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <span className="px-4 py-2 bg-slate-900 text-orange-400 rounded-full border border-slate-800">
              Six Pathways to Growth
            </span>
          </div>
          <h1 className="text-white mb-4">Explore Your Path</h1>
          <p className="text-slate-400 text-xl max-w-3xl mx-auto">
            ISO offers mentorship across six key pathways. Each pathway is designed to help you grow with discipline, faith, and purpose — guided by coaches who've walked the path before you.
          </p>
        </div>

        {/* Pathways Grid */}
        <div className="space-y-6 mb-16">
          {pathways.map((pathway, index) => (
            <div
              key={pathway.id}
              className={`bg-gradient-to-r ${pathway.bgColor} rounded-2xl border ${pathway.borderColor} p-8 hover:scale-[1.02] transition-transform duration-300`}
            >
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className={`w-20 h-20 bg-gradient-to-br ${pathway.color} rounded-2xl flex items-center justify-center text-4xl shadow-lg`}>
                    {pathway.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-white mb-2">{pathway.name}</h3>
                  <p className="text-slate-300 mb-3">
                    {pathway.description}
                  </p>
                  <p className="text-slate-400 italic">
                    {pathway.tagline}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-8 mb-16">
          <h2 className="text-white text-center mb-8">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-orange-400 text-2xl">1</span>
              </div>
              <h4 className="text-white mb-2">Choose Your Pathway</h4>
              <p className="text-slate-400">
                Select the area where you want to grow. Each pathway has experienced coaches ready to guide you.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-orange-400 text-2xl">2</span>
              </div>
              <h4 className="text-white mb-2">Connect with a Coach</h4>
              <p className="text-slate-400">
                Book a session with a mentor who aligns with your goals and schedule.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-orange-400 text-2xl">3</span>
              </div>
              <h4 className="text-white mb-2">Start Getting Buckets</h4>
              <p className="text-slate-400">
                Set micro-goals, win games, and work toward your championship ring — all while building discipline and faith.
              </p>
            </div>
          </div>
        </div>

        {/* Progress System Overview */}
        <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-2xl border border-orange-500/30 p-6 mb-8">
          <h2 className="text-white text-center mb-2">The ISO Progress System</h2>
          <p className="text-slate-400 text-center mb-6 text-sm">
            Progress through levels based on your commitment and growth. Start where you're ready.
          </p>
          
          {/* Progress Bar */}
          <div className="relative mb-6">
            {/* Background Bar */}
            <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
              {/* Segments */}
              <div className="h-full flex">
                <div className="h-full bg-gradient-to-r from-green-500 to-emerald-600" style={{ width: '20%' }}></div>
                <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-600" style={{ width: '20%' }}></div>
                <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-600" style={{ width: '20%' }}></div>
                <div className="h-full bg-gradient-to-r from-orange-500 to-amber-600" style={{ width: '20%' }}></div>
                <div className="h-full bg-gradient-to-r from-yellow-500 to-orange-600" style={{ width: '20%' }}></div>
              </div>
            </div>
            
            {/* Level Labels */}
            <div className="flex justify-between mt-3">
              {[
                { level: 'Freshman', icon: '🌱', minTime: '3mo' },
                { level: 'JV', icon: '📚', minTime: '3mo' },
                { level: 'Varsity', icon: '⭐', minTime: '4mo' },
                { level: 'D1', icon: '🏆', minTime: '6mo' },
                { level: 'Professional', icon: '💎', minTime: 'Ongoing', special: true }
              ].map((stage, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div className="text-2xl mb-1">{stage.icon}</div>
                  <div className="text-white text-xs font-semibold text-center">{stage.level}</div>
                  <div className="text-orange-400 text-xs mt-0.5">{stage.minTime}</div>
                  {stage.special && (
                    <div className="text-yellow-400 text-xs mt-1">✨ Mentor</div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Key Points */}
          <div className="pt-4 border-t border-orange-500/20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <span className="text-orange-400 text-lg">🎯</span>
                <div>
                  <h4 className="text-white text-sm font-semibold mb-1">Start Where You're Ready</h4>
                  <p className="text-slate-400 text-xs">
                    Your initial level is determined by your knowledge base and experience. No need to start from the beginning if you're already advanced.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-orange-400 text-lg">⏱️</span>
                <div>
                  <h4 className="text-white text-sm font-semibold mb-1">Minimum Timeframes</h4>
                  <p className="text-slate-400 text-xs">
                    Each level has a minimum commitment period to ensure proper growth and mastery before advancing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* How Progress Works */}
        <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-8 mb-16">
          <h2 className="text-white text-center mb-8">How Progress Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-orange-400 text-2xl">🏀</span>
              </div>
              <h4 className="text-white mb-2">Get Buckets (Micro-Goals)</h4>
              <p className="text-slate-400">
                Small, actionable steps you take each week. Every bucket counts toward winning the game.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-orange-400 text-2xl">🏆</span>
              </div>
              <h4 className="text-white mb-2">Win Games (Major Milestones)</h4>
              <p className="text-slate-400">
                Complete a series of buckets to win a game. Each game represents a significant achievement in your pathway.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-orange-400 text-2xl">⬆️</span>
              </div>
              <h4 className="text-white mb-2">Level Up</h4>
              <p className="text-slate-400">
                After meeting minimum timeframes and completing required games, you advance to the next level.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <p className="text-slate-400 mb-6">
            Ready to start your journey?
          </p>
          <button className="inline-flex items-center gap-2 px-8 py-4 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors" onClick={handleExploreCourt}>
            Explore the Court
          </button>
        </div>
      </div>
    </div>
  );
}