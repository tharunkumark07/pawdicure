import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Gift,
  Award,
  Sparkles,
  Flame,
  CheckCircle2,
  Clock,
  ArrowRight,
  Ticket,
  Lock,
  ShieldCheck,
  Building2,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
  HelpCircle,
  X,
  Stethoscope,
  Info,
} from 'lucide-react';
import { RewardItem, RedeemedReward } from '../types';
import { INITIAL_REWARDS } from '../lib/mockData';

type CategoryFilter = 'all' | 'clinical' | 'diagnostic' | 'therapeutic' | 'wellness' | 'gear' | 'my-vouchers';

export function RewardsView() {
  const { householdData, userProfile, activePet, redeemReward, navigate, showToast, performDailyCheckIn } = useApp();
  const [selectedReward, setSelectedReward] = useState<RewardItem | null>(null);
  const [viewingVoucher, setViewingVoucher] = useState<RedeemedReward | null>(null);
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isConfirmingRedeem, setIsConfirmingRedeem] = useState(false);

  const rewards = householdData.rewards && householdData.rewards.length > 0 ? householdData.rewards : INITIAL_REWARDS;
  const currentPoints = userProfile ? (userProfile.pawPoints ?? 0) : (householdData.pawPoints ?? 4820);
  const currentStreak = householdData.careStreakDays ?? householdData.streakDays ?? 12;
  const isCheckedInToday = householdData.lastCheckInDate === new Date().toISOString().slice(0, 10);
  const petLevel = activePet.level || 1;
  const redeemedList = householdData.redeemedRewards || [];

  const filteredRewards = rewards.filter((r) => {
    if (activeCategory === 'all') return true;
    return r.category === activeCategory;
  });

  const handleCopy = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    showToast(`Copied voucher code ${code}!`, 'success', '📋');
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleRedeemClick = (reward: RewardItem) => {
    setSelectedReward(reward);
    setIsConfirmingRedeem(true);
  };

  const confirmRedemption = () => {
    if (!selectedReward) return;
    const success = redeemReward(selectedReward);
    if (success) {
      setIsConfirmingRedeem(false);
      // Retrieve the newly created voucher from redeemed list
      setTimeout(() => {
        const latest = householdData.redeemedRewards?.[0];
        if (latest) {
          setViewingVoucher(latest);
        }
      }, 100);
    }
  };

  return (
    <div className="flex flex-col w-full pb-20 space-y-4 animate-in fade-in duration-200">
      {/* Hero Points & Exclusivity Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-5 shadow-xl border border-slate-700/60">
        <div className="absolute -right-8 -bottom-8 w-44 h-44 bg-[var(--primary)]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-8 -top-8 w-40 h-40 bg-[var(--primary)]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--primary)]">
                  PAWdiCURE Clinical &amp; Partner Rewards
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-heading font-black text-white">
                  {currentPoints.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  Paw Points
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={performDailyCheckIn}
                disabled={isCheckedInToday}
                className={`px-3 py-1.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition active:scale-95 shadow-xs ${
                  isCheckedInToday
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 cursor-default'
                    : 'bg-[var(--primary)] text-white hover:brightness-110 shadow-[var(--primary)]/20'
                }`}
              >
                {isCheckedInToday ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Checked In (+12)</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                    <span>Check In (+12 Pts)</span>
                  </>
                )}
              </button>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
                <span className="text-xs font-black text-orange-200">{currentStreak}d Streak</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-400 text-[10px] block">Companion Level</span>
              <span className="font-bold text-amber-300 flex items-center gap-1 mt-0.5">
                <span>{activePet.name} • Lvl {petLevel}</span>
                <span className="text-[10px] text-slate-300 font-normal">({activePet.levelTitle})</span>
              </span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 text-[10px] block">Unlocked Vouchers</span>
              <span className="font-bold text-emerald-400 flex items-center justify-end gap-1 mt-0.5">
                <Ticket className="w-3.5 h-3.5" />
                <span>{redeemedList.length} Active</span>
              </span>
            </div>
          </div>

          {/* Exclusivity note */}
          <div className="flex items-start gap-2 pt-1 text-[11px] text-slate-300/90 leading-relaxed border-t border-white/10">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p>
              High-tier clinical rewards represent genuine veterinary procedures, genetic diagnostics, and specialized therapy. Unlock them by nurturing your companion’s health and loyalty score.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Quick Strip: Store Link & Vouchers Tab */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={() => setActiveCategory('my-vouchers')}
          className={`p-3.5 rounded-2xl border transition text-left flex items-center justify-between ${
            activeCategory === 'my-vouchers'
              ? 'bg-[var(--primary-light)] border-[var(--primary)] text-[var(--text)] shadow-2xs'
              : 'bg-white border-slate-200/80 hover:border-slate-300 text-slate-800'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center font-bold">
              <Ticket className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-xs font-bold font-heading">My Vouchers</span>
              <span className="block text-[10px] text-slate-500">{redeemedList.length} redeemed</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          type="button"
          onClick={() => navigate('/store')}
          className="p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:border-slate-300 text-slate-800 transition text-left flex items-center justify-between shadow-2xs hover:bg-slate-50/50"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold">
              🛍️
            </div>
            <div>
              <span className="block text-xs font-bold font-heading">Pet Store</span>
              <span className="block text-[10px] text-slate-500">14 premium items</span>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveCategory('all')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${
            activeCategory === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Rewards ({rewards.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveCategory('clinical')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${
            activeCategory === 'clinical'
              ? 'bg-[var(--primary)] text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
          }`}
        >
          🏥 Clinical &amp; Surgery
        </button>
        <button
          type="button"
          onClick={() => setActiveCategory('diagnostic')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${
            activeCategory === 'diagnostic'
              ? 'bg-[var(--primary)] text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
          }`}
        >
          🧬 Diagnostic &amp; DNA
        </button>
        <button
          type="button"
          onClick={() => setActiveCategory('therapeutic')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${
            activeCategory === 'therapeutic'
              ? 'bg-[var(--primary)] text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
          }`}
        >
          🌊 Therapy &amp; Rehab
        </button>
        <button
          type="button"
          onClick={() => setActiveCategory('wellness')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${
            activeCategory === 'wellness'
              ? 'bg-[var(--primary)] text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
          }`}
        >
          🛁 Spa &amp; Nutrition
        </button>
        <button
          type="button"
          onClick={() => setActiveCategory('gear')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${
            activeCategory === 'gear'
              ? 'bg-[var(--primary)] text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
          }`}
        >
          🛰️ Smart Hardware
        </button>
      </div>

      {/* Main Content Area: Vouchers List vs Rewards Catalog */}
      {activeCategory === 'my-vouchers' ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-xs text-slate-500 uppercase tracking-wider">
              My Redeemed Vouchers ({redeemedList.length})
            </h3>
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              className="text-xs text-[#ff6b4a] font-bold hover:underline"
            >
              Browse Catalog
            </button>
          </div>

          {redeemedList.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-slate-200/80 space-y-3">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-orange-50 text-[#ff6b4a] flex items-center justify-center text-2xl">
                🎫
              </div>
              <h4 className="font-heading font-bold text-sm text-slate-900">
                No Redeemed Vouchers Yet
              </h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                As you complete care rituals and earn Paw Points, you can redeem exclusive veterinary vouchers and diagnostics here.
              </p>
              <button
                type="button"
                onClick={() => setActiveCategory('all')}
                className="px-4 py-2 rounded-full bg-[var(--primary)] text-white text-xs font-bold shadow-md hover:opacity-90 transition"
              >
                View Available Rewards
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {redeemedList.map((voucher) => (
                <div
                  key={voucher.id}
                  className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-3 hover:border-orange-200 transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
                          Active Voucher
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold">
                          Redeemed {voucher.redeemedAt}
                        </span>
                      </div>
                      <h4 className="font-heading font-bold text-xs text-slate-900 mt-1">
                        {voucher.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                        Code: <span className="font-bold text-slate-800">{voucher.code}</span>
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopy(voucher.code)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition active:scale-95"
                    >
                      {copiedCode === voucher.code ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-500">
                      Points Spent: <strong className="text-slate-800">{voucher.pointsSpent.toLocaleString()} pts</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => setViewingVoucher(voucher)}
                      className="text-xs font-bold text-[#ff6b4a] hover:underline flex items-center gap-1"
                    >
                      <span>Show Barcode</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-xs text-slate-500 uppercase tracking-wider">
              Exclusive Perks &amp; Clinical Vouchers ({filteredRewards.length})
            </h3>
            <span className="text-[11px] text-slate-400 font-semibold">
              Tap for terms &amp; partners
            </span>
          </div>

          <div className="space-y-3.5">
            {filteredRewards.map((rew) => {
              const reqLevel = rew.requiredLevel || 1;
              const hasLevel = petLevel >= reqLevel;
              const canAfford = currentPoints >= rew.pointsCost;
              const isLocked = !hasLevel;
              const pointsProgress = Math.min(100, Math.round((currentPoints / rew.pointsCost) * 100));
              const pointsNeeded = Math.max(0, rew.pointsCost - currentPoints);

              return (
                <div
                  key={rew.id}
                  className={`bg-white rounded-3xl p-4 border transition-all duration-200 shadow-2xs space-y-3 ${
                    isLocked
                      ? 'border-slate-200/70 opacity-90'
                      : canAfford
                      ? 'border-[var(--primary-border)] hover:border-[var(--primary)] hover:shadow-md'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Top Row: Thumbnail, Title, Value Badge */}
                  <div className="flex items-start gap-3.5">
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-slate-200 bg-slate-100">
                      {rew.image ? (
                        <img
                          src={rew.image}
                          alt={rew.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">
                          {rew.icon}
                        </div>
                      )}
                      {isLocked && (
                        <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[1px] flex items-center justify-center text-white">
                          <Lock className="w-5 h-5 text-amber-300" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 flex-wrap">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-800">
                          {rew.retailValue || 'High Value Voucher'}
                        </span>
                        {isLocked ? (
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            <span>Lvl {reqLevel}+</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Level Met</span>
                          </span>
                        )}
                      </div>

                      <h4
                        onClick={() => setSelectedReward(rew)}
                        className="font-heading font-bold text-xs sm:text-sm text-slate-900 mt-1 cursor-pointer hover:text-[var(--primary)] transition line-clamp-1"
                      >
                        {rew.title}
                      </h4>

                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                        {rew.description}
                      </p>
                    </div>
                  </div>

                  {/* Partner Clinic Info Strip */}
                  {rew.partnerClinic && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100 text-[10px] text-slate-600 font-medium">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">Partner: {rew.partnerClinic}</span>
                    </div>
                  )}

                  {/* Points Progress Bar & Action */}
                  <div className="space-y-2 pt-1 border-t border-slate-100">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-slate-700 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>{rew.pointsCost.toLocaleString()} Paw Points</span>
                      </span>
                      <span className="text-slate-500 text-[10px]">
                        {canAfford
                          ? 'Available to claim!'
                          : `Need ${pointsNeeded.toLocaleString()} more pts (${pointsProgress}%)`}
                      </span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          canAfford ? 'bg-emerald-500' : 'bg-[var(--primary)]'
                        }`}
                        style={{ width: `${pointsProgress}%` }}
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setSelectedReward(rew)}
                        className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                      >
                        Details &amp; Terms
                      </button>

                      {isLocked ? (
                        <button
                          type="button"
                          disabled
                          className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-400 text-xs font-bold flex items-center justify-center gap-1.5 cursor-not-allowed"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>Requires Level {reqLevel} ({rew.requiredLevelTitle || 'Higher Bond'})</span>
                        </button>
                      ) : canAfford ? (
                        <button
                          type="button"
                          onClick={() => handleRedeemClick(rew)}
                          className="flex-1 py-2 rounded-xl bg-[var(--primary)] hover:opacity-90 text-white text-xs font-bold shadow-md shadow-[var(--primary)]/20 flex items-center justify-center gap-1.5 transition active:scale-98"
                        >
                          <Gift className="w-3.5 h-3.5" />
                          <span>Redeem Exclusive Voucher</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled
                          className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-500 text-xs font-bold flex items-center justify-center gap-1.5 cursor-not-allowed"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-slate-400" />
                          <span>Need {pointsNeeded.toLocaleString()} Pts</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Reward Details & Confirmation Modal */}
      {selectedReward && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center text-lg">
                  {selectedReward.icon || '🎁'}
                </span>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 block">
                    {selectedReward.retailValue}
                  </span>
                  <h3 className="font-heading font-bold text-sm text-slate-900 leading-tight">
                    {selectedReward.title}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedReward(null);
                  setIsConfirmingRedeem(false);
                }}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {selectedReward.image && (
              <div className="w-full h-40 rounded-2xl overflow-hidden border border-slate-200">
                <img
                  src={selectedReward.image}
                  alt={selectedReward.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-800">Clinical Overview &amp; Specifications</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {selectedReward.description}
              </p>
            </div>

            {selectedReward.partnerClinic && (
              <div className="p-3 rounded-2xl bg-orange-50/50 border border-orange-100 space-y-1">
                <span className="text-[10px] font-bold text-orange-800 block uppercase">
                  Accredited Service Partner
                </span>
                <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#ff6b4a]" />
                  <span>{selectedReward.partnerClinic}</span>
                </p>
              </div>
            )}

            {selectedReward.terms && (
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 block uppercase flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  <span>Terms &amp; Redemption Guidelines</span>
                </span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {selectedReward.terms}
                </p>
              </div>
            )}

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-500 text-[10px] block">Points Cost</span>
                <span className="font-bold text-slate-900 text-sm">
                  {selectedReward.pointsCost.toLocaleString()} Paw Points
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 text-[10px] block">Your Balance</span>
                <span
                  className={`font-bold text-sm ${
                    currentPoints >= selectedReward.pointsCost ? 'text-emerald-600' : 'text-orange-600'
                  }`}
                >
                  {currentPoints.toLocaleString()} pts
                </span>
              </div>
            </div>

            {/* Action buttons inside modal */}
            {isConfirmingRedeem ? (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 space-y-3">
                <div className="flex items-center gap-2 text-amber-800 text-xs font-bold">
                  <HelpCircle className="w-4 h-4 text-amber-600" />
                  <span>Confirm Voucher Redemption</span>
                </div>
                <p className="text-[11px] text-amber-700 leading-snug">
                  This will deduct <strong>{selectedReward.pointsCost.toLocaleString()} Paw Points</strong> from your household balance and issue an official voucher code.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setIsConfirmingRedeem(false)}
                    className="py-2.5 rounded-xl bg-white border border-amber-300 text-slate-700 text-xs font-bold hover:bg-amber-100/50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={confirmRedemption}
                    className="py-2.5 rounded-xl bg-[#ff6b4a] text-white text-xs font-bold hover:bg-[#ed4d26] shadow-md transition"
                  >
                    Confirm &amp; Deduct Points
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedReward(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                >
                  Close
                </button>
                {petLevel < (selectedReward.requiredLevel || 1) ? (
                  <button
                    type="button"
                    disabled
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-400 text-xs font-bold flex items-center justify-center gap-1 cursor-not-allowed"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Lvl {selectedReward.requiredLevel} Required</span>
                  </button>
                ) : currentPoints >= selectedReward.pointsCost ? (
                  <button
                    type="button"
                    onClick={() => setIsConfirmingRedeem(true)}
                    className="flex-1 py-2.5 rounded-xl bg-[#ff6b4a] hover:bg-[#ed4d26] text-white text-xs font-bold shadow-md transition"
                  >
                    Redeem Voucher
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-400 text-xs font-bold cursor-not-allowed"
                  >
                    Need {(selectedReward.pointsCost - currentPoints).toLocaleString()} More Pts
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Barcode / Voucher Modal */}
      {viewingVoucher && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl border border-slate-100 text-center">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black tracking-widest text-emerald-600 uppercase">
                Official Clinical Voucher
              </span>
              <button
                type="button"
                onClick={() => setViewingVoucher(null)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div>
              <h3 className="font-heading font-bold text-sm text-slate-900">
                {viewingVoucher.title}
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Present this barcode or code at partner reception
              </p>
            </div>

            {/* Barcode Graphic Simulation */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-center justify-center space-y-2">
              <div className="flex items-center justify-center gap-[3px] h-14 w-48 overflow-hidden">
                {[4, 2, 6, 1, 3, 5, 2, 7, 3, 2, 5, 1, 4, 3, 6, 2, 4, 1, 5, 2, 6, 3, 2, 4, 5, 1, 3, 6, 2].map(
                  (h, i) => (
                    <div
                      key={i}
                      className="bg-slate-900 rounded-[0.5px]"
                      style={{
                        width: `${(h % 3) + 1.5}px`,
                        height: '100%',
                      }}
                    />
                  )
                )}
              </div>
              <span className="font-mono font-bold text-sm text-slate-800 tracking-wider">
                {viewingVoucher.code}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span>Date: {viewingVoucher.redeemedAt}</span>
              <span>Cost: {viewingVoucher.pointsSpent.toLocaleString()} pts</span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleCopy(viewingVoucher.code)}
                className="py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95"
              >
                {copiedCode === viewingVoucher.code ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setViewingVoucher(null)}
                className="py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
