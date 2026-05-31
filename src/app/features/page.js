import Link from 'next/link';

export default function FeaturesPage() {
  const features = [
    {
      title: "Real-time Multiplayer",
      description: "Join thousands of players in active rooms. Our ultra-low latency servers ensure your daubs register instantly, keeping you in sync with the caller.",
      icon: <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>,
      icon2: <circle cx="9" cy="7" r="4"></circle>,
      icon3: <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>,
      icon4: <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>,
      color: "from-fuchsia-500 to-pink-600",
      bg: "bg-fuchsia-500/10",
      text: "text-fuchsia-400"
    },
    {
      title: "Daily Tournaments",
      description: "Compete in special high-stakes tournaments every day. Climb the daily leaderboard to win massive Birr bundles and exclusive profile badges.",
      icon: <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>,
      icon2: <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>,
      icon3: <path d="M4 22h16"></path>,
      icon4: <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>,
      icon5: <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>,
      icon6: <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>,
      color: "from-yellow-400 to-amber-600",
      bg: "bg-yellow-500/10",
      text: "text-yellow-400"
    },
    {
      title: "Custom Daubers",
      description: "Express your personality with hundreds of unlockable daubers. From glowing neon stamps to cute animated animals, make your card truly yours.",
      icon: <path d="M12 19l7-7 3 3-7 7-3-3z"></path>,
      icon2: <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>,
      icon3: <path d="M2 2l7.586 7.586"></path>,
      icon4: <circle cx="11" cy="11" r="2"></circle>,
      color: "from-cyan-400 to-blue-600",
      bg: "bg-cyan-500/10",
      text: "text-cyan-400"
    },
    {
      title: "Live Chat & Emotes",
      description: "Make friends while you play! Our interactive chat rooms feature custom animated emojis, gifting systems, and global shouting capabilities.",
      icon: <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>,
      color: "from-indigo-400 to-purple-600",
      bg: "bg-indigo-500/10",
      text: "text-indigo-400"
    },
    {
      title: "Provably Fair RNG",
      description: "Trust your luck with our certified Random Number Generator. Every ball drawn is 100% fair, transparent, and completely random.",
      icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>,
      color: "from-emerald-400 to-green-600",
      bg: "bg-emerald-500/10",
      text: "text-emerald-400"
    },
    {
      title: "Cross-Platform Play",
      description: "Start a game on your desktop and finish on your phone. Your account, Birr balance, and progress are seamlessly synced across all your devices.",
      icon: <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>,
      icon2: <line x1="8" y1="21" x2="16" y2="21"></line>,
      icon3: <line x1="12" y1="17" x2="12" y2="21"></line>,
      color: "from-orange-400 to-red-600",
      bg: "bg-orange-500/10",
      text: "text-orange-400"
    }
  ];

  return (
    <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 lg:pb-32 overflow-hidden min-h-screen">
      {/* Decorative background elements */}
      <div className="absolute top-1/4 -right-1/4 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[150px] -z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 -left-1/4 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-cyan-300 text-sm font-bold mb-8 backdrop-blur-sm shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
            Next-Gen Gaming Experience
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-8 leading-tight">
            Features that <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-400">
              Change the Game
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto font-light leading-relaxed">
            We've reimagined classic bingo from the ground up. Discover the innovative features that make AngeBingo the most thrilling platform on the web.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="p-8 rounded-3xl bg-slate-900/50 border border-white/5 hover:bg-slate-900/80 transition-all hover:-translate-y-2 group shadow-lg relative overflow-hidden">
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity rounded-bl-full pointer-events-none`}></div>

              <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 ${feature.text} group-hover:scale-110 transition-transform shadow-[inset_0_0_15px_rgba(255,255,255,0.05)]`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {feature.icon}
                  {feature.icon2}
                  {feature.icon3}
                  {feature.icon4}
                  {feature.icon5}
                  {feature.icon6}
                </svg>
              </div>

              <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-400 transition-all">
                {feature.title}
              </h3>

              <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-24 text-center relative p-12 rounded-3xl overflow-hidden border border-white/10">
          <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-900/20 via-indigo-900/20 to-cyan-900/20 backdrop-blur-md"></div>
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to experience it yourself?</h2>
            <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
              Join thousands of players right now and test all these features today.
            </p>
            <Link href="/login" className="inline-block px-10 py-4 rounded-full bg-white text-slate-900 font-bold text-lg hover:bg-slate-200 transition-all transform hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.3)]">
              Play Now
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
