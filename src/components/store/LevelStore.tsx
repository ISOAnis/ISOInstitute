import React, { useState, useMemo } from 'react';
import {
  StoreItem,
  CartItem,
  User,
  UserLevel,
  LEVEL_ORDER,
  getLevelStatus,
  isLevelAccessible,
} from '../../types/store';
import {
  levelStoreItems,
  levelTiers,
  levelColors,
} from '../../mockData/store';
import { ProductCard } from './ProductCard';
import { RewardClaimModal } from './RewardClaimModal';
import {
  ShoppingCart,
  ArrowLeft,
  Lock,
  Star,
  Check,
  Gift,
  Crown,
} from 'lucide-react';

interface LevelStoreProps {
  user: User;
  cart: CartItem[];
  onAddToCart: (item: StoreItem) => void;
  onOpenCart: () => void;
  onBack: () => void;
  onClaimRewards: (level: UserLevel, clothingItem: StoreItem | null, accessoryItem: StoreItem | null) => void;
}

/**
 * Level Store page with tier system
 */
export const LevelStore: React.FC<LevelStoreProps> = ({
  user,
  cart,
  onAddToCart,
  onOpenCart,
  onBack,
  onClaimRewards,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<UserLevel>(user.currentLevel);
  const [showClaimModal, setShowClaimModal] = useState(false);

  const remainingPurchases = user.monthlyPurchaseLimit - user.monthlyPurchaseCount;
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartItemIds = new Set(cart.map(item => item.item.id));
  const canAddToCart = remainingPurchases > 0;

  // Get current level info
  const currentTier = levelTiers.find(t => t.level === selectedLevel);
  const levelStatus = getLevelStatus(selectedLevel, user);
  const isAccessible = isLevelAccessible(selectedLevel, user);
  const colors = levelColors[selectedLevel];

  // Get items for selected level
  const levelItems = useMemo(() => {
    return levelStoreItems[selectedLevel] || [];
  }, [selectedLevel]);

  // Check reward status for selected level
  const levelRewards = user.earnedRewards.filter(r => r.levelUnlocked === selectedLevel);
  const clothingClaimed = levelRewards.some(r => r.itemType === 'clothing' && r.claimedAt !== null);
  const accessoryClaimed = levelRewards.some(r => r.itemType === 'accessory' && r.claimedAt !== null);
  const hasUnclaimedRewards = levelRewards.some(r => r.claimedAt === null);

  const handleClaimRewards = (clothingItem: StoreItem | null, accessoryItem: StoreItem | null) => {
    onClaimRewards(selectedLevel, clothingItem, accessoryItem);
    setShowClaimModal(false);
  };

  return (
    <div className="min-h-screen pt-20" style={{ background: '#111111' }}>
      {/* Header */}
      <div className="sticky top-20 z-30 backdrop-blur-md border-b border-white/10" style={{ background: 'rgba(3, 3, 5, 0.95)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Back & Title */}
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-slate-400" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-white">ISO Level Store</h1>
                <p className="text-sm text-slate-400">Earned gear system</p>
              </div>
            </div>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
            >
              <ShoppingCart className="w-5 h-5 text-slate-300" />
              <span className="text-sm font-medium text-slate-300">Cart</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs font-bold text-white bg-orange-500 rounded-full">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Level Tabs */}
      <div className="border-b border-white/10" style={{ background: 'rgba(10, 10, 15, 0.5)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
            {LEVEL_ORDER.map((level) => {
              const status = getLevelStatus(level, user);
              const lvlColors = levelColors[level];
              const isSelected = level === selectedLevel;

              return (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className={`
                    flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-all duration-200
                    ${isSelected
                      ? `${lvlColors.bg} ${lvlColors.primary} border border-current`
                      : status === 'locked'
                      ? 'bg-slate-800/50 text-slate-500 border border-slate-700'
                      : 'bg-slate-800 text-slate-300 border border-slate-700 hover:border-slate-600'
                    }
                  `}
                >
                  {status === 'locked' && <Lock className="w-4 h-4" />}
                  {status === 'current' && <Star className="w-4 h-4" />}
                  {status === 'unlocked' && status !== 'current' && <Check className="w-4 h-4" />}
                  <span>{level}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Level Header */}
        <div className={`relative overflow-hidden rounded-2xl border ${colors.bg.replace('/20', '/30')} border-slate-700 p-6 mb-8`}>
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Crown className={`w-6 h-6 ${colors.primary}`} />
                  <span className={`px-3 py-1 text-sm font-bold rounded-full ${colors.bg} ${colors.primary}`}>
                    {levelStatus === 'current' ? 'Current Level' : levelStatus === 'unlocked' ? 'Unlocked' : 'Locked'}
                  </span>
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">{currentTier?.title} Collection</h2>
                <p className="text-slate-400 max-w-xl">{currentTier?.description}</p>
                <p className={`text-sm ${colors.primary} mt-2 italic`}>"{currentTier?.tagline}"</p>
              </div>

              {/* Claim Rewards Button */}
              {isAccessible && hasUnclaimedRewards && (
                <button
                  onClick={() => setShowClaimModal(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-orange-500/25 animate-pulse"
                >
                  <Gift className="w-5 h-5" />
                  <span>Claim Your Free Rewards!</span>
                </button>
              )}
            </div>

            {/* Benefits */}
            {currentTier && (
              <div className="flex flex-wrap gap-2 mt-6">
                {currentTier.benefits.map((benefit, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 text-sm text-slate-300 bg-slate-800/50 rounded-full border border-slate-700"
                  >
                    {benefit}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Background decoration */}
          <div className={`absolute top-0 right-0 w-64 h-64 ${colors.bg} rounded-full blur-3xl opacity-20 translate-x-1/3 -translate-y-1/3`} />
        </div>

        {/* Rewards Section (if accessible) */}
        {isAccessible && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Gift className="w-5 h-5 text-orange-400" />
              Free Rewards
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <RewardStatusCard
                title="Free Clothing Item"
                isClaimed={clothingClaimed}
                claimedItemName={levelRewards.find(r => r.itemType === 'clothing')?.itemName}
                onClaim={() => setShowClaimModal(true)}
              />
              <RewardStatusCard
                title="Free Accessory"
                isClaimed={accessoryClaimed}
                claimedItemName={levelRewards.find(r => r.itemType === 'accessory')?.itemName}
                onClaim={() => setShowClaimModal(true)}
              />
            </div>
          </div>
        )}

        {/* Locked Overlay Message */}
        {!isAccessible && (
          <div className="mb-8 p-6 bg-slate-800/50 border border-slate-700 rounded-2xl text-center">
            <Lock className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Unlock {selectedLevel} to Access
            </h3>
            <p className="text-slate-400 max-w-md mx-auto">
              Reach {currentTier?.xpRequired.toLocaleString()} XP to unlock the {selectedLevel} store and claim your free rewards.
            </p>
          </div>
        )}

        {/* Product Grid */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            {selectedLevel} Collection
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {levelItems.map((item) => (
              <ProductCard
                key={item.id}
                item={item}
                onAddToCart={onAddToCart}
                isInCart={cartItemIds.has(item.id)}
                isDisabled={!canAddToCart || !isAccessible}
                disabledReason={!isAccessible ? 'Level locked' : !canAddToCart ? 'Monthly limit reached' : undefined}
                showFreeTag={isAccessible}
                isLocked={!isAccessible}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Claim Modal */}
      {showClaimModal && (
        <RewardClaimModal
          level={selectedLevel}
          onClose={() => setShowClaimModal(false)}
          onClaimRewards={handleClaimRewards}
          clothingClaimed={clothingClaimed}
          accessoryClaimed={accessoryClaimed}
        />
      )}
    </div>
  );
};

interface RewardStatusCardProps {
  title: string;
  isClaimed: boolean;
  claimedItemName?: string;
  onClaim: () => void;
}

const RewardStatusCard: React.FC<RewardStatusCardProps> = ({
  title,
  isClaimed,
  claimedItemName,
  onClaim,
}) => (
  <div
    className={`p-4 rounded-xl border ${
      isClaimed ? 'border-slate-700 bg-slate-800/30' : 'border-orange-500/30 bg-orange-500/5'
    }`}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${isClaimed ? 'bg-green-500/20' : 'bg-orange-500/20'}`}>
          {isClaimed ? (
            <Check className="w-5 h-5 text-green-400" />
          ) : (
            <Gift className="w-5 h-5 text-orange-400" />
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-white">{title}</p>
          {isClaimed ? (
            <p className="text-xs text-slate-400">{claimedItemName || 'Claimed'}</p>
          ) : (
            <p className="text-xs text-orange-400">Ready to claim!</p>
          )}
        </div>
      </div>

      {!isClaimed && (
        <button
          onClick={onClaim}
          className="px-4 py-2 text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors"
        >
          Claim
        </button>
      )}
    </div>
  </div>
);

export default LevelStore;
