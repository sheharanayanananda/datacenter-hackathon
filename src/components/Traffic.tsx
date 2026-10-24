import React, { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { CARPARK_STALLS, ParkingStall } from './Carpark'

// Preload Kenney car kit models
const CAR_GLB_MAP = {
  'sedan-sports': '/assets/models/cars/sedan-sports.glb',
  'delivery': '/assets/models/cars/delivery.glb',
  'suv': '/assets/models/cars/suv.glb',
  'taxi': '/assets/models/cars/taxi.glb',
  'hatchback-sports': '/assets/models/cars/hatchback-sports.glb',
  'police': '/assets/models/cars/police.glb',
  'sedan': '/assets/models/cars/sedan.glb',
  'van': '/assets/models/cars/van.glb',
} as const

type VehicleModelType = keyof typeof CAR_GLB_MAP

Object.values(CAR_GLB_MAP).forEach((path) => useGLTF.preload(path))

// Authentic 3D vehicle model loaded from kenney_car-kit
const KenneyVehicle: React.FC<{ modelType: VehicleModelType; scale?: number }> = ({
  modelType,
  scale = 0.27,
}) => {
  const gltf = useGLTF(CAR_GLB_MAP[modelType])
  const cloned = useMemo(() => {
    const c = gltf.scene.clone(true)
    c.traverse((node) => {
      if ((node as THREE.Mesh).isMesh) {
        node.castShadow = true
        node.receiveShadow = true
      }
    })
    return c
  }, [gltf])

  // In Kenney car kit:
  // Front of car faces +Z.
  // In Three.js, Object3D.lookAt(target) naturally points local +Z directly toward target.
  // No 180° flip needed, so cars drive forward!
  return (
    <group scale={[scale, scale, scale]}>
      <primitive object={cloned} />
    </group>
  )
}

// Vehicle State Machine Types
type VehicleState = 'LOOPING' | 'ENTERING_CARPARK' | 'PARKED' | 'EXITING_CARPARK'

interface VehicleRuntime {
  id: string;
  modelType: VehicleModelType;
  state: VehicleState;
  // Progress along current curve (0.0 to 1.0)
  progress: number;
  // Speed multiplier
  speed: number;
  // Laps completed on main loop
  lapsCompleted: number;
  // Target laps before parking
  targetLaps: number;
  // Stall assigned when parking
  assignedStallIndex: number | null;
  // Time remaining parked (seconds)
  parkedTimer: number;
  // Specific path when entering/exiting
  customCurve: THREE.CatmullRomCurve3 | null;
}

export const Traffic: React.FC = () => {
  // 1. Build the precise road-center loop curve encircling the 2x2 Datacenter campus and residential quarter
  const loopCurve = useMemo(() => {
    const pts: THREE.Vector3[] = [
      // North Road (along z = -15.5, heading East)
      new THREE.Vector3(6.5, 0.08, -15.5),
      new THREE.Vector3(9.5, 0.08, -15.5),
      new THREE.Vector3(12.5, 0.08, -15.5),
      new THREE.Vector3(15.5, 0.08, -15.5),
      new THREE.Vector3(18.5, 0.08, -15.5),
      new THREE.Vector3(19.5, 0.08, -15.5),

      // Corner 1 fillet: (20.0, -15.5) turning South
      new THREE.Vector3(19.85, 0.08, -15.35),
      new THREE.Vector3(20.0, 0.08, -15.0),

      // East Road (along x = 20.0, heading South past Carpark junction z = -8.5)
      new THREE.Vector3(20.0, 0.08, -13.0),
      new THREE.Vector3(20.0, 0.08, -11.0),
      new THREE.Vector3(20.0, 0.08, -8.5), // Carpark junction
      new THREE.Vector3(20.0, 0.08, -6.0),
      new THREE.Vector3(20.0, 0.08, -3.0),
      new THREE.Vector3(20.0, 0.08, 0.0),
      new THREE.Vector3(20.0, 0.08, 2.5),
      new THREE.Vector3(20.0, 0.08, 4.0),

      // Corner 2 fillet: (20.0, 4.5) turning West
      new THREE.Vector3(19.85, 0.08, 4.35),
      new THREE.Vector3(19.5, 0.08, 4.5),

      // South Main Avenue (along z = 4.5, heading West past houses)
      new THREE.Vector3(16.5, 0.08, 4.5),
      new THREE.Vector3(13.0, 0.08, 4.5),
      new THREE.Vector3(9.5, 0.08, 4.5),
      new THREE.Vector3(6.0, 0.08, 4.5),
      new THREE.Vector3(2.5, 0.08, 4.5),
      new THREE.Vector3(-1.0, 0.08, 4.5),
      new THREE.Vector3(-4.0, 0.08, 4.5),
      new THREE.Vector3(-6.5, 0.08, 4.5),

      // Corner 3 fillet: (-7.0, 4.5) turning North between house blocks
      new THREE.Vector3(-6.85, 0.08, 4.35),
      new THREE.Vector3(-7.0, 0.08, 4.0),

      // Residential Street (along x = -7.0, heading North)
      new THREE.Vector3(-7.0, 0.08, 2.5),
      new THREE.Vector3(-7.0, 0.08, 1.0),

      // Corner 4 fillet: (-7.0, 0.5) turning East
      new THREE.Vector3(-6.85, 0.08, 0.65),
      new THREE.Vector3(-6.5, 0.08, 0.5),

      // Connector Road (along z = 0.5, heading East)
      new THREE.Vector3(-4.0, 0.08, 0.5),
      new THREE.Vector3(-1.5, 0.08, 0.5),
      new THREE.Vector3(1.0, 0.08, 0.5),
      new THREE.Vector3(3.5, 0.08, 0.5),
      new THREE.Vector3(5.5, 0.08, 0.5),

      // Corner 5 fillet: (6.0, 0.5) turning North
      new THREE.Vector3(5.85, 0.08, 0.35),
      new THREE.Vector3(6.0, 0.08, 0.0),

      // West Datacenter Road (along x = 6.0, heading North)
      new THREE.Vector3(6.0, 0.08, -3.0),
      new THREE.Vector3(6.0, 0.08, -6.5),
      new THREE.Vector3(6.0, 0.08, -10.0),
      new THREE.Vector3(6.0, 0.08, -13.0),
      new THREE.Vector3(6.0, 0.08, -15.0),

      // Corner 6 fillet: (6.0, -15.5) turning East back into North road
      new THREE.Vector3(6.15, 0.08, -15.35),
    ]

    return new THREE.CatmullRomCurve3(pts, true, 'centripetal')
  }, [])

  // Junction point on loop: index/progress near (20.0, -8.5)
  // Let's find exact t on loopCurve closest to (20.0, 0.08, -8.5)
  const junctionProgress = useMemo(() => {
    const target = new THREE.Vector3(20.0, 0.08, -8.5)
    let bestT = 0
    let bestDist = Infinity
    for (let i = 0; i < 200; i++) {
      const t = i / 200
      const p = loopCurve.getPointAt(t)
      const d = p.distanceTo(target)
      if (d < bestDist) {
        bestDist = d
        bestT = t
      }
    }
    return bestT
  }, [loopCurve])

  // Helper to build entry curve into a given stall
  const buildEnterCurve = (stall: ParkingStall) => {
    const pts = [
      new THREE.Vector3(20.0, 0.08, -8.5),
      new THREE.Vector3(20.8, 0.08, -8.5),
      new THREE.Vector3(21.8, 0.08, -8.5),
      new THREE.Vector3(22.8, 0.08, -8.5),
      new THREE.Vector3(stall.aislePos[0], 0.08, stall.aislePos[2]),
      new THREE.Vector3(stall.worldPos[0], 0.08, stall.worldPos[2]),
    ]
    return new THREE.CatmullRomCurve3(pts, false, 'centripetal')
  }

  // Helper to build exit curve out of a given stall
  const buildExitCurve = (stall: ParkingStall) => {
    const pts = [
      new THREE.Vector3(stall.worldPos[0], 0.08, stall.worldPos[2]),
      new THREE.Vector3(stall.aislePos[0], 0.08, stall.aislePos[2]),
      new THREE.Vector3(22.8, 0.08, -8.5),
      new THREE.Vector3(21.8, 0.08, -8.5),
      new THREE.Vector3(20.8, 0.08, -8.5),
      new THREE.Vector3(20.0, 0.08, -8.5),
    ]
    return new THREE.CatmullRomCurve3(pts, false, 'centripetal')
  }

  // 2. Initial fleet of vehicles loaded from kenney_car-kit
  const vehiclesRef = useRef<VehicleRuntime[]>([
    // Active sports sedan cruising on loop
    {
      id: 'car-sports',
      modelType: 'sedan-sports',
      state: 'LOOPING',
      progress: 0.05,
      speed: 0.022,
      lapsCompleted: 0,
      targetLaps: 2,
      assignedStallIndex: null,
      parkedTimer: 0,
      customCurve: null,
    },
    // Active commercial delivery truck on loop
    {
      id: 'car-delivery',
      modelType: 'delivery',
      state: 'LOOPING',
      progress: 0.38,
      speed: 0.018,
      lapsCompleted: 0,
      targetLaps: 3,
      assignedStallIndex: null,
      parkedTimer: 0,
      customCurve: null,
    },
    // Active municipal police cruiser on loop
    {
      id: 'car-police',
      modelType: 'police',
      state: 'LOOPING',
      progress: 0.72,
      speed: 0.023,
      lapsCompleted: 0,
      targetLaps: 2,
      assignedStallIndex: null,
      parkedTimer: 0,
      customCurve: null,
    },
    // Parked in West Stall 1 (Yellow Taxi)
    {
      id: 'car-taxi',
      modelType: 'taxi',
      state: 'PARKED',
      progress: 1.0,
      speed: 0.021,
      lapsCompleted: 0,
      targetLaps: 2,
      assignedStallIndex: 0,
      parkedTimer: 6.0, // exits soon to join traffic
      customCurve: null,
    },
    // Parked in East Stall 1 (SUV)
    {
      id: 'car-suv',
      modelType: 'suv',
      state: 'PARKED',
      progress: 1.0,
      speed: 0.019,
      lapsCompleted: 0,
      targetLaps: 2,
      assignedStallIndex: 4,
      parkedTimer: 18.0,
      customCurve: null,
    },
    // Parked in West Stall 2 (Sports Hatchback)
    {
      id: 'car-hatchback',
      modelType: 'hatchback-sports',
      state: 'PARKED',
      progress: 1.0,
      speed: 0.021,
      lapsCompleted: 0,
      targetLaps: 3,
      assignedStallIndex: 1,
      parkedTimer: 30.0,
      customCurve: null,
    },
  ])

  // Track stall occupancy
  const occupiedStalls = useRef<Set<number>>(new Set([0, 1, 4]))

  // Mesh group refs for direct transform updates (optimal 60fps performance)
  const carGroupRefs = useRef<(THREE.Group | null)[]>([])

  // Main animation frame loop with intelligent anti-collision and queueing
  useFrame((_, delta) => {
    // Clamp delta to prevent huge jumps on tab switch
    const dt = Math.min(delta, 0.1)

    vehiclesRef.current.forEach((veh, index) => {
      const group = carGroupRefs.current[index]
      if (!group) return

      // --- STATE 1: LOOPING ---
      if (veh.state === 'LOOPING') {
        // 1. Adaptive Cruise Control: check for vehicle ahead on the loop
        let speedFactor = 1.0

        for (let j = 0; j < vehiclesRef.current.length; j++) {
          if (j === index) continue
          const other = vehiclesRef.current[j]
          if (other.state === 'LOOPING') {
            let diff = (other.progress - veh.progress) % 1.0
            if (diff < 0) diff += 1.0

            // If another vehicle is ahead within ~5.5 units (progress ~0.045)
            if (diff < 0.045 && diff > 0.0001) {
              if (diff < 0.02) {
                speedFactor = 0.0 // Full stop behind car ahead
              } else {
                // Smooth deceleration buffer
                speedFactor = Math.min(speedFactor, (diff - 0.02) / 0.025)
              }
            }
          }
        }

        // 2. 3D Spatial Forward Proximity Check (Safety Net)
        const myPos = group.position
        for (let j = 0; j < vehiclesRef.current.length; j++) {
          if (j === index) continue
          const otherGroup = carGroupRefs.current[j]
          if (!otherGroup) continue
          const otherVeh = vehiclesRef.current[j]
          if (otherVeh.state === 'PARKED') continue

          const dist = myPos.distanceTo(otherGroup.position)
          if (dist < 2.2) {
            const toOther = new THREE.Vector3().subVectors(otherGroup.position, myPos).normalize()
            const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(group.quaternion)
            if (forward.dot(toOther) > 0.4) {
              if (dist < 1.35) {
                speedFactor = 0.0
              } else {
                speedFactor = Math.min(speedFactor, (dist - 1.35) / 0.85)
              }
            }
          }
        }

        const prevProg = veh.progress
        veh.progress = (veh.progress + dt * veh.speed * speedFactor) % 1.0

        // Lap completed when wrapping from ~0.99 to ~0.0
        if (prevProg > 0.8 && veh.progress < 0.2) {
          veh.lapsCompleted += 1
        }

        // Check if passing Carpark junction (with threshold window)
        const isNearJunction =
          Math.abs(veh.progress - junctionProgress) < 0.025 ||
          (prevProg < junctionProgress && veh.progress >= junctionProgress)

        // Only turn into carpark if driveway is clear of conflicting cars
        const drivewayBusy = vehiclesRef.current.some(
          (o) => o.id !== veh.id && (o.state === 'ENTERING_CARPARK' || o.state === 'EXITING_CARPARK')
        )

        if (isNearJunction && veh.lapsCompleted >= veh.targetLaps && !drivewayBusy) {
          // Look for an open stall
          let freeStallIdx: number | null = null
          for (let s = 0; s < CARPARK_STALLS.length; s++) {
            if (!occupiedStalls.current.has(s)) {
              freeStallIdx = s
              break
            }
          }

          if (freeStallIdx !== null) {
            occupiedStalls.current.add(freeStallIdx)
            veh.assignedStallIndex = freeStallIdx
            veh.state = 'ENTERING_CARPARK'
            veh.progress = 0.0
            veh.customCurve = buildEnterCurve(CARPARK_STALLS[freeStallIdx])
          }
        }

        // Position & align with loop
        const pos = loopCurve.getPointAt(veh.progress)
        const nextPos = loopCurve.getPointAt((veh.progress + 0.008) % 1.0)
        group.position.copy(pos)
        group.lookAt(nextPos)
      }

      // --- STATE 2: ENTERING CARPARK ---
      else if (veh.state === 'ENTERING_CARPARK' && veh.customCurve) {
        veh.progress += dt * (veh.speed * 3.2)

        if (veh.progress >= 1.0) {
          veh.progress = 1.0
          veh.state = 'PARKED'
          // Dwell in parking stall for 12 to 24 seconds
          veh.parkedTimer = 12.0 + Math.random() * 12.0
          veh.customCurve = null

          // Set parked transform exactly
          if (veh.assignedStallIndex !== null) {
            const stall = CARPARK_STALLS[veh.assignedStallIndex]
            group.position.set(stall.worldPos[0], stall.worldPos[1], stall.worldPos[2])
            group.rotation.set(0, stall.rotation, 0)
          }
        } else {
          const pos = veh.customCurve.getPointAt(Math.min(veh.progress, 1.0))
          const nextPos = veh.customCurve.getPointAt(Math.min(veh.progress + 0.02, 1.0))
          group.position.copy(pos)
          group.lookAt(nextPos)
        }
      }

      // --- STATE 3: PARKED ---
      else if (veh.state === 'PARKED') {
        veh.parkedTimer -= dt

        if (veh.assignedStallIndex !== null) {
          const stall = CARPARK_STALLS[veh.assignedStallIndex]
          group.position.set(stall.worldPos[0], stall.worldPos[1], stall.worldPos[2])
          group.rotation.set(0, stall.rotation, 0)
        }

        // Ready to leave stall and hit the road
        if (veh.parkedTimer <= 0 && veh.assignedStallIndex !== null) {
          // Check if driveway is clear before pulling out
          const drivewayBusy = vehiclesRef.current.some(
            (o) => o.id !== veh.id && (o.state === 'ENTERING_CARPARK' || o.state === 'EXITING_CARPARK')
          )
          if (!drivewayBusy) {
            const stall = CARPARK_STALLS[veh.assignedStallIndex]
            veh.state = 'EXITING_CARPARK'
            veh.progress = 0.0
            veh.customCurve = buildExitCurve(stall)
          }
        }
      }

      // --- STATE 4: EXITING CARPARK ---
      else if (veh.state === 'EXITING_CARPARK' && veh.customCurve) {
        // Approaching road junction (progress >= 0.75): yield to oncoming traffic on main loop
        const approachingJunction = veh.progress >= 0.75
        let yieldToLoopTraffic = false

        if (approachingJunction) {
          yieldToLoopTraffic = vehiclesRef.current.some((other) => {
            if (other.state !== 'LOOPING') return false
            let distToJunction = (junctionProgress - other.progress) % 1.0
            if (distToJunction < 0) distToJunction += 1.0
            // Oncoming vehicle within ~7 units before junction or 2 units past
            return distToJunction < 0.055 || Math.abs(other.progress - junctionProgress) < 0.015
          })
        }

        if (yieldToLoopTraffic && veh.progress >= 0.78) {
          // Hold at the driveway stop line until road is clear
          veh.progress = 0.78
        } else {
          veh.progress += dt * (veh.speed * 3.0)
        }

        if (veh.progress >= 1.0) {
          // Rejoin main loop at junction
          if (veh.assignedStallIndex !== null) {
            occupiedStalls.current.delete(veh.assignedStallIndex)
            veh.assignedStallIndex = null
          }
          veh.state = 'LOOPING'
          veh.progress = (junctionProgress + 0.01) % 1.0
          veh.lapsCompleted = 0
          veh.targetLaps = 2 + Math.floor(Math.random() * 2)
          veh.customCurve = null
        } else {
          const pos = veh.customCurve.getPointAt(Math.min(veh.progress, 1.0))
          const nextPos = veh.customCurve.getPointAt(Math.min(veh.progress + 0.02, 1.0))
          group.position.copy(pos)
          group.lookAt(nextPos)
        }
      }
    })
  })

  return (
    <group>
      {vehiclesRef.current.map((veh, idx) => (
        <group
          key={veh.id}
          ref={(el) => {
            carGroupRefs.current[idx] = el
          }}
        >
          <KenneyVehicle modelType={veh.modelType} />
        </group>
      ))}
    </group>
  )
}
