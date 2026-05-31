"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import LogoutButton from '../components/LogoutButton';

export default function LobbyClient({ initialUser, initialTopPlayers, initialRooms }) {
  const router = useRouter();
  
  // Persist coins in localStorage to feel like a real account
  const [coins, setCoins] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [showInsufficientModal, setShowInsufficientModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Deposit specific states
  const [paymentMethod, setPaymentMethod] = useState('telebirr'); // 'telebirr' | 'cbe_birr' | 'hellocash' | 'ebirr'
  const [depositAmount, setDepositAmount] = useState('100');
  const [accountNumber, setAccountNumber] = useState('');
  const [depositStatus, setDepositStatus] = useState('idle'); // 'idle' | 'processing' | 'success'

  useEffect(() => {
    setIsClient(true);
    const savedCoins = localStorage.getItem('bingo_coins');
    if (savedCoins !== null) {
      setCoins(Number(savedCoins));
    } else {
      setCoins(initialUser.coins || 0);
    }
  }, [initialUser.coins]);

  const updateCoins = (amount) => {
    const newCoins = amount;
    setCoins(newCoins);
    localStorage.setItem('bingo_coins', String(newCoins));
  };

  const handleDepositSubmit = async (e) => {
    if (e) e.preventDefault();
    const amount = Number(depositAmount);
    if (!amount || amount <= 0) return;

    setDepositStatus('processing');
    
    // Simulate real bank processing delay (1.5 seconds)
    await new Promise(resolve => setTimeout(resolve, 1500));

    setDepositStatus('success');

    // Display checkmark for 1 second
    await new Promise(resolve => setTimeout(resolve, 1000));

    updateCoins(coins + amount);
    setShowDepositModal(false);
    setDepositStatus('idle');
    setAccountNumber('');

    // Call the transaction logging API
    try {
      await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: initialUser.username,
          type: `deposit_${paymentMethod}`,
          amount: amount
        })
      });
    } catch (err) {
      console.error("Failed to log deposit transaction:", err);
    }
  };

  const handleJoinRoom = async (e, room) => {
    e.preventDefault();
    if (coins < room.entryFee) {
      setSelectedRoom(room);
      setShowInsufficientModal(true);
    } else {
      // Deduct entry fee on join to make it dynamic and real
      updateCoins(coins - room.entryFee);

      try {
        await fetch('/api/transactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: initialUser.username,
            type: 'entry_fee',
            amount: -room.entryFee
          })
        });
      } catch (err) {
        console.error("Failed to log entry fee transaction:", err);
      }

      router.push(`/play/${room.id}`);
    }
  };

  const activeRooms = initialRooms || [
    { id: 1, name: "Beginner's Luck", entryFee: 10, prize: 500, players: 34, maxPlayers: 50, color: "from-emerald-500 to-teal-600", glow: "shadow-[0_0_20px_rgba(16,185,129,0.3)]" },
    { id: 2, name: "Midnight Madness", entryFee: 50, prize: 3000, players: 48, maxPlayers: 50, color: "from-fuchsia-500 to-purple-600", glow: "shadow-[0_0_20px_rgba(192,38,211,0.3)]", hot: true },
    { id: 3, name: "High Roller VIP", entryFee: 500, prize: 50000, players: 12, maxPlayers: 25, color: "from-yellow-400 to-amber-600", glow: "shadow-[0_0_20px_rgba(250,204,21,0.3)]" },
    { id: 4, name: "Speed Daub", entryFee: 25, prize: 1000, players: 22, maxPlayers: 100, color: "from-cyan-400 to-blue-600", glow: "shadow-[0_0_20px_rgba(34,211,238,0.3)]" }
  ];

  return (
    <div className="relative pt-24 pb-20 overflow-hidden min-h-screen flex flex-col">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col">
        
        {/* Top Dashboard Bar */}
        <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 backdrop-blur-md shadow-2xl mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-fuchsia-500 to-indigo-500 p-1 shadow-[0_0_15px_rgba(192,38,211,0.4)]">
              <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-2xl font-bold uppercase">
                {initialUser.username.charAt(0)}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Welcome back, {initialUser.username}!</h2>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-sm font-medium text-slate-400">Level {initialUser.level}</span>
                <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${initialUser.xpProgress}%` }}></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 bg-slate-950/50 p-4 rounded-2xl border border-white/5 shadow-inner">
            <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400">
              <span className="text-2xl font-black">ꓭ</span>
            </div>
            <div>
              <div className="text-sm text-slate-400 font-medium">Balance</div>
              <div className="text-2xl font-black text-yellow-400 tracking-tight flex items-center gap-1.5">
                <span className="font-extrabold">ꓭ</span>
                {isClient ? coins.toLocaleString() : '0'}
              </div>
            </div>
            <button 
              onClick={() => setShowDepositModal(true)}
              className="ml-4 px-4 py-2 rounded-xl bg-gradient-to-tr from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 transition-all text-sm font-bold text-white shadow-lg active:scale-95 cursor-pointer"
            >
              Deposit
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 flex-1">
          {/* Main Content - Game Rooms */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                Active Rooms
              </h3>
              <button className="text-sm text-fuchsia-400 hover:text-fuchsia-300 font-medium">Refresh</button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {activeRooms.map((room) => (
                <div key={room.id} className={`relative p-6 rounded-3xl bg-slate-900/40 border border-white/10 hover:border-white/20 transition-all hover:-translate-y-1 overflow-hidden group ${room.glow}`}>
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${room.color} opacity-20 rounded-bl-full pointer-events-none group-hover:opacity-30 transition-opacity`}></div>
                  
                  {room.hot && (
                    <div className="absolute top-4 right-4 px-2 py-1 rounded-md bg-red-500/20 text-red-400 text-xs font-bold flex items-center gap-1 border border-red-500/20">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M15.36 11.22c.62-1.39.8-2.92.51-4.4-.11-.56-.69-.87-1.19-.62-2.9 1.48-4.7 4.14-5.32 7.07-.12.57.44 1.05.99.88 1.95-.6 3.65-2 4.67-3.81.1-.19.24-.32.34-.12zm-3.8-9.05c-3.1 1.77-5.18 4.79-5.91 8.35-.38 1.83-.24 3.7.4 5.44.2.53.84.7 1.28.34 2.87-2.3 4.2-5.71 3.59-9.14-.1-.53-.66-.8-1.13-.57-.59.29-1.13.67-1.59 1.12-.2.2-.56.1-.56-.18 0-1.8.84-3.48 2.22-4.57.4-.31.25-.94-.3-1.04z"></path></svg>
                      HOT
                    </div>
                  )}

                  <h4 className="text-xl font-bold mb-4 w-3/4">{room.name}</h4>
                  
                  <div className="flex items-center gap-6 mb-6">
                    <div>
                      <div className="text-xs text-slate-400 mb-1">Entry Fee</div>
                      <div className="font-bold flex items-center gap-1 text-yellow-400">
                        <span className="font-extrabold">ꓭ</span> {room.entryFee}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 mb-1">Prize Pool</div>
                      <div className="font-bold text-fuchsia-400 flex items-center gap-1">
                        <span>ꓭ</span> {room.prize.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 mb-1">Players</div>
                      <div className="font-bold text-cyan-400">{room.players}/{room.maxPlayers}</div>
                    </div>
                  </div>

                  <div className="w-full h-2 bg-slate-950 rounded-full mb-6 overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${room.color}`} style={{ width: `${(room.players / room.maxPlayers) * 100}%` }}></div>
                  </div>

                  <button 
                    onClick={(e) => handleJoinRoom(e, room)} 
                    className={`block w-full py-3 rounded-xl bg-gradient-to-r ${room.color} text-white font-bold text-center hover:opacity-90 transition-opacity active:scale-[0.98] cursor-pointer`}
                  >
                    Join Game
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80 flex flex-col gap-6">
            {/* Daily Challenge */}
            <div className="p-6 rounded-3xl bg-gradient-to-b from-indigo-900/50 to-slate-900/50 border border-indigo-500/30 backdrop-blur-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-fuchsia-500/20 blur-2xl rounded-full"></div>
              <h3 className="text-lg font-bold mb-2">Daily Challenge</h3>
              <p className="text-sm text-indigo-200/70 mb-4">Play 3 games in the High Roller room to unlock a mystery dauber.</p>
              <div className="flex items-center justify-between text-sm font-medium mb-2">
                <span className="text-slate-300">Progress</span>
                <span className="text-fuchsia-400">1/3</span>
              </div>
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                <div className="h-full bg-fuchsia-500 w-1/3"></div>
              </div>
            </div>

            {/* Quick Leaderboard */}
            <div className="p-6 rounded-3xl bg-slate-900/40 border border-white/10 backdrop-blur-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Top Today</h3>
                <Link href="/leaderboard" className="text-xs text-cyan-400 hover:text-cyan-300">View All</Link>
              </div>
              <div className="space-y-4">
                {initialTopPlayers.map((player, idx) => (
                  <div key={player.id} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <span className={`w-5 text-center text-sm font-bold ${idx === 0 ? 'text-yellow-400' : idx === 1 ? 'text-slate-300' : idx === 2 ? 'text-amber-600' : 'text-slate-500'}`}>{idx + 1}</span>
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400 uppercase">
                        {player.name ? player.name.charAt(0) : "U"}
                      </div>
                      <span className="text-sm font-medium group-hover:text-orange-500 transition-colors">{player.name}</span>
                    </div>
                    <span className="text-sm font-mono text-slate-400">0</span>
                  </div>
                ))}
                {initialTopPlayers.length === 0 && (
                  <div className="text-sm text-slate-500 text-center py-2">No players found</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Insufficient Funds Modal */}
      {showInsufficientModal && selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300">
          <div className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl p-6 shadow-[0_15px_50px_rgba(0,0,0,0.8)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Background Glow */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-red-600/20 rounded-full blur-2xl"></div>

            {/* Error Icon */}
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center mb-5 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>

            <h3 className="text-2xl font-black text-white text-center mb-2">Insufficient Balance</h3>
            <p className="text-slate-400 text-sm text-center mb-6 leading-relaxed">
              You have insufficient money to join that game.
              You need at least <strong className="text-yellow-400 font-bold">ꓭ {selectedRoom.entryFee}</strong> to join <strong className="text-white font-bold">{selectedRoom.name}</strong>, but your current balance is only <strong className="text-red-400 font-bold">ꓭ {coins}</strong>.
            </p>

            <div className="flex flex-col gap-3">
              <button 
                onClick={() => {
                  setShowInsufficientModal(false);
                  setShowDepositModal(true);
                }}
                className="w-full py-3 bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all shadow-[0_4px_15px_rgba(192,38,211,0.3)] active:scale-98 cursor-pointer text-center text-sm"
              >
                Go to Deposit
              </button>
              <button 
                onClick={() => {
                  setShowInsufficientModal(false);
                  router.push('/');
                }}
                className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-bold rounded-xl transition-all active:scale-98 cursor-pointer text-center text-sm"
              >
                Go to Home Page
              </button>
              <button 
                onClick={() => setShowInsufficientModal(false)}
                className="w-full py-2 text-xs text-slate-500 hover:text-slate-400 transition-colors cursor-pointer text-center"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CBE Birr, Telebirr, HelloCash Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300">
          <div className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-3xl p-6 md:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {depositStatus === 'idle' && (
              <>
                {/* Background Decor */}
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-fuchsia-600/20 rounded-full blur-2xl"></div>

                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                  <h3 className="text-2xl font-black text-white flex items-center gap-2">
                    <span className="text-2xl font-black text-yellow-400">ꓭ</span>
                    Deposit Balance
                  </h3>
                  <button 
                    onClick={() => setShowDepositModal(false)}
                    className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-all cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>

                <form onSubmit={handleDepositSubmit} className="space-y-6">
                  {/* Payment Methods */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Select Payment Method</label>
                    <div className="grid grid-cols-2 gap-3.5">
                      
                      {/* Telebirr */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('telebirr')}
                        className={`p-4 rounded-2xl border transition-all flex flex-col items-start gap-2 text-left cursor-pointer relative overflow-hidden group ${
                          paymentMethod === 'telebirr'
                            ? 'bg-sky-500/10 border-sky-400 shadow-[0_0_15px_rgba(14,165,233,0.15)]'
                            : 'bg-slate-950/40 border-white/5 hover:border-white/10'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black ${
                          paymentMethod === 'telebirr' ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-400'
                        }`}>
                          T
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm">telebirr</div>
                          <div className="text-[10px] text-slate-400">Ethio Telecom</div>
                        </div>
                        {paymentMethod === 'telebirr' && (
                          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-sky-400"></div>
                        )}
                      </button>

                      {/* CBE Birr */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('cbe_birr')}
                        className={`p-4 rounded-2xl border transition-all flex flex-col items-start gap-2 text-left cursor-pointer relative overflow-hidden group ${
                          paymentMethod === 'cbe_birr'
                            ? 'bg-amber-500/10 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                            : 'bg-slate-950/40 border-white/5 hover:border-white/10'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black ${
                          paymentMethod === 'cbe_birr' ? 'bg-amber-500 text-white' : 'bg-slate-800 text-slate-400'
                        }`}>
                          C
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm">CBE Birr</div>
                          <div className="text-[10px] text-slate-400">Commercial Bank</div>
                        </div>
                        {paymentMethod === 'cbe_birr' && (
                          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-400"></div>
                        )}
                      </button>

                      {/* HelloCash */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('hellocash')}
                        className={`p-4 rounded-2xl border transition-all flex flex-col items-start gap-2 text-left cursor-pointer relative overflow-hidden group ${
                          paymentMethod === 'hellocash'
                            ? 'bg-emerald-500/10 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                            : 'bg-slate-950/40 border-white/5 hover:border-white/10'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black ${
                          paymentMethod === 'hellocash' ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'
                        }`}>
                          H
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm">HelloCash</div>
                          <div className="text-[10px] text-slate-400">Lion/CBO Bank</div>
                        </div>
                        {paymentMethod === 'hellocash' && (
                          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-400"></div>
                        )}
                      </button>

                      {/* E-Birr */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('ebirr')}
                        className={`p-4 rounded-2xl border transition-all flex flex-col items-start gap-2 text-left cursor-pointer relative overflow-hidden group ${
                          paymentMethod === 'ebirr'
                            ? 'bg-fuchsia-500/10 border-fuchsia-400 shadow-[0_0_15px_rgba(217,70,239,0.15)]'
                            : 'bg-slate-950/40 border-white/5 hover:border-white/10'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black ${
                          paymentMethod === 'ebirr' ? 'bg-fuchsia-500 text-white' : 'bg-slate-800 text-slate-400'
                        }`}>
                          E
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm">E-Birr</div>
                          <div className="text-[10px] text-slate-400">Unified Payment</div>
                        </div>
                        {paymentMethod === 'ebirr' && (
                          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-fuchsia-400"></div>
                        )}
                      </button>

                    </div>
                  </div>

                  {/* Account Details */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                        {paymentMethod === 'cbe_birr' ? 'CBE Account Number / Phone' : 'Mobile Number'}
                      </label>
                      <input 
                        type="text" 
                        required
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        placeholder={paymentMethod === 'cbe_birr' ? '1000xxxxxxxx' : '09xxxxxxxx'} 
                        className="w-full bg-slate-950 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-fuchsia-500 font-mono tracking-wider transition-colors shadow-inner"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Recharge Amount (ꓭ)</label>
                      <div className="grid grid-cols-4 gap-2 mb-3">
                        {['50', '100', '500', '1000'].map((val) => (
                          <button
                            type="button"
                            key={val}
                            onClick={() => setDepositAmount(val)}
                            className={`py-2 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                              depositAmount === val
                                ? 'bg-fuchsia-600 border-fuchsia-500 text-white shadow-lg'
                                : 'bg-slate-950/50 border-white/5 text-slate-400 hover:border-white/10 hover:text-white'
                            }`}
                          >
                            +{val}
                          </button>
                        ))}
                      </div>
                      <input 
                        type="number" 
                        required
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        placeholder="Enter custom amount" 
                        className="w-full bg-slate-950 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-fuchsia-500 font-bold transition-colors shadow-inner"
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowDepositModal(false)}
                      className="flex-1 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-bold rounded-2xl transition-all cursor-pointer text-center text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3.5 bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 text-white font-bold rounded-2xl transition-all shadow-[0_4px_20px_rgba(192,38,211,0.4)] active:scale-98 cursor-pointer text-center text-sm"
                    >
                      Pay & Confirm Deposit
                    </button>
                  </div>
                </form>
              </>
            )}

            {depositStatus === 'processing' && (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 border-4 border-fuchsia-500/20 border-t-fuchsia-500 rounded-full animate-spin mb-6"></div>
                <h3 className="text-xl font-bold text-white mb-2">Connecting to Secure Payment Gateway</h3>
                <p className="text-slate-400 text-sm max-w-xs">
                  Please hold on as we authorize your recharge request with <strong>{paymentMethod === 'cbe_birr' ? 'CBE Birr' : paymentMethod === 'telebirr' ? 'telebirr' : paymentMethod === 'hellocash' ? 'HelloCash' : 'E-Birr'}</strong>...
                </p>
              </div>
            )}

            {depositStatus === 'success' && (
              <div className="py-12 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-200">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <h3 className="text-2xl font-black text-white mb-2">Payment Authorized!</h3>
                <p className="text-slate-400 text-sm max-w-xs">
                  Recharged <strong>ꓭ {Number(depositAmount).toLocaleString()}</strong> successfully to your wallet balance. Enjoy the Bingo rooms!
                </p>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
