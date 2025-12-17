import React from 'react';
import { User, UserLevel, LEVEL_XP_THRESHOLDS, LEVEL_ORDER } from '../../types/store';
import { levelColors } from '../../mockData/store';
import { ProgressBar } from '../common/ProgressBar';
import { Trophy, Star, TrendingUp } from 'lucide-react';

interface ProfileCardProps {
  user: User;
}

/**
 * User profile card showing level, XP progress, and status
 */
export const ProfileCard: React.FC<ProfileCardProps> = ({ user }) => {
  const currentLevelIndex = LEVEL_ORDER.indexOf(user.currentLevel);
  const nextLevel = currentLevelIndex < LEVEL_ORDER.length - 1 
    ? LEVEL_ORDER[currentLevelIndex + 1] 
    : null;
  
  const xpForCurrentLevel = LEVEL_XP_THRESHOLDS[user.currentLevel];
  const xpProgress = user.xp - xpForCurrentLevel;
  const xpNeededForNext = nextLevel 
    ? LEVEL_XP_THRESHOLDS[nextLevel] - xpForCurrentLevel 
    : 0;
  const xpRemaining = nextLevel 
    ? LEVEL_XP_THRESHOLDS[nextLevel] - user.xp 
    : 0;

  const colors = levelColors[user.currentLevel];

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        {/* Avatar */}
        <div className="relative">
          <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-700">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-orange-400">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
            )}
          </div>
          {/* Level Badge */}
          <div className={`absolute -bottom-1 -right-1 ${colors.bg} px-2 py-0.5 rounded-full border border-slate-600`}>
            <span className={`text-xs font-bold ${colors.primary}`}>
              {user.currentLevel}
            </span>
          </div>
        </div>

        {/* User Info */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white">{user.name}</h3>
          <p className="text-sm text-slate-400">{user.email}</p>
          
          {/* Stats Row */}
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1.5">
              <Trophy className={`w-4 h-4 ${colors.primary}`} />
              <span className="text-sm text-slate-300">{user.currentLevel}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-slate-300">{user.xp.toLocaleString()} XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* XP Progress */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-300">Level Progress</span>
          {nextLevel ? (
            <span className={`text-sm ${colors.primary}`}>
              {xpRemaining.toLocaleString()} XP to {nextLevel}
            </span>
          ) : (
            <span className="text-sm text-purple-400">Max Level Achieved!</span>
          )}
        </div>

        <ProgressBar
          current={xpProgress}
          max={xpNeededForNext || 1}
          colorClass={colors.bg.replace('/20', '')}
          size="lg"
        />

        {/* Level Markers */}
        <div className="flex justify-between text-xs">
          {LEVEL_ORDER.map((level, index) => {
            const isUnlocked = user.unlockedLevels.includes(level);
            const isCurrent = user.currentLevel === level;
            const levelColor = levelColors[level];
            
            return (
              <div
                key={level}
                className={`flex flex-col items-center gap-1 ${
                  isCurrent ? levelColor.primary : isUnlocked ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                <div
                  className={`w-3 h-3 rounded-full border-2 ${
                    isCurrent
                      ? `${levelColor.bg} border-current`
                      : isUnlocked
                      ? 'bg-slate-600 border-slate-500'
                      : 'bg-slate-700 border-slate-600'
                  }`}
                />
                <span className="font-medium">{level}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Next Level Teaser */}
      {nextLevel && (
        <div className="mt-4 p-3 bg-slate-700/50 rounded-xl flex items-center gap-3">
          <div className="p-2 rounded-lg bg-slate-600">
            <TrendingUp className={`w-5 h-5 ${levelColors[nextLevel].primary}`} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-200">
              Level up to {nextLevel}
            </p>
            <p className="text-xs text-slate-400">
              Unlock exclusive {nextLevel} gear & rewards
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileCard;
