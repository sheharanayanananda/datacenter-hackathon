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

  // Assemble road tiles following the planned schematic:
  // 1. Loop encircling Datacenter at [6.5, 0, 0]:
  //    - North road: from x = 3.0 to 10.0 along z = -3.5
  //    - East road: from z = -3.5 to 3.5 along x = 10.0 (between Datacenter & Carpark)
  //    - West road: along x = 3.0 from z = -3.5 to 0.5
  //    - Connector road: from x = 3.0 to -6.0 along z = 0.5
  // 2. South Main Avenue: from x = 10.0 to -11.0 along z = 3.5
  // 3. Residential South Street: from z = 0.5 down to z = 8.5 along x = -6.0
  const roadTiles = useMemo<TileDef[]>(() => {
    const tiles: TileDef[] = []

    // 1. North road: from x = 3.0 to 10.0 along z = -3.5
    // NW corner: connects East (+X) and South (+Z)
    tiles.push({ type: 'bend', x: 3.0, z: -3.5, rotation: Math.PI / 2 })
    for (let x = 4.0; x <= 9.0; x += 1.0) {
      tiles.push({ type: 'straight', x, z: -3.5, rotation: 0 })
    }
    // NE corner: connects West (-X) and South (+Z)
    tiles.push({ type: 'bend', x: 10.0, z: -3.5, rotation: 0 })

    // 2. East road: from z = -3.5 to 3.5 along x = 10.0
    tiles.push({ type: 'straight', x: 10.0, z: -2.5, rotation: Math.PI / 2 })
    tiles.push({ type: 'straight', x: 10.0, z: -1.5, rotation: Math.PI / 2 })
    tiles.push({ type: 'straight', x: 10.0, z: -0.5, rotation: Math.PI / 2 })
    // T-junction at z = 0.5 branching East (+X) into the Carpark
    tiles.push({ type: 'intersection', x: 10.0, z: 0.5, rotation: Math.PI / 2 })
    tiles.push({ type: 'straight', x: 10.0, z: 1.5, rotation: Math.PI / 2 })
    tiles.push({ type: 'straight', x: 10.0, z: 2.5, rotation: Math.PI / 2 })
    // SE corner: connects North (-Z) and West (-X)
    tiles.push({ type: 'bend', x: 10.0, z: 3.5, rotation: (3 * Math.PI) / 2 })

    // 3. West road: from z = -3.5 to 0.5 along x = 3.0
    tiles.push({ type: 'straight', x: 3.0, z: -2.5, rotation: Math.PI / 2 })
    tiles.push({ type: 'straight', x: 3.0, z: -1.5, rotation: Math.PI / 2 })
    tiles.push({ type: 'straight', x: 3.0, z: -0.5, rotation: Math.PI / 2 })
    // Mid-West corner: connects North (-Z) and West (-X)
    tiles.push({ type: 'bend', x: 3.0, z: 0.5, rotation: (3 * Math.PI) / 2 })

    // 4. Connector road: from x = 3.0 to -6.0 along z = 0.5
    for (let x = 2.0; x >= -5.0; x -= 1.0) {
      tiles.push({ type: 'straight', x, z: 0.5, rotation: 0 })
    }
    // Crossway entrance bend: connects East (+X) and South (+Z)
    tiles.push({ type: 'bend', x: -6.0, z: 0.5, rotation: Math.PI / 2 })

    // 5. Residential South Street: from z = 0.5 to 8.5 along x = -6.0
    tiles.push({ type: 'straight', x: -6.0, z: 1.5, rotation: Math.PI / 2 })
    tiles.push({ type: 'straight', x: -6.0, z: 2.5, rotation: Math.PI / 2 })
    // Central 4-way crossroad at Main Avenue intersection
    tiles.push({ type: 'crossroad', x: -6.0, z: 3.5, rotation: 0 })
    tiles.push({ type: 'straight', x: -6.0, z: 4.5, rotation: Math.PI / 2 })
    tiles.push({ type: 'straight', x: -6.0, z: 5.5, rotation: Math.PI / 2 })
    tiles.push({ type: 'straight', x: -6.0, z: 6.5, rotation: Math.PI / 2 })
    tiles.push({ type: 'straight', x: -6.0, z: 7.5, rotation: Math.PI / 2 })
    // South Dead-End
    tiles.push({ type: 'end', x: -6.0, z: 8.5, rotation: Math.PI / 2 })

    // 6. South Main Avenue: from x = 10.0 to -11.0 along z = 3.5
    for (let x = 9.0; x >= -5.0; x -= 1.0) {
      tiles.push({ type: 'straight', x, z: 3.5, rotation: 0 })
    }
    for (let x = -7.0; x >= -10.0; x -= 1.0) {
      tiles.push({ type: 'straight', x, z: 3.5, rotation: 0 })
    }
    // West Dead-End
    tiles.push({ type: 'end', x: -11.0, z: 3.5, rotation: 0 })

    return tiles
  }, [])

  // Street light placements along the sidewalks
  const streetLights = useMemo<LightDef[]>(() => [
    // South Main Avenue (south sidewalk, facing North into road)
    { x: 8.5, z: 3.96, rotation: 0 },
    { x: 5.5, z: 3.96, rotation: 0 },
    { x: 2.5, z: 3.96, rotation: 0 },
    { x: -0.5, z: 3.96, rotation: 0 },
    { x: -3.5, z: 3.96, rotation: 0 },
    { x: -8.5, z: 3.96, rotation: 0 },
    { x: -10.5, z: 3.96, rotation: 0 },

    // North Datacenter Road (north sidewalk, facing South into road)
    { x: 5.0, z: -3.96, rotation: Math.PI },
    { x: 8.0, z: -3.96, rotation: Math.PI },

    // East Datacenter Road (east sidewalk, facing West into road)
    { x: 10.46, z: -1.5, rotation: Math.PI / 2 },
    { x: 10.46, z: 1.8, rotation: Math.PI / 2 },

    // West Datacenter Road (west sidewalk, facing East into road)
    { x: 2.54, z: -1.5, rotation: -Math.PI / 2 },

    // Connector Road (north sidewalk, facing South into road)
    { x: 1.0, z: 0.04, rotation: Math.PI },
    { x: -2.0, z: 0.04, rotation: Math.PI },
    { x: -4.5, z: 0.04, rotation: Math.PI },

    // Residential South Street (west sidewalk, facing East into road)
    { x: -6.46, z: 2.0, rotation: -Math.PI / 2 },
    { x: -6.46, z: 5.5, rotation: -Math.PI / 2 },
    { x: -6.46, z: 7.5, rotation: -Math.PI / 2 },
  ], [])

  return (
    <group name="modular-road-network">
      {/* 1. Road Tiles */}
      {roadTiles.map((tile, idx) => {
        let mesh: THREE.Mesh | null = null
        switch (tile.type) {
          case 'straight':
            mesh = straightMesh
            break
          case 'bend':
            mesh = bendMesh
            break
          case 'intersection':
            mesh = intersectionMesh
            break
          case 'crossroad':
            mesh = crossroadMesh
            break
          case 'end':
            mesh = endMesh
            break
        }

        if (!mesh) return null

        return (
          <mesh
            key={`road-tile-${idx}`}
            geometry={mesh.geometry}
            material={mesh.material}
            position={[tile.x, 0.005, tile.z]}
            rotation={[0, tile.rotation, 0]}
            receiveShadow
          />
        )
      })}

      {/* 2. Street Lights */}
      {lightMesh &&
        streetLights.map((light, idx) => (
          <group
            key={`streetlight-${idx}`}
            position={[light.x, 0.005, light.z]}
            rotation={[0, light.rotation, 0]}
          >
            {/* The Kenney 3D Light Pole */}
            <mesh
              geometry={lightMesh.geometry}
              material={lightMesh.material}
              castShadow
              receiveShadow
            />
            {/* Soft Warm Luminaire Glow at lamp head */}
            <mesh position={[0, 0.65, -0.15]}>
              <sphereGeometry args={[0.035, 8, 8]} />
              <meshBasicMaterial color="#fef08a" />
            </mesh>
            <pointLight
              position={[0, 0.62, -0.15]}
              intensity={0.25}
              distance={2.5}
              color="#fef08a"
            />
          </group>
        ))}
    </group>
  )
}
