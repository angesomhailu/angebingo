"use client";

import { useState } from 'react';

export default function UsersTableClient({ initialUsers }) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter users based on search term (name, email, or ID)
  const filteredUsers = initialUsers.filter((user) => {
    const term = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      String(user.id).includes(term)
    );
  });

  // Export filtered users to CSV
  const handleExport = () => {
    if (filteredUsers.length === 0) return;

    // Header row
    const headers = ['Player ID', 'Name', 'Email', 'Status'];
    
    // Data rows
    const rows = filteredUsers.map(user => [
      `#${user.id}`,
      `"${user.name.replace(/"/g, '""')}"`,
      `"${user.email.replace(/"/g, '""')}"`,
      'Active'
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    
    // Create blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `angebingo_players_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-white mb-1">User Management</h1>
          <p className="text-slate-400">View and manage all registered players.</p>
        </div>
        <button 
          onClick={handleExport}
          disabled={filteredUsers.length === 0}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white font-semibold hover:from-fuchsia-500 hover:to-indigo-500 transition-all shadow-[0_0_15px_rgba(192,38,211,0.3)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          Export CSV ({filteredUsers.length})
        </button>
      </div>
      
      <div className="bg-slate-900/80 border border-white/10 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm animate-in fade-in duration-300">
        <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950/50">
          <h3 className="font-semibold text-white">Registered Players ({filteredUsers.length})</h3>
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ID, name or email..." 
              className="pl-10 pr-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-fuchsia-500 transition-colors w-full sm:w-80 shadow-inner" 
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-white/5">
                <th className="p-5 text-slate-400 font-semibold text-xs uppercase tracking-wider">Player</th>
                <th className="p-5 text-slate-400 font-semibold text-xs uppercase tracking-wider">Contact Email</th>
                <th className="p-5 text-slate-400 font-semibold text-xs uppercase tracking-wider">Status</th>
                <th className="p-5 text-slate-400 font-semibold text-xs uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-fuchsia-600/80 to-indigo-600/80 flex items-center justify-center font-bold text-sm text-white uppercase shadow-lg border border-white/10">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-white font-medium">{user.name}</div>
                        <div className="text-slate-500 text-xs font-mono mt-0.5">ID: #{user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-5 text-slate-300 text-sm">{user.email}</td>
                  <td className="p-5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      Active
                    </span>
                  </td>
                  <td className="p-5 text-right space-x-2">
                    <button className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium transition-colors border border-white/5">
                      Edit
                    </button>
                    <button className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium transition-colors border border-red-500/10">
                      Suspend
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-12 text-center text-slate-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 opacity-50"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    <p className="text-lg font-medium text-slate-400">No matching players found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
