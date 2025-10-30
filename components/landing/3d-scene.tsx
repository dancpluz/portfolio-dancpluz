'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { easing } from 'maath';
import Model from './3d-diamond';
import { useTheme } from 'next-themes';
import { darkBackground, lightBackground } from '@/lib/const';

function CameraParallax() {
  useFrame((state, delta) => {
    const { pointer, camera } = state;
    const factor = 0.05;
    easing.dampE(
      camera.rotation,
      [pointer.y * factor, -pointer.x * factor, 0],
      0.25,
      delta
    );
  });
  return null;
}

export default function Scene() {
  const { resolvedTheme } = useTheme();

  return (
    <Canvas>
      {resolvedTheme === 'dark' ? (
        <color attach='background' args={[darkBackground]} />
      ) : (
        <color attach='background' args={[lightBackground]} />
      )}
      <OrbitControls />
      <CameraParallax />
      <directionalLight intensity={3} position={[0, 3, 2]} />
      <Environment files='/hdr/cloudy.hdr' />
      <Model />
    </Canvas>
  );
}
