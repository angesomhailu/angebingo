"use client";
import { useState } from "react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LogoutButton from './LogoutButton';

export default function Navbar({ user }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <nav className="fixed w-full z-50 top-0 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 relative">

          {/* Left: Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link href="/" className="flex items-center gap-2 cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-fuchsia-600 to-indigo-600 flex items-center justify-center font-bold text-xl shadow-[0_0_15px_rgba(192,38,211,0.5)]">
                A
              </div>
              <span className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                AngeBingo
              </span>
            </Link>
          </div>

          {/* Center: Desktop Centered Nav Links */}
          <div className="hidden md:flex items-center justify-center gap-8 absolute left-1/2 -translate-x-1/2 h-full">
            <Link href="/" className="text-sm font-medium text-slate-300 hover:text-orange-500 transition-colors">Home</Link>
            {user && (
              <Link href="/lobby" className="text-sm font-semibold text-slate-300 hover:text-orange-500 transition-colors">Game Lobby</Link>
            )}
            <Link href="/features" className="text-sm font-medium text-slate-300 hover:text-orange-500 transition-colors">Features</Link>
            <Link href="/leaderboard" className="text-sm font-medium text-slate-300 hover:text-orange-500 transition-colors">Leaderboard</Link>
          </div>

          {/* Right: Desktop User Profile / Auth Links */}
          <div className="hidden md:flex items-center gap-4 flex-shrink-0">
            {user && (
              <div className="relative">
                <button
                  className="flex items-center gap-3 bg-slate-900/80 border border-white/10 hover:border-fuchsia-500/40 hover:bg-slate-800/80 p-1.5 px-3 rounded-xl transition-all cursor-pointer focus:outline-none shadow-md shadow-black/30"
                  onClick={() => setProfileOpen((v) => !v)}
                  aria-haspopup="true"
                  aria-expanded={profileOpen}
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-fuchsia-600 to-indigo-600 flex items-center justify-center font-bold text-sm text-white shadow-md uppercase">
                    {user.name.charAt(0)}
                  </div>
                  <span className="hidden sm:block text-sm font-semibold text-slate-300 transition-colors">{user.name}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`text-slate-400 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`}
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>

                {/* Transparent Click-Outside Backdrop */}
                {profileOpen && (
                  <div
                    className="fixed inset-0 z-40 bg-transparent cursor-default"
                    onClick={() => setProfileOpen(false)}
                  />
                )}

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-white/10 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] z-50 overflow-hidden">
                    <div className="py-2 flex flex-col">
                      <Link
                        href="/profile"
                        onClick={() => setProfileOpen(false)}
                        className="px-4 py-3 text-sm font-medium text-slate-300 hover:text-orange-500 hover:bg-white/5 transition-colors flex items-center gap-3"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-fuchsia-400"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                        My Profile
                      </Link>
                      <div className="h-px bg-white/10 my-1 mx-2"></div>
                      <LogoutButton className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-red-400 hover:text-orange-500 hover:bg-red-500/10 transition-colors text-left">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                        Sign Out
                      </LogoutButton>
                    </div>
                  </div>
                )}
              </div>
            )}
            {!user && (
              <div className="flex items-center gap-2">
                <Link href="/login" className="text-sm font-semibold text-slate-300 hover:text-orange-500 transition-colors">Log in</Link>
                <span className="text-slate-300 text-base mx-1">/</span>
                <Link href="/signup" className="text-sm font-semibold text-slate-300 hover:text-orange-500 transition-colors">Register</Link>
              </div>
            )}
          </div>

          {/* Hamburger for mobile */}
          <div className="md:hidden flex items-center ml-2">
            <button
              className="p-2 rounded-md hover:bg-white/10 focus:outline-none"
              onClick={() => setMobileNavOpen((v) => !v)}
              aria-label="Open navigation menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
            </button>
            {mobileNavOpen && (
              <div className="absolute top-20 right-4 w-56 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-white/10 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] z-50 overflow-hidden">
                <div className="py-2 flex flex-col">
                  <Link href="/" className="px-4 py-3 text-sm font-medium text-slate-300 hover:text-orange-500 hover:bg-white/5 transition-colors">Home</Link>
                  {user && (
                    <Link href="/lobby" className="px-4 py-3 text-sm font-semibold text-slate-300 hover:text-orange-500 hover:bg-white/5 transition-colors">Game Lobby</Link>
                  )}
                  <Link href="/features" className="px-4 py-3 text-sm font-medium text-slate-300 hover:text-orange-500 hover:bg-white/5 transition-colors">Features</Link>
                  <Link href="/leaderboard" className="px-4 py-3 text-sm font-medium text-slate-300 hover:text-orange-500 hover:bg-white/5 transition-colors">Leaderboard</Link>
                  {user && (
                    <>
                      <button
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-300 hover:text-orange-500 hover:bg-white/5 transition-colors w-full text-left"
                        onClick={() => setProfileOpen((v) => !v)}
                      >
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-fuchsia-600 to-indigo-600 flex items-center justify-center font-bold text-sm text-white shadow-[0_0_10px_rgba(192,38,211,0.5)] uppercase">
                          {user.name.charAt(0)}
                        </div>
                        <span>{user.name}</span>
                      </button>
                      {profileOpen && (
                        <div className="mt-2 rounded-2xl bg-slate-900/95 border border-white/10 shadow z-50 overflow-hidden">
                          <div className="py-2 flex flex-col">
                            <Link href="/profile" className="px-4 py-3 text-sm font-medium text-slate-300 hover:text-orange-500 hover:bg-white/5 transition-colors flex items-center gap-3">
                              My Profile
                            </Link>
                            <div className="h-px bg-white/10 my-1 mx-2"></div>
                            <LogoutButton className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-red-400 hover:text-orange-500 hover:bg-red-500/10 transition-colors text-left">
                              Sign Out
                            </LogoutButton>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  {!user && (
                    <div className="flex flex-col gap-2">
                      <Link href="/login" className="px-4 py-3 text-sm font-semibold text-slate-300 hover:text-orange-500 hover:bg-white/5 transition-colors">Log in</Link>
                      <Link href="/signup" className="px-4 py-3 text-sm font-semibold text-slate-300 hover:text-orange-500 hover:bg-white/5 transition-colors">Register</Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
