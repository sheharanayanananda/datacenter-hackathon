import React, { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

interface CarProps {
  color: string;
  speed: number;
  offset: number;
  curve: THREE.CatmullRomCurve3;
}

const SingleCar: React.FC<CarProps> = ({ color, speed, offset, curve }) => {
  const carGroup = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!carGroup.current) return
    const t = (state.clock.getElapsedTime() * speed + offset) % 1.0
    const point = curve.getPointAt(t)
    const nextPoint = curve.getPointAt((t + 0.01) % 1.0)

    carGroup.current.position.copy(point)
    carGroup.current.lookAt(nextPoint)
  })

  return (
    <group ref={carGroup}>
      {/* Car Body */}
      <mesh position={[0, 0.12, 0]} castShadow>
        <boxGeometry args={[0.34, 0.14, 0.7]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>

      {/* Cabin / Windows */}
      <mesh position={[0, 0.24, -0.05]} castShadow>
        <boxGeometry args={[0.28, 0.12, 0.38]} />
        <meshStandardMaterial color="#334155" roughness={0.2} />
      </mesh>

      {/* Wheels */}
      {[-0.18, 0.18].map((x, i) =>
        [-0.2, 0.2].map((z, j) => (
          <mesh key={`${i}-${j}`} position={[x, 0.06, z]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.06, 0.06, 0.04, 10]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
        ))
      )}

      {/* Headlights */}
      <mesh position={[-0.1, 0.12, 0.36]}>
        <boxGeometry args={[0.06, 0.04, 0.02]} />
        <meshBasicMaterial color="#fef08a" />
      </mesh>
      <mesh position={[0.1, 0.12, 0.36]}>
        <boxGeometry args={[0.06, 0.04, 0.02]} />
        <meshBasicMaterial color="#fef08a" />
      </mesh>

      {/* Taillights */}
      <mesh position={[-0.1, 0.12, -0.36]}>
        <boxGeometry args={[0.06, 0.04, 0.02]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>
      <mesh position={[0.1, 0.12, -0.36]}>
        <boxGeometry args={[0.06, 0.04, 0.02]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>
    </group>
  )
}

export const Traffic: React.FC = () => {
  // Road loop circuit matching the new layout
  const loopCurve = useMemo(() => {
    const points = [
      new THREE.Vector3(3.0, 0.08, 0.5),
      new THREE.Vector3(3.0, 0.08, -3.5),
      new THREE.Vector3(10.0, 0.08, -3.5),
      new THREE.Vector3(10.0, 0.08, 3.5),
      new THREE.Vector3(0.0, 0.08, 3.5),
      new THREE.Vector3(-6.0, 0.08, 3.5),
      new THREE.Vector3(-6.0, 0.08, 7.5),
      new THREE.Vector3(-6.0, 0.08, 3.5),
      new THREE.Vector3(-6.0, 0.08, 0.5),
    ]
    return new THREE.CatmullRomCurve3(points, true, 'centripetal')
  }, [])

  return (
    <group>
      {/* Red Sedan */}
      <SingleCar color="#dc2626" speed={0.05} offset={0.05} curve={loopCurve} />
      {/* Blue Wagon */}
      <SingleCar color="#2563eb" speed={0.045} offset={0.4} curve={loopCurve} />
      {/* White Delivery Van */}
      <SingleCar color="#f8fafc" speed={0.052} offset={0.75} curve={loopCurve} />
    </group>
  )
}
