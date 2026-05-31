"use client";
import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams?.get('email') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        setIsSuccess(true);
      } else {
        const data = await response.json();
        setErrorMsg(data.error || "Password reset failed.");
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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-fuchsia-600/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

      <div className="max-w-md w-full space-y-8 p-10 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl relative overflow-hidden">
        {/* Glow effect inside card */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/30 rounded-full blur-[50px] -z-10 pointer-events-none"></div>

        <div className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-tr from-fuchsia-600 to-indigo-600 flex items-center justify-center font-bold text-3xl shadow-[0_0_20px_rgba(192,38,211,0.5)] mb-6 text-white">
            A
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">Create New Password</h2>
          <p className="mt-2 text-sm text-slate-400">
            {isSuccess 
              ? "Your password has been changed"
              : `Setting new password for ${email}`
            }
          </p>
        </div>

        {errorMsg && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold rounded-xl text-center">
            {errorMsg}
          </div>
        )}

        {!isSuccess ? (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">
                  New Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full px-4 py-3 bg-slate-950/50 border border-white/10 placeholder-slate-500 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-all sm:text-sm"
                  placeholder="At least 6 characters"
                />
              </div>

              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-300 mb-1">
                  Confirm New Password
                </label>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none relative block w-full px-4 py-3 bg-slate-950/50 border border-white/10 placeholder-slate-500 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-all sm:text-sm"
                  placeholder="Repeat new password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500 focus:ring-offset-slate-900 transition-all transform hover:-translate-y-0.5 shadow-[0_0_20px_rgba(192,38,211,0.3)] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Resetting Password...' : 'Reset Password'}
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-8 p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center space-y-4">
            <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-xl">
              ✓
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Your password has been successfully updated in the database. You can now use your new password to sign in.
            </p>
            <Link
              href="/login"
              className="mt-4 block w-full text-center py-3 px-4 rounded-xl font-bold bg-fuchsia-600 hover:bg-fuchsia-500 text-white transition-all transform hover:-translate-y-0.5 shadow-lg shadow-fuchsia-600/20"
            >
              Sign In Now
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ResetPassword() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="w-10 h-10 border-4 border-t-fuchsia-500 border-white/10 rounded-full animate-spin"></div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
