import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, X, User, Sparkles, Zap, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function SignInModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { signInWithGoogle, signInWithGoogleDemo, signInWithEmail } = useAuth();
  
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '', general: '', code: '' });

  // When user clicks Continue with Google -> redirect to Vizzle brand login
  const handleGoogleSignIn = () => {
    setIsGoogleLoading(true);
    window.location.href = 'https://dashboard.vizzle.in/login';
  };

  // Lock scroll & handle Escape key when modal is active
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = { email: '', password: '', general: '' };
    let valid = true;
    if (!emailOrUsername.trim()) {
      errs.email = 'Email or username is required.';
      valid = false;
    }
    if (!password) {
      errs.password = 'Password is required.';
      valid = false;
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
      valid = false;
    }
    setErrors(errs);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    setErrors({ email: '', password: '', general: '' });

    const result = await signInWithEmail(emailOrUsername, password);
    setIsSubmitting(false);

    if (result.success) {
      setSuccessMessage(true);
      setTimeout(() => {
        setSuccessMessage(false);
        onClose();
        navigate('/dashboard/studio');
      }, 500);
    } else {
      setErrors((prev) => ({ ...prev, general: result.error || 'Failed to sign in.' }));
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop with luxury dark tint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md transition-all"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-[1040px] bg-white rounded-[28px] sm:rounded-[36px] overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.65)] border border-stone-800/20 grid grid-cols-1 lg:grid-cols-12 my-auto"
        >
          {/* Close button (top right of modal card) */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 lg:top-5 lg:right-5 z-30 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm shadow-md"
            aria-label="Close modal"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* ── Left Column: Form Card ── */}
          <div className="lg:col-span-5 p-6 sm:p-9 lg:p-11 flex flex-col justify-between bg-white">
            <div>
              {/* Brand Logo with viz.png symbol */}
              <div className="flex items-center gap-3 mb-5">
                <img
                  src="/viz.png"
                  alt="Vizzle"
                  className="h-8 sm:h-9 w-auto object-contain shrink-0"
                />
                <span className="font-extrabold tracking-[0.24em] text-[19px] sm:text-[21px] text-[#1a1715] font-sans">
                  VIZZLE
                </span>
              </div>

              {/* Title & Promotion */}
              <h2 className="text-[26px] sm:text-[30px] font-extrabold text-[#1c1917] tracking-tight mb-1 font-sans leading-tight">
                Welcome Back
              </h2>
              <div className="flex items-center gap-2 text-xs sm:text-[13.5px] font-medium text-[#736c64] mb-5">
                <span className="text-base leading-none">🎁</span>
                <span>Get 100 Free credits to start.</span>
              </div>

              {/* Error message banner */}
              {errors.general && (
                <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                  <span className="leading-snug">{errors.general}</span>
                </div>
              )}

              {/* Real Google OAuth Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading || isSubmitting}
                className="w-full py-3.5 px-4 rounded-xl border border-stone-200/90 bg-white hover:bg-stone-50/80 active:bg-stone-100 text-[#2b2724] text-xs sm:text-[13.5px] font-semibold flex items-center justify-center gap-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all cursor-pointer disabled:opacity-60"
              >
                {isGoogleLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-stone-600" />
                    <span>Redirecting to Vizzle...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.97 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative flex items-center justify-center my-5">
                <div className="w-full border-t border-stone-200" />
                <span className="bg-white px-3 text-[11px] font-semibold text-stone-400 uppercase tracking-wider shrink-0 font-sans">
                  Or Continue With
                </span>
                <div className="w-full border-t border-stone-200" />
              </div>

              {/* Scoped autofill override to preserve clean white background */}
              <style>{`
                .vz-signin-input:-webkit-autofill,
                .vz-signin-input:-webkit-autofill:hover, 
                .vz-signin-input:-webkit-autofill:focus {
                  -webkit-box-shadow: 0 0 0px 1000px white inset !important;
                  -webkit-text-fill-color: #1c1917 !important;
                }
              `}</style>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email or Username */}
                <div>
                  <label className="block text-[13px] font-bold text-[#1f1b18] mb-1.5 font-sans">
                    Email or Username*
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-3.5 w-4 h-4 text-stone-400 pointer-events-none" />
                    <input
                      type="text"
                      value={emailOrUsername}
                      onChange={(e) => { setEmailOrUsername(e.target.value); setErrors(prev => ({...prev, email:''})); }}
                      placeholder="Enter your email"
                      className={`vz-signin-input w-full pl-10 pr-4 py-3 rounded-xl border text-xs sm:text-[13.5px] text-[#1c1917] placeholder:text-stone-400 focus:outline-none focus:ring-2 transition-all font-sans bg-white ${
                        errors.email
                          ? 'border-red-400 focus:ring-red-300 focus:border-red-400'
                          : 'border-stone-200 focus:ring-stone-900 focus:border-stone-900'
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[13px] font-bold text-[#1f1b18] font-sans">
                      Password*
                    </label>
                    <button
                      type="button"
                      onClick={() => alert('Password recovery link sent to your registered email.')}
                      className="text-xs font-semibold text-[#A26E3A] hover:underline font-sans cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-3.5 w-4 h-4 text-stone-400 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setErrors(prev => ({...prev, password:''})); }}
                      placeholder="Enter password (min. 6 chars)"
                      className={`vz-signin-input w-full pl-10 pr-10 py-3 rounded-xl border text-xs sm:text-[13.5px] text-[#1c1917] placeholder:text-stone-400 focus:outline-none focus:ring-2 transition-all font-sans bg-white ${
                        errors.password
                          ? 'border-red-400 focus:ring-red-300 focus:border-red-400'
                          : 'border-stone-200 focus:ring-stone-900 focus:border-stone-900'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 text-stone-400 hover:text-stone-600 focus:outline-none cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.password}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || successMessage}
                  className="w-full py-3.5 mt-2.5 bg-[#1C1A17] hover:bg-black text-white font-bold rounded-xl text-sm transition-all shadow-[0_4px_14px_rgba(28,26,23,0.35)] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 font-sans"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Signing In...</span>
                    </>
                  ) : successMessage ? (
                    <span>Welcome to Vizzle! ✓</span>
                  ) : (
                    <>
                      <span>Continue</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Bottom Footer Link */}
            <p className="text-xs sm:text-[13px] text-stone-500 text-center mt-6 font-sans">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  window.location.href = 'https://dashboard.vizzle.in';
                }}
                className="font-bold text-[#A26E3A] hover:underline ml-1 cursor-pointer"
              >
                Sign Up
              </button>
            </p>
          </div>

          {/* ── Right Column: Showcase Art ── */}
          <div
            className="lg:col-span-7 relative min-h-[460px] lg:min-h-[580px] flex flex-col justify-between p-7 sm:p-10 lg:p-12 overflow-hidden bg-cover bg-center"
            style={{
              backgroundImage: "url('/images/auth/signin_showcase.jpg')",
            }}
          >
            {/* Atmospheric gradient overlay for typography contrast */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(to top, rgba(12, 10, 9, 0.94) 0%, rgba(12, 10, 9, 0.72) 40%, rgba(12, 10, 9, 0.15) 75%, transparent 100%)',
              }}
            />

            {/* Top Right Tag matching reference: STYLE / AI / YOU ── */}
            <div className="relative z-10 flex justify-end">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.25em] text-stone-300/90 uppercase font-sans">
                  STYLE &nbsp;/&nbsp; AI &nbsp;/&nbsp; YOU
                </span>
                <span className="w-7 sm:w-9 h-[1px] bg-stone-400/50 inline-block" />
              </div>
            </div>

            {/* Bottom Headline & Feature Tags */}
            <div className="relative z-10 mt-auto pt-20">
              <h3
                className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-white leading-[1.2] mb-2"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Turn Your Ideas Into <br />
                <span
                  className="italic font-normal text-[#E2B777]"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Stunning Outfits
                </span>
              </h3>
              <p
                className="text-stone-300/90 text-xs sm:text-[13.5px] leading-relaxed max-w-md mb-6"
                style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}
              >
                Generate realistic AI fashion looks with premium models, trendy styles, and endless
                possibilities — all in one place.
              </p>

              <div className="flex items-center gap-3 sm:gap-4 text-xs font-medium text-stone-300 border-t border-white/15 pt-4">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#E2B777]" />
                  <span>AI Models</span>
                </div>
                <span className="text-stone-500/80">|</span>
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#E2B777]" />
                  <span>Trendy Styles</span>
                </div>
                <span className="text-stone-500/80">|</span>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-[#E2B777]" />
                  <span>Instant Results</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
