import React, { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

interface PipeNetworkProps {
  active?: boolean;
}

interface PipeBranch {
  curve: THREE.CatmullRomCurve3;
  meshGeo: THREE.TubeGeometry;
  pulseSpeed: number;
}

export const DistrictHeatPipes: React.FC<PipeNetworkProps> = ({ active = true }) => {
  const pulseGroupRef = useRef<THREE.Group>(null)

  // Define pipe paths running from Datacenter (East) along roads to Residential neighborhood (West)
  const branches: PipeBranch[] = useMemo(() => {
    const rawPaths: [number, number, number][][] = [
      // Main Trunk line: From Datacenter thermal tanks (x=3.8, z=0.5) along connector road to Residential crossway (x=-6.0, z=0.5)
      [
        [3.8, 0.35, 0.5],
        [1.5, 0.12, 0.5],
        [-1.5, 0.12, 0.5],
        [-4.0, 0.12, 0.5],
        [-6.0, 0.12, 0.5],
      ],
      // Branch 1: From crossway West into North-West residential houses
      [
        [-6.0, 0.12, 0.5],
        [-7.2, 0.12, 1.2],
        [-8.8, 0.12, 1.6],
        [-10.0, 0.15, 2.2],
      ],
      // Branch 2: East branch from crossway into North-East residential houses
      [
        [-6.0, 0.12, 0.5],
        [-4.8, 0.12, 1.4],
        [-3.2, 0.12, 1.8],
        [-1.6, 0.15, 1.8],
      ],
      // Branch 3: South branch along South street into southern homes
      [
        [-6.0, 0.12, 0.5],
        [-6.0, 0.12, 2.0],
        [-6.0, 0.12, 3.5],
        [-6.0, 0.12, 5.0],
        [-6.0, 0.15, 7.0],
      ],
      // Branch 4: Southern lateral into South-West row of houses
      [
        [-6.0, 0.12, 3.5],
        [-7.4, 0.12, 4.4],
        [-8.8, 0.12, 4.6],
        [-10.0, 0.15, 4.6],
      ],
      // Branch 5: Southern lateral into South-East row of houses
      [
        [-6.0, 0.12, 3.5],
        [-4.6, 0.12, 4.4],
        [-3.0, 0.12, 4.6],
        [-1.6, 0.15, 4.6],
      ],
    ]

    return rawPaths.map((points, idx) => {
      const vPoints = points.map((p) => new THREE.Vector3(...p))
      const curve = new THREE.CatmullRomCurve3(vPoints, false, 'catmullrom', 0.2)
      const meshGeo = new THREE.TubeGeometry(curve, 35, 0.065, 8, false)
      return {
        curve,
        meshGeo,
        pulseSpeed: 0.22 + (idx % 3) * 0.05,
      }
    })
  }, [])

  // Flowing pulses of heat energy
  const pulses = useMemo(() => {
    return branches.map((b, i) => ({
      branchIndex: i,
      offset: (i * 0.25) % 1.0,
      speed: b.pulseSpeed,
    }))
  }, [branches])

  const pipeMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: active ? '#ea580c' : '#78350f',
        emissive: active ? '#f97316' : '#451a03',
        emissiveIntensity: active ? 2.2 : 0.4,
        roughness: 0.3,
        metalness: 0.8,
      }),
    [active]
  )

  const pipeJointMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#fbbf24',
        emissive: '#f59e0b',
        emissiveIntensity: 1.5,
      }),
    []
  )

  // Move pulses along curves each frame
  useFrame((state) => {
    if (!pulseGroupRef.current || !active) return
    const time = state.clock.getElapsedTime()

    pulseGroupRef.current.children.forEach((mesh, idx) => {
      const p = pulses[idx]
      if (!p) return
      const branch = branches[p.branchIndex]
      const t = (time * p.speed + p.offset) % 1.0
      const pt = branch.curve.getPointAt(t)
      mesh.position.copy(pt)
      const s = 1.0 + Math.sin(time * 8 + idx) * 0.25
      mesh.scale.set(s, s, s)
    })
  })

  return (
    <group>
      {/* Pipe Meshes */}
      {branches.map((b, i) => (
        <group key={i}>
          <mesh geometry={b.meshGeo} material={pipeMaterial} castShadow />
          {[0.3, 0.7].map((tVal, j) => {
            const pos = b.curve.getPointAt(tVal)
            return (
              <mesh key={j} position={pos} material={pipeJointMaterial}>
                <sphereGeometry args={[0.085, 8, 8]} />
              </mesh>
            )
          })}
        </group>
      ))}

      {/* Flowing Energy Pulses */}
      <group ref={pulseGroupRef}>
        {pulses.map((_, i) => (
          <mesh key={i}>
            <sphereGeometry args={[0.11, 10, 10]} />
            <meshBasicMaterial color="#fed7aa" />
          </mesh>
        ))}
      </group>

      {/* Ambient orange district heating ground glow along main avenues */}
      {active && (
        <>
          <pointLight position={[2.5, 0.5, 0.6]} color="#ea580c" intensity={1.8} distance={4} />
          <pointLight position={[-2.0, 0.5, 0.6]} color="#ea580c" intensity={1.8} distance={4} />
          <pointLight position={[-6.0, 0.5, 3.4]} color="#ea580c" intensity={1.8} distance={4} />
        </>
      )}
    </group>
  )
}
