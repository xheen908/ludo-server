// LudoLogic.tsx
import { useState } from "react";
import { PATHS, END_SLOTS, START_POSITIONS } from "./paths";

// Typdefinitionen
interface Player {
  pieces: number[];
  color: string;
}

interface Players {
  [key: string]: Player;
}

const initialPlayers: Players = {
  red: {
    pieces: [0, 0, 0, 0], // Alle vier Steine starten in der Basis (Wert 0)
    color: "#FF7043",
  },
  blue: {
    pieces: [0, 0, 0, 0],
    color: "#5C6BC0",
  },
  green: {
    pieces: [0, 0, 0, 0],
    color: "#81C784",
  },
  yellow: {
    pieces: [0, 0, 0, 0],
    color: "#FFEB3B",
  },
};

const LudoLogic = () => {
  const [players, setPlayers] = useState<Players>(initialPlayers); // Spieler und deren Steine
  const [currentPlayer, setCurrentPlayer] = useState<string>("red"); // Aktueller Spieler
  const [message, setMessage] = useState<string>("Red starts the game!"); // Nachricht anzeigen
  const [dice, setDice] = useState<number | null>(null); // Würfelergebnis
  const [isAnimating, setIsAnimating] = useState<boolean>(false); // Animation aktivieren

  // Funktion zum Würfeln
  const rollDice = () => {
    const roll = Math.floor(Math.random() * 6) + 1; // Zufallszahl zwischen 1 und 6
    setDice(roll); // Setze das Würfelergebnis
    console.log(`${currentPlayer} rolled a ${roll}`);
    handleDiceRoll(roll);
  };

  // Funktion zum Verarbeiten des Würfelergebnisses
  const handleDiceRoll = (roll: number) => {
    const currentPlayerData = players[currentPlayer];

    // Versuche, eine Figur zu bewegen
    const moved = movePiece(currentPlayerData, roll);

    // Wenn keine 6 gewürfelt wurde oder kein Stein bewegt wurde, wechsle den Spieler
    if (roll !== 6 || !moved) {
      switchPlayer();
    } else {
      setMessage(`${currentPlayer} rolled a 6! You get another turn.`);
    }

    // Überprüfe, ob der aktuelle Spieler gewonnen hat
    const winnerMessage = checkWinner();
    if (winnerMessage) {
      setMessage(winnerMessage);
    }
  };

  // Funktion um einen Stein zu bewegen
  const movePiece = (player: Player, roll: number): boolean => {
    let newPieces = [...player.pieces];
    let moved = false;
    let targetPosition: any;

    console.log(`Move pieces for ${currentPlayer}: `, newPieces);

    // Hol den Pfad für den aktuellen Spieler
    const playerPath = PATHS[currentPlayer];

    for (let i = 0; i < 4; i++) {
      const piecePosition = newPieces[i];

      if (piecePosition === 0 && roll === 6) {
        // Stein aus der Basis auf den Startpunkt setzen
        newPieces[i] = 1;
        moved = true;
        targetPosition = playerPath[newPieces[i] - 1]; // Zielposition auf dem Pfad
        console.log(`${currentPlayer} moves a piece from base to start.`);
        break;
      } else if (piecePosition > 0 && piecePosition + roll <= playerPath.length) {
        // Stein entlang des Pfades bewegen
        newPieces[i] += roll;
        moved = true;
        targetPosition = playerPath[newPieces[i] - 1]; // Zielposition auf dem Pfad
        console.log(
          `${currentPlayer} moves piece ${i} to position ${newPieces[i]} on path.`
        );
        break;
      }
    }

    if (moved) {
      // Prüfen, ob das Ziel-Feld von einer anderen Figur besetzt ist
      Object.keys(players).forEach((otherPlayerKey) => {
        if (otherPlayerKey !== currentPlayer) {
          const otherPlayer = players[otherPlayerKey];
          otherPlayer.pieces.forEach((otherPiecePosition, index) => {
            const otherPieceCoords =
              PATHS[otherPlayerKey][otherPiecePosition - 1]; // Koordinaten der gegnerischen Figur
            if (
              otherPiecePosition > 0 && // Nur Figuren auf dem Feld prüfen
              JSON.stringify(otherPieceCoords) === JSON.stringify(targetPosition)
            ) {
              console.log(
                `Collision! ${otherPlayerKey}'s piece ${index} is sent back to base.`
              );
              // Setze die Figur des anderen Spielers zurück auf die Basis
              otherPlayer.pieces[index] = 0;
            }
          });
        }
      });

      // Aktualisiere den Zustand der Spieler
      setPlayers((prevState) => ({
        ...prevState,
        [currentPlayer]: {
          ...player,
          pieces: newPieces,
        },
      }));
    } else {
      setMessage(`${currentPlayer} can't move a piece.`);
      console.log(`${currentPlayer} cannot move any piece.`);
    }

    return moved;
  };

  // Funktion zum Wechseln des Spielers
  const switchPlayer = () => {
    const nextPlayer =
      currentPlayer === "red"
        ? "blue"
        : currentPlayer === "blue"
        ? "green"
        : currentPlayer === "green"
        ? "yellow"
        : "red";
    setCurrentPlayer(nextPlayer);
    setMessage(`${nextPlayer}'s turn!`);
    console.log(`Switching to player: ${nextPlayer}`);
  };

  // Überprüfe, ob ein Spieler gewonnen hat
  const checkWinner = (): string | null => {
    const playerEndSlots = END_SLOTS[currentPlayer];

    for (let playerKey in players) {
      const player = players[playerKey];

      // Überprüfe, ob alle Figuren in den End-Slots sind
      if (
        player.pieces.every(
          (pieceIndex) =>
            pieceIndex > 0 && playerEndSlots.includes(PATHS[playerKey][pieceIndex - 1])
        )
      ) {
        console.log(`${playerKey} wins the game!`);
        return `${playerKey} wins the game!`;
      }
    }

    return null;
  };

  return {
    players,
    currentPlayer,
    message,
    dice,
    rollDice,
    isAnimating,
    setIsAnimating,
    setMessage, // Hinzugefügt
    setPlayers, // Hinzugefügt
    setCurrentPlayer, // Hinzugefügt
    setDice, // Hinzugefügt
    checkWinner,
  };
};

export default LudoLogic;
