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
      {/* Concrete foundation plinth pad */}
      <mesh position={[0, 0.04, 0]} receiveShadow castShadow>
        <boxGeometry args={[4.8, 0.08, 4.2]} />
        <meshStandardMaterial
          color={isSelected ? '#64748b' : '#334155'}
          roughness={0.8}
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
