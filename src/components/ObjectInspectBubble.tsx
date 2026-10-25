import React from 'react'
import { Html } from '@react-three/drei'
import {
  X,
  Zap,
  Flame,
  ShieldCheck,
  Truck,
  Trees,
  BatteryCharging,
  Gauge,
  Coins,
  Cpu,
  Building2,
  Home,
  Sun,
  Wind,
  Compass,
  ArrowRight,
  Waves,
  Droplets,
  Mountain,
} from 'lucide-react'
import { InspectableObjectData } from '../data/inspectableObjects'

interface ObjectInspectBubbleProps {
  data: InspectableObjectData;
  onClose: () => void;
  onExploreImpact?: (impactKey: string) => void;
}

export const ObjectInspectBubble: React.FC<ObjectInspectBubbleProps> = ({
  data,
  onClose,
  onExploreImpact,
}) => {
  const getCategoryDetails = () => {
    switch (data.category) {
      case 'datacenter':
        return {
          icon: <Building2 className="w-4 h-4 text-emerald-600" />,
          bgColor: 'bg-emerald-100',
          borderColor: 'border-emerald-300',
        }
      case 'house':
        return {
          icon: <Home className="w-4 h-4 text-amber-600" />,
          bgColor: 'bg-amber-100',
          borderColor: 'border-amber-300',
        }
      case 'carpark':
        return {
          icon: <BatteryCharging className="w-4 h-4 text-sky-600" />,
          bgColor: 'bg-sky-100',
          borderColor: 'border-sky-300',
        }
      case 'forest':
        return {
          icon: <Trees className="w-4 h-4 text-emerald-600" />,
          bgColor: 'bg-emerald-100',
          borderColor: 'border-emerald-300',
        }
      case 'road':
        return {
          icon: <Truck className="w-4 h-4 text-purple-600" />,
          bgColor: 'bg-purple-100',
          borderColor: 'border-purple-300',
        }
      case 'wind':
        return {
          icon: <Wind className="w-4 h-4 text-teal-600" />,
          bgColor: 'bg-teal-100',
          borderColor: 'border-teal-300',
        }
      case 'solar':
        return {
          icon: <Sun className="w-4 h-4 text-amber-600" />,
          bgColor: 'bg-amber-100',
          borderColor: 'border-amber-300',
        }
      case 'tower':
        return {
          icon: <Compass className="w-4 h-4 text-blue-600" />,
          bgColor: 'bg-blue-100',
          borderColor: 'border-blue-300',
        }
      case 'rock':
        return {
          icon: <Mountain className="w-4 h-4 text-slate-600" />,
          bgColor: 'bg-slate-100',
          borderColor: 'border-slate-300',
        }
      case 'lake':
      default:
        return {
          icon: <Waves className="w-4 h-4 text-sky-600" />,
          bgColor: 'bg-sky-100',
          borderColor: 'border-sky-300',
        }
    }
  }

  const getImpactKeyForCategory = (): string => {
    switch (data.category) {
      case 'datacenter':
      case 'house':
        return 'surroundings' // Heat Giveaway
      case 'wind':
      case 'solar':
        return 'energy' // Green Energy
      case 'carpark':
      case 'road':
        return 'transport' // Smart Logistics
      case 'lake':
      case 'forest':
      case 'rock':
        return 'land_use' // Pine Forest & Environmental Preservation
      case 'tower':
      default:
        return 'future' // Tampere Vision
    }
  }

  const categoryStyle = getCategoryDetails()

  return (
    <Html
      position={data.position}
      center
      zIndexRange={[100, 0]}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative select-none pointer-events-auto -translate-y-[calc(50%+14px)] animate-in zoom-in-95 fade-in duration-150"
      >
        {/* Main Floating Tooltip Card - Compact, Snackable Duolingo Card */}
        <div className={`${data.stats && data.stats.length > 0 ? 'w-72 sm:w-76' : 'w-56 sm:w-60'} bg-white border-2 border-slate-200 border-b-[4px] border-b-slate-300 rounded-2xl shadow-xl p-3 text-slate-800 relative`}>
          {/* Header Row */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 min-w-0">
              <div
                className={`w-8 h-8 rounded-xl ${categoryStyle.bgColor} border-2 border-b-[3px] ${categoryStyle.borderColor} flex items-center justify-center shrink-0 shadow-2xs`}
              >
                {categoryStyle.icon}
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-black text-slate-900 tracking-tight truncate">
                  {data.title}
                </h4>
              </div>
            </div>

            {/* Chunky Round Close Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onClose()
              }}
              className="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-90 border border-slate-200 text-slate-400 hover:text-slate-600 transition-all flex items-center justify-center cursor-pointer shrink-0"
              title="Close inspector"
            >
              <X className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>

          {/* 3-Stat Metric Row for items that have stats */}
          {data.stats && data.stats.length > 0 ? (
            <div className="grid grid-cols-3 gap-1 mb-2.5 divide-x divide-slate-100">
              {data.stats.map((stat, idx) => (
                <div
                  key={`stat-${idx}`}
                  className="py-1 px-1 flex flex-col items-center text-center"
                >
                  <span className="text-[11px] font-black text-slate-900 leading-tight">
                    {stat.value}
                  </span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tight truncate w-full mt-0.5">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            /* Simple text description for basic elements like rocks */
            <p className="text-xs text-slate-500 font-medium leading-relaxed my-1">
              {data.description || data.ecoHighlight || 'Naturally occurring landscape feature.'}
            </p>
          )}

          {/* Action Button: Compact Duolingo 3D Button that opens the rich impact window */}
          {data.hasDetails !== false && onExploreImpact && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onExploreImpact(getImpactKeyForCategory())
              }}
              className="w-full py-1.5 px-3 rounded-xl bg-[#58cc02] hover:bg-[#61e002] active:bg-[#58cc02] text-white font-black text-[11px] uppercase tracking-wider border-2 border-[#46a302] border-b-[3px] active:border-b active:translate-y-0.5 transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>View Full Details</span>
              <ArrowRight className="w-3 h-3 stroke-[3]" />
            </button>
          )}

          {/* Downward Pointer Arrow Tail pointing right to the 3D object */}
          <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-3.5 h-3.5 bg-white border-r-2 border-b-2 border-slate-300 rotate-45 transform pointer-events-none" />
        </div>
      </div>
    </Html>
  )
}
