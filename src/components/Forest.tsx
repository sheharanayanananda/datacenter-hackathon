import React, { useMemo, useRef, useLayoutEffect } from 'react'
import * as THREE from 'three'

export const Forest: React.FC = () => {
  const trunkRef = useRef<THREE.InstancedMesh>(null)
  const tier1Ref = useRef<THREE.InstancedMesh>(null)
  const tier2Ref = useRef<THREE.InstancedMesh>(null)
  const tier3Ref = useRef<THREE.InstancedMesh>(null)

  // Generate dense forest layout covering all screen edges
  const treeData = useMemo(() => {
    const list: { x: number; y: number; z: number; scale: number; rot: number; colorVariant: number }[] = []

    const addTree = (x: number, z: number, y = 0, scale = 1, colorVariant = 0) => {
      // Add a little organic jitter
      const jitterX = (Math.random() - 0.5) * 0.4
      const jitterZ = (Math.random() - 0.5) * 0.4
      list.push({
        x: x + jitterX,
        y,
        z: z + jitterZ,
        scale: scale * (0.85 + Math.random() * 0.35),
        rot: Math.random() * Math.PI * 2,
        colorVariant,
      })
    }

    const addCluster = (
      centerX: number,
      centerZ: number,
      count: number,
      radiusX: number,
      radiusZ: number,
      baseY = 0
    ) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2
        const r = Math.sqrt(Math.random())
        const x = centerX + Math.cos(angle) * radiusX * r
        const z = centerZ + Math.sin(angle) * radiusZ * r
        const v = Math.floor(Math.random() * 3)
        addTree(x, z, baseY, 0.9 + Math.random() * 0.3, v)
      }
    }

    // 1. South Foreground (Bottom-left to bottom-right, extending deep downwards)
    // In isometric camera [-16, 20, 16], bottom of screen is in direction +Z and -X
    for (let rowZ = 4.8; rowZ <= 22; rowZ += 1.1) {
      for (let colX = -24; colX <= 22; colX += 1.2) {
        // Skip town center and road
        if (colX > -4.5 && colX < 4.5 && rowZ < 5.8) continue
        const densityJitter = (Math.sin(colX * 0.5) + Math.cos(rowZ * 0.5)) * 0.5
        if (Math.random() > 0.18 + densityJitter * 0.1) {
          const v = Math.floor(Math.random() * 3)
          addTree(colX, rowZ, 0, 0.95 + Math.random() * 0.3, v)
        }
      }
    }

    // 2. West / Left Boundary (Extending deep towards -X and +Z)
    // In isometric camera, left of screen is direction -X and -Z
    for (let colX = -5.5; colX >= -28; colX -= 1.1) {
      for (let rowZ = -18; rowZ <= 18; rowZ += 1.1) {
        // Avoid data center and houses
        if (colX > -6.0 && rowZ > -3.5 && rowZ < 3.5) continue
        // Avoid substation zone
        if (colX > -8.5 && colX < -4.5 && rowZ > -1.5 && rowZ < 1.5) continue
        // Avoid wind turbine hill peak
        if (colX > -7.5 && colX < -4.0 && rowZ > -6.5 && rowZ < -3.0) continue

        if (Math.random() > 0.2) {
          const v = Math.floor(Math.random() * 3)
          addTree(colX, rowZ, 0, 0.95 + Math.random() * 0.35, v)
        }
      }
    }

    // 3. North / Top-Left Boundary
    for (let rowZ = -7.0; rowZ >= -28; rowZ -= 1.2) {
      for (let colX = -24; colX <= 6; colX += 1.2) {
        // Leave the hill road clear
        if (Math.abs(colX - 1.2 - (rowZ * -0.3)) < 1.4) continue
        if (Math.random() > 0.15) {
          const v = Math.floor(Math.random() * 3)
          addTree(colX, rowZ, 0, 1.0 + Math.random() * 0.3, v)
        }
      }
    }

    // 4. East / Right lakeside forests & shoreline clusters
    addCluster(7.5, 3.0, 26, 2.5, 3.5, 0)
    addCluster(11.0, 6.0, 32, 4.5, 5.0, 0)
    addCluster(13.5, 0.0, 30, 4.0, 5.0, 0)
    addCluster(16.0, -8.0, 32, 5.0, 6.0, 0)
    addCluster(12.5, -14.0, 28, 4.5, 5.0, 0)
    addCluster(18.0, 4.0, 35, 6.0, 6.0, 0)

    // 5. Lake archipelago islands trees
    addTree(6.2, -2.6, 0.15, 0.9, 1)
    addTree(6.8, -2.2, 0.15, 1.1, 0)
    addTree(8.8, -4.5, 0.15, 0.85, 2)
    addTree(9.2, -4.8, 0.15, 1.05, 1)
    addTree(12.0, -3.2, 0.15, 0.9, 0)
    addTree(14.2, -5.5, 0.15, 1.0, 1)

    // 6. Town interior yard trees (matching the reference photo accents)
    addTree(-2.8, 4.2, 0, 0.75, 0)
    addTree(0.6, 4.4, 0, 0.8, 1)
    addTree(3.4, 3.6, 0, 0.85, 2)
    addTree(-4.8, -1.2, 0, 0.85, 0)
    addTree(4.8, -0.8, 0, 0.9, 1)
    addTree(-0.6, -3.6, 0.1, 0.8, 2)
    addTree(2.8, -3.8, 0.15, 0.85, 0)

    return list
  }, [])

  // Geometries and materials
  const trunkGeo = useMemo(() => new THREE.CylinderGeometry(0.08, 0.12, 0.7, 6), [])
  const tier1Geo = useMemo(() => new THREE.ConeGeometry(0.58, 0.85, 6), [])
  const tier2Geo = useMemo(() => new THREE.ConeGeometry(0.44, 0.75, 6), [])
  const tier3Geo = useMemo(() => new THREE.ConeGeometry(0.3, 0.65, 6), [])

  const trunkMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#451a03', roughness: 0.9 }),
    []
  )

  const foliageMats = useMemo(() => {
    return [
      new THREE.MeshStandardMaterial({ color: '#1e3f20', roughness: 0.8, flatShading: true }),
      new THREE.MeshStandardMaterial({ color: '#254e27', roughness: 0.8, flatShading: true }),
      new THREE.MeshStandardMaterial({ color: '#18331b', roughness: 0.8, flatShading: true }),
    ]
  }, [])

  // Apply matrix transforms for all instances
  useLayoutEffect(() => {
    if (!trunkRef.current || !tier1Ref.current || !tier2Ref.current || !tier3Ref.current) return

    const matrix = new THREE.Matrix4()
    const pos = new THREE.Vector3()
    const rot = new THREE.Quaternion()
    const scale = new THREE.Vector3()

    treeData.forEach((t, i) => {
      // 1. Trunk
      pos.set(t.x, t.y + 0.35 * t.scale, t.z)
      rot.setFromAxisAngle(new THREE.Vector3(0, 1, 0), t.rot)
      scale.set(t.scale, t.scale, t.scale)
      matrix.compose(pos, rot, scale)
      trunkRef.current!.setMatrixAt(i, matrix)

      // 2. Tier 1 (bottom cone)
      pos.set(t.x, t.y + 0.85 * t.scale, t.z)
      matrix.compose(pos, rot, scale)
      tier1Ref.current!.setMatrixAt(i, matrix)

      // 3. Tier 2 (middle cone)
      pos.set(t.x, t.y + 1.35 * t.scale, t.z)
      matrix.compose(pos, rot, scale)
      tier2Ref.current!.setMatrixAt(i, matrix)

      // 4. Tier 3 (top cone)
      pos.set(t.x, t.y + 1.8 * t.scale, t.z)
      matrix.compose(pos, rot, scale)
      tier3Ref.current!.setMatrixAt(i, matrix)
    })

    trunkRef.current.instanceMatrix.needsUpdate = true
    tier1Ref.current.instanceMatrix.needsUpdate = true
    tier2Ref.current.instanceMatrix.needsUpdate = true
    tier3Ref.current.instanceMatrix.needsUpdate = true
  }, [treeData])

  return (
    <group>
      <instancedMesh
        ref={trunkRef}
        args={[trunkGeo, trunkMat, treeData.length]}
        castShadow
      />
      <instancedMesh
        ref={tier1Ref}
        args={[tier1Geo, foliageMats[0], treeData.length]}
        castShadow
        receiveShadow
      />
      <instancedMesh
        ref={tier2Ref}
        args={[tier2Geo, foliageMats[1], treeData.length]}
        castShadow
        receiveShadow
      />
      <instancedMesh
        ref={tier3Ref}
        args={[tier3Geo, foliageMats[2], treeData.length]}
        castShadow
        receiveShadow
      />
    </group>
  )
}
