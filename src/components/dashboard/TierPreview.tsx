import React from 'react';
import { User, UserLevel, getLevelStatus, LevelStatus } from '../../types/store';
import { levelTiers, levelColors } from '../../mockData/store';
import { Lock, Check, Star } from 'lucide-react';

interface TierPreviewProps {
  user: User;
  onSelectLevel?: (level: UserLevel) => void;
  previewMode?: boolean;
}

/**
 * Horizontal scrollable tier preview strip
 */
export const TierPreview: React.FC<TierPreviewProps> = ({ user, onSelectLevel, previewMode = false }) => {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">
            {previewMode ? 'Varsity Milestone Gear Preview' : 'Level Tiers'}
          </h3>
          <p className="text-sm text-slate-400">
            {previewMode
              ? 'See what Varsity players earn at each level — upgrade to unlock'
              : 'Your journey through ISO'}
          </p>
        </div>
      </div>

      {/* Tier Cards */}
      <div className="flex gap-4 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
        {levelTiers.map((tier) => {
          const status = previewMode ? 'locked' as LevelStatus : getLevelStatus(tier.level, user);
          return (
            <TierCard
              key={tier.level}
              level={tier.level}
              title={tier.title}
              tagline={tier.tagline}
              previewImages={tier.previewImages}
              status={status}
              previewMode={previewMode}
              onClick={() => onSelectLevel?.(tier.level)}
            />
          );
        })}
      </div>
    </div>
  );
};

interface TierCardProps {
  level: UserLevel;
  title: string;
  tagline: string;
  previewImages: string[];
  status: LevelStatus;
  previewMode?: boolean;
  onClick?: () => void;
}

/**
 * Individual tier preview card
 */
const TierCard: React.FC<TierCardProps> = ({
  level,
  title,
  tagline,
  previewImages,
  status,
  previewMode = false,
  onClick,
}) => {
  const colors = levelColors[level];
  const isLocked = status === 'locked' && !previewMode;
  const isCurrent = status === 'current';

  return (
    <button
      onClick={onClick}
      disabled={isLocked}
      className={`
        relative flex-shrink-0 w-48 p-4 rounded-xl border transition-all duration-300
        ${isLocked 
          ? 'border-slate-700 bg-slate-800/30 cursor-not-allowed' 
          : previewMode
          ? 'border-purple-500/40 bg-purple-500/10 cursor-pointer hover:border-purple-500/60'
          : isCurrent
          ? `border-orange-500/50 bg-orange-500/10 cursor-pointer hover:border-orange-500/70`
          : `border-slate-600 bg-slate-700/30 cursor-pointer hover:border-slate-500`
        }
      `}
    >
      {/* Status Badge */}
      <div className="absolute top-3 right-3">
        {previewMode ? (
          <span className="flex items-center gap-1 px-2 py-0.5 text-xs font-bold text-purple-400 bg-purple-400/20 rounded-full">
            Preview
          </span>
        ) : isCurrent ? (
          <span className="flex items-center gap-1 px-2 py-0.5 text-xs font-bold text-orange-400 bg-orange-400/20 rounded-full">
            <Star className="w-3 h-3" /> Current
          </span>
        ) : status === 'unlocked' ? (
          <span className="flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-green-400 bg-green-400/20 rounded-full">
            <Check className="w-3 h-3" /> Unlocked
          </span>
        ) : (
          <span className="flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-slate-400 bg-slate-600/50 rounded-full">
            <Lock className="w-3 h-3" /> Locked
          </span>
        )}
      </div>

      {/* Level Name */}
      <div className={`text-left mb-3 ${colors.primary}`}>
        <span className="text-lg font-bold">{title}</span>
      </div>

      {/* Preview Images */}
      <div className="flex gap-2 mb-3">
        {previewImages.map((img, index) => (
          <div
            key={index}
            className={`relative w-16 h-16 rounded-lg overflow-hidden bg-slate-700 ${
              isLocked ? 'opacity-40' : ''
            }`}
          >
            <img
              src={img}
              alt={`${title} preview ${index + 1}`}
              className={`w-full h-full object-cover ${isLocked ? 'blur-[2px]' : ''}`}
            />
            {isLocked && !previewMode && (
              <div className="absolute inset-0 bg-slate-900/30" />
            )}
          </div>
        ))}
      </div>

      {/* Tagline */}
      <p className={`text-xs text-left ${isLocked ? 'text-slate-500' : 'text-slate-400'}`}>
        {tagline}
      </p>
    </button>
  );
};

export default TierPreview;
