export type FAQItem = {
  id: string;
  question: string;
  answer: string;
  /** Render pathway grid instead of plain text */
  variant?: 'pathways';
};

export type FAQSection = {
  id: string;
  title: string;
  items: FAQItem[];
};

export const FAQ_SECTIONS: FAQSection[] = [
  {
    id: 'about-iso',
    title: 'About ISO',
    items: [
      {
        id: 'what-is-iso',
        question: 'What is ISO?',
        answer:
          'ISO is a cultural movement built on community, courage, and service — for people actively In Search Of growth. The ISO Institute is the development platform where that mission comes to life: real coaches, real accountability, and mentorship across six life pathways — not through AI or push notifications, but through human connection.',
      },
      {
        id: 'what-does-iso-stand-for',
        question: 'What does ISO stand for?',
        answer:
          "ISO stands for In Search Of. In basketball, an ISO is when a player goes one on one against a defender built to challenge and sharpen them. We borrowed that concept and applied it to real life. On ISO, you're not isolated — you're matched with someone who sharpens you.",
      },
      {
        id: 'who-is-iso-for',
        question: 'Who is ISO for?',
        answer:
          "ISO is for courageous people who are In Search Of personal growth, challenging environments, and real accountability. If you feel overlooked, underestimated, or like the traditional systems weren't built with you in mind — ISO was built for you.",
      },
      {
        id: 'express-iso',
        question: 'How do I express ISO as a member?',
        answer:
          "ISO is the movement. The ISO Institute is where development happens. Being part of ISO means you carry the culture — courage, humility, service, and real accountability — not just the logo. Players grow inside the Institute through documented progress with coaches. Coaches give the game back with humility. Supporters can follow the movement, attend The Assist, and share the mission authentically. We don't encourage performative posting or clout-chasing. Express ISO by doing the work, showing up for your community, and letting your growth speak. ISO apparel and member recognition are earned through progress in the Institute — not bought for show. For now, join the waitlist, follow @isoinstitute, and show up to The Assist.",
      },
      {
        id: 'basketball-brand',
        question: 'Is ISO a basketball brand?',
        answer:
          'No. Basketball is the inspiration, not the product. The language, the structure, and the culture of the game informed how we built the Institute — but ISO is the movement, and the ISO Institute is the development platform for real life, across six pathways that have nothing to do with sports.',
      },
      {
        id: 'communities-religions',
        question: 'Is ISO only for certain communities or religions?',
        answer:
          "No. ISO is for anyone willing to do the work. Our coaches and players come from different backgrounds, faiths, professions, and life experiences. The only requirement is that you're genuinely in search of growth.",
      },
    ],
  },
  {
    id: 'the-institute',
    title: 'The Institute',
    items: [
      {
        id: 'what-is-institute',
        question: 'What is the ISO Institute?',
        answer:
          'The ISO Institute is a gamified development experience where players are matched with coaches across six life pathways. Players level up through real activity and accountability. Coaches earn an Overall rating that reflects their real-world impact. Think of it like a sports video game — but the stats are your actual life.',
      },
      {
        id: 'six-pathways',
        question: 'What are the 6 pathways?',
        answer: '',
        variant: 'pathways',
      },
      {
        id: 'what-is-coach',
        question: 'What is a coach on the ISO Institute?',
        answer:
          "A coach is a verified professional or community leader who has real experience in one of the six pathways. They're not here to give generic advice — they've walked the path, struggled the struggle, and learned the playbook. Their role is to give the game back with humility.",
      },
      {
        id: 'what-is-player',
        question: 'What is a player on the ISO Institute?',
        answer:
          'A player is anyone who joins the ISO Institute to grow in one of the six pathways. Players are assigned a level — Freshman, JV, Varsity, D1, or Professional — based on where they are in their journey. They work with coaches, complete skill buckets, and level up through real documented progress.',
      },
      {
        id: 'overall-rating',
        question: 'What is the Overall rating system?',
        answer:
          "Every coach on the ISO Institute has an Overall rating — a dynamic score that reflects their real-world impact, not just their resume. It's calculated across several categories including coach activity, player outcomes, community contribution, consistency, and documented impact. Scores are not static. They go up or down based on what you actually do in the Institute.",
      },
      {
        id: 'coach-scores',
        question: 'How do coach scores go up or down?',
        answer:
          "Coach scores move based on measurable activity in the Institute — how consistently they show up, how their players progress, how they contribute to the community, and how their impact is documented over time. A high score isn't given. It's earned.",
      },
    ],
  },
  {
    id: 'the-assist',
    title: 'The Assist',
    items: [
      {
        id: 'what-is-assist',
        question: 'What is The Assist?',
        answer:
          "The Assist is ISO's weekly talk series featuring real people making quiet impact across the six pathways. It's not a highlight reel — it's an honest conversation about the journey, the struggle, and what it actually takes to build something meaningful.",
      },
      {
        id: 'when-assist-airs',
        question: 'When does The Assist air?',
        answer: 'Every Sunday from 6–7PM MST during Season 1.',
      },
      {
        id: 'where-to-watch',
        question: 'Where can I watch?',
        answer:
          'The Assist airs live on YouTube every Sunday. You can also attend in person at IOCC Denver. Past episodes are available on YouTube, Apple Podcasts, and Spotify.',
      },
      {
        id: 'become-guest',
        question: 'How do I become a guest on The Assist?',
        answer:
          'Guests are personally selected by the ISO team based on their alignment with one of the six pathways and their story. If you or someone you know has a story worth telling, reach out to us at @isoinstitute on Instagram.',
      },
    ],
  },
  {
    id: 'getting-involved',
    title: 'Getting Involved',
    items: [
      {
        id: 'join-waitlist',
        question: 'How do I join the waitlist?',
        answer:
          'Visit theisoinstitute.com and sign up for the waitlist. Beta testing begins September 2026 and waitlist members get first access.',
      },
      {
        id: 'become-coach',
        question: 'How do I become a coach?',
        answer:
          "Beta coach slots are limited. If you're interested in being an ISO coach, DM us on Instagram at @isoinstitute with your pathway and a little about yourself. Beta testing starts August 2026.",
      },
      {
        id: 'institute-launch',
        question: 'When does the ISO Institute launch?',
        answer:
          'The ISO Institute is currently in development. Beta testing begins September 2026 with a public launch targeted for early 2027. Follow @isoinstitute on Instagram and join the waitlist at theisoinstitute.com to stay updated.',
      },
      {
        id: 'is-it-free',
        question: 'Is it free?',
        answer:
          'Beta access is free for selected users. Pricing for the public launch will be announced closer to the release date. The focus right now is building the right community before scaling.',
      },
    ],
  },
];

export const FAQ_PATHWAYS = [
  { name: 'Builder', domain: 'Engineering & Technology', accent: '#a855f7' },
  { name: 'Seeker', domain: 'Deen & Purpose', accent: '#10b981' },
  { name: 'Healer', domain: 'Medicine & Healthcare', accent: '#3b82f6' },
  { name: 'Founder', domain: 'Entrepreneurship & Business', accent: '#f97316' },
  { name: 'Reformer', domain: 'Global Affairs, Law & Policy', accent: '#6366f1' },
  { name: 'Warrior', domain: 'Athletics & Wellness', accent: '#ef4444' },
] as const;
