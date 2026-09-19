import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Heart,
  Dog,
  Shield,
  Activity,
} from 'lucide-react';

export function OnboardingView() {
  const { activePet, updatePet, navigate, showToast } = useApp();

  const [step, setStep] = useState(1);
  const [petName, setPetName] = useState(activePet.name || 'Milo');
  const [breed, setBreed] = useState(activePet.breed || 'Golden Retriever');
  const [age, setAge] = useState(activePet.age || '2y 4m');
  const [weight, setWeight] = useState(activePet.weight?.toString() || '28.4');
  const [gender, setGender] = useState(activePet.gender || 'Male');
  const [targetPortion, setTargetPortion] = useState(activePet.targetPortionGrams?.toString() || '180');
  const [stepsGoal, setStepsGoal] = useState(activePet.stepsGoal?.toString() || '8500');
  const [allergies, setAllergies] = useState(activePet.allergies?.join(', ') || 'Chicken byproduct');

  const handleFinish = () => {
    const updated = {
      ...activePet,
      name: petName.trim() || 'Milo',
      breed: breed.trim() || 'Golden Retriever',
      age: age.trim() || '2y 4m',
      weight: parseFloat(weight) || 28.4,
      gender: gender as any,
      targetPortionGrams: parseInt(targetPortion, 10) || 180,
      stepsGoal: parseInt(stepsGoal, 10) || 8500,
      allergies: allergies
        ? allergies.split(',').map((a) => a.trim()).filter(Boolean)
        : [],
    };

    updatePet(updated);
    showToast(`Welcome to PAWdiCURE, ${updated.name}! 🐾`, 'success');
    navigate('/home');
  };

  return (
    <div className="flex flex-col w-full min-h-[500px] justify-center pb-12 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xl max-w-md mx-auto w-full space-y-6">
        {/* Progress Bar & Dots */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Step {step} of 3</span>
            <button
              type="button"
              onClick={() => navigate('/home')}
              className="text-slate-400 hover:text-slate-700"
            >
              Skip
            </button>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              style={{ width: `${(step / 3) * 100}%` }}
              className="bg-[var(--primary)] h-full rounded-full transition-all"
            />
          </div>
        </div>

        {/* STEP 1: Basic Identity */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="space-y-1">
              <span className="text-2xl">🐶</span>
              <h2 className="font-heading font-black text-xl text-slate-900">
                Who are we caring for?
              </h2>
              <p className="text-xs text-slate-500">
                Let's set up your companion's core profile.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pet's Name
                </label>
                <input
                  type="text"
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  placeholder="e.g. Milo"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Breed
                </label>
                <input
                  type="text"
                  value={breed}
                  onChange={(e) => setBreed(e.target.value)}
                  placeholder="e.g. Golden Retriever"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full py-3 rounded-2xl bg-[var(--primary)] hover:opacity-90 text-white text-xs font-bold shadow-md shadow-[var(--primary)]/20 flex items-center justify-center gap-2 transition active:scale-95"
            >
              <span>Next: Biometrics</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: Biometrics */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="space-y-1">
              <span className="text-2xl">⚖️</span>
              <h2 className="font-heading font-black text-xl text-slate-900">
                Biometrics &amp; Vital Stats
              </h2>
              <p className="text-xs text-slate-500">
                Used to compute clinical caloric intake &amp; resting heart rate.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Age
                </label>
                <input
                  type="text"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Unknown">Unknown</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex-1 py-3 rounded-2xl bg-[var(--primary)] hover:opacity-90 text-white text-xs font-bold shadow-md shadow-[var(--primary)]/20 flex items-center justify-center gap-2 transition active:scale-95"
              >
                <span>Next: Goals</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Goals & Health */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="space-y-1">
              <span className="text-2xl">🎯</span>
              <h2 className="font-heading font-black text-xl text-slate-900">
                Daily Nutrition &amp; Health
              </h2>
              <p className="text-xs text-slate-500">
                Personalized targets for food, exercise, and allergies.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Portion Target (g)
                </label>
                <input
                  type="number"
                  value={targetPortion}
                  onChange={(e) => setTargetPortion(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Daily Steps Goal
                </label>
                <input
                  type="number"
                  value={stepsGoal}
                  onChange={(e) => setStepsGoal(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Known Allergies (if any)
              </label>
              <input
                type="text"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                placeholder="e.g. Chicken byproduct, Dairy"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleFinish}
                className="flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition active:scale-95"
              >
                <Check className="w-4 h-4" />
                <span>Complete Onboarding</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
