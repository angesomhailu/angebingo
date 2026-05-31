import Link from 'next/link';

export default function SupportPage() {
  return (
    <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 lg:pb-32 overflow-hidden min-h-screen">
      {/* Decorative background elements */}
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-fuchsia-600/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-fuchsia-300 text-sm font-medium mb-8 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-fuchsia-500 animate-pulse"></span>
            24/7 Support Team
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-8 leading-tight">
            How Can We <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-indigo-400 to-cyan-400">Help You?</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
            Our dedicated team is here to assist you with any questions or issues you might have while playing AngeBingo.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Support Option 1 */}
          <div className="p-8 rounded-3xl bg-slate-900/50 border border-white/5 hover:bg-slate-900/80 transition-all hover:-translate-y-1 shadow-lg flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-fuchsia-500/20 flex items-center justify-center mb-6 text-fuchsia-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            </div>
            <h3 className="text-2xl font-bold mb-3">Email Support</h3>
            <p className="text-slate-400 leading-relaxed mb-6 flex-grow">
              Send us an email anytime and we'll get back to you within 24 hours.
            </p>
            <a href="mailto:support@angebingo.com" className="w-full py-3 rounded-full bg-white/10 border border-white/10 text-white font-semibold hover:bg-white/20 transition-all">
              support@angebingo.com
            </a>
          </div>

          {/* Support Option 2 */}
          <div className="p-8 rounded-3xl bg-gradient-to-b from-indigo-900/50 to-slate-900/50 border border-indigo-500/30 hover:border-indigo-400/50 transition-all hover:-translate-y-1 shadow-[0_0_30px_rgba(79,70,229,0.15)] flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-fuchsia-500 to-indigo-500"></div>
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center mb-6 text-indigo-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            </div>
            <h3 className="text-2xl font-bold mb-3">Live Chat</h3>
            <p className="text-indigo-200/70 leading-relaxed mb-6 flex-grow">
              Chat instantly with our support team. Available 24/7 for immediate help.
            </p>
            <button className="w-full py-3 rounded-full bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition-all shadow-[0_0_15px_rgba(79,70,229,0.5)]">
              Start Chat
            </button>
          </div>

          {/* Support Option 3 */}
          <div className="p-8 rounded-3xl bg-slate-900/50 border border-white/5 hover:bg-slate-900/80 transition-all hover:-translate-y-1 shadow-lg flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 flex items-center justify-center mb-6 text-cyan-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            </div>
            <h3 className="text-2xl font-bold mb-3">FAQ</h3>
            <p className="text-slate-400 leading-relaxed mb-6 flex-grow">
              Browse our knowledge base for quick answers to common questions.
            </p>
            <button className="w-full py-3 rounded-full bg-white/10 border border-white/10 text-white font-semibold hover:bg-white/20 transition-all">
              Visit FAQ
            </button>
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="max-w-3xl mx-auto">
          <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/40 border border-white/10 backdrop-blur-md shadow-2xl relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-fuchsia-900/10 to-indigo-900/10 rounded-3xl pointer-events-none"></div>
            <h2 className="text-3xl font-bold mb-8 text-center relative z-10">Send us a Message</h2>
            <form className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-slate-300">Your Name</label>
                  <input type="text" id="name" className="w-full px-4 py-3 rounded-xl bg-slate-950/50 border border-white/10 text-white focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 transition-colors" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-slate-300">Email Address</label>
                  <input type="email" id="email" className="w-full px-4 py-3 rounded-xl bg-slate-950/50 border border-white/10 text-white focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 transition-colors" placeholder="john@example.com" />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium text-slate-300">Subject</label>
                <div className="relative">
                  <select id="subject" defaultValue="" className="w-full px-4 py-3 rounded-xl bg-slate-950/50 border border-white/10 text-white focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 transition-colors appearance-none">
                    <option value="" disabled>Select an issue...</option>
                    <option value="account">Account & Login</option>
                    <option value="billing">Billing & Purchases</option>
                    <option value="gameplay">Gameplay Issue</option>
                    <option value="bug">Report a Bug</option>
                    <option value="other">Other</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-slate-300">Message</label>
                <textarea id="message" rows="5" className="w-full px-4 py-3 rounded-xl bg-slate-950/50 border border-white/10 text-white focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 transition-colors resize-none" placeholder="Describe your issue in detail..."></textarea>
              </div>
              <button type="button" className="w-full py-4 rounded-xl bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white font-bold text-lg hover:from-fuchsia-500 hover:to-indigo-500 transition-all transform hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(192,38,211,0.8)] active:scale-95 flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                Send Message
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
