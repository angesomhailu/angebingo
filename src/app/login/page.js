"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Login() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSSO = (provider) => {
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    const popup = window.open(
      `/sso?provider=${provider}`,
      `${provider} Sign In`,
      `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes,resizable=yes`
    );

    const timer = setInterval(() => {
      if (!popup || popup.closed) {
        clearInterval(timer);
        window.location.href = "/lobby";
      }
    }, 500);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.user?.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/lobby');
        }
        router.refresh(); // Refresh to update navbar state
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred during login.");
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
          <h2 className="text-3xl font-black text-white tracking-tight">Welcome back</h2>
          <p className="mt-2 text-sm text-slate-400">
            Sign in to your account to resume the fun
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-slate-300 mb-1">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-4 py-3 bg-slate-950/50 border border-white/10 placeholder-slate-500 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-all sm:text-sm"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none relative block w-full px-4 py-3 bg-slate-950/50 border border-white/10 placeholder-slate-500 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-all sm:text-sm"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-white/10 bg-slate-950 text-fuchsia-600 focus:ring-fuchsia-500 focus:ring-offset-slate-900"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-300">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link href="/forgot-password" className="font-medium text-fuchsia-400 hover:text-fuchsia-300 transition-colors">
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500 focus:ring-offset-slate-900 transition-all transform hover:-translate-y-0.5 shadow-[0_0_20px_rgba(192,38,211,0.3)] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-900/80 text-slate-400 backdrop-blur-sm rounded-md">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button 
              onClick={() => handleSSO('google')}
              className="w-full flex items-center justify-center px-4 py-2 border border-white/10 rounded-xl shadow-sm bg-slate-950/50 text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google
            </button>
            <button 
              onClick={() => handleSSO('facebook')}
              className="w-full flex items-center justify-center px-4 py-2 border border-white/10 rounded-xl shadow-sm bg-slate-950/50 text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors"
            >
              <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              Facebook
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-slate-400">
          Don't have an account?{' '}
          <Link href="/signup" className="font-bold text-fuchsia-400 hover:text-fuchsia-300 transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
