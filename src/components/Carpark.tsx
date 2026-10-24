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
      {/* 1. Main Asphalt Surface (Width: 4.0, Depth: 5.8) - Matching Road Asphalt Color & Roughness */}
      <mesh
        position={[0, 0.005, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[4.0, 5.8]} />
        <meshStandardMaterial
          color="#666b80" // Authentic Kenney road asphalt color
          roughness={0.82}
          metalness={0.0}
        />
      </mesh>

      {/* 2. Driveway Apron connecting road intersection (x = 20.5) seamlessly to carpark (x = 20.8) */}
      <mesh
        position={[-2.15, 0.0055, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[0.32, 1.4]} />
        <meshStandardMaterial
          color="#666b80" // Seamless road asphalt continuation (no black block disconnect)
          roughness={0.82}
          metalness={0.0}
        />
      </mesh>

      {/* Driveway Entrance Curb Flanks (Connecting Road Sidewalk directly to Carpark Curb) */}
      <mesh position={[-2.15, 0.02, -0.76]} receiveShadow>
        <boxGeometry args={[0.3, 0.026, 0.16]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.75} />
      </mesh>
      <mesh position={[-2.15, 0.02, 0.76]} receiveShadow>
        <boxGeometry args={[0.3, 0.026, 0.16]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.75} />
      </mesh>

      {/* Driveway Entrance Stop / Yield Line */}
      <mesh
        position={[-1.98, 0.008, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[0.07, 1.36]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.4} />
      </mesh>

      {/* 3. Perimeter Concrete Sidewalk Curbs (Matching Road Sidewalk Height, Width & Colors) */}
      {/* East Curb */}
      <mesh position={[2.0, 0.02, 0]} receiveShadow>
        <boxGeometry args={[0.16, 0.026, 5.8]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.75} />
      </mesh>

      {/* North Curb */}
      <mesh position={[0, 0.02, -2.9]} receiveShadow>
        <boxGeometry args={[4.16, 0.026, 0.16]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.75} />
      </mesh>

      {/* South Curb */}
      <mesh position={[0, 0.02, 2.9]} receiveShadow>
        <boxGeometry args={[4.16, 0.026, 0.16]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.75} />
      </mesh>

      {/* West Curb North (north of driveway entrance) */}
      <mesh position={[-2.0, 0.02, -1.84]} receiveShadow>
        <boxGeometry args={[0.16, 0.026, 2.0]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.75} />
      </mesh>

      {/* West Curb South (south of driveway entrance) */}
      <mesh position={[-2.0, 0.02, 1.84]} receiveShadow>
        <boxGeometry args={[0.16, 0.026, 2.0]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.75} />
      </mesh>

      {/* 4. White Parking Stall Markings (Divider Stripes matching Road Line Width & Color) */}
      {/* West Row Stall Dividers (North: z = -2.6, -1.8, -1.0) */}
      {[-2.6, -1.8, -1.0].map((zVal, idx) => (
        <group key={`stripe-wn-${idx}`}>
          <mesh
            position={[-1.28, 0.008, zVal]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <planeGeometry args={[1.35, 0.06]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.4} />
          </mesh>
          {/* T-end tick cap at aisle edge */}
          <mesh
            position={[-0.6, 0.008, zVal]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <planeGeometry args={[0.06, 0.2]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.4} />
          </mesh>
        </group>
      ))}

      {/* West Row Stall Dividers (South: z = 1.0, 1.8, 2.6) */}
      {[1.0, 1.8, 2.6].map((zVal, idx) => (
        <group key={`stripe-ws-${idx}`}>
          <mesh
            position={[-1.28, 0.008, zVal]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <planeGeometry args={[1.35, 0.06]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.4} />
          </mesh>
          {/* T-end tick cap at aisle edge */}
          <mesh
            position={[-0.6, 0.008, zVal]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <planeGeometry args={[0.06, 0.2]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.4} />
          </mesh>
        </group>
      ))}

      {/* East Row Stall Dividers (North: z = -2.6, -1.8, -1.0) */}
      {[-2.6, -1.8, -1.0].map((zVal, idx) => (
        <group key={`stripe-en-${idx}`}>
          <mesh
            position={[1.28, 0.008, zVal]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <planeGeometry args={[1.35, 0.06]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.4} />
          </mesh>
          {/* T-end tick cap at aisle edge */}
          <mesh
            position={[0.6, 0.008, zVal]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <planeGeometry args={[0.06, 0.2]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.4} />
          </mesh>
        </group>
      ))}

      {/* East Row Stall Dividers (South: z = 1.0, 1.8, 2.6) */}
      {[1.0, 1.8, 2.6].map((zVal, idx) => (
        <group key={`stripe-es-${idx}`}>
          <mesh
            position={[1.28, 0.008, zVal]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <planeGeometry args={[1.35, 0.06]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.4} />
          </mesh>
          {/* T-end tick cap at aisle edge */}
          <mesh
            position={[0.6, 0.008, zVal]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <planeGeometry args={[0.06, 0.2]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.4} />
          </mesh>
        </group>
      ))}

      {/* Stall Backstop Limit Lines against Curbs */}
      <mesh
        position={[-1.94, 0.008, -1.8]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[0.06, 1.66]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.4} />
      </mesh>
      <mesh
        position={[-1.94, 0.008, 1.8]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[0.06, 1.66]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.4} />
      </mesh>
      <mesh
        position={[1.94, 0.008, -1.8]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[0.06, 1.66]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.4} />
      </mesh>
      <mesh
        position={[1.94, 0.008, 1.8]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[0.06, 1.66]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.4} />
      </mesh>

      {/* 5. Concrete Wheel Stops / Bumpers (Low-Poly Beveled Stops Matching Road Sidewalk Concrete) */}
      {/* West Row Bumpers */}
      {[-2.2, -1.4, 1.4, 2.2].map((zVal, idx) => (
        <mesh
          key={`bumper-w-${idx}`}
          position={[-1.78, 0.016, zVal]}
          receiveShadow
          castShadow
        >
          <boxGeometry args={[0.1, 0.024, 0.52]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.8} />
        </mesh>
      ))}

      {/* East Row Bumpers */}
      {[-2.2, -1.4, 1.4, 2.2].map((zVal, idx) => (
        <mesh
          key={`bumper-e-${idx}`}
          position={[1.78, 0.016, zVal]}
          receiveShadow
          castShadow
        >
          <boxGeometry args={[0.1, 0.024, 0.52]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.8} />
        </mesh>
      ))}

      {/* 6. Central Driving Aisle Road Markings (Matching Road Dashed Centerline) */}
      {/* North aisle dashed centerline */}
      <mesh
        position={[0, 0.008, -1.8]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[0.06, 0.8]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.4} />
      </mesh>

      {/* South aisle dashed centerline */}
      <mesh
        position={[0, 0.008, 1.8]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[0.06, 0.8]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.4} />
      </mesh>

      {/* 7. Pedestrian Zebra Crossing at North End (Connecting Staff Walkway to Datacenter) */}
      {[-0.36, -0.12, 0.12, 0.36].map((xOffset, idx) => (
        <mesh
          key={`crosswalk-${idx}`}
          position={[xOffset, 0.008, -2.6]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[0.14, 0.38]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.4} />
        </mesh>
      ))}
    </group>
  )
}
