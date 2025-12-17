import React, { useState } from 'react';
import { StoreItem, UserLevel } from '../../types/store';
import { levelColors } from '../../mockData/store';
import { ShoppingCart, Check, Gift, Lock } from 'lucide-react';

interface ProductCardProps {
  item: StoreItem;
  onAddToCart: (item: StoreItem) => void;
  isInCart?: boolean;
  isDisabled?: boolean;
  disabledReason?: string;
  showFreeTag?: boolean;
  isLocked?: boolean;
}

/**
 * Product card for store grid
 */
export const ProductCard: React.FC<ProductCardProps> = ({
  item,
  onAddToCart,
  isInCart = false,
  isDisabled = false,
  disabledReason,
  showFreeTag = false,
  isLocked = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const levelColor = item.levelRequirement ? levelColors[item.levelRequirement] : null;

  return (
    <div
      className={`
        relative group rounded-2xl border overflow-hidden transition-all duration-300
        ${isLocked 
          ? 'border-slate-700 bg-slate-800/30' 
          : 'border-slate-700 bg-slate-800/50 hover:border-slate-600 hover:shadow-lg hover:shadow-black/20'
        }
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-slate-900 overflow-hidden">
        <img
          src={item.imageUrl}
          alt={item.name}
          className={`w-full h-full object-cover transition-transform duration-300 ${
            isHovered && !isLocked ? 'scale-105' : 'scale-100'
          } ${isLocked ? 'blur-[3px] opacity-50' : ''}`}
        />

        {/* Locked Overlay */}
        {isLocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50">
            <div className="flex flex-col items-center gap-2 text-center px-4">
              <Lock className="w-8 h-8 text-slate-400" />
              <p className="text-sm font-medium text-slate-400">Unlock to access</p>
            </div>
          </div>
        )}

        {/* Tags */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {/* Level Requirement Tag */}
          {item.levelRequirement && levelColor && !isLocked && (
            <span className={`px-2 py-1 text-xs font-bold rounded-full ${levelColor.bg} ${levelColor.primary}`}>
              {item.levelRequirement}
            </span>
          )}
          
          {/* Free Tag */}
          {showFreeTag && item.isFreeEligible && !isLocked && (
            <span className="flex items-center gap-1 px-2 py-1 text-xs font-bold text-green-400 bg-green-400/20 rounded-full">
              <Gift className="w-3 h-3" /> Free
            </span>
          )}
        </div>

        {/* Category Tag */}
        <div className="absolute top-3 right-3">
          <span className="px-2 py-1 text-xs font-medium text-slate-300 bg-slate-800/80 backdrop-blur-sm rounded-full capitalize">
            {item.type}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-base font-semibold text-white truncate">{item.name}</h3>
        {item.description && (
          <p className="text-sm text-slate-400 mt-1 line-clamp-2">{item.description}</p>
        )}

        {/* Colors */}
        {item.colors && item.colors.length > 0 && (
          <p className="text-xs text-slate-500 mt-2">
            {item.colors.join(' · ')}
          </p>
        )}

        {/* Price & Action */}
        <div className="flex items-center justify-between mt-4">
          <span className="text-lg font-bold text-white">
            ${item.price.toFixed(2)}
          </span>

          <button
            onClick={() => !isDisabled && !isLocked && onAddToCart(item)}
            disabled={isDisabled || isLocked}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200
              ${isInCart
                ? 'bg-green-500/20 text-green-400 cursor-default'
                : isDisabled
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                : isLocked
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-orange-500 hover:bg-orange-600 text-white'
              }
            `}
            title={disabledReason}
          >
            {isInCart ? (
              <>
                <Check className="w-4 h-4" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>

        {/* Disabled Reason */}
        {isDisabled && disabledReason && (
          <p className="text-xs text-red-400 mt-2">{disabledReason}</p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
