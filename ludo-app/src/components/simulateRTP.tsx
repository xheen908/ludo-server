// ../components/simulateRTP.tsx
export const simulateRTP = (spins: number = 10000, symbolPool: string[], winLines: number[][], highValueSymbols: string[], mediumValueSymbols: string[], lowValueSymbols: string[]) => {
    const totalBetPerSpin = 0.1; // Einsatz pro Spin
    let totalBet = 0;
    let totalWin = 0;
  
    for (let i = 0; i < spins; i++) {
      totalBet += totalBetPerSpin;
  
      // Simuliere eine Slot-Drehung
      const results = Array(15)
        .fill("")
        .map(() => symbolPool[Math.floor(Math.random() * symbolPool.length)]);
  
      let spinWinnings = 0;
  
      winLines.forEach((line) => {
        if (line.every((index) => results[index] === results[line[0]])) {
          const symbol = results[line[0]];
          if (highValueSymbols.includes(symbol)) {
            spinWinnings += totalBetPerSpin * 3 * 100; // Beispiel Multiplikator
          } else if (mediumValueSymbols.includes(symbol)) {
            spinWinnings += totalBetPerSpin * 3 * 4;
          } else if (lowValueSymbols.includes(symbol)) {
            spinWinnings += totalBetPerSpin * 3 * 2.5;
          }
        }
      });
  
      totalWin += spinWinnings;
    }
  
    const rtp = (totalWin / totalBet) * 100;
    console.log(`Simulierte RTP über ${spins} Spins: ${rtp.toFixed(2)}%`);
    return rtp;
  };
  