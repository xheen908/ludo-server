// simulate-bot.js
// Standalone Bot simulator script using socket.io-client
const { io } = require("socket.io-client");

const BACKEND_URL = "http://localhost:8888";
const socket = io(BACKEND_URL);

const targetRoomId = process.argv[2] || null;

let myColor = null;
let currentRoomId = null;
let waitingForAction = false;

console.log(`\n========================================`);
console.log(`🤖 LUDO AI BOT PLAYER STARTED`);
console.log(`🤖 Target Backend: ${BACKEND_URL}`);
if (targetRoomId) {
  console.log(`🤖 TARGET ROOM ID: ${targetRoomId} (DETACHED MODE)`);
}
console.log(`========================================\n`);

socket.on("connect", () => {
  console.log(`🤖 Bot connected successfully! Connection ID: ${socket.id}`);
  
  if (targetRoomId) {
    console.log(`🤖 Requesting integration into Room: ${targetRoomId}`);
    socket.emit("joinSingleplayerRoom", { roomId: targetRoomId });
  } else {
    console.log("🤖 Entering the 2-player matchmaking queue...");
    socket.emit("joinQueue", 2);
  }
});

socket.on("roomAssigned", (data) => {
  myColor = data.color;
  currentRoomId = data.roomId;
  console.log(`\n🎉 MATCH FOUND!`);
  console.log(`📂 Room ID: ${currentRoomId}`);
  console.log(`🎨 Bot Color: ${myColor.toUpperCase()}`);
  console.log(`========================================\n`);
});

socket.on("gameStarted", (state) => {
  console.log("🚀 The match has officially started! Handshaking state...");
  processTurn(state);
});

socket.on("gameStateUpdate", (state) => {
  processTurn(state);
});

socket.on("playerLeft", (data) => {
  console.log(`\n❌ Opponent left the game (or was disconnected). Closing bot session...`);
  process.exit(0);
});

function processTurn(state) {
  if (state.gameOver) {
    console.log("\n🏁 GAME OVER! Thank you for playing with Ludo-Bot.");
    process.exit(0);
  }

  // Add a visual update log
  const myPieces = state.players[myColor]?.pieces || [];
  const opponentColor = myColor === 'red' ? 'blue' : 'red';
  const opponentPieces = state.players[opponentColor]?.pieces || [];
  
  console.log(`📊 State Update - Bot (${myPieces.join(',')}) vs Opponent (${opponentPieces.join(',')})`);

  if (state.currentPlayer === myColor) {
    if (waitingForAction) return; // Prevent triggering overlapping timer states
    waitingForAction = true;

    console.log(`👉 IT'S BOT'S TURN! (Color: ${myColor.toUpperCase()})`);

    // Situation 1: Action "ROLL_DICE"
    if (state.dice === null) {
      console.log("🎲 Bot is preparing to roll...");
      setTimeout(() => {
        console.log("🎲 Bot rolled the dice!");
        socket.emit("playerMove", {
          roomId: currentRoomId,
          moveData: { type: "ROLL_DICE" }
        });
        waitingForAction = false;
      }, 2000); // 2-second authentic delay
      return;
    }

    // Situation 2: Action "MOVE_PIECE" (If moves available)
    if (state.possibleMoves && state.possibleMoves.length > 0) {
      // AI Decision Strategy:
      // 1. Prioritize moving a piece out of the base (Position 0) if a 6 is rolled
      // 2. Otherwise pick the piece furthest ahead to drive home!
      let chosenIdx = state.possibleMoves[0];
      
      // Check if we have a piece at index 0 (Base) and it's movable
      const movableFromBase = state.possibleMoves.find(idx => myPieces[idx] === 0);
      if (movableFromBase !== undefined) {
        chosenIdx = movableFromBase; // Highly prioritize releasing from base!
      } else {
        // Drive the leading piece forward!
        let maxPos = -1;
        for (const idx of state.possibleMoves) {
          if (myPieces[idx] > maxPos) {
            maxPos = myPieces[idx];
            chosenIdx = idx;
          }
        }
      }

      console.log(`💡 Bot rolled a ${state.dice}. Strategizing move...`);
      setTimeout(() => {
        console.log(`➡️ Bot decided to move Piece #${chosenIdx + 1}`);
        socket.emit("playerMove", {
          roomId: currentRoomId,
          moveData: { type: "MOVE_PIECE", pieceIndex: chosenIdx }
        });
        waitingForAction = false;
      }, 2000); // 2-second authentic delay
    } else {
      console.log("😴 No moves possible. Turn will switch automatically.");
      waitingForAction = false;
    }
  } else {
    waitingForAction = false;
    console.log(`⏳ Waiting for your move... (Current active player: ${state.currentPlayer.toUpperCase()})`);
  }
}

socket.on("disconnect", () => {
  console.log("🔌 Bot session disconnected from server.");
  process.exit(0);
});

socket.on("connect_error", (err) => {
  console.error("❌ Connection failed. Is the server running on port 8888?", err.message);
  process.exit(1);
});
