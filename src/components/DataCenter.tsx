import React, { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

interface DataCenterProps {
  onHover?: (hovered: boolean) => void;
  onClick?: () => void;
  isSelected?: boolean;
}

export const DataCenter: React.FC<DataCenterProps> = ({ onHover, onClick, isSelected }) => {
  const fansRef = useRef<THREE.Group>(null)
  const beaconRef = useRef<THREE.PointLight>(null)

  // Rotate chiller fans
  useFrame((_, delta) => {
    if (fansRef.current) {
      fansRef.current.children.forEach((fan) => {
        fan.rotation.z += delta * 6
      })
    }
    if (beaconRef.current) {
      beaconRef.current.intensity = 1.2 + Math.sin(Date.now() * 0.005) * 0.5
    }
  })

  // Solar panel geometry
  const solarPanelGeo = useMemo(() => new THREE.PlaneGeometry(0.7, 0.45), [])
  const solarPanelMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#1d4ed8',
        metalness: 0.8,
        roughness: 0.2,
      }),
    []
  )

  return (
    <group
      position={[0, 0, 0]}
      onPointerOver={(e) => {
        e.stopPropagation()
        onHover?.(true)
      }}
      onPointerOut={(e) => {
        e.stopPropagation()
        onHover?.(false)
      }}
      onClick={(e) => {
        e.stopPropagation()
        onClick?.()
      }}
    >
      {/* Foundation plinth */}
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.6, 0.4, 3.8]} />
        <meshStandardMaterial color="#475569" roughness={0.7} />
      </mesh>

      {/* Main Building Body */}
      <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.2, 1.0, 3.4]} />
        <meshStandardMaterial
          color={isSelected ? '#e2e8f0' : '#cbd5e1'}
          roughness={0.4}
          metalness={0.2}
        />
      </mesh>

      {/* Cyber / Neon Trim Line along upper facade */}
      <mesh position={[0, 1.42, 0]}>
        <boxGeometry args={[4.24, 0.05, 3.44]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0284c7"
          emissiveIntensity={1.8}
        />
      </mesh>

      {/* Parapet / Roof Border */}
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.3, 0.15, 3.5]} />
        <meshStandardMaterial color="#334155" roughness={0.6} />
      </mesh>

      {/* Dark Roof Top */}
      <mesh position={[0, 1.52, 0]} receiveShadow>
        <boxGeometry args={[4.1, 0.02, 3.3]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>

      {/* Entrance / Server Bay Garage Doors */}
      <mesh position={[1.3, 0.7, 1.71]} castShadow>
        <boxGeometry args={[0.9, 0.7, 0.05]} />
        <meshStandardMaterial color="#64748b" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Glow frame around server bay */}
      <mesh position={[1.3, 0.7, 1.73]}>
        <boxGeometry args={[0.95, 0.75, 0.01]} />
        <meshStandardMaterial
          color="#10b981"
          emissive="#059669"
          emissiveIntensity={1.2}
          wireframe
        />
      </mesh>

      {/* Front Entrance Security Door */}
      <mesh position={[-0.8, 0.65, 1.71]}>
        <boxGeometry args={[0.7, 0.6, 0.04]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      <mesh position={[-0.8, 0.98, 1.72]}>
        <boxGeometry args={[0.6, 0.06, 0.02]} />
        <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={2} />
      </mesh>

      {/* Industrial Side Pipe Inlets (Where heat pipes exit into the city) */}
      <group position={[-2.12, 0.5, 0.4]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.12, 0.12, 0.3, 16]} />
          <meshStandardMaterial color="#ea580c" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>
      <group position={[-2.12, 0.5, -0.4]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.12, 0.12, 0.3, 16]} />
          <meshStandardMaterial color="#ea580c" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>
      {/* Front Pipe Outlets */}
      <group position={[-0.3, 0.35, 1.72]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.09, 0.09, 0.25, 16]} />
          <meshStandardMaterial color="#ea580c" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>

      {/* ROOFTOP EQUIPMENT */}
      {/* 1. Large Dual HVAC Chiller Units */}
      <group position={[-0.8, 1.75, -0.6]}>
        {/* Chiller Housing 1 */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.6, 0.45, 0.9]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.5} roughness={0.4} />
        </mesh>
        {/* Fan grills */}
        <mesh position={[-0.4, 0.24, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.04, 20]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        <mesh position={[0.4, 0.24, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.04, 20]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
      </group>

      <group position={[-0.8, 1.75, 0.6]}>
        {/* Chiller Housing 2 */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.6, 0.45, 0.9]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.5} roughness={0.4} />
        </mesh>
        {/* Fan grills */}
        <mesh position={[-0.4, 0.24, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.04, 20]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        <mesh position={[0.4, 0.24, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.04, 20]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
      </group>

      {/* Rotating Chiller Fans */}
      <group ref={fansRef} position={[-0.8, 1.99, 0]}>
        {/* Chiller 1 Fans */}
        <group position={[-0.4, 0, -0.6]} rotation={[-Math.PI / 2, 0, 0]}>
          <mesh>
            <boxGeometry args={[0.5, 0.05, 0.02]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <boxGeometry args={[0.5, 0.05, 0.02]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
        </group>
        <group position={[0.4, 0, -0.6]} rotation={[-Math.PI / 2, 0, 0]}>
          <mesh>
            <boxGeometry args={[0.5, 0.05, 0.02]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <boxGeometry args={[0.5, 0.05, 0.02]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
        </group>

        {/* Chiller 2 Fans */}
        <group position={[-0.4, 0, 0.6]} rotation={[-Math.PI / 2, 0, 0]}>
          <mesh>
            <boxGeometry args={[0.5, 0.05, 0.02]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <boxGeometry args={[0.5, 0.05, 0.02]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
        </group>
        <group position={[0.4, 0, 0.6]} rotation={[-Math.PI / 2, 0, 0]}>
          <mesh>
            <boxGeometry args={[0.5, 0.05, 0.02]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <boxGeometry args={[0.5, 0.05, 0.02]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
        </group>
      </group>

      {/* 2. Rooftop Solar Panel Arrays (Right side of roof) */}
      <group position={[1.2, 1.62, 0.5]}>
        {/* Row 1 */}
        <mesh
          geometry={solarPanelGeo}
          material={solarPanelMat}
          position={[-0.4, 0, -0.3]}
          rotation={[-0.35, 0, 0]}
          castShadow
        />
        <mesh
          geometry={solarPanelGeo}
          material={solarPanelMat}
          position={[0.4, 0, -0.3]}
          rotation={[-0.35, 0, 0]}
          castShadow
        />
        {/* Row 2 */}
        <mesh
          geometry={solarPanelGeo}
          material={solarPanelMat}
          position={[-0.4, 0, 0.25]}
          rotation={[-0.35, 0, 0]}
          castShadow
        />
        <mesh
          geometry={solarPanelGeo}
          material={solarPanelMat}
          position={[0.4, 0, 0.25]}
          rotation={[-0.35, 0, 0]}
          castShadow
        />
      </group>

      {/* 3. Rooftop Exhaust Domes / Vents */}
      <mesh position={[0.8, 1.62, -0.8]} castShadow>
        <cylinderGeometry args={[0.22, 0.25, 0.2, 16]} />
        <meshStandardMaterial color="#64748b" metalness={0.7} />
      </mesh>
      <mesh position={[1.4, 1.62, -0.8]} castShadow>
        <cylinderGeometry args={[0.18, 0.2, 0.18, 16]} />
        <meshStandardMaterial color="#64748b" metalness={0.7} />
      </mesh>

      {/* Communication Mast & Green Beacon */}
      <mesh position={[-1.7, 1.8, -1.2]} castShadow>
        <cylinderGeometry args={[0.02, 0.04, 0.8, 8]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} />
      </mesh>
      <mesh position={[-1.7, 2.22, -1.2]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial color="#22c55e" emissive="#16a34a" emissiveIntensity={2.5} />
      </mesh>
      <pointLight
        ref={beaconRef}
        position={[-1.7, 2.3, -1.2]}
        color="#22c55e"
        distance={2.5}
        intensity={1.5}
      />
    </group>
  )
}
