import React, { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

export const Terrain: React.FC = () => {
  const waterRef = useRef<THREE.Mesh>(null)

  // 1. Procedural Stylized Low-Poly Grass Canvas Texture (Calibrated to match House Bushes)
  const grassTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext('2d')!

    // Base: Rich, soft natural green matching the two bushes on the house planter boxes (#44934c)
    ctx.fillStyle = '#44934c'
    ctx.fillRect(0, 0, 512, 512)

    // Soft diamond / isometric geometric mosaic tessellation matching bush facets
    const shades = ['#4a9b52', '#3e8f47', '#4f9f56', '#398442', '#46964e']
    const step = 32
    for (let y = 0; y < 512; y += step) {
      for (let x = 0; x < 512; x += step) {
        const hash = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453
        const shade = shades[Math.floor(Math.abs(hash) % shades.length)]
        ctx.fillStyle = shade
        ctx.globalAlpha = 0.35

        ctx.beginPath()
        ctx.moveTo(x + step / 2, y)
        ctx.lineTo(x + step, y + step / 2)
        ctx.lineTo(x + step / 2, y + step)
        ctx.lineTo(x, y + step / 2)
        ctx.closePath()
        ctx.fill()
      }
    }

    // Stylized low-poly grass blade clusters in harmonized bush tones
    ctx.globalAlpha = 0.55
    for (let i = 0; i < 180; i++) {
      const rx = (Math.sin(i * 37.1) * 0.5 + 0.5) * 512
      const ry = (Math.cos(i * 59.3) * 0.5 + 0.5) * 512
      const sz = 4 + (i % 4) * 1.6

      // Light blade highlight
      ctx.fillStyle = '#6ab665'
      ctx.beginPath()
      ctx.moveTo(rx, ry)
      ctx.lineTo(rx - sz * 0.5, ry - sz * 1.6)
      ctx.lineTo(rx, ry - sz * 0.3)
      ctx.closePath()
      ctx.fill()

      // Center blade
      ctx.fillStyle = '#5ca356'
      ctx.beginPath()
      ctx.moveTo(rx, ry)
      ctx.lineTo(rx, ry - sz * 2.0)
      ctx.lineTo(rx + sz * 0.3, ry - sz * 0.2)
      ctx.closePath()
      ctx.fill()

      // Right blade
      ctx.fillStyle = '#489650'
      ctx.beginPath()
      ctx.moveTo(rx, ry)
      ctx.lineTo(rx + sz * 0.6, ry - sz * 1.5)
      ctx.lineTo(rx, ry)
      ctx.closePath()
      ctx.fill()
    }

    // Sparse Nordic summer meadow wildflowers (white & buttercup yellow daisies)
    ctx.globalAlpha = 0.85
    for (let i = 0; i < 48; i++) {
      const fx = (Math.sin(i * 83.7) * 0.5 + 0.5) * 512
      const fy = (Math.cos(i * 127.3) * 0.5 + 0.5) * 512

      ctx.fillStyle = i % 3 === 0 ? '#fef08a' : '#ffffff'
      ctx.beginPath()
      ctx.arc(fx, fy, 2.2, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = '#f59e0b'
      ctx.beginPath()
      ctx.arc(fx, fy, 0.9, 0, Math.PI * 2)
      ctx.fill()
    }

    ctx.globalAlpha = 1.0
    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(38, 38)
    texture.colorSpace = THREE.SRGBColorSpace
    return texture
  }, [])

  // 2. Lake Näsijärvi Shapes (Organic shoreline and sparkling water surface)
  const lakeShape = useMemo(() => {
    const shape = new THREE.Shape()
    const radiusX = 11.5
    const radiusY = 7.5
    const pointsCount = 48
    for (let i = 0; i <= pointsCount; i++) {
      const angle = (i / pointsCount) * Math.PI * 2
      const wobble =
        1.0 +
        Math.sin(angle * 2) * 0.08 +
        Math.sin(angle * 3) * 0.06 +
        Math.cos(angle * 4 + 1.0) * 0.05 +
        Math.sin(angle * 5) * 0.03
      const x = Math.cos(angle) * radiusX * wobble
      const y = Math.sin(angle) * radiusY * wobble
      if (i === 0) shape.moveTo(x, y)
      else shape.lineTo(x, y)
    }
    return shape
  }, [])

  const shorelineShape = useMemo(() => {
    const shape = new THREE.Shape()
    const radiusX = 12.3
    const radiusY = 8.2
    const pointsCount = 48
    for (let i = 0; i <= pointsCount; i++) {
      const angle = (i / pointsCount) * Math.PI * 2
      const wobble =
        1.0 +
        Math.sin(angle * 2) * 0.08 +
        Math.sin(angle * 3) * 0.06 +
        Math.cos(angle * 4 + 1.0) * 0.05 +
        Math.sin(angle * 5) * 0.03
      const x = Math.cos(angle) * radiusX * wobble
      const y = Math.sin(angle) * radiusY * wobble
      if (i === 0) shape.moveTo(x, y)
      else shape.lineTo(x, y)
    }
    return shape
  }, [])

  // Gentle wave water undulation
  useFrame((state) => {
    if (waterRef.current) {
      const time = state.clock.getElapsedTime()
      waterRef.current.position.y = 0.006 + Math.sin(time * 1.5) * 0.002
    }
  })

  // 3. Road network foundation matching the top-view schematic
  const roadGeometry = useMemo(() => {
    const roadWidth = 1.05
    const halfW = roadWidth / 2

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

      positions.push(p1x, 0.002, p1z)
      positions.push(p2x, 0.002, p2z)
      positions.push(p3x, 0.002, p3z)

      positions.push(p1x, 0.002, p1z)
      positions.push(p3x, 0.002, p3z)
      positions.push(p4x, 0.002, p4z)

      for (let i = 0; i < 6; i++) {
        normals.push(0, 1, 0)
      }
    }

    // 1. Loop encircling Datacenter campus
    addSegment(6.0, -15.5, 20.0, -15.5)
    addSegment(20.0, -15.5, 20.0, 4.5)
    addSegment(20.0, -8.5, 22.8, -8.5)
    addSegment(6.0, -15.5, 6.0, 0.5)
    addSegment(6.0, 0.5, -7.0, 0.5)

    // 2. Main South East-West Avenue
    addSegment(-15.0, 4.5, 20.0, 4.5)

    // 3. Residential South Avenue
    addSegment(-7.0, 0.5, -7.0, 11.5)

    // 4. L-Shaped Connector Avenue
    addSegment(-15.0, 4.5, -15.0, 11.5)
    addSegment(-15.0, 11.5, -7.0, 11.5)

    const geom = new THREE.BufferGeometry()
    geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geom.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
    return geom
  }, [])

  return (
    <group>
      {/* 1. Main Expansive Ground Plane with Light, Soft Stylized Low-Poly Grass */}
      <mesh
        position={[0, -0.05, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[500, 500, 1, 1]} />
        <meshStandardMaterial
          map={grassTexture}
          roughness={0.9}
          metalness={0.0}
        />
      </mesh>

      {/* 2. Lake Näsijärvi in the North-West (with clear lawn buffer from solar panels and Näsinneula tower) */}
      <group position={[-13.5, 0.002, -17.5]}>
        {/* Sandy / Pebble Shoreline Transition Rim */}
        <mesh position={[0, 0.003, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <shapeGeometry args={[shorelineShape]} />
          <meshStandardMaterial color="#c2b280" roughness={0.92} />
        </mesh>

        {/* Lake Water Surface with Stylized Sparkling Cerulean Translucency */}
        <mesh
          ref={waterRef}
          position={[0, 0.006, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <shapeGeometry args={[lakeShape]} />
          <meshStandardMaterial
            color="#38bdf8"
            roughness={0.12}
            metalness={0.25}
            transparent
            opacity={0.88}
          />
        </mesh>

        {/* Scenic Archipelago Islet 1 */}
        <mesh position={[-3.5, 0.03, 1.2]} receiveShadow castShadow>
          <cylinderGeometry args={[0.9, 1.3, 0.06, 7]} />
          <meshStandardMaterial color="#44934c" roughness={0.85} flatShading />
        </mesh>

        {/* Scenic Archipelago Islet 2 */}
        <mesh position={[2.0, 0.03, -1.8]} receiveShadow castShadow>
          <cylinderGeometry args={[0.7, 1.1, 0.06, 6]} />
          <meshStandardMaterial color="#44934c" roughness={0.85} flatShading />
        </mesh>
      </group>

      {/* 3. Road Foundation Underbed */}
      <mesh geometry={roadGeometry} receiveShadow>
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>
    </group>
  )
}
