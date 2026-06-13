import React from 'react';
import { User, StoreType } from '../../types/store';
import { Store, Crown, Lock, ArrowRight } from 'lucide-react';

interface StoreTilesProps {
  user: User;
  onSelectStore: (store: StoreType) => void;
  levelStorePreview?: boolean;
}

/**
 * Store access tiles for dashboard
 */
export const StoreTiles: React.FC<StoreTilesProps> = ({ user, onSelectStore, levelStorePreview = false }) => {
  const hasPass = user.hasLockerRoomPass;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* General Store Tile */}
      <StoreTile
        title="ISO General Store"
        description="Locker Room lifestyle collection — tees, hoodies & community gear"
        icon={<Store className="w-7 h-7" />}
        isLocked={!hasPass}
        lockMessage="Requires Locker Room Pass"
        gradient="from-blue-500/20 to-cyan-500/20"
        accentColor="text-blue-400"
        borderColor="border-blue-500/30"
        hoverColor="hover:border-blue-500/50"
        onClick={() => hasPass && onSelectStore('general')}
      />

      {/* Level Store Tile */}
      <StoreTile
        title={levelStorePreview ? 'Varsity Milestone Store' : 'ISO Level Store'}
        description={levelStorePreview
          ? 'Preview exclusive Varsity milestone gear — upgrade to earn & purchase'
          : `${user.currentLevel} collection & exclusive earned gear`}
        icon={<Crown className="w-7 h-7" />}
        isLocked={!hasPass}
        lockMessage="Requires Locker Room Pass"
        gradient="from-orange-500/20 to-amber-500/20"
        accentColor="text-orange-400"
        borderColor="border-orange-500/30"
        hoverColor="hover:border-orange-500/50"
        badge={levelStorePreview ? 'PREVIEW' : hasPass ? user.currentLevel : undefined}
        onClick={() => hasPass && onSelectStore('level')}
      />
    </div>
  );
};

interface StoreTileProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  isLocked: boolean;
  lockMessage: string;
  gradient: string;
  accentColor: string;
  borderColor: string;
  hoverColor: string;
  badge?: string;
  onClick: () => void;
}

/**
 * Individual store tile component
 */
const StoreTile: React.FC<StoreTileProps> = ({
  title,
  description,
  icon,
  isLocked,
  lockMessage,
  gradient,
  accentColor,
  borderColor,
  hoverColor,
  badge,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={isLocked}
      className={`
        relative text-left p-6 rounded-2xl border transition-all duration-300
        bg-gradient-to-br ${gradient}
        ${isLocked 
          ? 'border-slate-700 opacity-60 cursor-not-allowed' 
          : `${borderColor} ${hoverColor} cursor-pointer hover:scale-[1.02] hover:shadow-lg hover:shadow-black/20`
        }
      `}
    >
      {/* Lock Overlay */}
      {isLocked && (
        <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px] rounded-2xl flex items-center justify-center z-10">
          <div className="flex flex-col items-center gap-2 text-center px-4">
            <Lock className="w-8 h-8 text-slate-400" />
            <p className="text-sm font-medium text-slate-400">{lockMessage}</p>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex items-start justify-between">
        <div className={`p-3 rounded-xl bg-slate-800/50 ${accentColor}`}>
          {icon}
        </div>
        
        {badge && (
          <span className="px-3 py-1 text-xs font-bold text-orange-400 bg-orange-400/10 rounded-full border border-orange-400/20">
            {badge}
          </span>
        )}
      </div>

      <div className="mt-4">
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <p className="text-sm text-slate-400 mt-1">{description}</p>
      </div>

      {!isLocked && (
        <div className={`flex items-center gap-2 mt-4 ${accentColor}`}>
          <span className="text-sm font-medium">Browse Store</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      )}
    </button>
  );
};

export default StoreTiles;
