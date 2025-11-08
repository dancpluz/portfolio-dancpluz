import * as THREE from 'three';
import React, { JSX, useMemo, useRef } from 'react';
import {
  Center,
  MeshTransmissionMaterial,
  useGLTF,
  useScroll,
} from '@react-three/drei';
import { GLTF } from 'three-stdlib';
import { useFrame, useThree } from '@react-three/fiber';
import { useTheme } from 'next-themes';
import { darkForeground, lightForeground, vertexPoints } from '@/lib/const';
import { easing } from 'maath';
import { MathUtils } from 'three';

type GLTFResult = GLTF & {
  nodes: {
    Diamond: THREE.Mesh;
    Diamond_1: THREE.Mesh;
  };
  materials: {
    Diamond: THREE.MeshPhysicalMaterial;
    Test: THREE.MeshStandardMaterial;
  };
};

const glassMaterialProps = {
  transmission: 1.0,
  thickness: 0.5,
  roughness: 0.0,
  chromaticAberration: 0.03,
  color: '#eca400',
};

const diamondMaterialProps = {
  transmission: 1,
  thickness: 0.23,
  roughness: 0.21,
  chromaticAberration: 0.04,
  anisotropicBlur: 0.14,
  distortion: 0.16,
  distortionScale: 0.5,
  temporalDistortion: 0.2,
  // transmissionSampler: true,
  backside: false,
  color: '#2e2e2e',
};

const meshXOffset = 0.05;
const meshYOffset = -0.015;

const MemoizedDiamond = React.memo(function MemoizedDiamond({
  nodes,
  strokeMaterial,
  color,
}: {
  nodes: GLTFResult['nodes'];
  strokeMaterial: JSX.Element;
  color: string;
}) {
  const fillMaterial = useMemo(
    () => <MeshTransmissionMaterial {...diamondMaterialProps} color={color} />,
    [color]
  );

  return (
    <Center>
      <mesh
        name={`DiamondFill`}
        castShadow
        receiveShadow
        geometry={nodes.Diamond_1.geometry}
      >
        {fillMaterial}
        <mesh name='DiamondStroke' geometry={nodes.Diamond.geometry}>
          {strokeMaterial}
        </mesh>
      </mesh>
    </Center>
  );
});

export default function Model(props: JSX.IntrinsicElements['group']) {
  const { viewport } = useThree();
  // const fit = Math.min(viewport.width, viewport.height);
  // const padding = 0.8;

  const { nodes } = useGLTF('/models/diamond.glb') as unknown as GLTFResult;
  const { resolvedTheme } = useTheme();

  const strokeColor =
    resolvedTheme === 'dark' ? darkForeground : lightForeground;

  const fillColor = resolvedTheme === 'dark' ? '#2e2e2e' : '#ffffff';

  const mainStrokeMaterial = useMemo(
    () => (
      <meshStandardMaterial
        color={strokeColor}
        emissive={strokeColor}
        emissiveIntensity={2}
        toneMapped={false}
      />
    ),
    [strokeColor]
  );

  const mainFillMaterial = useMemo(
    () => (
      <MeshTransmissionMaterial {...diamondMaterialProps} color={fillColor} />
    ),
    [fillColor]
  );

  const vertexStrokeMaterial = useMemo(
    () => (
      <meshStandardMaterial
        color={strokeColor}
        emissive={strokeColor}
        emissiveIntensity={1}
        toneMapped={false}
      />
    ),
    [strokeColor]
  );

  const scene = useRef<THREE.Group>(null!);

  const scroll = useScroll();

  useFrame((_, delta) => {
    if (!scene.current) return;

    // --- 1. Rotação Contínua ---
    scene.current.rotation.y += 0.2 * delta;

    // --- 2. Animação de Posição (baseada no scroll) ---

    // // Pega o progresso da "Seção 2" (de 1/3 a 2/3 do scroll)
    // const section2Progress = scroll.range(0, 1 / 3);

    // // Calcula a *posição alvo* de X e Z usando lerp
    // // Isso nos diz onde o diamante *deveria* estar baseado no scroll
    // const targetX = MathUtils.lerp(0, -4, section2Progress);
    // const targetZ = MathUtils.lerp(0, 4, section2Progress);

    // // A posição Y agora é estática (0.5), conforme a posição inicial do grupo.
    // const targetPosition: [number, number, number] = [targetX, 0.5, targetZ];

    // // 3. (NOVO) Use 'damp3' para animar
    // // Em vez de definir a posição instantaneamente, 'damp3' vai
    // // mover 'scene.current.position' em direção a 'targetPosition'
    // // de forma suave, usando 'delta' e 'smoothTime' (0.25s).
    // easing.damp3(
    //   scene.current.position, // O objeto (Vector3) a ser animado
    //   targetPosition, // O array [x, y, z] alvo
    //   0.25, // smoothTime (tempo de suavização)
    //   delta // delta (independência de frame-rate)
    // );
  });

  return (
    <group
      {...props}
      ref={scene}
      scale={6}
      position={[0, 0.5, 0]}
      dispose={null}
      name='Scene'
    >
      <group name='Diamante'>
        <mesh name='DiamondStroke' geometry={nodes.Diamond.geometry}>
          {mainStrokeMaterial}
        </mesh>
        <mesh
          name='DiamondFill'
          castShadow
          receiveShadow
          geometry={nodes.Diamond_1.geometry}
        >
          {mainFillMaterial}
        </mesh>
        {vertexPoints.map((point, index) => {
          const { position, rotation, scale, color } = point;
          const yRotation = Math.atan2(position[0], position[2]) + rotation[1];
          return (
            <group
              key={index}
              name={`Vertex${index + 1}`}
              position={[
                position[0] + meshXOffset * Math.sin(yRotation),
                position[1] + meshYOffset,
                position[2] + meshXOffset * Math.cos(yRotation),
              ]}
              rotation={[rotation[0], yRotation, rotation[2]]}
              scale={scale}
            >
              <MemoizedDiamond
                nodes={nodes}
                strokeMaterial={vertexStrokeMaterial}
                color={color}
              />
            </group>
          );
        })}
      </group>
    </group>
  );
}

useGLTF.preload('/models/diamond.glb');
