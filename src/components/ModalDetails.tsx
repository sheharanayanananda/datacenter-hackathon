import React from 'react'
import { X, Zap, Flame, Users, CheckCircle2, TrendingUp, Plus, ShieldCheck } from 'lucide-react'
import { CityStats, InspectionTab, HouseInfo } from '../types'

interface ModalDetailsProps {
  tab: InspectionTab | 'build' | 'upgrade' | null;
  selectedHouse: HouseInfo | null;
  stats: CityStats;
  onClose: () => void;
  onUpgradeWind: () => void;
  onUpgradeSolar: () => void;
  onConnectHouse: () => void;
}

export const ModalDetails: React.FC<ModalDetailsProps> = ({
  tab,
  selectedHouse,
  stats,
  onClose,
  onUpgradeWind,
  onUpgradeSolar,
  onConnectHouse,
}) => {
  if (!tab && !selectedHouse) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm pointer-events-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border-2 border-slate-700 w-full max-w-lg rounded-3xl shadow-2xl p-6 text-slate-100 relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors border border-slate-700"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Selected House Inspection View */}
        {selectedHouse && !tab && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl">
                🏡
              </div>
              <div>
                <h2 className="text-xl font-black text-white">{selectedHouse.name}</h2>
                <p className="text-xs text-slate-400">Nordic Residential District Sector 2</p>
              </div>
            </div>

            <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700 mb-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Heating Source:</span>
                <span className="font-bold text-orange-400 flex items-center gap-1">
                  <Flame className="w-4 h-4 fill-orange-400" /> Data Center Waste Heat
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Indoor Temp:</span>
                <span className="font-bold text-emerald-400">+22.5 °C (Optimal Warmth)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Fossil Fuel Saved:</span>
                <span className="font-bold text-sky-400">3,400 kg CO₂ / yr</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              This home is heated via the glowing underground hydronic pipeline connected directly
              to the data center's server heat exchangers. No oil or gas burner needed!
            </p>
          </div>
        )}

        {/* Energy Tab */}
        {tab === 'energy' && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Zap className="w-7 h-7 fill-amber-400 stroke-none" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">100% Renewable Power</h2>
                <p className="text-xs text-slate-400">Wind Hill + Rooftop Solar Generation</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
                <span className="text-xs text-slate-400 block mb-1">Wind Ridge Turbines</span>
                <span className="text-2xl font-black text-emerald-400">{stats.greenEnergyMw} MW</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">3 Spinning Turbines</span>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
                <span className="text-xs text-slate-400 block mb-1">Rooftop Solar Arrays</span>
                <span className="text-2xl font-black text-amber-400">450 kW</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Photovoltaic Net-Zero</span>
              </div>
            </div>

            <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-3.5 mb-4 text-xs text-emerald-200 flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                All server workloads are powered entirely by zero-emission clean energy. Surplus wind energy is stored in thermal water tanks for night-time heating.
              </span>
            </div>
          </div>
        )}

        {/* Heat Recycling Tab */}
        {tab === 'heat' && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
                <Flame className="w-7 h-7 fill-orange-400 stroke-none" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">District Heat Recycling</h2>
                <p className="text-xs text-slate-400">Kaukolämpö / Municipal Energy Loop</p>
              </div>
            </div>

            <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700 mb-4 space-y-2.5">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-300">Heat Output Delivered:</span>
                <span className="font-extrabold text-orange-400 text-lg">{stats.heatOutputMwh} MWh / month</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-300">Connected Neighborhood Homes:</span>
                <span className="font-extrabold text-emerald-400 text-lg">{stats.housesHeated} Homes</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-300">Water Supply Temperature:</span>
                <span className="font-extrabold text-amber-300 text-lg">+65 °C</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Instead of dissipating heat into the atmosphere like traditional data centers, high-efficiency liquid cooling loops capture thermal energy from server racks and route it directly through the orange municipal district heating network.
            </p>
          </div>
        )}

        {/* Jobs Tab */}
        {tab === 'jobs' && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400">
                <Users className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">Local Economic Impact</h2>
                <p className="text-xs text-slate-400">+120 Direct & Indirect Sustainable Jobs</p>
              </div>
            </div>

            <div className="space-y-2.5 mb-4">
              <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-white">Cloud Systems & Hardware Engineers</h4>
                  <p className="text-[11px] text-slate-400">Server maintenance, networking & AI cluster operations</p>
                </div>
                <span className="font-extrabold text-emerald-400 text-sm">48 Jobs</span>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-white">Thermal & District Heating Technicians</h4>
                  <p className="text-[11px] text-slate-400">Heat exchangers, pipe pressure, municipal integration</p>
                </div>
                <span className="font-extrabold text-emerald-400 text-sm">34 Jobs</span>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-white">Renewable Energy Specialists</h4>
                  <p className="text-[11px] text-slate-400">Wind turbine diagnostics & grid synchronization</p>
                </div>
                <span className="font-extrabold text-emerald-400 text-sm">38 Jobs</span>
              </div>
            </div>
          </div>
        )}

        {/* Build / Upgrade Actions */}
        {(tab === 'build' || tab === 'upgrade') && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <TrendingUp className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">EcoTown Expansion Projects</h2>
                <p className="text-xs text-slate-400">Invest simulation funds to scale green output</p>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-400" /> Expand Wind Ridge Capacity
                  </h4>
                  <p className="text-xs text-slate-400">+2.5 MW green power (+150 XP)</p>
                </div>
                <button
                  onClick={onUpgradeWind}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl transition-all active:scale-95 flex items-center gap-1 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" /> $ 4,500
                </button>
              </div>

              <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-orange-400" /> Connect More Homes to Heat Grid
                  </h4>
                  <p className="text-xs text-slate-400">+4 Homes heated, +$1,200/mo income</p>
                </div>
                <button
                  onClick={onConnectHouse}
                  className="bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl transition-all active:scale-95 flex items-center gap-1 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" /> $ 3,200
                </button>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl text-sm font-extrabold text-slate-200 transition-colors"
        >
          Close View
        </button>
      </div>
    </div>
  )
}
