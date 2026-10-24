import React, { useState, useEffect } from 'react'
import { Scene } from './components/Scene'
import { HUD } from './components/HUD'
import { ModalDetails } from './components/ModalDetails'
import { CityStats, InspectionTab, HouseInfo } from './types'

export const App: React.FC = () => {
  const [stats, setStats] = useState<CityStats>({
    money: 35871, // Matching reference image
    level: 2,
    xp: 25,
    xpNeeded: 70, // Matching reference image 25/70
    energyPercent: 88,
    jobsCreated: 120,
    greenEnergyMw: 14.5,
    computingPowerPflops: 85,
  })

  const [activeTab, setActiveTab] = useState<InspectionTab | 'build' | 'upgrade' | null>(null)
  const [selectedHouse, setSelectedHouse] = useState<HouseInfo | null>(null)
  const [dataCenterHovered, setDataCenterHovered] = useState(false)
  const [controlMode, setControlMode] = useState<'pan' | 'rotate'>('pan')
  const [recenterTrigger, setRecenterTrigger] = useState(0)

  // Simulation loop: gentle passive earnings from clean cloud computing
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        money: prev.money + 12,
      }))
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  const handleUpgradeWind = () => {
    if (stats.money < 4500) return
    setStats((prev) => ({
      ...prev,
      money: prev.money - 4500,
      greenEnergyMw: Number((prev.greenEnergyMw + 2.5).toFixed(1)),
      xp: Math.min(prev.xpNeeded, prev.xp + 15),
      energyPercent: Math.min(100, prev.energyPercent + 5),
    }))
  }

  const handleExpandServers = () => {
    if (stats.money < 3200) return
    setStats((prev) => ({
      ...prev,
      money: prev.money - 3200,
      computingPowerPflops: prev.computingPowerPflops + 15,
      xp: Math.min(prev.xpNeeded, prev.xp + 20),
    }))
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-900">
      {/* 3D Simulation Canvas */}
      <Scene
        onOpenDetails={(tab) => {
          setSelectedHouse(null)
          setActiveTab(tab)
        }}
        onSelectHouse={(house) => {
          setActiveTab(null)
          setSelectedHouse(house)
        }}
        dataCenterHovered={dataCenterHovered}
        setDataCenterHovered={setDataCenterHovered}
        controlMode={controlMode}
        recenterTrigger={recenterTrigger}
      />

      {/* Gamified HUD Overlay */}
      <HUD
        stats={stats}
        onBuildClick={() => {
          setSelectedHouse(null)
          setActiveTab('build')
        }}
        onUpgradeClick={() => {
          setSelectedHouse(null)
          setActiveTab('upgrade')
        }}
        onToggleMascot={() => {
          setSelectedHouse(null)
          setActiveTab('jobs')
        }}
        controlMode={controlMode}
        onToggleControlMode={setControlMode}
        onRecenter={() => setRecenterTrigger((c) => c + 1)}
      />

      {/* Interactive Detail & Upgrade Modals */}
      <ModalDetails
        tab={activeTab}
        selectedHouse={selectedHouse}
        stats={stats}
        onClose={() => {
          setActiveTab(null)
          setSelectedHouse(null)
        }}
        onUpgradeWind={handleUpgradeWind}
        onUpgradeSolar={() => {}}
        onExpandServers={handleExpandServers}
      />
    </div>
  )
}
export default App
