import * as React from "react";

const stats = [
  { label: "Young people mentored", value: "250+" },
  { label: "Faith-centered coaches", value: "45" },
  { label: "Cities represented", value: "18" },
  { label: "Mentee satisfaction", value: "97%" },
];

const milestones = [
  {
    year: "2018",
    title: "The ISO spark",
    copy: "Anis begins informal coaching circles to help Muslim students navigate faith, academics, and purpose.",
  },
  {
    year: "2021",
    title: "Court culture",
    copy: "The basketball metaphor becomes our operating system: one court, trusted coaches, and a scoreboard that tracks character as much as outcomes.",
  },
  {
    year: "2024",
    title: "ISO Institute",
    copy: "We formalize our playbook with curated mentors, immersive coaching nights, and a product experience focused on proximity to success.",
  },
];

const values = [
  {
    label: "Faith x Ambition",
    copy: "Spiritual practice is the anchor, ambition is the engine. We train both.",
  },
  {
    label: "Coaching > Content",
    copy: "Mentees don't need another motivational thread—they need a disciplined coach in their corner.",
  },
  {
    label: "Proximity builds courage",
    copy: "We engineer rooms, not feeds. When you sit next to excellence, your next move becomes obvious.",
  },
];

export function About() {
  return (
    <div className="relative min-h-screen bg-[#0a0e27] text-white overflow-hidden">
      {/* Subtle background gradients */}
      <div className="absolute right-0 top-0 h-[600px] w-[600px] bg-orange-500/10 blur-[180px]" />
      <div className="absolute left-0 bottom-0 h-[400px] w-[400px] bg-blue-500/5 blur-[160px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-32">
        
        {/* HERO SECTION - Clear focal point */}
        <section className="mb-32 text-center max-w-4xl mx-auto">
          <p className="text-sm uppercase tracking-[0.3em] text-orange-500 mb-6 font-semibold">
            ISO INSTITUTE
          </p>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] mb-8">
            In Search Of{" "}
            <span className="text-orange-500">clarity</span>,{" "}
            <span className="text-orange-500">discipline</span>, and{" "}
            <span className="text-orange-500">spiritual edge</span>
          </h1>
          <p className="text-xl text-slate-300 leading-relaxed mb-12 max-w-3xl mx-auto">
            On the court, an ISO is one-on-one. In life, it's you vs. distraction, self-doubt, and inertia. We build coaching environments where Muslim youth can attack the lane with confidence—rooted in deen, sharpened by ambition.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-10 py-4 rounded-full bg-orange-500 hover:bg-orange-600 transition-all font-semibold text-lg shadow-lg shadow-orange-500/20">
              Call an ISO
            </button>
            <button className="px-10 py-4 rounded-full border-2 border-slate-700 hover:border-orange-500 transition-all font-semibold text-lg">
              Learn More
            </button>
          </div>
        </section>

        {/* STATS BAR - Clean, scannable */}
        <section className="mb-32">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="text-center p-8 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-orange-500/30 transition-all"
              >
                <p className="text-5xl font-bold text-orange-500 mb-3">
                  {stat.value}
                </p>
                <p className="text-sm uppercase tracking-wider text-slate-400">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* MISSION STATEMENT - Featured prominently */}
        <section className="mb-32">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-slate-900 to-slate-900/50 border border-slate-800 rounded-3xl p-12 shadow-2xl">
            <div className="flex items-start gap-6">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-3xl flex-shrink-0">
                ☪️
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-orange-500 mb-4 font-semibold">
                  Why we exist
                </p>
                <p className="text-2xl text-slate-100 leading-relaxed mb-6">
                  "We bring youth into the proximity of success by pairing them with coaches who protect their iman and push their ambition. No vague inspiration—just disciplined reps for the mind, body, and heart."
                </p>
                <div className="pt-4 border-t border-slate-800">
                  <p className="font-semibold text-lg">Anis Benyoucef</p>
                  <p className="text-slate-400">Founder & Lead Coach</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* VALUES - Clear grid layout */}
        <section className="mb-32">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-[0.3em] text-orange-500 mb-4 font-semibold">
              Our Values
            </p>
            <h2 className="text-4xl lg:text-5xl font-bold">What Drives Us</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value) => (
              <div
                key={value.label}
                className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-orange-500/50 transition-all"
              >
                <h3 className="text-xl font-bold text-orange-500 mb-4">
                  {value.label}
                </h3>
                <p className="text-slate-300 leading-relaxed">{value.copy}</p>
              </div>
            ))}
          </div>
        </section>

        {/* TIMELINE - Visual story */}
        <section className="mb-32">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-[0.3em] text-orange-500 mb-4 font-semibold">
              Our Journey
            </p>
            <h2 className="text-4xl lg:text-5xl font-bold">The ISO Timeline</h2>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-12 relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-500 via-orange-500/50 to-transparent" />
              {milestones.map((milestone, index) => (
                <div key={milestone.year} className="relative pl-20">
                  <div className="absolute left-5 top-2 h-6 w-6 rounded-full bg-orange-500 border-4 border-[#0a0e27] shadow-lg shadow-orange-500/50" />
                  <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800">
                    <p className="text-sm uppercase tracking-widest text-orange-500 font-semibold mb-2">
                      {milestone.year}
                    </p>
                    <h3 className="text-2xl font-bold mb-3">{milestone.title}</h3>
                    <p className="text-slate-300 leading-relaxed">{milestone.copy}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PROGRAMS - Simplified grid */}
        <section className="mb-32">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-[0.3em] text-orange-500 mb-4 font-semibold">
              What We Offer
            </p>
            <h2 className="text-4xl lg:text-5xl font-bold">Our Programs</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-orange-500/50 transition-all">
              <h4 className="text-2xl font-bold mb-4">Court Sessions</h4>
              <p className="text-slate-300 leading-relaxed">
                Live coaching nights where mentees break down film (their goals) with pros who've walked the exact path.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-orange-500/50 transition-all">
              <h4 className="text-2xl font-bold mb-4">One-on-One Residencies</h4>
              <p className="text-slate-300 leading-relaxed">
                6-week coaching arcs pairing mentees with a mentor that tracks spiritual reps, craft, and execution.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-orange-500/50 transition-all">
              <h4 className="text-2xl font-bold mb-4">Pathway Pods</h4>
              <p className="text-slate-300 leading-relaxed">
                Micro communities (health, medicine, tech, entrepreneurship) moderated by mentors and alumni.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-orange-500/50 transition-all">
              <h4 className="text-2xl font-bold mb-4">Faith & Focus Labs</h4>
              <p className="text-slate-300 leading-relaxed">
                Breathwork, dua journaling, and discipline drills that keep the heart right while the grind intensifies.
              </p>
            </div>
          </div>
        </section>

        {/* NORTH STAR - Clear emphasis */}
        <section className="mb-32">
          <div className="max-w-3xl mx-auto text-center p-12 rounded-3xl bg-gradient-to-br from-orange-500/10 to-transparent border-2 border-orange-500/30">
            <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 text-5xl mb-6 shadow-2xl shadow-orange-500/50">
              ✦
            </div>
            <p className="text-sm uppercase tracking-[0.3em] text-orange-500 mb-4 font-semibold">
              North Star
            </p>
            <p className="text-3xl font-bold leading-relaxed">
              Proximity to excellence + anchored iman = unstoppable confidence
            </p>
          </div>
        </section>

        {/* CTA - Strong close */}
        <section className="text-center">
          <div className="max-w-4xl mx-auto p-12 rounded-3xl bg-slate-900/60 border border-slate-800">
            <p className="text-sm uppercase tracking-[0.3em] text-orange-500 mb-6 font-semibold">
              Ready to start?
            </p>
            <p className="text-3xl lg:text-4xl font-bold leading-relaxed mb-10">
              Whether you're hunting for the right mentor, a clearer career lane, or spiritual accountability—ISO is that timeout where you stop playing small and start running the right play.
            </p>
            <button className="px-12 py-5 rounded-full bg-orange-500 hover:bg-orange-600 transition-all font-semibold text-lg shadow-xl shadow-orange-500/30">
              Step Onto the Court
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}