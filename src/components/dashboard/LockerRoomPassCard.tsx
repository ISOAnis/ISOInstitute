import React from 'react';
import { Ticket, Star, ShoppingBag, Crown, Check } from 'lucide-react';

interface LockerRoomPassCardProps {
  onGetPass: () => void;
}

/**
 * Hero card for users without Locker Room Pass
 */
export const LockerRoomPassCard: React.FC<LockerRoomPassCardProps> = ({ onGetPass }) => {
  const benefits = [
    { icon: <ShoppingBag className="w-5 h-5" />, text: 'Access ISO General Store' },
    { icon: <Crown className="w-5 h-5" />, text: 'Unlock Level Store tiers' },
    { icon: <Star className="w-5 h-5" />, text: 'Earn free gear as you level up' },
    { icon: <Ticket className="w-5 h-5" />, text: 'Monthly purchase benefits' },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-orange-500/30 bg-gradient-to-br from-orange-500/10 via-slate-900 to-amber-500/10">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="relative p-8 md:p-10">
        <div className="flex flex-col lg:flex-row lg:items-center gap-8">
          {/* Left Content */}
          <div className="flex-1">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-500/20 border border-orange-500/30 rounded-full mb-4">
              <Ticket className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-semibold text-orange-400">Locker Room Pass</span>
            </div>

            {/* Title */}
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Unlock the Full ISO Experience
            </h2>
            
            {/* Description */}
            <p className="text-lg text-slate-300 mb-6 max-w-xl">
              Get your Locker Room Pass to access exclusive stores, earn free gear as you level up, 
              and join the ISO community of driven individuals building their futures.
            </p>

            {/* Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl border border-slate-700"
                >
                  <div className="p-2 rounded-lg bg-orange-500/20 text-orange-400">
                    {benefit.icon}
                  </div>
                  <span className="text-sm font-medium text-slate-200">{benefit.text}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <button
              onClick={onGetPass}
              className="inline-flex items-center gap-2 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.02]"
            >
              <span>Get Locker Room Pass</span>
              <span className="px-2 py-0.5 text-xs font-bold bg-white/20 rounded-full">
                $5/mo
              </span>
            </button>

            <p className="text-sm text-slate-500 mt-3">
              Cancel anytime · No commitment required
            </p>
          </div>

          {/* Right Content - Preview Card */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="relative">
              {/* Pass Card Visual */}
              <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl p-6 shadow-xl shadow-orange-500/20">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                      <span className="text-xl">🏀</span>
                    </div>
                    <span className="text-lg font-bold text-white">ISO</span>
                  </div>
                  <span className="px-2 py-1 text-xs font-bold text-orange-900 bg-white rounded-full">
                    MEMBER
                  </span>
                </div>

                <div className="space-y-2 mb-6">
                  <div className="h-3 w-32 bg-white/30 rounded" />
                  <div className="h-3 w-24 bg-white/20 rounded" />
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-white/20">
                  <Ticket className="w-5 h-5 text-white/80" />
                  <span className="text-sm font-medium text-white/80">Locker Room Pass</span>
                </div>
              </div>

              {/* Floating Benefits */}
              <div className="absolute -top-3 -right-3 flex items-center gap-1.5 px-3 py-1.5 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg">
                <Check className="w-3.5 h-3.5" />
                <span>Full Access</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LockerRoomPassCard;
