import React, { useState } from 'react'
import { useGame } from '../context/GameContext'
import { IMPACT_DIMENSIONS } from '../data/impacts'
import { ImpactDimensionKey, DataCenterLevel } from '../types/game'
import { X, Sparkles, Check, ArrowRight, TrendingUp } from 'lucide-react'

export const SevenImpactsModal: React.FC = () => {
  const { isSevenImpactsOpen, setIsSevenImpactsOpen, activeImpactKey, setActiveImpactKey, level } = useGame()
  const [selectedKey, setSelectedKey] = useState<ImpactDimensionKey>(activeImpactKey || 'energy')

  if (!isSevenImpactsOpen && !activeImpactKey) return null

  const currentDimension = IMPACT_DIMENSIONS.find((d) => d.key === (activeImpactKey || selectedKey)) || IMPACT_DIMENSIONS[0]

  const handleClose = () => {
    setIsSevenImpactsOpen(false)
    setActiveImpactKey(null)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md pointer-events-auto animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-slate-900 border-2 border-slate-700/80 rounded-3xl shadow-2xl p-5 sm:p-7 text-white relative overflow-hidden flex flex-col max-h-[92vh]">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 flex items-center justify-center text-2xl shadow-sm">
              🏢
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white">
                  Datakeskuksen Vaikutukset
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  7 Core Dimensions
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Explore how the data center shapes Tampere’s grid, community, nature, and economy.
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="w-9 h-9 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center border border-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 7 Pills Navigation Bar (Matching presentation slide) */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-3 border-b border-slate-800/80 scrollbar-none shrink-0">
          {IMPACT_DIMENSIONS.map((dim) => {
            const isSelected = dim.key === currentDimension.key
            return (
              <button
                key={dim.key}
                onClick={() => {
                  setSelectedKey(dim.key)
                  setActiveImpactKey(dim.key)
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                    : 'bg-slate-800/70 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <span>{dim.icon}</span>
                <span>{dim.title}</span>
                <span className="text-[10px] opacity-75 hidden md:inline font-normal">
                  ({dim.finnishTitle})
                </span>
              </button>
            )
          })}
        </div>

        {/* Active Dimension Content */}
        <div className="overflow-y-auto py-4 space-y-5 pr-1">
          {/* Main Description */}
          <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{currentDimension.icon}</span>
                <h3 className="text-base font-extrabold text-white">
                  {currentDimension.title} • {currentDimension.finnishTitle}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-700 text-slate-300">
                  {currentDimension.badge}
                </span>
              </div>
              <p className="text-xs text-slate-300 max-w-xl">
                {currentDimension.description}
              </p>
            </div>

            <div className="shrink-0 bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-700 text-center">
              <div className="text-[10px] uppercase font-bold text-slate-400">Current Facility Level</div>
              <div className="text-sm font-black text-emerald-400">
                Level {level} {level === 3 ? '(Peak)' : ''}
              </div>
            </div>
          </div>

          {/* Level by Level Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {([1, 2, 3] as DataCenterLevel[]).map((lvl) => {
              const details = currentDimension.detailsByLevel[lvl]
              const isCurrent = lvl === level

              return (
                <div
                  key={lvl}
                  className={`relative rounded-2xl p-4 border-2 transition-all flex flex-col justify-between ${
                    isCurrent
                      ? 'bg-slate-800/95 border-emerald-500/80 shadow-lg shadow-emerald-500/10'
                      : 'bg-slate-800/40 border-slate-700/60 opacity-85 hover:opacity-100'
                  }`}
                >
                  {isCurrent && (
                    <div className="absolute -top-2.5 right-4 bg-emerald-500 text-slate-950 font-black text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm">
                      Active Facility Tier
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
                        Level {lvl} {lvl === 3 ? '• Peak' : ''}
                      </span>
                      <div className="text-right">
                        <span className="text-xs font-black text-emerald-400">
                          {details.metricValue}
                        </span>
                        <div className="text-[9px] text-slate-400 font-medium">
                          {details.metricLabel}
                        </div>
                      </div>
                    </div>

                    <h4 className="text-sm font-extrabold text-white mb-2.5">
                      {details.headline}
                    </h4>

                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {details.points.map((pt, i) => (
                        <li key={i} className="flex items-start gap-1.5 leading-snug">
                          <span className="text-emerald-400 text-xs mt-0.5">•</span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <span>Based on Finnish municipal data center zoning & VTT energy models</span>
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  )
}
