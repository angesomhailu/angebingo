import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 lg:pb-32 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 text-sm font-medium mb-8 backdrop-blur-sm">
            Effective Date: May 15, 2026
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-8 leading-tight">
            Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-400">Policy</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
            Your privacy is important to us. This policy outlines how AngeBingo collects, uses, and protects your personal information.
          </p>
        </div>

        <div className="space-y-8">
          {/* Section 1 */}
          <div className="p-8 rounded-3xl bg-slate-900/50 border border-white/5 hover:bg-slate-900/80 transition-colors shadow-lg">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </span>
              Information We Collect
            </h2>
            <p className="text-slate-400 leading-relaxed mb-4">
              We collect information to provide better services to our users. The types of personal information we obtain include:
            </p>
            <ul className="list-disc list-inside text-slate-400 leading-relaxed space-y-2 ml-4">
              <li><strong>Account Information:</strong> Name, email address, username, and password when you register.</li>
              <li><strong>Usage Data:</strong> Information about your interactions with the game, including game history, chat logs, and preferences.</li>
              <li><strong>Device Information:</strong> IP address, browser type, operating system, and mobile device identifiers.</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="p-8 rounded-3xl bg-slate-900/50 border border-white/5 hover:bg-slate-900/80 transition-colors shadow-lg">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
              </span>
              How We Use Information
            </h2>
            <p className="text-slate-400 leading-relaxed mb-4">
              We use the information we collect to operate, maintain, and provide the features and functionality of AngeBingo:
            </p>
            <ul className="list-disc list-inside text-slate-400 leading-relaxed space-y-2 ml-4">
              <li>To provide and maintain our Service.</li>
              <li>To manage your account and provide customer support.</li>
              <li>To detect, prevent and address technical issues and fraud.</li>
              <li>To communicate with you about updates, offers, and promotions.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="p-8 rounded-3xl bg-slate-900/50 border border-white/5 hover:bg-slate-900/80 transition-colors shadow-lg">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-10 h-10 rounded-2xl bg-fuchsia-500/20 text-fuchsia-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              </span>
              Data Security
            </h2>
            <p className="text-slate-400 leading-relaxed">
              The security of your data is important to us. We implement a variety of security measures to maintain the safety of your personal information when you enter, submit, or access your personal information. However, please be aware that no method of transmission over the internet, or method of electronic storage is 100% secure, and we cannot guarantee its absolute security.
            </p>
          </div>

          {/* Section 4 */}
          <div className="p-8 rounded-3xl bg-slate-900/50 border border-white/5 hover:bg-slate-900/80 transition-colors shadow-lg">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </span>
              Sharing of Information
            </h2>
            <p className="text-slate-400 leading-relaxed">
              We do not sell, trade, or otherwise transfer your Personally Identifiable Information to outside parties. This does not include trusted third parties who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential.
            </p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-slate-400 mb-6">Need more details about how we protect your privacy?</p>
          <Link href="/support" className="inline-flex px-8 py-3 rounded-full bg-white/10 border border-white/10 text-white font-semibold hover:bg-white/20 transition-all backdrop-blur-sm">
            Contact Privacy Team
          </Link>
        </div>
      </div>
    </div>
  );
}
