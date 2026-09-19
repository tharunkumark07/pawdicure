import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Heart,
  ArrowLeft,
  ShoppingCart,
  Trash2,
  Plus,
} from 'lucide-react';

export function WishlistView() {
  const {
    householdData,
    toggleWishlist,
    addToCart,
    navigate,
    showToast,
  } = useApp();

  const wishlist = householdData.wishlist || [];
  const products = householdData.products || [];
  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="flex flex-col w-full pb-14 space-y-4 animate-in fade-in duration-200">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/store')}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-xl border border-slate-200 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Store</span>
        </button>

        <h1 className="font-heading font-black text-base text-slate-900">
          Saved Wishlist ({wishlistedProducts.length})
        </h1>
      </div>

      {wishlistedProducts.length === 0 ? (
        <div className="bg-white p-8 rounded-3xl border border-dashed border-slate-200 text-center space-y-3">
          <Heart className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-heading font-bold text-base text-slate-800">
            Your wishlist is empty
          </h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Tap the heart icon on any clinical recipe or supplement to save it for later.
          </p>
          <button
            type="button"
            onClick={() => navigate('/store')}
            className="mt-2 px-4 py-2 rounded-xl bg-[var(--primary)] text-white text-xs font-bold shadow-md shadow-[var(--primary)]/20"
          >
            Explore Essentials
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {wishlistedProducts.map((p) => (
            <div
              key={p.id}
              className="p-4 rounded-3xl bg-white border border-slate-100 shadow-xs flex items-center justify-between gap-3 hover:border-orange-100 transition"
            >
              <div className="flex items-center gap-3">
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-16 h-16 rounded-2xl object-cover shrink-0 cursor-pointer"
                  onClick={() => navigate(`/store/product/${p.id}`)}
                />
                <div>
                  <h4
                    className="font-heading font-bold text-xs text-slate-900 line-clamp-1 cursor-pointer hover:text-[var(--primary)]"
                    onClick={() => navigate(`/store/product/${p.id}`)}
                  >
                    {p.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1">
                    {p.subtitle}
                  </p>
                  <div className="text-xs font-extrabold text-slate-900 mt-1">
                    ${p.price.toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    addToCart(p, 1);
                    toggleWishlist(p.id);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[var(--primary)] hover:opacity-90 text-white text-xs font-bold flex items-center gap-1 shadow-2xs transition active:scale-95"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Move to Cart</span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleWishlist(p.id)}
                  className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg transition"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
