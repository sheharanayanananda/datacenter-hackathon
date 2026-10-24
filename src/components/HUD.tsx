import React from 'react'
import {
  Zap,
  Flame,
  Users,
  Truck,
  Trees,
  ShieldCheck,
  TrendingUp,
  DollarSign,
  LogOut,
  Sparkles,
  Move,
  RotateCcw,
  Compass,
  BarChart3,
  ChevronsUp,
  Building2,
  Award,
  User,
  Leaf,
} from 'lucide-react'
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
          <div className="bg-white/95 rounded-2xl border-2 border-white shadow-lg px-3.5 py-2 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-sm">
              <Zap className="w-4 h-4 fill-white stroke-none" />
            </div>
            <div>
              <h1 className="text-xs sm:text-sm font-black tracking-wide text-slate-900 uppercase flex items-center gap-1.5">
                Nordic EcoTown <span className="bg-emerald-100 text-emerald-800 text-[9px] px-2 py-0.5 rounded-full font-bold">Tampere</span>
              </h1>
              <p className="text-[10px] text-slate-500 font-semibold hidden sm:block">
                Zero-Emission Data Center & Heat Grid
              </p>
            </div>
          </div>

          {/* User & Character Profile Pill */}
          {user && (
            <div className="bg-white/95 rounded-2xl border-2 border-white shadow-lg px-3 py-1.5 flex items-center gap-2 text-xs">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                {character?.avatar === 'Leaf' ? (
                  <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                ) : character?.avatar === 'Zap' ? (
                  <Zap className="w-3.5 h-3.5 text-sky-600" />
                ) : (
                  <Trees className="w-3.5 h-3.5 text-amber-600" />
                )}
              </div>
              <div className="leading-tight">
                <div className="text-[11px] font-black text-slate-900 flex items-center gap-1.5">
                  <span>{character?.name.split(' ')[0] || user.username}</span>
                  <span className="text-[9px] font-extrabold text-white bg-emerald-600 px-1.5 py-0.2 rounded-md">
                    Level {level} {level === 3 ? '(Peak)' : ''}
                  </span>
                </div>
                <div className="text-[9px] text-slate-500 font-medium hidden md:block">
                  {user.role}
                </div>
              </div>

              {/* Sign Out */}
              <button
                onClick={signOut}
                title="Sign out of municipal office"
                className="ml-1 p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Center / Right: Judge Demo Switcher & Camera Controls */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-white/95 p-1.5 rounded-2xl border-2 border-white shadow-lg text-xs">
          {/* Quick Demo Tier Switcher for Hackathon Judges */}
          <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-xl border border-amber-200">
            <span className="text-[10px] font-black text-amber-900 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-600" /> Demo:
            </span>
            {([1, 2, 3] as DataCenterLevel[]).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setDemoLevel(lvl)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                  level === lvl
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'text-amber-800 hover:bg-amber-200/60'
                }`}
                title={`Switch scene directly to Level ${lvl}`}
              >
                L{lvl}{lvl === 3 ? ' Peak' : ''}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-slate-200 mx-0.5" />

          {/* Pan / Rotate controls */}
          <button
            onClick={() => onToggleControlMode?.('pan')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl font-bold transition-all ${
              controlMode === 'pan'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Move className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Pan</span>
          </button>
          <button
            onClick={() => onToggleControlMode?.('rotate')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl font-bold transition-all ${
              controlMode === 'rotate'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Rotate</span>
          </button>
          <button
            onClick={onRecenter}
            className="flex items-center gap-1 px-2 py-1 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold transition-all"
            title="Recenter camera on campus"
          >
            <Compass className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Middle Banner: 7 Effects Strip */}
      <div className="pointer-events-auto self-center bg-white/95 px-3 py-1.5 rounded-2xl border-2 border-white shadow-xl flex items-center gap-1.5 overflow-x-auto max-w-full">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 pr-1.5 border-r border-slate-200 hidden sm:inline">
          7 Effects:
        </span>
        {IMPACT_DIMENSIONS.map((dim) => {
          const IconComponent =
            dim.iconName === 'Zap'
              ? Zap
              : dim.iconName === 'Flame'
              ? Flame
              : dim.iconName === 'Users'
              ? Users
              : dim.iconName === 'Truck'
              ? Truck
              : dim.iconName === 'Trees'
              ? Trees
              : dim.iconName === 'ShieldCheck'
              ? ShieldCheck
              : TrendingUp

          return (
            <button
              key={dim.key}
              onClick={() => {
                setActiveImpactKey(dim.key)
                setIsSevenImpactsOpen(true)
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-extrabold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
              title={`Inspect ${dim.title}`}
            >
              <IconComponent className="w-3.5 h-3.5 text-emerald-600" />
              <span>{dim.title.split(' ')[0]}</span>
            </button>
          )
        })}
      </div>

      {/* Bottom HUD Layer */}
      <div className="flex items-end justify-between w-full">
        {/* Bottom-Left Simulation Stats */}
        <div className="pointer-events-auto flex flex-col gap-2">
          {/* Money Pill */}
          <div className="flex items-center bg-[#fffbeb] border-2 border-[#fef08a] px-3.5 py-1.5 rounded-2xl shadow-game-button w-fit">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-sm mr-2">
              <DollarSign className="w-4 h-4 stroke-[3]" />
            </div>
            <span className="font-black text-slate-800 text-base sm:text-lg tracking-wide">
              {Math.round(money).toLocaleString()}
            </span>
          </div>

          {/* Level Progress Bar & Active Info */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-white/95 border-2 border-white px-3 py-1.5 rounded-2xl shadow-game-button">
              <div className="w-6 h-6 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center font-black text-xs mr-2 shadow-sm">
                <Building2 className="w-3.5 h-3.5 text-amber-950" />
              </div>
              <div className="w-20 md:w-28 mr-2">
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-200">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-lime-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${xpPercent}%` }}
                  />
                </div>
              </div>
              <span className="text-[11px] font-black text-slate-800 whitespace-nowrap">
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
              className="flex items-center bg-white/95 border-2 border-orange-200 px-3 py-1.5 rounded-2xl shadow-game-button cursor-pointer hover:border-orange-400 transition-colors"
            >
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500 mr-1.5" />
              <span className="text-[11px] font-black text-orange-950 whitespace-nowrap">
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
            className="flex flex-col items-center justify-center bg-sky-500 hover:bg-sky-400 border-b-4 border-sky-700 active:border-b-0 active:translate-y-1 px-4 py-2.5 rounded-2xl shadow-game-button transition-all group cursor-pointer text-white"
          >
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center mb-0.5 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-4 h-4 stroke-[2.5]" />
            </div>
            <span className="font-black text-xs tracking-wider uppercase">
              7 EFFECTS
            </span>
          </button>

          {/* Level UPGRADE Button */}
          <button
            onClick={() => setIsUpgradeModalOpen(true)}
            className={`flex flex-col items-center justify-center border-b-4 active:border-b-0 active:translate-y-1 px-5 py-2.5 rounded-2xl shadow-game-button transition-all group cursor-pointer text-white ${
              level === 3
                ? 'bg-amber-500 border-amber-700 hover:bg-amber-400'
                : 'bg-emerald-500 border-emerald-700 hover:bg-emerald-400'
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center mb-0.5 group-hover:scale-110 transition-transform">
              <ChevronsUp className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="font-black text-xs tracking-wider uppercase">
              {level === 3 ? 'MAX LEVEL' : `UPGRADE L${level + 1}`}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
