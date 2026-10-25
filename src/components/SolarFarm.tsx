import React, { useMemo } from 'react'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'

// Preload Kenney industrial solar panel models
useGLTF.preload('/assets/models/industrial/solar-panel-landscape-group.glb')

export const SolarFarm: React.FC<{
  level?: number;
  onSelectSolar?: () => void;
  onHover?: (hovered: boolean) => void;
}> = ({ level = 3, onSelectSolar, onHover }) => {
  const landscapeGroupGLTF = useGLTF('/assets/models/industrial/solar-panel-landscape-group.glb')

  // Clone template scene graph with shadows and PBR photovoltaic shading
  const landscapeScene = useMemo(() => {
    const clone = landscapeGroupGLTF.scene.clone(true)
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
              // Photovoltaic solar glass cells: sleek specular reflection & deep navy glint
              m.roughness = 0.12
              m.metalness = 0.65
            } else {
              // Galvanized steel and aluminum mounting frames
              m.roughness = 0.42
              m.metalness = 0.75
            }
          }
        })
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
    if (level === 2) return [-13.0, -11.2, -9.4]
    return [-13.0, -11.2, -9.4, -7.6, -5.8, -4.0]
  }, [level])

  const columns = [2.2, 4.2]

  if (level === 1 || rows.length === 0) return null

  return (
    <group
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
        onSelectSolar?.()
      }}
    >
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
