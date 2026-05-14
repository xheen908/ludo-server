// ludogame/gameLogic.js

const { PATHS, END_SLOTS } = require('./paths');

// Initial Game State
function initialGameState(mode) {
  return mode === 2
    ? {
        players: {
          red: { pieces: [0, 0, 0, 0], color: "#FF7043", socketId: null },
          blue: { pieces: [0, 0, 0, 0], color: "#5C6BC0", socketId: null },
        },
        currentPlayer: "red",
        dice: null,
        message: "Red starts the 2-player game!",
        gameOver: false,
      }
    : {
        players: {
          red: { pieces: [0, 0, 0, 0], color: "#FF7043", socketId: null },
          blue: { pieces: [0, 0, 0, 0], color: "#5C6BC0", socketId: null },
          green: { pieces: [0, 0, 0, 0], color: "#81C784", socketId: null },
          yellow: { pieces: [0, 0, 0, 0], color: "#FFEB3B", socketId: null },
        },
        currentPlayer: "red",
        dice: null,
        message: "Red starts the 4-player game!",
        gameOver: false,
      };
}

// Bestimmt die Farbe des Spielers basierend auf seiner socketId
function getPlayerColorBySocket(room, socketId) {
  for (const color in room.gameState.players) {
    if (room.gameState.players[color].socketId === socketId) {
      return color;
    }
  }
  return null;
}

// Ermittelt mögliche Bewegungen basierend auf dem Wurf
function getPossibleMoves(room, playerColor, roll) {
  const player = room.gameState.players[playerColor];
  const possibleMoves = [];

  player.pieces.forEach((position, index) => {
    // 1) Ermittle theoretische neue Position
    let newPos;
    if (position === 0 && roll === 6) {
      newPos = 1;
    } else if (position > 0 && position + roll <= PATHS[playerColor].length) {
      newPos = position + roll;
    } else {
      // Dieser Stein kann sich nicht bewegen
      return;
    }
    
    // 2) Check: Ist diese neue Position schon von einer eigenen Figur besetzt?
    // Nur prüfen, wenn newPos > 0 (Figur also auf dem Spielfeld)
    if (newPos > 0) {
      const isOccupiedByOwn = player.pieces.some(
        (pos, idx) => idx !== index && pos === newPos
      );
      if (isOccupiedByOwn) {
        // Dann ist dieser Zug gar nicht möglich
        return;
      }
    }

    // 3) Wenn wir hier sind, ist es tatsächlich ein gültiger Move
    possibleMoves.push(index);
  });

  return possibleMoves;
}


// Hilfsfunktion: Prüft, ob Zielkoordinaten mit gegnerischer Figur übereinstimmen
function doesPosMatchOpponent(gameState, playerColor, targetCoords) {
  for (const color in gameState.players) {
    if (color !== playerColor) {
      const opponent = gameState.players[color];
      const matches = opponent.pieces.some((opponentPos) => {
        if (opponentPos <= 0) return false;
        const oppCoords = PATHS[color][opponentPos - 1];
        return JSON.stringify(oppCoords) === JSON.stringify(targetCoords);
      });
      if (matches) return true;
    }
  }
  return false;
}

// Hilfsfunktion: Prüft, ob der Zug einer Figur mit gegebenem Würfelwurf zu einem Schlagen führt
function checkMoveKicks(gameState, playerColor, pieceIndex, roll) {
  const player = gameState.players[playerColor];
  const position = player.pieces[pieceIndex];
  
  let newPos;
  if (position === 0 && roll === 6) {
    newPos = 1;
  } else if (position > 0 && position + roll <= PATHS[playerColor].length) {
    newPos = position + roll;
  } else {
    return false;
  }

  const targetCoords = PATHS[playerColor][newPos - 1];
  return doesPosMatchOpponent(gameState, playerColor, targetCoords);
}

// Bewegt eine spezifische Figur und handhabt Kollisionen
// Bewegt eine spezifische Figur und handhabt Kollisionen
function movePiece(room, gameState, playerColor, pieceIndex, roll) {
  const player = gameState.players[playerColor];
  let newPosition = player.pieces[pieceIndex] + roll;

  // Figur aus der Basis bewegen (wenn Position == 0 und Wurf == 6)
  if (player.pieces[pieceIndex] === 0 && roll === 6) {
    newPosition = 1;
  }

  // Überprüfen, ob die neue Position gültig ist
  if (newPosition > PATHS[playerColor].length) {
    console.log(
      `Ungültiger Zug: newPosition (${newPosition}) > PATHS[playerColor].length (${PATHS[playerColor].length})`
    );
    return {
      success: false,
      message: "Ungültiger Zug: Position außerhalb des Pfades.",
    };
  }

  // **NEU**: Überprüfen, ob auf der neuen Position bereits eine eigene Figur steht
  // (nur relevant, wenn die Figur nicht mehr in der Basis steht, also > 0)
  if (newPosition > 0) {
    const positionAlreadyOccupiedByOwn =
      player.pieces.some((pos, idx) => idx !== pieceIndex && pos === newPosition);

    if (positionAlreadyOccupiedByOwn) {
      console.log(`Ungültiger Zug: Feld bereits von eigener Figur belegt.`);
      return {
        success: false,
        message: "Ungültiger Zug: Feld bereits von eigener Figur belegt.",
      };
    }
  }

  // Überprüfen auf Kollisionen mit Gegnerfiguren
  const targetCoords = PATHS[playerColor][newPosition - 1];
  for (const color in gameState.players) {
    if (color !== playerColor) {
      const opponent = gameState.players[color];
      opponent.pieces.forEach((opponentPos, idx) => {
        if (
          opponentPos > 0 &&
          JSON.stringify(PATHS[color][opponentPos - 1]) === JSON.stringify(targetCoords)
        ) {
          // Kollision! Gegnerische Figur zurück zur Basis
          gameState.players[color].pieces[idx] = 0;
          gameState.kickedEvent = {
            kicker: playerColor,
            victim: color,
            id: Date.now().toString() + Math.random().toString()
          };
          gameState.message += ` ${playerColor} hat ${color}'s Figur geschlagen!`;
          console.log(
            `Kollision: ${playerColor} hat ${color}'s Figur ${idx} geschlagen und zurück zur Basis gesetzt.`
          );
        }
      });
    }
  }

  // Aktualisiere die Position der eigenen Figur
  gameState.players[playerColor].pieces[pieceIndex] = newPosition;
  gameState.message += ` ${playerColor} bewegt Figur ${pieceIndex + 1} auf Position ${newPosition}.`;
  console.log(`${playerColor} bewegt Figur ${pieceIndex + 1} auf Position ${newPosition}.`);

  return { success: true };
}


// Wechselt zum nächsten Spieler
function switchPlayer(gameState, room) {
  const playerColors = Object.keys(room.gameState.players).filter(color => room.gameState.players[color].socketId);
  const currentIndex = playerColors.indexOf(gameState.currentPlayer);
  const nextIndex = (currentIndex + 1) % playerColors.length;
  gameState.currentPlayer = playerColors[nextIndex];
  gameState.message += ` Es ist jetzt ${gameState.currentPlayer}'s Zug.`;
  
  // Reset dice and possible moves for the next turn
  gameState.dice = null;
  gameState.possibleMoves = [];
  
  console.log(`Wechsel zu Spieler: ${gameState.currentPlayer} (Würfel zurückgesetzt)`);
}

// Überprüft, ob ein Spieler gewonnen hat
function checkWinner(room, playerColor) {
  const player = room.gameState.players[playerColor];
  return player.pieces.every(piece => {
    if (piece <= 0) return false;
    const coords = PATHS[playerColor][piece - 1];
    return END_SLOTS[playerColor].some(slot => JSON.stringify(slot) === JSON.stringify(coords));
  })
    ? playerColor
    : null;
}

// Verarbeitet einen Spielzug
function applyMove(gameState, moveData, roomId, socketId, rooms) {
  const newState = { ...gameState };
  const room = rooms[roomId];
  if (!room) return { ...newState, error: "Raum nicht gefunden." };

  const playerColor = getPlayerColorBySocket(room, socketId);
  if (!playerColor) return { ...newState, error: "Spieler nicht im Raum." };

  switch (moveData.type) {
    case "ROLL_DICE":
      if (newState.currentPlayer !== playerColor) {
        return { ...newState, error: "Es ist nicht dein Zug!" };
      }
      const roll = Math.floor(Math.random() * 6) + 1;
      newState.dice = roll;
      newState.rollId = Date.now().toString() + '-' + Math.random().toString(36).substring(2, 9);
      newState.message = `${newState.currentPlayer} hat eine ${roll} gewürfelt!`;
      console.log(`${newState.currentPlayer} hat eine ${roll} gewürfelt.`);

      // Bestimme mögliche Bewegungen basierend auf dem Würfelergebnis
      const possibleMoves = getPossibleMoves(room, playerColor, roll);
      newState.possibleMoves = possibleMoves;

      break;

      case "MOVE_PIECE":
        if (newState.currentPlayer !== playerColor) {
          return { ...newState, error: "Es ist nicht dein Zug!" };
        }
      
        const { pieceIndex } = moveData;
        
        // STRAFE-CHECK ("Pusten"):
        // Finde alle Figuren aus possibleMoves, die zu einem Schlagen geführt HÄTTEN
        const kickingPieceIndices = (gameState.possibleMoves || []).filter(idx => 
          checkMoveKicks(gameState, playerColor, idx, gameState.dice)
        );

        const couldHaveKicked = kickingPieceIndices.length > 0;
        const choseToKick = kickingPieceIndices.includes(pieceIndex);

        // Führe den eigentlichen Zug des Spielers aus
        const moveResult = movePiece(room, newState, playerColor, pieceIndex, newState.dice);
      
        if (!moveResult.success) {
          return { ...newState, error: moveResult.message };
        }

        // Bestrafung: Wenn er hätte schlagen MÜSSEN, aber stattdessen eine andere Figur bewegt hat!
        if (couldHaveKicked && !choseToKick) {
          kickingPieceIndices.forEach(kickingIdx => {
            // Bestrafe die Figur, die hätte schlagen können, und schicke sie zurück in die Basis!
            newState.players[playerColor].pieces[kickingIdx] = 0;
            console.log(`🔥 PUSTEN: ${playerColor}'s Figur ${kickingIdx + 1} wurde gepustet (Zurück zur Basis)!`);
          });
          
          // Setze eine prominente Strafnachricht vor die Standardnachricht
          newState.message = `Strafe! ⚠️ Du hast nicht geschlagen - deine Figur${kickingPieceIndices.length > 1 ? 'en wurden' : ' wurde'} gepustet! ` + newState.message;
        }
      
        // Sieger-Check
        const winner = checkWinner(room, playerColor);
        if (winner) {
          newState.message = `${winner} hat das Spiel gewonnen!`;
          newState.winner = winner;
          newState.gameOver = true;
        } else {
          // Spieler wechseln oder nochmal der gleiche bei einer 6
          if (newState.dice !== 6) {
            switchPlayer(newState, room);
          } else {
            newState.message += ` ${newState.currentPlayer} darf erneut würfeln!`;
          }
        }
      
        // **Würfel zurücksetzen**, damit der nächste Zug nicht den alten Wert sieht
        newState.dice = null;
        newState.possibleMoves = [];
        break;
      

    default:
      newState.error = "Unbekannter Zugtyp.";
      console.log("Unbekannter Zugtyp:", moveData.type);
  }

  // Aktualisiere den Raum mit dem neuen Spielzustand
  rooms[roomId].gameState = newState;
  return newState;
}

module.exports = {
  initialGameState,
  applyMove,
  switchPlayer,
};
