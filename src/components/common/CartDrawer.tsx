import React from 'react';
import { X, ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem, StoreItem } from '../../types/store';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onCheckout: () => void;
  remainingPurchases: number;
  isCheckoutDisabled?: boolean;
}

/**
 * Slide-out cart drawer component
 */
export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  remainingPurchases,
  isCheckoutDisabled = false,
}) => {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.item.price * item.quantity, 0);

  // Don't render anything if cart is closed - prevents backdrop from blocking interactions
  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Backdrop - only rendered when cart is open */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Drawer - only rendered when cart is open */}
      <div
        className="fixed right-0 top-0 h-full w-full max-w-md bg-slate-900 border-l border-slate-700 z-50 transform transition-transform duration-300 ease-out"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-orange-400" />
            <h2 className="text-xl font-semibold text-white">Your Cart</h2>
            {totalItems > 0 && (
              <span className="px-2 py-0.5 text-sm font-medium text-orange-400 bg-orange-400/10 rounded-full">
                {totalItems}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6" style={{ maxHeight: 'calc(100vh - 280px)' }}>
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ShoppingBag className="w-16 h-16 text-slate-600 mb-4" />
              <p className="text-slate-400 text-lg">Your cart is empty</p>
              <p className="text-slate-500 text-sm mt-1">
                Add some gear to get started
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map(({ item, quantity }) => (
                <CartItemCard
                  key={item.id}
                  item={item}
                  quantity={quantity}
                  onUpdateQuantity={(qty) => onUpdateQuantity(item.id, qty)}
                  onRemove={() => onRemoveItem(item.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-slate-900 border-t border-slate-700">
          {/* Purchase Capacity */}
          <div className="flex items-center justify-between mb-4 p-3 bg-slate-800/50 rounded-xl">
            <span className="text-sm text-slate-400">Monthly purchases remaining</span>
            <span className={`text-sm font-semibold ${remainingPurchases > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {remainingPurchases} items
            </span>
          </div>

          {/* Subtotal */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-400">Subtotal</span>
            <span className="text-xl font-bold text-white">${subtotal.toFixed(2)}</span>
          </div>

          {/* Checkout Button */}
          <button
            onClick={onCheckout}
            disabled={cart.length === 0 || isCheckoutDisabled}
            className={`
              w-full py-4 px-6 rounded-xl font-semibold text-base transition-all duration-200
              ${cart.length === 0 || isCheckoutDisabled
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/25'
              }
            `}
          >
            {cart.length === 0 ? 'Add items to checkout' : `Checkout (${totalItems} items)`}
          </button>

          <p className="text-center text-xs text-slate-500 mt-3">
            Checkout is a demo feature
          </p>
        </div>
      </div>
    </>
  );
};

interface CartItemCardProps {
  item: StoreItem;
  quantity: number;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}

/**
 * Individual cart item card
 */
const CartItemCard: React.FC<CartItemCardProps> = ({
  item,
  quantity,
  onUpdateQuantity,
  onRemove,
}) => {
  return (
    <div className="flex gap-4 p-3 bg-slate-800/50 rounded-xl">
      {/* Image */}
      <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-700 flex-shrink-0">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-white truncate">{item.name}</h4>
        <p className="text-xs text-slate-400 capitalize mt-0.5">{item.type}</p>
        <p className="text-sm font-semibold text-orange-400 mt-1">
          ${item.price.toFixed(2)}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col items-end justify-between">
        <button
          onClick={onRemove}
          className="p-1.5 rounded-lg hover:bg-slate-700 transition-colors"
        >
          <Trash2 className="w-4 h-4 text-slate-400" />
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onUpdateQuantity(Math.max(1, quantity - 1))}
            className="p-1 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
          >
            <Minus className="w-3 h-3 text-slate-300" />
          </button>
          <span className="text-sm font-medium text-white w-6 text-center">
            {quantity}
          </span>
          <button
            onClick={() => onUpdateQuantity(quantity + 1)}
            className="p-1 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
          >
            <Plus className="w-3 h-3 text-slate-300" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
