import React, { useState, useEffect } from 'react';
import { PawLogo } from './PawLogo';
import { Sparkles, Heart, ShieldCheck, ArrowRight, User, Mail, Phone, Lock, Plus, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Pet } from '../types';

interface SplashAndAuthProps {
  onComplete: () => void;
}

export function SplashAndAuth({ onComplete }: SplashAndAuthProps) {
  const { householdData, updateUserProfile, loginUserWithFirebase, signupUserWithFirebase, showToast } = useApp();

  // Phase: 'splash' (1.2s dynamic animation) -> 'auth' (one-time profile/account setup)
  const [phase, setPhase] = useState<'splash' | 'auth'>('splash');
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');

  // Form states
  const [ownerName, setOwnerName] = useState(householdData.userProfile?.name || 'Sarah Miller');
  const [email, setEmail] = useState(householdData.userProfile?.email || 'sarah.miller@example.com');
  const [phone, setPhone] = useState(householdData.userProfile?.phone || '+1 (555) 019-2834');
  const [password, setPassword] = useState('');
  const [species, setSpecies] = useState<'Dog' | 'Cat'>('Dog');
  const [petName, setPetName] = useState('Milo');
  const [breed, setBreed] = useState('Golden Retriever');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // 3.0-second orange-themed splash entrance animation with running/playing companions
    const timer = setTimeout(() => {
      setPhase('auth');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleSaveAndEnter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      showToast('Password must be at least 6 characters.', 'warning', '🔒');
      return;
    }
    setIsSubmitting(true);

    try {
      if (authMode === 'signup') {
        const res = await signupUserWithFirebase(email.trim(), password, ownerName.trim());
        if (!res.success) {
          setIsSubmitting(false);
          return;
        }
        updateUserProfile({
          phone: phone.trim() || '+1 (555) 019-2834',
        });
      } else {
        const res = await loginUserWithFirebase(email.trim(), password);
        if (!res.success) {
          setIsSubmitting(false);
          return;
        }
      }

      // Mark permanent one-time login in localStorage
      localStorage.setItem('PAWdiCURE_AUTH_COMPLETED_V1', 'true');
      localStorage.setItem('PAWdiCURE_USER_NAME', ownerName.trim() || 'Sarah');
      localStorage.setItem('PAWdiCURE_USER_EMAIL', email.trim() || 'sarah@example.com');

      setTimeout(() => {
        setIsSubmitting(false);
        onComplete();
      }, 400);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--primary)] text-white overflow-hidden selection:bg-white selection:text-[var(--primary)]">
      {/* Background Animated Bokeh Rings & Paw Accents */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
      
      {/* ========================================================================= */}
      {/* 3-SECOND DYNAMIC ORANGE SPLASH ENTRANCE WITH RUNNING & PLAYING PETS */}
      {/* ========================================================================= */}
      {phase === 'splash' && (
        <div className="flex flex-col items-center justify-center p-6 text-center max-w-sm mx-auto space-y-6 animate-in fade-in zoom-in-90 duration-300">
          {/* Logo Badge */}
          <div className="relative">
            <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-md border border-white/40 shadow-2xl flex items-center justify-center p-4 transform rotate-3 animate-bounce">
              <PawLogo className="w-16 h-16 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 bg-amber-300 text-slate-900 rounded-full p-1.5 shadow-lg animate-spin">
              <Sparkles className="w-4 h-4 text-amber-700" />
            </div>
          </div>

          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight font-heading drop-shadow-md">
              PAWdiCURE
            </h1>
            <p className="text-xs text-orange-100 font-semibold tracking-wide uppercase">
              Smart Companion Health &amp; Daily Concierge
            </p>
          </div>

          {/* Animated Running & Playing Pets Track */}
          <div className="w-full bg-white/15 backdrop-blur-xs rounded-2xl p-4 border border-white/20 overflow-hidden relative shadow-inner space-y-3">
            <div className="flex items-center justify-between text-2xl animate-pulse">
              <span className="transform -scale-x-100 animate-bounce delay-75">🐶</span>
              <span className="text-sm font-bold text-white/90">🐾 🐾</span>
              <span className="animate-bounce delay-150">🐈</span>
              <span className="text-sm font-bold text-white/90">🎾</span>
              <span className="animate-bounce delay-300">🐕</span>
            </div>

            {/* 3-second progress indicator bar */}
            <div className="w-full bg-black/20 h-1.5 rounded-full overflow-hidden relative">
              <div
                className="absolute inset-y-0 left-0 bg-white rounded-full transition-all duration-[3000ms] ease-out"
                style={{ width: '100%' }}
              />
            </div>

            <p className="text-[10px] text-orange-100 font-medium animate-pulse">
              Synchronizing with cloud database • Preparing {petName}'s concierge suite…
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ONE-TIME CLOUD LOGIN & COMPANION PROFILE REGISTRATION */}
      {/* ========================================================================= */}
      {phase === 'auth' && (
        <div className="w-full max-w-md mx-auto p-4 sm:p-6 animate-in fade-in slide-in-from-bottom-6 duration-300 max-h-[92vh] overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-7 text-slate-900 shadow-2xl border border-orange-100 space-y-5">
            {/* Header / Brand */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#ff6b4a] flex items-center justify-center shadow-md">
                  <PawLogo className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="font-heading font-extrabold text-lg text-slate-900 leading-tight">
                    Welcome to PAWdiCURE
                  </h2>
                  <p className="text-[11px] text-slate-500 font-medium">
                    One-time setup • Connected to Cloud Firestore
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>Live DB</span>
              </span>
            </div>

            {/* Auth Mode Toggle Pill */}
            <div className="grid grid-cols-2 p-1 rounded-2xl bg-orange-50 border border-orange-200/80">
              <button
                type="button"
                onClick={() => setAuthMode('signup')}
                className={`py-2 text-xs font-bold rounded-xl transition ${
                  authMode === 'signup'
                    ? 'bg-[#ff6b4a] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Create Account
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('signin')}
                className={`py-2 text-xs font-bold rounded-xl transition ${
                  authMode === 'signin'
                    ? 'bg-[#ff6b4a] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Quick One-Time Sign In
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveAndEnter} className="space-y-3.5">
              {authMode === 'signup' && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Your Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      placeholder="e.g. Sarah Miller"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff6b4a]"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. sarah@example.com"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff6b4a]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Security Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff6b4a]"
                  />
                </div>
              </div>

              {authMode === 'signup' && (
                <>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Emergency Contact Number
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 019-2834"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff6b4a]"
                      />
                    </div>
                  </div>

                  {/* Primary Pet Selection preview */}
                  <div className="p-3 bg-orange-50/70 rounded-2xl border border-orange-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-orange-950">Primary Companion</span>
                      <span className="text-[10px] text-orange-700 font-semibold">Pre-loaded in Cloud</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          setSpecies('Dog');
                          setPetName('Milo');
                          setBreed('Golden Retriever');
                        }}
                        className={`flex-1 py-1.5 px-2 rounded-xl font-bold flex items-center justify-center gap-1 border transition ${
                          species === 'Dog'
                            ? 'bg-white text-orange-900 border-orange-300 shadow-2xs'
                            : 'bg-transparent text-slate-500 border-transparent hover:bg-white/50'
                        }`}
                      >
                        <span>🐶 Milo (Dog)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSpecies('Cat');
                          setPetName('Luna');
                          setBreed('British Shorthair');
                        }}
                        className={`flex-1 py-1.5 px-2 rounded-xl font-bold flex items-center justify-center gap-1 border transition ${
                          species === 'Cat'
                            ? 'bg-white text-orange-900 border-orange-300 shadow-2xs'
                            : 'bg-transparent text-slate-500 border-transparent hover:bg-white/50'
                        }`}
                      >
                        <span>🐈 Luna (Cat)</span>
                      </button>
                    </div>
                  </div>
                </>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-2xl bg-[var(--primary)] text-white font-bold text-xs shadow-lg hover:brightness-105 active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2 animate-pulse">
                      <PawLogo className="w-4 h-4" />
                      <span>Securing {petName}'s profile…</span>
                    </div>
                  ) : (
                    <>
                      <span>Enter PAWdiCURE &amp; Start Daily Care</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="text-center space-y-2 pt-1 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  localStorage.setItem('PAWdiCURE_AUTH_COMPLETED_V1', 'true');
                  onComplete();
                }}
                className="text-[10px] text-[#ff6b4a] hover:underline font-semibold"
              >
                Or enter instantly as guest (Sandbox Demo Mode)
              </button>
              <p className="text-[10px] text-slate-400">
                🔒 Protected by Firebase Cloud Security • One-time login persists automatically
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
