import { useState } from 'react';
import { StoreProduct } from '../types';
import { STORE_PRODUCTS } from '../lib/mockData';
import {
  Gift,
  Flame,
  Target,
  Heart,
  Star,
  Check,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';

interface RewardsViewProps {
  pawPoints: number;
  wishlist: string[];
  onRedeem: (product: StoreProduct) => void;
  onToggleWishlist: (productId: string) => void;
  onClaimDailyQuest: (questId: string, pts: number) => void;
}

export function RewardsView({
  pawPoints,
  wishlist,
  onRedeem,
  onToggleWishlist,
  onClaimDailyQuest,
}: RewardsViewProps) {
  const [claimedWalk, setClaimedWalk] = useState(false);

  return (
    <div className="flex flex-col w-full pb-8 space-y-4 animate-in fade-in duration-200">
      {/* Vault Points Hero Header */}
      <div className="bg-[var(--primary)] rounded-3xl p-5 text-white shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-orange-100 uppercase tracking-wider">
              Available Vault Balance
            </span>
            <div className="font-heading font-black text-3xl mt-0.5 leading-none">
              {pawPoints.toLocaleString()}{' '}
              <span className="text-sm font-bold text-orange-200">PAW PTS</span>
            </div>
          </div>
          <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold flex items-center gap-1.5 shadow-2xs">
            <Flame className="w-4 h-4 text-amber-300 fill-amber-300" />
            <span>1.25x Streak Boost</span>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-xs">
          <span className="bg-white/15 px-2.5 py-1 rounded-xl font-medium">
            Earned this week: +340 pts
          </span>
          <span className="bg-white/15 px-2.5 py-1 rounded-xl font-medium">
            Total Redeemed: 1,200 pts
          </span>
        </div>
      </div>

      {/* Daily Missions & Quests */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-100 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-heading font-bold text-sm text-slate-900 flex items-center gap-1.5">
            <Target className="w-4 h-4 text-amber-500" />
            <span>Daily Missions &amp; Quests</span>
          </h3>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
            +330 pts possible
          </span>
        </div>

        <div className="space-y-2">
          {/* Mission 1 */}
          <div className="p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex items-center justify-between text-xs">
            <div>
              <div className="font-bold text-slate-900">
                Complete 30-min brisk morning walk
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                34 min logged today • +45 pts reward
              </div>
            </div>

            <button
              type="button"
              disabled={claimedWalk}
              onClick={() => {
                setClaimedWalk(true);
                onClaimDailyQuest('walk', 45);
              }}
              className={`px-3 py-1 rounded-xl font-bold text-xs shadow-2xs transition ${
                claimedWalk
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-[#ff6b4a] hover:bg-[#ed4d26] text-white'
              }`}
            >
              {claimedWalk ? 'Claimed' : 'Claim'}
            </button>
          </div>

          {/* Mission 2 */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
            <div>
              <div className="font-bold text-slate-900">
                Log evening dental chew &amp; brush
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Bedtime routine • +20 pts
              </div>
            </div>
            <span className="text-[10px] text-slate-400 font-bold bg-white px-2 py-1 rounded-lg border border-slate-200">
              Pending
            </span>
          </div>
        </div>
      </div>

      {/* Curated Pet Boutique */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div>
            <h3 className="font-heading font-bold text-base text-slate-900">
              Curated Pet Boutique
            </h3>
            <p className="text-xs text-slate-500">
              Clinician-tested wellness picks redeemable with Paw Points
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {STORE_PRODUCTS.map((prod) => {
            const isWish = wishlist.includes(prod.id);
            return (
              <div
                key={prod.id}
                className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-xs flex flex-col justify-between"
              >
                <div className="h-40 w-full overflow-hidden relative bg-slate-100">
                  <img
                    src={prod.image}
                    alt={prod.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-xs text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-2xs flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span>
                      {prod.rating} ({prod.reviews})
                    </span>
                  </span>

                  <button
                    type="button"
                    onClick={() => onToggleWishlist(prod.id)}
                    className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-slate-600 shadow-2xs transition active:scale-90"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isWish
                          ? 'text-rose-500 fill-rose-500'
                          : 'text-slate-400'
                      }`}
                    />
                  </button>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-[#ae3115] uppercase tracking-wider">
                      {prod.category}
                    </span>
                    <h4 className="font-heading font-bold text-sm text-slate-900 mt-0.5">
                      {prod.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {prod.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between">
                    <div>
                      <div className="font-extrabold text-sm text-[#ae3115] font-heading">
                        {prod.points.toLocaleString()} pts
                      </div>
                      <div className="text-[10px] text-slate-400">
                        or ${prod.price.toFixed(2)} retail
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onRedeem(prod)}
                      className="px-3.5 py-1.5 bg-[#ff6b4a] hover:bg-[#ed4d26] text-white rounded-xl text-xs font-bold shadow-xs transition active:scale-95 flex items-center gap-1"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Redeem</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
