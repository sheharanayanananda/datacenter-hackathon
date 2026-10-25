import React, { Suspense, useRef, useEffect, useState } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Terrain } from './Terrain'
import { DataCenter } from './DataCenter'
import { WindTurbines } from './WindTurbines'
import { NordicHouses } from './NordicHouses'
import { Forest } from './Forest'
import { Traffic } from './Traffic'
import { NasineulaTower } from './NasineulaTower'
import { Carpark } from './Carpark'
import { ModularRoads } from './ModularRoads'
import { SolarFarm } from './SolarFarm'
import { ExpansionZoneForest } from './ExpansionZoneForest'
import { ObjectInspectBubble } from './ObjectInspectBubble'
import { getInspectableObjectData, InspectableObjectData } from '../data/inspectableObjects'
import { HouseInfo, InspectionTab } from '../types'

interface SceneProps {
  onOpenDetails: (tab: InspectionTab) => void;
  onExploreImpact?: (key: string) => void;
  onSelectHouse: (house: HouseInfo) => void;
  dataCenterHovered: boolean;
  setDataCenterHovered: (h: boolean) => void;
  controlMode?: 'pan' | 'rotate';
  recenterTrigger?: number;
  level?: number;
}

// Bounding box limits for camera target to keep focus strictly within the designed world
const PAN_LIMITS = {
  minX: -7.0,
  maxX: 15.0,
  minZ: -12.5,
  maxZ: 8.5,
  y: 0.5,
}

// Controls camera movement and clamps navigation strictly inside the designed area
const MapController: React.FC<{
  controlsRef: React.RefObject<any>;
  recenterTrigger: number;
}> = ({ controlsRef, recenterTrigger }) => {
  const { camera } = useThree()
  const keys = useRef<{ [key: string]: boolean }>({})

  // Handle Recenter to the default panoramic overview
  useEffect(() => {
    if (recenterTrigger > 0 && controlsRef.current) {
      controlsRef.current.target.set(4.5, 0.5, -2.5)
      camera.position.set(-16.2, 22.8, 37.2)
      if ('zoom' in camera) {
        ;(camera as THREE.OrthographicCamera).zoom = 38.0
        camera.updateProjectionMatrix()
      }
      controlsRef.current.update()
    }
  }, [recenterTrigger, camera, controlsRef])

  // Track WASD / Arrow keys for map panning
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return
      keys.current[e.code] = true
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current[e.code] = false
    }
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  // Smooth keyboard panning across ground and hard boundary clamping
  useFrame((_, delta) => {
    const controls = controlsRef.current
    if (!controls) return

    const forward = new THREE.Vector3()
    camera.getWorldDirection(forward)
    forward.y = 0
    forward.normalize()

    // Up x Forward = Right vector
    const right = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), forward).normalize()

    const move = new THREE.Vector3()
    const speed = 25 * delta

    if (keys.current['KeyW'] || keys.current['ArrowUp']) {
      move.addScaledVector(forward, speed)
    }
    if (keys.current['KeyS'] || keys.current['ArrowDown']) {
      move.addScaledVector(forward, -speed)
    }
    if (keys.current['KeyA'] || keys.current['ArrowLeft']) {
      move.addScaledVector(right, -speed)
    }
    if (keys.current['KeyD'] || keys.current['ArrowRight']) {
      move.addScaledVector(right, speed)
    }

    if (move.lengthSq() > 0) {
      controls.target.add(move)
      camera.position.add(move)
    }

    // Hard boundary clamping: stops both mouse drag panning and keyboard panning
    const prevX = controls.target.x
    const prevZ = controls.target.z

    controls.target.x = THREE.MathUtils.clamp(controls.target.x, PAN_LIMITS.minX, PAN_LIMITS.maxX)
    controls.target.z = THREE.MathUtils.clamp(controls.target.z, PAN_LIMITS.minZ, PAN_LIMITS.maxZ)
    controls.target.y = PAN_LIMITS.y

    const deltaX = controls.target.x - prevX
    const deltaZ = controls.target.z - prevZ
    if (deltaX !== 0 || deltaZ !== 0) {
      camera.position.x += deltaX
      camera.position.z += deltaZ
    }

    controls.update()
  })

  return null
}

// Directional sunlight tracker: follows camera target so that all visible trees receive 100% full shadow coverage
const SunController: React.FC<{
  dirLightRef: React.RefObject<THREE.DirectionalLight | null>;
  lightTargetRef: React.RefObject<THREE.Object3D>;
  controlsRef: React.RefObject<any>;
}> = ({ dirLightRef, lightTargetRef, controlsRef }) => {
  useFrame(() => {
    if (dirLightRef.current && lightTargetRef.current && controlsRef.current) {
      const target = controlsRef.current.target
      dirLightRef.current.position.set(target.x - 16, 26, target.z + 12)
      lightTargetRef.current.position.set(target.x, 0, target.z)
      lightTargetRef.current.updateMatrixWorld()
    }
  })
  return null
}

export const Scene: React.FC<SceneProps> = ({
  onOpenDetails,
  onExploreImpact,
  onSelectHouse,
  dataCenterHovered,
  setDataCenterHovered,
  controlMode = 'pan',
  recenterTrigger = 0,
  level = 3,
}) => {
  const controlsRef = useRef<any>(null)
  const dirLightRef = useRef<THREE.DirectionalLight>(null)
  const lightTargetRef = useRef<THREE.Object3D>(new THREE.Object3D())
  const [spacePressed, setSpacePressed] = useState(false)
  const [inspectedObject, setInspectedObject] = useState<InspectableObjectData | null>(null)
  const [hoveredInteractable, setHoveredInteractable] = useState(false)

  // Live-update inspected object stats if the simulation level changes
  useEffect(() => {
    if (inspectedObject) {
      setInspectedObject((prev) =>
        prev
          ? getInspectableObjectData(prev.category, level as any, {
              id: prev.id,
              customTitle: prev.title,
              position: prev.position,
            })
          : null
      )
    }
  }, [level])

  // Hold Spacebar for temporary Pan mode
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        setSpacePressed(true)
      }
    }
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setSpacePressed(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [])

  const isPanning = controlMode === 'pan' || spacePressed
  const cursorClass = hoveredInteractable
    ? 'cursor-pointer'
    : isPanning
    ? 'cursor-grab active:cursor-grabbing'
    : 'cursor-move active:cursor-grabbing'

  return (
    <div
      className={`w-full h-full select-none ${cursorClass}`}
      onContextMenu={(e) => e.preventDefault()}
    >
      <Canvas
        shadows="soft"
        orthographic
        onPointerMissed={() => setHoveredInteractable(false)}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
        camera={{
          position: [-16.2, 22.8, 37.2],
          zoom: 38.0,
          near: -500,
          far: 2000,
        }}
      >
        {/* Soft atmospheric Nordic sky and distance fog */}
        <color attach="background" args={['#85b3c2']} />
        <fog attach="fog" args={['#85b3c2', 170, 480]} />

        {/* Balanced lighting rig: low ambient to ensure rich depth & contrast */}
        <ambientLight intensity={0.4} color="#f1f5f9" />
        <hemisphereLight
          args={['#bae6fd', '#1e3a1e', 0.55]}
          position={[0, 50, 0]}
        />

        {/* Dynamic directional sunlight with tuned bias to eliminate acne and peter-panning */}
        <primitive object={lightTargetRef.current} />
        <directionalLight
          ref={dirLightRef}
          target={lightTargetRef.current}
          position={[-11.5, 26, 9.5]}
          intensity={2.3}
          color="#fffbeb"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-left={-34}
          shadow-camera-right={34}
          shadow-camera-top={34}
          shadow-camera-bottom={-34}
          shadow-camera-near={0.5}
          shadow-camera-far={85}
          shadow-bias={-0.0001}
          shadow-normalBias={0.035}
        />

        {/* Secondary fill light reflecting off Lake Näsijärvi */}
        <directionalLight
          position={[14, 9, -12]}
          intensity={0.45}
          color="#93c5fd"
        />

        {/* Subtle rim light for crisp object silhouettes */}
        <directionalLight
          position={[-16, 12, -18]}
          intensity={0.25}
          color="#fef08a"
        />

        <Suspense fallback={null}>
          {/* 1. Base Terrain & Lake Näsijärvi */}
          <Terrain
            onClearInspect={() => setInspectedObject(null)}
            onHover={setHoveredInteractable}
            onSelectLake={() =>
              setInspectedObject(
                getInspectableObjectData('lake', level as any, {
                  id: 'lake-nasijarvi',
                  customTitle: 'Lake Näsijärvi',
                  position: [-16.0, 0.4, -19.5],
                })
              )
            }
          />

          {/* 1b. Modular Kenney 3D Road Network */}
          <ModularRoads
            onHover={setHoveredInteractable}
            onSelectRoad={(pos) =>
              setInspectedObject(
                getInspectableObjectData('road', level as any, { position: pos })
              )
            }
          />

          {/* 2. Forest Perimeter & Dynamic Unbuilt Lot Trees */}
          <Forest
            onHover={setHoveredInteractable}
            onSelectForest={(pos) =>
              setInspectedObject(
                getInspectableObjectData('forest', level as any, { position: pos })
              )
            }
            onSelectRock={(pos) =>
              setInspectedObject(
                getInspectableObjectData('rock', level as any, { position: pos })
              )
            }
          />
          <ExpansionZoneForest
            level={level}
            onHover={setHoveredInteractable}
            onSelectForest={(pos) =>
              setInspectedObject(
                getInspectableObjectData('forest', level as any, { position: pos })
              )
            }
          />

          {/* 3. Tampere Näsinneula Observation Tower (North-West) */}
          <NasineulaTower
            position={[-5.0, 0, -6.0]}
            onHover={setHoveredInteractable}
            onClick={() =>
              setInspectedObject(
                getInspectableObjectData('tower', level as any, {
                  position: [-5.0, 7.5, -6.0],
                })
              )
            }
          />

          {/* 4. Power Generation Infrastructure (South-East Wind Turbines) */}
          <WindTurbines
            level={level}
            onHover={setHoveredInteractable}
            onSelectTurbine={(turbine) =>
              setInspectedObject(
                getInspectableObjectData('wind', level as any, {
                  id: turbine.id,
                  customTitle: turbine.name,
                  position: turbine.position,
                })
              )
            }
          />

          {/* 5. Central Data Center Campus: Level 1 has 1 DC; Levels 2 & 3 have all 4 */}
          {/* South-West Facility (Primary lot, always active) */}
          <DataCenter
            position={[10.0, 0, -5.5]}
            isSelected={dataCenterHovered}
            onHover={(h) => {
              setDataCenterHovered(h)
              setHoveredInteractable(h)
            }}
            onClick={() =>
              setInspectedObject(
                getInspectableObjectData('datacenter', level as any, {
                  id: 'dc-sw',
                  customTitle: 'Data Center (Hall 1)',
                  position: [10.0, 2.2, -5.5],
                })
              )
            }
          />

          {/* South-East Facility (Activated in Level 2 & 3) */}
          {level >= 2 && (
            <DataCenter
              position={[16.0, 0, -5.5]}
              isSelected={dataCenterHovered}
              onHover={(h) => {
                setDataCenterHovered(h)
                setHoveredInteractable(h)
              }}
              onClick={() =>
                setInspectedObject(
                  getInspectableObjectData('datacenter', level as any, {
                    id: 'dc-se',
                    customTitle: 'Data Center (Hall 2)',
                    position: [16.0, 2.2, -5.5],
                  })
                )
              }
            />
          )}

          {/* North-West Facility (Activated in Level 2 & 3) */}
          {level >= 2 && (
            <DataCenter
              position={[10.0, 0, -11.5]}
              isSelected={dataCenterHovered}
              onHover={(h) => {
                setDataCenterHovered(h)
                setHoveredInteractable(h)
              }}
              onClick={() =>
                setInspectedObject(
                  getInspectableObjectData('datacenter', level as any, {
                    id: 'dc-nw',
                    customTitle: 'Data Center (Hall 3)',
                    position: [10.0, 2.2, -11.5],
                  })
                )
              }
            />
          )}

          {/* North-East Facility (Activated in Level 3 Peak) */}
          {level >= 3 && (
            <DataCenter
              position={[16.0, 0, -11.5]}
              isSelected={dataCenterHovered}
              onHover={(h) => {
                setDataCenterHovered(h)
                setHoveredInteractable(h)
              }}
              onClick={() =>
                setInspectedObject(
                  getInspectableObjectData('datacenter', level as any, {
                    id: 'dc-ne',
                    customTitle: 'Data Center (Hall 4 - Peak)',
                    position: [16.0, 2.2, -11.5],
                  })
                )
              }
            />
          )}

          {/* 5b. Dedicated Solar Microgrid Farm (Level 1: none, Level 2: some, Level 3: full) */}
          <SolarFarm
            level={level}
            onHover={setHoveredInteractable}
            onSelectSolar={() =>
              setInspectedObject(
                getInspectableObjectData('solar', level as any, {
                  position: [14.0, 1.0, -14.0],
                })
              )
            }
          />

          {/* 6. Carpark (Attached East of Datacenter) */}
          <Carpark
            onHover={setHoveredInteractable}
            onClick={() =>
              setInspectedObject(
                getInspectableObjectData('carpark', level as any, {
                  position: [22.8, 0.4, -8.5],
                })
              )
            }
          />

          {/* 7. Nordic Residential Houses (South-West Quadrant) */}
          <NordicHouses
            onHover={setHoveredInteractable}
            onSelectHouse={(house) => {
              onSelectHouse(house)
              setInspectedObject(
                getInspectableObjectData('house', level as any, {
                  id: house.id,
                  customTitle: house.name,
                  position: [house.position[0], house.position[1] + 1.2, house.position[2]],
                })
              )
            }}
          />

          {/* 8. Animated Road Traffic (scaled by Level) */}
          <Traffic level={level} />

          {/* 9. Diegetic 3D World Inspect Bubble */}
          {inspectedObject && (
            <ObjectInspectBubble
              data={inspectedObject}
              onClose={() => setInspectedObject(null)}
              onExploreImpact={onExploreImpact}
            />
          )}
        </Suspense>

        <MapController
          controlsRef={controlsRef}
          recenterTrigger={recenterTrigger}
        />

        <SunController
          dirLightRef={dirLightRef}
          lightTargetRef={lightTargetRef}
          controlsRef={controlsRef}
        />

        {/* Camera Orbit Constraints: Locked inside designed territory, no seeing the void */}
        <OrbitControls
          ref={controlsRef}
          enableRotate={true}
          enablePan={true}
          enableZoom={true}
          screenSpacePanning={false}
          panSpeed={1.2}
          rotateSpeed={0.8}
          minZoom={36.0} // Prevents zooming out beyond the forest perimeter
          maxZoom={90}   // Generous zoom-in for inspecting town details
          maxPolarAngle={Math.PI / 2.7}  // ~67 deg: generous low angle
          minPolarAngle={Math.PI / 8.0}  // ~22 deg: high aerial view
          target={[4.5, 0.5, -2.5]}
          dampingFactor={0.06}
          mouseButtons={{
            LEFT: isPanning ? THREE.MOUSE.PAN : THREE.MOUSE.ROTATE,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: isPanning ? THREE.MOUSE.ROTATE : THREE.MOUSE.PAN,
          }}
        />
      </Canvas>
    </div>
  )
}
