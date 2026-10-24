import React, { useState } from 'react'
import { GameProvider, useGame } from './context/GameContext'
import { Scene } from './components/Scene'
import { HUD } from './components/HUD'
import { ModalDetails } from './components/ModalDetails'
import { AuthModal } from './components/AuthModal'
import { CharacterSelectModal } from './components/CharacterSelectModal'
import { PermitStampModal } from './components/PermitStampModal'
import { SevenImpactsModal } from './components/SevenImpactsModal'
import { UpgradeModal } from './components/UpgradeModal'
import { CivicDialogueModal } from './components/CivicDialogueModal'
import { CityStats, InspectionTab, HouseInfo } from './types'

const AppContent: React.FC = () => {
  const {
    user,
    level,
    money,
    xp,
    xpNeeded,
    gameStage,
    setIsSevenImpactsOpen,
    setActiveImpactKey,
    setIsUpgradeModalOpen,
  } = useGame()

  const [activeTab, setActiveTab] = useState<InspectionTab | 'build' | 'upgrade' | null>(null)
  const [selectedHouse, setSelectedHouse] = useState<HouseInfo | null>(null)
  const [dataCenterHovered, setDataCenterHovered] = useState(false)
  const [controlMode, setControlMode] = useState<'pan' | 'rotate'>('pan')
  const [recenterTrigger, setRecenterTrigger] = useState(0)

  // Map contextual stats for HUD and existing inspection tabs
  const stats: CityStats = {
    money: Math.round(money),
    level: level,
    xp: xp,
    xpNeeded: xpNeeded,
    energyPercent: level === 1 ? 55 : level === 2 ? 88 : 100,
    jobsCreated: level === 1 ? 20 : level === 2 ? 55 : 250,
    greenEnergyMw: level === 1 ? 5.0 : level === 2 ? 37.5 : 120.0,
    computingPowerPflops: level === 1 ? 15 : level === 2 ? 85 : 350,
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-900 select-none">
      {/* 3D Simulation Canvas */}
      <Scene
        level={level}
        onOpenDetails={(tab) => {
          setSelectedHouse(null)
          if (tab === 'overview' || tab === 'energy' || tab === 'jobs') {
            setActiveImpactKey(tab === 'overview' ? 'energy' : tab === 'energy' ? 'energy' : 'jobs')
            setIsSevenImpactsOpen(true)
          } else {
            setActiveTab(tab)
          }
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

      {/* Gamified HUD Overlay (visible when user logged in) */}
      {user && (
        <HUD
          stats={stats}
          onBuildClick={() => {
            setSelectedHouse(null)
            setActiveTab('build')
          }}
          onUpgradeClick={() => {
            setSelectedHouse(null)
            setIsUpgradeModalOpen(true)
          }}
          onToggleMascot={() => {
            setSelectedHouse(null)
            setActiveImpactKey('future')
            setIsSevenImpactsOpen(true)
          }}
          controlMode={controlMode}
          onToggleControlMode={setControlMode}
          onRecenter={() => setRecenterTrigger((c) => c + 1)}
        />
      )}

      {/* 1. Sign In / Sign Up Modal */}
      <AuthModal />

      {/* 2. Character Select Modal */}
      <CharacterSelectModal />

      {/* 3. Official Municipal Permit Stamping Modal */}
      <PermitStampModal />

      {/* 4. Hackathon 7 Core Impacts Explorer Modal */}
      <SevenImpactsModal />

      {/* 6. Level Upgrade Modal */}
      <UpgradeModal />

      {/* 7. Clash-of-Clans Civilian Debate Dialogue */}
      <CivicDialogueModal />

      {/* 7. Existing House Inspection & Microgrid Modal */}
      <ModalDetails
        tab={activeTab}
        selectedHouse={selectedHouse}
        stats={stats}
        onClose={() => {
          setActiveTab(null)
          setSelectedHouse(null)
        }}
        onUpgradeWind={() => {}}
        onUpgradeSolar={() => {}}
        onExpandServers={() => {}}
      />
    </div>
  )
}

export const App: React.FC = () => {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  )
}

export default App
