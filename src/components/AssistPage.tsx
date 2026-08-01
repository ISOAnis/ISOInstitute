import { useState, type CSSProperties } from 'react';
import { ChevronDown } from 'lucide-react';
import { SplashNavigation } from './SplashNavigation';
import { SplashFooter } from './SplashFooter';
import {
  ASSIST_PLATFORM_LINKS,
  ASSIST_SEASON_1,
  getYoutubeEmbedUrl,
  getYoutubeThumbnailUrl,
  getPathwayAccent,
  type AssistEpisode,
} from '../data/assistSeason1';
import '../styles/about.css';
import '../styles/assist.css';

interface AssistPageProps {
  onBack?: () => void;
  onWaitlistClick?: () => void;
  onNavigateToAbout?: () => void;
  onNavigateToFAQ?: () => void;
  onNavigateToAssist?: () => void;
}

function PlatformLink({
  href,
  label,
  variant,
}: {
  href: string;
  label: string;
  variant: 'youtube' | 'apple' | 'spotify';
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`assist-platform-link assist-platform-link--${variant}`}
    >
      {label}
    </a>
  );
}

function EpisodeListenLinks({ episode }: { episode: AssistEpisode }) {
  return (
    <div className="assist-listen-links">
      <a
        href={episode.youtubeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="assist-listen-link"
      >
        YouTube
      </a>
      <a
        href={episode.applePodcastsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="assist-listen-link"
      >
        Apple Podcasts
      </a>
      <a
        href={episode.spotifyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="assist-listen-link"
      >
        Spotify
      </a>
    </div>
  );
}

export function AssistPage({
  onBack,
  onWaitlistClick,
  onNavigateToAbout,
  onNavigateToFAQ,
  onNavigateToAssist,
}: AssistPageProps) {
  const [season1Open, setSeason1Open] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedEpisode = selectedId
    ? (ASSIST_SEASON_1.find((episode) => episode.id === selectedId) ?? null)
    : null;
  const embedUrl = selectedEpisode ? getYoutubeEmbedUrl(selectedEpisode.youtubeUrl) : null;
  const selectedAccent = selectedEpisode ? getPathwayAccent(selectedEpisode.pathway) : undefined;

  const handleSelectEpisode = (episode: AssistEpisode) => {
    setSelectedId(episode.id);
    if (window.innerWidth < 900) {
      requestAnimationFrame(() => {
        document.getElementById('assist-player')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  };

  return (
    <div className="about-splash">
      <div className="about-splash-bg" aria-hidden="true">
        <div className="about-splash-bg-vignette" />
        <div className="about-splash-bg-glow" />
      </div>

      <SplashNavigation mode={onBack ? 'about' : 'splash'} onBack={onBack} />

      <div className="assist-splash-content">
        <header className="assist-hero">
          <p className="assist-hero-kicker">ISO Institute</p>
          <h1 className="assist-hero-title">The Assist</h1>
          <p className="assist-hero-sub">
            A weekly talk dedicated to the ones our communities don&apos;t celebrate enough.
            Browse Season 1 below — watch here or on your platform of choice.
          </p>
          <div className="assist-platform-bar">
            <PlatformLink href={ASSIST_PLATFORM_LINKS.youtubeChannel} label="YouTube" variant="youtube" />
            <PlatformLink
              href={ASSIST_PLATFORM_LINKS.applePodcastsShow}
              label="Apple Podcasts"
              variant="apple"
            />
            <PlatformLink href={ASSIST_PLATFORM_LINKS.spotifyShow} label="Spotify" variant="spotify" />
          </div>
        </header>

        <div className="assist-layout">
          <aside className="assist-browser" aria-label="Seasons">
            <div className="assist-season-block">
              <button
                type="button"
                className={`assist-season-toggle${season1Open ? ' assist-season-toggle--open' : ''}`}
                aria-expanded={season1Open}
                aria-controls="assist-season-1-episodes"
                onClick={() => setSeason1Open((open) => !open)}
              >
                <span className="assist-season-toggle-text">
                  <span className="assist-season-toggle-label">Season 1</span>
                  <span className="assist-season-toggle-meta">8 episodes · complete</span>
                </span>
                <ChevronDown className="assist-season-chevron" size={20} aria-hidden="true" />
              </button>

              <div
                id="assist-season-1-episodes"
                className={`assist-season-episodes${season1Open ? ' assist-season-episodes--open' : ''}`}
                hidden={!season1Open}
              >
                {[...ASSIST_SEASON_1].reverse().map((episode) => {
                  const thumbnail = getYoutubeThumbnailUrl(episode.youtubeUrl);
                  const isSelected = episode.id === selectedId;

                  return (
                    <button
                      key={episode.id}
                      type="button"
                      className={`assist-episode-card${isSelected ? ' assist-episode-card--active' : ''}`}
                      onClick={() => handleSelectEpisode(episode)}
                    >
                      {thumbnail && (
                        <img
                          src={thumbnail}
                          alt=""
                          className="assist-episode-thumb"
                          loading="lazy"
                        />
                      )}
                      <div className="assist-episode-card-body">
                        <div className="assist-episode-card-meta">
                          <span>EP. {String(episode.episodeNumber).padStart(2, '0')}</span>
                          {episode.isSeasonFinale && (
                            <span className="assist-finale-badge">Season Finale</span>
                          )}
                        </div>
                        <h2 className="assist-episode-card-title">{episode.title}</h2>
                        <p className="assist-episode-card-sub">{episode.subtitle}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="assist-season-block assist-season-block--upcoming">
              <div className="assist-season-toggle assist-season-toggle--disabled">
                <span className="assist-season-toggle-text">
                  <span className="assist-season-toggle-label">Season 2</span>
                  <span className="assist-season-toggle-meta">Coming soon</span>
                </span>
              </div>
            </div>
          </aside>

          <div className="assist-player-column">
            {selectedEpisode && selectedAccent ? (
              <section
                className="assist-player-panel"
                id="assist-player"
                style={{ '--pathway-accent': selectedAccent } as CSSProperties}
              >
                <div className="assist-player-header">
                  <p className="assist-player-kicker">
                    EP. {String(selectedEpisode.episodeNumber).padStart(2, '0')}
                    {selectedEpisode.isSeasonFinale ? ' · Season Finale' : ''}
                  </p>
                  <h2 className="assist-player-title">{selectedEpisode.title}</h2>
                  <p className="assist-player-sub">{selectedEpisode.subtitle}</p>
                </div>

                <div className="assist-video-wrap">
                  {embedUrl ? (
                    <iframe
                      key={embedUrl}
                      src={`${embedUrl}?rel=0`}
                      title={`${selectedEpisode.title} — ISO: The Assist`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="assist-video-iframe"
                    />
                  ) : (
                    <div className="assist-video-fallback">
                      <p>Unable to embed this video.</p>
                      <a href={selectedEpisode.youtubeUrl} target="_blank" rel="noopener noreferrer">
                        Watch on YouTube
                      </a>
                    </div>
                  )}
                </div>

                <EpisodeListenLinks episode={selectedEpisode} />
              </section>
            ) : (
              <div className="assist-player-placeholder" id="assist-player">
                Open Season 1 and select an episode to start watching.
              </div>
            )}
          </div>
        </div>

        <section className="assist-season-two">
          <p className="assist-season-two-kicker">What&apos;s Next</p>
          <h2 className="assist-season-two-title">Season 2 Coming Soon</h2>
          <p className="assist-season-two-text">
            We&apos;re lining up the next roster of guests. Follow @isoinstitute to hear it first.
          </p>
          {onWaitlistClick && (
            <button type="button" className="about-close-btn" onClick={onWaitlistClick}>
              Join the Waitlist
            </button>
          )}
        </section>
      </div>

      <SplashFooter
        onNavigateToAbout={onNavigateToAbout}
        onNavigateToFAQ={onNavigateToFAQ}
        onNavigateToAssist={onNavigateToAssist}
        onWaitlistClick={onWaitlistClick}
      />
    </div>
  );
}
