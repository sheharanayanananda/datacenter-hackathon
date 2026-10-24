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
import { WorldBubbles, InspectedWorldObject } from './WorldBubbles'
import { HouseInfo, InspectionTab } from '../types'

interface SceneProps {
  onOpenDetails: (tab: InspectionTab) => void;
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
  const [inspectedObject, setInspectedObject] = useState<InspectedWorldObject>('datacenter')

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

  return (
    <div
      className={`w-full h-full select-none ${
        isPanning ? 'cursor-grab active:cursor-grabbing' : 'cursor-move active:cursor-grabbing'
      }`}
      onContextMenu={(e) => e.preventDefault()}
    >
      <Canvas
        shadows
        orthographic
        camera={{
          position: [-16.2, 22.8, 37.2],
          zoom: 38.0,
          near: -500,
          far: 2000,
        }}
      >
        {/* Soft morning/afternoon sky fog */}
        <color attach="background" args={['#7ca7b5']} />
        <fog attach="fog" args={['#7ca7b5', 180, 500]} />

        {/* Lighting setup matching warm Scandinavian sunlight */}
        <ambientLight intensity={0.65} color="#e0f2fe" />
        <hemisphereLight
          args={['#bae6fd', '#3f6212', 0.55]}
          position={[0, 50, 0]}
        />

        {/* Dynamic directional sunlight with shadow frustum tracking camera target */}
        <primitive object={lightTargetRef.current} />
        <directionalLight
          ref={dirLightRef}
          target={lightTargetRef.current}
          position={[-11.5, 26, 9.5]}
          intensity={1.9}
          color="#fef3c7"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-left={-34}
          shadow-camera-right={34}
          shadow-camera-top={34}
          shadow-camera-bottom={-34}
          shadow-camera-near={0.5}
          shadow-camera-far={85}
          shadow-bias={-0.0003}
        />

        {/* Secondary fill light from the lake side */}
        <directionalLight
          position={[12, 10, -10]}
          intensity={0.4}
          color="#93c5fd"
        />

        <Suspense fallback={null}>
          {/* 1. Base Terrain & Lake Näsijärvi */}
          <Terrain onSelectLake={() => setInspectedObject('lake')} />

          {/* 1b. Modular Kenney 3D Road Network */}
          <ModularRoads />

          {/* 2. Forest Perimeter & Dynamic Unbuilt Lot Trees */}
          <Forest />
          <ExpansionZoneForest level={level} />

          {/* 3. Tampere Näsinneula Observation Tower (North-West) */}
          <NasineulaTower position={[-5.0, 0, -6.0]} />

          {/* 4. Power Generation Infrastructure (South-East Wind Turbines) */}
          <WindTurbines
            level={level}
            onSelectWind={() => setInspectedObject('wind')}
          />

          {/* 5. Central Data Center Campus: Level 1 has 1 DC; Levels 2 & 3 have all 4 */}
          {/* South-West Facility (Primary lot, always active) */}
          <DataCenter
            position={[10.0, 0, -5.5]}
            isSelected={dataCenterHovered || inspectedObject === 'datacenter'}
            onHover={setDataCenterHovered}
            onClick={() => setInspectedObject('datacenter')}
          />

          {/* South-East Facility (Activated in Level 2 & 3) */}
          {level >= 2 && (
            <DataCenter
              position={[16.0, 0, -5.5]}
              isSelected={dataCenterHovered || inspectedObject === 'datacenter'}
              onHover={setDataCenterHovered}
              onClick={() => setInspectedObject('datacenter')}
            />
          )}

          {/* North-West Facility (Activated in Level 2 & 3) */}
          {level >= 2 && (
            <DataCenter
              position={[10.0, 0, -11.5]}
              isSelected={dataCenterHovered || inspectedObject === 'datacenter'}
              onHover={setDataCenterHovered}
              onClick={() => setInspectedObject('datacenter')}
            />
          )}

          {/* North-East Facility (Activated in Level 3 Peak) */}
          {level >= 3 && (
            <DataCenter
              position={[16.0, 0, -11.5]}
              isSelected={dataCenterHovered || inspectedObject === 'datacenter'}
              onHover={setDataCenterHovered}
              onClick={() => setInspectedObject('datacenter')}
            />
          )}

          {/* 5b. Dedicated Solar Microgrid Farm (Level 1: none, Level 2: some, Level 3: full) */}
          <SolarFarm
            level={level}
            onSelectSolar={() => setInspectedObject('solar')}
          />

          {/* 6. Carpark (Attached East of Datacenter) */}
          <Carpark />

          {/* 7. Nordic Residential Houses (South-West Quadrant) */}
          <NordicHouses
            onSelectHouse={(house) => {
              onSelectHouse(house)
              setInspectedObject('houses')
            }}
          />

          {/* 8. Animated Road Traffic (scaled by Level) */}
          <Traffic level={level} />

          {/* 9. Interactive 3D World Bubbles for All Key Objects */}
          <WorldBubbles
            inspectedObject={inspectedObject}
            onClose={() => setInspectedObject(null)}
            onOpenSevenEffects={() => onOpenDetails('overview')}
            level={level as any}
          />
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
