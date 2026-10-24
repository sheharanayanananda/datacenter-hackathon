import React from 'react'

export interface ParkingStall {
  id: string;
  // World coordinates
  worldPos: [number, number, number];
  // Rotation (heading angle) when parked
  rotation: number;
  // Waypoint in the carpark central aisle to turn into/out of this stall
  aislePos: [number, number, number];
}

// Parking stalls in world coordinates (Carpark origin: [22.8, 0.01, -8.5])
export const CARPARK_STALLS: ParkingStall[] = [
  // West row North of driveway (facing East, rotation = Math.PI / 2)
  {
    id: 'stall-nw-1',
    worldPos: [21.8, 0.08, -10.7],
    rotation: Math.PI / 2,
    aislePos: [22.8, 0.08, -10.7],
  },
  {
    id: 'stall-nw-2',
    worldPos: [21.8, 0.08, -9.9],
    rotation: Math.PI / 2,
    aislePos: [22.8, 0.08, -9.9],
  },
  // West row South of driveway (facing East, rotation = Math.PI / 2)
  {
    id: 'stall-sw-1',
    worldPos: [21.8, 0.08, -7.1],
    rotation: Math.PI / 2,
    aislePos: [22.8, 0.08, -7.1],
  },
  {
    id: 'stall-sw-2',
    worldPos: [21.8, 0.08, -6.3],
    rotation: Math.PI / 2,
    aislePos: [22.8, 0.08, -6.3],
  },
  // East row North of driveway (facing West, rotation = -Math.PI / 2)
  {
    id: 'stall-ne-1',
    worldPos: [23.8, 0.08, -10.7],
    rotation: -Math.PI / 2,
    aislePos: [22.8, 0.08, -10.7],
  },
  {
    id: 'stall-ne-2',
    worldPos: [23.8, 0.08, -9.9],
    rotation: -Math.PI / 2,
    aislePos: [22.8, 0.08, -9.9],
  },
  // East row South of driveway (facing West, rotation = -Math.PI / 2)
  {
    id: 'stall-se-1',
    worldPos: [23.8, 0.08, -7.1],
    rotation: -Math.PI / 2,
    aislePos: [22.8, 0.08, -7.1],
  },
  {
    id: 'stall-se-2',
    worldPos: [23.8, 0.08, -6.3],
    rotation: -Math.PI / 2,
    aislePos: [22.8, 0.08, -6.3],
  },
]

export const Carpark: React.FC = () => {
  return (
    <group position={[22.8, 0.01, -8.5]}>
      {/* Dark Asphalt Parking Lot Surface (Width: 4.0, Depth: 5.8) */}
      <mesh
        position={[0, 0.005, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[4.0, 5.8]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} />
      </mesh>

      {/* Concrete Curb Perimeter Border */}
      {/* West border North of driveway */}
      <mesh position={[-2.0, 0.02, -1.8]}>
        <boxGeometry args={[0.08, 0.04, 2.2]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>

      {/* West border South of driveway */}
      <mesh position={[-2.0, 0.02, 1.8]}>
        <boxGeometry args={[0.08, 0.04, 2.2]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>

      {/* Driveway Apron connecting road sidewalk (x = 20.5) cleanly to carpark (x = 20.8) */}
      <mesh
        position={[-2.15, 0.006, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[0.32, 1.4]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      {/* East Border */}
      <mesh position={[2.0, 0.02, 0]}>
        <boxGeometry args={[0.08, 0.04, 5.8]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>

      {/* North Border */}
      <mesh position={[0, 0.02, -2.9]}>
        <boxGeometry args={[4.08, 0.04, 0.08]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>

      {/* South Border */}
      <mesh position={[0, 0.02, 2.9]}>
        <boxGeometry args={[4.08, 0.04, 0.08]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>

      {/* White Parking Stall Markings (West Row North) */}
      {[-2.6, -1.8, -1.0].map((zVal, idx) => (
        <mesh
          key={`stripe-wn-${idx}`}
          position={[-1.0, 0.015, zVal]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[1.8, 0.05]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.4} />
        </mesh>
      ))}

      {/* White Parking Stall Markings (West Row South) */}
      {[1.0, 1.8, 2.6].map((zVal, idx) => (
        <mesh
          key={`stripe-ws-${idx}`}
          position={[-1.0, 0.015, zVal]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[1.8, 0.05]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.4} />
        </mesh>
      ))}

      {/* White Parking Stall Markings (East Row North) */}
      {[-2.6, -1.8, -1.0].map((zVal, idx) => (
        <mesh
          key={`stripe-en-${idx}`}
          position={[1.0, 0.015, zVal]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[1.8, 0.05]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.4} />
        </mesh>
      ))}

      {/* White Parking Stall Markings (East Row South) */}
      {[1.0, 1.8, 2.6].map((zVal, idx) => (
        <mesh
          key={`stripe-es-${idx}`}
          position={[1.0, 0.015, zVal]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[1.8, 0.05]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.4} />
        </mesh>
      ))}
    </group>
  )
}
