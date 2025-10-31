'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import {
  Environment,
  SpotLight,
  OrbitControls,
  Stats,
  PerspectiveCamera,
} from '@react-three/drei';
import { easing } from 'maath';
import DiamondModel from './3d-diamond';
import { useTheme } from 'next-themes';
import { darkBackground, lightBackground } from '@/lib/const';
import { useControls } from 'leva';

// function CameraParallax() {
//   useFrame((state, delta) => {
//     const { pointer, camera } = state;
//     const factor = 0.05;
//     easing.dampE(
//       camera.rotation,
//       [pointer.y * factor, -pointer.x * factor, 0],
//       0.25,
//       delta
//     );
//   });
//   return null;
// }

export default function Scene() {
  const { resolvedTheme } = useTheme();

  const spotLightProps = useControls('SpotLight', {
    // --- Controles que você pediu ---
    distance: { value: 5.0, min: 0, max: 20 },
    angle: { value: 0.15, min: 0, max: Math.PI / 4 }, // Ângulo em radianos
    attenuation: { value: 5.0, min: 0, max: 10 },
    anglePower: { value: 5.0, min: 0, max: 20 },

    // --- Controles extras (altamente recomendados) ---
    color: '#ffffff',
    intensity: { value: 10.0, min: 0, max: 100 },
    position: [0, 5, 0], // Posição [x, y, z]
    penumbra: { value: 0.5, min: 0, max: 1 }, // Suavidade da borda
  });

  // 2. --- Novos Controles da Câmera ---
  const cameraProps = useControls('Camera', {
    position: {
      value: [0, 0, 8], // Posição inicial [x, y, z]
      step: 0.1,
    },
    fov: {
      value: 50, // Field of View (zoom)
      min: 10,
      max: 120,
    },
  });

  return (
    <Canvas>
      <Stats />
      <SpotLight {...spotLightProps} castShadow />
      {resolvedTheme === 'dark' ? (
        <color attach='background' args={[darkBackground]} />
      ) : (
        <color attach='background' args={[lightBackground]} />
      )}
      {/* <OrbitControls /> */}
      {/* <CameraParallax /> */}
      <PerspectiveCamera
        makeDefault // Diz ao R3F para usar esta como a câmera principal
        position={cameraProps.position}
        fov={cameraProps.fov}
      />
      <directionalLight intensity={3} position={[0, 3, 2]} />
      <Environment
        backgroundBlurriness={0.9}
        environmentIntensity={0.3}
        files='/hdr/night.hdr'
      />
      <DiamondModel />
    </Canvas>
  );
}
