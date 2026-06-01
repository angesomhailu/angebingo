"use client";
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function SSOPopupContent() {
  const searchParams = useSearchParams();
  const provider = searchParams?.get('provider') || 'google';

  const isGoogle = provider === 'google';
  const isFacebook = provider === 'facebook';
  const isGithub = provider === 'github';
  const isApple = provider === 'apple';
  const isMicrosoft = provider === 'microsoft';
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSelectAccount = async (name, email) => {
    setIsLoading(true);
    const providerName = isGoogle ? 'Google' : isGithub ? 'GitHub' : isApple ? 'Apple' : isMicrosoft ? 'Microsoft' : 'Facebook';
    setStatus(`Signing in with ${providerName} account: ${email}...`);

    try {
      const response = await fetch("/api/auth/sso-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, email, name }),
      });

      if (response.ok) {
        setIsSuccess(true);
        setStatus("Access granted! Connecting to Lobby...");
        setTimeout(() => {
          window.close();
        }, 1000);
      } else {
        const data = await response.json();
        setStatus(data.error || "Authentication failed.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("SSO error:", error);
      setStatus("An unexpected error occurred.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white font-sans overflow-hidden relative">
      {/* Background glow dynamic color */}
      <div className={`absolute w-72 h-72 rounded-full blur-[80px] -z-10 opacity-30 ${
        isGoogle ? 'bg-red-500/20' : 
        isGithub ? 'bg-slate-500/20' : 
        isApple ? 'bg-stone-500/20' : 
        isMicrosoft ? 'bg-amber-500/20' : 
        'bg-blue-600/20'
      }`}></div>

      <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl shadow-2xl flex flex-col items-center space-y-6">
        
        {/* Provider Header Logo */}
        <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-lg relative ${
          isGoogle ? 'bg-red-500/10 text-red-500 shadow-red-500/20' : 
          isGithub ? 'bg-slate-800/20 text-slate-300 shadow-slate-800/20' : 
          isApple ? 'bg-stone-850/20 text-white shadow-stone-900/20' : 
          isMicrosoft ? 'bg-blue-900/10 text-blue-400 shadow-blue-900/20' : 
          'bg-blue-600/10 text-blue-500 shadow-blue-600/20'
        }`}>
          {isGoogle ? (
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
          ) : isGithub ? (
            <svg className="w-7 h-7 text-slate-300" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
            </svg>
          ) : isApple ? (
            <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-.1 3.81 1.5-1.37 1.14-1.74 3.02-.6 4.39.6 1.14 1.77 1.8 2.6 1.8.1-.03.2-.06.3-.09-.5 1.5-1.5 2.9-2.5 4.25M15.97 4.17c.66-.81 1.11-1.93.99-3.06-.96.04-2.13.64-2.82 1.45-.6.7-1.13 1.84-.99 2.94.1.03.2.05.3.05.86 0 1.95-.57 2.52-1.38z" />
            </svg>
          ) : isMicrosoft ? (
            <svg className="w-6 h-6" viewBox="0 0 23 23" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 0h11v11H0z" fill="#f25022" />
              <path d="M12 0h11v11H12z" fill="#7fba00" />
              <path d="M0 12h11v11H0z" fill="#00a4ef" />
              <path d="M12 12h11v11H12z" fill="#ffb900" />
            </svg>
          ) : (
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
            </svg>
          )}
        </div>

        <div className="text-center w-full">
          <h2 className="text-xl font-extrabold tracking-tight text-white capitalize">
            Sign In with {provider}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Choose an account to continue to <span className="text-fuchsia-400 font-bold">AngeBingo</span>
          </p>
        </div>

        {status && (
          <div className={`w-full p-3 rounded-xl border text-xs font-semibold text-center ${
            isSuccess 
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
              : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400 animate-pulse'
          }`}>
            {status}
          </div>
        )}

        {!isSuccess && !isLoading && (
          <div className="w-full space-y-3">
            {isGoogle ? (
              // Google Account Chooser
              <div className="border border-white/10 rounded-2xl bg-slate-950/40 overflow-hidden divide-y divide-white/5">
                <button
                  onClick={() => handleSelectAccount('Anu', 'anu@gmail.com')}
                  className="w-full px-5 py-4 text-left hover:bg-white/5 transition-colors flex items-center gap-4 group"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-fuchsia-600 to-indigo-600 flex items-center justify-center font-bold text-sm text-white shadow-md">
                    A
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">Anu</div>
                    <div className="text-xs text-slate-400">anu@gmail.com</div>
                  </div>
                  <span className="ml-auto text-xs text-slate-500 font-medium">Signed In</span>
                </button>

                <button
                  onClick={() => handleSelectAccount('Guest Player', 'guestplayer@gmail.com')}
                  className="w-full px-5 py-4 text-left hover:bg-white/5 transition-colors flex items-center gap-4 group"
                >
                  <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center font-bold text-sm text-slate-300">
                    G
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">Guest Player</div>
                    <div className="text-xs text-slate-400">guestplayer@gmail.com</div>
                  </div>
                </button>
              </div>
            ) : isGithub ? (
              // GitHub Account Chooser
              <div className="border border-white/10 rounded-2xl bg-slate-950/40 overflow-hidden divide-y divide-white/5">
                <button
                  onClick={() => handleSelectAccount('Anu', 'anu@github.com')}
                  className="w-full px-5 py-4 text-left hover:bg-white/5 transition-colors flex items-center gap-4 group"
                >
                  <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center font-bold text-sm text-white shadow-md">
                    A
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">Anu</div>
                    <div className="text-xs text-slate-400">anu@github.com</div>
                  </div>
                  <span className="ml-auto text-xs text-slate-500 font-medium">Signed In</span>
                </button>

                <button
                  onClick={() => handleSelectAccount('Guest Player', 'guestplayer@github.com')}
                  className="w-full px-5 py-4 text-left hover:bg-white/5 transition-colors flex items-center gap-4 group"
                >
                  <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center font-bold text-sm text-slate-300">
                    G
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">Guest Player</div>
                    <div className="text-xs text-slate-400">guestplayer@github.com</div>
                  </div>
                </button>
              </div>
            ) : isApple ? (
              // Apple Account Chooser
              <div className="border border-white/10 rounded-2xl bg-slate-950/40 overflow-hidden divide-y divide-white/5">
                <button
                  onClick={() => handleSelectAccount('Anu', 'anu@apple.com')}
                  className="w-full px-5 py-4 text-left hover:bg-white/5 transition-colors flex items-center gap-4 group"
                >
                  <div className="w-9 h-9 rounded-full bg-stone-700 flex items-center justify-center font-bold text-sm text-white shadow-md">
                    A
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">Anu</div>
                    <div className="text-xs text-slate-400">anu@apple.com</div>
                  </div>
                  <span className="ml-auto text-xs text-slate-500 font-medium">Signed In</span>
                </button>

                <button
                  onClick={() => handleSelectAccount('Guest Player', 'guest@apple.com')}
                  className="w-full px-5 py-4 text-left hover:bg-white/5 transition-colors flex items-center gap-4 group"
                >
                  <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center font-bold text-sm text-slate-300">
                    G
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">Guest Player</div>
                    <div className="text-xs text-slate-400">guest@apple.com</div>
                  </div>
                </button>
              </div>
            ) : isMicrosoft ? (
              // Microsoft Account Chooser
              <div className="border border-white/10 rounded-2xl bg-slate-950/40 overflow-hidden divide-y divide-white/5">
                <button
                  onClick={() => handleSelectAccount('Anu', 'anu@outlook.com')}
                  className="w-full px-5 py-4 text-left hover:bg-white/5 transition-colors flex items-center gap-4 group"
                >
                  <div className="w-9 h-9 rounded-full bg-blue-900 flex items-center justify-center font-bold text-sm text-white shadow-md">
                    A
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">Anu</div>
                    <div className="text-xs text-slate-400">anu@outlook.com</div>
                  </div>
                  <span className="ml-auto text-xs text-slate-500 font-medium">Signed In</span>
                </button>

                <button
                  onClick={() => handleSelectAccount('Guest Player', 'guestplayer@outlook.com')}
                  className="w-full px-5 py-4 text-left hover:bg-white/5 transition-colors flex items-center gap-4 group"
                >
                  <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center font-bold text-sm text-slate-300">
                    G
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">Guest Player</div>
                    <div className="text-xs text-slate-400">guestplayer@outlook.com</div>
                  </div>
                </button>
              </div>
            ) : (
              // Facebook Continue Button
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500 text-3xl font-black shadow-lg">
                  F
                </div>
                
                <button
                  onClick={() => handleSelectAccount('Anu', 'anu@facebook.com')}
                  className="w-full py-3.5 px-4 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all transform hover:-translate-y-0.5 shadow-lg shadow-blue-600/20"
                >
                  Continue as Anu
                </button>
                
                <button
                  onClick={() => handleSelectAccount('Guest Player', 'guest@facebook.com')}
                  className="text-xs font-semibold text-slate-400 hover:text-slate-300 transition-colors"
                >
                  Log in with another account
                </button>
              </div>
            )}
          </div>
        )}

        <p className="text-[10px] text-slate-500 text-center leading-relaxed max-w-xs">
          By choosing an account, {provider === 'google' ? 'Google' : provider === 'github' ? 'GitHub' : 'Facebook'} will share your mock profile details (name and email) to automatically set up your AngeBingo profile.
        </p>
      </div>
    </div>
  );
}

export default function SSOPopup() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white font-sans">
        <div className="w-10 h-10 border-4 border-t-fuchsia-500 border-white/10 rounded-full animate-spin"></div>
      </div>
    }>
      <SSOPopupContent />
    </Suspense>
  );
}
