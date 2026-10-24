import React, { useMemo } from 'react'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'

// Preload Kenney industrial solar panel models
useGLTF.preload('/assets/models/industrial/solar-panel-landscape-group.glb')

export const SolarFarm: React.FC<{ level?: number }> = ({ level = 3 }) => {
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

  // Level 1: 0 rows (no solar panels)
  // Level 2: 3 rows (6 panels - some solar panels)
  // Level 3: 6 rows (12 panels - peak)
  const rows = useMemo(() => {
    if (level === 1) return []
    if (level === 2) return [-11.2, -9.4, -7.6]
    return [-13.0, -11.2, -9.4, -7.6, -5.8, -4.0]
  }, [level])

  const columns = [2.2, 4.2]

  if (level === 1 || rows.length === 0) return null

  return (
    <group>
      {/* Solar Panel Array: hidden at Level 1, partial at Level 2, full at Level 3 */}
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
