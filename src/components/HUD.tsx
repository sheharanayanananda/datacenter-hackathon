import React from 'react'
import { Hammer, Settings, Smile, Zap, DollarSign } from 'lucide-react'
import { CityStats } from '../types'

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
  const xpPercent = Math.min(100, Math.round((stats.xp / stats.xpNeeded) * 100))

  return (
    <div className="fixed inset-0 pointer-events-none flex flex-col justify-between p-4 md:p-6 z-20">
      {/* Top Header / Notification Bar */}
      <div className="flex items-center justify-between w-full">
        {/* Project Branding */}
        <div className="pointer-events-auto bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-700/60 shadow-lg flex items-center gap-2.5">
          <span className="text-xl">⚡</span>
          <div>
            <h1 className="text-sm font-extrabold tracking-wide text-white uppercase flex items-center gap-2">
              Nordic EcoTown <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/40">Simulation</span>
            </h1>
            <p className="text-[11px] font-medium text-slate-400">
              Zero-Emission Data Center & Renewable Microgrid
            </p>
          </div>
        </div>

        {/* Camera Control Switcher & Shortcut Hints */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md p-1.5 rounded-2xl border border-slate-700/60 shadow-lg text-xs">
          <button
            onClick={() => onToggleControlMode?.('pan')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
              controlMode === 'pan'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
            title="Pan Mode: Left-drag or WASD / Arrow keys to glide across map"
          >
            <span>✋</span>
            <span>Pan</span>
          </button>
          <button
            onClick={() => onToggleControlMode?.('rotate')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
              controlMode === 'rotate'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
            title="Rotate Mode: Left-drag to orbit camera"
          >
            <span>🔄</span>
            <span>Rotate</span>
          </button>
          <div className="h-4 w-px bg-slate-700/60 mx-0.5" />
          <button
            onClick={onRecenter}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 font-semibold transition-all"
            title="Recenter camera on town"
          >
            <span>🎯</span>
            <span className="hidden sm:inline">Center</span>
          </button>
          <span className="hidden xl:inline text-[11px] text-slate-400 pl-1 pr-1.5 border-l border-slate-700/60 ml-0.5">
            WASD to pan • Scroll to zoom
          </span>
        </div>
      </div>

      {/* Bottom HUD Layer */}
      <div className="flex items-end justify-between w-full">
        {/* Bottom-Left Simulation Stats (Matching reference screenshot) */}
        <div className="pointer-events-auto flex flex-col gap-2.5">
          {/* Money Pill */}
          <div className="flex items-center bg-[#fffbeb] border-2 border-[#fef08a] px-3.5 py-1.5 rounded-2xl shadow-game-button w-fit">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-sm mr-2">
              <DollarSign className="w-5 h-5 stroke-[3]" />
            </div>
            <span className="font-black text-slate-800 text-lg tracking-wide">
              {stats.money.toLocaleString()}
            </span>
          </div>

          {/* Level Progress Bar & Energy Gauge */}
          <div className="flex items-center gap-2">
            {/* Level / XP Pill */}
            <div className="flex items-center bg-slate-900/85 backdrop-blur-md border-2 border-slate-700 px-3 py-1.5 rounded-2xl shadow-game-button">
              {/* Coin Icon */}
              <div className="w-6 h-6 rounded-full bg-amber-400 border-2 border-amber-500 text-amber-950 flex items-center justify-center font-black text-xs mr-2 shadow-sm">
                ★
              </div>
              <div className="w-24 md:w-32 mr-2">
                <div className="w-full bg-slate-700/80 rounded-full h-3 overflow-hidden p-0.5 border border-slate-600">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-lime-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${xpPercent}%` }}
                  />
                </div>
              </div>
              <span className="text-xs font-black text-white whitespace-nowrap">
                {stats.xp}/{stats.xpNeeded}
              </span>
            </div>

            {/* Energy Battery Gauge */}
            <div className="flex items-center bg-slate-900/85 backdrop-blur-md border-2 border-slate-700 px-3 py-1.5 rounded-2xl shadow-game-button">
              <div className="w-6 h-6 rounded-full bg-amber-500 text-amber-950 flex items-center justify-center mr-2 shadow-sm">
                <Zap className="w-4 h-4 fill-amber-950 stroke-none" />
              </div>
              <div className="w-16 md:w-20">
                <div className="w-full bg-slate-700/80 rounded-full h-3 overflow-hidden p-0.5 border border-slate-600">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${stats.energyPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Circular Quick Action Toggles */}
            <button
              onClick={onToggleMascot}
              title="Mascot Insights"
              className="w-10 h-10 rounded-full bg-emerald-500 hover:bg-emerald-600 border-2 border-emerald-300 text-white flex items-center justify-center shadow-game-button transition-transform active:scale-95 text-lg"
            >
              <Smile className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Bottom-Right Big Game Buttons (Matching screenshot) */}
        <div className="pointer-events-auto flex items-center gap-3">
          {/* Blue Hammer BUILD Button */}
          <button
            onClick={onBuildClick}
            className="flex flex-col items-center justify-center bg-gradient-to-b from-sky-400 to-sky-600 hover:from-sky-300 hover:to-sky-500 border-2 border-sky-300 px-5 py-3 rounded-2xl shadow-game-button transition-all active:scale-95 group"
          >
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
              <Hammer className="w-6 h-6 text-white stroke-[2.5]" />
            </div>
            <span className="font-black text-sm tracking-wider text-white uppercase drop-shadow-sm">
              BUILD
            </span>
          </button>

          {/* Cyan/Gold Gears SETTINGS / UPGRADE Button */}
          <button
            onClick={onUpgradeClick}
            className="flex flex-col items-center justify-center bg-gradient-to-b from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 border-2 border-amber-300 px-5 py-3 rounded-2xl shadow-game-button transition-all active:scale-95 group"
          >
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
              <Settings className="w-6 h-6 text-white stroke-[2.5]" />
            </div>
            <span className="font-black text-sm tracking-wider text-white uppercase drop-shadow-sm">
              UPGRADE
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
