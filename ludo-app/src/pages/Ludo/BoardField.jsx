import React from "react";
import { Text } from "@react-three/drei";
import Walls from "./Walls";

const BoardField = ({ BOARD_LAYOUT, colorMap }) => {
    const labels = {
        // Rote Startfelder
        "10-4": { text: "S", rotation: 0 }, // Rot Start
  
        "10-0": { text: "3", rotation: 0 }, // Rot Startslot
        "10-1": { text: "4", rotation: 0 }, // Rot Startslot
        "9-0": { text: "1", rotation: 0 }, // Rot Startslot
        "9-1": { text: "3", rotation: 0 }, // Rot Startslot
  
        "6-5": { text: "1", rotation: 0 }, // rot endslot
        "7-5": { text: "2", rotation: 0 }, // rot endslot
        "8-5": { text: "3", rotation: 0 }, // rot endslot
        "9-5": { text: "4", rotation: 0 }, // rot endslot
  
        // Grüne Startfelder
        "4-0": { text: "S", rotation: -Math.PI / 2 }, // Grün Start
  
        "0-0": { text: "2", rotation: -Math.PI / 2 }, // Grün Startslot
        "0-1": { text: "1", rotation: -Math.PI / 2 }, // Grün Startslot
        "1-0": { text: "4", rotation: -Math.PI / 2 }, // Grün Startslot
        "1-1": { text: "3", rotation: -Math.PI / 2 }, // Grün Startslot
  
        "5-4": { text: "1", rotation: -Math.PI / 2 }, // Grün endslot
        "5-3": { text: "2", rotation: -Math.PI / 2 }, // Grün endslot
        "5-2": { text: "3", rotation: -Math.PI / 2 }, // Grün endslot
        "5-1": { text: "4", rotation: -Math.PI / 2 }, // Grün endslot
        
        // Gelbe Startfelder 
        "6-10": { text: "S", rotation: Math.PI / 2 }, // Gelb Start
  
        "0-9": { text: "4", rotation: Math.PI }, // Blauartslot
        "0-10": { text: "3", rotation: Math.PI }, // Gelb Startslot
        "1-9": { text: "2", rotation: Math.PI }, // Gelb Startslot
        "1-10": { text: "1", rotation: Math.PI }, // Gelb Startslot
  
        "5-6": { text: "1", rotation: Math.PI / 2 }, // Gelb endslot
        "5-7": { text: "2", rotation: Math.PI / 2 }, // Gelb endslot
        "5-8": { text: "3", rotation: Math.PI / 2 }, // Gelb endslot
        "5-9": { text: "4", rotation: Math.PI / 2 }, // Gelb endslot
  
        // Blaue Startfelder
        "0-6": { text: "S", rotation: Math.PI }, // Blau
  
        "10-9": { text: "1", rotation: Math.PI / 2 },
        "10-10": { text: "3", rotation: Math.PI / 2 },
        "9-9": { text: "2", rotation: Math.PI / 2 },
        "9-10": { text: "4", rotation: Math.PI / 2 },
  
        "4-5": { text: "1", rotation: Math.PI }, // Blau endslot
        "3-5": { text: "2", rotation: Math.PI }, // Blau endslot
        "2-5": { text: "3", rotation: Math.PI }, // Blau endslot
        "1-5": { text: "4", rotation: Math.PI }, // Blau endslot
      };

  return (
    <>
      {BOARD_LAYOUT.map((row, rowIndex) =>
        row.map((cellValue, colIndex) => {
          if (cellValue === 0) return null;
          const color = colorMap[cellValue] || "gray";
          const fieldPosition = [colIndex - 5, 0.01, rowIndex - 5];
          const labelKey = `${rowIndex}-${colIndex}`;
          const labelData = labels[labelKey];

          return (
            <group key={labelKey}>
              <mesh position={fieldPosition} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <circleGeometry args={[0.45, 32]} />
                <meshStandardMaterial color={color} />
              </mesh>
              {labelData && (
                <Text
                  position={[fieldPosition[0], 0.05, fieldPosition[2]]}
                  rotation={[-Math.PI / 2, 0, labelData.rotation]}
                  fontSize={0.3}
                  color="black"
                  anchorX="center"
                  anchorY="middle"
                  outlineWidth={0.02}
                  outlineColor="#fef17e"
                >
                  {labelData.text}
                </Text>
              )}
            </group>
          );
        })
      )}
    </>
  );
};

export default BoardField;
