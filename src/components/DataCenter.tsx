import React, { useMemo } from 'react'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'

interface DataCenterProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  onHover?: (hovered: boolean) => void;
  onClick?: () => void;
  isSelected?: boolean;
}

export const DataCenter: React.FC<DataCenterProps> = ({
  position = [10.0, 0, -5.5],
  rotation = [0, 0, 0],
  scale = 2.2,
  onHover,
  onClick,
  isSelected,
}) => {
  const gltf = useGLTF('/assets/models/industrial/building-q.glb')

  const clonedScene = useMemo(() => {
    const clone = gltf.scene.clone(true)
    clone.traverse((node) => {
      if ((node as THREE.Mesh).isMesh) {
        node.castShadow = true
        node.receiveShadow = true
        const mesh = node as THREE.Mesh
        if (Array.isArray(mesh.material)) {
          mesh.material = mesh.material.map((m) => m.clone())
        } else if (mesh.material) {
          mesh.material = mesh.material.clone()
        }

        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
        mats.forEach((m) => {
          if (m instanceof THREE.MeshStandardMaterial) {
            if (m.name.includes('specular')) {
              // Windows, metallic vents, and architectural louvers
              m.roughness = 0.22
              m.metalness = 0.78
            } else {
              // High-tech exterior insulated facade panels
              m.roughness = 0.62
              m.metalness = 0.28
            }
          }
        })
      }
    })
    return clone
  }, [gltf])

  return (
    <group
      position={position}
      rotation={rotation}
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
      {/* Heavy industrial concrete foundation plinth */}
      <mesh position={[0, 0.04, 0]} receiveShadow castShadow>
        <boxGeometry args={[4.8, 0.08, 4.2]} />
        <meshStandardMaterial
          color={isSelected ? '#475569' : '#1e293b'}
          roughness={0.75}
          metalness={0.1}
        />
      </mesh>

      {/* Modern Data Center Server Status LED Accents */}
      <mesh position={[-1.6, 0.12, 2.05]}>
        <boxGeometry args={[0.6, 0.04, 0.02]} />
        <meshStandardMaterial
          color="#10b981"
          emissive="#10b981"
          emissiveIntensity={1.8}
          roughness={0.2}
        />
      </mesh>
      <mesh position={[-0.8, 0.12, 2.05]}>
        <boxGeometry args={[0.4, 0.04, 0.02]} />
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#06b6d4"
          emissiveIntensity={1.5}
          roughness={0.2}
        />
      </mesh>

      {/* Kenney Industrial 2.0 building-q.glb model */}
      <group scale={[scale, scale, scale]} position={[0, 0.08, 0]}>
        {/* Offset to center the model pivot accurately */}
        <group position={[0.228, 0, -0.011]}>
          <primitive object={clonedScene} />
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/assets/models/industrial/building-q.glb')
