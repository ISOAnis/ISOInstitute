import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

export function FAQ() {
  return (
    <div className="min-h-screen bg-slate-950 pt-32 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Page Title */}
        <div className="text-center mb-16">
          <h1 className="text-white mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2.5rem, 6vw, 4rem)', letterSpacing: '0.1em' }}>
            Frequently Asked Questions
          </h1>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="bg-slate-900/50 rounded-2xl border border-slate-800 px-6 py-4 mb-4">
              <AccordionTrigger className="text-white text-lg font-semibold hover:text-orange-500 transition-colors">
                How do ISO pathways work?
              </AccordionTrigger>
              <AccordionContent className="text-slate-300 text-base leading-relaxed pt-4">
                ISO pathways are coaching categories that connect players with coaches who specialize in specific fields. Each pathway — The Seeker (Deen and Purpose), The Warrior (Health and Wellness), The Healer (Medicine and healthcare), The Builder (Engineering and Tech), The Founder (Entrepreneurship and business), and The Reformer (Global Affairs, Law, and Policy) — offers curated coaching resources, community support, and pathway-specific guidance to help you navigate your journey.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="bg-slate-900/50 rounded-2xl border border-slate-800 px-6 py-4 mb-4">
              <AccordionTrigger className="text-white text-lg font-semibold hover:text-orange-500 transition-colors">
                How do I choose a coach?
              </AccordionTrigger>
              <AccordionContent className="text-slate-300 text-base leading-relaxed pt-4">
                Browse coaches by pathway to see their profiles, experience, specialties, and overall rating. Each coach card shows their background, expertise areas, session history, and response time. Use the filters to search by pathway, sort by rating or availability, and view coach cards to learn more about their coaching style before booking a session or committing to a program.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="bg-slate-900/50 rounded-2xl border border-slate-800 px-6 py-4 mb-4">
              <AccordionTrigger className="text-white text-lg font-semibold hover:text-orange-500 transition-colors">
                What are the Walk-On, Locker Room, and Varsity programs?
              </AccordionTrigger>
              <AccordionContent className="text-slate-300 text-base leading-relaxed pt-4">
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-orange-500 mb-2">Walk-On (Free)</p>
                    <p>30-minute monthly check-ins, access to coaching nights & events, pathway-specific resources, and community support.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-orange-500 mb-2">Locker Room ($15/month)</p>
                    <p>Three 30-minute try outs per month with different coaches in your locked pathway, plus Locker Room chat, goals, community, and the online ISO store. All Locker Room revenue supports ISO — coaches earn when you Call an ISO and join them on the ISO Pass.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-orange-500 mb-2">ISO Pass (coach sets price · ISO 15% fee)</p>
                    <p>Everything in Locker Room, plus weekly 1:1 with your dedicated coach, DMs, playbook, and ISO progress tracking. Coaches set their monthly rate; ISO takes a 15% platform fee. Scholarship path available via the ISO Foundation.</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="bg-slate-900/50 rounded-2xl border border-slate-800 px-6 py-4 mb-4">
              <AccordionTrigger className="text-white text-lg font-semibold hover:text-orange-500 transition-colors">
                What does a coach's "overall" mean?
              </AccordionTrigger>
              <AccordionContent className="text-slate-300 text-base leading-relaxed pt-4">
                <p className="mb-4">
                  A coach's "overall" is their ISO rating on a scale of 70-99. This rating reflects their impact, consistency, and contributions within the ISO community.
                </p>
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold text-orange-500 mb-1">70-79: Standard</p>
                    <p className="text-sm">Entry-level coaches building their ISO presence.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-orange-500 mb-1">80-89: Specialist</p>
                    <p className="text-sm">Proven coaches with consistent impact and activity.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-orange-500 mb-1">90-99: Premium</p>
                    <p className="text-sm">Elite coaches who've demonstrated exceptional coaching, community contribution, and transformative impact. Premium can only be earned inside ISO through sustained excellence.</p>
                  </div>
                </div>
                <p className="mt-4">
                  Ratings are earned through coaching nights, sessions completed, video contributions to The Locker Room, workshops, reviews, community engagement, and consistent activity over time.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="bg-slate-900/50 rounded-2xl border border-slate-800 px-6 py-4 mb-4">
              <AccordionTrigger className="text-white text-lg font-semibold hover:text-orange-500 transition-colors">
                If I'm an experienced coach, do I start at the bottom?
              </AccordionTrigger>
              <AccordionContent className="text-slate-300 text-base leading-relaxed pt-4">
                <p className="mb-4">
                  No! Experienced coaches start with a higher baseline based on their Experience Tier:
                </p>
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold text-orange-500 mb-1">Entry Tier</p>
                    <p className="text-sm">Starting overall: 70-75 (Standard)</p>
                  </div>
                  <div>
                    <p className="font-semibold text-orange-500 mb-1">Pro Tier</p>
                    <p className="text-sm">Starting overall: 76-80 (Standard/Specialist Provisional)</p>
                  </div>
                  <div>
                    <p className="font-semibold text-orange-500 mb-1">Expert Tier</p>
                    <p className="text-sm">Starting overall: 81-88 (Specialist Provisional)</p>
                  </div>
                  <div>
                    <p className="font-semibold text-orange-500 mb-1">Master Tier</p>
                    <p className="text-sm">Starting overall: 81-88 (Specialist Provisional)</p>
                  </div>
                </div>
                <p className="mt-4">
                  However, <span className="font-semibold text-orange-500">Premium (90-99) can only be earned inside ISO</span> through coaching impact, community contribution, and sustained excellence within our ecosystem.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="bg-slate-900/50 rounded-2xl border border-slate-800 px-6 py-4 mb-4">
              <AccordionTrigger className="text-white text-lg font-semibold hover:text-orange-500 transition-colors">
                How do coaches level up?
              </AccordionTrigger>
              <AccordionContent className="text-slate-300 text-base leading-relaxed pt-4">
                <p className="mb-4">Coaches increase their overall and progress through badges by:</p>
                <ul className="space-y-2 list-disc list-inside ml-4">
                  <li><span className="font-semibold">Coaching nights:</span> Participating in and leading community events</li>
                  <li><span className="font-semibold">Sessions completed:</span> Consistent engagement with players</li>
                  <li><span className="font-semibold">Video contributions:</span> Adding valuable content to The Locker Room</li>
                  <li><span className="font-semibold">Community contribution:</span> Supporting pathway discussions and workshops</li>
                  <li><span className="font-semibold">Reviews:</span> Receiving positive feedback from players</li>
                  <li><span className="font-semibold">Workshops:</span> Hosting and contributing to educational sessions</li>
                  <li><span className="font-semibold">Consistency:</span> Regular activity and engagement over time</li>
                </ul>
                <p className="mt-4">
                  Your overall rating evolves based on your impact, not just time. Premium status requires demonstrating transformative coaching and exceptional community contribution.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}

