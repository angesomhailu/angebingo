import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { redirect } from 'next/navigation';
import ProfileTabs from './ProfileTabs';

const secretKey = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback_secret_for_development_only_12345'
);

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session')?.value;
  
  if (!sessionToken) {
    redirect('/login');
  }

  let user = null;
  let shouldRedirect = false;
  try {
    const { payload } = await jwtVerify(sessionToken, secretKey);
    user = payload;
  } catch (error) {
    shouldRedirect = true;
  }

  if (shouldRedirect) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-28 pb-12 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
 
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ProfileTabs user={user} />
      </div>
    </div>
  );
}
