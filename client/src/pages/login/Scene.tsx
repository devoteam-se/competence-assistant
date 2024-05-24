//https://github.com/jsx-eslint/eslint-plugin-react/issues/3423
/* eslint-disable react/no-unknown-property */

import { ContactShadows, Environment, PresentationControls } from '@react-three/drei';
import { Suspense } from 'react';
import { DevoteamBall } from './DevoteamBall';

type SceneProps = {
  light: boolean;
  small: boolean;
};

export const Scene = ({ light, small }: SceneProps) => {
  return (
    <Suspense fallback={null}>
      <group position={small ? [0, 1, 0] : [0, 0.5, 0]}>
        {light ? (
          <>
            <ambientLight intensity={0.3} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} shadow-mapSize={[512, 512]} castShadow />
          </>
        ) : (
          <>
            <spotLight
              intensity={0.8}
              position={[10, 10, 5]}
              distance={65}
              angle={0.15}
              penumbra={1}
              shadow-mapSize={[512, 512]}
              castShadow
            />
          </>
        )}
        <PresentationControls
          config={{ mass: 2, tension: 500 }}
          snap={{ mass: 4, tension: 1500 }}
          polar={[-Math.PI / 3, Math.PI / 3]}
          azimuth={[-Math.PI / 1.4, Math.PI / 2]}
        >
          <DevoteamBall />
        </PresentationControls>
        <ContactShadows position={[0, -1.5, 0]} opacity={0.35} scale={5} blur={2.5} far={2} />
        <Environment path="/" files="potsdamer_platz_1k.hdr" />
      </group>
    </Suspense>
  );
};
