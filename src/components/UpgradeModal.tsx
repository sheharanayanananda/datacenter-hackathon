import React from 'react'
import { useGame } from '../context/GameContext'
import { LEVEL_STATS } from '../data/impacts'
import { DataCenterLevel } from '../types/game'
import { X, ArrowRight, Zap, Flame, Users, ChevronsUp, Award } from 'lucide-react'

export const UpgradeModal: React.FC = () => {
  const { isUpgradeModalOpen, setIsUpgradeModalOpen, level, money, upgradeLevel } = useGame()

  if (!isUpgradeModalOpen) return null

  const isMaxLevel = level === 3
  const nextLevel = (level + 1) as DataCenterLevel
  const currentStats = LEVEL_STATS[level]
  const nextStats = isMaxLevel ? null : LEVEL_STATS[nextLevel]
  const upgradeCost = nextLevel === 2 ? 15000 : 50000
  const canAfford = money >= upgradeCost

  const handleUpgrade = async () => {
    if (!nextStats || !canAfford) return
    await upgradeLevel(nextLevel)
    setIsUpgradeModalOpen(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm pointer-events-auto animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white border-4 border-white rounded-[32px] shadow-2xl p-6 sm:p-7 text-slate-800 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-sm">
              <ChevronsUp className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                Municipal Facility Upgrade
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Scale clean cloud computing and municipal heat capture
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsUpgradeModalOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {isMaxLevel ? (
          /* Level 3 Max Reached */
          <div className="py-6 text-center space-y-3.5">
            <div className="w-16 h-16 rounded-3xl bg-amber-100 border-2 border-amber-300 mx-auto flex items-center justify-center text-amber-600 shadow-sm">
              <Award className="w-8 h-8 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
                Level 3 Max Reached
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-2">
                Hyperscale Vision Complete!
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto mt-1.5 leading-relaxed font-medium">
                Your facility has reached the pinnacle of Nordic green infrastructure. Covering 90 MW of municipal district heating, employing 250 high-tech staff, and generating €15M in annual taxes!
              </p>
            </div>

            <button
              onClick={() => setIsUpgradeModalOpen(false)}
              className="px-6 py-3 text-white font-black rounded-2xl text-xs duo-btn-green cursor-pointer shadow-md uppercase tracking-wider"
            >
              Continue Managing Campus
            </button>
          </div>
        ) : (
          /* Upgrade Available */
          <div className="space-y-3.5">
            {/* Comparison Box */}
            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Current Tier</span>
                <h4 className="text-xs font-black text-slate-900 mt-0.5">{currentStats.name}</h4>
                <div className="mt-2 space-y-1 text-xs text-slate-600 font-semibold">
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-500" /> {currentStats.powerCapacityMw} MW Capacity
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-orange-500" /> {currentStats.wasteHeatMw} Waste Heat
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-blue-500" /> {currentStats.permanentStaff} Staff Jobs
                  </div>
                </div>
              </div>

              <div className="border-l border-slate-200 pl-3">
                <span className="text-[10px] font-black text-emerald-700 uppercase tracking-wider">Next Tier</span>
                <h4 className="text-xs font-black text-emerald-800 mt-0.5">{nextStats?.name}</h4>
                <div className="mt-2 space-y-1 text-xs text-emerald-950 font-bold">
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-emerald-600" /> {nextStats?.powerCapacityMw} MW Capacity
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-orange-500" /> {nextStats?.wasteHeatMw} Waste Heat
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-blue-600" /> {nextStats?.permanentStaff} Staff Jobs
                  </div>
                </div>
              </div>
            </div>

            {/* Impact Highlights */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 space-y-1 text-xs">
              <div className="font-black text-emerald-900 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                <span>District Heating: Warming {nextStats?.homesHeatedDistrict}</span>
              </div>
              <div className="text-[11px] text-slate-600 font-medium">
                Annual Tax Windfall: {nextStats?.taxRevenuePerYear} directly funding local public schools and parks.
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Upgrade Cost</span>
                <div className="text-base font-black text-slate-900">
                  ${upgradeCost.toLocaleString()}
                </div>
              </div>

              <button
                type="button"
                onClick={handleUpgrade}
                disabled={!canAfford}
                className="py-3 px-6 rounded-2xl font-black text-xs text-white duo-btn-green disabled:opacity-40 disabled:cursor-not-allowed shadow-md transition-all flex items-center gap-2 cursor-pointer uppercase tracking-wider"
              >
                <span>Authorize Level {nextLevel} Expansion</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
