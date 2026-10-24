import React, { useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

interface NasineulaTowerProps {
  position?: [number, number, number];
  scale?: number | [number, number, number];
}

export const NasineulaTower: React.FC<NasineulaTowerProps> = ({
  position = [-5.0, 0, -6.0],
  scale = 0.7,
}) => {
  const beaconRef = useRef<THREE.PointLight>(null)

  // Pulsing red aviation warning beacon on the pinnacle
  useFrame((state) => {
    if (beaconRef.current) {
      beaconRef.current.intensity =
        1.5 + Math.sin(state.clock.getElapsedTime() * 4) * 1.0
    }
  })

  const scaleVector: [number, number, number] =
    typeof scale === 'number' ? [scale, scale, scale] : scale

  return (
    <group position={position} scale={scaleVector}>
      {/* 1. Base Pavilion & Entry Foundation */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.5, 1.8, 0.5, 24]} />
        <meshStandardMaterial color="#64748b" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.65, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.2, 1.4, 0.3, 24]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.6} />
      </mesh>

      {/* 2. Main Concrete Tower Shaft (Tapered, 168m scale representation) */}
      <mesh position={[0, 4.6, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.32, 0.68, 7.6, 24]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.5} />
      </mesh>

      {/* 3. Observation Deck Saucer & Revolving Restaurant */}
      <group position={[0, 8.4, 0]}>
        {/* Lower saucer support cone */}
        <mesh position={[0, -0.3, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.25, 0.4, 0.6, 24]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.4} />
        </mesh>

        {/* Lower observation ring */}
        <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.3, 1.25, 0.35, 24]} />
          <meshStandardMaterial color="#1e293b" roughness={0.3} />
        </mesh>

        {/* Panoramic glass window band with warm glow */}
        <mesh position={[0, 0.35, 0]}>
          <cylinderGeometry args={[1.28, 1.28, 0.22, 24]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#0284c7"
            emissiveIntensity={0.9}
            roughness={0.1}
          />
        </mesh>

        {/* Revolving restaurant upper tier */}
        <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.15, 1.26, 0.3, 24]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.4} />
        </mesh>

        {/* Observation deck roof / canopy */}
        <mesh position={[0, 0.85, 0]} castShadow>
          <cylinderGeometry args={[0.65, 1.15, 0.2, 24]} />
          <meshStandardMaterial color="#475569" roughness={0.5} />
        </mesh>
      </group>

      {/* 4. Upper Steel Antenna Mast & Spire */}
      <group position={[0, 9.4, 0]}>
        {/* Mast base cylinder */}
        <mesh position={[0, 0.4, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.18, 0.8, 12]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.7} />
        </mesh>

        {/* Red & white aviation painted sections */}
        <mesh position={[0, 1.1, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.08, 0.6, 12]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
        <mesh position={[0, 1.7, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.06, 0.6, 12]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
        <mesh position={[0, 2.3, 0]} castShadow>
          <cylinderGeometry args={[0.025, 0.04, 0.6, 12]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>

        {/* Blinking pinnacle beacon */}
        <mesh position={[0, 2.65, 0]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
        <pointLight
          ref={beaconRef}
          position={[0, 2.7, 0]}
          color="#ef4444"
          distance={5}
          intensity={2}
        />
      </group>
    </group>
  )
}
