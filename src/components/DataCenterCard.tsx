import React from 'react'
import { Html } from '@react-three/drei'
import { Check, Zap, Flame, Users } from 'lucide-react'
import { InspectionTab } from '../types'

interface DataCenterCardProps {
  onOpenDetails: (tab: InspectionTab) => void;
  heatActive: boolean;
  onToggleHeat: () => void;
}

export const DataCenterCard: React.FC<DataCenterCardProps> = ({
  onOpenDetails,
  heatActive,
  onToggleHeat,
}) => {
  return (
    <Html
      position={[0.8, 2.5, 0.4]}
      center
      distanceFactor={11}
      zIndexRange={[100, 0]}
    >
      <div className="relative pointer-events-auto select-none transition-transform duration-200 hover:scale-105">
        {/* Main Card Bubble */}
        <div className="w-[305px] bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border-4 border-white/80 p-3 text-slate-800 relative z-10">
          {/* Header Row */}
          <div className="flex items-center justify-between gap-1.5 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              {/* Checkmark circle */}
              <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
              <div className="leading-tight">
                <h3 className="font-extrabold text-[15px] tracking-wide text-slate-800">
                  DATA CENTER
                </h3>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block -mt-0.5">
                  (DATAKESKUS)
                </span>
              </div>
            </div>

            {/* Mascot and +120 Jobs pill */}
            <div className="flex items-center gap-1">
              <div className="bg-emerald-600 text-white text-[11px] font-extrabold px-2 py-0.5 rounded-full shadow-sm">
                +120 Jobs
              </div>
              {/* Cute smiling gear/cloud mascot */}
              <div className="w-8 h-8 rounded-full bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center text-base shadow-sm animate-bounce">
                ⚙️
              </div>
            </div>
          </div>

          {/* Three Feature Cards */}
          <div className="grid grid-cols-3 gap-1.5 py-2.5">
            {/* 1. Energy */}
            <button
              onClick={() => onOpenDetails('energy')}
              className="group flex flex-col items-center justify-center p-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200/60 transition-all active:scale-95 text-center"
            >
              <div className="w-8 h-8 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center shadow-sm mb-1 group-hover:scale-110 transition-transform">
                <Zap className="w-5 h-5 fill-amber-950 stroke-none" />
              </div>
              <span className="font-extrabold text-[11px] text-amber-900 leading-tight">
                Energy
              </span>
            </button>

            {/* 2. Heat Recycling */}
            <button
              onClick={() => onOpenDetails('heat')}
              className="group flex flex-col items-center justify-center p-2 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200/60 transition-all active:scale-95 text-center"
            >
              <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-sm mb-1 group-hover:scale-110 transition-transform">
                <Flame className="w-5 h-5 fill-white stroke-none" />
              </div>
              <span className="font-extrabold text-[11px] text-orange-950 leading-tight">
                Heat Recycling
              </span>
            </button>

            {/* 3. Local Jobs */}
            <button
              onClick={() => onOpenDetails('jobs')}
              className="group flex flex-col items-center justify-center p-2 rounded-xl bg-amber-50/70 hover:bg-amber-100/70 border border-amber-200/40 transition-all active:scale-95 text-center"
            >
              <div className="w-8 h-8 rounded-full bg-[#fde047] text-amber-900 flex items-center justify-center shadow-sm mb-1 group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="font-extrabold text-[11px] text-amber-950 leading-tight">
                Local Jobs
              </span>
            </button>
          </div>

          {/* Bottom Status Pill */}
          <div className="flex items-center justify-center pt-1">
            <button
              onClick={onToggleHeat}
              className={`w-full py-1 px-3 rounded-full text-[12px] font-extrabold flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                heatActive
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/30'
                  : 'bg-slate-400 hover:bg-slate-500 text-white'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${heatActive ? 'bg-emerald-300 animate-ping' : 'bg-slate-200'}`} />
              <span>{heatActive ? 'Heat Reuse: Active' : 'Heat Reuse: Paused'}</span>
            </button>
          </div>
        </div>

        {/* Speech Bubble Pointer Tail (Pointing towards Data Center) */}
        <div className="w-0 h-0 border-t-[14px] border-t-white border-r-[14px] border-r-transparent border-l-[14px] border-l-transparent absolute -bottom-3 left-8 shadow-sm filter drop-shadow-md z-10" />

        {/* Interactive Hand Cursor Indicator pointing down */}
        <div className="absolute -bottom-8 left-2 animate-bounce pointer-events-none drop-shadow-lg">
          <svg
            className="w-8 h-8 text-white fill-white stroke-slate-900 stroke-[1.5]"
            viewBox="0 0 24 24"
          >
            <path d="M7 11V5.5a1.5 1.5 0 0 1 3 0V10M10 10V4.5a1.5 1.5 0 0 1 3 0V10M13 10V5.5a1.5 1.5 0 0 1 3 0V11M16 11V7.5a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6H9a6 6 0 0 1-6-6v-2a1.5 1.5 0 0 1 2.5-1.1L7 13.5V11z" />
          </svg>
        </div>
      </div>
    </Html>
  )
}
