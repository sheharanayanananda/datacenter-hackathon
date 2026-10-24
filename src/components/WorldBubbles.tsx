import React from 'react'
import { Html } from '@react-three/drei'
import {
  Building2,
  Home,
  Wind,
  Sun,
  Waves,
  Zap,
  Flame,
  Users,
  Coins,
  ShieldCheck,
  Droplets,
  RotateCcw,
  BatteryCharging,
  Check,
  X,
  ArrowRight,
  TrendingUp,
} from 'lucide-react'
import { LEVEL_STATS } from '../data/impacts'
import { DataCenterLevel } from '../types/game'

export type InspectedWorldObject = 'datacenter' | 'houses' | 'wind' | 'solar' | 'lake' | null

interface WorldBubblesProps {
  inspectedObject: InspectedWorldObject;
  onClose: () => void;
  onOpenSevenEffects: () => void;
  level: DataCenterLevel;
}

export const WorldBubbles: React.FC<WorldBubblesProps> = ({
  inspectedObject,
  onClose,
  onOpenSevenEffects,
  level,
}) => {
  const stats = LEVEL_STATS[level]

  return (
    <group>
      {/* 1. DATA CENTER BUBBLE */}
      {inspectedObject === 'datacenter' && (
        <Html
          position={[10.8, 3.4, -5.1]}
          center
          distanceFactor={11}
          zIndexRange={[100, 0]}
        >
          <div className="relative pointer-events-auto select-none transition-transform duration-200 animate-in zoom-in-95">
            <div className="w-[310px] bg-white rounded-3xl shadow-2xl border-4 border-white p-3.5 text-slate-800 relative z-10">
              {/* Header Banner */}
              <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                    <Building2 className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 leading-tight">
                      Data Center Facility
                    </h3>
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">
                      Level {level} {level === 3 ? '(Completed)' : 'Online'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 3 Main Stat Cards */}
              <div className="grid grid-cols-3 gap-1.5 mb-2.5">
                <div className="flex flex-col items-center justify-center p-2 rounded-2xl bg-amber-50 border border-amber-200/80 text-center">
                  <div className="w-7 h-7 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center mb-1 shadow-sm">
                    <Zap className="w-4 h-4 fill-amber-950 stroke-none" />
                  </div>
                  <span className="font-black text-xs text-amber-950">
                    {stats.powerCapacityMw} MW
                  </span>
                  <span className="text-[9px] font-bold text-amber-800">
                    Clean Power
                  </span>
                </div>

                <div className="flex flex-col items-center justify-center p-2 rounded-2xl bg-orange-50 border border-orange-200/80 text-center">
                  <div className="w-7 h-7 rounded-full bg-orange-500 text-white flex items-center justify-center mb-1 shadow-sm">
                    <Flame className="w-4 h-4 fill-white stroke-none" />
                  </div>
                  <span className="font-black text-xs text-orange-950">
                    {stats.wasteHeatMw}
                  </span>
                  <span className="text-[9px] font-bold text-orange-800">
                    Waste Heat
                  </span>
                </div>

                <div className="flex flex-col items-center justify-center p-2 rounded-2xl bg-blue-50 border border-blue-200/80 text-center">
                  <div className="w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center mb-1 shadow-sm">
                    <Users className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <span className="font-black text-xs text-blue-950">
                    {stats.permanentStaff} Jobs
                  </span>
                  <span className="text-[9px] font-bold text-blue-800">
                    Local Staff
                  </span>
                </div>
              </div>

              {/* Floating Pill & Action Button */}
              <div className="space-y-1.5">
                <div className="py-1 px-3 rounded-full text-[11px] font-extrabold flex items-center justify-center gap-1.5 bg-emerald-600 text-white shadow-sm">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>District Heating: Warming {stats.homesHeatedDistrict}</span>
                </div>

                <button
                  onClick={onOpenSevenEffects}
                  className="w-full py-2.5 px-3 rounded-2xl text-[11px] font-black text-white duo-btn-green transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm uppercase tracking-wider select-none"
                >
                  <span>Explore All 7 City Effects</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                </button>
              </div>
            </div>

            {/* Pointer Tail */}
            <div className="w-0 h-0 border-t-[14px] border-t-white border-r-[14px] border-r-transparent border-l-[14px] border-l-transparent absolute -bottom-3 left-10 shadow-sm filter drop-shadow-md z-10" />
          </div>
        </Html>
      )}

      {/* 2. NORDIC HOUSES BUBBLE */}
      {inspectedObject === 'houses' && (
        <Html
          position={[-10.0, 3.2, 4.5]}
          center
          distanceFactor={11}
          zIndexRange={[100, 0]}
        >
          <div className="relative pointer-events-auto select-none transition-transform duration-200 animate-in zoom-in-95">
            <div className="w-[300px] bg-white rounded-3xl shadow-2xl border-4 border-white p-3.5 text-slate-800 relative z-10">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                    <Home className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 leading-tight">
                      District Heated Homes
                    </h3>
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">
                      Residential Microgrid
                    </span>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-1.5 text-xs text-slate-700 mb-2.5">
                <div className="flex items-center gap-2 bg-emerald-50 p-2 rounded-xl border border-emerald-100">
                  <Flame className="w-4 h-4 text-orange-500 shrink-0" />
                  <span className="font-bold text-emerald-950">
                    Heating Source: 100% Data Center Waste Heat
                  </span>
                </div>
                <div className="flex items-center justify-between px-2 py-1 bg-slate-50 rounded-lg text-[11px]">
                  <span className="text-slate-500">Connected Homes:</span>
                  <span className="font-black text-slate-900">{stats.homesHeatedDistrict}</span>
                </div>
                <div className="flex items-center justify-between px-2 py-1 bg-slate-50 rounded-lg text-[11px]">
                  <span className="text-slate-500">Fossil Fuel Use:</span>
                  <span className="font-black text-emerald-600">Zero Emissions</span>
                </div>
              </div>

              <div className="py-1 px-3 rounded-full text-[11px] font-extrabold flex items-center justify-center gap-1.5 bg-emerald-600 text-white shadow-sm">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Indoor Temperature: +21°C Constant</span>
              </div>
            </div>

            <div className="w-0 h-0 border-t-[14px] border-t-white border-r-[14px] border-r-transparent border-l-[14px] border-l-transparent absolute -bottom-3 left-10 shadow-sm filter drop-shadow-md z-10" />
          </div>
        </Html>
      )}

      {/* 3. WIND TURBINES BUBBLE */}
      {inspectedObject === 'wind' && (
        <Html
          position={[14.0, 6.2, 11.5]}
          center
          distanceFactor={11}
          zIndexRange={[100, 0]}
        >
          <div className="relative pointer-events-auto select-none transition-transform duration-200 animate-in zoom-in-95">
            <div className="w-[290px] bg-white rounded-3xl shadow-2xl border-4 border-white p-3.5 text-slate-800 relative z-10">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-sm">
                    <Wind className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 leading-tight">
                      South Ridge Wind Farm
                    </h3>
                    <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider block">
                      Renewable Generation
                    </span>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-1.5 text-xs text-slate-700 mb-2.5">
                <div className="flex items-center justify-between px-2 py-1.5 bg-sky-50 rounded-xl text-[11px] border border-sky-100">
                  <span className="text-slate-600 flex items-center gap-1.5">
                    <RotateCcw className="w-3.5 h-3.5 text-sky-600" /> Active Turbines:
                  </span>
                  <span className="font-black text-sky-950">
                    {level === 1 ? '1 Turbine' : level === 2 ? '2 Turbines' : '3 Turbines (Full)'}
                  </span>
                </div>
                <div className="flex items-center justify-between px-2 py-1.5 bg-slate-50 rounded-xl text-[11px]">
                  <span className="text-slate-600 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-500" /> Clean Output:
                  </span>
                  <span className="font-black text-slate-900">
                    {level === 1 ? '3.5 MW' : level === 2 ? '8.5 MW' : '14.5 MW Peak'}
                  </span>
                </div>
              </div>

              <div className="py-1 px-3 rounded-full text-[11px] font-extrabold flex items-center justify-center gap-1.5 bg-sky-600 text-white shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Zero Carbon Energy Offset</span>
              </div>
            </div>

            <div className="w-0 h-0 border-t-[14px] border-t-white border-r-[14px] border-r-transparent border-l-[14px] border-l-transparent absolute -bottom-3 left-10 shadow-sm filter drop-shadow-md z-10" />
          </div>
        </Html>
      )}

      {/* 4. SOLAR FARM BUBBLE */}
      {inspectedObject === 'solar' && (
        <Html
          position={[3.2, 2.5, -8.5]}
          center
          distanceFactor={11}
          zIndexRange={[100, 0]}
        >
          <div className="relative pointer-events-auto select-none transition-transform duration-200 animate-in zoom-in-95">
            <div className="w-[290px] bg-white rounded-3xl shadow-2xl border-4 border-white p-3.5 text-slate-800 relative z-10">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-sm">
                    <Sun className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 leading-tight">
                      Subarctic Solar Array
                    </h3>
                    <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">
                      Photovoltaic Microgrid
                    </span>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-1.5 text-xs text-slate-700 mb-2.5">
                <div className="flex items-center justify-between px-2 py-1.5 bg-amber-50 rounded-xl text-[11px] border border-amber-100">
                  <span className="text-slate-600 flex items-center gap-1.5">
                    <Sun className="w-3.5 h-3.5 text-amber-500" /> Active Panels:
                  </span>
                  <span className="font-black text-amber-950">
                    {level === 1 ? 'None (Planned)' : level === 2 ? '6 Groups' : '12 Groups (Full)'}
                  </span>
                </div>
                <div className="flex items-center justify-between px-2 py-1.5 bg-slate-50 rounded-xl text-[11px]">
                  <span className="text-slate-600 flex items-center gap-1.5">
                    <BatteryCharging className="w-3.5 h-3.5 text-emerald-500" /> Battery Storage:
                  </span>
                  <span className="font-black text-slate-900">94% Charged</span>
                </div>
              </div>

              <div className="py-1 px-3 rounded-full text-[11px] font-extrabold flex items-center justify-center gap-1.5 bg-amber-500 text-slate-950 shadow-sm">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Peak Load Shaving Active</span>
              </div>
            </div>

            <div className="w-0 h-0 border-t-[14px] border-t-white border-r-[14px] border-r-transparent border-l-[14px] border-l-transparent absolute -bottom-3 left-10 shadow-sm filter drop-shadow-md z-10" />
          </div>
        </Html>
      )}

      {/* 5. LAKE NÄSIJÄRVI BUBBLE */}
      {inspectedObject === 'lake' && (
        <Html
          position={[-14.0, 2.0, -16.0]}
          center
          distanceFactor={11}
          zIndexRange={[100, 0]}
        >
          <div className="relative pointer-events-auto select-none transition-transform duration-200 animate-in zoom-in-95">
            <div className="w-[300px] bg-white rounded-3xl shadow-2xl border-4 border-white p-3.5 text-slate-800 relative z-10">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center shadow-sm">
                    <Waves className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 leading-tight">
                      Lake Näsijärvi Natural Cooling
                    </h3>
                    <span className="text-[10px] font-bold text-cyan-600 uppercase tracking-wider block">
                      Subarctic Free Cooling
                    </span>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-1.5 text-xs text-slate-700 mb-2.5">
                <div className="flex items-center justify-between px-2 py-1.5 bg-cyan-50 rounded-xl text-[11px] border border-cyan-100">
                  <span className="text-slate-600 flex items-center gap-1.5">
                    <Droplets className="w-3.5 h-3.5 text-cyan-500" /> Deep Water Temp:
                  </span>
                  <span className="font-black text-cyan-950">+4°C Constant</span>
                </div>
                <div className="flex items-center justify-between px-2 py-1.5 bg-slate-50 rounded-xl text-[11px]">
                  <span className="text-slate-600 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-500" /> Cooling Bill Reduction:
                  </span>
                  <span className="font-black text-emerald-600">-50% Power Savings</span>
                </div>
                <div className="flex items-center justify-between px-2 py-1.5 bg-slate-50 rounded-xl text-[11px]">
                  <span className="text-slate-600 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-500" /> Eco Protection:
                  </span>
                  <span className="font-black text-slate-900">Closed-Loop (Zero Pollution)</span>
                </div>
              </div>

              <div className="py-1 px-3 rounded-full text-[11px] font-extrabold flex items-center justify-center gap-1.5 bg-cyan-600 text-white shadow-sm">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Subarctic Natural Free Cooling Online</span>
              </div>
            </div>

            <div className="w-0 h-0 border-t-[14px] border-t-white border-r-[14px] border-r-transparent border-l-[14px] border-l-transparent absolute -bottom-3 left-10 shadow-sm filter drop-shadow-md z-10" />
          </div>
        </Html>
      )}
    </group>
  )
}
