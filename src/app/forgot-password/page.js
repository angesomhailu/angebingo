"use client";
import Link from 'next/link';
import { useState } from 'react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [resetUrl, setResetUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setIsSubmitted(true);
        setResetUrl(data.resetUrl);
      } else {
        setErrorMsg(data.error || "Email verification failed.");
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
          <h2 className="text-3xl font-black text-white tracking-tight">Reset Password</h2>
          <p className="mt-2 text-sm text-slate-400">
            {isSubmitted 
              ? "Your recovery link is ready!"
              : "Enter your email to receive a recovery link"
            }
          </p>
        </div>

        {errorMsg && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold rounded-xl text-center">
            {errorMsg}
          </div>
        )}

        {!isSubmitted ? (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email-address" className="block text-sm font-medium text-slate-300 mb-1">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none relative block w-full px-4 py-3 bg-slate-950/50 border border-white/10 placeholder-slate-500 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-all sm:text-sm"
                  placeholder="Enter your registered email"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500 focus:ring-offset-slate-900 transition-all transform hover:-translate-y-0.5 shadow-[0_0_20px_rgba(192,38,211,0.3)] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Sending Link...' : 'Send Recovery Link'}
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-8 p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center space-y-4">
            <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-xl">
              ✓
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              An account was verified for <strong className="text-white">{email}</strong>. Click below to simulate opening the secure reset link sent to your inbox:
            </p>
            <Link
              href={resetUrl}
              className="mt-2 block w-full text-center py-3 px-4 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all transform hover:-translate-y-0.5 shadow-lg shadow-emerald-600/20"
            >
              Simulate Opening Email Link
            </Link>
          </div>
        )}

        <div className="text-center mt-6">
          <Link href="/login" className="font-bold text-fuchsia-400 hover:text-fuchsia-300 transition-colors text-sm">
            ← Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
