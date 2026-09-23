import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  User as UserIcon,
  Dog,
  Heart,
  Shield,
  Activity,
  Phone,
  Mail,
  Award,
} from 'lucide-react';

export function OnboardingView({ initialStep }: { initialStep?: number }) {
  const {
    currentUser,
    userProfile,
    onboardingStep: savedStep,
    updateOnboardingStep,
    completeUserOnboarding,
    showToast,
    navigate,
    setLaunchStage,
  } = useApp();

  const [step, setStep] = useState<number>(() => initialStep || savedStep || 1);

  useEffect(() => {
    if (initialStep) setStep(initialStep);
  }, [initialStep]);

  // User Info state
  const [fullName, setFullName] = useState(
    userProfile?.displayName || userProfile?.name || currentUser?.displayName || ''
  );
  const [preferredName, setPreferredName] = useState(
    userProfile?.preferredName || userProfile?.displayName || ''
  );
  const [email, setEmail] = useState(
    userProfile?.email || currentUser?.email || ''
  );
  const [phone, setPhone] = useState(userProfile?.phone || '');

  // Pet Info state
  const [petName, setPetName] = useState('');
  const [species, setSpecies] = useState<'Dog' | 'Cat' | 'Bird' | 'Rabbit' | 'Other'>('Dog');
  const [breed, setBreed] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Unknown'>('Male');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');

  // Pet Lifestyle & Goals
  const [personality, setPersonality] = useState('Playful, Affectionate');
  const [favoriteFood, setFavoriteFood] = useState('Salmon Kibble');
  const [favoriteToy, setFavoriteToy] = useState('Squeaky Ball');
  const [targetPortion, setTargetPortion] = useState('180');
  const [stepsGoal, setStepsGoal] = useState('8500');
  const [allergies, setAllergies] = useState('');

  useEffect(() => {
    if (savedStep && savedStep !== step) {
      setStep(savedStep);
    }
  }, [savedStep]);

  // Synchronize state when userProfile or currentUser is loaded/asynchronously populated
  useEffect(() => {
    if (userProfile) {
      if (!fullName) setFullName(userProfile.displayName || userProfile.name || '');
      if (!preferredName) setPreferredName(userProfile.preferredName || userProfile.displayName || '');
      if (!email) setEmail(userProfile.email || '');
      if (!phone && userProfile.phone) setPhone(userProfile.phone);
    } else if (currentUser) {
      if (!fullName && currentUser.displayName) setFullName(currentUser.displayName);
      if (!email && currentUser.email) setEmail(currentUser.email);
    }
  }, [userProfile, currentUser]);

  const changeStep = async (nextStep: number) => {
    // Explicitly navigate between user setup and pet setup
    if (step === 1 && nextStep === 2) {
      navigate('/onboarding/pet');
    } else if (step === 2 && nextStep === 1) {
      navigate('/onboarding');
    }
    
    setStep(nextStep);
    await updateOnboardingStep(nextStep);
  };

  const handleFinish = async () => {
    if (!fullName.trim()) {
      showToast('Please enter your full name', 'warning', '👤');
      setStep(1);
      return;
    }

    if (!petName.trim()) {
      showToast("Please enter your companion's name", 'warning', '🐾');
      setStep(2);
      return;
    }

    const userUpdates = {
      name: fullName.trim(),
      displayName: fullName.trim(),
      preferredName: preferredName.trim() || fullName.trim(),
      email: email.trim(),
      phone: phone.trim() || null,
    };

    const petData = {
      name: petName.trim(),
      species,
      breed: breed.trim() || 'Companion Breed',
      gender,
      age: age.trim() || '1 year',
      weight: parseFloat(weight) || 10,
      personality: personality
        ? personality.split(',').map((p) => p.trim()).filter(Boolean)
        : ['Friendly'],
      avatarUrl:
        species.toLowerCase() === 'cat'
          ? 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=300&q=80'
          : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=300&q=80',
      targetPortionGrams: parseInt(targetPortion, 10) || 180,
      stepsGoal: parseInt(stepsGoal, 10) || 8500,
      allergies: allergies
        ? allergies.split(',').map((a) => a.trim()).filter(Boolean)
        : [],
    };

    await completeUserOnboarding(userUpdates, petData);
    showToast(`Welcome to PAWdiCURE, ${userUpdates.preferredName}! 🐾`, 'success', '🎉');
    setLaunchStage('TUTORIAL');
  };

  return (
    <div className="flex flex-col w-full min-h-[520px] justify-center py-6 animate-in fade-in duration-200">
      <div className="bg-[var(--card-bg)] rounded-3xl p-6 sm:p-8 border border-[var(--card-border)] shadow-2xl max-w-lg mx-auto w-full space-y-6">
        {/* Header Branding */}
        <div className="flex items-center justify-between border-b border-[var(--card-border)] pb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🐾</span>
            <div>
              <h1 className="font-heading font-black text-lg text-[var(--text)]">
                Welcome to PAWdiCURE
              </h1>
              <p className="text-[11px] text-[var(--text-muted)]">
                First-Time Parent &amp; Companion Setup
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-bold">
            Step {step} of 3
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[var(--card-border)]/30 h-2 rounded-full overflow-hidden">
          <div
            style={{ width: `${(step / 3) * 100}%` }}
            className="bg-[var(--primary)] h-full rounded-full transition-all duration-300"
          />
        </div>

        {/* STEP 1: USER INFORMATION */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="space-y-1">
              <span className="text-2xl">👤</span>
              <h2 className="font-heading font-black text-xl text-[var(--text)]">
                1. User Information
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                Let's setup your primary owner profile.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[var(--text)] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Tharun Miller"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--card-border)] bg-[var(--background)] text-xs text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text)] mb-1">
                  Preferred / Display Name
                </label>
                <input
                  type="text"
                  value={preferredName}
                  onChange={(e) => setPreferredName(e.target.value)}
                  placeholder="e.g. Tharun"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--card-border)] bg-[var(--background)] text-xs text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[var(--text)] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@domain.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--card-border)] bg-[var(--background)] text-xs text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--text)] mb-1">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(555) 019-2831"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--card-border)] bg-[var(--background)] text-xs text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (!fullName.trim()) {
                  showToast('Please enter your full name', 'warning', '👤');
                  return;
                }
                changeStep(2);
              }}
              className="w-full py-3 rounded-2xl bg-[var(--primary)] hover:opacity-90 text-white text-xs font-bold shadow-md shadow-[var(--primary)]/20 flex items-center justify-center gap-2 transition active:scale-95"
            >
              <span>Continue to Pet Profile</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: PET INFORMATION */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="space-y-1">
              <span className="text-2xl">🐶</span>
              <h2 className="font-heading font-black text-xl text-[var(--text)]">
                2. Pet Information
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                Tell us about your beloved companion.
              </p>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[var(--text)] mb-1">
                    Pet Name *
                  </label>
                  <input
                    type="text"
                    value={petName}
                    onChange={(e) => setPetName(e.target.value)}
                    placeholder="e.g. Milo"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--card-border)] bg-[var(--background)] text-xs text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--text)] mb-1">
                    Species
                  </label>
                  <select
                    value={species}
                    onChange={(e) => setSpecies(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--card-border)] bg-[var(--background)] text-xs text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  >
                    <option value="Dog">Dog 🐶</option>
                    <option value="Cat">Cat 🐱</option>
                    <option value="Bird">Bird 🦜</option>
                    <option value="Rabbit">Rabbit 🐰</option>
                    <option value="Other">Other 🐾</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[var(--text)] mb-1">
                    Breed
                  </label>
                  <input
                    type="text"
                    value={breed}
                    onChange={(e) => setBreed(e.target.value)}
                    placeholder="e.g. Golden Retriever"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--card-border)] bg-[var(--background)] text-xs text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--text)] mb-1">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--card-border)] bg-[var(--background)] text-xs text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Unknown">Unknown</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[var(--text)] mb-1">
                    Age / DOB
                  </label>
                  <input
                    type="text"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="e.g. 2 years 4 months"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--card-border)] bg-[var(--background)] text-xs text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--text)] mb-1">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="e.g. 18.5"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--card-border)] bg-[var(--background)] text-xs text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => changeStep(1)}
                className="px-4 py-3 rounded-2xl bg-[var(--card-border)]/40 hover:bg-[var(--card-border)] text-[var(--text)] text-xs font-bold transition flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!petName.trim()) {
                    showToast("Please enter your companion's name", 'warning', '🐾');
                    return;
                  }
                  changeStep(3);
                }}
                className="flex-1 py-3 rounded-2xl bg-[var(--primary)] hover:opacity-90 text-white text-xs font-bold shadow-md shadow-[var(--primary)]/20 flex items-center justify-center gap-2 transition active:scale-95"
              >
                <span>Continue to Goals</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: LIFESTYLE & GOALS */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="space-y-1">
              <span className="text-2xl">🎯</span>
              <h2 className="font-heading font-black text-xl text-[var(--text)]">
                3. Lifestyle &amp; Daily Care Targets
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                Calibrate daily nutrition, exercise, and preferences.
              </p>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[var(--text)] mb-1">
                    Favorite Food
                  </label>
                  <input
                    type="text"
                    value={favoriteFood}
                    onChange={(e) => setFavoriteFood(e.target.value)}
                    placeholder="e.g. Salmon Kibble"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--card-border)] bg-[var(--background)] text-xs text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--text)] mb-1">
                    Favorite Toy
                  </label>
                  <input
                    type="text"
                    value={favoriteToy}
                    onChange={(e) => setFavoriteToy(e.target.value)}
                    placeholder="e.g. Squeaky Ball"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--card-border)] bg-[var(--background)] text-xs text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[var(--text)] mb-1">
                    Daily Portion (grams)
                  </label>
                  <input
                    type="number"
                    value={targetPortion}
                    onChange={(e) => setTargetPortion(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--card-border)] bg-[var(--background)] text-xs text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--text)] mb-1">
                    Daily Steps Target
                  </label>
                  <input
                    type="number"
                    value={stepsGoal}
                    onChange={(e) => setStepsGoal(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--card-border)] bg-[var(--background)] text-xs text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text)] mb-1">
                  Personality &amp; Vibes
                </label>
                <input
                  type="text"
                  value={personality}
                  onChange={(e) => setPersonality(e.target.value)}
                  placeholder="e.g. Playful, Energetic, Gentle"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--card-border)] bg-[var(--background)] text-xs text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text)] mb-1">
                  Known Allergies (if any)
                </label>
                <input
                  type="text"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  placeholder="e.g. Chicken byproduct, Dairy"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--card-border)] bg-[var(--background)] text-xs text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => changeStep(2)}
                className="px-4 py-3 rounded-2xl bg-[var(--card-border)]/40 hover:bg-[var(--card-border)] text-[var(--text)] text-xs font-bold transition flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
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
