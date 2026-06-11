import Link from 'next/link';
import { getDbConnection } from "@/src/lib/mysql";

export const dynamic = 'force-dynamic';

export default async function LeaderboardPage() {
  let dbUsers = [];
  try {
    const pool = await getDbConnection();
    const [rows] = await pool.query("SELECT id, name FROM users WHERE role != 'admin' ORDER BY id ASC LIMIT 10");
    dbUsers = rows;
  } catch (error) {
    console.error("Failed to load users for leaderboard:", error?.message || error?.code || String(error));
  }

  const topPlayers = dbUsers.map((user, index) => {
    let color = index === 0 ? "text-yellow-400" : index === 1 ? "text-slate-300" : index === 2 ? "text-amber-600" : "";
    let bg = index === 0 ? "bg-yellow-400/20" : index === 1 ? "bg-slate-300/20" : index === 2 ? "bg-amber-600/20" : "";
    
    return {
      rank: index + 1,
      name: user.name,
      avatar: user.name.charAt(0).toUpperCase(),
      score: "0",
      winRate: "0%",
      color: color,
      bg: bg
    };
  });

  return (
    <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 lg:pb-32 overflow-hidden min-h-screen">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-1/3 w-[700px] h-[700px] bg-yellow-500/10 rounded-full blur-[150px] -z-10 pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-fuchsia-600/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-yellow-300 text-sm font-bold mb-8 backdrop-blur-sm shadow-[0_0_15px_rgba(253,224,71,0.2)]">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-400"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            Weekly Top Players
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-8 leading-tight">
            Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-600">Leaderboard</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
            Compete with the best players around the world. Climb the ranks to earn exclusive badges and massive Birr rewards.
          </p>
        </div>

        {/* Top 3 Podium (Visible on sm and up) */}
        <div className="hidden sm:flex justify-center items-end gap-6 mb-16 h-64 mt-10">
          {/* Rank 2 */}
          <div className="flex flex-col items-center w-40 transform hover:-translate-y-2 transition-transform">
            <div className="w-16 h-16 rounded-full bg-slate-300/20 border-2 border-slate-300 flex items-center justify-center text-2xl font-bold text-slate-300 shadow-[0_0_20px_rgba(203,213,225,0.3)] mb-4">
              {topPlayers[1]?.avatar || "-"}
            </div>
            <div className="font-bold text-lg mb-1 truncate w-full text-center">{topPlayers[1]?.name || "-"}</div>
            <div className="text-slate-400 font-mono text-sm mb-4">{topPlayers[1]?.score || "0"} Birr</div>
            <div className="w-full h-32 bg-gradient-to-t from-slate-800 to-slate-700/50 rounded-t-lg border-t-4 border-slate-300 relative flex justify-center">
              <span className="absolute top-4 text-3xl font-black text-slate-400 opacity-50">2</span>
            </div>
          </div>

          {/* Rank 1 */}
          <div className="flex flex-col items-center w-48 transform hover:-translate-y-2 transition-transform z-10">
            <div className="absolute -top-10">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]"><path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"></path></svg>
            </div>
            <div className="w-20 h-20 rounded-full bg-yellow-400/20 border-4 border-yellow-400 flex items-center justify-center text-3xl font-bold text-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.5)] mb-4 relative">
              {topPlayers[0]?.avatar || "-"}
            </div>
            <div className="font-bold text-xl mb-1 text-yellow-400 truncate w-full text-center">{topPlayers[0]?.name || "-"}</div>
            <div className="text-slate-300 font-mono text-sm mb-4">{topPlayers[0]?.score || "0"} Birr</div>
            <div className="w-full h-40 bg-gradient-to-t from-slate-800 to-yellow-900/30 rounded-t-lg border-t-4 border-yellow-400 relative flex justify-center">
              <span className="absolute top-4 text-4xl font-black text-yellow-500 opacity-50">1</span>
            </div>
          </div>

          {/* Rank 3 */}
          <div className="flex flex-col items-center w-40 transform hover:-translate-y-2 transition-transform">
            <div className="w-16 h-16 rounded-full bg-amber-600/20 border-2 border-amber-600 flex items-center justify-center text-2xl font-bold text-amber-500 shadow-[0_0_20px_rgba(217,119,6,0.3)] mb-4">
              {topPlayers[2]?.avatar || "-"}
            </div>
            <div className="font-bold text-lg mb-1 truncate w-full text-center">{topPlayers[2]?.name || "-"}</div>
            <div className="text-slate-400 font-mono text-sm mb-4">{topPlayers[2]?.score || "0"} Birr</div>
            <div className="w-full h-24 bg-gradient-to-t from-slate-800 to-amber-900/30 rounded-t-lg border-t-4 border-amber-600 relative flex justify-center">
              <span className="absolute top-4 text-3xl font-black text-amber-700 opacity-50">3</span>
            </div>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-slate-900/60 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-md shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/50 text-slate-400 text-sm uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold w-24 text-center">Rank</th>
                  <th className="px-6 py-4 font-semibold">Player</th>
                  <th className="px-6 py-4 font-semibold text-right">Birr Won</th>
                  <th className="px-6 py-4 font-semibold text-right hidden sm:table-cell">Win Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {topPlayers.map((player, index) => (
                  <tr key={index} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                        player.rank === 1 ? 'bg-yellow-400 text-yellow-950 shadow-[0_0_10px_rgba(250,204,21,0.5)]' :
                        player.rank === 2 ? 'bg-slate-300 text-slate-900' :
                        player.rank === 3 ? 'bg-amber-600 text-white' :
                        'bg-slate-800 text-slate-400 group-hover:text-white transition-colors'
                      }`}>
                        {player.rank}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg hidden sm:flex ${player.bg || 'bg-slate-800 text-slate-300'}`}>
                          {player.avatar}
                        </div>
                        <span className={`font-bold text-lg ${player.color || 'text-white'}`}>
                          {player.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-mono text-fuchsia-400 font-medium bg-fuchsia-400/10 px-3 py-1 rounded-full border border-fuchsia-400/20">
                        {player.score}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right hidden sm:table-cell">
                      <span className="text-slate-300">{player.winRate}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-slate-950/50 border-t border-white/5 text-center">
            <button className="text-sm text-slate-400 hover:text-white transition-colors">
              Load More Players
            </button>
          </div>
        </div>

        {/* Current User Stats */}
        <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-fuchsia-900/40 to-indigo-900/40 border border-fuchsia-500/30 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-slate-400 font-bold">
              ?
            </div>
            <div>
              <div className="text-sm text-slate-400 mb-1">Your Rank</div>
              <div className="font-bold text-xl text-white">Not Ranked</div>
            </div>
          </div>
          <Link href="/login" className="px-6 py-2.5 rounded-full bg-white text-slate-900 font-bold hover:bg-slate-200 transition-all shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            Log in to see your rank
          </Link>
        </div>

      </div>
    </div>
  );
}
