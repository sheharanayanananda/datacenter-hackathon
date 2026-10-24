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
    // Align car rotation with curve tangent
    carGroup.current.lookAt(nextPoint)
  })

  return (
    <group ref={carGroup}>
      {/* Car Body */}
      <mesh position={[0, 0.12, 0]} castShadow>
        <boxGeometry args={[0.34, 0.14, 0.7]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>

      {/* Cabin / Roof */}
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
  // Road loop curve matching road surface
  const loopCurve = useMemo(() => {
    const points = [
      new THREE.Vector3(-2.8, 0.08, -2.2),
      new THREE.Vector3(2.6, 0.08, -2.2),
      new THREE.Vector3(3.2, 0.08, 0),
      new THREE.Vector3(2.8, 0.08, 2.4),
      new THREE.Vector3(-2.6, 0.08, 2.4),
      new THREE.Vector3(-3.2, 0.08, 0),
    ]
    return new THREE.CatmullRomCurve3(points, true, 'centripetal')
  }, [])

  return (
    <group>
      {/* Red Car (matching image red car near back-left road) */}
      <SingleCar color="#dc2626" speed={0.06} offset={0.1} curve={loopCurve} />
      {/* Blue Wagon (matching image blue car near front right) */}
      <SingleCar color="#2563eb" speed={0.055} offset={0.55} curve={loopCurve} />
      {/* White Compact Car */}
      <SingleCar color="#f8fafc" speed={0.065} offset={0.82} curve={loopCurve} />
    </group>
  )
}
