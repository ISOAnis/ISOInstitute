import React from 'react';
import { User } from '../../types/store';
import { ProgressBar } from '../common/ProgressBar';
import { ShoppingBag, Calendar, AlertCircle } from 'lucide-react';

interface LimitCardProps {
  user: User;
}

/**
 * Monthly purchase limit tracking card
 */
export const LimitCard: React.FC<LimitCardProps> = ({ user }) => {
  const remaining = user.monthlyPurchaseLimit - user.monthlyPurchaseCount;
  const isAtLimit = remaining <= 0;
  const isNearLimit = remaining === 1;

  return (
    <div className={`bg-slate-800/50 border rounded-2xl p-6 backdrop-blur-sm ${
      isAtLimit ? 'border-red-500/30' : 'border-slate-700'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${isAtLimit ? 'bg-red-500/20' : 'bg-blue-500/20'}`}>
            <ShoppingBag className={`w-5 h-5 ${isAtLimit ? 'text-red-400' : 'text-blue-400'}`} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Monthly Purchases</h3>
            <p className="text-sm text-slate-400">Locker Room Pass benefit</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5 text-slate-400">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">Resets monthly</span>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">Items purchased this month</span>
          <span className={`font-semibold ${isAtLimit ? 'text-red-400' : 'text-white'}`}>
            {user.monthlyPurchaseCount} / {user.monthlyPurchaseLimit}
          </span>
        </div>

        <ProgressBar
          current={user.monthlyPurchaseCount}
          max={user.monthlyPurchaseLimit}
          colorClass={isAtLimit ? 'bg-red-500' : isNearLimit ? 'bg-yellow-500' : 'bg-blue-500'}
          size="md"
        />
      </div>

      {/* Status Message */}
      <div className={`mt-4 p-3 rounded-xl flex items-center gap-3 ${
        isAtLimit 
          ? 'bg-red-500/10 border border-red-500/20' 
          : isNearLimit 
          ? 'bg-yellow-500/10 border border-yellow-500/20'
          : 'bg-slate-700/50'
      }`}>
        {isAtLimit ? (
          <>
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-400">Monthly limit reached</p>
              <p className="text-xs text-slate-400">Your limit resets at the start of next month</p>
            </div>
          </>
        ) : isNearLimit ? (
          <>
            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-yellow-400">1 purchase remaining</p>
              <p className="text-xs text-slate-400">Choose wisely!</p>
            </div>
          </>
        ) : (
          <>
            <ShoppingBag className="w-5 h-5 text-green-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-green-400">{remaining} purchases remaining</p>
              <p className="text-xs text-slate-400">Browse the store and find your gear</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LimitCard;
