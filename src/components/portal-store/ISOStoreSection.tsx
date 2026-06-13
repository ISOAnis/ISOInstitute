import * as React from 'react';
import { useState } from 'react';
import { ShoppingBag, Lock, ArrowRight } from 'lucide-react';
import { buildStoreUserFromPortal } from '../../utils/storeUser';
import { canAccessOnlineStore, type MembershipPlan } from '../../utils/membership';
import { LOCKER_ROOM_PRICE_USD } from '../../utils/explorerUsage';
import { useStoreState } from './useStoreState';
import { LockerRoomGearTab } from './LockerRoomGearTab';
import { VarsityMilestonesTab } from './VarsityMilestonesTab';
import { StoreCartDrawer } from './StoreCartDrawer';

type StoreTab = 'gear' | 'milestones';

interface ISOStoreSectionProps {
  membershipPlan: MembershipPlan;
  accentColor?: string;
  onUpgrade: (plan: MembershipPlan) => void;
}

export function ISOStoreSection({ membershipPlan, accentColor = '#f97316', onUpgrade }: ISOStoreSectionProps) {
  const storeCtx = buildStoreUserFromPortal();
  const { user, levelStorePreview } = storeCtx;
  const canAccess = canAccessOnlineStore(membershipPlan);

  const {
    cart, cartCount, purchaseCount, remainingPurchases, monthlyLimit,
    addToCart, updateQuantity, removeItem, checkout, checkoutMsg,
  } = useStoreState(user.monthlyPurchaseLimit);

  const [activeTab, setActiveTab] = useState<StoreTab>('gear');
  const [cartOpen, setCartOpen] = useState(false);
  const cartIds = new Set(cart.map(c => c.item.id));

  if (!canAccess) {
    return (
      <div style={{ maxWidth: 520 }}>
        <h2 style={{ color: '#F2F2F2', fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, margin: '0 0 6px', letterSpacing: 0.5 }}>ISO Store</h2>
        <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.4)', margin: '0 0 28px' }}>
          Online merch is a Locker Room benefit
        </p>
        <div style={{ padding: 32, background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.25)', borderRadius: 16, textAlign: 'center' }}>
          <Lock size={32} style={{ color: '#f97316', marginBottom: 16, opacity: 0.7 }} />
          <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: '#F2F2F2', margin: '0 0 10px' }}>Walk-On · In-Person Only</h3>
          <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.45)', margin: '0 0 24px', lineHeight: 1.65 }}>
            Grab ISO gear at pop-ups and in-person events. Upgrade to Locker Room for the online store, community drops, and a preview of ISO Pass milestone merch.
          </p>
          <button
            onClick={() => onUpgrade('locker-room')}
            style={{ background: '#f97316', color: '#fff', border: 'none', borderRadius: 100, padding: '12px 28px', fontFamily: "'Bebas Neue', sans-serif", fontSize: 14, letterSpacing: 2, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}
          >
            LOCKER ROOM · ${LOCKER_ROOM_PRICE_USD}/MO <ArrowRight size={14} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
        <div>
          <h2 style={{ color: '#F2F2F2', fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, margin: '0 0 6px', letterSpacing: 0.5 }}>ISO Store</h2>
          <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
            {levelStorePreview ? 'Locker Room gear + ISO Pass milestone preview' : 'Your gear hub — lifestyle drops & earned milestones'}
          </p>
        </div>
        <button
          onClick={() => setCartOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '10px 18px', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: 1 }}
        >
          <ShoppingBag size={15} />
          CART{cartCount > 0 && ` · ${cartCount}`}
        </button>
      </div>

      {checkoutMsg && (
        <div style={{ padding: '12px 18px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 12, marginBottom: 20, fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
          {checkoutMsg}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: 4, marginBottom: 28, width: 'fit-content' }}>
        {([
          { id: 'gear' as StoreTab, label: 'Locker Room Gear' },
          { id: 'milestones' as StoreTab, label: levelStorePreview ? 'ISO Pass Milestones · Preview' : 'ISO Pass Milestones' },
        ]).map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 20px', borderRadius: 9, border: 'none', cursor: 'pointer',
              fontFamily: "'Barlow Condensed', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: 1,
              background: activeTab === tab.id ? (tab.id === 'milestones' && levelStorePreview ? 'rgba(168,85,247,0.25)' : `${accentColor}25`) : 'transparent',
              color: activeTab === tab.id ? (tab.id === 'milestones' && levelStorePreview ? '#a855f7' : accentColor) : 'rgba(255,255,255,0.4)',
              textTransform: 'uppercase',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'gear' && (
        <LockerRoomGearTab
          accentColor={accentColor}
          monthlyLimit={monthlyLimit}
          purchaseCount={purchaseCount}
          remainingPurchases={remainingPurchases}
          cartIds={cartIds}
          onAddToCart={item => { if (addToCart(item)) setCartOpen(true); }}
        />
      )}

      {activeTab === 'milestones' && (
        <VarsityMilestonesTab
          previewMode={levelStorePreview}
          currentLevel={user.currentLevel}
          unlockedLevels={user.unlockedLevels}
          onUpgrade={() => onUpgrade('varsity')}
        />
      )}

      <StoreCartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onUpdateQuantity={updateQuantity}
        onRemove={removeItem}
        onCheckout={checkout}
        remainingPurchases={remainingPurchases}
        accentColor={accentColor}
      />
    </div>
  );
}
