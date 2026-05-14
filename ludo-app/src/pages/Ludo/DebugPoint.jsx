import React from "react";

const DebugPoint = ({ position, color }) => {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.1, 32, 32]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

export default DebugPoint;
