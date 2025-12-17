import React, { useState, useCallback } from 'react';
import {
  User,
  StoreItem,
  CartItem,
  StoreType,
  UserLevel,
  ToastMessage,
  EarnedReward,
} from '../../types/store';
import { mockUser, mockUserNoPass } from '../../mockData/store';

// Dashboard Components
import { ProfileCard } from '../dashboard/ProfileCard';
import { RewardsCard } from '../dashboard/RewardsCard';
import { LimitCard } from '../dashboard/LimitCard';
import { StoreTiles } from '../dashboard/StoreTiles';
import { TierPreview } from '../dashboard/TierPreview';
import { LockerRoomPassCard } from '../dashboard/LockerRoomPassCard';

// Store Components
import { GeneralStore } from './GeneralStore';
import { LevelStore } from './LevelStore';

// Common Components
import { CartDrawer } from '../common/CartDrawer';
import { ToastContainer } from '../common/Toast';

import { ArrowLeft, Settings, ShoppingBag } from 'lucide-react';

type View = 'dashboard' | 'general-store' | 'level-store';

interface StoreDashboardProps {
  onBack?: () => void;
}

/**
 * Main Store Dashboard - Hub for the entire store system
 */
export const StoreDashboard: React.FC<StoreDashboardProps> = ({ onBack }) => {
  // Toggle between mock users (with/without pass) for demo
  const [usePassUser, setUsePassUser] = useState(true);
  const [user, setUser] = useState<User>(usePassUser ? mockUser : mockUserNoPass);

  // Navigation state
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedLevelFromDashboard, setSelectedLevelFromDashboard] = useState<UserLevel | null>(null);

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Toast state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Add toast helper
  const addToast = useCallback((type: ToastMessage['type'], message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message }]);
  }, []);

  // Remove toast helper
  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Toggle user type for demo
  const toggleUserType = () => {
    const newUsePassUser = !usePassUser;
    setUsePassUser(newUsePassUser);
    setUser(newUsePassUser ? mockUser : mockUserNoPass);
    setCart([]);
    addToast('info', `Switched to ${newUsePassUser ? 'Locker Room Pass' : 'Free'} user`);
  };

  // Handle getting Locker Room Pass (mock)
  const handleGetPass = () => {
    setUser(prev => ({ ...prev, hasLockerRoomPass: true }));
    addToast('success', 'Welcome to the Locker Room! You now have full store access.');
  };

  // Handle store selection
  const handleSelectStore = (store: StoreType) => {
    if (store === 'general') {
      setCurrentView('general-store');
    } else {
      setCurrentView('level-store');
    }
  };

  // Handle level selection from tier preview
  const handleSelectLevel = (level: UserLevel) => {
    setSelectedLevelFromDashboard(level);
    setCurrentView('level-store');
  };

  // Handle adding item to cart
  const handleAddToCart = (item: StoreItem) => {
    const remainingPurchases = user.monthlyPurchaseLimit - user.monthlyPurchaseCount;
    const currentCartCount = cart.reduce((sum, ci) => sum + ci.quantity, 0);

    if (remainingPurchases - currentCartCount <= 0) {
      addToast('error', "You've reached your monthly purchase limit.");
      return;
    }

    const existingItem = cart.find(ci => ci.item.id === item.id);
    if (existingItem) {
      setCart(prev =>
        prev.map(ci =>
          ci.item.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
        )
      );
    } else {
      setCart(prev => [...prev, { item, quantity: 1 }]);
    }

    addToast('success', `${item.name} added to cart`);
  };

  // Handle updating cart quantity
  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    setCart(prev =>
      prev.map(ci =>
        ci.item.id === itemId ? { ...ci, quantity } : ci
      )
    );
  };

  // Handle removing item from cart
  const handleRemoveItem = (itemId: string) => {
    setCart(prev => prev.filter(ci => ci.item.id !== itemId));
    addToast('info', 'Item removed from cart');
  };

  // Handle checkout (mock)
  const handleCheckout = () => {
    const itemCount = cart.reduce((sum, ci) => sum + ci.quantity, 0);
    
    // Update user's monthly purchase count
    setUser(prev => ({
      ...prev,
      monthlyPurchaseCount: prev.monthlyPurchaseCount + itemCount,
    }));

    // Clear cart
    setCart([]);
    setIsCartOpen(false);

    addToast('success', `Order placed! ${itemCount} items purchased.`);
  };

  // Handle claiming rewards
  const handleClaimRewards = (
    level: UserLevel,
    clothingItem: StoreItem | null,
    accessoryItem: StoreItem | null
  ) => {
    setUser(prev => {
      const updatedRewards = prev.earnedRewards.map(reward => {
        if (reward.levelUnlocked === level && reward.claimedAt === null) {
          if (reward.itemType === 'clothing' && clothingItem) {
            return {
              ...reward,
              itemId: clothingItem.id,
              itemName: clothingItem.name,
              claimedAt: new Date(),
            };
          }
          if (reward.itemType === 'accessory' && accessoryItem) {
            return {
              ...reward,
              itemId: accessoryItem.id,
              itemName: accessoryItem.name,
              claimedAt: new Date(),
            };
          }
        }
        return reward;
      });

      return { ...prev, earnedRewards: updatedRewards };
    });

    const claimedItems = [clothingItem?.name, accessoryItem?.name].filter(Boolean);
    addToast('success', `Rewards claimed: ${claimedItems.join(', ')}`);
  };

  // Handle claiming rewards from dashboard
  const handleClaimFromDashboard = (level: UserLevel) => {
    setSelectedLevelFromDashboard(level);
    setCurrentView('level-store');
  };

  // Calculate remaining purchases
  const remainingPurchases = user.monthlyPurchaseLimit - user.monthlyPurchaseCount - 
    cart.reduce((sum, ci) => sum + ci.quantity, 0);

  // Render based on current view
  if (currentView === 'general-store') {
    return (
      <>
        <GeneralStore
          user={user}
          cart={cart}
          onAddToCart={handleAddToCart}
          onOpenCart={() => setIsCartOpen(true)}
          onBack={() => setCurrentView('dashboard')}
        />
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cart={cart}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onCheckout={handleCheckout}
          remainingPurchases={remainingPurchases}
        />
        <ToastContainer toasts={toasts} onDismiss={removeToast} />
      </>
    );
  }

  if (currentView === 'level-store') {
    return (
      <>
        <LevelStore
          user={user}
          cart={cart}
          onAddToCart={handleAddToCart}
          onOpenCart={() => setIsCartOpen(true)}
          onBack={() => {
            setCurrentView('dashboard');
            setSelectedLevelFromDashboard(null);
          }}
          onClaimRewards={handleClaimRewards}
        />
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cart={cart}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onCheckout={handleCheckout}
          remainingPurchases={remainingPurchases}
        />
        <ToastContainer toasts={toasts} onDismiss={removeToast} />
      </>
    );
  }

  // Dashboard View
  return (
    <div className="min-h-screen pt-20" style={{ background: '#030305' }}>
      {/* Header */}
      <div className="sticky top-20 z-30 backdrop-blur-md border-b border-white/10" style={{ background: 'rgba(3, 3, 5, 0.95)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Back & Title */}
            <div className="flex items-center gap-4">
              {onBack && (
                <button
                  onClick={onBack}
                  className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-slate-400" />
                </button>
              )}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
                  <span className="text-xl">🏀</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">ISO Locker Room</h1>
                  <p className="text-sm text-slate-400">Level up your game & your wardrobe</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Demo Toggle */}
              <button
                onClick={toggleUserType}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                title="Toggle user type for demo"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {user.hasLockerRoomPass ? 'Has Pass' : 'No Pass'}
                </span>
              </button>

              {/* Cart Button */}
              {user.hasLockerRoomPass && (
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="relative flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
                >
                  <ShoppingBag className="w-5 h-5 text-slate-300" />
                  <span className="text-sm font-medium text-slate-300 hidden sm:inline">Cart</span>
                  {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs font-bold text-white bg-orange-500 rounded-full">
                      {cart.reduce((sum, ci) => sum + ci.quantity, 0)}
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Locker Room Pass CTA (if no pass) */}
        {!user.hasLockerRoomPass && (
          <div className="mb-8">
            <LockerRoomPassCard onGetPass={handleGetPass} />
          </div>
        )}

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile & Rewards */}
          <div className="lg:col-span-1 space-y-6">
            <ProfileCard user={user} />
            <RewardsCard user={user} onClaimRewards={handleClaimFromDashboard} />
          </div>

          {/* Right Column - Limit, Store Tiles, Tiers */}
          <div className="lg:col-span-2 space-y-6">
            {user.hasLockerRoomPass && <LimitCard user={user} />}
            
            <StoreTiles user={user} onSelectStore={handleSelectStore} />
            
            <TierPreview user={user} onSelectLevel={handleSelectLevel} />
          </div>
        </div>
      </div>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
        remainingPurchases={remainingPurchases}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
};

export default StoreDashboard;
