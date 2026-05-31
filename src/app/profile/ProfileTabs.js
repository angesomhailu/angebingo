"use client";

import { useState } from "react";

export default function ProfileTabs({ user }) {
  const [activeTab, setActiveTab] = useState("profile");
  const [username, setUsername] = useState(user?.name || "Player");
  const [successMessage, setSuccessMessage] = useState("");
  const [isToggled2FA, setIsToggled2FA] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [notifications, setNotifications] = useState({
    emails: true,
    reminders: true,
    offers: false,
  });

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setSuccessMessage("Changes saved successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const tabs = [
    { id: "profile", label: "Profile & Stats", icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    )},
    { id: "personal", label: "Personal Info", icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
    )},
    { id: "security", label: "Security Settings", icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
    )},
    { id: "preferences", label: "Preferences", icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
    )}
  ];

  return (
    <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-4 md:p-8 backdrop-blur-md shadow-2xl flex flex-col lg:flex-row gap-8">
      {/* Sidebar Tabs */}
      <div className="w-full lg:w-64 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 border-b lg:border-b-0 lg:border-r border-white/10 pr-0 lg:pr-6 flex-shrink-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap lg:whitespace-normal w-auto lg:w-full ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white shadow-[0_0_15px_rgba(192,38,211,0.3)]"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 min-w-0">
        {successMessage && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold animate-fade-in">
            {successMessage}
          </div>
        )}

        {/* Tab 1: Profile & Stats */}
        {activeTab === "profile" && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center gap-6 border-b border-white/10 pb-8">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-fuchsia-600 to-indigo-600 flex items-center justify-center font-bold text-4xl text-white shadow-[0_0_20px_rgba(192,38,211,0.5)] uppercase flex-shrink-0">
                {username.charAt(0)}
              </div>
              <div>
                <h1 className="text-3xl font-black text-white mb-2">{username}</h1>
                <p className="text-slate-400 text-lg">{user?.email || "No Email Provided"}</p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-fuchsia-500/10 text-fuchsia-400 text-xs font-semibold border border-fuchsia-500/20">
                  Role: {user?.role || "Player"}
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400"><path d="M12 20v-6M6 20V10M18 20V4"></path></svg>
                Your Statistics
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-5 bg-slate-950/50 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                  <div className="text-slate-400 text-sm font-medium">Games Played</div>
                  <div className="text-3xl font-black text-white mt-1">0</div>
                </div>
                <div className="p-5 bg-slate-950/50 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                  <div className="text-slate-400 text-sm font-medium">Total Wins</div>
                  <div className="text-3xl font-black text-white mt-1">0</div>
                </div>
                <div className="p-5 bg-slate-950/50 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                  <div className="text-slate-400 text-sm font-medium">Win Rate</div>
                  <div className="text-3xl font-black text-white mt-1">0%</div>
                </div>
                <div className="p-5 bg-slate-950/50 rounded-2xl border border-fuchsia-500/20 shadow-[0_0_15px_rgba(192,38,211,0.05)]">
                  <div className="text-slate-300 text-sm font-medium">Birr Balance</div>
                  <div className="text-3xl font-black text-fuchsia-400 mt-1 drop-shadow-[0_0_8px_rgba(192,38,211,0.5)]">0</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Personal Info */}
        {activeTab === "personal" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-fuchsia-400"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Personal Information
            </h2>
            <p className="text-slate-400 text-sm mb-6">Update your personal account credentials and profile attributes.</p>

            <form onSubmit={handleSaveProfile} className="space-y-4 max-w-lg">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500 transition-colors shadow-inner"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Email Address</label>
                <input
                  type="email"
                  defaultValue={user?.email}
                  disabled
                  className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-3 text-slate-500 cursor-not-allowed shadow-inner"
                />
                <span className="text-xs text-slate-600 mt-1 block">Email address cannot be changed. Contact support to update email.</span>
              </div>
              
              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-fuchsia-500 hover:to-indigo-500 transition-all transform hover:scale-[1.02] active:scale-95 shadow-[0_0_15px_rgba(192,38,211,0.4)]"
                >
                  Save Changes
                </button>
              </div>
            </form>

            <div className="pt-8 border-t border-white/10 mt-8">
              <h3 className="text-lg font-semibold text-white mb-4">Manage Profile Media</h3>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-slate-950 border border-white/10 flex items-center justify-center text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                </div>
                <div>
                  <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-semibold text-white transition-colors">
                    Upload New Avatar
                  </button>
                  <p className="text-xs text-slate-500 mt-1">Supports PNG, JPG up to 2MB.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Security Settings */}
        {activeTab === "security" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                Security & Authentication
              </h2>
              <p className="text-slate-400 text-sm mb-6">Manage your account security, passwords, and 2-factor authentication.</p>

              <form onSubmit={(e) => { e.preventDefault(); setSuccessMessage("Password updated successfully!"); setTimeout(() => setSuccessMessage(""), 3000); }} className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Current Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500 transition-colors shadow-inner"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500 transition-colors shadow-inner"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500 transition-colors shadow-inner"
                  />
                </div>
                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-fuchsia-500 hover:to-indigo-500 transition-all transform hover:scale-[1.02] active:scale-95 shadow-[0_0_15px_rgba(192,38,211,0.4)]"
                  >
                    Change Password
                  </button>
                </div>
              </form>
            </div>

            <div className="pt-8 border-t border-white/10">
              <h3 className="text-lg font-semibold text-white mb-2">Two-Factor Authentication (2FA)</h3>
              <p className="text-sm text-slate-400 mb-4">Secure your account with an extra layer of verification code sent to your authenticator app.</p>
              <div className="flex items-center justify-between p-4 bg-slate-950/50 rounded-2xl border border-white/5">
                <div>
                  <div className="text-white font-medium">Authenticator App Code</div>
                  <div className="text-xs text-slate-500 mt-0.5">{isToggled2FA ? "Active and protecting your account." : "Currently disabled."}</div>
                </div>
                <button
                  onClick={() => setIsToggled2FA(!isToggled2FA)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none ${isToggled2FA ? "bg-fuchsia-600" : "bg-slate-800"}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 transform ${isToggled2FA ? "translate-x-6" : "translate-x-0"}`} />
                </button>
              </div>
            </div>

            <div className="pt-8 border-t border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Account Activity</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm p-3 bg-slate-950/30 rounded-xl border border-white/5">
                  <div>
                    <span className="text-white font-medium">Logged In (Web Browser)</span>
                    <p className="text-xs text-slate-500 mt-0.5">Windows 10 • Addis Ababa, ET</p>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">Just Now</span>
                </div>
                <div className="flex justify-between items-center text-sm p-3 bg-slate-950/30 rounded-xl border border-white/5">
                  <div>
                    <span className="text-white font-medium">Session Initialized</span>
                    <p className="text-xs text-slate-500 mt-0.5">Mobile Browser • Addis Ababa, ET</p>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">2 hours ago</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Preferences */}
        {activeTab === "preferences" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
                System & Gameplay Preferences
              </h2>
              <p className="text-slate-400 text-sm mb-6">Customize language settings, notifications, and visual styling.</p>

              <div className="space-y-6 max-w-lg">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Display Language</label>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500 transition-colors shadow-inner"
                  >
                    <option value="English">English</option>
                    <option value="Amharic">Amharic (አማርኛ)</option>
                    <option value="Oromo">Afaan Oromoo</option>
                    <option value="Tigrinya">Tigrinya (ትግርኛ)</option>
                  </select>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-slate-400 mb-3">Notification Channels</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.emails}
                        onChange={(e) => setNotifications({ ...notifications, emails: e.target.checked })}
                        className="w-4 h-4 rounded border-white/10 bg-slate-950 text-fuchsia-600 focus:ring-fuchsia-500 focus:ring-offset-slate-900"
                      />
                      <span className="text-slate-300 text-sm">Receive email digests and billing reports</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.reminders}
                        onChange={(e) => setNotifications({ ...notifications, reminders: e.target.checked })}
                        className="w-4 h-4 rounded border-white/10 bg-slate-950 text-fuchsia-600 focus:ring-fuchsia-500 focus:ring-offset-slate-900"
                      />
                      <span className="text-slate-300 text-sm">Remind me before registered game rooms start</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.offers}
                        onChange={(e) => setNotifications({ ...notifications, offers: e.target.checked })}
                        className="w-4 h-4 rounded border-white/10 bg-slate-950 text-fuchsia-600 focus:ring-fuchsia-500 focus:ring-offset-slate-900"
                      />
                      <span className="text-slate-300 text-sm">Send promotional codes and Birr credit rewards</span>
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <h3 className="text-sm font-medium text-slate-400 mb-3">Application Theme</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="flex items-center justify-center gap-2 p-3 bg-fuchsia-600/10 border border-fuchsia-500/30 rounded-xl text-sm font-bold text-fuchsia-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
                      Dark (Active)
                    </button>
                    <button className="flex items-center justify-center gap-2 p-3 bg-slate-950/40 border border-white/5 hover:border-white/10 rounded-xl text-sm font-semibold text-slate-400 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
                      Light Mode
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
