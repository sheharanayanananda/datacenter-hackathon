import React, { useMemo } from 'react'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'

// Preload Kenney tree models
const TREE_MODELS = [
  '/assets/models/nature/tree.glb',
  '/assets/models/nature/tree-crooked.glb',
  '/assets/models/nature/tree-high.glb',
  '/assets/models/nature/tree-high-round.glb',
]

TREE_MODELS.forEach((path) => useGLTF.preload(path))

interface TreeInstance {
  pos: [number, number, number];
  rot: number;
  scale: number;
  modelIdx: number;
}

export const ExpansionZoneForest: React.FC<{ level: number }> = ({ level }) => {
  const gltf0 = useGLTF(TREE_MODELS[0])
  const gltf1 = useGLTF(TREE_MODELS[1])
  const gltf2 = useGLTF(TREE_MODELS[2])
  const gltf3 = useGLTF(TREE_MODELS[3])

  const models = useMemo(() => {
    return [gltf0, gltf1, gltf2, gltf3].map((gltf) => {
      const cloned = gltf.scene.clone(true)
      cloned.traverse((node) => {
        if ((node as THREE.Mesh).isMesh) {
          node.castShadow = true
          node.receiveShadow = true
          const mesh = node as THREE.Mesh
          if (mesh.material) {
            const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
            mats.forEach((m) => {
              if (m instanceof THREE.MeshStandardMaterial) {
                m.roughness = 0.82
                m.metalness = 0.02
              }
            })
          }
        }
      })
      return cloned
    })
  }, [gltf0, gltf1, gltf2, gltf3])

  // Tree instances dynamically placed in unbuilt lots based on current level
  const trees = useMemo(() => {
    const list: TreeInstance[] = []

    // 1. Data Center Lot #2 ([16.0, 0, -5.5]) - covered by trees in Level 1
    if (level === 1) {
      list.push(
        { pos: [15.2, 0, -4.8], rot: 0.4, scale: 0.9, modelIdx: 0 },
        { pos: [16.8, 0, -5.2], rot: 1.8, scale: 1.1, modelIdx: 2 },
        { pos: [15.6, 0, -6.3], rot: 3.1, scale: 0.85, modelIdx: 1 },
        { pos: [16.9, 0, -6.1], rot: 4.2, scale: 1.0, modelIdx: 3 },
        { pos: [16.0, 0, -4.2], rot: 2.1, scale: 0.95, modelIdx: 0 }
      )
    }

    // 2. Data Center Lot #3 ([10.0, 0, -11.5]) - covered by trees in Level 1
    if (level === 1) {
      list.push(
        { pos: [9.3, 0, -10.8], rot: 1.2, scale: 1.0, modelIdx: 2 },
        { pos: [10.8, 0, -11.2], rot: 2.7, scale: 0.9, modelIdx: 0 },
        { pos: [9.7, 0, -12.3], rot: 0.5, scale: 1.1, modelIdx: 3 },
        { pos: [11.0, 0, -12.1], rot: 3.9, scale: 0.85, modelIdx: 1 },
        { pos: [10.1, 0, -10.4], rot: 4.8, scale: 1.05, modelIdx: 2 }
      )
    }

    // 3. Data Center Lot #4 ([16.0, 0, -11.5]) - covered by trees in Level 1 and Level 2
    if (level <= 2) {
      list.push(
        { pos: [15.1, 0, -10.7], rot: 0.9, scale: 1.15, modelIdx: 3 },
        { pos: [16.9, 0, -11.1], rot: 2.4, scale: 0.95, modelIdx: 0 },
        { pos: [15.5, 0, -12.4], rot: 4.1, scale: 1.0, modelIdx: 1 },
        { pos: [16.8, 0, -12.2], rot: 1.5, scale: 0.85, modelIdx: 2 },
        { pos: [16.1, 0, -10.2], rot: 3.3, scale: 1.1, modelIdx: 3 }
      )
    }

    // 4. Solar Farm Top Half (z: -13.0 to -9.4) - covered by trees in Level 1
    if (level === 1) {
      list.push(
        { pos: [2.5, 0, -12.8], rot: 0.3, scale: 0.95, modelIdx: 0 },
        { pos: [4.1, 0, -12.5], rot: 2.1, scale: 1.05, modelIdx: 2 },
        { pos: [2.8, 0, -11.2], rot: 3.8, scale: 0.9, modelIdx: 1 },
        { pos: [4.3, 0, -11.0], rot: 1.4, scale: 1.1, modelIdx: 3 },
        { pos: [2.4, 0, -9.6], rot: 4.9, scale: 1.0, modelIdx: 0 },
        { pos: [4.0, 0, -9.3], rot: 0.8, scale: 0.9, modelIdx: 2 }
      )
    }

    // 5. Solar Farm Bottom Half (z: -7.6 to -4.0) - covered by trees in Level 1 and Level 2
    if (level <= 2) {
      list.push(
        { pos: [2.6, 0, -7.8], rot: 1.7, scale: 1.0, modelIdx: 3 },
        { pos: [4.2, 0, -7.5], rot: 3.2, scale: 0.9, modelIdx: 1 },
        { pos: [2.4, 0, -6.0], rot: 0.6, scale: 1.1, modelIdx: 0 },
        { pos: [4.1, 0, -5.7], rot: 2.8, scale: 0.95, modelIdx: 2 },
        { pos: [2.7, 0, -4.2], rot: 4.3, scale: 1.05, modelIdx: 3 },
        { pos: [4.3, 0, -3.9], rot: 1.1, scale: 0.85, modelIdx: 1 }
      )
    }

    // 6. Wind Turbine Spot #2 ([18.5, 0, 11.5]) - covered by trees in Level 1
    if (level === 1) {
      list.push(
        { pos: [18.2, 0, 11.1], rot: 0.7, scale: 1.1, modelIdx: 2 },
        { pos: [18.9, 0, 11.8], rot: 2.5, scale: 0.9, modelIdx: 0 },
        { pos: [18.4, 0, 12.3], rot: 4.4, scale: 1.0, modelIdx: 3 }
      )
    }

    // 7. Wind Turbine Spot #3 ([14.0, 0, 17.5]) - covered by trees in Level 1 and Level 2
    if (level <= 2) {
      list.push(
        { pos: [13.6, 0, 17.1], rot: 1.9, scale: 1.05, modelIdx: 3 },
        { pos: [14.4, 0, 17.8], rot: 3.6, scale: 0.95, modelIdx: 1 },
        { pos: [13.9, 0, 18.2], rot: 0.2, scale: 1.15, modelIdx: 2 }
      )
    }

    return list
  }, [level])

  return (
    <group>
      {trees.map((t, idx) => (
        <group
          key={`exp-tree-${level}-${idx}`}
          position={t.pos}
          rotation={[0, t.rot, 0]}
          scale={[t.scale, t.scale, t.scale]}
        >
          <primitive object={models[t.modelIdx].clone()} />
        </group>
      ))}
    </group>
  )
}
