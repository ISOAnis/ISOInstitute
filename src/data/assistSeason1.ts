export type AssistEpisode = {
  id: string;
  episodeNumber: number;
  title: string;
  subtitle: string;
  guest?: string;
  pathway: string;
  youtubeUrl: string;
  spotifyUrl: string;
  applePodcastsUrl: string;
  isSeasonFinale?: boolean;
};

export const ASSIST_PLATFORM_LINKS = {
  applePodcastsShow: 'https://podcasts.apple.com/us/podcast/the-assist/id1896897320',
  spotifyShow: 'https://open.spotify.com/search/The%20Assist%20ISO%20Institute/podcasts',
  youtubeChannel: 'https://www.youtube.com/@ISO-1v',
};

export const PATHWAY_ACCENTS: Record<string, string> = {
  Builder: '#a855f7',
  Seeker: '#10b981',
  Healer: '#3b82f6',
  Founder: '#f97316',
  Reformer: '#6366f1',
  Warrior: '#ef4444',
  'Intro to ISO': '#c08038',
};

export function getPathwayAccent(pathway: string): string {
  return PATHWAY_ACCENTS[pathway] ?? '#c08038';
}

export const ASSIST_SEASON_1: AssistEpisode[] = [
  {
    id: 'ep-01',
    episodeNumber: 1,
    title: "You're Not Lost. You're In Search Of.",
    subtitle: 'Intro to ISO',
    pathway: 'Intro to ISO',
    youtubeUrl: 'https://youtube.com/live/InKonCD5Hbw',
    spotifyUrl: 'https://open.spotify.com/episode/6Nm6EL9cyPR4iNN1x1a2s9',
    applePodcastsUrl:
      'https://podcasts.apple.com/us/podcast/the-assist-ep-01-youre-not-lost-youre-in-search-of/id1896897320?i=1000771744174',
  },
  {
    id: 'ep-02',
    episodeNumber: 2,
    title: 'The Real Engineering Playbook',
    subtitle: 'The Builder Pathway with Anis Benyoucef',
    guest: 'Anis Benyoucef',
    pathway: 'Builder',
    youtubeUrl: 'https://youtu.be/cWm4Hp3NwOA',
    spotifyUrl: 'https://open.spotify.com/episode/0OZRiR7ws5jdD1Zqu4xKS3',
    applePodcastsUrl:
      'https://podcasts.apple.com/us/podcast/the-assist-ep-02-the-real-engineering-playbook/id1896897320?i=1000771938819',
  },
  {
    id: 'ep-03',
    episodeNumber: 3,
    title: 'Leave Everything to Find Everything',
    subtitle: 'The Seeker Pathway with Kamal Mahamed',
    guest: 'Kamal Mahamed',
    pathway: 'Seeker',
    youtubeUrl: 'https://youtu.be/dmkHZkFmQSA',
    spotifyUrl: 'https://open.spotify.com/episode/2OPPrSl8ElCoiPCDUzagkT',
    applePodcastsUrl:
      'https://podcasts.apple.com/us/podcast/the-assist-ep-03-leave-everything-to-find-everything/id1896897320?i=1000772900434',
  },
  {
    id: 'ep-04',
    episodeNumber: 4,
    title: 'Paving the Way for Women in STEM',
    subtitle: 'The Builder Pathway with Renat Mohamed',
    guest: 'Renat Mohamed',
    pathway: 'Builder',
    youtubeUrl: 'https://youtu.be/Ll35nTPYMPk',
    spotifyUrl: 'https://open.spotify.com/episode/5cAFcEl1TeXGcibdWDLYqZ',
    applePodcastsUrl:
      'https://podcasts.apple.com/us/podcast/the-assist-ep-04-paving-the-way-for-women-in-stem/id1896897320?i=1000773763649',
  },
  {
    id: 'ep-05',
    episodeNumber: 5,
    title: 'Trust the Process',
    subtitle: 'The Healer Pathway with Ahmed Ahmed',
    guest: 'Ahmed Ahmed',
    pathway: 'Healer',
    youtubeUrl: 'https://youtu.be/p8uavndNyXI',
    spotifyUrl: 'https://open.spotify.com/episode/6R9Y2C2KCn5WiIFhKinNcJ',
    applePodcastsUrl:
      'https://podcasts.apple.com/us/podcast/the-assist-ep-05-trust-the-process-the-healer/id1896897320?i=1000775861162',
  },
  {
    id: 'ep-06',
    episodeNumber: 6,
    title: 'Reforming from Within',
    subtitle: 'The Reformer Pathway with Josué Rodríguez',
    guest: 'Josué Rodríguez',
    pathway: 'Reformer',
    youtubeUrl: 'https://youtu.be/cI82cH59tSw',
    spotifyUrl: 'https://open.spotify.com/episode/5WTbAw5vrLLw5uVzPMBpUA',
    applePodcastsUrl:
      'https://podcasts.apple.com/us/podcast/the-assist-ep-06-reforming-from-within-the/id1896897320?i=1000777145866',
  },
  {
    id: 'ep-07',
    episodeNumber: 7,
    title: 'The Fuel for the Drive',
    subtitle: 'The Founder Pathway with Abdulla Ermila',
    guest: 'Abdulla Ermila',
    pathway: 'Founder',
    youtubeUrl: 'https://youtube.com/live/EvluZjlWzMY',
    spotifyUrl: 'https://open.spotify.com/episode/00hD72cL26Nf8K3BpPKpTi',
    applePodcastsUrl:
      'https://podcasts.apple.com/us/podcast/the-assist-ep-07-the-fuel-for-the-drive/id1896897320?i=1000778356744',
  },
  {
    id: 'ep-08',
    episodeNumber: 8,
    title: 'Beyond the Box Score',
    subtitle: 'The Warrior Pathway with Laolu Oke',
    guest: 'Laolu Oke',
    pathway: 'Warrior',
    youtubeUrl: 'https://youtu.be/CQtRJ9EI15w',
    spotifyUrl: 'https://open.spotify.com/episode/2u65U6x9noYcYttQmLe8NU',
    applePodcastsUrl:
      'https://podcasts.apple.com/us/podcast/the-assist-ep-08-beyond-the-box-score-the/id1896897320?i=1000779450599',
    isSeasonFinale: true,
  },
];

export function getYoutubeVideoId(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtu.be')) {
      return parsed.pathname.slice(1).split('/')[0] || null;
    }
    if (parsed.pathname.startsWith('/live/')) {
      return parsed.pathname.split('/')[2] ?? null;
    }
    if (parsed.pathname.startsWith('/watch')) {
      return parsed.searchParams.get('v');
    }
    if (parsed.pathname.startsWith('/embed/')) {
      return parsed.pathname.split('/')[2] ?? null;
    }
  } catch {
    return null;
  }
  return null;
}

export function getYoutubeEmbedUrl(url: string): string | null {
  const id = getYoutubeVideoId(url);
  return id ? `https://www.youtube.com/embed/${id}` : null;
}

export function getYoutubeThumbnailUrl(url: string): string | null {
  const id = getYoutubeVideoId(url);
  return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : null;
}
