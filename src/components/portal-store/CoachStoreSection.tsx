import * as React from 'react';
import { useState, useMemo } from 'react';
import { ShoppingBag, Search, Lock } from 'lucide-react';
import { coachStoreItems, coachTierMeetsRequirement, COACH_TIER_LABELS, type CoachStoreItem } from '../../mockData/coachStore';
import { getCoachResult } from '../../utils/coachProfile';
import type { CoachTier } from '../../utils/coachProfile';
import type { ItemCategory, StoreItem } from '../../types/store';
import { useStoreState } from './useStoreState';
import { StoreProductCard } from './StoreProductCard';
import { StoreCartDrawer } from './StoreCartDrawer';

const CATEGORIES: { value: ItemCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'shirt', label: 'Polos & Tees' },
  { value: 'hoodie', label: 'Hoodies' },
  { value: 'joggers', label: 'Joggers' },
  { value: 'athleisure', label: 'Outerwear' },
  { value: 'hat', label: 'Headwear' },
  { value: 'accessory', label: 'Accessories' },
];

const TIER_COLORS: Record<CoachTier, string> = {
  bronze: '#cd7f32',
  silver: '#c0c0c0',
  gold: '#ffd700',
  premium: '#a855f7',
};

function toStoreItem(item: CoachStoreItem): StoreItem {
  return {
    id: item.id,
    name: item.name,
    type: item.type,
    imageUrl: item.imageUrl,
    price: item.price,
    isFreeEligible: false,
    description: item.description,
  };
}

interface CoachStoreSectionProps {
  accentColor?: string;
}

export function CoachStoreSection({ accentColor = '#10b981' }: CoachStoreSectionProps) {
  const coachTier: CoachTier = getCoachResult()?.tier ?? 'silver';
  const coachTierLabel = getCoachResult()?.tierLabel ?? COACH_TIER_LABELS[coachTier];

  const {
    cart, cartCount, purchaseCount, remainingPurchases, monthlyLimit,
    addToCart, updateQuantity, removeItem, checkout, checkoutMsg,
  } = useStoreState(3);

  const [category, setCategory] = useState<ItemCategory | 'all'>('all');
  const [search, setSearch] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const cartIds = new Set(cart.map(c => c.item.id));

  const items = useMemo(() => coachStoreItems.filter(item => {
    const matchCat = category === 'all' || item.type === category;
    const q = search.toLowerCase();
    const matchSearch = !q || item.name.toLowerCase().includes(q) || item.description?.toLowerCase().includes(q);
    return matchCat && matchSearch;
  }), [category, search]);

  const unlockedCount = coachStoreItems.filter(i => coachTierMeetsRequirement(coachTier, i.tierRequirement)).length;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
        <div>
          <h2 style={{ color: '#F2F2F2', fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, margin: '0 0 6px', letterSpacing: 0.5 }}>Coach Store</h2>
          <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
            Tier-gated coaching gear · <span style={{ color: TIER_COLORS[coachTier] }}>{coachTierLabel}</span> unlocks {unlockedCount} of {coachStoreItems.length} items
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

      <div style={{
        padding: '14px 18px', background: `${TIER_COLORS[coachTier]}10`, border: `1px solid ${TIER_COLORS[coachTier]}30`,
        borderRadius: 12, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
      }}>
        <Lock size={16} style={{ color: TIER_COLORS[coachTier], flexShrink: 0 }} />
        <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: 1.5 }}>
          Gear unlocks by coach tier. Raise your OVR through sessions, reviews, and community impact to access Gold and Premium collections.
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
        <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: 0 }}>
          Coach purchases · <strong style={{ color: accentColor }}>{purchaseCount}/{monthlyLimit}</strong> used this month
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '8px 14px' }}>
          <Search size={14} style={{ color: 'rgba(255,255,255,0.3)' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search coach gear..."
            style={{ background: 'none', border: 'none', outline: 'none', color: '#fff', fontFamily: "'Barlow', sans-serif", fontSize: 13, width: 160 }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 24 }}>
        {CATEGORIES.map(c => (
          <button
            key={c.value}
            onClick={() => setCategory(c.value)}
            style={{
              padding: '6px 14px', borderRadius: 100, border: 'none', cursor: 'pointer',
              fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 1,
              background: category === c.value ? `${accentColor}25` : 'rgba(255,255,255,0.05)',
              color: category === c.value ? accentColor : 'rgba(255,255,255,0.4)',
              textTransform: 'uppercase',
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
        {items.map(item => {
          const unlocked = coachTierMeetsRequirement(coachTier, item.tierRequirement);
          const storeItem = toStoreItem(item);
          return (
            <StoreProductCard
              key={item.id}
              item={storeItem}
              accentColor={unlocked ? accentColor : TIER_COLORS[item.tierRequirement]}
              onAdd={unlocked && remainingPurchases > 0 ? () => { if (addToCart(storeItem)) setCartOpen(true); } : undefined}
              disabled={!unlocked || remainingPurchases <= 0}
              disabledLabel={!unlocked ? `Requires ${COACH_TIER_LABELS[item.tierRequirement]}` : 'Monthly limit reached'}
              inCart={cartIds.has(item.id)}
              badge={`${COACH_TIER_LABELS[item.tierRequirement]}+`}
            />
          );
        })}
      </div>

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
