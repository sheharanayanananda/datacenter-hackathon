import React, { useState, useRef, useEffect } from 'react'
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
  ChevronDown,
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

  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const userButtonRef = useRef<HTMLButtonElement>(null)

  // Close user dropdown menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(target) &&
        userButtonRef.current &&
        !userButtonRef.current.contains(target)
      ) {
        setShowUserMenu(false)
      }
    }
    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showUserMenu])

  const currentLevelStats = LEVEL_STATS[level]

  const getGlanceStats = (lvl: DataCenterLevel) => {
    switch (lvl) {
      case 1:
        return {
          energy: '5 MW',
          heat: '4.5 MW',
          jobs: '20',
          traffic: '5 / wk',
          land: '85% Kept',
          water: '500k L',
          tax: '€200k',
        }
      case 2:
        return {
          energy: '37.5 MW',
          heat: '28 MW',
          jobs: '55',
          traffic: '1-3 / d',
          land: '75% Kept',
          water: '4M L',
          tax: '€1.5M',
        }
      case 3:
      default:
        return {
          energy: '120 MW',
          heat: '90 MW',
          jobs: '250',
          traffic: 'Logistics',
          land: '65% Kept',
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
    hoverText: string;
  }[] = [
    {
      key: 'energy',
      label: 'Energy',
      value: glance.energy,
      icon: Zap,
      badgeBg: 'bg-amber-100',
      badgeText: 'text-amber-600',
      borderHover: 'hover:border-amber-400 hover:border-b-amber-500',
      hoverText: 'group-hover:text-amber-600',
    },
    {
      key: 'surroundings',
      label: 'Heat',
      value: glance.heat,
      icon: Flame,
      badgeBg: 'bg-orange-100',
      badgeText: 'text-orange-600',
      borderHover: 'hover:border-orange-400 hover:border-b-orange-500',
      hoverText: 'group-hover:text-orange-600',
    },
    {
      key: 'jobs',
      label: 'Jobs',
      value: glance.jobs,
      icon: Users,
      badgeBg: 'bg-sky-100',
      badgeText: 'text-sky-600',
      borderHover: 'hover:border-sky-400 hover:border-b-sky-500',
      hoverText: 'group-hover:text-sky-600',
    },
    {
      key: 'transport',
      label: 'Traffic',
      value: glance.traffic,
      icon: Truck,
      badgeBg: 'bg-purple-100',
      badgeText: 'text-purple-600',
      borderHover: 'hover:border-purple-400 hover:border-b-purple-500',
      hoverText: 'group-hover:text-purple-600',
    },
    {
      key: 'land_use',
      label: 'Forest',
      value: glance.land,
      icon: Trees,
      badgeBg: 'bg-emerald-100',
      badgeText: 'text-emerald-600',
      borderHover: 'hover:border-emerald-400 hover:border-b-emerald-500',
      hoverText: 'group-hover:text-emerald-600',
    },
    {
      key: 'safety',
      label: 'Water',
      value: glance.water,
      icon: ShieldCheck,
      badgeBg: 'bg-rose-100',
      badgeText: 'text-rose-600',
      borderHover: 'hover:border-rose-400 hover:border-b-rose-500',
      hoverText: 'group-hover:text-rose-600',
    },
    {
      key: 'future',
      label: 'Taxes',
      value: glance.tax,
      icon: TrendingUp,
      badgeBg: 'bg-teal-100',
      badgeText: 'text-teal-600',
      borderHover: 'hover:border-teal-400 hover:border-b-teal-500',
      hoverText: 'group-hover:text-teal-600',
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
        {/* Left: Combined Minimal Header Pill with Game Name & User Name - Duolingo 3D Chunky Style */}
        <div className="pointer-events-auto relative">
          <div className="bg-white rounded-2xl border-2 border-slate-200 border-b-4 border-b-slate-300 shadow-md px-3.5 py-2 flex items-center gap-3 text-xs select-none">
            {/* Game Branding */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                <Zap className="w-4 h-4 fill-white stroke-none" />
              </div>
              <span className="text-xs sm:text-[13px] font-black tracking-tight text-slate-900 uppercase">
                Datacenter Simulator
              </span>
            </div>

            {/* Subtle Vertical Divider */}
            {user && <div className="h-5 w-[2px] bg-slate-200" />}

            {/* User Name (Clickable for Account & Logout Dropdown) */}
            {user && (
              <button
                ref={userButtonRef}
                type="button"
                onClick={() => setShowUserMenu((prev) => !prev)}
                className="flex items-center gap-1.5 py-1 px-2.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer group"
                title="Account options & logout"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center border border-emerald-200">
                  <User className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <span className="font-black text-slate-700 group-hover:text-slate-900 text-xs">
                  {user.username}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform duration-200 ${
                    showUserMenu ? 'rotate-180' : ''
                  }`}
                />
              </button>
            )}
          </div>

          {/* User Dropdown Menu with Red Logout Button - Duolingo Style */}
          {user && showUserMenu && (
            <div
              ref={userMenuRef}
              className="absolute left-0 top-full mt-2 w-56 bg-white border-2 border-slate-200 border-b-6 border-b-slate-300 rounded-3xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150"
            >
              <div className="px-2.5 py-2 mb-2 border-b border-slate-100 bg-slate-50 rounded-2xl">
                <div className="text-xs font-black text-slate-900 truncate">{user.username}</div>
                <div className="text-[10px] text-slate-500 font-bold flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  {character?.name || 'Young'} Track • Level {level}
                </div>
              </div>

              {/* Red Logout Button */}
              <button
                type="button"
                onClick={() => {
                  setShowUserMenu(false)
                  setShowLogoutConfirm(true)
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl text-xs font-black text-white duo-btn-red cursor-pointer uppercase tracking-wider select-none shadow-xs"
              >
                <LogOut className="w-4 h-4 stroke-[2.5]" />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>

        {/* Right: Judge Demo Switcher & Camera Navigation Controls - Duolingo 3D Chunky Style */}
        <div className="pointer-events-auto flex items-center gap-2 bg-white px-3 py-1.5 rounded-2xl border-2 border-slate-200 border-b-4 border-b-slate-300 shadow-md text-xs select-none">
          {/* Demo Level Segmented Control */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <span className="text-[10px] font-black text-amber-700 uppercase tracking-wider pl-1.5 pr-0.5 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">Demo</span>
            </span>
            {([1, 2, 3] as DataCenterLevel[]).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setDemoLevel(lvl)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase transition-all cursor-pointer ${
                  level === lvl
                    ? 'duo-btn-green'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
                title={`Switch simulation directly to Level ${lvl}`}
              >
                L{lvl}
              </button>
            ))}
          </div>

          <div className="h-5 w-[2px] bg-slate-200" />

          {/* Camera Navigation Segmented Switch (Pan vs Rotate) */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => onToggleControlMode?.('pan')}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg text-[11px] uppercase transition-all cursor-pointer ${
                controlMode === 'pan'
                  ? 'bg-white text-slate-900 shadow-xs font-black border border-slate-200'
                  : 'text-slate-500 hover:text-slate-800 font-bold'
              }`}
              title="Pan camera with Left Click / Touch Drag"
            >
              <Move className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Pan</span>
            </button>
            <button
              onClick={() => onToggleControlMode?.('rotate')}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg text-[11px] uppercase transition-all cursor-pointer ${
                controlMode === 'rotate'
                  ? 'bg-white text-slate-900 shadow-xs font-black border border-slate-200'
                  : 'text-slate-500 hover:text-slate-800 font-bold'
              }`}
              title="Rotate scene with Left Click / Touch Drag"
            >
              <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Rotate</span>
            </button>
          </div>

          <div className="h-5 w-[2px] bg-slate-200" />

          {/* Recenter Camera Button */}
          <button
            onClick={onRecenter}
            className="p-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer active:scale-95"
            title="Recenter camera on campus"
          >
            <Compass className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Middle Screen is completely clean & unobstructed */}

      {/* Bottom HUD Layer */}
      <div className="flex items-end justify-between w-full gap-3">
        {/* Bottom-Left Simulation Stats & 7 Glance Widgets */}
        <div className="pointer-events-auto flex flex-col gap-2.5 min-w-0 max-w-[calc(100vw-170px)]">
          {/* Money Pill - Duolingo Chunky Treasury Badge */}
          <div className="flex items-center bg-white border-2 border-amber-300 border-b-4 border-b-amber-500 rounded-2xl px-4 py-2 w-fit gap-3 shadow-md select-none transition-all hover:-translate-y-0.5">
            <div className="w-8 h-8 rounded-xl bg-amber-400 border-b-2 border-amber-600 text-amber-950 flex items-center justify-center font-black text-xs shadow-xs">
              <DollarSign className="w-4 h-4 stroke-[3]" />
            </div>
            <div className="flex flex-col text-left leading-none">
              <span className="font-black text-slate-900 text-base sm:text-lg tracking-tight">
                € {Math.round(money).toLocaleString()}
              </span>
              <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest mt-1">
                City Treasury
              </span>
            </div>
          </div>

          {/* 7 Clickable Glance Widgets in ONE Single Row - Duolingo 3D Chunky Buttons */}
          <div className="flex items-center gap-2.5 overflow-x-auto scrollbar-none py-1.5">
            {glanceItems.map((item) => {
              const IconComp = item.icon
              return (
                <button
                  key={item.key}
                  onClick={() => openEffect(item.key)}
                  className={`bg-white border-2 border-slate-200 border-b-4 border-b-slate-300 ${item.borderHover} hover:-translate-y-1 hover:shadow-md active:translate-y-[2px] active:border-b-2 rounded-2xl px-3 py-2 flex items-center gap-2.5 cursor-pointer transition-all duration-150 shrink-0 whitespace-nowrap text-left group select-none shadow-xs`}
                  title={`Click to view ${item.label} details`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl ${item.badgeBg} ${item.badgeText} border-b-2 border-black/10 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-150 shadow-2xs`}
                  >
                    <IconComp className="w-4 h-4 stroke-[2.8]" />
                  </div>
                  <div className="flex flex-col text-left leading-none">
                    <span className="text-xs sm:text-[13px] font-black text-slate-900 tracking-tight">
                      {item.value}
                    </span>
                    <span className={`text-[10px] font-black text-slate-400 ${item.hoverText} uppercase tracking-wider mt-1 transition-colors`}>
                      {item.label}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Bottom-Right Upgrade Button - Duolingo 3D Button */}
        <div className="pointer-events-auto shrink-0 mb-0.5">
          <button
            onClick={() => setIsUpgradeModalOpen(true)}
            className={`flex flex-col items-center justify-center px-6 py-3 rounded-2xl shadow-md transition-all group cursor-pointer text-white select-none ${
              level === 3 ? 'duo-btn-amber' : 'duo-btn-green'
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center mb-0.5 group-hover:scale-110 transition-transform">
              <ChevronsUp className="w-5 h-5 stroke-[3]" />
            </div>
            <span className="font-black text-xs tracking-wider uppercase">
              {level === 3 ? 'MAX LEVEL' : `UPGRADE L${level + 1}`}
            </span>
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal - Duolingo Style */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm pointer-events-auto animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white border-2 border-slate-200 border-b-6 rounded-[32px] shadow-2xl p-6 text-slate-800 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-3 shadow-xs border-2 border-rose-200">
              <LogOut className="w-7 h-7 stroke-[2.5]" />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-1">
              Log Out of Datacenter Simulator?
            </h3>
            <p className="text-xs font-semibold text-slate-500 mb-5 leading-relaxed">
              Are you sure you want to log out? Any unsaved progress in this session may be lost.
            </p>

            <div className="flex items-center gap-3 w-full">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-3 px-4 rounded-2xl font-black text-xs duo-btn-white cursor-pointer uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLogoutConfirm(false)
                  signOut()
                }}
                className="flex-1 py-3 px-4 rounded-2xl font-black text-xs text-white duo-btn-red cursor-pointer shadow-md uppercase tracking-wider"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
