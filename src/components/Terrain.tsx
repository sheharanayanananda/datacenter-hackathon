import React, { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'

useGLTF.preload('/assets/models/water/low_poly_water.glb')

export const Terrain: React.FC = () => {
  const waterRef = useRef<THREE.Mesh>(null)
  const baseWaterPositions = useRef<Float32Array | null>(null)
  const waterGltf = useGLTF('/assets/models/water/low_poly_water.glb')

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

  // 1b. Expansive Ground Plane with an Opening Hole for the Deep Lake
  const groundGeom = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(-250, -250)
    shape.lineTo(250, -250)
    shape.lineTo(250, 250)
    shape.lineTo(-250, 250)
    shape.closePath()

    // Lake opening hole centered at [-16.0, -19.5]
    const lakeHole = new THREE.Path()
    const ptsCount = 64
    const rx = 15.4
    const ry = 10.3
    const cx = -16.0
    const cz = -19.5

    for (let i = 0; i <= ptsCount; i++) {
      const angle = (i / ptsCount) * Math.PI * 2
      const wobble =
        1.0 +
        Math.sin(angle * 2) * 0.08 +
        Math.sin(angle * 3) * 0.06 +
        Math.cos(angle * 4 + 1.0) * 0.05 +
        Math.sin(angle * 5) * 0.03
      const x = cx + Math.cos(angle) * rx * wobble
      const y = -cz - Math.sin(angle) * ry * wobble
      if (i === 0) lakeHole.moveTo(x, y)
      else lakeHole.lineTo(x, y)
    }
    shape.holes.push(lakeHole)

    const geom = new THREE.ShapeGeometry(shape)
    // Normalize UV coordinates so grass canvas texture maps identically to a 500x500 plane
    const uv = geom.attributes.uv
    for (let i = 0; i < uv.count; i++) {
      uv.setXY(i, (uv.getX(i) + 250) / 500, (uv.getY(i) + 250) / 500)
    }
    return geom
  }, [])

  // 2. Deep Lake Näsijärvi 3D Basin: Sloping Beach & Sunken Lakebed (Real 3D Depth)
  const { shoreGeom, floorGeom } = useMemo(() => {
    const ptsCount = 64
    const rxOuter = 15.6
    const rzOuter = 10.5
    const rxInner = 11.5
    const rzInner = 7.2

    const shorePositions: number[] = []
    const shoreIndices: number[] = []

    for (let i = 0; i <= ptsCount; i++) {
      const angle = (i / ptsCount) * Math.PI * 2
      const wobble =
        1.0 +
        Math.sin(angle * 2) * 0.08 +
        Math.sin(angle * 3) * 0.06 +
        Math.cos(angle * 4 + 1.0) * 0.05 +
        Math.sin(angle * 5) * 0.03

      // Outer rim flush with grass at y = 0.005
      const ox = Math.cos(angle) * rxOuter * wobble
      const oz = Math.sin(angle) * rzOuter * wobble
      shorePositions.push(ox, 0.005, oz)

      // Inner rim submerged into deep water at y = -1.25
      const ix = Math.cos(angle) * rxInner * wobble
      const iz = Math.sin(angle) * rzInner * wobble
      shorePositions.push(ix, -1.25, iz)
    }

    for (let i = 0; i < ptsCount; i++) {
      const nextI = i + 1
      const out0 = i * 2
      const in0 = i * 2 + 1
      const out1 = nextI * 2
      const in1 = nextI * 2 + 1

      shoreIndices.push(out0, in0, in1)
      shoreIndices.push(out0, in1, out1)
    }

    const sGeom = new THREE.BufferGeometry()
    sGeom.setAttribute('position', new THREE.Float32BufferAttribute(shorePositions, 3))
    sGeom.setIndex(shoreIndices)
    sGeom.computeVertexNormals()

    // Deep sunken lakebed floor at y = -1.25
    const floorShape = new THREE.Shape()
    for (let i = 0; i <= ptsCount; i++) {
      const angle = (i / ptsCount) * Math.PI * 2
      const wobble =
        1.0 +
        Math.sin(angle * 2) * 0.08 +
        Math.sin(angle * 3) * 0.06 +
        Math.cos(angle * 4 + 1.0) * 0.05 +
        Math.sin(angle * 5) * 0.03
      const ix = Math.cos(angle) * rxInner * wobble
      const iz = Math.sin(angle) * rzInner * wobble
      if (i === 0) floorShape.moveTo(ix, -iz)
      else floorShape.lineTo(ix, -iz)
    }
    const fGeom = new THREE.ShapeGeometry(floorShape)

    return { shoreGeom: sGeom, floorGeom: fGeom }
  }, [])

  // 2b. Conformed 3D Low-Poly Faceted Wave Mesh from low_poly_water.glb (Recessed in Deep Basin)
  const lowPolyWaterGeom = useMemo(() => {
    let meshGeom: THREE.BufferGeometry | null = null
    waterGltf.scene.traverse((node) => {
      if (!meshGeom && (node as THREE.Mesh).isMesh) {
        meshGeom = (node as THREE.Mesh).geometry
      }
    })

    if (!meshGeom) return null

    const pos = (meshGeom as THREE.BufferGeometry).attributes.position
    const idx = (meshGeom as THREE.BufferGeometry).index
    if (!idx) return null

    const rx = 15.0
    const rz = 10.0

    const insideLake = (x: number, z: number) => {
      const angle = Math.atan2(z, x)
      const wobble =
        1.0 +
        Math.sin(angle * 2) * 0.08 +
        Math.sin(angle * 3) * 0.06 +
        Math.cos(angle * 4 + 1.0) * 0.05 +
        Math.sin(angle * 5) * 0.03
      const maxDist = Math.hypot(Math.cos(angle) * rx, Math.sin(angle) * rz) * wobble
      return Math.hypot(x, z) <= maxDist * 0.98
    }

    const newPositions: number[] = []
    const newIndices: number[] = []
    const vertexMap = new Map<number, number>()

    for (let i = 0; i < idx.count; i += 3) {
      const i0 = idx.getX(i)
      const i1 = idx.getX(i + 1)
      const i2 = idx.getX(i + 2)

      // Scale to lake dimensions and set surface level recessed at y = -0.18
      const p0 = new THREE.Vector3(pos.getX(i0) * rx, pos.getY(i0) * 2.5 - 0.18, pos.getZ(i0) * rz)
      const p1 = new THREE.Vector3(pos.getX(i1) * rx, pos.getY(i1) * 2.5 - 0.18, pos.getZ(i1) * rz)
      const p2 = new THREE.Vector3(pos.getX(i2) * rx, pos.getY(i2) * 2.5 - 0.18, pos.getZ(i2) * rz)

      const midX = (p0.x + p1.x + p2.x) / 3
      const midZ = (p0.z + p1.z + p2.z) / 3

      if (insideLake(midX, midZ)) {
        const getOrAdd = (origIdx: number, p: THREE.Vector3) => {
          if (!vertexMap.has(origIdx)) {
            const newIdx = newPositions.length / 3
            newPositions.push(p.x, p.y, p.z)
            vertexMap.set(origIdx, newIdx)
            return newIdx
          }
          return vertexMap.get(origIdx)!
        }

        const v0 = getOrAdd(i0, p0)
        const v1 = getOrAdd(i1, p1)
        const v2 = getOrAdd(i2, p2)
        newIndices.push(v0, v1, v2)
      }
    }

    const geom = new THREE.BufferGeometry()
    geom.setAttribute('position', new THREE.Float32BufferAttribute(newPositions, 3))
    geom.setIndex(newIndices)
    geom.computeVertexNormals()

    baseWaterPositions.current = new Float32Array(newPositions)
    return geom
  }, [waterGltf])

  // Dynamic low-poly wave undulation and glinting sunlight reflections
  useFrame((state) => {
    if (waterRef.current && baseWaterPositions.current) {
      const time = state.clock.getElapsedTime()
      const posAttr = waterRef.current.geometry.attributes.position
      const arr = posAttr.array as Float32Array
      const base = baseWaterPositions.current
      for (let i = 0; i < arr.length; i += 3) {
        const x = base[i]
        const z = base[i + 2]
        arr[i + 1] =
          base[i + 1] +
          Math.sin(x * 0.25 + time * 1.8) * 0.02 +
          Math.cos(z * 0.35 + time * 1.5) * 0.015
      }
      posAttr.needsUpdate = true
      waterRef.current.geometry.computeVertexNormals()
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
      {/* 1. Main Expansive Ground Plane with Carved Basin for Lake Näsijärvi */}
      <mesh
        position={[0, -0.05, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        geometry={groundGeom}
        receiveShadow
      >
        <meshStandardMaterial
          map={grassTexture}
          roughness={0.9}
          metalness={0.0}
        />
      </mesh>

      {/* 2. Lake Näsijärvi Deep Basin in the North-West */}
      <group position={[-16.0, 0.002, -19.5]}>
        {/* Layer A: Natural 3D Sloping Sandy Beach & Embankment */}
        <mesh geometry={shoreGeom} receiveShadow>
          <meshStandardMaterial
            color="#dfc98c"
            roughness={0.92}
            flatShading
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Layer B: Deep Nordic Blue Basin Floor (at y = -1.25) */}
        <mesh
          position={[0, -1.25, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          geometry={floorGeom}
          receiveShadow
        >
          <meshStandardMaterial
            color="#0284c7"
            roughness={0.92}
            metalness={0.05}
            flatShading
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Layer C: Authentic Faceted 3D Water Wave Surface from low_poly_water */}
        {lowPolyWaterGeom && (
          <mesh
            ref={waterRef}
            geometry={lowPolyWaterGeom}
            receiveShadow
          >
            <meshStandardMaterial
              color="#00ffff" // Cyan turquoise water
              roughness={0.835}
              metalness={0.15}
              flatShading
              transparent
              opacity={0.8}
              side={THREE.DoubleSide}
            />
          </mesh>
        )}

        {/* Scenic Archipelago Islet 1: Deep Rock Base + Grass Cap */}
        <mesh position={[-4.5, -0.6, 1.6]} receiveShadow castShadow>
          <cylinderGeometry args={[1.0, 1.5, 1.3, 7]} />
          <meshStandardMaterial color="#64748b" roughness={0.9} flatShading />
        </mesh>
        <mesh position={[-4.5, 0.08, 1.6]} receiveShadow castShadow>
          <cylinderGeometry args={[0.9, 1.1, 0.12, 7]} />
          <meshStandardMaterial color="#44934c" roughness={0.85} flatShading />
        </mesh>

        {/* Scenic Archipelago Islet 2: Deep Rock Base + Grass Cap */}
        <mesh position={[2.8, -0.6, -2.4]} receiveShadow castShadow>
          <cylinderGeometry args={[0.8, 1.3, 1.3, 6]} />
          <meshStandardMaterial color="#64748b" roughness={0.9} flatShading />
        </mesh>
        <mesh position={[2.8, 0.08, -2.4]} receiveShadow castShadow>
          <cylinderGeometry args={[0.7, 0.9, 0.12, 6]} />
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
