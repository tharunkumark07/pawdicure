import { useState, useEffect } from 'react';
import { Pet } from '../types';
import { TapButton } from '../components/ui/TapButton';
import {
  Utensils,
  Clock,
  ShieldCheck,
  Droplet,
  Package,
  Calculator,
  TrendingUp,
  Sparkles,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface FeedViewProps {
  pet: Pet;
  onFeedMeal: (grams: number, toppers: string[]) => void;
  onRefreshWater: () => void;
  onOrderFoodRefill: () => void;
}

export function FeedView({
  pet,
  onFeedMeal,
  onRefreshWater,
  onOrderFoodRefill,
}: FeedViewProps) {
  const [portionGrams, setPortionGrams] = useState(pet.targetPortionGrams || (pet.species === 'Cat' ? 65 : 180));
  const [topperSalmon, setTopperSalmon] = useState(true);
  const [topperJoint, setTopperJoint] = useState(pet.species !== 'Cat');
  const [isFeeding, setIsFeeding] = useState(false);
  const [justFed, setJustFed] = useState(false);
  const [showMathDetails, setShowMathDetails] = useState(false);
  const [limitWarning, setLimitWarning] = useState<string | null>(null);

  useEffect(() => {
    setPortionGrams(pet.targetPortionGrams || (pet.species === 'Cat' ? 65 : 180));
    setTopperJoint(pet.species !== 'Cat');
    setJustFed(false);
    setLimitWarning(null);
  }, [pet.id, pet.targetPortionGrams, pet.species]);

  // -------------------------------------------------------------
  // CLINICAL & METABOLIC MATHEMATICAL LOGIC
  // -------------------------------------------------------------
  // 1. Caloric density of food formula: 3.44 kcal per gram
  const CALORIC_DENSITY = 3.44;
  const SALMON_OIL_KCAL = 45; // 2 pumps (5ml) omega-3 lipid matrix = 45 kcal
  const JOINT_CHEW_KCAL = 25; // 1 glucosamine/chondroitin chew = 25 kcal

  // Current meal calculations
  const baseKcal = Math.round(portionGrams * CALORIC_DENSITY);
  const toppersKcal = (topperSalmon ? SALMON_OIL_KCAL : 0) + (topperJoint ? JOINT_CHEW_KCAL : 0);
  const mealKcal = baseKcal + toppersKcal;

  // Macros for this selected meal
  const mealProteinGrams = (portionGrams * 0.32).toFixed(1);
  const mealFatGrams = (portionGrams * 0.18).toFixed(1);
  const mealFiberGrams = (portionGrams * 0.045).toFixed(1);
  const mealMoistureGrams = (portionGrams * 0.10).toFixed(1);

  // 2. Monotonically increasing cumulative daily intake values
  const currentDailyGrams = pet.dailyGramsFed ?? 180;
  const dailyGoalGrams = pet.dailyGramsGoal ?? 360;
  const currentDailyKcal = pet.dailyCaloriesFed ?? 620;
  const dailyGoalKcal = pet.dailyCaloriesGoal ?? 1240;
  const maxMealsLimit = pet.maxMeals ?? 4;
  const currentMeals = pet.mealsToday ?? 2;

  // Projected cumulative values after feeding this portion
  const projectedDailyGrams = currentDailyGrams + portionGrams;
  const projectedDailyKcal = currentDailyKcal + mealKcal;
  const currentNutritionPct = Math.min(100, Math.round((currentDailyGrams / dailyGoalGrams) * 100));
  const projectedNutritionPct = Math.min(100, Math.round((projectedDailyGrams / dailyGoalGrams) * 100));

  // 3. Veterinary Energy Equation (Kleiber's Law):
  // RER = 70 * (Weight in kg)^0.75
  const rerKcal = Math.round(70 * Math.pow(pet.weight || 28.4, 0.75));
  // MER = Maintenance Energy Requirement multiplier (1.4 for active neutered adult canine, 1.2 for feline)
  const merMultiplier = pet.species === 'Cat' ? 1.2 : 1.4;
  const calculatedMerKcal = Math.round(rerKcal * merMultiplier);
  const calculatedDailyGrams = Math.round(calculatedMerKcal / CALORIC_DENSITY);

  // 4. Pantry Mathematical calculation: days of supply remaining
  const pantryGrams = (pet.pantryKg || 5.2) * 1000;
  const daysOfFoodSupply = Math.max(1, Math.floor(pantryGrams / dailyGoalGrams));

  const handleExecuteFeeding = () => {
    const safetyMaxGrams = dailyGoalGrams * 1.3;

    if (currentMeals >= maxMealsLimit) {
      setLimitWarning(`Daily meal frequency limit reached (${currentMeals}/${maxMealsLimit} meals today)! Additional feedings are restricted for digestive safety.`);
      return;
    }
    if (projectedDailyGrams > safetyMaxGrams) {
      setLimitWarning(`Daily feed limit exceeded (${projectedDailyGrams}g / max ${Math.round(safetyMaxGrams)}g limit). Please reduce portion size.`);
      return;
    }
    setLimitWarning(null);

    setIsFeeding(true);
    setTimeout(() => {
      setIsFeeding(false);
      setJustFed(true);
      const toppers: string[] = [];
      if (topperSalmon) toppers.push('Salmon Oil (2 pumps)');
      if (topperJoint) toppers.push('Glucosamine Chew');
      onFeedMeal(portionGrams, toppers);
      setTimeout(() => setJustFed(false), 4000);
    }, 600);
  };

  return (
    <div className="flex flex-col w-full pb-8 space-y-4 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <span className="text-[10px] font-bold text-[#ae3115] bg-orange-50 border border-orange-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Supper Routine #{pet.mealsToday || 2}
          </span>
          <h2 className="font-heading font-extrabold text-2xl text-slate-900 mt-1">
            Time to fill the bowl.
          </h2>
        </div>
        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Last fed: {pet.lastFed}</span>
        </span>
      </div>

      {/* CUMULATIVE DAILY INTAKE PROGRESSION CARD (NEVER DECREASES) */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="font-heading font-bold text-sm text-slate-900">
              Daily Nutrition &amp; Intake Tracker
            </h3>
          </div>
          <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full">
            {currentNutritionPct}% Fulfilled
          </span>
        </div>

        {/* Monotonically Increasing Progress Meter */}
        <div>
          <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
            <span>Cumulative Food Consumed Today:</span>
            <span className="font-heading text-sm text-[#ae3115]">
              {currentDailyGrams}g{' '}
              <span className="text-xs font-normal text-slate-500">
                / {dailyGoalGrams}g target
              </span>
            </span>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-3.5 p-0.5 overflow-hidden relative">
            {/* Current base fill */}
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${Math.min(100, (currentDailyGrams / dailyGoalGrams) * 100)}%` }}
            />
          </div>

          {/* Mathematical Calorie & Meal Status */}
          <div className="flex justify-between items-center text-[11px] text-slate-500 mt-2">
            <span>
              ⚡ Energy:{' '}
              <strong className="text-slate-800">
                {currentDailyKcal.toLocaleString()} kcal
              </strong>{' '}
              / {dailyGoalKcal.toLocaleString()} kcal
            </span>
            <span>
              🥣 Meals Logged:{' '}
              <strong className="text-slate-800">{pet.mealsToday || 2}</strong>
            </span>
          </div>
        </div>

        {/* Live Mathematical Projection Callout */}
        <div className="p-2.5 rounded-2xl bg-orange-50/70 border border-orange-200/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-[#ae3115]">
            <TrendingUp className="w-4 h-4 shrink-0" />
            <span>
              Feeding <strong>+{portionGrams}g</strong> will increase daily total to{' '}
              <strong>{projectedDailyGrams}g</strong> ({projectedNutritionPct}% of daily goal).
            </span>
          </div>
        </div>
      </div>

      {/* SMART INTERACTIVE FOOD BOWL COMPONENT */}
      <div className="bg-gradient-to-b from-white via-orange-50/30 to-amber-50/20 rounded-3xl p-5 border border-slate-100 shadow-xs text-center relative overflow-hidden">
        {/* Vet Calibrated Tag */}
        <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-100 px-3 py-1 rounded-full text-xs font-bold mb-4">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>
            Calibrated for {pet.breed} ({pet.weight} kg)
          </span>
        </div>

        {/* Visual Food Bowl Circle with Interactive Level */}
        <div className="relative w-48 h-48 mx-auto my-2 flex items-center justify-center">
          <div className="w-44 h-44 rounded-full bg-slate-100 border-8 border-white shadow-xl flex items-center justify-center relative overflow-hidden">
            {/* Cumulative + current portion food fill layer */}
            <div
              id="food-bowl-fill-layer"
              className="absolute bottom-0 w-full bg-gradient-to-t from-amber-600 via-amber-500 to-amber-400 transition-all duration-700 ease-out"
              style={{
                height: `${Math.min(100, Math.max(30, (projectedDailyGrams / dailyGoalGrams) * 85))}%`,
              }}
            />

            {/* Center readout overlay */}
            <div className="relative z-10 bg-white/95 backdrop-blur-xs px-4 py-2.5 rounded-2xl shadow-md border border-white">
              <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                PORTION TO ADD
              </span>
              <span className="font-heading font-black text-2xl text-slate-900 block leading-none mt-0.5">
                +{portionGrams}g
              </span>
              <span className="text-[11px] text-amber-700 font-extrabold block mt-0.5">
                +{mealKcal} kcal
              </span>
            </div>
          </div>
        </div>

        {/* Interactive Portion Slider */}
        <div className="mt-4 px-2">
          <div className="flex justify-between text-xs font-bold text-slate-600 mb-1.5">
            <span>Light (40g)</span>
            <span className="text-[#ae3115] font-extrabold">
              Standard Target ({pet.targetPortionGrams || 180}g)
            </span>
            <span>Feast (350g)</span>
          </div>
          <input
            id="portion-range-slider"
            type="range"
            min="40"
            max="350"
            step="5"
            value={portionGrams}
            onChange={(e) => setPortionGrams(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#ff6b4a]"
          />
        </div>

        {/* Active Meal Enhancers / Toppers */}
        <div className="mt-5 text-left border-t border-slate-100 pt-3">
          <span className="text-xs font-bold text-slate-700 block mb-2">
            Active Meal Enhancers &amp; Toppers (Calculated into Energy):
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setTopperSalmon(!topperSalmon)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 ${
                topperSalmon
                  ? 'bg-orange-50 border-orange-200 text-orange-800 shadow-2xs'
                  : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}
            >
              <span>🐟</span>
              <span>Wild Salmon Oil (+45 kcal)</span>
              {topperSalmon && <Check className="w-3.5 h-3.5 text-[#ff6b4a]" />}
            </button>

            <button
              type="button"
              onClick={() => setTopperJoint(!topperJoint)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 ${
                topperJoint
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800 shadow-2xs'
                  : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}
            >
              <span>💊</span>
              <span>Glucosamine Joint Chew (+25 kcal)</span>
              {topperJoint && <Check className="w-3.5 h-3.5 text-emerald-600" />}
            </button>
          </div>
        </div>

        {/* Primary Feed Button */}
        <div className="mt-5 space-y-2">
          {limitWarning && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold flex items-start gap-2 animate-in fade-in">
              <span className="text-base shrink-0">⚠️</span>
              <div>
                <span className="font-extrabold block mb-0.5">Feeding Limit Safeguard</span>
                <span>{limitWarning}</span>
              </div>
            </div>
          )}
          <TapButton
            id="feed-milo-cta-button"
            disabled={isFeeding}
            onClick={handleExecuteFeeding}
            className={`w-full py-3.5 px-4 rounded-2xl text-white font-heading font-extrabold text-sm shadow-md flex items-center justify-center gap-2 transition-colors ${
              justFed
                ? 'bg-emerald-600'
                : 'bg-gradient-to-r from-[#ff6b4a] to-[#ae3115]'
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span>
              {isFeeding
                ? 'Calculating & Adding Portion...'
                : justFed
                ? `Intake Updated to ${currentDailyGrams}g! ✨`
                : `Feed ${pet.name} (+${portionGrams}g • +${mealKcal} kcal)`}
            </span>
          </TapButton>
        </div>

        {justFed && (
          <div className="mt-2.5 p-2 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-100 flex items-center justify-center gap-1.5 animate-in fade-in">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>
              Cumulative food intake increased to {currentDailyGrams}g ({currentNutritionPct}% of daily goal)!
            </span>
          </div>
        )}
      </div>

      {/* VETERINARY CLINICAL MATHEMATICS COLLAPSIBLE CARD */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100 shadow-xs space-y-3">
        <button
          type="button"
          onClick={() => setShowMathDetails(!showMathDetails)}
          className="w-full flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-orange-100 text-[#ae3115] flex items-center justify-center">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-xs text-slate-800">
                Veterinary Metabolic Math Equations
              </h4>
              <p className="text-[10px] text-slate-500">
                Kleiber's Law RER &amp; Maintenance Energy Requirement
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-[#ff6b4a]">
            <span>{showMathDetails ? 'Hide' : 'Explain Math'}</span>
            {showMathDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {showMathDetails && (
          <div className="pt-2 border-t border-slate-100 space-y-2.5 text-xs text-slate-700 animate-in fade-in">
            <div className="p-3 bg-slate-50 rounded-2xl font-mono text-[11px] space-y-1.5">
              <div className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                1. Resting Energy Requirement (RER)
              </div>
              <div className="text-slate-900 font-semibold">
                RER = 70 × ({pet.weight} kg)^0.75 = <strong>{rerKcal} kcal/day</strong>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl font-mono text-[11px] space-y-1.5">
              <div className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                2. Maintenance Energy Requirement (MER)
              </div>
              <div className="text-slate-900 font-semibold">
                MER = {rerKcal} kcal × {merMultiplier} = <strong>{calculatedMerKcal} kcal/day</strong>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl font-mono text-[11px] space-y-1.5">
              <div className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                3. Daily Food Weight Calibration
              </div>
              <div className="text-slate-900 font-semibold">
                Target = {calculatedMerKcal} kcal ÷ {CALORIC_DENSITY} kcal/g = <strong>{calculatedDailyGrams}g/day</strong>
              </div>
              <div className="text-[10px] text-slate-500">
                Divided across {pet.species === 'Cat' ? 3 : 2} meals = {pet.targetPortionGrams || 180}g per meal.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MACRO NUTRITION BREAKDOWN CALCULATED FROM CURRENT MEAL */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-100 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="font-heading font-bold text-xs text-slate-800">
              Formula Nutrition &amp; Macros ({portionGrams}g portion)
            </h4>
            <p className="text-[11px] text-slate-500">
              Wild Pacific Salmon &amp; Sweet Potato Formula
            </p>
          </div>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
            Grain-Free
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="p-2.5 rounded-2xl bg-slate-50">
            <span className="font-heading font-black text-sm text-slate-800">
              {mealProteinGrams}g
            </span>
            <span className="text-[10px] text-slate-400 block font-semibold mt-0.5">
              Protein (32%)
            </span>
          </div>
          <div className="p-2.5 rounded-2xl bg-slate-50">
            <span className="font-heading font-black text-sm text-slate-800">
              {mealFatGrams}g
            </span>
            <span className="text-[10px] text-slate-400 block font-semibold mt-0.5">
              Fats (18%)
            </span>
          </div>
          <div className="p-2.5 rounded-2xl bg-slate-50">
            <span className="font-heading font-black text-sm text-slate-800">
              {mealFiberGrams}g
            </span>
            <span className="text-[10px] text-slate-400 block font-semibold mt-0.5">
              Fiber (4.5%)
            </span>
          </div>
          <div className="p-2.5 rounded-2xl bg-slate-50">
            <span className="font-heading font-black text-sm text-slate-800">
              {mealMoistureGrams}g
            </span>
            <span className="text-[10px] text-slate-400 block font-semibold mt-0.5">
              Moisture (10%)
            </span>
          </div>
        </div>
      </div>

      {/* SMART FOUNTAIN & PANTRY STOCK (MATHEMATICALLY LINKED) */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
              <span>Smart Fountain</span>
              <Droplet className="w-4 h-4 text-blue-500 fill-blue-100" />
            </div>
            <div className="text-base font-extrabold text-slate-900 font-heading">
              {pet.hydrationMl} / {pet.goalMl} ml
            </div>
            <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">
              {pet.hydrationPercent}% Daily Hydration
            </p>
          </div>
          <button
            type="button"
            onClick={onRefreshWater}
            className="mt-3 w-full py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition active:scale-95"
          >
            + Refresh (+170ml)
          </button>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
              <span>Pantry Food Stock</span>
              <Package className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-base font-extrabold text-slate-900 font-heading">
              {pet.pantryKg} kg remaining
            </div>
            <p className="text-[10px] text-amber-600 font-semibold mt-0.5">
              Calculated {daysOfFoodSupply} days supply
            </p>
          </div>
          <button
            type="button"
            onClick={onOrderFoodRefill}
            className="mt-3 w-full py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl text-xs font-bold transition active:scale-95"
          >
            Order Refill Bag
          </button>
        </div>
      </div>
    </div>
  );
}
