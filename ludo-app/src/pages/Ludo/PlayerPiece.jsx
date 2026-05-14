import React, { useRef } from "react";
import { useLoader, useFrame } from "@react-three/fiber";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";

const PlayerPiece = ({ position, modelPath, color, isAnimating, setIsAnimating }) => {
  const meshRef = useRef();
  const originalGeometry = useLoader(STLLoader, modelPath);
  const geometry = originalGeometry.clone();
  geometry.center();

  useFrame(() => {
    if (isAnimating && meshRef.current) {
      const mesh = meshRef.current;
      const targetPosition = [-1, 0.3, 5]; // Zielposition für die Animation
      const dx = (targetPosition[0] - mesh.position.x) * 0.1;
      const dz = (targetPosition[2] - mesh.position.z) * 0.1;

      mesh.position.x += dx;
      mesh.position.z += dz;
      mesh.position.y = 0.35 + Math.abs(Math.sin(mesh.position.x)) * 2;  // Simuliere eine parabolische Bewegung

      if (Math.abs(mesh.position.x - targetPosition[0]) < 0.1 && Math.abs(mesh.position.z - targetPosition[2]) < 0.1) {
        mesh.position.set(...targetPosition);
        setIsAnimating(false); // Beendet die Animation
      }
    }
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      position={position}
      scale={[0.025, 0.025, 0.025]}
      rotation={[Math.PI / 2, Math.PI, 0]}
      castShadow
      receiveShadow
      frustumCulled={false}
    >
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

export default PlayerPiece;
