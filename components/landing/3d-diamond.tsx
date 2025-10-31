import * as THREE from 'three';
import React, { JSX, useMemo, useRef } from 'react';
import {
  Center,
  MeshTransmissionMaterial,
  useGLTF,
} from '@react-three/drei';
import { GLTF } from 'three-stdlib';
import { useFrame, useThree } from '@react-three/fiber';
import { useTheme } from 'next-themes';
import { darkForeground, lightForeground } from '@/lib/const';

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

interface VertexPoint {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  label: string;
  color: string;
}

const vertexPoints: VertexPoint[] = [
  {
    position: [-0.499, -0.065, 0.001],
    rotation: [0, 0, 0],
    scale: 0.1,
    label: 'FULLSTACK',
    color: '#f9cc01',
  },
  {
    position: [-0.351, -0.065, 0.35],
    rotation: [0, 0, 0],
    scale: 0.1,
    label: 'FRONTEND',
    color: '#b9b9b9',
  },
  {
    position: [0.001, -0.065, 0.499],
    rotation: [0, 0, 0],
    scale: 0.1,
    label: 'BACKEND',
    color: '#0201f7',
  },
  {
    position: [0.35, -0.065, 0.351],
    rotation: [0, 0, 0],
    scale: 0.1,
    label: 'DEVOPS',
    color: '#24d400',
  },
  {
    position: [0.499, -0.065, -0.001],
    rotation: [0, 0, 0],
    scale: 0.1,
    label: 'DESIGN',
    color: '#fa00ec',
  },
  {
    position: [0.351, -0.065, -0.35],
    rotation: [0, 0, 0],
    scale: 0.1,
    label: 'MOBILE',
    color: '#14c4f8',
  },
  {
    position: [-0.001, -0.065, -0.499],
    rotation: [0, 0, 0],
    scale: 0.1,
    label: 'AI',
    color: '#f83800',
  },
  {
    position: [-0.35, -0.065, -0.351],
    rotation: [0, 0, 0],
    scale: 0.1,
    label: 'BLOCKCHAIN',
    color: '#ff5b00',
  },
];

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
  const fit = Math.min(viewport.width, viewport.height);
  const padding = 0.8;

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

  useFrame((_, delta) => {
    const r = scene.current.rotation;
    r.y += 0.2 * delta;
  });

  return (
    <group
      {...props}
      ref={scene}
      scale={fit * padding}
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
