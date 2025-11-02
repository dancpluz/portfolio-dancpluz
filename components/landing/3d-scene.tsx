'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import {
  Environment,
  SpotLight,
  OrbitControls,
  Stats,
  PerspectiveCamera,
  ScrollControls,
  Scroll,
} from '@react-three/drei';
import { easing } from 'maath';
import DiamondModel from './3d-diamond';
import { useTheme } from 'next-themes';
import { darkBackground, lightBackground } from '@/lib/const';
import { useControls } from 'leva';
import { motion } from 'motion/react';

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

  const totalScrollPages = 2.2;

  return (
    <Canvas
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100%',
        width: '100%',
      }}
      shadows
      camera={{ position: [0, 0, 8], fov: 50 }}
    >
      <ScrollControls pages={totalScrollPages} damping={0.5}>
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
        <Scroll html style={{ width: '100%' }}>
          {/* --- Seção 1 (Página 1) --- */}
          <div style={{ height: '100vh', padding: '20px' }}>
            <h1 style={{ color: resolvedTheme === 'dark' ? 'white' : 'black' }}>
              Role para baixo
            </h1>
          </div>

          {/* --- Seção 2 (Página 2) --- */}
          {/* 'top: '100vh'' posiciona esta seção na segunda página */}
          <div
            style={{
              height: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              padding: '20px',
            }}
          >
            <motion.h1
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              style={{
                fontSize: '4rem',
                color: resolvedTheme === 'dark' ? 'white' : 'black',
                marginLeft: '10%',
              }}
            >
              Esta é a Seção 2
            </motion.h1>
          </div>
          <div style={{ height: '100vh', padding: '20px' }}>
            <h1 style={{ color: resolvedTheme === 'dark' ? 'white' : 'black' }}>
              Seção Final
            </h1>
          </div>
        </Scroll>
      </ScrollControls>
    </Canvas>
  );
}
