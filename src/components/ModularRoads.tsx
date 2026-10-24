import React, { useMemo } from 'react'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'

// Preload Kenney road models
useGLTF.preload('/assets/models/roads/road-straight.glb')
useGLTF.preload('/assets/models/roads/road-bend.glb')
useGLTF.preload('/assets/models/roads/road-intersection.glb')
useGLTF.preload('/assets/models/roads/road-crossroad.glb')
useGLTF.preload('/assets/models/roads/road-end.glb')
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

export const ModularRoads: React.FC = () => {
  const straightGLTF = useGLTF('/assets/models/roads/road-straight.glb')
  const bendGLTF = useGLTF('/assets/models/roads/road-bend.glb')
  const intersectionGLTF = useGLTF('/assets/models/roads/road-intersection.glb')
  const crossroadGLTF = useGLTF('/assets/models/roads/road-crossroad.glb')
  const endGLTF = useGLTF('/assets/models/roads/road-end.glb')
  const lightGLTF = useGLTF('/assets/models/roads/light-curved.glb')

  const straightMesh = useMemo(() => getMesh(straightGLTF.scene), [straightGLTF])
  const bendMesh = useMemo(() => getMesh(bendGLTF.scene), [bendGLTF])
  const intersectionMesh = useMemo(() => getMesh(intersectionGLTF.scene), [intersectionGLTF])
  const crossroadMesh = useMemo(() => getMesh(crossroadGLTF.scene), [crossroadGLTF])
  const endMesh = useMemo(() => getMesh(endGLTF.scene), [endGLTF])
  const lightMesh = useMemo(() => getMesh(lightGLTF.scene), [lightGLTF])

  // Road network encircling the 2x2 Datacenter campus cluster
  const roadTiles = useMemo<TileDef[]>(() => {
    const tiles: TileDef[] = []

    // 1. North road of loop: from x = 6.0 to 20.0 along z = -15.5
    tiles.push({ type: 'bend', x: 6.0, z: -15.5, rotation: Math.PI / 2 })
    for (let x = 7.0; x <= 19.0; x += 1.0) {
      tiles.push({ type: 'straight', x, z: -15.5, rotation: 0 })
    }
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
    // SE corner: connects North (-Z) and West (-X) into Main Avenue
    tiles.push({ type: 'bend', x: 20.0, z: 4.5, rotation: (3 * Math.PI) / 2 })

    // 3. West road of loop: from z = -15.5 down to 0.5 along x = 6.0
    for (let z = -14.5; z <= -0.5; z += 1.0) {
      tiles.push({ type: 'straight', x: 6.0, z, rotation: Math.PI / 2 })
    }
    // Mid-West corner: connects North (-Z) and West (-X) into connector road
    tiles.push({ type: 'bend', x: 6.0, z: 0.5, rotation: (3 * Math.PI) / 2 })

    // 4. Connector road: along z = 0.5 from x = 6.0 West to x = -7.0
    for (let x = 5.0; x >= -6.0; x -= 1.0) {
      tiles.push({ type: 'straight', x, z: 0.5, rotation: 0 })
    }
    // Crossway entrance bend: connects East (+X) and South (+Z)
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
    // South Dead-End termination
    tiles.push({ type: 'end', x: -7.0, z: 11.5, rotation: Math.PI / 2 })

    // 6. South Main Avenue: from x = 20.0 West to -15.0 along z = 4.5
    // East segment (between East loop road and crossroad)
    for (let x = 19.0; x >= -6.0; x -= 1.0) {
      tiles.push({ type: 'straight', x, z: 4.5, rotation: 0 })
    }
    // West segment (from crossroad to West dead-end)
    for (let x = -8.0; x >= -14.0; x -= 1.0) {
      tiles.push({ type: 'straight', x, z: 4.5, rotation: 0 })
    }
    tiles.push({ type: 'end', x: -15.0, z: 4.5, rotation: 0 })

    return tiles
  }, [])

  // Street light placements along sidewalks
  const streetLights = useMemo<LightDef[]>(() => [
    // South Main Avenue (south sidewalk, facing North into road)
    { x: 18.0, z: 4.96, rotation: 0 },
    { x: 14.5, z: 4.96, rotation: 0 },
    { x: 11.0, z: 4.96, rotation: 0 },
    { x: 7.5, z: 4.96, rotation: 0 },
    { x: 4.0, z: 4.96, rotation: 0 },
    { x: 0.5, z: 4.96, rotation: 0 },
    { x: -3.0, z: 4.96, rotation: 0 },
    { x: -9.5, z: 4.96, rotation: 0 },
    { x: -12.5, z: 4.96, rotation: 0 },
    { x: -14.5, z: 4.96, rotation: 0 },

    // Residential South Street (sidewalk lights)
    { x: -6.54, z: 2.0, rotation: -Math.PI / 2 },
    { x: -6.54, z: 6.5, rotation: -Math.PI / 2 },
    { x: -6.54, z: 9.0, rotation: -Math.PI / 2 },
    { x: -7.46, z: 7.5, rotation: Math.PI / 2 },
    { x: -7.46, z: 10.5, rotation: Math.PI / 2 },

    // North Datacenter Road (north sidewalk, facing South into road)
    { x: 8.5, z: -15.96, rotation: Math.PI },
    { x: 13.0, z: -15.96, rotation: Math.PI },
    { x: 17.5, z: -15.96, rotation: Math.PI },

    // East Datacenter Road (east sidewalk, facing West into road - clear of Carpark)
    { x: 20.46, z: -13.0, rotation: Math.PI / 2 },
    { x: 20.46, z: -4.5, rotation: Math.PI / 2 },
    { x: 20.46, z: 1.5, rotation: Math.PI / 2 },

    // West Datacenter Road (west sidewalk, facing East into road)
    { x: 5.54, z: -12.0, rotation: -Math.PI / 2 },
    { x: 5.54, z: -7.0, rotation: -Math.PI / 2 },
    { x: 5.54, z: -2.0, rotation: -Math.PI / 2 },

    // Connector Road
    { x: 2.0, z: 0.04, rotation: Math.PI },
    { x: -2.5, z: 0.04, rotation: Math.PI },
  ], [])

  return (
    <group>
      {/* 1. Road Tiles */}
      {roadTiles.map((t, idx) => {
        let geom: THREE.BufferGeometry | undefined
        let mat: THREE.Material | THREE.Material[] | undefined

        switch (t.type) {
          case 'straight':
            geom = straightMesh?.geometry
            mat = straightMesh?.material
            break
          case 'bend':
            geom = bendMesh?.geometry
            mat = bendMesh?.material
            break
          case 'intersection':
            geom = intersectionMesh?.geometry
            mat = intersectionMesh?.material
            break
          case 'crossroad':
            geom = crossroadMesh?.geometry
            mat = crossroadMesh?.material
            break
          case 'end':
            geom = endMesh?.geometry
            mat = endMesh?.material
            break
        }

        if (!geom || !mat) return null

        return (
          <mesh
            key={`road-tile-${idx}`}
            geometry={geom}
            material={mat}
            position={[t.x, 0.01, t.z]}
            rotation={[0, t.rotation, 0]}
            receiveShadow
          />
        )
      })}

      {/* 2. Streetlights with night glow */}
      {streetLights.map((l, idx) => {
        if (!lightMesh) return null
        return (
          <group key={`light-${idx}`} position={[l.x, 0.01, l.z]} rotation={[0, l.rotation, 0]}>
            <mesh
              geometry={lightMesh.geometry}
              material={lightMesh.material}
              castShadow
            />
            {/* Luminaire warm lamp glow nestled inside fixture head */}
            <mesh position={[0, 0.64, -0.15]}>
              <sphereGeometry args={[0.028, 8, 8]} />
              <meshBasicMaterial color="#fef08a" />
            </mesh>
            {/* Soft pool of light beneath fixture */}
            {idx % 3 === 0 && (
              <pointLight
                position={[0, 0.6, -0.15]}
                color="#fde047"
                intensity={0.65}
                distance={2.5}
              />
            )}
          </group>
        )
      })}
    </group>
  )
}
