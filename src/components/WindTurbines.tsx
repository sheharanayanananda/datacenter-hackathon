import React, { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'

interface TurbineInstanceProps {
  position: [number, number, number];
  rotation?: number;
  scale?: number;
  speedMultiplier?: number;
  initialRotation?: number;
  towerGeom: THREE.BufferGeometry;
  rotorGeom: THREE.BufferGeometry;
  towerMaterial: THREE.Material;
  rotorMaterial: THREE.Material;
}

const MODEL_PATH = '/assets/models/wind_turbine/wind_turbine.glb?v=3'
useGLTF.preload(MODEL_PATH)

// Center hub offset in model's native coordinate space (Z is up, Y is forward)
const HUB_X = 0
const HUB_Y = 0.16
const HUB_Z = 2.540625

const TurbineInstance: React.FC<TurbineInstanceProps> = ({
  position,
  rotation = 0,
  scale = 1.8,
  speedMultiplier = 1.0,
  initialRotation = 0,
  towerGeom,
  rotorGeom,
  towerMaterial,
  rotorMaterial,
}) => {
  const rotorRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (rotorRef.current) {
      rotorRef.current.rotation.y += delta * 2.2 * speedMultiplier
    }
  })

  return (
    <group position={position} rotation={[0, rotation, 0]} scale={[scale, scale, scale]}>
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
  )
}

export const WindTurbines: React.FC<{ level?: number; onSelectWind?: () => void }> = ({ level = 3, onSelectWind }) => {
  const gltf = useGLTF(MODEL_PATH)

  // Dedicated pure white PBR material for the stand (tower pole & nacelle housing)
  const towerMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#f8fafc',
      roughness: 0.32,
      metalness: 0.08,
      side: THREE.DoubleSide,
    })
  }, [])

  // Extract geometries and rotor material
  const { towerGeom, rotorGeom, rotorMaterial } = useMemo(() => {
    let sourceMesh: THREE.Mesh | null = null
    gltf.scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh && !sourceMesh) {
        sourceMesh = child as THREE.Mesh
      }
    })

    if (!sourceMesh) {
      return { towerGeom: null, rotorGeom: null, rotorMaterial: null }
    }

    const origGeom = (sourceMesh as THREE.Mesh).geometry
    const origMat = (sourceMesh as THREE.Mesh).material

    // Rotor material (retains the blade texture with red tip stripes)
    const rMat = (Array.isArray(origMat) ? origMat[0] : origMat).clone() as THREE.MeshStandardMaterial
    rMat.side = THREE.DoubleSide
    rMat.roughness = 0.32
    rMat.metalness = 0.05
    rMat.color.set('#ffffff')

    const posAttr = origGeom.attributes.position
    const normAttr = origGeom.attributes.normal
    const uvAttr = origGeom.attributes.uv
    const indexAttr = origGeom.index

    if (!indexAttr) {
      return { towerGeom: null, rotorGeom: null, rotorMaterial: rMat }
    }

    const towerIndices: number[] = []
    const rotorIndices: number[] = []

    for (let t = 0; t < indexAttr.count / 3; t++) {
      const i0 = indexAttr.getX(t * 3)
      const i1 = indexAttr.getX(t * 3 + 1)
      const i2 = indexAttr.getX(t * 3 + 2)
      const minY = Math.min(posAttr.getY(i0), posAttr.getY(i1), posAttr.getY(i2))
      if (minY >= 0.09) {
        rotorIndices.push(i0, i1, i2)
      } else {
        towerIndices.push(i0, i1, i2)
      }
    }

    // 1. Tower Geometry (stand pole, base, nacelle housing)
    const tGeom = new THREE.BufferGeometry()
    tGeom.setAttribute('position', posAttr)
    if (normAttr) tGeom.setAttribute('normal', normAttr)
    if (uvAttr) tGeom.setAttribute('uv', uvAttr)
    tGeom.setIndex(towerIndices)
    tGeom.computeVertexNormals()

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

    const rGeom = new THREE.BufferGeometry()
    rGeom.setAttribute('position', rotorPosAttr)
    if (normAttr) rGeom.setAttribute('normal', normAttr)
    if (uvAttr) rGeom.setAttribute('uv', uvAttr)
    rGeom.setIndex(rotorIndices)
    rGeom.computeVertexNormals()

    return { towerGeom: tGeom, rotorGeom: rGeom, rotorMaterial: rMat }
  }, [gltf])

  if (!towerGeom || !rotorGeom || !rotorMaterial) return null

  return (
    <group
      onClick={(e) => {
        e.stopPropagation()
        onSelectWind?.()
      }}
    >
      {/* Wind Turbines in the South-East corner: Level 1 has 1, Level 2 has 2, Level 3 has 3 */}
      <TurbineInstance
        position={[11.0, 0, 9.5]}
        scale={1.8}
        speedMultiplier={1.0}
        rotation={2.70}
        initialRotation={0.3}
        towerGeom={towerGeom}
        rotorGeom={rotorGeom}
        towerMaterial={towerMaterial}
        rotorMaterial={rotorMaterial}
      />
      {level >= 2 && (
        <TurbineInstance
          position={[18.5, 0, 11.5]}
          scale={1.75}
          speedMultiplier={1.12}
          rotation={2.80}
          initialRotation={1.9}
          towerGeom={towerGeom}
          rotorGeom={rotorGeom}
          towerMaterial={towerMaterial}
          rotorMaterial={rotorMaterial}
        />
      )}
      {level >= 3 && (
        <TurbineInstance
          position={[14.0, 0, 17.5]}
          scale={1.85}
          speedMultiplier={0.92}
          rotation={2.60}
          initialRotation={3.7}
          towerGeom={towerGeom}
          rotorGeom={rotorGeom}
          towerMaterial={towerMaterial}
          rotorMaterial={rotorMaterial}
        />
      )}
    </group>
  )
}
