import React from "react";
import { useBox } from "@react-three/cannon";

const Walls = () => {
  const walls = [
    { position: [0, 2.5, -6], args: [12, 5, 0.1] }, // Vorderwand
    { position: [0, 2.5, 6], args: [12, 5, 0.1] },  // Hinterwand
    { position: [-6, 2.5, 0], args: [0.1, 5, 12] }, // Linke Wand
    { position: [6, 2.5, 0], args: [0.1, 5, 12] },  // Rechte Wand
  ];

  return (
    <>
      {walls.map((wall, index) => {
        const [ref] = useBox(() => ({
          position: wall.position,
          args: wall.args,
          type: "Static",
        }));

        return (
          <mesh key={index} ref={ref}>
            <boxGeometry args={wall.args} />
			<meshStandardMaterial color="red" wireframe />
    //      <meshStandardMaterial visible={false} />
          </mesh>
        );
      })}
    </>
  );
};

export default Walls;