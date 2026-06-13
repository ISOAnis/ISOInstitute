import * as React from 'react';
import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { generalStoreItems } from '../../mockData/store';
import type { ItemCategory, StoreItem } from '../../types/store';
import { StoreProductCard } from './StoreProductCard';

const CATEGORIES: { value: ItemCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'shirt', label: 'Shirts' },
  { value: 'hoodie', label: 'Hoodies' },
  { value: 'joggers', label: 'Joggers' },
  { value: 'hat', label: 'Hats' },
  { value: 'athleisure', label: 'Athleisure' },
  { value: 'accessory', label: 'Accessories' },
];

interface LockerRoomGearTabProps {
  accentColor?: string;
  monthlyLimit: number;
  purchaseCount: number;
  remainingPurchases: number;
  cartIds: Set<string>;
  onAddToCart: (item: StoreItem) => void;
}

export function LockerRoomGearTab({
  accentColor = '#f97316',
  monthlyLimit,
  purchaseCount,
  remainingPurchases,
  cartIds,
  onAddToCart,
}: LockerRoomGearTabProps) {
  const [category, setCategory] = useState<ItemCategory | 'all'>('all');
  const [search, setSearch] = useState('');

  const items = useMemo(() => generalStoreItems.filter(item => {
    const matchCat = category === 'all' || item.type === category;
    const q = search.toLowerCase();
    const matchSearch = !q || item.name.toLowerCase().includes(q) || item.description?.toLowerCase().includes(q);
    return matchCat && matchSearch;
  }), [category, search]);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
        <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: 0 }}>
          Locker Room lifestyle drops · <strong style={{ color: accentColor }}>{purchaseCount}/{monthlyLimit}</strong> purchases used this month
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '8px 14px' }}>
          <Search size={14} style={{ color: 'rgba(255,255,255,0.3)' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search gear..."
            style={{ background: 'none', border: 'none', outline: 'none', color: '#fff', fontFamily: "'Barlow', sans-serif", fontSize: 13, width: 140 }}
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

      {remainingPurchases <= 0 && (
        <div style={{ padding: '12px 18px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 12, marginBottom: 20, fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>
          Monthly purchase limit reached. Resets next month.
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
        {items.map(item => (
          <StoreProductCard
            key={item.id}
            item={item}
            accentColor={accentColor}
            onAdd={() => onAddToCart(item)}
            disabled={remainingPurchases <= 0}
            disabledLabel="LIMIT"
            inCart={cartIds.has(item.id)}
            badge={item.price >= 50 ? 'DROP' : undefined}
          />
        ))}
      </div>
      {items.length === 0 && (
        <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: 40 }}>No items match your search.</p>
      )}
    </div>
  );
}
