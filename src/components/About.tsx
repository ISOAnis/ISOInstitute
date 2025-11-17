import * as React from 'react';

export function About() {
  return (
    <div className="min-h-screen bg-slate-950 pt-32 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* ISO Institute Title */}
        <div className="text-center mb-16">
          <h1 className="text-white mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(3rem, 8vw, 5rem)', letterSpacing: '0.1em' }}>
            ISO Institute
          </h1>
          <p className="text-slate-300 text-xl md:text-2xl mb-8">"In Search Of"</p>
        </div>

        {/* Main Content */}
        <div className="space-y-12 mb-16">
          {/* ISO Basketball Explanation */}
          <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-8">
            <p className="text-slate-300 text-lg md:text-xl leading-relaxed">
              In basketball, an ISO (isolation) play is when it's one-on-one — you vs. your defender.
            </p>
          </div>

          <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-8">
            <p className="text-slate-300 text-lg md:text-xl leading-relaxed">
              But sometimes, the biggest defender isn't in front of you — it's you.
            </p>
          </div>

          <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-8">
            <p className="text-slate-300 text-lg md:text-xl leading-relaxed">
              ISO stands for In Search Of — because we all find ourselves searching for something: guidance, clarity, purpose, or simply a next step.
            </p>
          </div>

          {/* Mission Statement */}
          <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-2xl border border-orange-500/30 p-8">
            <p className="text-white text-xl md:text-2xl leading-relaxed italic text-center">
                  "Our goal is to bring youth into the proximity of success by creating an intuitive space where coaching, faith, and purpose intersect."
            </p>
          </div>

          {/* Founder Story */}
          <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-8">
            <p className="text-slate-300 text-lg md:text-xl leading-relaxed mb-6">
              The ISO Mentorship Institute is built by <span className="text-white font-semibold">Anis Benyoucef</span>, a first-generation Algerian-American, who has been through the same crossroads — someone who know what it feels like to be confused, stuck, or uncertain about what's next.
            </p>
            <p className="text-slate-300 text-lg md:text-xl leading-relaxed">
              This isn't just about career advice. It's about life coaching: spiritual growth, professional direction, and personal courage.
            </p>
          </div>

          {/* Calling an ISO */}
          <div className="bg-gradient-to-r from-slate-900 via-orange-900/20 to-slate-900 rounded-2xl border-2 border-orange-500/30 p-8">
            <p className="text-white text-xl md:text-2xl leading-relaxed mb-6">
              When you "call an ISO," you're not going 1-on-1 against yourself — you're stepping into a conversation with someone who's going to challenge you, guide you, and help you take smarter shots.
            </p>
            <p className="text-slate-300 text-lg md:text-xl leading-relaxed">
              We won't hand you easy buckets; we'll help you build the confidence and mindset to create your own.
            </p>
          </div>

          {/* Closing Message */}
          <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-8 text-center">
            <p className="text-white text-xl md:text-2xl leading-relaxed">
              Whether you're in search of coaching, opportunity, or simply perspective — this is where your growth starts.
            </p>
          </div>
        </div>

        {/* Additional Content Section from Hero */}
        <div className="mt-20 pt-16 border-t border-slate-800">
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                ISO Institute: <span className="text-orange-500">"In Search Of"</span>
              </h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <p className="text-slate-300 text-lg">
                  In basketball, an <span className="text-orange-400 font-semibold">ISO (isolation)</span> play is when it's one-on-one — you vs. your defender.
                </p>
                <p className="text-slate-300 text-lg">
                  But sometimes, the biggest defender isn't in front of you — <span className="text-white italic">it's you.</span>
                </p>
              </div>

              <div className="py-6 px-6 bg-slate-900/50 rounded-2xl border border-slate-800">
                <p className="text-slate-200">
                  <span className="text-orange-400 font-semibold">ISO</span> stands for <span className="text-orange-400 font-semibold">In Search Of</span> — because we all find ourselves searching for something: guidance, clarity, purpose, or simply a next step.
                </p>
              </div>

              <div className="py-6 px-6 bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-2xl border border-orange-500/30">
                <p className="text-white italic text-lg">
                  "Our goal is to bring youth into the proximity of success by creating an intuitive space where coaching, faith, and purpose intersect."
                </p>
              </div>

              <div className="space-y-4 text-slate-300">
                <p>
                  The ISO Mentorship Institute is built by Anis Benyoucef, a first-generation Algerian-American, who has been through the same crossroads — someone who know what it feels like to be confused, stuck, or uncertain about what's next. This isn't just about career advice. It's about <span className="text-white font-semibold">life coaching</span>: spiritual growth, professional direction, and personal courage.
                </p>

                <p>
                  When you <span className="text-orange-400 font-semibold">"call an ISO,"</span> you're not going 1-on-1 against yourself — you're stepping into a conversation with someone who's going to challenge you, guide you, and help you take smarter shots. We won't hand you easy buckets; we'll help you build the confidence and mindset to create your own.
                </p>

                <p className="text-slate-200">
                  Whether you're in search of coaching, opportunity, or simply perspective — <span className="text-orange-400 font-semibold">this is where your growth starts.</span>
                </p>
              </div>

              {/* CTA */}
              <div className="pt-4">
                <button
                  onClick={() => {
                    window.location.href = '/#basketball-court';
                  }}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors font-semibold"
                >
                  Explore the Court
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}