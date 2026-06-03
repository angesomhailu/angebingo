"use client";

import { useState, useEffect, use } from 'react';
import Link from 'next/link';

// Helper to generate a random number within a range
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Generate a column of unique numbers
const generateColumn = (min, max, count) => {
  const nums = new Set();
  while (nums.size < count) {
    nums.add(getRandomInt(min, max));
  }
  return Array.from(nums);
};

// Generate a 5x5 Bingo Card (Cartela)
const generateCartela = () => {
  const b = generateColumn(1, 15, 5);
  const i = generateColumn(16, 30, 5);
  const n = generateColumn(31, 45, 4); // Center is free
  const g = generateColumn(46, 60, 5);
  const o = generateColumn(61, 75, 5);

  return [
    { letter: 'B', numbers: b },
    { letter: 'I', numbers: i },
    { letter: 'N', numbers: [n[0], n[1], 'FREE', n[2], n[3]] },
    { letter: 'G', numbers: g },
    { letter: 'O', numbers: o }
  ];
};

export default function GameRoom({ params }) {
  // Safe destructure for next.js 15+ params Promise
  const unwrappedParams = use(params);
  const roomId = unwrappedParams?.id || '1';

  const roomsData = {
    '1': { name: "Beginner's Luck", entryFee: 10, basePrize: 500, initialPlayers: 34, maxPlayers: 50, pattern: '1 Line' },
    '2': { name: "Midnight Madness", entryFee: 50, basePrize: 3000, initialPlayers: 48, maxPlayers: 50, pattern: '2 Lines' },
    '3': { name: "High Roller VIP", entryFee: 500, basePrize: 50000, initialPlayers: 12, maxPlayers: 25, pattern: 'Full House' },
    '4': { name: "Speed Daub", entryFee: 25, basePrize: 1000, initialPlayers: 22, maxPlayers: 100, pattern: '3 Lines' }
  };

  const room = roomsData[roomId] || { name: `Room #${roomId}`, entryFee: 50, basePrize: 1000, initialPlayers: 10, maxPlayers: 50, pattern: '1 Line' };

  const [cartelas, setCartelas] = useState([]);
  const [daubedNumbers, setDaubedNumbers] = useState(new Set());
  const [calledNumbers, setCalledNumbers] = useState([]);
  const [currentCall, setCurrentCall] = useState(null);
  const [playersCount, setPlayersCount] = useState(room.initialPlayers);

  // Sync playersCount when room changes
  useEffect(() => {
    setPlayersCount(room.initialPlayers);
  }, [roomId, room.initialPlayers]);

  // Simulate other players joining the room over time
  useEffect(() => {
    const interval = setInterval(() => {
      setPlayersCount(prev => {
        if (prev <= 0) return room.initialPlayers;
        if (prev >= room.maxPlayers) {
          return Math.random() > 0.85 ? prev - 1 : prev;
        }
        return Math.random() > 0.25 ? prev + 1 : prev;
      });
    }, 6000);

    return () => clearInterval(interval);
  }, [room.maxPlayers, room.initialPlayers]);

  // Initialize with 1 cartela
  useEffect(() => {
    setCartelas([{ id: Date.now(), card: generateCartela() }]);
    setDaubedNumbers(new Set(['FREE']));
  }, []);

  const addCartela = () => {
    if (cartelas.length < 4) {
      setCartelas([...cartelas, { id: Date.now(), card: generateCartela() }]);
    }
  };

  const removeCartela = (cartelaId) => {
    setCartelas(cartelas.filter(c => c.id !== cartelaId));
  };

  const [gameStarted, setGameStarted] = useState(false);
  const [startCountdown, setStartCountdown] = useState(5);
  const [timeLeft, setTimeLeft] = useState(5);
  const [showWinModal, setShowWinModal] = useState(false);
  const [winPrize, setWinPrize] = useState(0);
  const [falseBingoMessage, setFalseBingoMessage] = useState('');
  const [username, setUsername] = useState('PlayerOne');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('bingo_username');
      if (storedUser) setUsername(storedUser);
    }
  }, []);

  const toggleDaub = (number) => {
    if (number === 'FREE') return;
    // Only allow daubing if the number has actually been called
    if (!calledNumbers.includes(number)) {
      setFalseBingoMessage(`Number ${getLetterForNumber(number)}${number} has not been called yet!`);
      setTimeout(() => setFalseBingoMessage(''), 2500);
      return;
    }

    setDaubedNumbers(prev => {
      const newDaubs = new Set(prev);
      if (newDaubs.has(number)) {
        newDaubs.delete(number);
      } else {
        newDaubs.add(number);
      }
      return newDaubs;
    });
  };

  // Game countdown and number calling simulation
  useEffect(() => {
    const interval = setInterval(() => {
      if (!gameStarted) {
        setStartCountdown(prev => {
          if (prev <= 1) {
            setGameStarted(true);
            // Immediately call first number
            const firstNum = getRandomInt(1, 75);
            setCalledNumbers([firstNum]);
            setCurrentCall(firstNum);
            return 0;
          }
          return prev - 1;
        });
      } else {
        setTimeLeft(prev => {
          if (prev <= 1) {
            const newNumber = getRandomInt(1, 75);
            setCalledNumbers(prevCalled => {
              if (prevCalled.includes(newNumber) || prevCalled.length >= 75) return prevCalled;
              setCurrentCall(newNumber);
              return [newNumber, ...prevCalled];
            });
            return 5;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [gameStarted]);

  const getCompletedLinesCount = (cartela) => {
    const card = cartela.card;
    let completedCount = 0;
    
    // Check rows
    for (let r = 0; r < 5; r++) {
      let rowWin = true;
      for (let c = 0; c < 5; c++) {
        const num = card[c].numbers[r];
        if (num !== 'FREE' && !daubedNumbers.has(num)) {
          rowWin = false;
          break;
        }
      }
      if (rowWin) completedCount++;
    }

    // Check columns
    for (let c = 0; c < 5; c++) {
      let colWin = true;
      for (let r = 0; r < 5; r++) {
        const num = card[c].numbers[r];
        if (num !== 'FREE' && !daubedNumbers.has(num)) {
          colWin = false;
          break;
        }
      }
      if (colWin) completedCount++;
    }

    // Check Diagonal 1
    let diag1Win = true;
    for (let i = 0; i < 5; i++) {
      const num = card[i].numbers[i];
      if (num !== 'FREE' && !daubedNumbers.has(num)) {
        diag1Win = false;
        break;
      }
    }
    if (diag1Win) completedCount++;

    // Check Diagonal 2
    let diag2Win = true;
    for (let i = 0; i < 5; i++) {
      const num = card[i].numbers[4 - i];
      if (num !== 'FREE' && !daubedNumbers.has(num)) {
        diag2Win = false;
        break;
      }
    }
    if (diag2Win) completedCount++;

    return completedCount;
  };

  const isFullHouse = (cartela) => {
    const card = cartela.card;
    for (let c = 0; c < 5; c++) {
      for (let r = 0; r < 5; r++) {
        const num = card[c].numbers[r];
        if (num !== 'FREE' && !daubedNumbers.has(num)) {
          return false;
        }
      }
    }
    return true;
  };

  const checkWin = (cartela) => {
    const pattern = room.pattern || '1 Line';
    if (pattern === 'Full House') {
      return isFullHouse(cartela);
    }
    
    const lines = getCompletedLinesCount(cartela);
    if (pattern === '1 Line') return lines >= 1;
    if (pattern === '2 Lines') return lines >= 2;
    if (pattern === '3 Lines') return lines >= 3;
    
    return lines >= 1;
  };

  const handleBingoClaim = async () => {
    if (!gameStarted) return;
    
    // Check if any cartela is a winning one
    let hasWon = false;
    for (const cartela of cartelas) {
      if (checkWin(cartela)) {
        hasWon = true;
        break;
      }
    }

    if (hasWon) {
      const prize = playersCount * room.entryFee;
      setWinPrize(prize);
      setShowWinModal(true);

      // Add winnings to balance
      const currentCoins = Number(localStorage.getItem('bingo_coins') || 0);
      const newCoins = currentCoins + prize;
      localStorage.setItem('bingo_coins', String(newCoins));

      // Log transaction
      try {
        await fetch('/api/transactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: username,
            type: 'bingo_win',
            amount: prize
          })
        });
      } catch (err) {
        console.error("Failed to log win transaction:", err);
      }
    } else {
      // False Bingo: show temporary message
      setFalseBingoMessage("False Bingo! You don't have a complete line yet.");
      setTimeout(() => {
        setFalseBingoMessage('');
      }, 3000);
    }
  };

  const getLetterForNumber = (num) => {
    if (num <= 15) return 'B';
    if (num <= 30) return 'I';
    if (num <= 45) return 'N';
    if (num <= 60) return 'G';
    return 'O';
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-20 relative overflow-hidden flex flex-col">
      {/* Decorative background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col">
        {/* Header / Game Info */}
        <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 backdrop-blur-md shadow-2xl mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <Link href="/lobby" className="text-sm text-slate-400 hover:text-white flex items-center gap-1 mb-2 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Back to Lobby
            </Link>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black text-white">{room.name}</h1>
              <span className="text-xs font-semibold text-slate-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md">
                Room #{roomId}
              </span>
            </div>
            
            {/* Dynamic Room Stats */}
            <div className="flex flex-wrap items-center gap-4 mt-3 text-xs font-medium text-slate-300">
              <div className="flex items-center gap-1.5 bg-slate-950/40 px-3 py-1.5 rounded-lg border border-white/5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Players:</span>
                <span className="text-emerald-400 font-bold font-mono">{playersCount}/{room.maxPlayers}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-950/40 px-3 py-1.5 rounded-lg border border-white/5">
                <span className="text-yellow-400">🪙</span>
                <span>Prize Pool:</span>
                <span className="text-yellow-400 font-bold font-mono">ꓭ {(playersCount * room.entryFee).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-950/40 px-3 py-1.5 rounded-lg border border-white/5">
                <span>Entry Fee:</span>
                <span className="text-cyan-400 font-bold font-mono">ꓭ {room.entryFee}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-950/40 px-3 py-1.5 rounded-lg border border-white/5">
                <span className="text-fuchsia-400">🎯</span>
                <span>Win Condition:</span>
                <span className="text-fuchsia-400 font-bold font-mono">{room.pattern || '1 Line'}</span>
              </div>
            </div>
          </div>

          {/* Called Number Display */}
          <div className="flex items-center gap-6">
            {/* Timer Countdown */}
            <div className="flex items-center gap-3 bg-slate-950/40 p-3 rounded-2xl border border-white/5 animate-pulse">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="text-slate-800"
                    fill="transparent"
                  />
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="text-fuchsia-500 transition-all duration-1000"
                    strokeDasharray={2 * Math.PI * 20}
                    strokeDashoffset={2 * Math.PI * 20 * (1 - (gameStarted ? timeLeft : startCountdown) / 5)}
                    fill="transparent"
                  />
                </svg>
                <span className="absolute text-[11px] font-bold text-white font-mono">
                  {gameStarted ? `${timeLeft}s` : `${startCountdown}s`}
                </span>
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                  {gameStarted ? "Next Ball" : "Game Start"}
                </div>
                <div className="text-xs text-slate-500">
                  {gameStarted ? "Auto Calling" : "Waiting"}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm text-slate-400 font-medium">Last Called</div>
              <div className="text-4xl font-black text-fuchsia-400 tracking-tighter drop-shadow-[0_0_15px_rgba(192,38,211,0.5)]">
                {currentCall ? `${getLetterForNumber(currentCall)}${currentCall}` : 'Waiting...'}
              </div>
            </div>
            
            {/* Called numbers history */}
            <div className="hidden sm:flex gap-2 p-3 bg-slate-950/50 rounded-xl border border-white/5">
              {calledNumbers.slice(1, 6).map((num, i) => (
                <div key={i} className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-300 text-sm">
                  {num}
                </div>
              ))}
            </div>
          </div>
          
          <button 
            onClick={handleBingoClaim}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 text-white font-black text-lg hover:from-red-500 hover:to-pink-500 transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(225,29,72,0.4)] uppercase tracking-wider cursor-pointer active:scale-95"
          >
            Bingo!
          </button>
        </div>

        {/* Called Numbers Board */}
        <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 backdrop-blur-md shadow-2xl mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-fuchsia-500 animate-pulse"></span>
              Called Numbers Board (1 - 75)
            </h3>
            {calledNumbers.length > 0 && (
              <span className="text-xs font-semibold text-slate-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                Total Called: {calledNumbers.length}
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {['B', 'I', 'N', 'G', 'O'].map((letter, letterIdx) => {
              const start = letterIdx * 15 + 1;
              return (
                <div key={letter} className="bg-slate-950/40 border border-white/5 rounded-2xl p-3 flex flex-row md:flex-col items-center gap-3 md:gap-2">
                  <div className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 w-8 md:w-auto text-center">
                    {letter}
                  </div>
                  <div className="flex-1 flex flex-wrap gap-1.5 w-full justify-start md:grid md:grid-cols-5 md:gap-1.5 md:justify-items-center">
                    {Array.from({ length: 15 }, (_, idx) => {
                      const num = start + idx;
                      const hasBeenCalled = calledNumbers.includes(num);
                      return (
                        <div
                          key={num}
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${
                            hasBeenCalled
                              ? 'bg-fuchsia-600 text-white shadow-[0_0_8px_rgba(192,38,211,0.5)] font-black scale-110'
                              : 'bg-slate-800/40 text-slate-600 border border-white/5'
                          }`}
                        >
                          {num}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {calledNumbers.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">Call Timeline:</span>
              <div className="flex gap-2 overflow-x-auto pb-1 flex-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {calledNumbers.map((num, i) => (
                  <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    i === 0 
                      ? 'bg-gradient-to-tr from-fuchsia-500 to-indigo-500 text-white font-black animate-pulse shadow-[0_0_10px_rgba(192,38,211,0.4)]' 
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    {getLetterForNumber(num)}{num}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
            Your Cartelas ({cartelas.length}/4)
          </h2>
          {cartelas.length < 4 && (
            <button 
              onClick={addCartela}
              className="px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-white font-semibold transition-all flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Add Cartela (ꓭ {room.entryFee})
            </button>
          )}
        </div>

        {/* Grid of Cartelas */}
        <div className="relative grid grid-cols-1 xl:grid-cols-2 gap-8 flex-1 min-h-[350px]">
          {!gameStarted && (
            <div className="absolute inset-0 z-20 rounded-3xl bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center text-center p-6 border border-white/10 animate-in fade-in duration-300">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-fuchsia-500 to-indigo-500 p-1 animate-bounce mb-6 shadow-[0_0_30px_rgba(192,38,211,0.5)]">
                <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
                  <span className="text-3xl font-black text-white font-mono">{startCountdown}</span>
                </div>
              </div>
              <h3 className="text-2xl font-black text-white mb-2">Game is Starting!</h3>
              <p className="text-slate-400 text-sm max-w-xs">
                Prepare your cartelas. The first bingo ball will be called in {startCountdown} seconds...
              </p>
            </div>
          )}

          {cartelas.map((cartela) => (
            <div key={cartela.id} className="relative bg-slate-900/80 border border-white/10 rounded-2xl p-4 sm:p-6 backdrop-blur-xl shadow-2xl">
              {cartelas.length > 1 && !gameStarted && (
                <button 
                  onClick={() => removeCartela(cartela.id)}
                  className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-red-400 transition-colors z-10"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              )}
              
              <div className="grid grid-cols-5 gap-1 sm:gap-2 text-center mb-2">
                {['B', 'I', 'N', 'G', 'O'].map((letter, i) => (
                  <div key={i} className="text-xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 py-2">
                    {letter}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-5 gap-1 sm:gap-2">
                {Array.from({ length: 5 }).map((_, rowIndex) => (
                  cartela.card.map((col, colIndex) => {
                    const number = col.numbers[rowIndex];
                    const isDaubed = daubedNumbers.has(number);
                    const isFree = number === 'FREE';

                    return (
                      <button
                        key={`${colIndex}-${rowIndex}`}
                        onClick={() => toggleDaub(number)}
                        disabled={!gameStarted}
                        className={`aspect-square w-full rounded-lg sm:rounded-xl text-lg sm:text-2xl font-bold flex items-center justify-center transition-all duration-200 border 
                          ${isDaubed 
                            ? 'bg-fuchsia-600 border-fuchsia-400 text-white shadow-[inset_0_0_20px_rgba(255,255,255,0.4),0_0_15px_rgba(192,38,211,0.6)] transform scale-[0.98]' 
                            : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
                          } 
                          ${isFree && !isDaubed ? 'text-sm sm:text-xl text-fuchsia-300' : ''}
                          disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {number}
                      </button>
                    );
                  })
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating False Bingo Message */}
      {falseBingoMessage && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 bg-red-600/90 border border-red-500 text-white px-6 py-3 rounded-2xl shadow-xl backdrop-blur-sm animate-in slide-in-from-top-4 duration-300 font-bold flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          {falseBingoMessage}
        </div>
      )}

      {/* Bingo Win Modal */}
      {showWinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md transition-opacity duration-300">
          <div className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl p-8 shadow-[0_20px_60px_rgba(192,38,211,0.3)] text-center overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Confetti or Sparkle Decor */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-fuchsia-600/30 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-indigo-600/30 rounded-full blur-2xl animate-pulse"></div>

            {/* Success Crown Icon */}
            <div className="w-20 h-20 rounded-full bg-yellow-500/10 border-2 border-yellow-500 text-yellow-400 flex items-center justify-center mb-6 mx-auto animate-bounce">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14a1 1 0 0 0 1-1v-1H4v1a1 1 0 0 0 1 1z"/></svg>
            </div>

            <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-fuchsia-400 to-indigo-400 mb-2">BINGO! WINNER!</h2>
            <p className="text-slate-300 text-sm mb-6 leading-relaxed">
              Congratulations! Your cartela has achieved a winning line pattern.
            </p>

            <div className="bg-slate-950/50 border border-white/5 rounded-2xl p-4 mb-6">
              <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Your Prize Winnings</div>
              <div className="text-3xl font-black text-yellow-400 flex items-center justify-center gap-2">
                <span>ꓭ</span>
                {winPrize.toLocaleString()}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Link
                href="/lobby"
                className="w-full py-3.5 bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all shadow-[0_4px_15px_rgba(192,38,211,0.3)] active:scale-98 text-center text-sm cursor-pointer"
              >
                Back to Lobby
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
