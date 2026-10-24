import React, { useMemo, useRef, useEffect } from 'react'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'

// Preload Kenney fantasy town nature models
const MODEL_PATHS = {
  tree: '/assets/models/nature/tree.glb',
  treeCrooked: '/assets/models/nature/tree-crooked.glb',
  treeHigh: '/assets/models/nature/tree-high.glb',
  treeHighCrooked: '/assets/models/nature/tree-high-crooked.glb',
  treeHighRound: '/assets/models/nature/tree-high-round.glb',
  rockLarge: '/assets/models/nature/rock-large.glb',
  rockSmall: '/assets/models/nature/rock-small.glb',
  rockWide: '/assets/models/nature/rock-wide.glb',
} as const

Object.values(MODEL_PATHS).forEach((path) => useGLTF.preload(path))

interface InstanceDef {
  x: number;
  y?: number;
  z: number;
  rotation: number;
  scale: number;
}

const getMesh = (scene: THREE.Group): THREE.Mesh | null => {
  let found: THREE.Mesh | null = null
  scene.traverse((node) => {
    if (!found && (node as THREE.Mesh).isMesh) {
      found = node as THREE.Mesh
    }
  })
  return found
}

// High-performance GPU Instanced Mesh batch (1 draw call per model type)
const InstancedBatch: React.FC<{
  mesh: THREE.Mesh | null;
  instances: InstanceDef[];
  castShadow?: boolean;
  receiveShadow?: boolean;
}> = ({ mesh, instances, castShadow = true, receiveShadow = true }) => {
  const instancedRef = useRef<THREE.InstancedMesh>(null)

  useEffect(() => {
    if (!instancedRef.current || instances.length === 0) return
    const dummy = new THREE.Object3D()
    instances.forEach((item, i) => {
      const s = item.scale
      dummy.position.set(item.x, item.y ?? 0.005, item.z)
      dummy.rotation.set(0, item.rotation, 0)
      dummy.scale.set(s, s, s)
      dummy.updateMatrix()
      instancedRef.current!.setMatrixAt(i, dummy.matrix)
    })
    instancedRef.current.instanceMatrix.needsUpdate = true
  }, [instances])

  if (!mesh || instances.length === 0) return null

  return (
    <instancedMesh
      ref={instancedRef}
      args={[mesh.geometry, mesh.material, instances.length]}
      castShadow={castShadow}
      receiveShadow={receiveShadow}
    />
  )
}

// Deterministic pseudo-random number generator for stable procedural placement
function createRng(seed: number) {
  let s = seed
  return function () {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

export const Forest: React.FC = () => {
  // Load 5 tree variations and 3 rock variations
  const gltfTree = useGLTF(MODEL_PATHS.tree)
  const gltfTreeCrooked = useGLTF(MODEL_PATHS.treeCrooked)
  const gltfTreeHigh = useGLTF(MODEL_PATHS.treeHigh)
  const gltfTreeHighCrooked = useGLTF(MODEL_PATHS.treeHighCrooked)
  const gltfTreeHighRound = useGLTF(MODEL_PATHS.treeHighRound)
  const gltfRockLarge = useGLTF(MODEL_PATHS.rockLarge)
  const gltfRockSmall = useGLTF(MODEL_PATHS.rockSmall)
  const gltfRockWide = useGLTF(MODEL_PATHS.rockWide)

  const meshTree = useMemo(() => getMesh(gltfTree.scene), [gltfTree])
  const meshTreeCrooked = useMemo(() => getMesh(gltfTreeCrooked.scene), [gltfTreeCrooked])
  const meshTreeHigh = useMemo(() => getMesh(gltfTreeHigh.scene), [gltfTreeHigh])
  const meshTreeHighCrooked = useMemo(() => getMesh(gltfTreeHighCrooked.scene), [gltfTreeHighCrooked])
  const meshTreeHighRound = useMemo(() => getMesh(gltfTreeHighRound.scene), [gltfTreeHighRound])
  const meshRockLarge = useMemo(() => getMesh(gltfRockLarge.scene), [gltfRockLarge])
  const meshRockSmall = useMemo(() => getMesh(gltfRockSmall.scene), [gltfRockSmall])
  const meshRockWide = useMemo(() => getMesh(gltfRockWide.scene), [gltfRockWide])

  // Generate deep, uniform, high-detail Clash of Clans style border layout
  const {
    treeInstances,
    treeCrookedInstances,
    treeHighInstances,
    treeHighCrookedInstances,
    treeHighRoundInstances,
    rockLargeInstances,
    rockSmallInstances,
    rockWideInstances,
  } = useMemo(() => {
    const rng = createRng(4242)

    // Lake Näsijärvi boundary check (ellipse at [-16.0, -19.5])
    const isInsideLake = (x: number, z: number, padding: number = 0) => {
      const dx = (x - -16.0) / (15.8 + padding)
      const dz = (z - -19.5) / (10.7 + padding)
      return dx * dx + dz * dz < 1.0
    }

    // Exclusion zones for town facilities, roads, paths, and clearings
    const isInsideTown = (x: number, z: number) => {
      // 1. Data Center campus core
      if (x >= 6.5 && x <= 19.5 && z >= -15.0 && z <= -3.0) return true
      // 2. Solar farm array
      if (x >= 0.5 && x <= 5.8 && z >= -14.5 && z <= -2.5) return true
      // 3. Näsinneula observation tower
      if (Math.hypot(x - -5.0, z - -6.0) < 3.2) return true
      // 4. Residential quarter & workshops
      if (x >= -14.5 && x <= 0.5 && z >= 0.5 && z <= 10.5) return true
      // 5. Roads & sidewalks (with comfortable setbacks)
      // North road (z = -15.5)
      if (z >= -17.0 && z <= -14.0 && x >= 4.5 && x <= 21.5) return true
      // East road (x = 20.0)
      if (x >= 18.5 && x <= 21.5 && z >= -17.0 && z <= 5.5) return true
      // South Main Avenue (z = 4.5)
      if (z >= 3.0 && z <= 6.0 && x >= -16.5 && x <= 21.5) return true
      // Outer West Avenue (x = -15.0)
      if (x >= -16.5 && x <= -13.5 && z >= 3.5 && z <= 12.5) return true
      // South Connector Avenue (z = 11.5)
      if (z >= 10.0 && z <= 13.0 && x >= -16.5 && x <= -5.5) return true
      // Residential South street (x = -7.0)
      if (x >= -8.5 && x <= -5.5 && z >= -0.5 && z <= 12.5) return true
      // Connector road (z = 0.5)
      if (z >= -1.0 && z <= 2.0 && x >= -8.5 && x <= 7.0) return true
      // West Datacenter road (x = 6.0)
      if (x >= 4.5 && x <= 7.5 && z >= -16.5 && z <= 1.5) return true
      // Carpark facility
      if (x >= 19.5 && x <= 28.5 && z >= -12.5 && z <= -4.5) return true
      // Wind Turbines (South-East clearing)
      const turbines = [
        [11.0, 9.5],
        [18.5, 11.5],
        [14.0, 17.5],
      ]
      for (const [tx, tz] of turbines) {
        if (Math.hypot(x - tx, z - tz) < 3.5) return true
      }
      // Lake water surface
      if (isInsideLake(x, z, 0.4)) return true

      return false
    }

    const trees: InstanceDef[] = []
    const rocks: InstanceDef[] = []
    const treeMinDist = 1.35
    const rockMinDist = 1.1

    // =========================================================================
    // 1. DEEP & EXPANSIVE CLASH OF CLANS FOREST BORDER
    // Extended deep enough so users never see the map cutoffs
    // =========================================================================
    const minX = -50
    const maxX = 52
    const minZ = -48
    const maxZ = 46

    // Candidate grid scanning with organic jitter
    for (let z = minZ; z <= maxZ; z += 1.45) {
      for (let x = minX; x <= maxX; x += 1.45) {
        // Determine if (x, z) lies in the border zone framing the city
        const isNorth = z <= -17.5
        const isSouth = z >= 13.0 || (z >= 6.0 && x < -16.5) || (z >= 20.0 && x >= 8.0)
        const isEast = (x >= 22.0 && (z < -13.0 || z > -4.0)) || x >= 29.0
        const isWest = x <= -16.5

        if (isNorth || isSouth || isEast || isWest) {
          // Organic placement jitter
          const jx = x + (rng() - 0.5) * 1.05
          const jz = z + (rng() - 0.5) * 1.05

          if (!isInsideTown(jx, jz)) {
            // Check minimum distance from other tree trunks
            let tooClose = false
            for (let i = 0; i < trees.length; i++) {
              if (Math.hypot(jx - trees[i].x, jz - trees[i].z) < treeMinDist) {
                tooClose = true
                break
              }
            }

            if (!tooClose) {
              // Uniform scale across all distances - keeping consistent detail everywhere
              const scale = 0.95 + rng() * 0.28

              trees.push({
                x: jx,
                z: jz,
                rotation: rng() * Math.PI * 2,
                scale,
              })
            }
          }
        }
      }
    }

    // =========================================================================
    // 2. SCENIC LAKE NÄSIJÄRVI SHORELINE ROCKS
    // =========================================================================
    for (let angle = 0; angle < Math.PI * 2; angle += 0.15) {
      const d = 1.05 + rng() * 0.18
      const rx = -16.0 + Math.cos(angle) * 15.8 * d + (rng() - 0.5) * 0.7
      const rz = -19.5 + Math.sin(angle) * 10.7 * d + (rng() - 0.5) * 0.7

      if (!isInsideTown(rx, rz) && !isInsideLake(rx, rz, 0.2)) {
        let tooCloseRock = false
        for (let i = 0; i < rocks.length; i++) {
          if (Math.hypot(rx - rocks[i].x, rz - rocks[i].z) < rockMinDist) {
            tooCloseRock = true
            break
          }
        }
        if (!tooCloseRock) {
          rocks.push({
            x: rx,
            z: rz,
            rotation: rng() * Math.PI * 2,
            scale: 0.75 + rng() * 0.45,
          })
        }
      }
    }

    // =========================================================================
    // 3. FOREST EDGE SCATTERED BOULDER & ROCK OUTCROPPINGS
    // Distributed along the treeline and throughout the woods
    // =========================================================================
    for (let i = 0; i < trees.length; i += 6) {
      const t = trees[i]
      const rx = t.x + (rng() - 0.5) * 1.8
      const rz = t.z + (rng() - 0.5) * 1.8
      if (!isInsideTown(rx, rz)) {
        let tooClose = false
        for (let k = 0; k < rocks.length; k++) {
          if (Math.hypot(rx - rocks[k].x, rz - rocks[k].z) < rockMinDist) {
            tooClose = true
            break
          }
        }
        if (!tooClose) {
          rocks.push({
            x: rx,
            z: rz,
            rotation: rng() * Math.PI * 2,
            scale: 0.7 + rng() * 0.5,
          })
        }
      }
    }

    // =========================================================================
    // 4. UNIFORM DISTRIBUTION INTO ALL 5 TREE VARIETIES
    // Exact same rich distribution and detail across ALL distances
    // =========================================================================
    const tStandard: InstanceDef[] = []
    const tCrooked: InstanceDef[] = []
    const tHigh: InstanceDef[] = []
    const tHighCrooked: InstanceDef[] = []
    const tHighRound: InstanceDef[] = []

    trees.forEach((item) => {
      const dice = rng()
      if (dice < 0.22) {
        tStandard.push(item)
      } else if (dice < 0.42) {
        tCrooked.push(item)
      } else if (dice < 0.62) {
        tHigh.push(item)
      } else if (dice < 0.81) {
        tHighCrooked.push(item)
      } else {
        tHighRound.push(item)
      }
    })

    const rLarge: InstanceDef[] = []
    const rSmall: InstanceDef[] = []
    const rWide: InstanceDef[] = []

    rocks.forEach((item, index) => {
      const pick = index % 3
      if (pick === 0) rLarge.push(item)
      else if (pick === 1) rSmall.push(item)
      else rWide.push(item)
    })

    return {
      treeInstances: tStandard,
      treeCrookedInstances: tCrooked,
      treeHighInstances: tHigh,
      treeHighCrookedInstances: tHighCrooked,
      treeHighRoundInstances: tHighRound,
      rockLargeInstances: rLarge,
      rockSmallInstances: rSmall,
      rockWideInstances: rWide,
    }
  }, [])

  return (
    <group>
      {/* 5 Tree Types (Instanced: 5 draw calls total for all trees) */}
      <InstancedBatch mesh={meshTree} instances={treeInstances} castShadow receiveShadow />
      <InstancedBatch mesh={meshTreeCrooked} instances={treeCrookedInstances} castShadow receiveShadow />
      <InstancedBatch mesh={meshTreeHigh} instances={treeHighInstances} castShadow receiveShadow />
      <InstancedBatch mesh={meshTreeHighCrooked} instances={treeHighCrookedInstances} castShadow receiveShadow />
      <InstancedBatch mesh={meshTreeHighRound} instances={treeHighRoundInstances} castShadow receiveShadow />

      {/* 3 Rock Types (Instanced: 3 draw calls total for all rocks) */}
      <InstancedBatch mesh={meshRockLarge} instances={rockLargeInstances} castShadow receiveShadow />
      <InstancedBatch mesh={meshRockSmall} instances={rockSmallInstances} castShadow receiveShadow />
      <InstancedBatch mesh={meshRockWide} instances={rockWideInstances} castShadow receiveShadow />
    </group>
  )
}
