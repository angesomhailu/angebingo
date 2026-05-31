import Link from 'next/link';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { redirect } from 'next/navigation';

const secretKey = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback_secret_for_development_only_12345'
);

export default async function Home() {

  return (
    <>
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 lg:pb-32 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-fuchsia-600/20 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">


          <h1 className="text-5xl sm:text-7xl font-black tracking-tight mb-8 leading-tight">
            Experience the <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-indigo-400 to-cyan-400">
              Ultimate Bingo Thrill
            </span>
          </h1>

          <p className="mt-4 text-xl sm:text-2xl text-slate-400 max-w-3xl mx-auto mb-10 font-light leading-relaxed">
            Join thousands of players in real-time. Win massive prizes, chat with friends, and enjoy the most vibrant bingo experience online.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
            <button className="px-8 py-4 rounded-full bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white font-bold text-lg hover:from-fuchsia-500 hover:to-indigo-500 transition-all transform hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(192,38,211,0.8)] active:scale-95 flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="6 3 20 12 6 21 6 3"></polygon></svg>
              Start Playing
            </button>
            <Link href="/how-to-play" className="px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-bold text-lg hover:bg-white/10 transition-all backdrop-blur-sm flex items-center justify-center gap-2">
              Learn the Rules
            </Link>
          </div>
        </div>

        {/* Dashboard Preview / Visual Element */}
        <div className="mt-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl bg-slate-900/50 border border-white/10 p-2 shadow-2xl backdrop-blur-xl">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10 pointer-events-none rounded-2xl"></div>
            <div className="rounded-xl overflow-hidden bg-slate-950 border border-white/5 grid grid-cols-5 gap-1 p-4 aspect-video relative">
              {/* Mock Bingo Card Grid */}
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>
              {Array.from({ length: 25 }).map((_, i) => (
                <div key={i} className={`flex items-center justify-center text-2xl sm:text-4xl font-bold rounded-lg border border-white/10 ${i === 12 ? 'bg-fuchsia-600/20 text-fuchsia-400 shadow-[inset_0_0_20px_rgba(192,38,211,0.3)]' : 'bg-slate-900/50 text-slate-300'}`}>
                  {i === 12 ? 'FREE' : Math.floor(Math.random() * 75) + 1}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-24 bg-slate-950 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold mb-4">Why Play AngeBingo?</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">Discover the features that make us the #1 choice for bingo enthusiasts worldwide.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-3xl bg-slate-900/50 border border-white/5 hover:bg-slate-900 transition-colors group">
              <div className="w-14 h-14 rounded-2xl bg-fuchsia-500/20 flex items-center justify-center mb-6 text-fuchsia-400 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Live Multiplayer</h3>
              <p className="text-slate-400 leading-relaxed">Compete against thousands of players globally in real-time rooms with live chat and animated emojis.</p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-3xl bg-slate-900/50 border border-white/5 hover:bg-slate-900 transition-colors group">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center mb-6 text-indigo-400 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Massive Jackpots</h3>
              <p className="text-slate-400 leading-relaxed">Win incredible daily rewards, power-ups, and special event jackpots that keep the excitement high.</p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-3xl bg-slate-900/50 border border-white/5 hover:bg-slate-900 transition-colors group">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 flex items-center justify-center mb-6 text-cyan-400 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">100% Fair Play</h3>
              <p className="text-slate-400 leading-relaxed">Our advanced RNG (Random Number Generator) guarantees that every game is completely fair and truly random.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 to-indigo-950 -z-10"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-6xl font-black mb-6">Ready to shout BINGO?</h2>
          <p className="text-xl text-indigo-200 mb-10">Sign up today and start playing. Don't miss out on the action!</p>
          <Link href="/signup" className="inline-block px-10 py-5 rounded-full bg-white text-indigo-950 font-bold text-xl hover:bg-indigo-50 transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.4)]">
            Create Account
          </Link>
        </div>
      </div>
    </>
  );
}
