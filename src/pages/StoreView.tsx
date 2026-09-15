import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShoppingBag,
  Search,
  Heart,
  Star,
  Plus,
  Filter,
  ShoppingCart,
  Check,
  Sparkles,
} from 'lucide-react';
import { ProductItem } from '../types';
import { INITIAL_PRODUCTS } from '../lib/mockData';

export function StoreView() {
  const {
    householdData,
    addToCart,
    toggleWishlist,
    navigate,
    showToast,
  } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');

  const products = householdData.products && householdData.products.length > 0 ? householdData.products : INITIAL_PRODUCTS;
  const cartItems = householdData.cart || [];
  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const wishlist = householdData.wishlist || [];

  const categories = [
    { id: 'all', label: 'All Essentials' },
    { id: 'Food & Nutrition', label: 'Food & Nutrition 🍗' },
    { id: 'Wellness & Care', label: 'Wellness & Care 💊' },
    { id: 'Gear & Beds', label: 'Gear & Beds 🛏️' },
    { id: 'Toys & Agility', label: 'Toys & Agility 🎾' },
  ];

  const filtered = products
    .filter((p) => {
      const matchCat = categoryFilter === 'all' || p.category === categoryFilter;
      const matchSearch =
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        (p.subtitle ? p.subtitle.toLowerCase().includes(search.toLowerCase()) : false) ||
        (p.desc ? p.desc.toLowerCase().includes(search.toLowerCase()) : false);
      return matchCat && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

  return (
    <div className="flex flex-col w-full pb-14 space-y-4 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-rose-500/10 rounded-3xl p-4 sm:p-5 border border-orange-100 flex items-center justify-between">
        <div>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-100 text-[10px] font-bold text-orange-900 shadow-2xs mb-1">
            <ShoppingBag className="w-3 h-3 text-[#ff6b4a]" />
            <span>PAWdiCURE Nutrition &amp; Care Store</span>
          </span>
          <h1 className="font-heading font-black text-xl sm:text-2xl text-slate-900">
            Veterinary Essentials
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Formulated for optimal vitality, joint preservation &amp; coat radiance
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => navigate('/store/wishlist')}
            className="p-2.5 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:text-red-500 hover:border-red-200 shadow-2xs transition relative"
            title="Wishlist"
          >
            <Heart className="w-4 h-4" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => navigate('/store/cart')}
            className="px-3.5 py-2 rounded-2xl bg-[#ff6b4a] hover:bg-[#ed4d26] text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-orange-500/20 transition active:scale-95"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Cart ({totalCartCount})</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search kibble, joint chews, salmon oil..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff6b4a] shadow-xs"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#ff6b4a] shadow-xs"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                categoryFilter === cat.id
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {filtered.map((product) => {
          const isWishlisted = wishlist.includes(product.id);

          return (
            <div
              key={product.id}
              className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col group"
            >
              {/* Image & Wishlist Button */}
              <div className="relative aspect-square w-full bg-slate-100 overflow-hidden cursor-pointer"
                onClick={() => navigate(`/store/product/${product.id}`)}
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(product.id);
                  }}
                  className={`absolute top-2.5 right-2.5 p-2 rounded-xl transition backdrop-blur-md ${
                    isWishlisted
                      ? 'bg-red-500 text-white shadow-md shadow-red-500/30'
                      : 'bg-white/80 hover:bg-white text-slate-600'
                  }`}
                  title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                >
                  <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-white' : ''}`} />
                </button>

                {product.badge && (
                  <span className="absolute bottom-2.5 left-2.5 bg-black/60 backdrop-blur-md text-white text-[9px] font-bold px-2 py-0.5 rounded-md">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Product Info */}
              <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                <div
                  className="cursor-pointer"
                  onClick={() => navigate(`/store/product/${product.id}`)}
                >
                  <div className="flex items-center gap-1 text-[10px] text-amber-600 font-bold mb-1">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>{product.rating}</span>
                    <span className="text-slate-400">({product.reviewsCount})</span>
                  </div>

                  <h3 className="font-heading font-bold text-xs text-slate-900 line-clamp-1 group-hover:text-[#ff6b4a] transition">
                    {product.title}
                  </h3>

                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                    {product.subtitle}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-sm font-extrabold text-slate-900 font-heading">
                    ${product.price.toFixed(2)}
                  </div>

                  <button
                    type="button"
                    onClick={() => addToCart(product, 1)}
                    className="p-2 rounded-xl bg-orange-50 hover:bg-[#ff6b4a] text-[#ff6b4a] hover:text-white transition active:scale-95 shadow-2xs"
                    title="Add to cart"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
