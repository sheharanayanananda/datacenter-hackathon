import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Terrain } from './Terrain'
import { DataCenter } from './DataCenter'
import { DistrictHeatPipes } from './DistrictHeatPipes'
import { WindTurbines } from './WindTurbines'
import { PowerSubstation } from './PowerSubstation'
import { NordicHouses } from './NordicHouses'
import { Forest } from './Forest'
import { Traffic } from './Traffic'
import { DataCenterCard } from './DataCenterCard'
import { NasineulaTower } from './NasineulaTower'
import { Carpark } from './Carpark'
import { ModularRoads } from './ModularRoads'
import { HouseInfo, InspectionTab } from '../types'

interface SceneProps {
  heatActive: boolean;
  onToggleHeat: () => void;
  onOpenDetails: (tab: InspectionTab) => void;
  onSelectHouse: (house: HouseInfo) => void;
  dataCenterHovered: boolean;
  setDataCenterHovered: (h: boolean) => void;
}

export const Scene: React.FC<SceneProps> = ({
  heatActive,
  onToggleHeat,
  onOpenDetails,
  onSelectHouse,
  dataCenterHovered,
  setDataCenterHovered,
}) => {
  return (
    <div className="w-full h-full cursor-grab active:cursor-grabbing">
      <Canvas
        shadows
        orthographic
        camera={{
          position: [-16, 20, 16],
          zoom: 46,
          near: 0.1,
          far: 1000,
        }}
      >
        {/* Soft morning/afternoon sky fog */}
        <color attach="background" args={['#7ca7b5']} />
        <fog attach="fog" args={['#7ca7b5', 60, 150]} />

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

          {/* 4. Power Generation Infrastructure (Wind Turbines) */}
          <WindTurbines />
          <PowerSubstation />

          {/* 5. Central Data Center Compound (East) */}
          <DataCenter
            position={[6.5, 0, 0.0]}
            isSelected={dataCenterHovered}
            onHover={setDataCenterHovered}
            onClick={() => onOpenDetails('overview')}
          />

          {/* 6. Carpark (Attached East of Datacenter) */}
          <Carpark />

          {/* 7. Glowing District Heating Pipeline Network (Connecting Datacenter to Houses) */}
          <DistrictHeatPipes active={heatActive} />

          {/* 8. Nordic Residential Houses (South-West Quadrant) */}
          <NordicHouses onSelectHouse={onSelectHouse} />

          {/* 9. Animated Road Traffic */}
          <Traffic />

          {/* 10. 3D Pinned Speech Bubble UI on Data Center */}
          <DataCenterCard
            heatActive={heatActive}
            onToggleHeat={onToggleHeat}
            onOpenDetails={onOpenDetails}
          />
        </Suspense>

        {/* Camera Orbit Constraints with generous tilt & zoom freedom */}
        <OrbitControls
          enableRotate={true}
          enablePan={true}
          enableZoom={true}
          minZoom={28}   // Locked maximum zoom out limit matching the user's screenshot
          maxZoom={95}
          maxPolarAngle={Math.PI / 2.7}  // ~67 deg: generous low angle while safely clearing ground/tree trunks
          minPolarAngle={Math.PI / 8.0}  // ~22 deg: generous high aerial view
          target={[1.0, 0.4, 1.5]}
          dampingFactor={0.06}
        />
      </Canvas>
    </div>
  )
}
