import React from 'react'
import { X, Zap, Server, Users, TrendingUp, Plus, ShieldCheck, Home } from 'lucide-react'
import { CityStats, InspectionTab, HouseInfo } from '../types'

interface ModalDetailsProps {
  tab: InspectionTab | 'build' | 'upgrade' | null;
  selectedHouse: HouseInfo | null;
  stats: CityStats;
  onClose: () => void;
  onUpgradeWind: () => void;
  onUpgradeSolar: () => void;
  onExpandServers: () => void;
}

export const ModalDetails: React.FC<ModalDetailsProps> = ({
  tab,
  selectedHouse,
  stats,
  onClose,
  onUpgradeWind,
  onUpgradeSolar,
  onExpandServers,
}) => {
  if (!tab && !selectedHouse) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm pointer-events-auto animate-in fade-in duration-200">
      <div className="bg-white border-4 border-white w-full max-w-lg rounded-[32px] shadow-2xl p-6 text-slate-800 relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4 stroke-[2.5]" />
        </button>

        {/* Selected House Inspection View */}
        {selectedHouse && !tab && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-sm">
                <Home className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900">{selectedHouse.name}</h2>
                <p className="text-xs text-slate-500 font-medium">Nordic Residential District Sector 2</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 mb-4 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 font-medium">Power Source:</span>
                <span className="font-black text-emerald-700 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 fill-emerald-600 stroke-none" /> 100% Wind & Solar Microgrid
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 font-medium">Energy Efficiency:</span>
                <span className="font-black text-sky-700">Class A+ Net Zero</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 font-medium">District Heating:</span>
                <span className="font-black text-emerald-700">Connected to Data Center Heat Pipes</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-medium mb-4">
              Modern Nordic eco-residence powered directly by the local zero-emission wind and solar microgrid.
            </p>
          </div>
        )}

        {/* Overview / Computing Tab */}
        {tab === 'overview' && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center shadow-sm">
                <Server className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900">Zero-Emission Computing</h2>
                <p className="text-xs text-slate-500 font-medium">Modern Sustainable Cloud Infrastructure</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <span className="text-[11px] text-slate-500 font-bold block mb-1">Compute Capacity</span>
                <span className="text-xl font-black text-sky-700">{stats.computingPowerPflops} PFLOPS</span>
                <span className="text-[10px] text-slate-400 font-medium block mt-0.5">AI & Cloud Workloads</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <span className="text-[11px] text-slate-500 font-bold block mb-1">PUE Rating</span>
                <span className="text-xl font-black text-emerald-700">1.08</span>
                <span className="text-[10px] text-slate-400 font-medium block mt-0.5">Ultra High Efficiency</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-medium mb-4">
              Equipped with high-density server racks and energy-efficient operations, this facility delivers green cloud computing powered by 100% renewable energy.
            </p>
          </div>
        )}

        {/* Energy Tab */}
        {tab === 'energy' && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shadow-sm">
                <Zap className="w-6 h-6 fill-amber-500 stroke-none" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900">100% Renewable Power</h2>
                <p className="text-xs text-slate-500 font-medium">Wind Turbines + Subarctic Solar Microgrid</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <span className="text-[11px] text-slate-500 font-bold block mb-1">Wind Ridge Turbines</span>
                <span className="text-xl font-black text-emerald-700">{stats.greenEnergyMw} MW</span>
                <span className="text-[10px] text-slate-400 font-medium block mt-0.5">Spinning Clean Generation</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <span className="text-[11px] text-slate-500 font-bold block mb-1">Solar Panel Arrays</span>
                <span className="text-xl font-black text-amber-700">Active Array</span>
                <span className="text-[10px] text-slate-400 font-medium block mt-0.5">Photovoltaic Buffer</span>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 mb-4 text-xs text-emerald-950 font-bold flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                All server workloads are powered entirely by zero-emission clean energy from dedicated wind and solar arrays.
              </span>
            </div>
          </div>
        )}

        {/* Jobs Tab */}
        {tab === 'jobs' && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center shadow-sm">
                <Users className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900">Local Economic Impact</h2>
                <p className="text-xs text-slate-500 font-medium">Direct & Indirect Sustainable Employment</p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-slate-900">Cloud Systems & Hardware Engineers</h4>
                  <p className="text-[10px] text-slate-500">Server maintenance, networking & AI cluster operations</p>
                </div>
                <span className="font-black text-emerald-700 text-xs">Direct Jobs</span>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-slate-900">Facility & Heat Exchange Technicians</h4>
                  <p className="text-[10px] text-slate-500">District heat distribution & cooling pump monitoring</p>
                </div>
                <span className="font-black text-emerald-700 text-xs">Direct Jobs</span>
              </div>
            </div>
          </div>
        )}

        {/* Build / Upgrade Tab */}
        {(tab === 'build' || tab === 'upgrade') && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shadow-sm">
                <TrendingUp className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900">EcoTown Expansion Projects</h2>
                <p className="text-xs text-slate-500 font-medium">Invest simulation funds to scale green output</p>
              </div>
            </div>

            <div className="space-y-2.5 mb-4">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-500" /> Expand Wind Ridge Capacity
                  </h4>
                  <p className="text-[10px] text-slate-500">+2.5 MW green power</p>
                </div>
                <button
                  onClick={onUpgradeWind}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-3 py-1.5 rounded-xl transition-all active:scale-95 flex items-center gap-1 shadow-sm cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> $ 4,500
                </button>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5 text-sky-500" /> Expand Cloud Server Capacity
                  </h4>
                  <p className="text-[10px] text-slate-500">+15 PFLOPS compute</p>
                </div>
                <button
                  onClick={onExpandServers}
                  className="bg-sky-600 hover:bg-sky-500 text-white font-black text-xs px-3 py-1.5 rounded-xl transition-all active:scale-95 flex items-center gap-1 shadow-sm cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> $ 3,200
                </button>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-black transition-colors cursor-pointer"
        >
          Close View
        </button>
      </div>
    </div>
  )
}
