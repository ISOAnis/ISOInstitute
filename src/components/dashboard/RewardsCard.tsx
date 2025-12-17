import React from 'react';
import { User, EarnedReward, UserLevel } from '../../types/store';
import { levelColors } from '../../mockData/store';
import { Gift, Check, Clock, Sparkles } from 'lucide-react';

interface RewardsCardProps {
  user: User;
  onClaimRewards?: (level: UserLevel) => void;
}

/**
 * Card showing earned rewards summary
 */
export const RewardsCard: React.FC<RewardsCardProps> = ({ user, onClaimRewards }) => {
  // Group rewards by level
  const rewardsByLevel = user.earnedRewards.reduce((acc, reward) => {
    if (!acc[reward.levelUnlocked]) {
      acc[reward.levelUnlocked] = [];
    }
    acc[reward.levelUnlocked].push(reward);
    return acc;
  }, {} as Record<UserLevel, EarnedReward[]>);

  const claimedCount = user.earnedRewards.filter(r => r.claimedAt !== null).length;
  const pendingCount = user.earnedRewards.filter(r => r.claimedAt === null).length;

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-orange-500/20">
            <Gift className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Your Rewards</h3>
            <p className="text-sm text-slate-400">
              {claimedCount} claimed · {pendingCount} pending
            </p>
          </div>
        </div>
        
        {pendingCount > 0 && (
          <span className="px-3 py-1 text-xs font-semibold text-orange-400 bg-orange-400/10 rounded-full animate-pulse">
            {pendingCount} to claim!
          </span>
        )}
      </div>

      {/* Rewards List */}
      <div className="space-y-3">
        {Object.entries(rewardsByLevel).map(([level, rewards]) => {
          const levelKey = level as UserLevel;
          const colors = levelColors[levelKey];
          const hasUnclaimed = rewards.some(r => r.claimedAt === null);
          
          return (
            <div
              key={level}
              className={`p-3 rounded-xl border ${
                hasUnclaimed ? 'border-orange-500/30 bg-orange-500/5' : 'border-slate-700 bg-slate-700/30'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${colors.bg} ${colors.primary}`}>
                    {level}
                  </span>
                  <span className="text-sm font-medium text-slate-300">
                    {level} Rewards
                  </span>
                </div>
                
                {hasUnclaimed && onClaimRewards && (
                  <button
                    onClick={() => onClaimRewards(levelKey)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors"
                  >
                    <Sparkles className="w-3 h-3" />
                    Claim
                  </button>
                )}
              </div>

              <div className="space-y-1.5">
                {rewards.map((reward) => (
                  <RewardItem key={reward.id} reward={reward} />
                ))}
              </div>
            </div>
          );
        })}

        {user.earnedRewards.length === 0 && (
          <div className="text-center py-6">
            <Gift className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No rewards yet</p>
            <p className="text-sm text-slate-500">Level up to earn free gear!</p>
          </div>
        )}
      </div>
    </div>
  );
};

interface RewardItemProps {
  reward: EarnedReward;
}

/**
 * Individual reward item display
 */
const RewardItem: React.FC<RewardItemProps> = ({ reward }) => {
  const isClaimed = reward.claimedAt !== null;
  
  return (
    <div className="flex items-center gap-2 text-sm">
      {isClaimed ? (
        <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
      ) : (
        <Clock className="w-4 h-4 text-orange-400 flex-shrink-0" />
      )}
      <span className={isClaimed ? 'text-slate-400' : 'text-slate-200'}>
        {isClaimed ? (
          <>
            <span className="line-through">{reward.itemName || `Free ${reward.itemType}`}</span>
            <span className="text-xs text-slate-500 ml-2">Claimed</span>
          </>
        ) : (
          <>Free {reward.itemType} - Ready to claim!</>
        )}
      </span>
    </div>
  );
};

export default RewardsCard;
