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
import { DataCenterCard } from './DataCenterCard'
import { NasineulaTower } from './NasineulaTower'
import { Carpark } from './Carpark'
import { ModularRoads } from './ModularRoads'
import { SolarFarm } from './SolarFarm'
import { HouseInfo, InspectionTab } from '../types'

interface SceneProps {
  onOpenDetails: (tab: InspectionTab) => void;
  onSelectHouse: (house: HouseInfo) => void;
  dataCenterHovered: boolean;
  setDataCenterHovered: (h: boolean) => void;
  controlMode?: 'pan' | 'rotate';
  recenterTrigger?: number;
}

const MapController: React.FC<{
  controlsRef: React.RefObject<any>;
  recenterTrigger: number;
}> = ({ controlsRef, recenterTrigger }) => {
  const { camera } = useThree()
  const keys = useRef<{ [key: string]: boolean }>({})

  // Handle Recenter
  useEffect(() => {
    if (recenterTrigger > 0 && controlsRef.current) {
      controlsRef.current.target.set(1.0, 0.4, 1.5)
      camera.position.set(-16, 20, 16)
      if ('zoom' in camera) {
        ;(camera as THREE.OrthographicCamera).zoom = 46
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

  // Smooth keyboard panning across ground
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
      controls.update()
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
}) => {
  const controlsRef = useRef<any>(null)
  const [spacePressed, setSpacePressed] = useState(false)

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
          position: [-16, 20, 16],
          zoom: 46,
          near: -500,
          far: 2000,
        }}
      >
        {/* Soft morning/afternoon sky fog */}
        <color attach="background" args={['#7ca7b5']} />
        <fog attach="fog" args={['#7ca7b5', 180, 500]} />

        {/* Lighting setup matching the reference image's warm Scandinavian sunlight */}
        <ambientLight intensity={0.65} color="#e0f2fe" />
        <hemisphereLight
          args={['#bae6fd', '#3f6212', 0.55]}
          position={[0, 50, 0]}
        />
        <directionalLight
          position={[-16, 26, 12]}
          intensity={1.9}
          color="#fef3c7"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-left={-28}
          shadow-camera-right={28}
          shadow-camera-top={28}
          shadow-camera-bottom={-28}
          shadow-camera-near={0.5}
          shadow-camera-far={80}
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
          <Terrain />

          {/* 1b. Modular Kenney 3D Road Network */}
          <ModularRoads />

          {/* 2. Forest Perimeter */}
          <Forest />

          {/* 3. Tampere Näsinneula Observation Tower (North-West) */}
          <NasineulaTower position={[-5.0, 0, -6.0]} />

          {/* 4. Power Generation Infrastructure (South-East Wind Turbines) */}
          <WindTurbines />

          {/* 5. Central 2x2 Data Center Campus Cluster */}
          {/* South-West Facility (Original Primary Facility) */}
          <DataCenter
            position={[10.0, 0, -5.5]}
            isSelected={dataCenterHovered}
            onHover={setDataCenterHovered}
            onClick={() => onOpenDetails('overview')}
          />

          {/* South-East Facility */}
          <DataCenter
            position={[16.0, 0, -5.5]}
            isSelected={dataCenterHovered}
            onHover={setDataCenterHovered}
            onClick={() => onOpenDetails('overview')}
          />

          {/* North-West Facility */}
          <DataCenter
            position={[10.0, 0, -11.5]}
            isSelected={dataCenterHovered}
            onHover={setDataCenterHovered}
            onClick={() => onOpenDetails('overview')}
          />

          {/* North-East Facility */}
          <DataCenter
            position={[16.0, 0, -11.5]}
            isSelected={dataCenterHovered}
            onHover={setDataCenterHovered}
            onClick={() => onOpenDetails('overview')}
          />

          {/* 5b. Dedicated Solar Microgrid Farm (West side of road, aligned with 2x2 Datacenter grid) */}
          <SolarFarm />

          {/* 6. Carpark (Attached East of Datacenter) */}
          <Carpark />

          {/* 7. Nordic Residential Houses (South-West Quadrant) */}
          <NordicHouses onSelectHouse={onSelectHouse} />

          {/* 8. Animated Road Traffic */}
          <Traffic />

          {/* 9. 3D Pinned Speech Bubble UI on Data Center */}
          <DataCenterCard
            onOpenDetails={onOpenDetails}
          />
        </Suspense>

        <MapController
          controlsRef={controlsRef}
          recenterTrigger={recenterTrigger}
        />

        {/* Camera Orbit Constraints with generous tilt & zoom freedom */}
        <OrbitControls
          ref={controlsRef}
          enableRotate={true}
          enablePan={true}
          enableZoom={true}
          screenSpacePanning={false}
          panSpeed={1.2}
          rotateSpeed={0.8}
          minZoom={18}
          maxZoom={120}
          maxPolarAngle={Math.PI / 2.7}  // ~67 deg: generous low angle
          minPolarAngle={Math.PI / 8.0}  // ~22 deg: generous high aerial view
          target={[1.0, 0.4, 1.5]}
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
