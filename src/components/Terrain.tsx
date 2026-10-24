import React, { useMemo } from 'react'
import * as THREE from 'three'

export const Terrain: React.FC = () => {
  // Road loop coordinates around the Data Center
  const roadCurve = useMemo(() => {
    const points = [
      new THREE.Vector3(-2.8, 0.05, -2.2),
      new THREE.Vector3(2.6, 0.05, -2.2),
      new THREE.Vector3(3.2, 0.05, 0),
      new THREE.Vector3(2.8, 0.05, 2.4),
      new THREE.Vector3(-2.6, 0.05, 2.4),
      new THREE.Vector3(-3.2, 0.05, 0),
    ]
    return new THREE.CatmullRomCurve3(points, true, 'centripetal')
  }, [])

  // Road geometry with extruded width
  const roadGeo = useMemo(() => {
    const pts = roadCurve.getSpacedPoints(60)
    const geom = new THREE.BufferGeometry()
    const positions: number[] = []
    const normals: number[] = []

    const halfWidth = 0.55

    for (let i = 0; i < pts.length; i++) {
      const p = pts[i]
      const nextP = pts[(i + 1) % pts.length]
      const tangent = new THREE.Vector3().subVectors(nextP, p).normalize()
      const up = new THREE.Vector3(0, 1, 0)
      const normal = new THREE.Vector3().crossVectors(tangent, up).normalize()

      const pLeft = p.clone().addScaledVector(normal, halfWidth)
      const pRight = p.clone().addScaledVector(normal, -halfWidth)

      const nextNormal = new THREE.Vector3()
        .crossVectors(
          new THREE.Vector3()
            .subVectors(pts[(i + 2) % pts.length], nextP)
            .normalize(),
          up
        )
        .normalize()

      const pNextLeft = nextP.clone().addScaledVector(nextNormal, halfWidth)
      const pNextRight = nextP.clone().addScaledVector(nextNormal, -halfWidth)

      // Triangle 1
      positions.push(pLeft.x, 0.03, pLeft.z)
      positions.push(pRight.x, 0.03, pRight.z)
      positions.push(pNextLeft.x, 0.03, pNextLeft.z)

      // Triangle 2
      positions.push(pRight.x, 0.03, pRight.z)
      positions.push(pNextRight.x, 0.03, pNextRight.z)
      positions.push(pNextLeft.x, 0.03, pNextLeft.z)

      for (let k = 0; k < 6; k++) {
        normals.push(0, 1, 0)
      }
    }

    geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geom.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
    geom.computeVertexNormals()
    return geom
  }, [roadCurve])

  // Road branch heading North towards distant town (Flat on terrain)
  const hillRoadGeo = useMemo(() => {
    const points = [
      new THREE.Vector3(0, 0.03, -2.2),
      new THREE.Vector3(0.4, 0.03, -3.6),
      new THREE.Vector3(1.2, 0.03, -4.8),
      new THREE.Vector3(2.4, 0.03, -6.6),
      new THREE.Vector3(3.6, 0.03, -9.0),
      new THREE.Vector3(5.2, 0.03, -12.5),
      new THREE.Vector3(7.0, 0.03, -16.5),
    ]
    const curve = new THREE.CatmullRomCurve3(points)
    const pts = curve.getSpacedPoints(50)
    const positions: number[] = []
    const normals: number[] = []
    const halfWidth = 0.5

    for (let i = 0; i < pts.length - 1; i++) {
      const p = pts[i]
      const nextP = pts[i + 1]
      const tangent = new THREE.Vector3().subVectors(nextP, p).normalize()
      const up = new THREE.Vector3(0, 1, 0)
      const normal = new THREE.Vector3().crossVectors(tangent, up).normalize()

      const pLeft = p.clone().addScaledVector(normal, halfWidth)
      const pRight = p.clone().addScaledVector(normal, -halfWidth)
      const pNextLeft = nextP.clone().addScaledVector(normal, halfWidth)
      const pNextRight = nextP.clone().addScaledVector(normal, -halfWidth)

      positions.push(pLeft.x, 0.03, pLeft.z)
      positions.push(pRight.x, 0.03, pRight.z)
      positions.push(pNextLeft.x, 0.03, pNextLeft.z)

      positions.push(pRight.x, 0.03, pRight.z)
      positions.push(pNextRight.x, 0.03, pNextRight.z)
      positions.push(pNextLeft.x, 0.03, pNextLeft.z)

      for (let k = 0; k < 6; k++) {
        normals.push(0, 1, 0)
      }
    }
    const geom = new THREE.BufferGeometry()
    geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geom.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
    return geom
  }, [])

  // Snow patches scattered naturally across the expanded terrain
  const snowPatches: [number, number, number, number][] = [
    [-1.8, 0.02, 1.8, 0.5],
    [-2.2, 0.02, 2.9, 0.65],
    [0.8, 0.02, 3.2, 0.4],
    [3.2, 0.02, 3.1, 0.6],
    [4.6, 0.02, 1.2, 0.55],
    [-4.5, 0.02, -0.6, 0.7],
    [-1.5, 0.02, -1.8, 0.45],
    [3.6, 0.02, -1.2, 0.6],
    [-6.5, 0.02, 3.8, 0.7],
    [-8.2, 0.02, 1.4, 0.8],
    [2.4, 0.02, 6.2, 0.65],
    [-3.2, 0.02, 7.5, 0.75],
    [5.8, 0.02, 4.2, 0.6],
    [-5.8, 0.02, -7.5, 0.85],
    [1.8, 0.02, -7.2, 0.7],
  ]

  return (
    <group>
      {/* 1. Main Expansive Ground Plane (Completely Flat) */}
      <mesh
        position={[0, -0.05, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[110, 110, 1, 1]} />
        <meshStandardMaterial
          color="#577943"
          roughness={0.85}
          metalness={0.05}
        />
      </mesh>

      {/* 2. Expansive Lake / Fjord (Top-Right / East extending flush with terrain) */}
      <group position={[15.0, 0.002, -8.0]}>
        {/* Shoreline Sand/Gravel Edge */}
        <mesh position={[-6.2, 0.004, 2.0]} rotation={[-Math.PI / 2, 0, 0.2]} receiveShadow>
          <planeGeometry args={[5, 30]} />
          <meshStandardMaterial color="#887858" roughness={0.95} flatShading />
        </mesh>

        {/* Vast Water Surface with stylized translucent cyan sheen */}
        <mesh position={[4, 0.006, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[42, 42]} />
          <meshStandardMaterial
            color="#38bdf8"
            roughness={0.12}
            metalness={0.25}
            transparent
            opacity={0.85}
          />
        </mesh>

        {/* Archipelago Island 1 (closest to village shore) */}
        <group position={[-7.5, 0.04, 5.0]}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[1.2, 1.6, 0.08, 7]} />
            <meshStandardMaterial color="#577943" roughness={0.9} flatShading />
          </mesh>
        </group>

        {/* Archipelago Island 2 */}
        <group position={[-5.0, 0.04, 3.2]}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[1.5, 2.0, 0.08, 8]} />
            <meshStandardMaterial color="#577943" roughness={0.9} flatShading />
          </mesh>
        </group>

        {/* Archipelago Island 3 */}
        <group position={[-2.5, 0.04, -0.5]}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[1.4, 1.8, 0.08, 7]} />
            <meshStandardMaterial color="#577943" roughness={0.9} flatShading />
          </mesh>
        </group>
      </group>

      {/* 4. Asphalt Road Network */}
      <mesh geometry={roadGeo} receiveShadow>
        <meshStandardMaterial color="#334155" roughness={0.6} />
      </mesh>
      <mesh geometry={hillRoadGeo} receiveShadow>
        <meshStandardMaterial color="#334155" roughness={0.6} />
      </mesh>

      {/* Road Curbs (Light grey borders along the data center) */}
      <mesh position={[0, 0.04, 1.85]}>
        <boxGeometry args={[4.8, 0.04, 0.1]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>
      <mesh position={[0, 0.04, -1.85]}>
        <boxGeometry args={[4.8, 0.04, 0.1]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>
      <mesh position={[-2.35, 0.04, 0]}>
        <boxGeometry args={[0.1, 0.04, 3.7]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>
      <mesh position={[2.35, 0.04, 0]}>
        <boxGeometry args={[0.1, 0.04, 3.7]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>

      {/* 5. Natural Snow Patches scattered around lawns */}
      {snowPatches.map(([x, y, z, r], idx) => (
        <mesh
          key={idx}
          position={[x, y, z]}
          rotation={[-Math.PI / 2, 0, idx * 0.7]}
          receiveShadow
        >
          <circleGeometry args={[r, 7]} />
          <meshStandardMaterial
            color="#f1f5f9"
            roughness={0.95}
            flatShading
          />
        </mesh>
      ))}
    </group>
  )
}
