import React, { useMemo } from 'react'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import { HouseInfo } from '../types'

const IndustrialHouseModel: React.FC<{
  scale?: number;
}> = ({ scale = 1 }) => {
  const gltf = useGLTF('/assets/models/industrial/building-i.glb')

  const clonedScene = useMemo(() => {
    const clone = gltf.scene.clone(true)
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
    return clone
  }, [gltf])

  return (
    <group scale={[scale * 1.35, scale * 1.35, scale * 1.35]}>
      <primitive object={clonedScene} />
      {/* District Heating Inlet Connection Glow at Foundation */}
      <mesh position={[0, 0.1, 0.55]}>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshStandardMaterial
          color="#f97316"
          emissive="#ea580c"
          emissiveIntensity={1.8}
        />
      </mesh>
    </group>
  )
}

export const NordicHouses: React.FC<{
  onSelectHouse?: (house: HouseInfo) => void;
}> = ({ onSelectHouse }) => {
  // Houses arranged in the South-West quadrant matching the user's architectural schematic
  const houses: HouseInfo[] = useMemo(
    () => [
      // --- NORTH RESIDENTIAL BLOCK (North of main horizontal road z = 3.4) ---
      {
        id: 'house-nw-1',
        name: 'Eco Workshop A-1',
        position: [-8.8, 0, 1.8],
        rotation: 0,
        color: 'yellow',
        scale: 1.0,
        heatConnected: true,
      },
      {
        id: 'house-nw-2',
        name: 'Eco Workshop A-2',
        position: [-10.2, 0, 2.4],
        rotation: 0,
        color: 'red',
        scale: 1.0,
        heatConnected: true,
      },
      {
        id: 'house-nw-3',
        name: 'Eco Workshop A-3',
        position: [-7.4, 0, 2.2],
        rotation: 0,
        color: 'slate',
        scale: 1.0,
        heatConnected: true,
      },
      {
        id: 'house-ne-1',
        name: 'Eco Workshop B-1',
        position: [-4.6, 0, 1.8],
        rotation: 0,
        color: 'brown',
        scale: 1.0,
        heatConnected: true,
      },
      {
        id: 'house-ne-2',
        name: 'Eco Workshop B-2',
        position: [-3.0, 0, 2.0],
        rotation: 0,
        color: 'yellow',
        scale: 1.0,
        heatConnected: true,
      },
      {
        id: 'house-ne-3',
        name: 'Eco Workshop B-3',
        position: [-1.4, 0, 2.0],
        rotation: 0,
        color: 'slate',
        scale: 1.0,
        heatConnected: true,
      },

      // --- SOUTH RESIDENTIAL BLOCK (South of main horizontal road z = 3.4) ---
      {
        id: 'house-sw-1',
        name: 'Eco Workshop C-1',
        position: [-10.2, 0, 4.8],
        rotation: Math.PI,
        color: 'red',
        scale: 1.0,
        heatConnected: true,
      },
      {
        id: 'house-sw-2',
        name: 'Eco Workshop C-2',
        position: [-8.8, 0, 4.8],
        rotation: Math.PI,
        color: 'yellow',
        scale: 1.0,
        heatConnected: true,
      },
      {
        id: 'house-sw-3',
        name: 'Eco Workshop C-3',
        position: [-7.4, 0, 4.8],
        rotation: Math.PI,
        color: 'slate',
        scale: 1.0,
        heatConnected: true,
      },
      {
        id: 'house-se-1',
        name: 'Eco Workshop D-1',
        position: [-4.6, 0, 4.8],
        rotation: Math.PI,
        color: 'red',
        scale: 1.0,
        heatConnected: true,
      },
      {
        id: 'house-se-2',
        name: 'Eco Workshop D-2',
        position: [-3.0, 0, 4.8],
        rotation: Math.PI,
        color: 'yellow',
        scale: 1.0,
        heatConnected: true,
      },
      {
        id: 'house-se-3',
        name: 'Eco Workshop D-3',
        position: [-1.4, 0, 4.8],
        rotation: Math.PI,
        color: 'slate',
        scale: 1.0,
        heatConnected: true,
      },

      // --- SOUTHERN TAIL RESIDENCES (Flanking South Street x = -6.0) ---
      {
        id: 'house-tail-1',
        name: 'Eco Workshop S-1',
        position: [-7.4, 0, 7.2],
        rotation: Math.PI / 2,
        color: 'yellow',
        scale: 1.0,
        heatConnected: true,
      },
      {
        id: 'house-tail-2',
        name: 'Eco Workshop S-2',
        position: [-4.6, 0, 7.2],
        rotation: -Math.PI / 2,
        color: 'red',
        scale: 1.0,
        heatConnected: true,
      },
    ],
    []
  )

  return (
    <group>
      {houses.map((house) => (
        <group
          key={house.id}
          position={house.position}
          rotation={[0, house.rotation, 0]}
          onClick={(e) => {
            e.stopPropagation()
            onSelectHouse?.(house)
          }}
        >
          <IndustrialHouseModel scale={house.scale} />


        </group>
      ))}
    </group>
  )
}

useGLTF.preload('/assets/models/industrial/building-i.glb')
