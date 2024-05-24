//https://github.com/jsx-eslint/eslint-plugin-react/issues/3423
/* eslint-disable react/no-unknown-property */

import { Decal, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Group } from 'three';

export const DevoteamBall = () => {
  const texture = useTexture('/devoteam_d.png');
  const ref = useRef<Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (!ref.current) return;
    ref.current.rotation.y = Math.sin(t / 4) / 8;
    ref.current.rotation.z = (1 + Math.sin(t / 1.5)) / 20;
    ref.current.position.y = (1 + Math.sin(t / 1.5)) / 7;
  });

  return (
    <group ref={ref} scale={0.6}>
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial color="#f8485e" envMapIntensity={0.8} metalness={0.1} />
        <Decal scale={2} map={texture} position={[0, 0, 0.5]} />
      </mesh>
    </group>
  );
};
