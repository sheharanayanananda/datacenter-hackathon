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
  }[] = [
    {
      key: 'energy',
      label: 'Energy',
      value: glance.energy,
      icon: Zap,
      badgeBg: 'bg-amber-100',
      badgeText: 'text-amber-600',
      borderHover: 'hover:border-amber-400 hover:border-b-amber-500',
    },
    {
      key: 'surroundings',
      label: 'Heat',
      value: glance.heat,
      icon: Flame,
      badgeBg: 'bg-orange-100',
      badgeText: 'text-orange-600',
      borderHover: 'hover:border-orange-400 hover:border-b-orange-500',
    },
    {
      key: 'jobs',
      label: 'Jobs',
      value: glance.jobs,
      icon: Users,
      badgeBg: 'bg-sky-100',
      badgeText: 'text-sky-600',
      borderHover: 'hover:border-sky-400 hover:border-b-sky-500',
    },
    {
      key: 'transport',
      label: 'Traffic',
      value: glance.traffic,
      icon: Truck,
      badgeBg: 'bg-purple-100',
      badgeText: 'text-purple-600',
      borderHover: 'hover:border-purple-400 hover:border-b-purple-500',
    },
    {
      key: 'land_use',
      label: 'Forest',
      value: glance.land,
      icon: Trees,
      badgeBg: 'bg-emerald-100',
      badgeText: 'text-emerald-600',
      borderHover: 'hover:border-emerald-400 hover:border-b-emerald-500',
    },
    {
      key: 'safety',
      label: 'Water',
      value: glance.water,
      icon: ShieldCheck,
      badgeBg: 'bg-rose-100',
      badgeText: 'text-rose-600',
      borderHover: 'hover:border-rose-400 hover:border-b-rose-500',
    },
    {
      key: 'future',
      label: 'Taxes',
      value: glance.tax,
      icon: TrendingUp,
      badgeBg: 'bg-teal-100',
      badgeText: 'text-teal-600',
      borderHover: 'hover:border-teal-400 hover:border-b-teal-500',
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
        {/* Left: Combined Minimal Header Pill with Game Name & User Name */}
        <div className="pointer-events-auto relative">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl border-2 border-white shadow-lg px-3.5 py-2 flex items-center gap-3 text-xs select-none">
            {/* Game Branding */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                <Zap className="w-3.5 h-3.5 fill-white stroke-none" />
              </div>
              <span className="text-xs sm:text-[13px] font-black tracking-tight text-slate-900 uppercase">
                Datacenter Simulator
              </span>
            </div>

            {/* Subtle Vertical Divider */}
            {user && <div className="h-4 w-px bg-slate-200" />}

            {/* User Name (Clickable for Account & Logout Dropdown) */}
            {user && (
              <button
                ref={userButtonRef}
                type="button"
                onClick={() => setShowUserMenu((prev) => !prev)}
                className="flex items-center gap-1.5 py-1 px-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer group"
                title="Account options & logout"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <User className="w-3 h-3 text-emerald-600" />
                </div>
                <span className="font-bold text-slate-700 group-hover:text-slate-900 text-xs">
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

          {/* User Dropdown Menu with Red Logout Button */}
          {user && showUserMenu && (
            <div
              ref={userMenuRef}
              className="absolute left-0 top-full mt-2 w-52 bg-white border-2 border-slate-200 border-b-4 rounded-2xl shadow-xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150"
            >
              <div className="px-2 py-1.5 mb-1.5 border-b border-slate-100">
                <div className="text-xs font-black text-slate-900 truncate">{user.username}</div>
                <div className="text-[10px] text-slate-400 font-semibold flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
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
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-200/80 hover:border-rose-600 transition-all cursor-pointer group"
              >
                <LogOut className="w-3.5 h-3.5 group-hover:stroke-white transition-colors" />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>

        {/* Right: Judge Demo Switcher & Camera Navigation Controls (Minimal & Cohesive) */}
        <div className="pointer-events-auto flex items-center gap-2 bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-2xl border-2 border-white shadow-lg text-xs select-none">
          {/* Demo Level Segmented Control */}
          <div className="flex items-center gap-1 bg-slate-100/90 p-0.5 rounded-xl">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider pl-1.5 pr-0.5 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span className="hidden sm:inline">Demo</span>
            </span>
            {([1, 2, 3] as DataCenterLevel[]).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setDemoLevel(lvl)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                  level === lvl
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title={`Switch simulation directly to Level ${lvl}`}
              >
                L{lvl}{lvl === 3 ? ' Peak' : ''}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-slate-200" />

          {/* Camera Navigation Segmented Switch (Pan vs Rotate) */}
          <div className="flex items-center bg-slate-100/90 p-0.5 rounded-xl">
            <button
              onClick={() => onToggleControlMode?.('pan')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] transition-all cursor-pointer ${
                controlMode === 'pan'
                  ? 'bg-white text-slate-900 shadow-xs font-black'
                  : 'text-slate-500 hover:text-slate-800 font-bold'
              }`}
              title="Pan camera with Left Click / Touch Drag"
            >
              <Move className="w-3 h-3" />
              <span>Pan</span>
            </button>
            <button
              onClick={() => onToggleControlMode?.('rotate')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] transition-all cursor-pointer ${
                controlMode === 'rotate'
                  ? 'bg-white text-slate-900 shadow-xs font-black'
                  : 'text-slate-500 hover:text-slate-800 font-bold'
              }`}
              title="Rotate scene with Left Click / Touch Drag"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Rotate</span>
            </button>
          </div>

          <div className="h-4 w-px bg-slate-200" />

          {/* Recenter Camera Button */}
          <button
            onClick={onRecenter}
            className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer active:scale-95"
            title="Recenter camera on campus"
          >
            <Compass className="w-4 h-4 stroke-[2.2]" />
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

          {/* 7 Clickable Glance Widgets in ONE Single Row - Duolingo 3D Button Style with Smooth Popup Transition */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
            {glanceItems.map((item) => {
              const IconComp = item.icon
              return (
                <button
                  key={item.key}
                  onClick={() => openEffect(item.key)}
                  className={`bg-white hover:bg-white border-2 border-slate-200 border-b-4 ${item.borderHover} hover:-translate-y-1 hover:shadow-md active:translate-y-[2px] active:border-b-2 rounded-2xl px-3 py-1.5 flex items-center gap-2.5 cursor-pointer transition-all duration-200 shrink-0 whitespace-nowrap text-left group select-none shadow-sm`}
                  title={`Click to view ${item.label} details`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl ${item.badgeBg} ${item.badgeText} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200 shadow-xs`}
                  >
                    <IconComp className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <div className="flex flex-col text-left leading-none">
                    <span className="text-xs sm:text-[13px] font-black text-slate-800 tracking-tight">
                      {item.value}
                    </span>
                    <span className="text-[10px] font-extrabold text-slate-400 group-hover:text-slate-600 uppercase tracking-wider mt-1 transition-colors">
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

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm pointer-events-auto animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white border-2 border-slate-200 border-b-4 rounded-2xl shadow-2xl p-6 text-slate-800 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-3">
              <LogOut className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h3 className="text-base font-black text-slate-900 mb-1">
              Log Out of Datacenter Simulator?
            </h3>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              Are you sure you want to log out? Any unsaved progress in this session may be lost.
            </p>

            <div className="flex items-center gap-2.5 w-full">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 px-3 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLogoutConfirm(false)
                  signOut()
                }}
                className="flex-1 py-2.5 px-3 rounded-xl font-black text-xs bg-rose-600 hover:bg-rose-700 text-white transition-colors shadow-sm cursor-pointer"
              >
                Yes, Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
