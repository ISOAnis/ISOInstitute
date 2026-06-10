import { Calendar, Shield, Clock, Users, TrendingUp, Heart, Phone, MessageSquare, Video } from 'lucide-react';

export function ISOCommunity() {
  const features = [
    {
      icon: Calendar,
      title: 'Structured Scheduling',
      description: 'Replace scattered WhatsApp messages and missed calls with organized booking system that respects prayer times.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Shield,
      title: 'Privacy & Confidentiality',
      description: 'Secure platform for sensitive discussions — counseling, family mediation, and personal guidance.',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Clock,
      title: 'Prayer Time Integration',
      description: 'Automatically blocks scheduling during salah times and accounts for Friday Jummah commitments.',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: TrendingUp,
      title: 'Community Analytics',
      description: 'Track session types, time allocation, and community needs to serve more effectively.',
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: Heart,
      title: 'Donation-Based Bookings',
      description: 'Optional sadaqah system for those who wish to support — never mandatory, always dignified.',
      color: 'from-pink-500 to-pink-600'
    },
    {
      icon: Users,
      title: 'Community Directory',
      description: 'Manage ongoing cases, follow-ups, and maintain continuity of care with your community members.',
      color: 'from-teal-500 to-teal-600'
    }
  ];

  const sessionTypes = [
    { emoji: '🤲', name: 'Spiritual Counseling', description: 'Faith guidance and Islamic advice' },
    { emoji: '💔', name: 'Marriage & Divorce', description: 'Mediation and family counseling' },
    { emoji: '📿', name: 'Ruqya Sessions', description: 'Spiritual healing and protection' },
    { emoji: '🕌', name: 'Convert Support', description: 'New Muslim guidance and coacheship' },
    { emoji: '💭', name: 'Mental Health', description: 'Islamic perspective on wellbeing' },
    { emoji: '⚖️', name: 'Community Disputes', description: 'Mediation and conflict resolution' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 pt-32 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <span className="px-4 py-2 bg-slate-900 text-orange-400 rounded-full border border-slate-800">
              ISO Community Module
            </span>
          </div>
          <h1 className="text-white mb-6">Community Leadership Tools</h1>
          <p className="text-slate-300 text-xl max-w-3xl mx-auto mb-4">
            The same coacheship platform — now available for community leaders.
          </p>
          <p className="text-slate-400 max-w-2xl mx-auto mb-8">
            ISO also offers an optional community module for imams, chaplains, and leaders to manage counseling sessions, 
            meetings, and community requests with the same structure and discipline that drives our coacheship institute.
          </p>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Streamlines scheduling, integrates prayer times, ensures privacy, and allows for optional donation-based bookings — 
            helping those who guide others focus on what truly matters: <span className="text-orange-400">serving their communities with clarity, balance, and barakah.</span>
          </p>
        </div>

        {/* The Problem */}
        <div className="mb-20">
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-slate-700 p-8 md:p-12">
            <h2 className="text-white text-center mb-8">Every Masjid Faces This Daily</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start gap-4 p-6 bg-slate-900/50 rounded-xl border border-slate-700">
                <Phone className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-white mb-2">Scattered Requests</h4>
                  <p className="text-slate-400 text-sm">
                    People calling or texting for counseling, divorce mediation, ruqya, or Islamic advice with no centralized system.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-slate-900/50 rounded-xl border border-slate-700">
                <Calendar className="w-6 h-6 text-orange-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-white mb-2">No Structure</h4>
                  <p className="text-slate-400 text-sm">
                    No organized way to schedule or track sessions — everything is verbal commitments and mental notes.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-slate-900/50 rounded-xl border border-slate-700">
                <MessageSquare className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-white mb-2">Communication Chaos</h4>
                  <p className="text-slate-400 text-sm">
                    Burnout from managing DMs, missed calls, WhatsApp messages across multiple platforms.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-slate-900/50 rounded-xl border border-slate-700">
                <TrendingUp className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-white mb-2">No Visibility</h4>
                  <p className="text-slate-400 text-sm">
                    No analytics or clear view of what they're spending time on or how to prioritize community needs.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-orange-900/20 border border-orange-700/50 rounded-xl p-6 text-center">
              <p className="text-slate-300">
                In small and medium communities, most imams don't have staff — they're spiritual leaders, admin assistants, 
                and counselors all in one. <span className="text-orange-400">ISO Community solves this operational pain point</span> that 
                directly improves mental health, productivity, and community access.
              </p>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-20">
          <h2 className="text-white text-center mb-12">Platform Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} bg-opacity-10 flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-400 text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Session Types */}
        <div className="mb-20">
          <h2 className="text-white text-center mb-12">Session Types You Can Manage</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sessionTypes.map((session, index) => (
              <div 
                key={index}
                className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 hover:bg-slate-900 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{session.emoji}</span>
                  <div>
                    <h4 className="text-white">{session.name}</h4>
                    <p className="text-slate-500 text-sm">{session.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-orange-900/30 via-orange-800/20 to-orange-900/30 border-2 border-orange-500/30 rounded-2xl p-12 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-white mb-4">Ready to Serve Your Community Better?</h2>
            <p className="text-slate-300 mb-8">
              Join imams and community leaders who are using ISO Community to bring structure, 
              balance, and barakah to their service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-orange-500 text-white px-8 py-4 rounded-full hover:bg-orange-600 transition-colors">
                Access Community Leader Portal
              </button>
              <button className="bg-slate-800 text-white px-8 py-4 rounded-full hover:bg-slate-700 transition-colors border border-slate-700">
                Schedule a Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}