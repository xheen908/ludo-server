import React, { useRef, useEffect, useState } from "react";
import { useBox } from "@react-three/cannon";
import { useLoader } from "@react-three/fiber";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";

const PhysicalDice = ({ position, outlayPath, inlayPath, onRoll }) => {
  const [ref, api] = useBox(() => ({
    mass: 2,
    position: position || [0, 0, 0],
    rotation: [
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI,
    ],
    args: [0.5, 0.5, 0.5],
  }));

  const outlayGeometry = useLoader(STLLoader, outlayPath);
  const inlayGeometry = useLoader(STLLoader, inlayPath);

  const [diceResult, setDiceResult] = useState(null);

  const sides = {
    top: 4,
    bottom: 3,
    right: 5,
    front: 6,
    left: 2,
    back: 1,
  };

  useEffect(() => {
    outlayGeometry.center();
    inlayGeometry.center();
  }, [outlayGeometry, inlayGeometry]);

  const determineDiceSide = () => {
    const rotation = ref.current.rotation;

    console.log("Final Rotation (Stabil):", rotation);

    let result = null;

    if (Math.abs(rotation.x) > Math.abs(rotation.y) && Math.abs(rotation.x) > Math.abs(rotation.z)) {
      result = rotation.x > 0 ? sides.top : sides.bottom;
    } else if (Math.abs(rotation.y) > Math.abs(rotation.x) && Math.abs(rotation.y) > Math.abs(rotation.z)) {
      result = rotation.y > 0 ? sides.front : sides.back;
    } else {
      result = rotation.z > 0 ? sides.right : sides.left;
    }

    console.log(`Dice landed on side: ${result}`);
    setDiceResult(result);
    onRoll(result);
  };

  const rollDice = () => {
    const forceX = Math.random() * 10 - 5;
    const forceY = Math.random() * 5 + 5;
    const forceZ = Math.random() * 10 - 5;

    api.velocity.set(forceX, forceY, forceZ);

    const spinX = (Math.random() * 10 - 5) * 5;
    const spinY = (Math.random() * 10 - 5) * 5;
    const spinZ = (Math.random() * 10 - 5) * 5;

    api.angularVelocity.set(spinX, spinY, spinZ);

    setTimeout(() => {
      const rollResult = determineDiceSide();
      onRoll(rollResult);
    }, 4000);
  };

  return (
    <group ref={ref} onClick={rollDice}>
      <mesh geometry={outlayGeometry} scale={[0.015, 0.015, 0.015]} castShadow>
        <meshStandardMaterial color="#F5F5F5" />
      </mesh>
      <mesh geometry={inlayGeometry} scale={[0.015, 0.015, 0.015]} castShadow>
        <meshStandardMaterial color="black" />
      </mesh>
    </group>
  );
};

export default PhysicalDice;
