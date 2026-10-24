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
        const mesh = node as THREE.Mesh
        if (Array.isArray(mesh.material)) {
          mesh.material = mesh.material.map((m) => m.clone())
        } else if (mesh.material) {
          mesh.material = mesh.material.clone()
        }

        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
        mats.forEach((m) => {
          if (m instanceof THREE.MeshStandardMaterial) {
            // Automotive paint clearcoat with high gloss specular response
            m.roughness = 0.22
            m.metalness = 0.65
          }
        })
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
  // Base cruising speed
  speed: number;
  // Individual preferred following distance
  minGap: number;
  // Laps completed on main loop
  lapsCompleted: number;
  // Target laps before parking
  targetLaps: number;
  // Stall assigned when parking
  assignedStallIndex: number | null;
  // Time remaining parked (seconds)
  parkedTimer: number;
  // Time spent yielding at driveway stop line
  yieldTimer: number;
  // Specific path when entering/exiting
  customCurve: THREE.CatmullRomCurve3 | null;
}

export const Traffic: React.FC<{ level?: number }> = ({ level = 3 }) => {
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

      // South Main Avenue (along z = 4.5, heading West past houses through crossroad)
      new THREE.Vector3(16.5, 0.08, 4.5),
      new THREE.Vector3(13.0, 0.08, 4.5),
      new THREE.Vector3(9.5, 0.08, 4.5),
      new THREE.Vector3(6.0, 0.08, 4.5),
      new THREE.Vector3(2.5, 0.08, 4.5),
      new THREE.Vector3(-1.0, 0.08, 4.5),
      new THREE.Vector3(-4.0, 0.08, 4.5),
      new THREE.Vector3(-7.0, 0.08, 4.5), // Across 4-way crossroad
      new THREE.Vector3(-9.5, 0.08, 4.5),
      new THREE.Vector3(-12.0, 0.08, 4.5),
      new THREE.Vector3(-14.0, 0.08, 4.5),
      new THREE.Vector3(-14.5, 0.08, 4.5),

      // Corner A fillet: (-15.0, 4.5) turning South into Outer West Avenue
      new THREE.Vector3(-14.85, 0.08, 4.65),
      new THREE.Vector3(-15.0, 0.08, 5.0),

      // Outer West Avenue (along x = -15.0, heading South)
      new THREE.Vector3(-15.0, 0.08, 6.5),
      new THREE.Vector3(-15.0, 0.08, 8.5),
      new THREE.Vector3(-15.0, 0.08, 10.5),
      new THREE.Vector3(-15.0, 0.08, 11.0),

      // Corner B fillet: (-15.0, 11.5) turning East into South Connector Avenue
      new THREE.Vector3(-14.85, 0.08, 11.35),
      new THREE.Vector3(-14.5, 0.08, 11.5),

      // South Connector Avenue (along z = 11.5, heading East)
      new THREE.Vector3(-13.0, 0.08, 11.5),
      new THREE.Vector3(-11.0, 0.08, 11.5),
      new THREE.Vector3(-9.0, 0.08, 11.5),
      new THREE.Vector3(-7.5, 0.08, 11.5),

      // Corner C fillet: (-7.0, 11.5) turning North into Residential Street
      new THREE.Vector3(-7.15, 0.08, 11.35),
      new THREE.Vector3(-7.0, 0.08, 11.0),

      // Residential Street (along x = -7.0, heading North through crossroad)
      new THREE.Vector3(-7.0, 0.08, 9.5),
      new THREE.Vector3(-7.0, 0.08, 7.5),
      new THREE.Vector3(-7.0, 0.08, 5.5),
      new THREE.Vector3(-7.0, 0.08, 4.5), // Across 4-way crossroad
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
    for (let i = 0; i < 400; i++) {
      const t = i / 400
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

  // Helper to build exit curve out of a given stall with stop line at x=21.2
  const buildExitCurve = (stall: ParkingStall) => {
    const pts = [
      new THREE.Vector3(stall.worldPos[0], 0.08, stall.worldPos[2]),
      new THREE.Vector3(stall.aislePos[0], 0.08, stall.aislePos[2]),
      new THREE.Vector3(22.8, 0.08, -8.5),
      new THREE.Vector3(21.8, 0.08, -8.5),
      new THREE.Vector3(21.2, 0.08, -8.5), // Driveway holding/stop line clear of road
      new THREE.Vector3(20.0, 0.08, -8.5), // Road center junction
    ]
    return new THREE.CatmullRomCurve3(pts, false, 'centripetal')
  }

  // 2. Initial fleet with staggered positions, varied driving styles and randomized timers
  // Vehicles 0 and 1 start on the loop; all new vehicles (2..5) appear from the datacenter carpark stalls
  const vehiclesRef = useRef<VehicleRuntime[]>([
    // Active sports sedan cruising on loop (nimble & swift)
    {
      id: 'car-sports',
      modelType: 'sedan-sports',
      state: 'LOOPING',
      progress: 0.1,
      speed: 0.018,
      minGap: 0.022,
      lapsCompleted: 0,
      targetLaps: 3,
      assignedStallIndex: null,
      parkedTimer: 0,
      yieldTimer: 0,
      customCurve: null,
    },
    // Active commercial delivery truck on loop (calm & steady)
    {
      id: 'car-delivery',
      modelType: 'delivery',
      state: 'LOOPING',
      progress: 0.6,
      speed: 0.018,
      minGap: 0.024,
      lapsCompleted: 0,
      targetLaps: 2,
      assignedStallIndex: null,
      parkedTimer: 0,
      yieldTimer: 0,
      customCurve: null,
    },
    // Municipal police cruiser (Appears in Carpark West Stall 1 near datacenter)
    {
      id: 'car-police',
      modelType: 'police',
      state: 'PARKED',
      progress: 1.0,
      speed: 0.018,
      minGap: 0.024,
      lapsCompleted: 0,
      targetLaps: 4,
      assignedStallIndex: 0,
      parkedTimer: 2.0,
      yieldTimer: 0,
      customCurve: null,
    },
    // Yellow Taxi (Appears in Carpark West Stall 2 near datacenter)
    {
      id: 'car-taxi',
      modelType: 'taxi',
      state: 'PARKED',
      progress: 1.0,
      speed: 0.017,
      minGap: 0.024,
      lapsCompleted: 0,
      targetLaps: 2,
      assignedStallIndex: 1,
      parkedTimer: 5.5,
      yieldTimer: 0,
      customCurve: null,
    },
    // SUV (Appears in Carpark East Stall 1 near datacenter)
    {
      id: 'car-suv',
      modelType: 'suv',
      state: 'PARKED',
      progress: 1.0,
      speed: 0.016,
      minGap: 0.026,
      lapsCompleted: 0,
      targetLaps: 3,
      assignedStallIndex: 4,
      parkedTimer: 2.5,
      yieldTimer: 0,
      customCurve: null,
    },
    // Sports Hatchback (Appears in Carpark East Stall 2 near datacenter)
    {
      id: 'car-hatchback',
      modelType: 'hatchback-sports',
      state: 'PARKED',
      progress: 1.0,
      speed: 0.019,
      minGap: 0.022,
      lapsCompleted: 0,
      targetLaps: 2,
      assignedStallIndex: 5,
      parkedTimer: 6.0,
      yieldTimer: 0,
      customCurve: null,
    },
  ])

  // Track stall occupancy: 0, 1, 4, 5 initially reserved for incoming datacenter fleet
  const occupiedStalls = useRef<Set<number>>(new Set([0, 1, 4, 5]))

  // Mesh group refs for direct transform updates (optimal 60fps performance)
  const carGroupRefs = useRef<(THREE.Group | null)[]>([])

  // Track level transitions to ensure new vehicles appear from carpark stalls
  const prevLevelRef = useRef<number>(level)

  React.useEffect(() => {
    const prevLvl = prevLevelRef.current
    prevLevelRef.current = level

    if (level === 1) {
      // Level 1: Reset the 2 vehicles to opposite sides so they loop continuously without stopping
      const v0 = vehiclesRef.current[0]
      v0.state = 'LOOPING'
      v0.progress = 0.1
      v0.speed = 0.018
      v0.customCurve = null
      v0.assignedStallIndex = null

      const v1 = vehiclesRef.current[1]
      v1.state = 'LOOPING'
      v1.progress = 0.6
      v1.speed = 0.018
      v1.customCurve = null
      v1.assignedStallIndex = null

      // Place inactive vehicles back in carpark stalls so they appear there next time
      const carparkDefaults = [
        { idx: 2, stall: 0, timer: 2.0 },
        { idx: 3, stall: 1, timer: 5.5 },
        { idx: 4, stall: 4, timer: 2.5 },
        { idx: 5, stall: 5, timer: 6.0 },
      ]
      occupiedStalls.current = new Set([0, 1, 4, 5])
      carparkDefaults.forEach(({ idx, stall, timer }) => {
        const veh = vehiclesRef.current[idx]
        if (veh) {
          veh.state = 'PARKED'
          veh.progress = 1.0
          veh.assignedStallIndex = stall
          veh.parkedTimer = timer
          veh.customCurve = null
          const group = carGroupRefs.current[idx]
          if (group) {
            const s = CARPARK_STALLS[stall]
            group.position.set(s.worldPos[0], s.worldPos[1], s.worldPos[2])
            group.rotation.set(0, s.rotation, 0)
          }
        }
      })
    } else if (level > prevLvl) {
      // When new vehicles appear, they appear directly in the carpark stalls near the datacenter
      const startIdx = prevLvl === 1 ? 2 : 4
      const endIdx = level === 2 ? 4 : vehiclesRef.current.length
      const stallSlots = [0, 1, 4, 5]

      for (let i = startIdx; i < endIdx; i++) {
        const veh = vehiclesRef.current[i]
        const stallIndex = stallSlots[i - 2] ?? 0
        occupiedStalls.current.add(stallIndex)
        veh.state = 'PARKED'
        veh.progress = 1.0
        veh.assignedStallIndex = stallIndex
        // Stagger exit time so they pull out smoothly into traffic
        veh.parkedTimer = 1.5 + (i - startIdx) * 3.0
        veh.customCurve = null

        const stall = CARPARK_STALLS[stallIndex]
        const group = carGroupRefs.current[i]
        if (group) {
          group.position.set(stall.worldPos[0], stall.worldPos[1], stall.worldPos[2])
          group.rotation.set(0, stall.rotation, 0)
        }
      }
    }
  }, [level])

  // Filter visible vehicle count based on Level (Level 1: 2, Level 2: 4, Level 3: all)
  const vehicleLimit = level === 1 ? 2 : level === 2 ? 4 : vehiclesRef.current.length

  // Main animation frame loop with intelligent anti-collision and queueing
  useFrame((_, delta) => {
    // Clamp delta to prevent huge jumps on tab switch
    const dt = Math.min(delta, 0.1)

    // Only process actively rendered vehicles for this level
    const activeVehicles = vehiclesRef.current.slice(0, vehicleLimit)

    activeVehicles.forEach((veh, index) => {
      const group = carGroupRefs.current[index]
      if (!group) return

      // In Level 1, vehicles circle continuously on the road loop without parking
      if (level === 1 && veh.state !== 'LOOPING') {
        veh.state = 'LOOPING'
        veh.progress = (index * 0.5) % 1.0
        veh.speed = 0.018
        veh.customCurve = null
        veh.assignedStallIndex = null
      }

      // --- STATE 1: LOOPING ---
      if (veh.state === 'LOOPING') {
        // 1. Adaptive Cruise Control on the loop with individual gap preferences
        let speedFactor = 1.0

        for (let j = 0; j < activeVehicles.length; j++) {
          if (j === index) continue
          const other = activeVehicles[j]
          // Only follow active vehicles on the loop (parked and driveway cars do not impede the main thoroughfare)
          if (other.state === 'LOOPING') {
            let diff = (other.progress - veh.progress) % 1.0
            if (diff < 0) diff += 1.0

            const safetyBuffer = veh.minGap + 0.025
            if (diff < safetyBuffer && diff > 0.0001) {
              if (diff < veh.minGap) {
                // In Level 1, gently adjust speed to maintain spacing rather than a full dead-stop
                speedFactor = level === 1 ? 0.75 : 0.0
              } else {
                // Smooth deceleration buffer matching leader
                speedFactor = Math.min(speedFactor, (diff - veh.minGap) / 0.025)
              }
            }
          }
        }

        // 2. Realistic road dynamics: open straightaway acceleration vs residential deceleration
        let roadModifier = 1.0
        if (veh.progress <= 0.13 || (veh.progress > 0.28 && veh.progress < 0.48)) {
          // North Road & South Main Avenue: brisk open-road cruising
          roadModifier = 1.15
        } else if (veh.progress >= 0.50 && veh.progress <= 0.72) {
          // Outer West Avenue & South Connector Avenue: steady cruising
          roadModifier = 1.08
        } else if (veh.progress > 0.72 && veh.progress < 0.88) {
          // Residential streets and inner quarter: cozy neighborhood pace
          roadModifier = 0.85
        }

        // Micro speed variation per car for organic flow
        const organicNoise = 1.0 + Math.sin(index * 2.3 + veh.progress * 12.0) * 0.03
        const currentSpeed = veh.speed * roadModifier * organicNoise

        const prevProg = veh.progress
        veh.progress = (veh.progress + dt * currentSpeed * speedFactor) % 1.0

        // Lap completed when wrapping from ~0.99 to ~0.0
        if (prevProg > 0.8 && veh.progress < 0.2) {
          veh.lapsCompleted += 1
        }

        // Check if passing Carpark junction (with threshold window)
        const isNearJunction =
          Math.abs(veh.progress - junctionProgress) < 0.025 ||
          (prevProg < junctionProgress && veh.progress >= junctionProgress)

        // Only turn into carpark if driveway is clear of conflicting cars
        const drivewayBusy = activeVehicles.some(
          (o) => o.id !== veh.id && (o.state === 'ENTERING_CARPARK' || o.state === 'EXITING_CARPARK')
        )

        // Vehicles only visit carpark in Level 2+
        if (level > 1 && isNearJunction && veh.lapsCompleted >= veh.targetLaps && !drivewayBusy) {
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
          // Dwell in parking stall for 16 to 45 seconds (varied realistic visits)
          veh.parkedTimer = 16.0 + Math.random() * 29.0
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
          const drivewayBusy = activeVehicles.some(
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
        // Approaching road junction (progress >= 0.70): yield to oncoming traffic on main loop
        const approachingJunction = veh.progress >= 0.70
        let yieldToLoopTraffic = false

        if (approachingJunction) {
          yieldToLoopTraffic = activeVehicles.some((other) => {
            if (other.state !== 'LOOPING') return false
            let distToJunction = (junctionProgress - other.progress) % 1.0
            if (distToJunction < 0) distToJunction += 1.0
            // Oncoming vehicle within ~4.5 units before junction or immediately crossing
            return distToJunction < 0.045 || distToJunction > 0.995
          })
        }

        // Hold at the driveway curb stop line until road is clear (or max 6s timeout to avoid any stalemate)
        if (yieldToLoopTraffic && veh.progress >= 0.72 && veh.yieldTimer < 6.0) {
          veh.yieldTimer += dt
          veh.progress = 0.72
        } else {
          veh.yieldTimer = 0
          veh.progress += dt * (veh.speed * 3.0)
        }

        if (veh.progress >= 1.0) {
          // Rejoin main loop at junction
          if (veh.assignedStallIndex !== null) {
            occupiedStalls.current.delete(veh.assignedStallIndex)
            veh.assignedStallIndex = null
          }
          veh.state = 'LOOPING'
          veh.progress = (junctionProgress + 0.015) % 1.0
          veh.lapsCompleted = 0
          veh.targetLaps = 1 + Math.floor(Math.random() * 4)
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
      {vehiclesRef.current.slice(0, vehicleLimit).map((veh, idx) => (
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
