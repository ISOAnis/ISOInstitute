import React, { useState, useMemo } from 'react';
import { StoreItem, CartItem, User, ItemCategory } from '../../types/store';
import { generalStoreItems } from '../../mockData/store';
import { ProductCard } from './ProductCard';
import { ShoppingCart, Filter, X, ArrowLeft, Search } from 'lucide-react';

interface GeneralStoreProps {
  user: User;
  cart: CartItem[];
  onAddToCart: (item: StoreItem) => void;
  onOpenCart: () => void;
  onBack: () => void;
}

const CATEGORIES: { value: ItemCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All Items' },
  { value: 'shirt', label: 'Shirts' },
  { value: 'hoodie', label: 'Hoodies' },
  { value: 'joggers', label: 'Joggers' },
  { value: 'hat', label: 'Hats' },
  { value: 'athleisure', label: 'Athleisure' },
  { value: 'accessory', label: 'Accessories' },
];

/**
 * General Store page with product grid and filtering
 */
export const GeneralStore: React.FC<GeneralStoreProps> = ({
  user,
  cart,
  onAddToCart,
  onOpenCart,
  onBack,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const remainingPurchases = user.monthlyPurchaseLimit - user.monthlyPurchaseCount;
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartItemIds = new Set(cart.map(item => item.item.id));

  // Filter items
  const filteredItems = useMemo(() => {
    return generalStoreItems.filter(item => {
      const matchesCategory = selectedCategory === 'all' || item.type === selectedCategory;
      const matchesSearch = searchQuery === '' || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Check if user can add to cart (monthly limit)
  const canAddToCart = remainingPurchases > 0;

  return (
    <div className="min-h-screen pt-20" style={{ background: '#030305' }}>
      {/* Header */}
      <div className="sticky top-20 z-30 backdrop-blur-md border-b border-white/10" style={{ background: 'rgba(3, 3, 5, 0.95)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Back & Title */}
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-slate-400" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-white">ISO General Store</h1>
                <p className="text-sm text-slate-400">Lifestyle collection</p>
              </div>
            </div>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
            >
              <ShoppingCart className="w-5 h-5 text-slate-300" />
              <span className="text-sm font-medium text-slate-300">Cart</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs font-bold text-white bg-orange-500 rounded-full">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Purchase Limit Banner */}
      {!canAddToCart && (
        <div className="bg-red-500/10 border-b border-red-500/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <p className="text-sm text-red-400 text-center">
              You've reached your monthly purchase limit. Your limit resets at the start of next month.
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`
                  px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200
                  ${selectedCategory === category.value
                    ? 'bg-orange-500 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                  }
                `}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-4 h-4 text-slate-400 hover:text-white" />
              </button>
            )}
          </div>
        </div>

        {/* Results Count */}
        <p className="text-sm text-slate-400 mt-4">
          {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
          {selectedCategory !== 'all' && ` in ${CATEGORIES.find(c => c.value === selectedCategory)?.label}`}
        </p>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <Filter className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-lg text-slate-400">No items found</p>
            <p className="text-sm text-slate-500 mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <ProductCard
                key={item.id}
                item={item}
                onAddToCart={onAddToCart}
                isInCart={cartItemIds.has(item.id)}
                isDisabled={!canAddToCart}
                disabledReason={!canAddToCart ? 'Monthly limit reached' : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneralStore;
