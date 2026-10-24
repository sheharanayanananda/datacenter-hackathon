import React, { useMemo, useRef, useEffect } from 'react'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'

// Preload Kenney road models
useGLTF.preload('/assets/models/roads/road-straight.glb')
useGLTF.preload('/assets/models/roads/road-bend.glb')
useGLTF.preload('/assets/models/roads/road-intersection.glb')
useGLTF.preload('/assets/models/roads/road-crossroad.glb')
useGLTF.preload('/assets/models/roads/light-curved.glb')

interface TileDef {
  type: 'straight' | 'bend' | 'intersection' | 'crossroad' | 'end';
  x: number;
  z: number;
  rotation: number;
}

interface LightDef {
  x: number;
  z: number;
  rotation: number;
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

// High-performance Instanced Mesh component (consolidates dozens of draw calls into 1)
const InstancedGroup: React.FC<{
  mesh: THREE.Mesh | null;
  items: { x: number; z: number; rotation: number; scale?: number }[];
  castShadow?: boolean;
  receiveShadow?: boolean;
}> = ({ mesh, items, castShadow = false, receiveShadow = false }) => {
  const instancedRef = useRef<THREE.InstancedMesh>(null)

  useEffect(() => {
    if (!instancedRef.current || items.length === 0) return
    const dummy = new THREE.Object3D()
    items.forEach((item, i) => {
      const s = item.scale ?? 1.0
      dummy.position.set(item.x, 0.005, item.z)
      dummy.rotation.set(0, item.rotation, 0)
      dummy.scale.set(s, s, s)
      dummy.updateMatrix()
      instancedRef.current!.setMatrixAt(i, dummy.matrix)
    })
    instancedRef.current.instanceMatrix.needsUpdate = true
  }, [items])

  if (!mesh || items.length === 0) return null

  return (
    <instancedMesh
      ref={instancedRef}
      args={[mesh.geometry, mesh.material, items.length]}
      castShadow={castShadow}
      receiveShadow={receiveShadow}
    />
  )
}

// High-performance Instanced Street Light Bulbs (0 lighting shader overhead, crisp warm glow)
const InstancedBulbs: React.FC<{ lights: LightDef[] }> = ({ lights }) => {
  const instancedRef = useRef<THREE.InstancedMesh>(null)
  const bulbGeom = useMemo(() => new THREE.SphereGeometry(0.038, 8, 8), [])
  const bulbMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#fef3c7',
        emissive: '#fbbf24',
        emissiveIntensity: 2.0,
        roughness: 0.1,
      }),
    []
  )

  useEffect(() => {
    if (!instancedRef.current || lights.length === 0) return
    const dummy = new THREE.Object3D()
    lights.forEach((light, i) => {
      // Offset of lamp bulb relative to pole base at scale 0.7
      const offset = new THREE.Vector3(0, 0.64 * 0.7, -0.095 * 0.7).applyAxisAngle(
        new THREE.Vector3(0, 1, 0),
        light.rotation
      )
      dummy.position.set(light.x + offset.x, 0.005 + offset.y, light.z + offset.z)
      dummy.scale.set(1, 1, 1)
      dummy.updateMatrix()
      instancedRef.current!.setMatrixAt(i, dummy.matrix)
    })
    instancedRef.current.instanceMatrix.needsUpdate = true
  }, [lights])

  return <instancedMesh ref={instancedRef} args={[bulbGeom, bulbMat, lights.length]} />
}

export const ModularRoads: React.FC = () => {
  const straightGLTF = useGLTF('/assets/models/roads/road-straight.glb')
  const bendGLTF = useGLTF('/assets/models/roads/road-bend.glb')
  const intersectionGLTF = useGLTF('/assets/models/roads/road-intersection.glb')
  const crossroadGLTF = useGLTF('/assets/models/roads/road-crossroad.glb')
  const lightGLTF = useGLTF('/assets/models/roads/light-curved.glb')

  const straightMesh = useMemo(() => getMesh(straightGLTF.scene), [straightGLTF])
  const bendMesh = useMemo(() => getMesh(bendGLTF.scene), [bendGLTF])
  const intersectionMesh = useMemo(() => getMesh(intersectionGLTF.scene), [intersectionGLTF])
  const crossroadMesh = useMemo(() => getMesh(crossroadGLTF.scene), [crossroadGLTF])
  const lightMesh = useMemo(() => getMesh(lightGLTF.scene), [lightGLTF])

  // Calibrate PBR material response for road surfaces and metallic streetlight poles
  useEffect(() => {
    ;[straightMesh, bendMesh, intersectionMesh, crossroadMesh].forEach((mesh) => {
      if (mesh && mesh.material) {
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
        mats.forEach((m) => {
          if (m instanceof THREE.MeshStandardMaterial) {
            m.roughness = 0.72
            m.metalness = 0.1
          }
        })
      }
    })
    if (lightMesh && lightMesh.material) {
      const mats = Array.isArray(lightMesh.material) ? lightMesh.material : [lightMesh.material]
      mats.forEach((m) => {
        if (m instanceof THREE.MeshStandardMaterial) {
          m.roughness = 0.35
          m.metalness = 0.75
        }
      })
    }
  }, [straightMesh, bendMesh, intersectionMesh, crossroadMesh, lightMesh])

  // Road network encircling the 2x2 Datacenter campus cluster and residential quarter
  const roadTiles = useMemo<TileDef[]>(() => {
    const tiles: TileDef[] = []

    // 1. North road of loop: from x = 6.0 to 20.0 along z = -15.5
    // NW corner: connects East (+X) and South (+Z) -> rotation: Math.PI / 2
    tiles.push({ type: 'bend', x: 6.0, z: -15.5, rotation: Math.PI / 2 })
    for (let x = 7.0; x <= 19.0; x += 1.0) {
      tiles.push({ type: 'straight', x, z: -15.5, rotation: 0 })
    }
    // NE corner: connects West (-X) and South (+Z) -> rotation: 0
    tiles.push({ type: 'bend', x: 20.0, z: -15.5, rotation: 0 })

    // 2. East road of loop: from z = -15.5 down to 4.5 along x = 20.0
    // North of Carpark entrance
    for (let z = -14.5; z <= -9.5; z += 1.0) {
      tiles.push({ type: 'straight', x: 20.0, z, rotation: Math.PI / 2 })
    }
    // T-junction at z = -8.5 branching East into Carpark at x = 22.8
    tiles.push({ type: 'intersection', x: 20.0, z: -8.5, rotation: Math.PI / 2 })
    // South of Carpark entrance
    for (let z = -7.5; z <= 3.5; z += 1.0) {
      tiles.push({ type: 'straight', x: 20.0, z, rotation: Math.PI / 2 })
    }
    // SE corner: connects North (-Z) and West (-X) -> rotation: (3 * Math.PI) / 2
    tiles.push({ type: 'bend', x: 20.0, z: 4.5, rotation: (3 * Math.PI) / 2 })

    // 3. West road of loop: from z = -15.5 down to 0.5 along x = 6.0
    for (let z = -14.5; z <= -0.5; z += 1.0) {
      tiles.push({ type: 'straight', x: 6.0, z, rotation: Math.PI / 2 })
    }
    // Mid-West corner: connects North (-Z) and West (-X) -> rotation: (3 * Math.PI) / 2
    tiles.push({ type: 'bend', x: 6.0, z: 0.5, rotation: (3 * Math.PI) / 2 })

    // 4. Connector road: along z = 0.5 from x = 6.0 West to x = -7.0
    for (let x = 5.0; x >= -6.0; x -= 1.0) {
      tiles.push({ type: 'straight', x, z: 0.5, rotation: 0 })
    }
    // Crossway entrance bend: connects East (+X) and South (+Z) -> rotation: Math.PI / 2
    tiles.push({ type: 'bend', x: -7.0, z: 0.5, rotation: Math.PI / 2 })

    // 5. Residential South Street: from z = 0.5 down to 11.5 along x = -7.0
    for (let z = 1.5; z <= 3.5; z += 1.0) {
      tiles.push({ type: 'straight', x: -7.0, z, rotation: Math.PI / 2 })
    }
    // 4-Way Crossroad at South Main Avenue intersection (x = -7.0, z = 4.5)
    tiles.push({ type: 'crossroad', x: -7.0, z: 4.5, rotation: 0 })
    for (let z = 5.5; z <= 10.5; z += 1.0) {
      tiles.push({ type: 'straight', x: -7.0, z, rotation: Math.PI / 2 })
    }
    // Corner C: connects West (-X) and North (-Z) -> rotation: (3 * Math.PI) / 2
    tiles.push({ type: 'bend', x: -7.0, z: 11.5, rotation: (3 * Math.PI) / 2 })

    // 6. South Main Avenue: from x = 20.0 West to -15.0 along z = 4.5
    // East segment (between East loop road and crossroad)
    for (let x = 19.0; x >= -6.0; x -= 1.0) {
      tiles.push({ type: 'straight', x, z: 4.5, rotation: 0 })
    }
    // West segment (from crossroad to Corner A at x = -15.0)
    for (let x = -8.0; x >= -14.0; x -= 1.0) {
      tiles.push({ type: 'straight', x, z: 4.5, rotation: 0 })
    }
    // Corner A: connects East (+X) and South (+Z) -> rotation: Math.PI / 2
    tiles.push({ type: 'bend', x: -15.0, z: 4.5, rotation: Math.PI / 2 })

    // 7. L-Shaped Connector Road (completing the full-town loop)
    // Outer West Avenue: along x = -15.0 from z = 5.5 to 10.5 heading South
    for (let z = 5.5; z <= 10.5; z += 1.0) {
      tiles.push({ type: 'straight', x: -15.0, z, rotation: Math.PI / 2 })
    }
    // Corner B: connects North (-Z) and East (+X) -> rotation: Math.PI (180 deg)
    tiles.push({ type: 'bend', x: -15.0, z: 11.5, rotation: Math.PI })
    // South Connector Avenue: along z = 11.5 from x = -14.0 to -8.0 heading East
    for (let x = -14.0; x <= -8.0; x += 1.0) {
      tiles.push({ type: 'straight', x, z: 11.5, rotation: 0 })
    }

    return tiles
  }, [])

  // Partition tiles by type for efficient instancing
  const straightTiles = useMemo(() => roadTiles.filter((t) => t.type === 'straight'), [roadTiles])
  const bendTiles = useMemo(() => roadTiles.filter((t) => t.type === 'bend'), [roadTiles])
  const intersectionTiles = useMemo(() => roadTiles.filter((t) => t.type === 'intersection'), [roadTiles])
  const crossroadTiles = useMemo(() => roadTiles.filter((t) => t.type === 'crossroad'), [roadTiles])

  // Orderly street light placements along sidewalks facing INWARD over the roadway
  const streetLights = useMemo<LightDef[]>(() => [
    // 1. South Main Avenue (south sidewalk at z = 4.96, facing North [-Z] into road)
    { x: 18.0, z: 4.96, rotation: 0 },
    { x: 14.5, z: 4.96, rotation: 0 },
    { x: 11.0, z: 4.96, rotation: 0 },
    { x: 7.5, z: 4.96, rotation: 0 },
    { x: 4.0, z: 4.96, rotation: 0 },
    { x: 0.5, z: 4.96, rotation: 0 },
    { x: -3.0, z: 4.96, rotation: 0 },
    { x: -9.5, z: 4.96, rotation: 0 },
    { x: -13.0, z: 4.96, rotation: 0 },

    // 2. Outer West Avenue (west sidewalk at x = -15.46, facing East [+X] into road)
    { x: -15.46, z: 7.0, rotation: -Math.PI / 2 },
    { x: -15.46, z: 10.0, rotation: -Math.PI / 2 },

    // 3. South Connector Avenue (south sidewalk at z = 11.96, facing North [-Z] into road)
    { x: -13.0, z: 11.96, rotation: 0 },
    { x: -9.5, z: 11.96, rotation: 0 },

    // 4. Residential South Street (east sidewalk at x = -6.54, facing West [-X] into road)
    { x: -6.54, z: 2.0, rotation: Math.PI / 2 },
    { x: -6.54, z: 6.5, rotation: Math.PI / 2 },
    { x: -6.54, z: 9.5, rotation: Math.PI / 2 },

    // 5. North Datacenter Road (north sidewalk at z = -15.96, facing South [+Z] into road)
    { x: 8.0, z: -15.96, rotation: Math.PI },
    { x: 11.5, z: -15.96, rotation: Math.PI },
    { x: 15.0, z: -15.96, rotation: Math.PI },
    { x: 18.5, z: -15.96, rotation: Math.PI },

    // 6. East Datacenter Road (east sidewalk at x = 20.46, facing West [-X] into road)
    { x: 20.46, z: -13.0, rotation: Math.PI / 2 },
    { x: 20.46, z: -10.5, rotation: Math.PI / 2 },
    { x: 20.46, z: -6.5, rotation: Math.PI / 2 },
    { x: 20.46, z: -3.0, rotation: Math.PI / 2 },
    { x: 20.46, z: 0.5, rotation: Math.PI / 2 },
    { x: 20.46, z: 3.0, rotation: Math.PI / 2 },

    // 7. Connector Road (north sidewalk at z = 0.04, facing South [+Z] into road)
    { x: -4.5, z: 0.04, rotation: Math.PI },
    { x: -1.0, z: 0.04, rotation: Math.PI },
    { x: 2.5, z: 0.04, rotation: Math.PI },

    // 8. West Datacenter Road (west sidewalk at x = 5.54, facing East [+X] into road)
    { x: 5.54, z: -12.5, rotation: -Math.PI / 2 },
    { x: 5.54, z: -8.5, rotation: -Math.PI / 2 },
    { x: 5.54, z: -4.5, rotation: -Math.PI / 2 },
    { x: 5.54, z: -1.5, rotation: -Math.PI / 2 },
  ], [])

  const streetlightInstances = useMemo(
    () => streetLights.map((l) => ({ x: l.x, z: l.z, rotation: l.rotation, scale: 0.7 })),
    [streetLights]
  )

  return (
    <group>
      {/* High-Performance Instanced Road Meshes (Consolidates 80+ meshes into 4 draw calls) */}
      <InstancedGroup mesh={straightMesh} items={straightTiles} receiveShadow />
      <InstancedGroup mesh={bendMesh} items={bendTiles} receiveShadow />
      <InstancedGroup mesh={intersectionMesh} items={intersectionTiles} receiveShadow />
      <InstancedGroup mesh={crossroadMesh} items={crossroadTiles} receiveShadow />

      {/* High-Performance Instanced Streetlights (1 draw call for all 33 poles) */}
      <InstancedGroup mesh={lightMesh} items={streetlightInstances} castShadow />

      {/* High-Performance Instanced Glowing Bulbs (1 draw call, 0 lighting shader cost) */}
      <InstancedBulbs lights={streetLights} />
    </group>
  )
}
