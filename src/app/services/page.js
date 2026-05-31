import Link from 'next/link';

export default function ServicesPage() {
  return (
    <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 lg:pb-32 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-fuchsia-600/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 text-sm font-medium mb-8 backdrop-blur-sm">
            Last Updated: May 15, 2026
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-8 leading-tight">
            Terms of <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-indigo-400 to-cyan-400">Service</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
            Please read these terms carefully before using AngeBingo. By accessing or using our services, you agree to be bound by these terms.
          </p>
        </div>

        <div className="space-y-8">
          {/* Section 1 */}
          <div className="p-8 rounded-3xl bg-slate-900/50 border border-white/5 hover:bg-slate-900/80 transition-colors shadow-lg">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-fuchsia-500/20 text-fuchsia-400 text-sm">1</span>
              Acceptance of Terms
            </h2>
            <p className="text-slate-400 leading-relaxed">
              By accessing and playing on AngeBingo, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services. Any participation in this service will constitute acceptance of this agreement.
            </p>
          </div>

          {/* Section 2 */}
          <div className="p-8 rounded-3xl bg-slate-900/50 border border-white/5 hover:bg-slate-900/80 transition-colors shadow-lg">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 text-sm">2</span>
              User Registration
            </h2>
            <p className="text-slate-400 leading-relaxed mb-4">
              To fully use the AngeBingo service, you must register for an account. You agree to:
            </p>
            <ul className="list-disc list-inside text-slate-400 leading-relaxed space-y-2 ml-4">
              <li>Provide accurate, current, and complete information as prompted by our registration forms.</li>
              <li>Maintain and promptly update your account information.</li>
              <li>Maintain the security of your password and identification.</li>
              <li>Be fully responsible for all use of your account and for any actions that take place using your account.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="p-8 rounded-3xl bg-slate-900/50 border border-white/5 hover:bg-slate-900/80 transition-colors shadow-lg">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 text-sm">3</span>
              Virtual Currency
            </h2>
            <p className="text-slate-400 leading-relaxed">
              Our service may include virtual, in-game currency ("Birr"). You have no property interest in any Virtual Currency. Any purchase or earning of Virtual Currency is a purchase of a limited, non-transferable, revocable license to use such Virtual Currency within the AngeBingo game. Virtual Currency cannot be redeemed for real money or actual items of value from AngeBingo.
            </p>
          </div>

          {/* Section 4 */}
          <div className="p-8 rounded-3xl bg-slate-900/50 border border-white/5 hover:bg-slate-900/80 transition-colors shadow-lg">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-fuchsia-500/20 text-fuchsia-400 text-sm">4</span>
              Prohibited Conduct
            </h2>
            <p className="text-slate-400 leading-relaxed mb-4">
              You agree not to engage in any of the following activities:
            </p>
            <ul className="list-disc list-inside text-slate-400 leading-relaxed space-y-2 ml-4">
              <li>Using automated systems, bots, or any other software to extract data from or play AngeBingo.</li>
              <li>Attempting to interfere with, compromise the system integrity or security, or decipher any transmissions to or from the servers running AngeBingo.</li>
              <li>Taking any action that imposes, or may impose at our sole discretion an unreasonable or disproportionately large load on our infrastructure.</li>
              <li>Harassing, abusing, or harming another person in our chat rooms.</li>
            </ul>
          </div>
          
          {/* Section 5 */}
          <div className="p-8 rounded-3xl bg-slate-900/50 border border-white/5 hover:bg-slate-900/80 transition-colors shadow-lg">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 text-sm">5</span>
              Account Termination
            </h2>
            <p className="text-slate-400 leading-relaxed">
              We may terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity and limitations of liability.
            </p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-slate-400 mb-6">Have questions about our Terms of Service?</p>
          <Link href="/support" className="inline-flex px-8 py-3 rounded-full bg-white/10 border border-white/10 text-white font-semibold hover:bg-white/20 transition-all backdrop-blur-sm">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
