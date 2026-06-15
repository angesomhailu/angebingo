"use client";
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams?.get('email') || '';
  const initialDevCode = searchParams?.get('devCode') || '';

  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [devCode, setDevCode] = useState(initialDevCode);
  const [cooldown, setCooldown] = useState(0);

  // Timer countdown logic for Resend button
  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (code.length !== 6) {
      setErrorMsg("Please enter a valid 6-digit code.");
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMsg("Email successfully verified!");
        // Refresh navbar and redirect to lobby
        setTimeout(() => {
          router.push('/lobby');
          router.refresh();
        }, 1500);
      } else {
        setErrorMsg(data.error || "Verification failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || isLoading) return;

    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const response = await fetch("/api/auth/resend-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMsg("A new verification code has been sent!");
        if (data.devVerificationCode) {
          setDevCode(data.devVerificationCode);
        }
        setCooldown(30); // 30 seconds cooldown
      } else {
        setErrorMsg(data.error || "Failed to resend verification code.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px-200px)] flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 relative">
      {/* Background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

      <div className="max-w-md w-full space-y-6 p-10 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl relative overflow-hidden">
        {/* Glow effect inside card */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-fuchsia-500/30 rounded-full blur-[50px] -z-10 pointer-events-none"></div>

        <div className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-tr from-fuchsia-600 to-indigo-600 flex items-center justify-center font-bold text-3xl shadow-[0_0_20px_rgba(192,38,211,0.5)] mb-6 text-white">
            B
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">Verify Your Email</h2>
          <p className="mt-2 text-sm text-slate-400">
            We sent a verification code to <span className="text-slate-200 font-semibold">{email}</span>
          </p>
        </div>

        {/* Developer Notification Banner */}
        {devCode && (
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-center space-y-1">
            <span className="text-xs uppercase font-extrabold tracking-wider text-amber-400 block">Development Fallback Mode</span>
            <p className="text-xs text-slate-300">
              SMTP credentials are not configured. Use verification code:
            </p>
            <div className="font-mono text-lg font-black text-amber-300 tracking-widest">{devCode}</div>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold rounded-xl text-center">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold rounded-xl text-center">
            {successMsg}
          </div>
        )}

        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-slate-300 mb-2 text-center">
              Enter 6-Digit OTP Code
            </label>
            <input
              id="otp"
              name="otp"
              type="text"
              maxLength={6}
              required
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} // numbers only
              className="appearance-none relative block w-full px-5 py-4 bg-slate-950/50 border border-white/10 placeholder-slate-600 text-white rounded-full text-center text-2xl font-black tracking-[1em] pl-[1.5em] focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-all sm:text-2xl"
              placeholder="000000"
            />
          </div>

          <div className="space-y-3">
            <button
              type="submit"
              disabled={isLoading || code.length !== 6}
              className="w-full flex justify-center py-3.5 px-4 text-sm font-bold rounded-full text-black bg-white hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500 focus:ring-offset-slate-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 shadow-lg"
            >
              {isLoading ? 'Verifying...' : 'Verify & Continue'}
            </button>

            <button
              type="button"
              onClick={handleResend}
              disabled={cooldown > 0 || isLoading}
              className="w-full flex justify-center py-3.5 px-4 text-sm font-bold rounded-full border border-white/10 text-white hover:bg-slate-800 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cooldown > 0 ? `Resend Code in ${cooldown}s` : 'Resend Code'}
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-slate-400">
          Want to change account?{' '}
          <Link href="/signup" className="font-bold text-fuchsia-400 hover:text-fuchsia-300 transition-colors">
            Sign up again
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function VerifyEmail() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="w-10 h-10 border-4 border-t-fuchsia-500 border-white/10 rounded-full animate-spin"></div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
