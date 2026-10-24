import React from 'react'
import { Hammer, Settings, Smile, Zap, DollarSign, LogOut, RotateCcw, Sparkles } from 'lucide-react'
import { useGame } from '../context/GameContext'
import { CityStats } from '../types'
import { LEVEL_STATS, IMPACT_DIMENSIONS } from '../data/impacts'
import { ImpactDimensionKey, DataCenterLevel } from '../types/game'

interface HUDProps {
  stats: CityStats;
  onBuildClick: () => void;
  onUpgradeClick: () => void;
  onToggleMascot: () => void;
  controlMode?: 'pan' | 'rotate';
  onToggleControlMode?: (mode: 'pan' | 'rotate') => void;
  onRecenter?: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  stats,
  onBuildClick,
  onUpgradeClick,
  onToggleMascot,
  controlMode = 'pan',
  onToggleControlMode,
  onRecenter,
}) => {
  const {
    user,
    character,
    level,
    money,
    xp,
    xpNeeded,
    signOut,
    resetGame,
    setDemoLevel,
    setIsSevenImpactsOpen,
    setActiveImpactKey,
    setIsUpgradeModalOpen,
  } = useGame()

  const currentLevelStats = LEVEL_STATS[level]
  const xpPercent = Math.min(100, Math.round((xp / xpNeeded) * 100))

  return (
    <div className="fixed inset-0 pointer-events-none flex flex-col justify-between p-3 sm:p-5 z-20">
      {/* Top Header Layer */}
      <div className="flex flex-wrap items-center justify-between w-full gap-2">
        {/* Left: Project Branding & User Profile */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Main Title Badge */}
          <div className="bg-slate-900/85 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-700/60 shadow-lg flex items-center gap-2.5">
            <span className="text-xl">⚡</span>
            <div>
              <h1 className="text-xs sm:text-sm font-extrabold tracking-wide text-white uppercase flex items-center gap-1.5">
                Nordic EcoTown <span className="bg-emerald-500/20 text-emerald-300 text-[9px] px-2 py-0.5 rounded-full border border-emerald-500/40">Tampere</span>
              </h1>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                Zero-Emission Data Center & Heat Grid
              </p>
            </div>
          </div>

          {/* User & Character Profile Pill */}
          {user && (
            <div className="bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-slate-700/60 shadow-lg flex items-center gap-2 text-xs">
              <span className="text-lg">{character?.avatar || '👤'}</span>
              <div className="leading-tight">
                <div className="text-[11px] font-black text-white flex items-center gap-1.5">
                  <span>{character?.name.split(' ')[0] || user.username}</span>
                  <span className="text-[9px] font-semibold text-emerald-400 bg-emerald-500/15 px-1.5 py-0.2 rounded">
                    L{level} {level === 3 ? 'MAX' : ''}
                  </span>
                </div>
                <div className="text-[9px] text-slate-400 hidden md:block">
                  {user.role}
                </div>
              </div>

              {/* Sign Out */}
              <button
                onClick={signOut}
                title="Sign out of municipal office"
                className="ml-1 p-1.5 text-slate-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Center / Right: Judge Demo Switcher & Camera Controls */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-slate-900/85 backdrop-blur-md p-1.5 rounded-2xl border border-slate-700/60 shadow-lg text-xs">
          {/* Quick Demo Tier Switcher for Hackathon Judges */}
          <div className="flex items-center gap-1 bg-slate-800/80 px-2 py-1 rounded-xl border border-slate-700/50">
            <span className="text-[10px] font-black text-amber-300 uppercase tracking-wider mr-0.5">
              Demo:
            </span>
            {([1, 2, 3] as DataCenterLevel[]).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setDemoLevel(lvl)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                  level === lvl
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/60'
                }`}
                title={`Switch scene directly to Level ${lvl} (${lvl === 3 ? 'Peak Max' : lvl === 2 ? 'Regional' : 'Starter'})`}
              >
                L{lvl}{lvl === 3 ? '★' : ''}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-slate-700/60 mx-0.5" />

          {/* Pan / Rotate controls */}
          <button
            onClick={() => onToggleControlMode?.('pan')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl font-bold transition-all ${
              controlMode === 'pan'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <span>✋</span>
            <span className="hidden sm:inline">Pan</span>
          </button>
          <button
            onClick={() => onToggleControlMode?.('rotate')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl font-bold transition-all ${
              controlMode === 'rotate'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <span>🔄</span>
            <span className="hidden sm:inline">Rotate</span>
          </button>
          <button
            onClick={onRecenter}
            className="flex items-center gap-1 px-2 py-1 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 font-semibold transition-all"
            title="Recenter camera on campus"
          >
            <span>🎯</span>
          </button>
        </div>
      </div>

      {/* Middle Banner: 7 Impacts Quick Access Strip (From Presentation Slide) */}
      <div className="pointer-events-auto self-center bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-slate-700/60 shadow-xl flex items-center gap-1.5 overflow-x-auto max-w-full">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 pr-1.5 border-r border-slate-700 hidden sm:inline">
          7 Effects:
        </span>
        {IMPACT_DIMENSIONS.map((dim) => (
          <button
            key={dim.key}
            onClick={() => {
              setActiveImpactKey(dim.key)
              setIsSevenImpactsOpen(true)
            }}
            className="flex items-center gap-1 px-2 py-1 rounded-xl text-[11px] font-bold text-slate-300 hover:text-white hover:bg-slate-800/80 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
            title={`Inspect ${dim.title} (${dim.finnishTitle}) impact`}
          >
            <span>{dim.icon}</span>
            <span>{dim.title}</span>
          </button>
        ))}
      </div>

      {/* Bottom HUD Layer */}
      <div className="flex items-end justify-between w-full">
        {/* Bottom-Left Simulation Stats */}
        <div className="pointer-events-auto flex flex-col gap-2">
          {/* Money Pill */}
          <div className="flex items-center bg-[#fffbeb] border-2 border-[#fef08a] px-3.5 py-1.5 rounded-2xl shadow-game-button w-fit">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-sm mr-2">
              <DollarSign className="w-5 h-5 stroke-[3]" />
            </div>
            <span className="font-black text-slate-800 text-base sm:text-lg tracking-wide">
              {Math.round(money).toLocaleString()}
            </span>
          </div>

          {/* Level Progress Bar & Active Info */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-900/85 backdrop-blur-md border-2 border-slate-700 px-3 py-1.5 rounded-2xl shadow-game-button">
              <div className="w-6 h-6 rounded-full bg-amber-400 border-2 border-amber-500 text-amber-950 flex items-center justify-center font-black text-xs mr-2 shadow-sm">
                L{level}
              </div>
              <div className="w-20 md:w-28 mr-2">
                <div className="w-full bg-slate-700/80 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-600">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-lime-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${xpPercent}%` }}
                  />
                </div>
              </div>
              <span className="text-[11px] font-black text-white whitespace-nowrap">
                {currentLevelStats.powerCapacityMw} MW
              </span>
            </div>

            {/* Waste Heat Indicator */}
            <div
              onClick={() => {
                setActiveImpactKey('surroundings')
                setIsSevenImpactsOpen(true)
              }}
              title="Click to inspect district heating export"
              className="flex items-center bg-slate-900/85 backdrop-blur-md border-2 border-orange-500/60 px-3 py-1.5 rounded-2xl shadow-game-button cursor-pointer hover:border-orange-400 transition-colors"
            >
              <span className="text-sm mr-1.5">🔥</span>
              <span className="text-[11px] font-black text-orange-300 whitespace-nowrap">
                {currentLevelStats.wasteHeatMw} Heat
              </span>
            </div>
          </div>
        </div>

        {/* Bottom-Right Upgrade & Build Buttons */}
        <div className="pointer-events-auto flex items-center gap-3">
          {/* 7 Impacts Dashboard Button */}
          <button
            onClick={() => {
              setActiveImpactKey('energy')
              setIsSevenImpactsOpen(true)
            }}
            className="flex flex-col items-center justify-center bg-gradient-to-b from-sky-500 to-sky-700 hover:from-sky-400 hover:to-sky-600 border-2 border-sky-300 px-4 py-2.5 rounded-2xl shadow-game-button transition-all active:scale-95 group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center mb-0.5 group-hover:scale-110 transition-transform text-lg">
              📊
            </div>
            <span className="font-black text-xs tracking-wider text-white uppercase drop-shadow-sm">
              7 EFFECTS
            </span>
          </button>

          {/* Level UPGRADE Button */}
          <button
            onClick={() => setIsUpgradeModalOpen(true)}
            className={`flex flex-col items-center justify-center border-2 px-5 py-2.5 rounded-2xl shadow-game-button transition-all active:scale-95 group cursor-pointer ${
              level === 3
                ? 'bg-gradient-to-b from-amber-500 to-amber-700 border-amber-300'
                : 'bg-gradient-to-b from-emerald-500 to-teal-700 border-emerald-300 hover:from-emerald-400 hover:to-teal-600'
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center mb-0.5 group-hover:scale-110 transition-transform">
              <Settings className="w-5 h-5 text-white stroke-[2.5]" />
            </div>
            <span className="font-black text-xs tracking-wider text-white uppercase drop-shadow-sm">
              {level === 3 ? 'MAX LEVEL' : `UPGRADE L${level + 1}`}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
