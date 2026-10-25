import React, { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'

export interface TurbineInfo {
  id: string;
  name: string;
  position: [number, number, number];
}

interface TurbineInstanceProps {
  id: string;
  name: string;
  position: [number, number, number];
  rotation?: number;
  scale?: number;
  speedMultiplier?: number;
  initialRotation?: number;
  towerGeom: THREE.BufferGeometry;
  rotorGeom: THREE.BufferGeometry;
  towerMaterial: THREE.Material;
  rotorMaterial: THREE.Material;
  onSelectTurbine?: (turbine: TurbineInfo) => void;
  onHover?: (hovered: boolean) => void;
}

const MODEL_PATH = '/assets/models/wind_turbine/wind_turbine.glb?v=3'
useGLTF.preload(MODEL_PATH)

// Center hub offset in model's native coordinate space (Z is up, Y is forward)
const HUB_X = 0
const HUB_Y = 0.16
const HUB_Z = 2.540625

const TurbineInstance: React.FC<TurbineInstanceProps> = ({
  id,
  name,
  position,
  rotation = 0,
  scale = 1.8,
  speedMultiplier = 1.0,
  initialRotation = 0,
  towerGeom,
  rotorGeom,
  towerMaterial,
  rotorMaterial,
  onSelectTurbine,
  onHover,
}) => {
  const rotorRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (rotorRef.current) {
      rotorRef.current.rotation.y += delta * 2.2 * speedMultiplier
    }
  })

  const hubWorldY = position[1] + HUB_Z * scale

  return (
    <group
      position={position}
      rotation={[0, rotation, 0]}
      onClick={(e) => {
        e.stopPropagation()
        onSelectTurbine?.({
          id,
          name,
          position: [position[0], hubWorldY, position[2]],
        })
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        onHover?.(true)
      }}
      onPointerOut={() => onHover?.(false)}
    >
      {/* Invisible hit cylinder for smooth, effortless clicking on thin turbine towers */}
      <mesh position={[0, 2.5, 0]}>
        <cylinderGeometry args={[1.2, 1.4, 5.2, 8]} />
        <meshBasicMaterial visible={false} />
      </mesh>

      <group scale={[scale, scale, scale]}>
        {/* Root transform: rotate around X by -90 deg to convert native Z-up to Three.js Y-up */}
        <group rotation={[-Math.PI / 2, 0, 0]}>
          {/* Tower & Nacelle stand in pure solid white */}
          <mesh geometry={towerGeom} material={towerMaterial} castShadow receiveShadow />

          {/* Spinning Rotor Blades centered at the hub with signature red tip stripes */}
          <group position={[HUB_X, HUB_Y, HUB_Z]} ref={rotorRef} rotation={[0, initialRotation, 0]}>
            <mesh geometry={rotorGeom} material={rotorMaterial} castShadow receiveShadow />
          </group>
        </group>
      </group>
    </group>
  )
}

export const WindTurbines: React.FC<{
  level?: number;
  onSelectTurbine?: (turbine: TurbineInfo) => void;
  onHover?: (hovered: boolean) => void;
}> = ({ level = 3, onSelectTurbine, onHover }) => {
  const gltf = useGLTF(MODEL_PATH)

  // Extract geometries and textured turbine material
  const { towerGeom, rotorGeom, turbineMaterial } = useMemo(() => {
    let sourceMesh: THREE.Mesh | null = null
    gltf.scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh && !sourceMesh) {
        sourceMesh = child as THREE.Mesh
      }
    })

    if (!sourceMesh) {
      return { towerGeom: null, rotorGeom: null, turbineMaterial: null }
    }

    const origGeom = (sourceMesh as THREE.Mesh).geometry
    const origMat = (sourceMesh as THREE.Mesh).material

    // Turbine material (uses authentic model texture for tower, nacelle head, and red-tipped blades)
    const tMat = (Array.isArray(origMat) ? origMat[0] : origMat).clone() as THREE.MeshStandardMaterial
    tMat.side = THREE.DoubleSide
    tMat.roughness = 0.35
    tMat.metalness = 0.05
    tMat.color.set('#ffffff')

    const posAttr = origGeom.attributes.position
    const uvAttr = origGeom.attributes.uv
    const indexAttr = origGeom.index

    if (!indexAttr) {
      return { towerGeom: null, rotorGeom: null, turbineMaterial: tMat }
    }

    // The Sketchfab low-poly turbine model (748 triangles total):
    // Static base (tower pole & generator housing nacelle):
    // - Tower pole caps: triangles 36..53
    // - Tower pole cylinder walls: triangles 72..89
    // - Generator housing nacelle head: triangles 720..747
    // Total 64 triangles.
    //
    // Rotating assembly (hub nose cone & 3 blades):
    // - Hub nose cone: triangles 0..35
    // - 3 Rotor blades: triangles 90..719
    // Total 684 triangles.
    const isStaticTriangle = (t: number) => {
      return (t >= 36 && t <= 53) || (t >= 72 && t <= 89) || (t >= 720 && t <= 747)
    }

    const towerIndices: number[] = []
    const rotorIndices: number[] = []

    for (let t = 0; t < indexAttr.count / 3; t++) {
      const i0 = indexAttr.getX(t * 3)
      const i1 = indexAttr.getX(t * 3 + 1)
      const i2 = indexAttr.getX(t * 3 + 2)
      if (isStaticTriangle(t)) {
        towerIndices.push(i0, i1, i2)
      } else {
        rotorIndices.push(i0, i1, i2)
      }
    }

    // 1. Tower & Nacelle Geometry (clean non-indexed facet normals + smooth radial cylinder normals)
    const tGeomIndexed = new THREE.BufferGeometry()
    tGeomIndexed.setAttribute('position', posAttr)
    if (uvAttr) tGeomIndexed.setAttribute('uv', uvAttr)
    tGeomIndexed.setIndex(towerIndices)

    const tGeom = tGeomIndexed.toNonIndexed()
    tGeom.computeVertexNormals()

    const tPos = tGeom.attributes.position
    const tNorm = tGeom.attributes.normal
    for (let i = 0; i < tPos.count; i++) {
      const z = tPos.getZ(i)
      if (z < 2.45) {
        const x = tPos.getX(i)
        const y = tPos.getY(i)
        const r = Math.hypot(x, y)
        if (r > 0.0001) {
          tNorm.setXYZ(i, x / r, y / r, 0)
        }
      }
    }

    // 2. Rotor Geometry with vertices centered at hub [HUB_X, HUB_Y, HUB_Z]
    const rotorPosAttr = posAttr.clone()
    for (let i = 0; i < rotorPosAttr.count; i++) {
      rotorPosAttr.setXYZ(
        i,
        rotorPosAttr.getX(i) - HUB_X,
        rotorPosAttr.getY(i) - HUB_Y,
        rotorPosAttr.getZ(i) - HUB_Z
      )
    }

    const rGeomIndexed = new THREE.BufferGeometry()
    rGeomIndexed.setAttribute('position', rotorPosAttr)
    if (uvAttr) rGeomIndexed.setAttribute('uv', uvAttr)
    rGeomIndexed.setIndex(rotorIndices)

    const rGeom = rGeomIndexed.toNonIndexed()
    rGeom.computeVertexNormals()

    return { towerGeom: tGeom, rotorGeom: rGeom, turbineMaterial: tMat }
  }, [gltf])

  if (!towerGeom || !rotorGeom || !turbineMaterial) return null

  return (
    <group>
      {/* Wind Turbines in the South-East corner: Level 1 has 1, Level 2 has 2, Level 3 has 3 */}
      <TurbineInstance
        id="wind-1"
        name="Wind Turbine 1"
        position={[11.0, 0, 9.5]}
        scale={1.8}
        speedMultiplier={1.0}
        rotation={2.70}
        initialRotation={0.3}
        towerGeom={towerGeom}
        rotorGeom={rotorGeom}
        towerMaterial={turbineMaterial}
        rotorMaterial={turbineMaterial}
        onSelectTurbine={onSelectTurbine}
        onHover={onHover}
      />
      {level >= 2 && (
        <TurbineInstance
          id="wind-2"
          name="Wind Turbine 2"
          position={[18.5, 0, 11.5]}
          scale={1.75}
          speedMultiplier={1.12}
          rotation={2.80}
          initialRotation={1.9}
          towerGeom={towerGeom}
          rotorGeom={rotorGeom}
          towerMaterial={turbineMaterial}
          rotorMaterial={turbineMaterial}
          onSelectTurbine={onSelectTurbine}
          onHover={onHover}
        />
      )}
      {level >= 3 && (
        <TurbineInstance
          id="wind-3"
          name="Wind Turbine 3"
          position={[14.0, 0, 17.5]}
          scale={1.85}
          speedMultiplier={0.92}
          rotation={2.60}
          initialRotation={3.7}
          towerGeom={towerGeom}
          rotorGeom={rotorGeom}
          towerMaterial={turbineMaterial}
          rotorMaterial={turbineMaterial}
          onSelectTurbine={onSelectTurbine}
          onHover={onHover}
        />
      )}
    </group>
  )
}
