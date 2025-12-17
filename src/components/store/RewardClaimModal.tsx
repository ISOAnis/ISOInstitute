import React, { useState } from 'react';
import { StoreItem, UserLevel } from '../../types/store';
import { levelColors, getFreeEligibleItems } from '../../mockData/store';
import { X, Gift, Check, Sparkles, ArrowRight } from 'lucide-react';

interface RewardClaimModalProps {
  level: UserLevel;
  onClose: () => void;
  onClaimRewards: (clothingItem: StoreItem | null, accessoryItem: StoreItem | null) => void;
  clothingClaimed: boolean;
  accessoryClaimed: boolean;
}

/**
 * Modal for claiming free rewards when level is unlocked
 */
export const RewardClaimModal: React.FC<RewardClaimModalProps> = ({
  level,
  onClose,
  onClaimRewards,
  clothingClaimed,
  accessoryClaimed,
}) => {
  const [selectedClothing, setSelectedClothing] = useState<StoreItem | null>(null);
  const [selectedAccessory, setSelectedAccessory] = useState<StoreItem | null>(null);
  const [step, setStep] = useState<'clothing' | 'accessory' | 'confirm'>(
    clothingClaimed ? (accessoryClaimed ? 'confirm' : 'accessory') : 'clothing'
  );

  const colors = levelColors[level];
  const clothingItems = getFreeEligibleItems(level, 'clothing');
  const accessoryItems = getFreeEligibleItems(level, 'accessory');

  const handleNext = () => {
    if (step === 'clothing' && !accessoryClaimed) {
      setStep('accessory');
    } else {
      setStep('confirm');
    }
  };

  const handleBack = () => {
    if (step === 'accessory') {
      setStep('clothing');
    } else if (step === 'confirm') {
      setStep(accessoryClaimed ? 'clothing' : 'accessory');
    }
  };

  const handleConfirm = () => {
    onClaimRewards(selectedClothing, selectedAccessory);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className={`relative p-6 bg-gradient-to-br ${colors.bg} border-b border-slate-700`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-800/50 transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>

          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl bg-slate-800/50`}>
              <Gift className={`w-8 h-8 ${colors.primary}`} />
            </div>
            <div>
              <span className={`text-sm font-semibold ${colors.primary}`}>{level} Level</span>
              <h2 className="text-2xl font-bold text-white">Claim Your Rewards!</h2>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-2 mt-4">
            {!clothingClaimed && (
              <StepIndicator
                label="Clothing"
                isActive={step === 'clothing'}
                isComplete={step !== 'clothing' && selectedClothing !== null}
              />
            )}
            {!clothingClaimed && !accessoryClaimed && (
              <div className="w-8 h-px bg-slate-600" />
            )}
            {!accessoryClaimed && (
              <StepIndicator
                label="Accessory"
                isActive={step === 'accessory'}
                isComplete={step === 'confirm' && selectedAccessory !== null}
              />
            )}
            <div className="w-8 h-px bg-slate-600" />
            <StepIndicator
              label="Confirm"
              isActive={step === 'confirm'}
              isComplete={false}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Clothing Selection */}
          {step === 'clothing' && !clothingClaimed && (
            <ItemSelection
              title="Choose Your Free Clothing Item"
              items={clothingItems}
              selectedItem={selectedClothing}
              onSelect={setSelectedClothing}
              colors={colors}
            />
          )}

          {/* Accessory Selection */}
          {step === 'accessory' && !accessoryClaimed && (
            <ItemSelection
              title="Choose Your Free Accessory"
              items={accessoryItems}
              selectedItem={selectedAccessory}
              onSelect={setSelectedAccessory}
              colors={colors}
            />
          )}

          {/* Confirmation */}
          {step === 'confirm' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Confirm Your Selections</h3>
              
              <div className="space-y-3">
                {selectedClothing && (
                  <SelectedItemCard item={selectedClothing} label="Free Clothing" />
                )}
                {selectedAccessory && (
                  <SelectedItemCard item={selectedAccessory} label="Free Accessory" />
                )}
                {!selectedClothing && !selectedAccessory && (
                  <p className="text-slate-400 text-center py-4">No items selected</p>
                )}
              </div>

              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                <div className="flex items-center gap-2 text-green-400">
                  <Sparkles className="w-5 h-5" />
                  <span className="font-semibold">These items are FREE!</span>
                </div>
                <p className="text-sm text-slate-400 mt-1">
                  Congratulations on reaching {level}! Your rewards are ready.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-slate-700 bg-slate-800/30">
          {step !== 'clothing' || clothingClaimed ? (
            <button
              onClick={handleBack}
              className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {step === 'confirm' ? (
            <button
              onClick={handleConfirm}
              disabled={!selectedClothing && !selectedAccessory}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200
                ${selectedClothing || selectedAccessory
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                }
              `}
            >
              <Check className="w-5 h-5" />
              <span>Claim Rewards</span>
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={step === 'clothing' && !selectedClothing && step === 'accessory' && !selectedAccessory}
              className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold transition-colors"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

interface StepIndicatorProps {
  label: string;
  isActive: boolean;
  isComplete: boolean;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ label, isActive, isComplete }) => (
  <div className="flex items-center gap-2">
    <div
      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
        isActive
          ? 'bg-orange-500 text-white'
          : isComplete
          ? 'bg-green-500 text-white'
          : 'bg-slate-700 text-slate-400'
      }`}
    >
      {isComplete ? <Check className="w-3 h-3" /> : ''}
    </div>
    <span className={`text-sm ${isActive ? 'text-white font-medium' : 'text-slate-400'}`}>
      {label}
    </span>
  </div>
);

interface ItemSelectionProps {
  title: string;
  items: StoreItem[];
  selectedItem: StoreItem | null;
  onSelect: (item: StoreItem) => void;
  colors: { primary: string; secondary: string; bg: string };
}

const ItemSelection: React.FC<ItemSelectionProps> = ({
  title,
  items,
  selectedItem,
  onSelect,
  colors,
}) => (
  <div>
    <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect(item)}
          className={`
            relative p-3 rounded-xl border transition-all duration-200 text-left
            ${selectedItem?.id === item.id
              ? `border-orange-500 bg-orange-500/10`
              : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
            }
          `}
        >
          {selectedItem?.id === item.id && (
            <div className="absolute top-2 right-2">
              <Check className="w-5 h-5 text-orange-400" />
            </div>
          )}
          <div className="aspect-square w-full rounded-lg overflow-hidden bg-slate-700 mb-2">
            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
          </div>
          <p className="text-sm font-medium text-white truncate">{item.name}</p>
          <p className="text-xs text-slate-400 capitalize">{item.type}</p>
        </button>
      ))}
    </div>
  </div>
);

interface SelectedItemCardProps {
  item: StoreItem;
  label: string;
}

const SelectedItemCard: React.FC<SelectedItemCardProps> = ({ item, label }) => (
  <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl border border-slate-700">
    <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-700 flex-shrink-0">
      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
    </div>
    <div className="flex-1 min-w-0">
      <span className="text-xs text-green-400 font-medium">{label}</span>
      <p className="text-sm font-medium text-white truncate">{item.name}</p>
      <p className="text-xs text-slate-400 capitalize">{item.type}</p>
    </div>
    <div className="text-right">
      <span className="text-sm line-through text-slate-500">${item.price}</span>
      <span className="block text-sm font-bold text-green-400">FREE</span>
    </div>
  </div>
);

export default RewardClaimModal;
