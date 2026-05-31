"use client";
import { useState } from 'react';
import Link from 'next/link';
import LogoutButton from './LogoutButton';

export default function AdminProfileDropdown({ adminUser }) {
  const [profileOpen, setProfileOpen] = useState(false);

  const name = adminUser?.name || 'Administrator';
  const avatarChar = name.charAt(0);

  return (
    <div className="relative">
      {/* Profile Toggle Button */}
      <button
        className="flex items-center gap-3 bg-slate-900/80 border border-white/10 hover:border-fuchsia-500/40 hover:bg-slate-800/80 p-1.5 px-3 rounded-xl transition-all cursor-pointer focus:outline-none shadow-md shadow-black/30"
        onClick={() => setProfileOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={profileOpen}
        title="Admin Options"
      >
        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-fuchsia-600 to-indigo-600 flex items-center justify-center font-bold text-xs text-white shadow-md uppercase">
          {avatarChar}
        </div>
        <span className="hidden sm:block text-sm font-semibold text-slate-300 transition-colors">
          {name}
        </span>
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

      {/* Dropdown Menu Container */}
      {profileOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900/98 border border-fuchsia-500/25 shadow-[0_10px_35px_rgba(0,0,0,0.8),_0_0_15px_rgba(192,38,211,0.15)] z-50 overflow-hidden">
          <div className="py-2 flex flex-col">
            <div className="px-4 py-2 border-b border-white/5 bg-white/5 mb-1">
              <span className="block text-[10px] text-fuchsia-400 font-bold uppercase tracking-wider">Role</span>
              <span className="text-xs font-semibold text-slate-300">System Admin</span>
            </div>

            <Link
              href="/profile"
              onClick={() => setProfileOpen(false)}
              className="px-4 py-3 text-sm font-semibold text-slate-300 hover:text-orange-500 hover:bg-white/5 transition-colors flex items-center gap-3"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-fuchsia-400">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              My Profile
            </Link>

            <div className="h-px bg-white/10 my-1 mx-2"></div>

            <LogoutButton className="flex w-full items-center gap-3 px-4 py-3 text-sm font-semibold text-red-400 hover:text-white hover:bg-red-500/20 transition-all text-left">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500/70">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Sign Out
            </LogoutButton>
          </div>
        </div>
      )}
    </div>
  );
}
