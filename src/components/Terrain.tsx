import React, { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

// Helper to determine if a point (x, z) is inside the random organic lake perimeter
function isInsideLake(x: number, z: number, rx: number, rz: number, scale = 1.0): boolean {
  const angle = Math.atan2(z, x)
  // Multi-frequency harmonic wobble generating natural bays, peninsulas, and coves
  const wobble =
    1.0 +
    Math.sin(angle * 2.0) * 0.22 +
    Math.cos(angle * 3.0 + 1.2) * 0.18 +
    Math.sin(angle * 5.0 - 0.7) * 0.12 +
    Math.cos(angle * 7.0) * 0.08

  const maxDist = Math.hypot(Math.cos(angle) * rx, Math.sin(angle) * rz) * wobble * scale
  return Math.hypot(x, z) <= maxDist
}

// Generates a clean, low-poly triangulated mesh conforming to the organic lake perimeter
function createLowPolyLakeGeom(rx: number, rz: number, scale = 1.0, step = 1.8): THREE.BufferGeometry {
  const positions: number[] = []
  const indices: number[] = []
  const minX = -32
  const maxX = 30
  const minZ = -24
  const maxZ = 25

  const cols = Math.ceil((maxX - minX) / step)
  const rows = Math.ceil((maxZ - minZ) / step)
  const grid: number[][] = []
  let vertIndex = 0

  for (let r = 0; r <= rows; r++) {
    grid[r] = []
    const z = minZ + r * step
    for (let c = 0; c <= cols; c++) {
      const x = minX + c * step
      if (isInsideLake(x, z, rx, rz, scale)) {
        positions.push(x, 0, z)
        grid[r][c] = vertIndex++
      } else {
        grid[r][c] = -1
      }
    }
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const v0 = grid[r][c]
      const v1 = grid[r][c + 1]
      const v2 = grid[r + 1][c]
      const v3 = grid[r + 1][c + 1]

      if (v0 !== -1 && v1 !== -1 && v2 !== -1) {
        indices.push(v0, v1, v2)
      }
      if (v1 !== -1 && v3 !== -1 && v2 !== -1) {
        indices.push(v1, v3, v2)
      }
    }
  }

  const geom = new THREE.BufferGeometry()
  geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geom.setIndex(indices)
  geom.computeVertexNormals()
  return geom
}

export const Terrain: React.FC = () => {
  const waterMeshRef = useRef<THREE.Mesh>(null)
  const baseWaterPositions = useRef<Float32Array | null>(null)

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

  // 2. Large Random-Shape Low-Poly Lake Näsijärvi Geometries
  // Lake dimensions: rx = 26.0, rz = 18.0 (Span: ~58 width x ~45 depth, larger than city!)
  const { shoreGeom, waterGeom, bedGeom } = useMemo(() => {
    const rx = 26.0
    const rz = 18.0

    const wGeom = createLowPolyLakeGeom(rx, rz, 1.0, 1.8)
    // Cache original water vertex positions for wave displacement
    baseWaterPositions.current = new Float32Array(wGeom.attributes.position.array)

    return {
      shoreGeom: createLowPolyLakeGeom(rx, rz, 1.08, 1.8), // Sandy shoreline transition
      waterGeom: wGeom,                                    // Faceted low-poly water
      bedGeom: createLowPolyLakeGeom(rx, rz, 0.82, 2.2),   // Deep submerged basin
    }
  }, [])

  // 3. Faceted Low-Poly Water Wave Undulation Animation
  useFrame((state) => {
    if (!waterMeshRef.current || !baseWaterPositions.current) return
    const geom = waterMeshRef.current.geometry
    const pos = geom.attributes.position
    const base = baseWaterPositions.current
    const time = state.clock.getElapsedTime() * 1.4

    for (let i = 0; i < pos.count; i++) {
      const idx = i * 3
      const x = base[idx]
      const z = base[idx + 2]

      // Organic low-poly undulating waves
      const wave =
        Math.sin(x * 0.35 + time) * Math.cos(z * 0.35 + time * 0.85) * 0.11 +
        Math.sin(x * 0.7 - time * 1.5) * 0.04

      pos.setY(i, wave)
    }

    pos.needsUpdate = true
    geom.computeVertexNormals()
  })

  // 4. Road network matching the top-view schematic
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

      {/* 2. Expansive Random-Shape Low-Poly Lake Näsijärvi (North-West, spanning larger than city) */}
      <group position={[-15.0, 0.002, -28.0]}>
        {/* Layer A: Smooth Low-Poly Sandy Shoreline Transition (Grass -> Beach) */}
        <mesh geometry={shoreGeom} position={[0, 0.002, 0]} receiveShadow>
          <meshStandardMaterial
            color="#ebd59b" // Soft warm golden sand
            roughness={0.88}
            metalness={0.02}
            flatShading
          />
        </mesh>

        {/* Layer B: Deep Submerged Lakebed Basin (Providing realistic depth) */}
        <mesh geometry={bedGeom} position={[0, -0.32, 0]}>
          <meshStandardMaterial
            color="#0284c7" // Deep Nordic blue underwater basin
            roughness={0.92}
            metalness={0.05}
            flatShading
          />
        </mesh>

        {/* Layer C: Animated Faceted Low-Poly Water Surface */}
        <mesh
          ref={waterMeshRef}
          geometry={waterGeom}
          position={[0, 0.008, 0]}
          receiveShadow
        >
          <meshStandardMaterial
            color="#38bdf8" // Vibrant sparkling clear cerulean water
            roughness={0.12}
            metalness={0.25}
            flatShading
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
