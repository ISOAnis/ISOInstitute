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
    copy: "Mentees don’t need another motivational thread—they need a disciplined coach in their corner.",
  },
  {
    label: "Proximity builds courage",
    copy: "We engineer rooms, not feeds. When you sit next to excellence, your next move becomes obvious.",
  },
];

export function About() {
  return (
    <div className="relative min-h-screen bg-slate-950 text-white overflow-hidden">
      <div className="absolute -right-24 -top-24 h-96 w-96 bg-orange-500/20 blur-[140px]" />
      <div className="absolute left-1/4 top-1/3 h-72 w-72 bg-cyan-500/10 blur-[160px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-32 space-y-24">
        <section className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-slate-400 mb-4">
              ISO INSTITUTE
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              In Search Of{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">
                clarity
              </span>
              , discipline, and spiritual edge.
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed mb-8">
              On the court, an ISO is one-on-one. In life, it’s you vs.
              distraction, self-doubt, and inertia. We build coaching
              environments where Muslim youth can attack the lane with
              confidence—rooted in deen, sharpened by ambition.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="px-8 py-3 rounded-full bg-orange-500 hover:bg-orange-600 transition-colors font-semibold"
              >
                Call an ISO
              </button>
              <button
                onClick={() =>
                  document
                    .getElementById("about-mission")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="px-8 py-3 rounded-full border border-white/20 text-white/80 hover:text-white hover:border-white transition-colors"
              >
                See the mission
              </button>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-sm">
            <p className="text-sm uppercase tracking-[0.3em] text-orange-300 mb-4">
              Why we exist
            </p>
            <p className="text-lg text-slate-100 leading-relaxed mb-6">
              “We bring youth into the proximity of success by pairing them with
              coaches who protect their iman and push their ambition. No vague
              inspiration—just disciplined reps for the mind, body, and heart.”
            </p>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-2xl">
                ☪️
              </div>
              <div>
                <p className="font-semibold">Anis Benyoucef</p>
                <p className="text-sm text-slate-400">Founder & Lead Coach</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/5 bg-gradient-to-b from-white/5 to-transparent p-6 text-center"
            >
              <p className="text-3xl font-semibold text-white mb-2">
                {stat.value}
              </p>
              <p className="text-sm uppercase tracking-wide text-slate-400">
                {stat.label}
              </p>
            </div>
          ))}
        </section>

        <section
          id="about-mission"
          className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] items-start"
        >
          <div className="bg-slate-900/60 border border-white/5 rounded-3xl p-8 space-y-8">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
              Our identity
            </p>
            <h2 className="text-3xl font-semibold leading-tight">
              ISO is a Muslim-built coaching lab for young adults who crave
              tactical mentorship.
            </h2>
            <div className="space-y-5">
              {values.map((value) => (
                <div
                  key={value.label}
                  className="border border-white/5 rounded-2xl p-5 bg-white/5"
                >
                  <p className="text-orange-300 text-sm uppercase tracking-wide mb-1">
                    {value.label}
                  </p>
                  <p className="text-slate-200">{value.copy}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500/20 via-pink-500/10 to-slate-900 rounded-3xl border border-white/10 p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-orange-200 mb-6">
              Timeline
            </p>
            <div className="space-y-8 relative">
              <div className="absolute left-6 top-0 bottom-0 w-px bg-white/20" />
              {milestones.map((milestone) => (
                <div key={milestone.year} className="relative pl-12">
                  <div className="absolute left-4 top-2 h-3 w-3 rounded-full bg-orange-400 shadow-[0_0_12px_rgba(251,146,60,0.7)]" />
                  <p className="text-sm uppercase tracking-widest text-slate-400">
                    {milestone.year}
                  </p>
                  <h3 className="text-xl font-semibold mb-1">
                    {milestone.title}
                  </h3>
                  <p className="text-slate-200">{milestone.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-3 items-start">
          <div className="lg:col-span-2 bg-slate-900/70 border border-white/5 rounded-3xl p-8 h-full">
            <p className="text-sm uppercase tracking-[0.4em] text-slate-400 mb-4">
              Programs
            </p>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-white/5 p-6 bg-gradient-to-br from-slate-900 to-slate-900/40 h-full flex flex-col">
                <h4 className="text-xl font-semibold mb-2">Court sessions</h4>
                <p className="text-slate-300">
                  Live coaching nights where mentees break down film (their
                  goals) with pros who’ve walked the exact path.
                </p>
              </div>
              <div className="rounded-2xl border border-white/5 p-6 bg-gradient-to-br from-slate-900 to-slate-900/40 h-full flex flex-col">
                <h4 className="text-xl font-semibold mb-2">
                  One-on-one residencies
                </h4>
                <p className="text-slate-300">
                  6-week coaching arcs pairing mentees with a mentor that tracks
                  spiritual reps, craft, and execution.
                </p>
              </div>
              <div className="rounded-2xl border border-white/5 p-6 bg-gradient-to-br from-slate-900 to-slate-900/40 h-full flex flex-col">
                <h4 className="text-xl font-semibold mb-2">Pathway pods</h4>
                <p className="text-slate-300">
                  Micro communities (health, medicine, tech, entrepreneurship)
                  moderated by mentors and alumni.
                </p>
              </div>
              <div className="rounded-2xl border border-white/5 p-6 bg-gradient-to-br from-slate-900 to-slate-900/40 h-full flex flex-col">
                <h4 className="text-xl font-semibold mb-2">
                  Faith & focus labs
                </h4>
                <p className="text-slate-300">
                  Breathwork, dua journaling, and discipline drills that keep
                  the heart right while the grind intensifies.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-b from-white/10 to-transparent border border-white/10 rounded-3xl p-8 flex flex-col justify-between h-full">
            <p className="text-sm uppercase tracking-[0.4em] text-slate-300 mb-4">
              Founder story
            </p>
            <h4 className="text-2xl font-semibold mb-3">
              Built by someone in the trenches
            </h4>
            <p className="text-slate-200 mb-6">
              “I’m a first-gen Algerian-American who hacked my way through
              medicine, startups, and community work. ISO is the platform I
              wished existed—a place where Muslim youth can ask the real
              questions without code-switching.”
            </p>
            {/* North star moved to its own spotlight section at page bottom */}
          </div>
        </section>

        {/* North Star spotlight — moved above Final word and intensified */}
        <section className="mt-12 flex justify-center">
          <div className="relative w-full max-w-3xl px-4">
            <div className="mx-auto rounded-3xl bg-gradient-to-br from-slate-900/70 to-transparent border border-white/10 p-8 text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="relative">
                  <div className="north-star inline-flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-yellow-300 to-amber-200 text-slate-900 text-3xl">
                    ✦
                  </div>
                  <div
                    className="absolute inset-0 rounded-full star-glow-pointer"
                    aria-hidden="true"
                  />
                </div>
              </div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400 mb-2">
                North star
              </p>
              <p className="text-lg text-slate-100">
                Proximity to excellence + anchored iman = unstoppable
                confidence.
              </p>
            </div>

            <style>{`
              .north-star {
                box-shadow: 0 0 48px rgba(255, 220, 120, 0.35), 0 18px 80px rgba(255, 180, 60, 0.22);
                transform-origin: center;
                animation: northPulse 2000ms infinite ease-in-out;
                filter: saturate(1.15) brightness(1.12);
              }

              .star-glow-pointer {
                pointer-events: none;
              }

              .star-glow-pointer::before {
                content: '';
                position: absolute;
                inset: -18px;
                border-radius: 9999px;
                background: radial-gradient(circle at 30% 30%, rgba(255,250,220,0.95), rgba(255,230,140,0.45) 18%, rgba(255,200,70,0.18) 36%, transparent 60%);
                filter: blur(28px) contrast(1.05);
                opacity: 1;
                animation: starTwinkle 2800ms infinite ease-in-out;
              }

              @keyframes northPulse {
                0% { transform: scale(1); filter: drop-shadow(0 0 0 rgba(255, 200, 80, 0)); }
                45% { transform: scale(1.12) rotate(-3deg); filter: drop-shadow(0 20px 80px rgba(255, 200, 80, 0.28)); }
                100% { transform: scale(1); filter: drop-shadow(0 0 0 rgba(255, 200, 80, 0)); }
              }

              @keyframes starTwinkle {
                0% { opacity: 0.9; transform: scale(1); }
                25% { opacity: 1; transform: scale(1.06); }
                55% { opacity: 0.75; transform: scale(0.98); }
                100% { opacity: 0.9; transform: scale(1); }
              }

              @media (prefers-reduced-motion: reduce) {
                .north-star, .star-glow-pointer::before {
                  animation: none !important;
                }
              }
            `}</style>
          </div>
        </section>

        <section className="bg-slate-900/70 border border-white/5 rounded-3xl p-10 pb-16 text-center space-y-5">
          <p className="text-sm uppercase tracking-[0.4em] text-slate-400">
            Final word
          </p>
          <p className="text-2xl md:text-3xl leading-relaxed text-slate-100">
            Whether you're hunting for the right mentor, a clearer career lane,
            or spiritual accountability—ISO is that timeout where you stop
            playing small and start running the right play.
          </p>
          <div className="flex justify-center mt-6">
            <button
              onClick={() => window.location.assign("#basketball-court")}
              className="px-10 py-3 rounded-full bg-orange-500 hover:bg-orange-600 transition-colors font-semibold"
            >
              Step onto the court
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
