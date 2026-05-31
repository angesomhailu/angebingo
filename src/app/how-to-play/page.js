export default function HowToPlay() {
  const steps = [
    {
      step: 1,
      title: "Get Your Cards",
      description: "When you join a room, you'll be given up to 4 bingo cards. Each card has a random set of numbers from 1 to 75, with a FREE space in the middle.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M3 9h18"></path><path d="M3 15h18"></path><path d="M9 3v18"></path><path d="M15 3v18"></path></svg>
      )
    },
    {
      step: 2,
      title: "Listen for the Calls",
      description: "The caller will draw random balls, each with a letter (B-I-N-G-O) and a number. For example, 'B-12' or 'G-54'.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 18h2"></path><path d="M12 2v16"></path><path d="M5 10a7 7 0 0 1 14 0"></path><path d="M5 10a7 7 0 0 0 14 0"></path></svg>
      )
    },
    {
      step: 3,
      title: "Daub Your Numbers",
      description: "If the called number is on your card, click or tap it to 'daub' (mark) it. Keep an eye out—you don't want to miss a call!",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.2 6 3 21l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3Z"></path><path d="m6.2 5.3 3.1 3.9"></path><path d="m12.4 3.4 3.1 3.9"></path><path d="M3 11h.01"></path></svg>
      )
    },
    {
      step: 4,
      title: "Shout BINGO!",
      description: "Complete the required pattern (a line, four corners, or a full house) and hit the BINGO button before anyone else to win the round!",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
      )
    }
  ];

  return (
    <div className="pt-32 pb-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16 relative">
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-indigo-600/30 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
        
        <h1 className="text-4xl sm:text-6xl font-black mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
          How to Play <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-indigo-400">AngeBingo</span>
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          Master the game in minutes. Follow these simple steps and start winning big in our live multiplayer rooms.
        </p>
      </div>

      <div className="space-y-8">
        {steps.map((step, index) => (
          <div key={index} className="relative p-8 rounded-3xl bg-slate-900/50 border border-white/5 flex flex-col md:flex-row gap-8 items-start md:items-center group hover:bg-slate-900 transition-colors overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-fuchsia-500/10 to-indigo-500/10 blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
            
            <div className="flex-shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-fuchsia-400 to-indigo-400 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
              {step.step}
            </div>
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-3 flex items-center gap-3 text-white">
                <span className="text-fuchsia-400">{step.icon}</span>
                {step.title}
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 p-8 sm:p-10 rounded-3xl bg-slate-900/30 border border-indigo-500/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-3xl rounded-full pointer-events-none"></div>
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-white flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          Did You Know? Bingo in Ethiopia
        </h2>
        <div className="text-slate-300 text-lg leading-relaxed">
          <p>
            <strong className="text-fuchsia-400">1. The Classic Game:</strong> The standard game of Bingo (just like the one we are building for AngeBingo!) is definitely played in Ethiopia. It's often found in social clubs, modern entertainment venues, and increasingly through online platforms. It follows the global rules: a caller draws numbers, players daub them on their cards, and the first to complete the pattern shouts "Bingo!"
          </p>
        </div>
      </div>

      <div className="mt-20 p-10 rounded-3xl bg-gradient-to-r from-fuchsia-900/40 to-indigo-900/40 border border-fuchsia-500/20 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>
        <h3 className="text-3xl font-bold mb-4 relative z-10">Ready to test your luck?</h3>
        <p className="text-indigo-200 mb-8 max-w-xl mx-auto relative z-10">
          Now that you know the rules, it's time to play. Join a room and get your first 5 cards for free!
        </p>
        <button className="relative z-10 px-8 py-4 rounded-full bg-white text-indigo-950 font-bold text-lg hover:bg-indigo-50 transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
          Join a Room Now
        </button>
      </div>
    </div>
  );
}
