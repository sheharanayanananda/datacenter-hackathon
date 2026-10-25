import React, { useMemo } from 'react'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import { HouseInfo } from '../types'

// Industrial workshop model with centered pivot and aligned front entry
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
        const mesh = child as THREE.Mesh
        if (Array.isArray(mesh.material)) {
          mesh.material = mesh.material.map((m) => m.clone())
        } else if (mesh.material) {
          mesh.material = mesh.material.clone()
        }

        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
        mats.forEach((m) => {
          if (m instanceof THREE.MeshStandardMaterial) {
            if (m.name.includes('specular')) {
              // Workshop glass windows and metal trims
              m.roughness = 0.18
              m.metalness = 0.6
            } else {
              // Nordic timber siding and roof tiles
              m.roughness = 0.68
              m.metalness = 0.15
            }
          }
        })
      }
    })
    return clone
  }, [gltf])

  const s = scale * 1.25

  return (
    <group scale={[s, s, s]}>
      {/* 
        Kenney building-i.glb bounding box is [-0.95, 0, -0.38] to [0.08, 0.73, 0.92].
        Center is at x = -0.43, z = +0.27.
        Front facade (garage & double doors) faces -Z.
        Offsetting by (+0.43, 0, -0.27) centers the model pivot perfectly!
      */}
      <group position={[0.43, 0, -0.27]}>
        <primitive object={clonedScene} />
      </group>
    </group>
  )
}

export const NordicHouses: React.FC<{
  onSelectHouse?: (house: HouseInfo) => void;
  onHover?: (hovered: boolean) => void;
}> = ({ onSelectHouse, onHover }) => {
  // Houses perfectly aligned to the street grid lines:
  // - North row along z = 2.6 (all facing SOUTH towards Main Avenue z = 4.5)
  // - South row along z = 6.4 (all facing NORTH towards Main Avenue z = 4.5)
  // - South Street tail along z = 9.2 (facing EAST and WEST towards South Street x = -7.0)
  const houses: HouseInfo[] = useMemo(
    () => [
      // =========================================================================
      // NORTH ROW (Parallel to South Main Avenue at z = 2.6, facing South [rot = Math.PI])
      // =========================================================================
      // West of crossroad (x = -7.0)
      {
        id: 'house-nw-1',
        name: 'Civilian Home A-1',
        position: [-13.5, 0, 2.6],
        rotation: Math.PI,
        color: 'yellow',
        scale: 1.0,
      },
      {
        id: 'house-nw-2',
        name: 'Civilian Home A-2',
        position: [-11.0, 0, 2.6],
        rotation: Math.PI,
        color: 'red',
        scale: 1.0,
      },
      {
        id: 'house-nw-3',
        name: 'Civilian Home A-3',
        position: [-8.8, 0, 2.6],
        rotation: Math.PI,
        color: 'slate',
        scale: 1.0,
      },
      // East of crossroad (x = -7.0)
      {
        id: 'house-ne-1',
        name: 'Civilian Home B-1',
        position: [-5.2, 0, 2.6],
        rotation: Math.PI,
        color: 'brown',
        scale: 1.0,
      },
      {
        id: 'house-ne-2',
        name: 'Civilian Home B-2',
        position: [-3.0, 0, 2.6],
        rotation: Math.PI,
        color: 'yellow',
        scale: 1.0,
      },
      {
        id: 'house-ne-3',
        name: 'Civilian Home B-3',
        position: [-0.8, 0, 2.6],
        rotation: Math.PI,
        color: 'slate',
        scale: 1.0,
      },

      // =========================================================================
      // SOUTH ROW (Parallel to South Main Avenue at z = 6.4, facing North [rot = 0])
      // =========================================================================
      // West of crossroad (x = -7.0)
      {
        id: 'house-sw-1',
        name: 'Civilian Home C-1',
        position: [-13.5, 0, 6.4],
        rotation: 0,
        color: 'red',
        scale: 1.0,
      },
      {
        id: 'house-sw-2',
        name: 'Civilian Home C-2',
        position: [-11.0, 0, 6.4],
        rotation: 0,
        color: 'yellow',
        scale: 1.0,
      },
      {
        id: 'house-sw-3',
        name: 'Civilian Home C-3',
        position: [-8.8, 0, 6.4],
        rotation: 0,
        color: 'slate',
        scale: 1.0,
      },
      // East of crossroad (x = -7.0)
      {
        id: 'house-se-1',
        name: 'Civilian Home D-1',
        position: [-5.2, 0, 6.4],
        rotation: 0,
        color: 'red',
        scale: 1.0,
      },
      {
        id: 'house-se-2',
        name: 'Civilian Home D-2',
        position: [-3.0, 0, 6.4],
        rotation: 0,
        color: 'yellow',
        scale: 1.0,
      },
      {
        id: 'house-se-3',
        name: 'Civilian Home D-3',
        position: [-0.8, 0, 6.4],
        rotation: 0,
        color: 'slate',
        scale: 1.0,
      },

      // =========================================================================
      // SOUTHERN STREET TAIL (Flanking South Street x = -7.0 at z = 9.2)
      // =========================================================================
      // West of street: faces EAST into street [rot = -Math.PI / 2]
      {
        id: 'house-tail-1',
        name: 'Civilian Home S-1',
        position: [-8.8, 0, 9.2],
        rotation: -Math.PI / 2,
        color: 'yellow',
        scale: 1.0,
      },
      // East of street: faces WEST into street [rot = Math.PI / 2]
      {
        id: 'house-tail-2',
        name: 'Civilian Home S-2',
        position: [-5.2, 0, 9.2],
        rotation: Math.PI / 2,
        color: 'red',
        scale: 1.0,
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
