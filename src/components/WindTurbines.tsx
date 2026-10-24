import React, { useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

interface WindTurbineProps {
  position: [number, number, number];
  rotation?: number;
  scale?: number;
  speedMultiplier?: number;
}

const SingleTurbine: React.FC<WindTurbineProps> = ({
  position,
  rotation = 0,
  scale = 1,
  speedMultiplier = 1,
}) => {
  const rotorRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (rotorRef.current) {
      rotorRef.current.rotation.z += delta * 1.8 * speedMultiplier
    }
  })

  return (
    <group position={position} rotation={[0, rotation, 0]} scale={[scale, scale, scale]}>
      {/* Concrete Base */}
      <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.4, 0.2, 16]} />
        <meshStandardMaterial color="#64748b" roughness={0.8} />
      </mesh>

      {/* Tapered Tower */}
      <mesh position={[0, 2.2, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.18, 4.2, 16]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Nacelle (Generator housing) */}
      <mesh position={[0, 4.3, 0.1]} castShadow>
        <boxGeometry args={[0.26, 0.26, 0.7]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.3} />
      </mesh>

      {/* Red beacon light on nacelle */}
      <mesh position={[0, 4.46, -0.1]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>

      {/* Spinning Rotor Group */}
      <group position={[0, 4.3, 0.48]}>
        <group ref={rotorRef}>
          {/* Nose Cone Hub */}
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <coneGeometry args={[0.13, 0.32, 16]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>

          {/* Blade 1 (Up) */}
          <mesh position={[0, 1.25, -0.05]} castShadow>
            <boxGeometry args={[0.09, 2.4, 0.02]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>

          {/* Blade 2 (120 deg) */}
          <group rotation={[0, 0, (2 * Math.PI) / 3]}>
            <mesh position={[0, 1.25, -0.05]} castShadow>
              <boxGeometry args={[0.09, 2.4, 0.02]} />
              <meshStandardMaterial color="#f8fafc" />
            </mesh>
          </group>

          {/* Blade 3 (240 deg) */}
          <group rotation={[0, 0, (4 * Math.PI) / 3]}>
            <mesh position={[0, 1.25, -0.05]} castShadow>
              <boxGeometry args={[0.09, 2.4, 0.02]} />
              <meshStandardMaterial color="#f8fafc" />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  )
}

export const WindTurbines: React.FC = () => {
  return (
    <group>
      {/* Turbine 1 (Flat on terrain) */}
      <SingleTurbine position={[-6.2, 0, -3.2]} scale={1.0} speedMultiplier={1.0} rotation={-0.3} />
      {/* Turbine 2 */}
      <SingleTurbine position={[-5.3, 0, -5.0]} scale={1.05} speedMultiplier={1.1} rotation={-0.2} />
      {/* Turbine 3 */}
      <SingleTurbine position={[-4.0, 0, -6.6]} scale={1.1} speedMultiplier={0.95} rotation={-0.25} />
    </group>
  )
}
