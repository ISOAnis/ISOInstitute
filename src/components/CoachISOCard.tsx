import * as React from 'react';
import type { CoachCardDisplay } from '../utils/coachProfile';
import { COACH_TIER_BORDER, COACH_TIER_COLORS } from '../utils/coachCardStyles';
import { DEFAULT_PHOTO_FRAME, photoFrameToObjectPosition } from '../utils/coachPhotoStorage';
import '../pages/JoinISOPage.css';

interface CoachISOCardProps {
  card: CoachCardDisplay;
  pendingReview?: boolean;
  pathwayColor?: string;
  className?: string;
}

export function CoachISOCard({ card, pendingReview = false, pathwayColor, className }: CoachISOCardProps) {
  const tier = card.result.tier;
  const tierColor = COACH_TIER_COLORS[tier];
  const tierBorder = COACH_TIER_BORDER[tier];
  const topbarColor = pathwayColor ?? tierColor;
  const photoFrame = card.photoFrame ?? DEFAULT_PHOTO_FRAME;
  const tierIcon = tier === 'silver' ? '⚙️' : tier === 'gold' ? '🏆' : tier === 'premium' ? '💎' : '🏅';
  const roleSnippet = card.role ? card.role.split(' ').slice(0, 2).join(' ') : '';

  return (
    <div className={`iso-join__cc-wrap${className ? ` ${className}` : ''}`} style={{ position: 'relative', marginBottom: 0 }}>
      {pendingReview && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 20, borderRadius: 14,
          background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(2px)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: 8, padding: 16, textAlign: 'center',
        }}>
          <span style={{
            fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 700,
            letterSpacing: 2.5, textTransform: 'uppercase', color: '#f97316',
            background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.35)',
            borderRadius: 100, padding: '6px 14px',
          }}>
            Pending Review
          </span>
          <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.5)', maxWidth: 200 }}>
            Your card goes live after Advisory Board approval
          </span>
        </div>
      )}
      <div
        style={{
          borderRadius: 14,
          padding: 2,
          background: tierBorder.gradient,
          boxShadow: tierBorder.glow,
          animation: tierBorder.animation,
          display: 'inline-block',
        }}
      >
        <div
          className="iso-join__cc"
          style={{
            border: 'none',
            boxShadow: 'none',
            animation: 'none',
          }}
        >
          <div
            className="iso-join__cc-topbar"
            style={{
              background: `linear-gradient(90deg, transparent 5%, ${topbarColor}60 35%, ${topbarColor} 50%, ${topbarColor}60 65%, transparent 95%)`,
            }}
          />
          <div className="iso-join__cc-scanlines" />
          <div className="iso-join__cc-sheen" />

          <div className="iso-join__cc-photo-area">
            {card.photo ? (
              <img
                src={card.photo}
                alt="Coach headshot"
                className="iso-join__cc-headshot"
                style={{
                  objectPosition: photoFrameToObjectPosition(photoFrame),
                  transform: photoFrame.zoom > 1 ? `scale(${photoFrame.zoom})` : undefined,
                  transformOrigin: photoFrameToObjectPosition(photoFrame),
                }}
              />
            ) : (
              <div className="iso-join__cc-bg-text">ISO</div>
            )}
            <div className="iso-join__cc-ovr">
              <div className="iso-join__cc-ovr-num" style={{ color: tierColor }}>{card.result.overall}</div>
              <div className="iso-join__cc-ovr-lbl">Overall</div>
            </div>
            <div className="iso-join__cc-tier-wrap">
              <div
                className="iso-join__cc-tier-box"
                style={{
                  border: `1px solid ${tierColor}55`,
                  background: `${tierColor}18`,
                }}
              >
                {tierIcon}
              </div>
              <div className="iso-join__cc-tier-name" style={{ color: tierColor }}>{card.result.tierLabel}</div>
            </div>
            <div className="iso-join__cc-photo-fade" />
          </div>

          <div className="iso-join__cc-body">
            <div className="iso-join__cc-name">{card.name.toUpperCase()}</div>
            <div className="iso-join__cc-specialty">
              {card.pathwayName}{roleSnippet ? ` · ${roleSnippet}` : ''}
            </div>
            <div className="iso-join__cc-divider" />
            <div className="iso-join__cc-stats">
              <div className="iso-join__cc-stat">
                <span className="iso-join__cc-stat-val">{card.years}</span>
                <span className="iso-join__cc-stat-key">Years</span>
              </div>
              <div className="iso-join__cc-stat">
                <span className="iso-join__cc-stat-val">{card.skillTags.length}</span>
                <span className="iso-join__cc-stat-key">Skills</span>
              </div>
              <div className="iso-join__cc-stat">
                <span className="iso-join__cc-stat-val">{card.outcomeCount}</span>
                <span className="iso-join__cc-stat-key">Outcomes</span>
              </div>
            </div>
            <div className="iso-join__cc-tags">
              {card.skillTags.map(s => (
                <span key={s} className="iso-join__cc-tag">{s}</span>
              ))}
            </div>
          </div>

          <div className="iso-join__cc-footer">
            <span className="iso-join__cc-footer-text">ISO Institute</span>
            <span className="iso-join__cc-footer-text" style={{ color: tierColor }}>{card.result.tierLabel} Coach</span>
          </div>
        </div>
      </div>
    </div>
  );
}
