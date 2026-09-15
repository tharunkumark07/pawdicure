import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowLeft,
  Star,
  Heart,
  ShoppingCart,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Gift,
} from 'lucide-react';
import { INITIAL_PRODUCTS } from '../lib/mockData';

interface ProductDetailsViewProps {
  productId: string;
}

export function ProductDetailsView({ productId }: ProductDetailsViewProps) {
  const {
    householdData,
    addToCart,
    toggleWishlist,
    redeemReward,
    navigate,
    showToast,
  } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('Standard (4 lb)');

  const allProducts =
    householdData.products && householdData.products.length > 0
      ? householdData.products
      : INITIAL_PRODUCTS;
  const product = allProducts.find((p) => p.id === productId);
  const wishlist = householdData.wishlist || [];
  const isWishlisted = product ? wishlist.includes(product.id) : false;
  const currentPoints = householdData.pawPoints ?? 4820;

  if (!product) {
    return (
      <div className="p-8 text-center space-y-3">
        <h2 className="text-base font-bold text-slate-900">Product not found</h2>
        <button
          type="button"
          onClick={() => navigate('/store')}
          className="px-4 py-2 bg-[#ff6b4a] text-white text-xs font-bold rounded-xl"
        >
          Return to Store
        </button>
      </div>
    );
  }

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/store/cart');
  };

  const handleRedeemWithPoints = () => {
    redeemReward(product);
  };

  return (
    <div className="flex flex-col w-full pb-14 space-y-4 animate-in fade-in duration-200">
      {/* Top Nav Bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/store')}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-xl border border-slate-200 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Store</span>
        </button>

        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          className={`p-2 rounded-xl border transition ${
            isWishlisted
              ? 'bg-red-50 border-red-200 text-red-600'
              : 'bg-white border-slate-200 text-slate-600 hover:text-red-500'
          }`}
          title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500' : ''}`} />
        </button>
      </div>

      {/* Main Product Card */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-100 shadow-xs space-y-5">
        <div className="aspect-4/3 w-full rounded-2xl overflow-hidden bg-slate-50 relative">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover"
          />
          {product.badge && (
            <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-xl">
              {product.badge}
            </span>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600">
            <Star className="w-4 h-4 fill-amber-400" />
            <span>{product.rating}</span>
            <span className="text-slate-400 font-normal">
              ({product.reviewsCount} verified veterinary reviews)
            </span>
          </div>

          <h1 className="font-heading font-black text-xl text-slate-900 leading-snug">
            {product.title}
          </h1>

          <p className="text-xs text-slate-500">{product.subtitle}</p>

          <div className="flex items-baseline justify-between pt-1">
            <div className="text-2xl font-black font-heading text-slate-900">
              ${product.price.toFixed(2)}
            </div>
            {product.points && (
              <div className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200/80 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>or {product.points.toLocaleString()} Paw Points</span>
              </div>
            )}
          </div>
        </div>

        {/* In Stock & Fast Shipping Badges */}
        <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-[11px] text-slate-600">
          <div className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-bold text-emerald-700">In Stock</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Free 2-Day Delivery</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0" />
            <span>Vet Certified</span>
          </div>
        </div>

        {/* Description & Ingredients */}
        <div className="space-y-3 text-xs leading-relaxed text-slate-700">
          <div>
            <h3 className="font-bold text-slate-900 mb-1">Clinical Formula Overview</h3>
            <p className="text-slate-600">{product.description}</p>
          </div>

          {product.ingredients && (
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <h4 className="font-bold text-slate-900 text-[11px] mb-0.5">
                Active Nutritional Components
              </h4>
              <p className="text-[11px] text-slate-600 font-mono">
                {product.ingredients}
              </p>
            </div>
          )}
        </div>

        {/* Quantity and Purchase CTA */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Quantity</span>
            <div className="flex items-center gap-3 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-7 h-7 rounded-lg bg-white font-bold text-slate-700 flex items-center justify-center hover:bg-slate-200 transition"
              >
                -
              </button>
              <span className="text-xs font-extrabold w-4 text-center">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-7 h-7 rounded-lg bg-white font-bold text-slate-700 flex items-center justify-center hover:bg-slate-200 transition"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => addToCart(product, quantity)}
              className="flex-1 py-3 rounded-2xl bg-orange-50 hover:bg-orange-100 text-[#ff6b4a] text-xs font-bold flex items-center justify-center gap-2 transition active:scale-95"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>

            <button
              type="button"
              onClick={handleBuyNow}
              className="flex-1 py-3 rounded-2xl bg-[#ff6b4a] hover:bg-[#ed4d26] text-white text-xs font-bold shadow-md shadow-orange-500/20 transition active:scale-95 text-center"
            >
              Buy Now
            </button>
          </div>

          {product.points && (
            <button
              type="button"
              onClick={handleRedeemWithPoints}
              className="w-full py-2.5 rounded-2xl bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-2 transition shadow-xs"
            >
              <Gift className="w-4 h-4 text-amber-400" />
              <span>Redeem with {product.points.toLocaleString()} Paw Points</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
