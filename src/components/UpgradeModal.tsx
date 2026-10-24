import React from 'react'
import { useGame } from '../context/GameContext'
import { LEVEL_STATS } from '../data/impacts'
import { DataCenterLevel } from '../types/game'
import { X, ArrowRight, CheckCircle2, Zap, Users, Flame, DollarSign, Award } from 'lucide-react'

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md pointer-events-auto animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-slate-900 border-2 border-slate-700/80 rounded-3xl shadow-2xl p-6 sm:p-7 text-white relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-2xl">
              ⚡
            </div>
            <div>
              <h2 className="text-lg font-black text-white">
                Municipal Facility Upgrade
              </h2>
              <p className="text-xs text-slate-400">
                Scale Tampere’s green cloud computing & municipal heat capture
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsUpgradeModalOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center border border-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isMaxLevel ? (
          /* Level 3 Max Reached */
          <div className="py-8 text-center space-y-4">
            <div className="w-20 h-20 rounded-3xl bg-amber-500/20 border-2 border-amber-400/40 mx-auto flex items-center justify-center text-4xl shadow-xl shadow-amber-500/20">
              🏆
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
                Peak Level 3 Reached
              </span>
              <h3 className="text-2xl font-black text-white mt-2">
                Tampere Hyperscale Vision Complete!
              </h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto mt-2 leading-relaxed">
                Your facility has reached the pinnacle of Nordic green infrastructure. Covering 90 MW of Tampere’s district heating, employing 250 high-tech staff, and pouring €15M in annual taxes into the municipality!
              </p>
            </div>

            <button
              onClick={() => setIsUpgradeModalOpen(false)}
              className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition-all"
            >
              Continue Managing Campus
            </button>
          </div>
        ) : (
          /* Upgrade Available */
          <div className="py-4 space-y-4">
            {/* Comparison Box */}
            <div className="grid grid-cols-2 gap-3 bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Tier</span>
                <h4 className="text-sm font-black text-white">{currentStats.name}</h4>
                <div className="mt-2 space-y-1 text-xs text-slate-300">
                  <div>⚡ {currentStats.powerCapacityMw} MW Capacity</div>
                  <div>🔥 {currentStats.wasteHeatMw} Waste Heat</div>
                  <div>👷 {currentStats.permanentStaff} Permanent Jobs</div>
                </div>
              </div>

              <div className="border-l border-slate-700/80 pl-3">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Next Tier</span>
                <h4 className="text-sm font-black text-emerald-300">{nextStats?.name}</h4>
                <div className="mt-2 space-y-1 text-xs text-emerald-200 font-medium">
                  <div>⚡ {nextStats?.powerCapacityMw} MW Capacity</div>
                  <div>🔥 {nextStats?.wasteHeatMw} Waste Heat</div>
                  <div>👷 {nextStats?.permanentStaff} Permanent Jobs</div>
                </div>
              </div>
            </div>

            {/* Impact Highlights */}
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-3.5 space-y-1.5 text-xs text-emerald-200">
              <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-emerald-400" />
                <span>District Heating Impact: {nextStats?.homesHeatedDistrict}</span>
              </div>
              <div className="text-[11px] text-slate-300">
                Municipal Tax Return: {nextStats?.taxRevenuePerYear} directly funding Tampere public services.
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Upgrade Cost</span>
                <div className="text-lg font-black text-white">
                  ${upgradeCost.toLocaleString()}
                </div>
              </div>

              <button
                type="button"
                onClick={handleUpgrade}
                disabled={!canAfford}
                className="py-3 px-5 rounded-xl font-black text-xs text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2 cursor-pointer active:scale-98"
              >
                <span>Authorize Level {nextLevel} Expansion</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
