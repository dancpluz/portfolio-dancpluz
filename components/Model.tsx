'use client'

import { useRef, useEffect } from 'react'
import { OrbitControls, PerspectiveCamera, Sphere, useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { angleToRadians } from './../lib/utils';


export default function Model(props) {
  const orbit = useRef(null)
  const { nodes, materials } = useGLTF('/diamond1.glb')
  const intensity = 30

  useFrame((state, delta) => {
    if (!!orbit.current) {
      const { x, y } = state.pointer;
      orbit.current.setAzimuthalAngle(-x * angleToRadians(45));
      orbit.current.setPolarAngle((y + 0.5) * angleToRadians(90-30));
      orbit.current.update()
    }
  })

  useEffect(() => {
    if (!!orbit.current) {
      console.log(orbit.current)
    }
  }, [orbit.current])

  return (
    <>
      <PerspectiveCamera makeDefault position={[0,1,10]}/>
      <OrbitControls ref={orbit}/>
      <Sphere scale={5} position={[0,5,0]}>
        <meshStandardMaterial color="hotpink" />
      </Sphere>
      <mesh rotation={[angleToRadians(-90), 0, 0]}>
        <planeGeometry args={[32, 32]} />
        <meshStandardMaterial color="red" />
      </mesh>
    </>
  )
  
  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="Diamond001" position={[0, 0.1, 0]}>
          <mesh
            name="Cube003"
            castShadow
            receiveShadow
            geometry={nodes.Cube003.geometry}
            material={materials.Diamond}
          />
          <mesh
            name="Cube003_1"
            castShadow
            receiveShadow
            geometry={nodes.Cube003_1.geometry}
            material={materials.Test}
          />
          <pointLight
            name="Point008"
            intensity={intensity}
            decay={2}
            position={[1, -0.1, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
          />
          <pointLight
            name="Point009"
            intensity={intensity}
            decay={2}
            position={[0.7, -0.1, -0.7]}
            rotation={[-Math.PI / 2, 0, 0]}
          />
          <pointLight
            name="Point010"
            intensity={intensity}
            decay={2}
            position={[0, -0.1, -1]}
            rotation={[-Math.PI / 2, 0, 0]}
          />
          <pointLight
            name="Point011"
            intensity={intensity}
            decay={2}
            position={[-0.7, -0.1, -0.7]}
            rotation={[-Math.PI / 2, 0, 0]}
          />
          <pointLight
            name="Point012_1"
            intensity={intensity}
            decay={2}
            position={[-1, -0.1, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
          />
          <pointLight
            name="Point013_1"
            intensity={intensity}
            decay={2}
            position={[-0.7, -0.1, 0.7]}
            rotation={[-Math.PI / 2, 0, 0]}
          />
          <pointLight
            name="Point014_1"
            intensity={intensity}
            decay={2}
            position={[0, -0.1, 1]}
            rotation={[-Math.PI / 2, 0, 0]}
          />
          <pointLight
            name="Point015_1"
            intensity={intensity}
            decay={2}
            position={[0.7, -0.1, 0.7]}
            rotation={[-Math.PI / 2, 0, 0]}
          />
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/diamond1.glb')
