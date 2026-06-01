"use client";

import { useState } from 'react';

export default function UsersTableClient({ initialUsers }) {
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Filter users based on search term (name, email, or ID)
  const filteredUsers = users.filter((user) => {
    const term = searchTerm.toLowerCase();
    return (
      (user.name || '').toLowerCase().includes(term) ||
      (user.email || '').toLowerCase().includes(term) ||
      String(user.id).includes(term)
    );
  });

  // Export filtered users to CSV
  const handleExport = () => {
    if (filteredUsers.length === 0) return;

    // Header row
    const headers = ['Player ID', 'Name', 'Email', 'Role', 'Status'];
    
    // Data rows
    const rows = filteredUsers.map(user => [
      `#${user.id}`,
      `"${(user.name || '').replace(/"/g, '""')}"`,
      `"${(user.email || '').replace(/"/g, '""')}"`,
      user.role || 'user',
      user.status === 'suspended' ? 'Suspended' : 'Active'
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

  const handleEditClick = (user) => {
    setEditingUser({ ...user });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingUser) return;

    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingUser.id,
          name: editingUser.name,
          email: editingUser.email,
          role: editingUser.role,
          status: editingUser.status
        })
      });

      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        // Update local list
        setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...editingUser } : u));
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        setEditingUser(null);
        setSaveSuccess(false);
      } else {
        alert(data.error || "Failed to update user.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleSuspend = async (user) => {
    const newStatus = user.status === 'suspended' ? 'active' : 'suspended';
    const actionName = newStatus === 'suspended' ? 'suspend' : 'activate';
    
    if (!confirm(`Are you sure you want to ${actionName} this player account?`)) {
      return;
    }

    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: user.id,
          status: newStatus
        })
      });

      const data = await res.json();
      if (data.success) {
        setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
      } else {
        alert(data.error || `Failed to ${actionName} user.`);
      }
    } catch (err) {
      console.error(err);
      alert("Network error. Please try again.");
    }
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
                <th className="p-5 text-slate-400 font-semibold text-xs uppercase tracking-wider">Role</th>
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
                        {(user.name || 'P').charAt(0)}
                      </div>
                      <div>
                        <div className="text-white font-medium">{user.name}</div>
                        <div className="text-slate-500 text-xs font-mono mt-0.5">ID: #{user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-5 text-slate-300 text-sm">{user.email}</td>
                  <td className="p-5">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold uppercase tracking-wider border ${
                      user.role === 'admin' 
                        ? 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20' 
                        : 'bg-slate-800 text-slate-400 border-white/5'
                    }`}>
                      {user.role || 'user'}
                    </span>
                  </td>
                  <td className="p-5">
                    {user.status === 'suspended' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-semibold border border-red-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></span>
                        Suspended
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        Active
                      </span>
                    )}
                  </td>
                  <td className="p-5 text-right space-x-2">
                    <button 
                      onClick={() => handleEditClick(user)}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium transition-colors border border-white/5 cursor-pointer"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleToggleSuspend(user)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border cursor-pointer ${
                        user.status === 'suspended'
                          ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/10'
                          : 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/10'
                      }`}
                    >
                      {user.status === 'suspended' ? 'Activate' : 'Suspend'}
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-12 text-center text-slate-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 opacity-50"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    <p className="text-lg font-medium text-slate-400">No matching players found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300">
          <div className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl p-6 md:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {!saveSuccess ? (
              <>
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                  <h3 className="text-xl font-black text-white">Edit Player Profile</h3>
                  <button 
                    onClick={() => setEditingUser(null)}
                    disabled={isSaving}
                    className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-all cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>

                <form onSubmit={handleSave} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Username</label>
                    <input 
                      type="text" 
                      required
                      value={editingUser.name || ''}
                      onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                      className="w-full bg-slate-950 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-fuchsia-500 font-medium transition-colors shadow-inner"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={editingUser.email || ''}
                      onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                      className="w-full bg-slate-950 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-fuchsia-500 font-medium transition-colors shadow-inner"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Account Role</label>
                      <select
                        value={editingUser.role || 'user'}
                        onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                        className="w-full bg-slate-950 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500 font-bold transition-colors shadow-inner appearance-none cursor-pointer"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Status</label>
                      <select
                        value={editingUser.status || 'active'}
                        onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value })}
                        className="w-full bg-slate-950 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500 font-bold transition-colors shadow-inner appearance-none cursor-pointer"
                      >
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-white/5 mt-6">
                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={() => setEditingUser(null)}
                      className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-bold rounded-2xl transition-all cursor-pointer text-center text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="flex-1 py-3 bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 text-white font-bold rounded-2xl transition-all shadow-[0_4px_20px_rgba(192,38,211,0.4)] active:scale-98 cursor-pointer text-center text-sm flex items-center justify-center gap-2"
                    >
                      {isSaving ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="py-8 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-200">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">User Updated!</h3>
                <p className="text-slate-400 text-sm">
                  Profile adjustments are updated and live.
                </p>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
