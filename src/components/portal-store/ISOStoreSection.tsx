import * as React from 'react';
import { useState } from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
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
  const isWalkOnPreview = membershipPlan === 'walk-on';

  const {
    cart, cartCount, purchaseCount, remainingPurchases, monthlyLimit,
    addToCart, updateQuantity, removeItem, checkout, checkoutMsg,
  } = useStoreState(user.monthlyPurchaseLimit);

  const [activeTab, setActiveTab] = useState<StoreTab>('gear');
  const [cartOpen, setCartOpen] = useState(false);
  const cartIds = new Set(cart.map(c => c.item.id));

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
        <div>
          <h2 style={{ color: '#F2F2F2', fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, margin: '0 0 6px', letterSpacing: 0.5 }}>ISO Store</h2>
          <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
            {isWalkOnPreview
              ? 'Browse gear & milestone rewards — online checkout unlocks with Locker Room'
              : levelStorePreview
                ? 'Locker Room gear + ISO Pass milestone preview'
                : 'Your gear hub — lifestyle drops & earned milestones'}
          </p>
        </div>
        {canAccess && (
          <button
            onClick={() => setCartOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '10px 18px', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: 1 }}
          >
            <ShoppingBag size={15} />
            CART{cartCount > 0 && ` · ${cartCount}`}
          </button>
        )}
      </div>

      {isWalkOnPreview && (
        <div style={{ padding: '14px 18px', background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.25)', borderRadius: 12, marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: 1.5, flex: 1, minWidth: 220 }}>
            Walk-On members grab ISO gear at pop-ups and in-person events. Preview the catalog below, then upgrade to shop online.
          </p>
          <button
            onClick={() => onUpgrade('locker-room')}
            style={{ background: '#f97316', color: '#fff', border: 'none', borderRadius: 100, padding: '10px 20px', fontFamily: "'Bebas Neue', sans-serif", fontSize: 13, letterSpacing: 1.5, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8, flexShrink: 0 }}
          >
            LOCKER ROOM · ${LOCKER_ROOM_PRICE_USD}/MO <ArrowRight size={14} />
          </button>
        </div>
      )}

      {checkoutMsg && (
        <div style={{ padding: '12px 18px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 12, marginBottom: 20, fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
          {checkoutMsg}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: 4, marginBottom: 28, width: 'fit-content' }}>
        {([
          { id: 'gear' as StoreTab, label: 'Locker Room Gear' },
          { id: 'milestones' as StoreTab, label: isWalkOnPreview || levelStorePreview ? 'ISO Pass Milestones · Preview' : 'ISO Pass Milestones' },
        ]).map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 20px', borderRadius: 9, border: 'none', cursor: 'pointer',
              fontFamily: "'Barlow Condensed', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: 1,
              background: activeTab === tab.id ? (tab.id === 'milestones' && (levelStorePreview || isWalkOnPreview) ? 'rgba(168,85,247,0.25)' : `${accentColor}25`) : 'transparent',
              color: activeTab === tab.id ? (tab.id === 'milestones' && (levelStorePreview || isWalkOnPreview) ? '#a855f7' : accentColor) : 'rgba(255,255,255,0.4)',
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
          onAddToCart={item => { if (!isWalkOnPreview && addToCart(item)) setCartOpen(true); }}
          previewOnly={isWalkOnPreview}
        />
      )}

      {activeTab === 'milestones' && (
        <VarsityMilestonesTab
          previewMode={isWalkOnPreview || levelStorePreview}
          currentLevel={user.currentLevel}
          unlockedLevels={user.unlockedLevels}
          onUpgrade={() => onUpgrade('varsity')}
        />
      )}

      {canAccess && (
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
      )}
    </div>
  );
}
