"use client";

import { useState } from 'react';

export default function RoomsTableClient({ initialRooms }) {
  const [rooms, setRooms] = useState(initialRooms);
  const [editingRoom, setEditingRoom] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [globalPattern, setGlobalPattern] = useState('1 Line');
  const [isBulkUpdating, setIsBulkUpdating] = useState(false);

  const handleEditClick = (room) => {
    setEditingRoom({ ...room });
  };

  const handleBulkUpdate = async () => {
    if (!confirm(`Are you sure you want to change the game type of all rooms to "${globalPattern}"?`)) {
      return;
    }
    
    setIsBulkUpdating(true);
    try {
      const res = await fetch('/api/admin/rooms', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bulk: true,
          pattern: globalPattern
        })
      });
      
      const data = await res.json();
      if (data.success) {
        // Update local state rooms
        setRooms(prev => prev.map(r => ({ ...r, pattern: globalPattern })));
        alert(`Successfully set all rooms to "${globalPattern}"!`);
      } else {
        alert(data.error || "Failed to update rooms.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error. Please try again.");
    } finally {
      setIsBulkUpdating(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingRoom) return;

    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/rooms', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingRoom.id,
          name: editingRoom.name,
          entry_fee: editingRoom.entryFee,
          prize: editingRoom.prize,
          max_players: editingRoom.maxPlayers,
          hot: editingRoom.hot,
          pattern: editingRoom.pattern || '1 Line'
        })
      });

      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        // Update local state list
        setRooms(prev => prev.map(r => r.id === editingRoom.id ? editingRoom : r));
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        setEditingRoom(null);
        setSaveSuccess(false);
      } else {
        alert(data.error || "Failed to update room configuration.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-white mb-1">Game Rooms Management</h1>
          <p className="text-slate-400">Configure entry fees, prize caps, and active statuses for your bingo lobbies.</p>
        </div>
      </div>

      {/* Global Room Configuration Card */}
      <div className="bg-gradient-to-r from-fuchsia-900/30 to-indigo-900/30 border border-white/10 rounded-3xl p-6 backdrop-blur-md shadow-2xl mb-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <span className="text-xl">🎯</span> Global Game Room Config
            </h2>
            <p className="text-sm text-slate-300">
              Assign the active game pattern/win condition to <strong>all rooms at once</strong>. This will instantly change the rules for all active bingo matches across the platform.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            <select
              value={globalPattern}
              onChange={(e) => setGlobalPattern(e.target.value)}
              className="bg-slate-950 border border-white/10 rounded-2xl px-4 py-3 text-white font-bold focus:outline-none focus:border-fuchsia-500 transition-colors shadow-inner cursor-pointer min-w-[220px]"
            >
              <option value="1 Line">1 Line (Horizontal, Vertical, Diagonal)</option>
              <option value="2 Lines">2 Lines</option>
              <option value="3 Lines">3 Lines</option>
              <option value="4 Lines">4 Lines</option>
              <option value="Full House">Full House (Blackout)</option>
              <option value="Half House">Half House (12+ Marked Numbers)</option>
              <option value="Four Corners">Four Corners</option>
              <option value="Outer Edge">Outer Edge (Border)</option>
              <option value="Letter X">Letter X (Diagonals)</option>
              <option value="Letter T">Letter T</option>
              <option value="Letter L">Letter L</option>
              <option value="Center Cross">Center Cross (+)</option>
            </select>
            
            <button
              onClick={handleBulkUpdate}
              disabled={isBulkUpdating}
              className="py-3 px-6 bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold rounded-2xl transition-all shadow-[0_4px_20px_rgba(192,38,211,0.4)] active:scale-98 cursor-pointer text-center text-sm flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {isBulkUpdating ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                  Updating...
                </>
              ) : (
                'Apply to All Rooms'
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {rooms.map((room) => (
          <div key={room.id} className={`relative p-6 rounded-3xl bg-slate-900/60 border border-white/10 overflow-hidden shadow-xl`}>
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${room.color} opacity-20 rounded-bl-full pointer-events-none`}></div>
            
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-semibold text-slate-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md">
                Room #{room.id}
              </span>
              {room.hot && (
                <span className="text-[10px] font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-md">
                  HOT
                </span>
              )}
            </div>

            <h3 className="text-xl font-bold text-white mb-4 line-clamp-1">{room.name}</h3>

            <div className="space-y-2 mb-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Entry Fee</span>
                <span className="text-yellow-400 font-bold flex items-center gap-0.5">
                  <span>ꓭ</span> {room.entryFee}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Prize Pool</span>
                <span className="text-fuchsia-400 font-bold flex items-center gap-0.5">
                  <span>ꓭ</span> {room.prize.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Max Players</span>
                <span className="text-cyan-400 font-bold font-mono">{room.maxPlayers}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Game Type</span>
                <span className="text-emerald-400 font-bold">{room.pattern || '1 Line'}</span>
              </div>
            </div>

            <button
              onClick={() => handleEditClick(room)}
              className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold transition-all cursor-pointer text-center"
            >
              Configure Room
            </button>
          </div>
        ))}
      </div>

      {/* Edit Room Modal */}
      {editingRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300">
          <div className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl p-6 md:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {!saveSuccess ? (
              <>
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                  <h3 className="text-xl font-black text-white">Configure Room #{editingRoom.id}</h3>
                  <button 
                    onClick={() => setEditingRoom(null)}
                    disabled={isSaving}
                    className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-all cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>

                <form onSubmit={handleSave} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Room Title</label>
                    <input 
                      type="text" 
                      required
                      value={editingRoom.name}
                      onChange={(e) => setEditingRoom({ ...editingRoom, name: e.target.value })}
                      className="w-full bg-slate-950 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-fuchsia-500 font-medium transition-colors shadow-inner"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Entry Fee (ꓭ)</label>
                      <input 
                        type="number" 
                        required
                        value={editingRoom.entryFee}
                        onChange={(e) => setEditingRoom({ ...editingRoom, entryFee: Number(e.target.value) })}
                        className="w-full bg-slate-950 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-fuchsia-500 font-bold transition-colors shadow-inner"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Base Prize (ꓭ)</label>
                      <input 
                        type="number" 
                        required
                        value={editingRoom.prize}
                        onChange={(e) => setEditingRoom({ ...editingRoom, prize: Number(e.target.value) })}
                        className="w-full bg-slate-950 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-fuchsia-500 font-bold transition-colors shadow-inner"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Game Type / Pattern</label>
                    <select
                      value={editingRoom.pattern || '1 Line'}
                      onChange={(e) => setEditingRoom({ ...editingRoom, pattern: e.target.value })}
                      className="w-full bg-slate-950 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500 font-bold transition-colors shadow-inner cursor-pointer"
                    >
                      <option value="1 Line">1 Line (Horizontal, Vertical, Diagonal)</option>
                      <option value="2 Lines">2 Lines</option>
                      <option value="3 Lines">3 Lines</option>
                      <option value="4 Lines">4 Lines</option>
                      <option value="Full House">Full House (Blackout)</option>
                      <option value="Half House">Half House (12+ Marked Numbers)</option>
                      <option value="Four Corners">Four Corners</option>
                      <option value="Outer Edge">Outer Edge (Border)</option>
                      <option value="Letter X">Letter X (Diagonals)</option>
                      <option value="Letter T">Letter T</option>
                      <option value="Letter L">Letter L</option>
                      <option value="Center Cross">Center Cross (+)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4 items-center pt-2">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Max Players</label>
                      <input 
                        type="number" 
                        required
                        value={editingRoom.maxPlayers}
                        onChange={(e) => setEditingRoom({ ...editingRoom, maxPlayers: Number(e.target.value) })}
                        className="w-full bg-slate-950 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-fuchsia-500 font-bold transition-colors shadow-inner font-mono"
                      />
                    </div>
                    <div className="flex items-center gap-3 pt-6">
                      <input 
                        type="checkbox" 
                        id="hot_status"
                        checked={editingRoom.hot}
                        onChange={(e) => setEditingRoom({ ...editingRoom, hot: e.target.checked })}
                        className="w-5 h-5 rounded bg-slate-950 border-white/10 text-fuchsia-500 focus:ring-fuchsia-500 cursor-pointer"
                      />
                      <label htmlFor="hot_status" className="text-sm text-slate-300 font-semibold cursor-pointer">Hot Room</label>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-white/5 mt-6">
                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={() => setEditingRoom(null)}
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
                        'Save Configuration'
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
                <h3 className="text-xl font-bold text-white mb-2">Room Updated!</h3>
                <p className="text-slate-400 text-sm">
                  Configured values are live and active for all lobbies instantly.
                </p>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
