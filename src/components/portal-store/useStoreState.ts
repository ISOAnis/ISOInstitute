import { useState, useCallback } from 'react';
import type { CartItem, StoreItem } from '../../types/store';

const CART_KEY = 'iso_store_cart';
const USAGE_KEY = 'iso_store_usage';

function loadCart(): CartItem[] {
  try {
    const saved = localStorage.getItem(CART_KEY);
    if (!saved) return [];
    return JSON.parse(saved) as CartItem[];
  } catch {
    return [];
  }
}

function loadPurchaseCount(): number {
  try {
    const saved = localStorage.getItem(USAGE_KEY);
    if (!saved) return 0;
    const parsed = JSON.parse(saved) as { month: string; count: number };
    const currentMonth = new Date().toISOString().slice(0, 7);
    return parsed.month === currentMonth ? parsed.count : 0;
  } catch {
    return 0;
  }
}

function savePurchaseCount(count: number) {
  localStorage.setItem(USAGE_KEY, JSON.stringify({
    month: new Date().toISOString().slice(0, 7),
    count,
  }));
}

export function useStoreState(monthlyLimit: number) {
  const [cart, setCart] = useState<CartItem[]>(loadCart);
  const [purchaseCount, setPurchaseCount] = useState(loadPurchaseCount);
  const [checkoutMsg, setCheckoutMsg] = useState<string | null>(null);

  const persistCart = useCallback((items: CartItem[]) => {
    setCart(items);
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, []);

  const cartCount = cart.reduce((s, c) => s + c.quantity, 0);
  const remainingPurchases = monthlyLimit - purchaseCount - cartCount;

  const addToCart = useCallback((item: StoreItem) => {
    if (remainingPurchases <= 0) return false;
    const existing = cart.find(c => c.item.id === item.id);
    const next = existing
      ? cart.map(c => c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c)
      : [...cart, { item, quantity: 1 }];
    persistCart(next);
    return true;
  }, [cart, persistCart, remainingPurchases]);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      persistCart(cart.filter(c => c.item.id !== itemId));
      return;
    }
    persistCart(cart.map(c => c.item.id === itemId ? { ...c, quantity } : c));
  }, [cart, persistCart]);

  const removeItem = useCallback((itemId: string) => {
    persistCart(cart.filter(c => c.item.id !== itemId));
  }, [cart, persistCart]);

  const checkout = useCallback(() => {
    const count = cart.reduce((s, c) => s + c.quantity, 0);
    if (count === 0) return;
    const newTotal = purchaseCount + count;
    setPurchaseCount(newTotal);
    savePurchaseCount(newTotal);
    persistCart([]);
    setCheckoutMsg(`Order placed — ${count} item${count > 1 ? 's' : ''} on the way.`);
    setTimeout(() => setCheckoutMsg(null), 4000);
  }, [cart, purchaseCount, persistCart]);

  return {
    cart,
    cartCount,
    purchaseCount,
    remainingPurchases,
    monthlyLimit,
    addToCart,
    updateQuantity,
    removeItem,
    checkout,
    checkoutMsg,
  };
}
