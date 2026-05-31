import { getDbConnection } from "@/src/lib/mysql";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  let userCount = 0;
  let totalBirrCirculated = 0;
  let recentTransactions = [];

  try {
    const pool = await getDbConnection();
    
    // Fetch user count
    const [userRows] = await pool.query('SELECT COUNT(*) as count FROM users');
    userCount = userRows[0].count;

    // Fetch total circulated volume (sum of absolute value of all transactions)
    const [circulatedRows] = await pool.query('SELECT COALESCE(SUM(ABS(amount)), 0) as total FROM transactions');
    totalBirrCirculated = circulatedRows[0].total;

    // Fetch the 10 most recent transactions
    const [txRows] = await pool.query('SELECT * FROM transactions ORDER BY id DESC LIMIT 10');
    recentTransactions = txRows;
  } catch (error) {
    console.error("Failed to load dashboard data:", error?.message || error?.code || String(error));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-white">System Overview</h1>
          <p className="text-slate-400 mt-1">Welcome to the AngeBingo administration panel.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-slate-900/50 border border-white/10 p-6 rounded-3xl backdrop-blur-sm relative overflow-hidden group hover:border-white/20 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-fuchsia-500/10 blur-xl rounded-full group-hover:bg-fuchsia-500/20 transition-all"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <h3 className="text-slate-400 font-medium">Total Registered Users</h3>
            <div className="p-2 bg-fuchsia-500/10 rounded-lg text-fuchsia-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
          </div>
          <p className="text-4xl font-black text-white relative z-10">{userCount}</p>
          <div className="mt-4 flex items-center text-sm text-emerald-400 font-medium relative z-10">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
            Live count
          </div>
        </div>

        <div className="bg-slate-900/50 border border-white/10 p-6 rounded-3xl backdrop-blur-sm relative overflow-hidden group hover:border-white/20 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 blur-xl rounded-full group-hover:bg-cyan-500/20 transition-all"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <h3 className="text-slate-400 font-medium">Active Game Rooms</h3>
            <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
            </div>
          </div>
          <p className="text-4xl font-black text-white relative z-10">4</p>
          <div className="mt-4 flex items-center text-sm text-slate-500 font-medium relative z-10">
            <span className="w-2 h-2 rounded-full bg-cyan-400 mr-2 animate-pulse"></span>
            Rooms fully configured
          </div>
        </div>

        <div className="bg-slate-900/50 border border-white/10 p-6 rounded-3xl backdrop-blur-sm relative overflow-hidden group hover:border-white/20 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/10 blur-xl rounded-full group-hover:bg-yellow-500/20 transition-all"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <h3 className="text-slate-400 font-medium">Total Birr Circulated</h3>
            <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>
            </div>
          </div>
          <p className="text-4xl font-black text-white relative z-10 flex items-center gap-1.5">
            <span className="text-2xl font-black text-yellow-400">ꓭ</span>
            {totalBirrCirculated.toLocaleString()}
          </p>
          <div className="mt-4 flex items-center text-sm text-emerald-400 font-medium relative z-10">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
            Updated live from database
          </div>
        </div>
      </div>

      {/* Recent Platform Activity */}
      <div className="bg-slate-900/50 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
        <h2 className="text-xl font-bold text-white mb-6">Recent Platform Activity</h2>
        <div className="space-y-4">
          {recentTransactions.map((tx) => {
            const isDeposit = tx.type === 'deposit';
            return (
              <div key={tx.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/50 border border-white/5 hover:border-white/10 transition-all">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-md border ${
                    isDeposit 
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                      : 'bg-fuchsia-500/10 border-fuchsia-500/20 text-fuchsia-400'
                  }`}>
                    {isDeposit ? '📥' : '🎮'}
                  </div>
                  <div>
                    <div className="text-white font-medium">
                      <strong className="text-cyan-400 font-semibold">{tx.username}</strong>{' '}
                      {isDeposit ? 'deposited money' : 'joined a game room'}
                    </div>
                    <div className="text-slate-500 text-xs font-mono mt-0.5">
                      {new Date(tx.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className={`text-lg font-black font-mono ${isDeposit ? 'text-emerald-400' : 'text-fuchsia-400'}`}>
                  {isDeposit ? `+${tx.amount}` : tx.amount} ꓭ
                </div>
              </div>
            );
          })}
          {recentTransactions.length === 0 && (
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-950/50 border border-white/5">
              <div className="flex-1 text-center">
                <p className="text-slate-500 text-sm">No recent transactions or platform activity recorded.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
