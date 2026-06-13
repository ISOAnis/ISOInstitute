import * as React from 'react';
import { X, ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react';
import type { CartItem } from '../../types/store';

interface StoreCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (itemId: string, qty: number) => void;
  onRemove: (itemId: string) => void;
  onCheckout: () => void;
  remainingPurchases: number;
  accentColor?: string;
}

export function StoreCartDrawer({
  isOpen, onClose, cart, onUpdateQuantity, onRemove, onCheckout, remainingPurchases, accentColor = '#f97316',
}: StoreCartDrawerProps) {
  if (!isOpen) return null;

  const totalItems = cart.reduce((s, c) => s + c.quantity, 0);
  const subtotal = cart.reduce((s, c) => s + c.item.price * c.quantity, 0);

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)', zIndex: 250, display: 'flex', justifyContent: 'flex-end' }}>
      <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 400, height: '100%', background: '#0A0A0A', borderLeft: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ShoppingBag size={18} style={{ color: accentColor }} />
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#F2F2F2', margin: 0, letterSpacing: 1 }}>YOUR CART</h2>
            {totalItems > 0 && (
              <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: accentColor, background: `${accentColor}18`, borderRadius: 100, padding: '2px 10px' }}>
                {totalItems}
              </span>
            )}
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={14} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: 'rgba(255,255,255,0.35)' }}>
              <ShoppingBag size={40} style={{ marginBottom: 12, opacity: 0.3 }} />
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, margin: 0 }}>Your cart is empty</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {cart.map(({ item, quantity }) => (
                <div key={item.id} style={{ display: 'flex', gap: 14, padding: 14, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12 }}>
                  <img src={item.imageUrl} alt={item.name} style={{ width: 64, height: 64, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 600, color: '#F2F2F2', marginBottom: 4 }}>{item.name}</div>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, color: accentColor }}>${item.price.toFixed(0)}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                      <button onClick={() => onUpdateQuantity(item.id, quantity - 1)} style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid rgba(255,255,255,0.12)', background: 'transparent', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Minus size={12} />
                      </button>
                      <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: '#fff', minWidth: 20, textAlign: 'center' }}>{quantity}</span>
                      <button onClick={() => onUpdateQuantity(item.id, quantity + 1)} disabled={remainingPurchases <= 0} style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid rgba(255,255,255,0.12)', background: 'transparent', color: remainingPurchases <= 0 ? 'rgba(255,255,255,0.2)' : '#fff', cursor: remainingPurchases <= 0 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Plus size={12} />
                      </button>
                      <button onClick={() => onRemove(item.id)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', padding: 4 }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div style={{ padding: '20px 24px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Subtotal</span>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#F2F2F2' }}>${subtotal.toFixed(0)}</span>
            </div>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.3)', margin: '0 0 16px' }}>
              {remainingPurchases} purchase{remainingPurchases !== 1 ? 's' : ''} remaining this month
            </p>
            <button
              onClick={onCheckout}
              style={{ width: '100%', background: accentColor, color: '#fff', border: 'none', borderRadius: 10, padding: '14px 0', fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, letterSpacing: 2, cursor: 'pointer' }}
            >
              CHECKOUT
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
