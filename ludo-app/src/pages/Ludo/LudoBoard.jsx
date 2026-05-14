import React from "react";
import { useBox } from "@react-three/cannon";
import { BOARD_LAYOUT, colorMap } from "./constants";
import PlayerPiece from "./PlayerPiece";
import DebugPoint from "./DebugPoint";
import Walls from "./Walls";
import BoardField from "./BoardField";
import { PATHS, START_POSITIONS } from "./paths";

const LudoBoard = ({ isAnimating, setIsAnimating, players, Figur }) => {
  // Board (Spielfläche)
  const [boardRef] = useBox(() => ({
    mass: 0,
    position: [0, -0.05, 0],
    args: [12, 0.1, 12],
    type: "Static",
  }));

  // Beispiel für animierte Bewegungen (dummy animationPath):
  const getAnimationPath = (playerKey, piecePosition) => {
    const playerPath = PATHS[playerKey];
    const startIdx = piecePosition - 1;
    const endIdx = startIdx + 5; // Beispiel: bewege 5 Felder
    return playerPath.slice(startIdx, endIdx);
  };

  return (
    <group>
      {/* Das sichtbare Board */}
      <mesh position={[0, -0.05, 0]} ref={boardRef} receiveShadow>
        <boxGeometry args={[12, 0.1, 12]} />
        <meshStandardMaterial color="#D7CCC8" />
      </mesh>

      {/* Spielfelder */}
      <BoardField BOARD_LAYOUT={BOARD_LAYOUT} colorMap={colorMap} />

      {/* Wände */}
      <Walls />

      {/* Spielfiguren */}
      {Object.keys(players).map((playerKey) =>
        players[playerKey].pieces.map((piecePosition, index) => {
          const animationPath =
            piecePosition > 0
              ? getAnimationPath(playerKey, piecePosition) // Animationspfad für Spielfeldposition
              : null; // Keine Animation für Basisfiguren

          return (
            <PlayerPiece
              key={`${playerKey}-${index}`}
              position={
                piecePosition > 0
                  ? PATHS[playerKey][piecePosition - 1] // Figur auf dem Spielfeld
                  : START_POSITIONS[playerKey][index] // Figur in der Basis
              }
              modelPath={Figur}
              color={players[playerKey].color}
              animationPath={animationPath} // Animationspfad übergeben
              onAnimationComplete={() =>
                console.log(
                  `Animation complete for player ${playerKey}, piece ${index}`
                )
              }
            />
          );
        })
      )}
    </group>
  );
};

export default LudoBoard;
