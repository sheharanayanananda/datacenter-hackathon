import React, { useState } from 'react'
import { useGame } from '../context/GameContext'
import { IMPACT_DIMENSIONS } from '../data/impacts'
import { ImpactDimensionKey, DataCenterLevel } from '../types/game'
import {
  Zap,
  Flame,
  Users,
  Truck,
  Trees,
  ShieldCheck,
  TrendingUp,
  X,
  Check,
  Building2,
  BarChart3,
  Award,
} from 'lucide-react'

export const SevenImpactsModal: React.FC = () => {
  const { isSevenImpactsOpen, setIsSevenImpactsOpen, activeImpactKey, setActiveImpactKey, level } = useGame()
  const [selectedKey, setSelectedKey] = useState<ImpactDimensionKey>(activeImpactKey || 'energy')

  if (!isSevenImpactsOpen && !activeImpactKey) return null

  const currentDimension = IMPACT_DIMENSIONS.find((d) => d.key === (activeImpactKey || selectedKey)) || IMPACT_DIMENSIONS[0]

  const handleClose = () => {
    setIsSevenImpactsOpen(false)
    setActiveImpactKey(null)
  }

  const getDimensionIcon = (name: string) => {
    switch (name) {
      case 'Zap': return Zap
      case 'Flame': return Flame
      case 'Users': return Users
      case 'Truck': return Truck
      case 'Trees': return Trees
      case 'ShieldCheck': return ShieldCheck
      default: return TrendingUp
    }
  }

  const ActiveIcon = getDimensionIcon(currentDimension.iconName)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/60 backdrop-blur-sm pointer-events-auto animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-white border-4 border-white rounded-[32px] shadow-2xl p-5 sm:p-7 text-slate-800 relative overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-sm">
              <BarChart3 className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  Data Center City Impacts
                </h2>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  7 Core Dimensions
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Real-world simulation of regional energy, neighborhood heating, local jobs, and municipal taxes.
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* 7 Pills Navigation Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-3 border-b border-slate-100 scrollbar-none shrink-0">
          {IMPACT_DIMENSIONS.map((dim) => {
            const isSelected = dim.key === currentDimension.key
            const DimIcon = getDimensionIcon(dim.iconName)

            return (
              <button
                key={dim.key}
                onClick={() => {
                  setSelectedKey(dim.key)
                  setActiveImpactKey(dim.key)
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                <DimIcon className="w-3.5 h-3.5" />
                <span>{dim.title.split(' ')[0]}</span>
              </button>
            )
          })}
        </div>

        {/* Active Dimension Content */}
        <div className="overflow-y-auto py-4 space-y-4 pr-1">
          {/* Main Description */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <ActiveIcon className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-sm font-black text-slate-900">
                  {currentDimension.title}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600">
                  {currentDimension.badge}
                </span>
              </div>
              <p className="text-xs text-slate-600 max-w-xl font-medium">
                {currentDimension.description}
              </p>
            </div>

            <div className="shrink-0 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200 text-center shadow-sm">
              <div className="text-[10px] uppercase font-bold text-slate-400">Current Facility</div>
              <div className="text-xs font-black text-emerald-600">
                Level {level} {level === 3 ? '(Peak)' : ''}
              </div>
            </div>
          </div>

          {/* Level by Level Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {([1, 2, 3] as DataCenterLevel[]).map((lvl) => {
              const details = currentDimension.detailsByLevel[lvl]
              const isCurrent = lvl === level

              return (
                <div
                  key={lvl}
                  className={`relative rounded-2xl p-4 border-2 transition-all flex flex-col justify-between ${
                    isCurrent
                      ? 'bg-emerald-50/50 border-emerald-500 shadow-md'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {isCurrent && (
                    <div className="absolute -top-2.5 right-4 bg-emerald-600 text-white font-black text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm">
                      Active Facility Tier
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black text-slate-500 uppercase tracking-wider">
                        Level {lvl} {lvl === 3 ? '(Peak)' : ''}
                      </span>
                      <div className="text-right">
                        <span className="text-xs font-black text-emerald-700">
                          {details.metricValue}
                        </span>
                        <div className="text-[9px] text-slate-400 font-semibold">
                          {details.metricLabel}
                        </div>
                      </div>
                    </div>

                    <h4 className="text-xs font-black text-slate-900 mb-2">
                      {details.headline}
                    </h4>

                    <ul className="space-y-1.5 text-xs text-slate-600">
                      {details.points.map((pt, i) => (
                        <li key={i} className="flex items-start gap-1.5 leading-snug">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
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
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span className="font-medium">Data based on Nordic municipal engineering specifications</span>
          <button
            onClick={handleClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-xl transition-all cursor-pointer text-xs"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  )
}
