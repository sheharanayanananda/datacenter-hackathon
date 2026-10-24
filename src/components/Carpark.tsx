import React from 'react'

const ParkedCar: React.FC<{
  position: [number, number, number];
  rotation?: number;
  color: string;
}> = ({ position, rotation = 0, color }) => {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Chassis */}
      <mesh position={[0, 0.1, 0]} castShadow>
        <boxGeometry args={[0.34, 0.14, 0.65]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
      {/* Cabin */}
      <mesh position={[0, 0.22, -0.04]} castShadow>
        <boxGeometry args={[0.26, 0.12, 0.36]} />
        <meshStandardMaterial color="#334155" roughness={0.2} />
      </mesh>
      {/* Wheels */}
      {[-0.17, 0.17].map((x, i) =>
        [-0.18, 0.18].map((z, j) => (
          <mesh
            key={`${i}-${j}`}
            position={[x, 0.05, z]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <cylinderGeometry args={[0.05, 0.05, 0.03, 8]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
        ))
      )}
    </group>
  )
}

export const Carpark: React.FC = () => {
  return (
    <group position={[12.4, 0.01, 0.2]}>
      {/* Dark Asphalt Parking Lot Surface */}
      <mesh position={[0, 0.005, 0]} receiveShadow>
        <planeGeometry args={[3.8, 5.8]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} />
      </mesh>

      {/* Concrete Curb / Perimeter Border (with Driveway Entrance at z ≈ 0.3) */}
      {/* West border North of driveway */}
      <mesh position={[-1.9, 0.02, -1.6]}>
        <boxGeometry args={[0.08, 0.04, 2.6]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>
      {/* West border South of driveway */}
      <mesh position={[-1.9, 0.02, 1.9]}>
        <boxGeometry args={[0.08, 0.04, 2.0]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>
      {/* Driveway apron */}
      <mesh position={[-1.9, 0.006, 0.3]}>
        <planeGeometry args={[0.2, 1.2]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[1.9, 0.02, 0]}>
        <boxGeometry args={[0.08, 0.04, 5.8]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>
      <mesh position={[0, 0.02, -2.9]}>
        <boxGeometry args={[3.8, 0.04, 0.08]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>
      <mesh position={[0, 0.02, 2.9]}>
        <boxGeometry args={[3.8, 0.04, 0.08]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>

      {/* White Parking Stall Markings (Left Row) */}
      {[-2.2, -1.4, -0.6, 0.2, 1.0, 1.8].map((zVal, idx) => (
        <mesh
          key={`stripe-l-${idx}`}
          position={[-0.9, 0.015, zVal]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[1.6, 0.05]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.4} />
        </mesh>
      ))}

      {/* White Parking Stall Markings (Right Row) */}
      {[-2.2, -1.4, -0.6, 0.2, 1.0, 1.8].map((zVal, idx) => (
        <mesh
          key={`stripe-r-${idx}`}
          position={[0.9, 0.015, zVal]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[1.6, 0.05]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.4} />
        </mesh>
      ))}

      {/* Parked Cars */}
      <ParkedCar position={[-0.9, 0, -1.8]} rotation={Math.PI / 2} color="#dc2626" />
      <ParkedCar position={[-0.9, 0, -0.2]} rotation={Math.PI / 2} color="#2563eb" />
      <ParkedCar position={[-0.9, 0, 1.4]} rotation={Math.PI / 2} color="#f8fafc" />

      <ParkedCar position={[0.9, 0, -1.8]} rotation={-Math.PI / 2} color="#eab308" />
      <ParkedCar position={[0.9, 0, -1.0]} rotation={-Math.PI / 2} color="#475569" />
      <ParkedCar position={[0.9, 0, 0.6]} rotation={-Math.PI / 2} color="#16a34a" />

      {/* Carpark Lamp Posts */}
      {[-2.7, 2.7].map((zPos, i) => (
        <group key={i} position={[0, 0, zPos]}>
          <mesh position={[0, 0.8, 0]} castShadow>
            <cylinderGeometry args={[0.03, 0.04, 1.6, 8]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.7} />
          </mesh>
          <mesh position={[0, 1.6, 0]}>
            <sphereGeometry args={[0.07, 8, 8]} />
            <meshStandardMaterial
              color="#fef08a"
              emissive="#fde047"
              emissiveIntensity={1.2}
            />
          </mesh>
        </group>
      ))}
    </group>
  )
}
