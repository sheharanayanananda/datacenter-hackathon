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
    energyPercent: 85,
    heatRecyclingActive: true,
    jobsCreated: 120,
    greenEnergyMw: 14.5,
    heatOutputMwh: 420,
    housesHeated: 16,
  })

  const [activeTab, setActiveTab] = useState<InspectionTab | 'build' | 'upgrade' | null>(null)
  const [selectedHouse, setSelectedHouse] = useState<HouseInfo | null>(null)
  const [dataCenterHovered, setDataCenterHovered] = useState(false)

  // Simulation loop: gentle passive earnings from clean energy and heat grid
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        money: prev.money + (prev.heatRecyclingActive ? 14 : 4),
      }))
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  const handleToggleHeat = () => {
    setStats((prev) => ({
      ...prev,
      heatRecyclingActive: !prev.heatRecyclingActive,
      energyPercent: !prev.heatRecyclingActive ? 85 : 72,
    }))
  }

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

  const handleConnectHouse = () => {
    if (stats.money < 3200) return
    setStats((prev) => ({
      ...prev,
      money: prev.money - 3200,
      housesHeated: prev.housesHeated + 4,
      heatOutputMwh: prev.heatOutputMwh + 45,
      xp: Math.min(prev.xpNeeded, prev.xp + 20),
    }))
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-900">
      {/* 3D Simulation Canvas */}
      <Scene
        heatActive={stats.heatRecyclingActive}
        onToggleHeat={handleToggleHeat}
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
        onToggleHeat={handleToggleHeat}
        onToggleMascot={() => {
          setSelectedHouse(null)
          setActiveTab('jobs')
        }}
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
        onConnectHouse={handleConnectHouse}
      />
    </div>
  )
}
export default App
