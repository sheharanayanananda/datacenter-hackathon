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
  ChevronsUp,
  Building2,
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

  const getGlanceStats = (lvl: DataCenterLevel) => {
    switch (lvl) {
      case 1:
        return {
          energy: '5 MW',
          heat: '4.5 MW',
          jobs: '20',
          traffic: '5/wk',
          land: 'Lot 1',
          water: '500k L',
          tax: '€200k',
        }
      case 2:
        return {
          energy: '37.5 MW',
          heat: '28 MW',
          jobs: '55',
          traffic: '1-3/d',
          land: 'Zoned',
          water: '4M L',
          tax: '€1.5M',
        }
      case 3:
      default:
        return {
          energy: '120 MW',
          heat: '90 MW',
          jobs: '250',
          traffic: 'Daily',
          land: 'Campus',
          water: '20M L',
          tax: '€10M',
        }
    }
  }

  const glance = getGlanceStats(level)

  const glanceItems: {
    key: ImpactDimensionKey;
    label: string;
    value: string;
    icon: React.ComponentType<{ className?: string }>;
    badgeBg: string;
    badgeText: string;
    borderHover: string;
  }[] = [
    {
      key: 'energy',
      label: 'Energy',
      value: glance.energy,
      icon: Zap,
      badgeBg: 'bg-amber-100',
      badgeText: 'text-amber-600',
      borderHover: 'hover:border-amber-300 hover:border-b-amber-400 hover:bg-amber-50/50',
    },
    {
      key: 'surroundings',
      label: 'Heat',
      value: glance.heat,
      icon: Flame,
      badgeBg: 'bg-orange-100',
      badgeText: 'text-orange-600',
      borderHover: 'hover:border-orange-300 hover:border-b-orange-400 hover:bg-orange-50/50',
    },
    {
      key: 'jobs',
      label: 'Jobs',
      value: glance.jobs,
      icon: Users,
      badgeBg: 'bg-sky-100',
      badgeText: 'text-sky-600',
      borderHover: 'hover:border-sky-300 hover:border-b-sky-400 hover:bg-sky-50/50',
    },
    {
      key: 'transport',
      label: 'Traffic',
      value: glance.traffic,
      icon: Truck,
      badgeBg: 'bg-purple-100',
      badgeText: 'text-purple-600',
      borderHover: 'hover:border-purple-300 hover:border-b-purple-400 hover:bg-purple-50/50',
    },
    {
      key: 'land_use',
      label: 'Forest',
      value: glance.land,
      icon: Trees,
      badgeBg: 'bg-emerald-100',
      badgeText: 'text-emerald-600',
      borderHover: 'hover:border-emerald-300 hover:border-b-emerald-400 hover:bg-emerald-50/50',
    },
    {
      key: 'safety',
      label: 'Water',
      value: glance.water,
      icon: ShieldCheck,
      badgeBg: 'bg-rose-100',
      badgeText: 'text-rose-600',
      borderHover: 'hover:border-rose-300 hover:border-b-rose-400 hover:bg-rose-50/50',
    },
    {
      key: 'future',
      label: 'Taxes',
      value: glance.tax,
      icon: TrendingUp,
      badgeBg: 'bg-teal-100',
      badgeText: 'text-teal-600',
      borderHover: 'hover:border-teal-300 hover:border-b-teal-400 hover:bg-teal-50/50',
    },
  ]

  const openEffect = (key: ImpactDimensionKey) => {
    setActiveImpactKey(key)
    setIsSevenImpactsOpen(true)
  }

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
                Datacenter Simulator <span className="bg-emerald-100 text-emerald-800 text-[9px] px-2 py-0.5 rounded-full font-bold">Tampere</span>
              </h1>
              <p className="text-[10px] text-slate-500 font-semibold hidden sm:block">
                Zero-Emission Data Center & Heat Grid
              </p>
            </div>
          </div>

          {/* User Profile Pill */}
          {user && (
            <div className="bg-white/95 rounded-2xl border-2 border-white shadow-lg px-3 py-1.5 flex items-center gap-2 text-xs">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                {character?.avatar === 'Sparkles' ? (
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                ) : character?.avatar === 'Building2' ? (
                  <Building2 className="w-3.5 h-3.5 text-sky-600" />
                ) : (
                  <Trees className="w-3.5 h-3.5 text-amber-600" />
                )}
              </div>
              <div className="leading-tight">
                <div className="text-[11px] font-black text-slate-900 flex items-center gap-1.5">
                  <span>{character?.name || 'Young'} Track</span>
                  <span className="text-[9px] font-extrabold text-white bg-emerald-600 px-1.5 py-0.2 rounded-md">
                    Level {level} {level === 3 ? '(Peak)' : ''}
                  </span>
                </div>
                <div className="text-[9px] text-slate-500 font-medium hidden md:block">
                  {user.username}
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

        {/* Right: Judge Demo Switcher & Camera Controls */}
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

      {/* Middle Screen is completely clean & unobstructed */}

      {/* Bottom HUD Layer */}
      <div className="flex items-end justify-between w-full gap-3">
        {/* Bottom-Left Simulation Stats & 7 Glance Widgets */}
        <div className="pointer-events-auto flex flex-col gap-2.5 min-w-0 max-w-[calc(100vw-170px)]">
          {/* Money Pill - Duolingo Treasury Badge */}
          <div className="flex items-center bg-[#fffbeb] border-2 border-[#fcd34d] border-b-4 rounded-2xl px-3.5 py-1.5 w-fit gap-2.5 shadow-sm transition-all select-none">
            <div className="w-7 h-7 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center font-black text-xs shadow-xs">
              <DollarSign className="w-4 h-4 stroke-[3]" />
            </div>
            <div className="flex flex-col text-left leading-none">
              <span className="font-black text-slate-900 text-sm sm:text-base tracking-tight">
                € {Math.round(money).toLocaleString()}
              </span>
              <span className="text-[9px] font-extrabold text-amber-700 uppercase tracking-wider mt-0.5">
                City Treasury
              </span>
            </div>
          </div>

          {/* 7 Clickable Glance Widgets in ONE Single Row - Duolingo 3D Button Style */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
            {glanceItems.map((item) => {
              const IconComp = item.icon
              return (
                <button
                  key={item.key}
                  onClick={() => openEffect(item.key)}
                  className={`bg-white border-2 border-slate-200 border-b-4 ${item.borderHover} active:border-b-2 active:translate-y-[2px] rounded-2xl px-3 py-1.5 flex items-center gap-2.5 cursor-pointer transition-all shrink-0 whitespace-nowrap text-left group select-none shadow-sm`}
                  title={`Click to view ${item.label} details`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl ${item.badgeBg} ${item.badgeText} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-150 shadow-xs`}
                  >
                    <IconComp className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <div className="flex flex-col text-left leading-none">
                    <span className="text-xs sm:text-[13px] font-black text-slate-800 tracking-tight">
                      {item.value}
                    </span>
                    <span className="text-[10px] font-extrabold text-slate-400 group-hover:text-slate-600 uppercase tracking-wider mt-1">
                      {item.label}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Bottom-Right Upgrade Button */}
        <div className="pointer-events-auto shrink-0 mb-0.5">
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
