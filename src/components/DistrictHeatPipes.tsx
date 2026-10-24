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

  // Define the pipe branches corresponding to the reference image
  const branches: PipeBranch[] = useMemo(() => {
    const rawPaths: [number, number, number][][] = [
      // Branch 1: Out of Data Center left side -> curving around corner -> into yellow house (South-West)
      [
        [-2.12, 0.45, 0.4],
        [-2.4, 0.2, 0.4],
        [-2.4, 0.12, 1.6],
        [-3.2, 0.12, 2.3],
        [-3.5, 0.12, 3.2],
        [-3.6, 0.15, 3.7],
      ],
      // Branch 2: Front outlet -> running along South curb -> into Red house (South-Center)
      [
        [-0.3, 0.35, 1.72],
        [-0.3, 0.12, 2.2],
        [-1.0, 0.12, 2.6],
        [-1.2, 0.15, 3.8],
      ],
      // Branch 3: Front outlet right branch -> curving East -> into Red House (South-East)
      [
        [-0.3, 0.12, 2.2],
        [1.8, 0.12, 2.4],
        [2.8, 0.12, 2.2],
        [3.8, 0.12, 1.9],
        [4.2, 0.15, 2.1],
      ],
      // Branch 4: East corner branch -> into Slate/Red House (East)
      [
        [2.8, 0.12, 2.2],
        [3.5, 0.12, 0.8],
        [4.8, 0.12, 0.4],
        [5.3, 0.15, 0.3],
      ],
      // Branch 5: North-West branch towards upper residential house
      [
        [-2.4, 0.12, 0.4],
        [-2.6, 0.12, -1.0],
        [-3.2, 0.12, -1.8],
        [-3.5, 0.15, -2.2],
      ],
    ]

    return rawPaths.map((points, idx) => {
      const vPoints = points.map((p) => new THREE.Vector3(...p))
      const curve = new THREE.CatmullRomCurve3(vPoints, false, 'catmullrom', 0.2)
      const meshGeo = new THREE.TubeGeometry(curve, 40, 0.065, 8, false)
      return {
        curve,
        meshGeo,
        pulseSpeed: 0.25 + (idx % 3) * 0.05,
      }
    })
  }, [])

  // Pulse particles that travel along each pipe
  const pulses = useMemo(() => {
    return branches.map((b, i) => ({
      branchIndex: i,
      offset: (i * 0.22) % 1.0,
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
      // Pulse scale
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

          {/* Joint collars along the pipe */}
          {[0.25, 0.5, 0.75].map((tVal, j) => {
            const pos = b.curve.getPointAt(tVal)
            return (
              <mesh key={j} position={pos} material={pipeJointMaterial}>
                <sphereGeometry args={[0.09, 8, 8]} />
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

      {/* Ambient orange district heating ground glow */}
      {active && (
        <>
          <pointLight position={[-2.4, 0.6, 1.8]} color="#ea580c" intensity={1.8} distance={3.5} />
          <pointLight position={[0.5, 0.6, 2.3]} color="#ea580c" intensity={1.8} distance={3.5} />
          <pointLight position={[3.5, 0.6, 1.5]} color="#ea580c" intensity={1.5} distance={3.5} />
        </>
      )}
    </group>
  )
}
