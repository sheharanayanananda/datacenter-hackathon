import React, { useMemo } from 'react'
import * as THREE from 'three'

export const Terrain: React.FC = () => {
  // Road network matching the user's top-view schematic
  const roadGeometry = useMemo(() => {
    // We create the road network by combining road strips with clean intersections
    const roadWidth = 1.05
    const halfW = roadWidth / 2

    // Helper to add a straight road segment [x1, z1] -> [x2, z2]
    const positions: number[] = []
    const normals: number[] = []

    const addSegment = (x1: number, z1: number, x2: number, z2: number) => {
      const dx = x2 - x1
      const dz = z2 - z1
      const len = Math.hypot(dx, dz)
      if (len === 0) return
      const nx = -dz / len
      const nz = dx / len

      const p1x = x1 + nx * halfW
      const p1z = z1 + nz * halfW

      const p2x = x1 - nx * halfW
      const p2z = z1 - nz * halfW

      const p3x = x2 - nx * halfW
      const p3z = z2 - nz * halfW

      const p4x = x2 + nx * halfW
      const p4z = z2 + nz * halfW

      // Triangle 1
      positions.push(p1x, 0.002, p1z)
      positions.push(p2x, 0.002, p2z)
      positions.push(p3x, 0.002, p3z)

      // Triangle 2
      positions.push(p1x, 0.002, p1z)
      positions.push(p3x, 0.002, p3z)
      positions.push(p4x, 0.002, p4z)

      for (let i = 0; i < 6; i++) {
        normals.push(0, 1, 0)
      }
    }

    // 1. Loop encircling the 2x2 Datacenter campus cluster
    // North road of loop
    addSegment(6.0, -15.5, 20.0, -15.5)
    // East road of loop (between Datacenter & Carpark)
    addSegment(20.0, -15.5, 20.0, 4.5)
    // Carpark driveway branch
    addSegment(20.0, -8.5, 22.8, -8.5)
    // West road of loop
    addSegment(6.0, -15.5, 6.0, 0.5)
    // Connector road from West loop edge heading to Residential quarter
    addSegment(6.0, 0.5, -7.0, 0.5)

    // 2. Main South East-West Avenue (from x = -15.0 to 20.0 along z = 4.5)
    addSegment(-15.0, 4.5, 20.0, 4.5)

    // 3. Residential South Avenue (extended to z = 11.5 at x = -7.0)
    addSegment(-7.0, 0.5, -7.0, 11.5)

    const geom = new THREE.BufferGeometry()
    geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geom.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
    return geom
  }, [])

  // Lake shape: large smooth oval in the North-West
  const lakeShape = useMemo(() => {
    const shape = new THREE.Shape()
    // Elliptical organic perimeter
    const radiusX = 13.5
    const radiusY = 7.5
    const pointsCount = 36
    for (let i = 0; i <= pointsCount; i++) {
      const angle = (i / pointsCount) * Math.PI * 2
      // subtle organic distortion
      const wobble = 1.0 + Math.sin(angle * 3) * 0.06 + Math.cos(angle * 2) * 0.04
      const x = Math.cos(angle) * radiusX * wobble
      const y = Math.sin(angle) * radiusY * wobble
      if (i === 0) shape.moveTo(x, y)
      else shape.lineTo(x, y)
    }
    return shape
  }, [])


  return (
    <group>
      {/* 1. Main Expansive Flat Ground Plane */}
      <mesh
        position={[0, -0.05, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[500, 500, 1, 1]} />
        <meshStandardMaterial
          color="#577943"
          roughness={0.85}
          metalness={0.05}
        />
      </mesh>

      {/* 2. Lake Näsijärvi in the North-West (Top-Left) */}
      <group position={[-11.5, 0.002, -18.5]}>
        {/* Sandy / Pebble Shoreline Rim */}
        <mesh position={[0, 0.003, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <shapeGeometry args={[lakeShape]} />
          <meshStandardMaterial color="#887858" roughness={0.95} />
        </mesh>
        {/* Lake Water Surface */}
        <mesh position={[0, 0.006, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <shapeGeometry args={[lakeShape]} />
          <meshStandardMaterial
            color="#38bdf8"
            roughness={0.12}
            metalness={0.25}
            transparent
            opacity={0.86}
          />
        </mesh>
      </group>


      {/* 3. Road Foundation Underbed */}
      <mesh geometry={roadGeometry} receiveShadow>
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>


    </group>
  )
}
