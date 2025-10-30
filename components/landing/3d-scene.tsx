'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { easing } from 'maath';
import Model from './3d-diamond';
import { useTheme } from 'next-themes';
import { typedThemes } from '@/lib/const';
import { hexToRgb } from '@/lib/utils';

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
    // <div>
    //   <p>{JSON.stringify(resolvedTheme)}</p>
    //   <p>
    //     {JSON.stringify(
    //       hexToRgb(
    //         typedThemes[resolvedTheme ?? 'light']?.['--color-background'] ?? '#000000'
    //       )
    //     )}
    //   </p>
    // </div>
    <Canvas gl={{ preserveDrawingBuffer: true }}>
      {resolvedTheme === 'light' ? (
        <color
          attach='background'
          args={
            hexToRgb(
              typedThemes[resolvedTheme || 'light']?.['--color-background'] ??
                '#ffffff'
            ) || [255, 255, 255]
          }
        />
      ) : (
        <color
          attach='background'
          args={
            hexToRgb(
              typedThemes[resolvedTheme || 'dark']?.['--color-background'] ??
                '#000000'
            ) || [0, 0, 0]
          }
        />
      )}
      <OrbitControls />
      <CameraParallax />
      <directionalLight intensity={3} position={[0, 3, 2]} />
      <Environment files='/hdr/cloudy.hdr' />
      <Model />
    </Canvas>
  );
}
