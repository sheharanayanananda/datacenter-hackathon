import React, { useMemo } from 'react'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'

// Preload Kenney industrial solar panel models
useGLTF.preload('/assets/models/industrial/solar-panel-landscape-group.glb')

export const SolarFarm: React.FC = () => {
  const landscapeGroupGLTF = useGLTF('/assets/models/industrial/solar-panel-landscape-group.glb')

  // Clone template scene graph with shadows enabled
  const landscapeScene = useMemo(() => {
    const clone = landscapeGroupGLTF.scene.clone(true)
    clone.traverse((node) => {
      if ((node as THREE.Mesh).isMesh) {
        node.castShadow = true
        node.receiveShadow = true
      }
    })
    return clone
  }, [landscapeGroupGLTF])

  // 12 clones for the 6-row x 2-column array
  const panelClones = useMemo(() => {
    return Array.from({ length: 12 }, () => landscapeScene.clone(true))
  }, [landscapeScene])

  // 6 rows along Z with generous 1.8-unit spacing, spanning from z = -13.5 to -3.5 to match the 2x2 datacenter grid
  const rows = useMemo(() => {
    return [-13.0, -11.2, -9.4, -7.6, -5.8, -4.0]
  }, [])

  // 2 columns along X, comfortably on the lawn between the lake and the road (road at x = 6.0)
  const columns = [2.2, 4.2]

  return (
    <group>
      {/* Solar Panel Array sitting directly on the grass with increased spacing */}
      {rows.map((z, rowIdx) =>
        columns.map((x, colIdx) => {
          const index = rowIdx * columns.length + colIdx
          return (
            <group
              key={`solar-${rowIdx}-${colIdx}`}
              position={[x, 0, z]}
              rotation={[0, Math.PI, 0]}
              scale={[1.1, 1.1, 1.1]}
            >
              <primitive object={panelClones[index]} />
            </group>
          )
        })
      )}
    </group>
  )
}
