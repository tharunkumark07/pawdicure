import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PawLogo } from './PawLogo';
import {
  Sparkles,
  ShieldCheck,
  ArrowRight,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Heart,
  ChevronLeft,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SplashAndAuthProps {
  onComplete: () => void;
}

export function SplashAndAuth({ onComplete }: SplashAndAuthProps) {
  const {
    loginUserWithFirebase,
    loginUserWithGoogle,
    loginUserAnonymously,
    signupUserWithFirebase,
    sendPasswordReset,
    showToast,
    onboardingCompleted,
    navigate,
  } = useApp();

  const [phase, setPhase] = useState<'splash' | 'auth'>('splash');
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'forgot'>('signin');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [preferredName, setPreferredName] = useState('');
  const [phone, setPhone] = useState('');

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status & Errors
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [resetSuccessMessage, setResetSuccessMessage] = useState('');
  const [splashProgress, setSplashProgress] = useState(0);

  useEffect(() => {
    // Animate the progress bar from 0% to 100%
    const progressInterval = setInterval(() => {
      setSplashProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 5;
      });
    }, 90); // 20 increments of 5% over ~1.8 seconds

    // 2.0-second splash entrance animation
    const timer = setTimeout(() => {
      setPhase('auth');
    }, 2000);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, []);

  // Email format validator
  const isValidEmail = (str: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str.trim());
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage('');
    setResetSuccessMessage('');
    setIsSubmitting(true);
    try {
      const res = await loginUserWithGoogle();
      if (res.success) {
        if (!('redirecting' in res && (res as any).redirecting)) {
          onComplete();
        }
      } else if (res.error) {
        setErrorMessage(res.error);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Google Sign-In failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setResetSuccessMessage('');

    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!isValidEmail(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await loginUserWithFirebase(email.trim(), password);
      if (res.success) {
        onComplete();
      } else if (res.error) {
        setErrorMessage(res.error);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setResetSuccessMessage('');

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!email.trim() || !isValidEmail(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify your password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await signupUserWithFirebase(
        email.trim(),
        password,
        fullName.trim(),
        {
          preferredName: preferredName.trim() || fullName.trim(),
          phone: phone.trim(),
        }
      );
      if (res.success) {
        // Direct new accounts to Onboarding flow
        navigate('/onboarding');
      } else if (res.error) {
        setErrorMessage(res.error);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Account creation failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setResetSuccessMessage('');

    if (!email.trim() || !isValidEmail(email)) {
      setErrorMessage('Please enter a valid email address to receive reset instructions.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await sendPasswordReset(email.trim());
      if (res.success) {
        setResetSuccessMessage(res.message);
      } else {
        setErrorMessage(res.message);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Could not send reset email. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--primary)] text-white overflow-hidden selection:bg-white selection:text-[var(--primary)]">
      {/* Background Animated Bokeh Rings */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />

      {/* ========================================================================= */}
      {/* SPLASH PHASE */}
      {/* ========================================================================= */}
      <AnimatePresence mode="wait">
        {phase === 'splash' ? (
          <motion.div
            key="splash"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="flex flex-col items-center justify-center p-6 text-center max-w-sm mx-auto space-y-6"
          >
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

          <div className="w-full bg-white/15 backdrop-blur-xs rounded-2xl p-4 border border-white/20 relative shadow-inner space-y-3">
            <div className="flex items-center justify-between text-2xl animate-pulse">
              <span className="transform -scale-x-100 animate-bounce delay-75">🐶</span>
              <span className="text-sm font-bold text-white/90">🐾 🐾</span>
              <span className="animate-bounce delay-150">🐈</span>
              <span className="text-sm font-bold text-white/90">🎾</span>
              <span className="animate-bounce delay-300">🐕</span>
            </div>

            <div className="w-full bg-black/20 h-1.5 rounded-full overflow-hidden relative">
              <div
                className="absolute inset-y-0 left-0 bg-white rounded-full transition-all duration-300 ease-out"
                style={{ width: `${splashProgress}%` }}
              />
            </div>
            <p className="text-[10px] text-orange-100 font-medium">
              Securing companion cloud environment…
            </p>
          </div>
        </motion.div>
        ) : (
          <motion.div
            key="auth"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="w-full max-w-md mx-auto p-4 sm:p-6 max-h-[92vh] overflow-y-auto"
          >
            <div className="bg-white rounded-3xl p-6 sm:p-7 text-slate-900 shadow-2xl border border-orange-100 space-y-5">
            {/* Header & Brand */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#ff6b4a] flex items-center justify-center shadow-md">
                  <PawLogo className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="font-heading font-extrabold text-lg text-slate-900 leading-tight">
                    {authMode === 'signin' && 'Sign In to PAWdiCURE'}
                    {authMode === 'signup' && 'Create Your Account'}
                    {authMode === 'forgot' && 'Reset Your Password'}
                  </h2>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {authMode === 'signin' && 'Access your pets & care data'}
                    {authMode === 'signup' && 'Set up your companion concierge'}
                    {authMode === 'forgot' && 'We will send a reset link to your inbox'}
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>Protected</span>
              </span>
            </div>

            {/* Error & Success Messages */}
            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs space-y-2.5 animate-in fade-in">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="flex-1 font-medium leading-relaxed">{errorMessage}</div>
                </div>
                {(errorMessage.includes('disabled') || errorMessage.includes('Google') || errorMessage.includes('operation-not-allowed')) && (
                  <div className="pt-2 border-t border-rose-200/80 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      disabled={isSubmitting}
                      className="w-full py-2 px-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs border border-slate-300 shadow-2xs transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                    >
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                      <span>Sign in with Google Now</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onComplete()}
                      className="text-center text-[11px] text-slate-600 hover:text-slate-900 font-semibold underline"
                    >
                      Or continue in Guest Sandbox mode
                    </button>
                  </div>
                )}
              </div>
            )}

            {resetSuccessMessage && (
              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="flex-1 font-medium">{resetSuccessMessage}</div>
              </div>
            )}

            {/* Mode Switcher Pill (for Sign In / Sign Up) */}
            {authMode !== 'forgot' && (
              <div className="grid grid-cols-2 p-1 rounded-2xl bg-orange-50 border border-orange-200/80">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signin');
                    setErrorMessage('');
                    setResetSuccessMessage('');
                  }}
                  className={`py-2 text-xs font-bold rounded-xl transition ${
                    authMode === 'signin'
                      ? 'bg-[#ff6b4a] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    setErrorMessage('');
                    setResetSuccessMessage('');
                  }}
                  className={`py-2 text-xs font-bold rounded-xl transition ${
                    authMode === 'signup'
                      ? 'bg-[#ff6b4a] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Create Account
                </button>
              </div>
            )}

            {/* Quick Google Sign In */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-2xl border-2 border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs shadow-xs hover:border-slate-300 active:scale-98 transition flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60 relative group"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
                <span className="ml-auto text-[9px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Fast &amp; Secure
                </span>
              </button>

              {/* Direct Instant Sandbox Access Button */}
              <button
                type="button"
                onClick={async () => {
                  setIsSubmitting(true);
                  try {
                    const res = await loginUserAnonymously();
                    if (res.success) {
                      onComplete();
                    }
                  } catch (err) {
                    console.error('Guest mode failed:', err);
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
                disabled={isSubmitting}
                className="w-full py-2.5 px-3 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-900 border border-orange-200/80 font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <span>🚀 Instant Entry (Guest Sandbox Mode)</span>
              </button>

              <div className="relative py-1">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider">
                  <span className="bg-white px-2 text-slate-400">Or email credentials</span>
                </div>
              </div>
            </div>

            {/* ===================================================================== */}
            {/* SIGN IN FORM */}
            {/* ===================================================================== */}
            {authMode === 'signin' && (
              <form onSubmit={handleSignIn} className="space-y-3.5">
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
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-bold text-slate-700">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('forgot');
                        setErrorMessage('');
                        setResetSuccessMessage('');
                      }}
                      className="text-[10px] text-[#ff6b4a] font-bold hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Your account password"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff6b4a]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 p-0.5"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 rounded-2xl bg-[var(--primary)] text-white font-bold text-xs shadow-lg hover:brightness-105 active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2 animate-pulse">
                        <PawLogo className="w-4 h-4" />
                        <span>Signing In…</span>
                      </div>
                    ) : (
                      <>
                        <span>Sign In &amp; Continue</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* ===================================================================== */}
            {/* SIGN UP FORM */}
            {/* ===================================================================== */}
            {authMode === 'signup' && (
              <form onSubmit={handleSignUp} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Sarah Miller"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff6b4a]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Preferred Name
                    </label>
                    <input
                      type="text"
                      value={preferredName}
                      onChange={(e) => setPreferredName(e.target.value)}
                      placeholder="e.g. Sarah"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff6b4a]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Phone (Optional)
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 555-0199"
                        className="w-full pl-8 pr-2.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff6b4a]"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Email Address <span className="text-rose-500">*</span>
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
                    Password (min 6 characters) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff6b4a]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 p-0.5"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Confirm Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff6b4a]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 p-0.5"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 rounded-2xl bg-[var(--primary)] text-white font-bold text-xs shadow-lg hover:brightness-105 active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2 animate-pulse">
                        <PawLogo className="w-4 h-4" />
                        <span>Creating Account…</span>
                      </div>
                    ) : (
                      <>
                        <span>Create Account &amp; Setup Pet</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* ===================================================================== */}
            {/* FORGOT PASSWORD FORM */}
            {/* ===================================================================== */}
            {authMode === 'forgot' && (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Enter Account Email
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

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signin');
                      setErrorMessage('');
                      setResetSuccessMessage('');
                    }}
                    className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 flex items-center gap-1"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-[var(--primary)] text-white font-bold text-xs shadow-md hover:brightness-105 active:scale-98 transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Send Reset Email</span>
                  </button>
                </div>
              </form>
            )}

            {/* Footer Notice & Guest Option */}
            <div className="text-center space-y-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={async () => {
                  setIsSubmitting(true);
                  try {
                    const res = await loginUserAnonymously();
                    if (res.success) {
                      onComplete();
                    }
                  } catch (err) {
                    console.error('Guest mode failed:', err);
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
                disabled={isSubmitting}
                className="text-[11px] text-slate-500 hover:text-slate-800 font-semibold underline disabled:opacity-50"
              >
                Or preview in Guest Sandbox Mode
              </button>
              <p className="text-[10px] text-slate-400">
                🔒 Firebase Cloud Auth • Your pet biometrics stay private &amp; secure
              </p>
            </div>
          </div>
        </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
