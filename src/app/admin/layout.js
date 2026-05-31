import Link from 'next/link';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { redirect } from 'next/navigation';
import LogoutButton from '../components/LogoutButton';
import AdminProfileDropdown from '../components/AdminProfileDropdown';

export default async function AdminLayout({ children }) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session');

  if (!sessionCookie) {
    redirect('/login');
  }

  let adminUser = null;
  let redirectTarget = null;
  try {
    const secretKey = new TextEncoder().encode(
      process.env.JWT_SECRET || 'fallback_secret_for_development_only_12345'
    );
    const { payload } = await jwtVerify(sessionCookie.value, secretKey);

    if (payload.role !== 'admin') {
      redirectTarget = '/';
    } else {
      adminUser = payload;
    }
  } catch (error) {
    redirectTarget = '/login';
  }

  if (redirectTarget) {
    redirect(redirectTarget);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Admin Top Navbar */}
      <nav className="fixed w-full z-50 top-0 border-b border-white/10 bg-slate-950/80 backdrop-blur-md h-20 flex items-center justify-between px-8">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="flex items-center gap-2 cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-fuchsia-600 to-indigo-600 flex items-center justify-center font-bold text-xl shadow-[0_0_15px_rgba(192,38,211,0.5)]">
              A
            </div>
            <span className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
              AngeBingo
            </span>
          </Link>
          <span className="px-2.5 py-1 text-xs font-semibold text-fuchsia-400 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-full">
            Admin Panel
          </span>
        </div>

        {/* Right side profile */}
        <div className="flex items-center gap-4">
          <AdminProfileDropdown adminUser={adminUser} />
        </div>
      </nav>

      <div className="flex-1 flex pt-20 relative">
        {/* Sidebar */}
        <div className="w-64 bg-slate-900/80 backdrop-blur-xl border-r border-white/10 fixed left-0 top-20 bottom-0 overflow-y-auto z-40">
          <div className="p-6">
            <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-indigo-400 uppercase tracking-widest text-sm mb-1">Admin Portal</h2>
            <p className="text-xs text-slate-500 font-medium">Control Panel v1.0</p>
          </div>
          <nav className="px-4 space-y-2 mt-4">
            <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-all group">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 group-hover:text-fuchsia-400 transition-colors"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>
              Dashboard
            </Link>
            <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-all group">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 group-hover:text-fuchsia-400 transition-colors"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
              User Management
            </Link>
            <Link href="/admin/rooms" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-all group">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 group-hover:text-fuchsia-400 transition-colors"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
              Game Rooms
            </Link>
          </nav>
        </div>
        {/* Main Content Area */}
        <div className="flex-1 ml-64 p-8 min-h-[calc(100vh-5rem)]">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
