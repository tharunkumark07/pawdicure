import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShoppingCart,
  Trash2,
  ArrowLeft,
  CheckCircle2,
  Tag,
  ShieldCheck,
  CreditCard,
  Sparkles,
} from 'lucide-react';

export function CartView() {
  const {
    householdData,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    navigate,
    showToast,
  } = useApp();

  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');

  const cart = householdData.cart || [];

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const shipping = subtotal > 45 || subtotal === 0 ? 0 : 4.99;
  const total = Math.max(0, subtotal - discountAmount + shipping);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (code === 'PAW15' || code === 'LOYALTY15') {
      setDiscountPercent(15);
      setPromoSuccess('15% Companion Discount applied!');
      setPromoError('');
      showToast('15% discount applied!', 'success', '🎉');
    } else if (code === 'VIP20') {
      setDiscountPercent(20);
      setPromoSuccess('20% VIP Alpha Discount applied!');
      setPromoError('');
      showToast('20% discount applied!', 'success', '💎');
    } else {
      setPromoError('Invalid coupon. Try "PAW15" or "VIP20"');
      setPromoSuccess('');
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setIsCheckingOut(true);

    setTimeout(() => {
      const generatedId = 'PAW-' + Math.floor(100000 + Math.random() * 900000);
      setOrderId(generatedId);
      clearCart();
      setIsCheckingOut(false);
      setOrderComplete(true);
      showToast('Order successfully confirmed! (+150 Paw Points)', 'success', '📦');
    }, 1200);
  };

  if (orderComplete) {
    return (
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs text-center space-y-4 animate-in zoom-in-95 duration-200 my-4">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl shadow-inner">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <h1 className="font-heading font-black text-2xl text-slate-900">
          Order Dispatched!
        </h1>

        <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
          Your order <strong>#{orderId}</strong> is being freshly packed at the PAWdiCURE fulfillment center. Standard 2-day delivery tracking has been sent to your registered email.
        </p>

        <div className="p-3.5 bg-orange-50 rounded-2xl border border-orange-200 text-xs font-bold text-[#ae3115]">
          🎉 You earned +150 Paw Points with this order!
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/store')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition"
          >
            Continue Shopping
          </button>
          <button
            type="button"
            onClick={() => navigate('/home')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full pb-14 space-y-4 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/store')}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-xl border border-slate-200 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Continue Shopping</span>
        </button>

        <h1 className="font-heading font-black text-base text-slate-900">
          Shopping Cart ({cart.length})
        </h1>
      </div>

      {cart.length === 0 ? (
        <div className="bg-white p-8 rounded-3xl border border-dashed border-slate-200 text-center space-y-3">
          <ShoppingCart className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-heading font-bold text-base text-slate-800">
            Your cart is currently empty
          </h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Explore veterinary kibble, omega-3 oils, and organic treats for your companion.
          </p>
          <button
            type="button"
            onClick={() => navigate('/store')}
            className="mt-2 px-4 py-2 rounded-xl bg-[#ff6b4a] text-white text-xs font-bold shadow-md shadow-orange-500/20"
          >
            Explore Pet Store
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Cart Items List */}
          <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-xs space-y-3">
            {cart.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100 last:border-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.product.image}
                    alt={item.product.title}
                    className="w-16 h-16 rounded-2xl object-cover shrink-0"
                  />
                  <div>
                    <h4 className="font-heading font-bold text-xs text-slate-900 line-clamp-1">
                      {item.product.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      ${item.product.price.toFixed(2)} each
                    </p>
                    <div className="text-xs font-extrabold text-slate-900 mt-1">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() =>
                        updateCartQuantity(item.product.id, item.quantity - 1)
                      }
                      className="w-6 h-6 rounded-lg bg-white text-slate-700 font-bold flex items-center justify-center hover:bg-slate-200"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold w-4 text-center">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateCartQuantity(item.product.id, item.quantity + 1)
                      }
                      className="w-6 h-6 rounded-lg bg-white text-slate-700 font-bold flex items-center justify-center hover:bg-slate-200"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg transition"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Promo Code Input */}
          <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-xs space-y-2">
            <form onSubmit={handleApplyPromo} className="flex items-center gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Promo code (e.g. PAW15)"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 uppercase focus:outline-none focus:ring-2 focus:ring-[#ff6b4a]"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-black transition"
              >
                Apply
              </button>
            </form>

            {promoSuccess && (
              <p className="text-[11px] font-bold text-emerald-600">
                ✓ {promoSuccess}
              </p>
            )}
            {promoError && (
              <p className="text-[11px] font-bold text-red-600">
                ✕ {promoError}
              </p>
            )}
          </div>

          {/* Order Summary & Checkout */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-100 shadow-xs space-y-3">
            <h3 className="font-heading font-bold text-xs text-slate-400 uppercase tracking-wider">
              Order Calculation
            </h3>

            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Discount ({discountPercent}%)</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="pt-2 border-t border-slate-100 flex justify-between font-extrabold text-sm text-slate-900">
                <span>Total Due</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="button"
              disabled={isCheckingOut}
              onClick={handleCheckout}
              className="w-full py-3 rounded-2xl bg-[#ff6b4a] hover:bg-[#ed4d26] text-white text-xs font-bold shadow-md shadow-orange-500/20 transition active:scale-95 flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              <span>
                {isCheckingOut ? 'Securing Transaction...' : `Proceed to Checkout • $${total.toFixed(2)}`}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
