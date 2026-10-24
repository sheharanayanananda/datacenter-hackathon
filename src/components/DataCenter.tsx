import React, { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'

interface DataCenterProps {
  position?: [number, number, number];
  onHover?: (hovered: boolean) => void;
  onClick?: () => void;
  isSelected?: boolean;
}

const KenneyTank: React.FC<{ position: [number, number, number]; scale?: number }> = ({
  position,
  scale = 1,
}) => {
  try {
    const gltf = useGLTF('/assets/models/industrial/detail-tank-large.glb')
    const clone = useMemo(() => {
      const c = gltf.scene.clone(true)
      c.traverse((node) => {
        if ((node as THREE.Mesh).isMesh) {
          node.castShadow = true
          node.receiveShadow = true
        }
      })
      return c
    }, [gltf])
    return (
      <group position={position} scale={[scale, scale, scale]}>
        <primitive object={clone} />
      </group>
    )
  } catch (e) {
    return (
      <mesh position={[position[0], position[1] + 0.6, position[2]]} castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.5, 1.2, 16]} />
        <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.3} />
      </mesh>
    )
  }
}

const KenneySolarArray: React.FC<{
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}> = ({ position, rotation = [0, 0, 0], scale = 1 }) => {
  try {
    const gltf = useGLTF('/assets/models/industrial/solar-panel-landscape-group.glb')
    const clone = useMemo(() => {
      const c = gltf.scene.clone(true)
      c.traverse((node) => {
        if ((node as THREE.Mesh).isMesh) {
          node.castShadow = true
          node.receiveShadow = true
        }
      })
      return c
    }, [gltf])
    return (
      <group position={position} rotation={rotation} scale={[scale, scale, scale]}>
        <primitive object={clone} />
      </group>
    )
  } catch (e) {
    return null
  }
}

export const DataCenter: React.FC<DataCenterProps> = ({
  position = [6.5, 0, 0.0],
  onHover,
  onClick,
  isSelected,
}) => {
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
      position={position}
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
      {/* 1. Main Concrete Foundation Plinth */}
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.6, 0.4, 4.0]} />
        <meshStandardMaterial color="#475569" roughness={0.7} />
      </mesh>

      {/* 2. Main Server Building Body */}
      <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.2, 1.0, 3.6]} />
        <meshStandardMaterial
          color={isSelected ? '#e2e8f0' : '#cbd5e1'}
          roughness={0.4}
          metalness={0.2}
        />
      </mesh>

      {/* Cyber / Neon Trim Line along upper facade */}
      <mesh position={[0, 1.42, 0]}>
        <boxGeometry args={[4.24, 0.05, 3.64]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0284c7"
          emissiveIntensity={1.8}
        />
      </mesh>

      {/* Parapet / Roof Border */}
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.3, 0.15, 3.7]} />
        <meshStandardMaterial color="#334155" roughness={0.6} />
      </mesh>

      {/* Dark Roof Top */}
      <mesh position={[0, 1.52, 0]} receiveShadow>
        <boxGeometry args={[4.1, 0.02, 3.5]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>

      {/* Server Bay Garage Doors (Facing South / road) */}
      <mesh position={[1.3, 0.7, 1.81]} castShadow>
        <boxGeometry args={[0.9, 0.7, 0.05]} />
        <meshStandardMaterial color="#64748b" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[1.3, 0.7, 1.83]}>
        <boxGeometry args={[0.95, 0.75, 0.01]} />
        <meshStandardMaterial
          color="#10b981"
          emissive="#059669"
          emissiveIntensity={1.2}
          wireframe
        />
      </mesh>

      {/* Front Entrance Security Door */}
      <mesh position={[-0.8, 0.65, 1.81]}>
        <boxGeometry args={[0.7, 0.6, 0.04]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      <mesh position={[-0.8, 0.98, 1.82]}>
        <boxGeometry args={[0.6, 0.06, 0.02]} />
        <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={2} />
      </mesh>

      {/* Industrial Side Pipe Manifolds (Connecting into District Heating Grid) */}
      <group position={[-2.12, 0.5, 0.4]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.14, 0.14, 0.35, 16]} />
          <meshStandardMaterial color="#ea580c" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>
      <group position={[-2.12, 0.5, -0.4]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.14, 0.14, 0.35, 16]} />
          <meshStandardMaterial color="#ea580c" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>

      {/* ROOFTOP EQUIPMENT */}
      {/* 1. Large Dual HVAC Chiller Units */}
      <group position={[-0.8, 1.75, -0.6]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.6, 0.45, 0.9]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.5} roughness={0.4} />
        </mesh>
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
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.6, 0.45, 0.9]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.5} roughness={0.4} />
        </mesh>
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

      {/* KENNEY INDUSTRIAL ASSETS INTEGRATION */}
      {/* Thermal Storage Heat Accumulation Tanks (West side near district heating outlet) */}
      <KenneyTank position={[-2.7, 0, 1.0]} scale={0.75} />
      <KenneyTank position={[-2.7, 0, -1.0]} scale={0.75} />

      {/* High-efficiency solar arrays in the industrial yard */}
      <KenneySolarArray position={[1.2, 0, -2.4]} rotation={[0, Math.PI, 0]} scale={0.65} />
    </group>
  )
}

useGLTF.preload('/assets/models/industrial/detail-tank-large.glb')
useGLTF.preload('/assets/models/industrial/solar-panel-landscape-group.glb')
