import React, { useState } from 'react'
import { useGame } from '../context/GameContext'
import { Check, Award, Scale, Sparkles } from 'lucide-react'

export const PermitStampModal: React.FC = () => {
  const { user, gameStage, signPermit } = useGame()
  const [isStamped, setIsStamped] = useState(false)
  const [stamping, setStamping] = useState(false)

  if (!user || gameStage !== 'PERMIT_STAMP') return null

  // Capitalize user's actual username or format Guest Mayor
  const rawName = user.username.trim()
  const displayName = rawName.toLowerCase() === 'guest_mayor'
    ? 'Guest Mayor'
    : rawName
    ? rawName.charAt(0).toUpperCase() + rawName.slice(1)
    : 'Municipal Official'

  const handleStamp = async () => {
    if (stamping || isStamped) return
    setStamping(true)
    setIsStamped(true)

    setTimeout(async () => {
      await signPermit()
      setStamping(false)
    }, 1500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm pointer-events-auto animate-in fade-in duration-300">
      <div className="w-full max-w-2xl bg-white text-slate-800 rounded-[28px] shadow-2xl p-6 sm:p-8 relative overflow-hidden border-2 border-slate-200 border-b-6 font-sans">
        {/* Header - Official Master Permit Identity */}
        <div className="text-center border-b-2 border-slate-100 pb-4 mb-4">
          <div className="inline-flex items-center gap-1.5 bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <Scale className="w-3.5 h-3.5 text-emerald-700" />
            <span>Tampereen kaupunki • Kaupunkiympäristö (City of Tampere)</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Municipal Master Permit Decision § 42
          </h2>
          <p className="text-xs font-semibold text-emerald-800 mt-0.5">
            Official Master Authorization for Datacenter Complex
          </p>
          <div className="text-[11px] text-slate-400 font-medium mt-1 flex items-center justify-center gap-2">
            <span>Finnish Building Act (Rakentamislaki)</span>
            <span>•</span>
            <span>Master Ref: <span>TRE-ECOTOWN-2026</span></span>
          </div>
        </div>

        {/* Plain English Mission Statement for Young Players */}
        <div className="space-y-3 text-xs text-slate-700 leading-relaxed mb-5 font-normal">
          <p className="text-slate-700">
            As Tampere’s Chief Building Inspector,{' '}
            <span className="text-slate-900 font-bold underline decoration-emerald-500 underline-offset-2">
              {displayName}
            </span>
            , you are officially approving the{' '}
            <span className="text-emerald-800 font-semibold">
              Datacenter Complex
            </span>
            . Under Finnish law, our city authorizes this complete zero-emission master plan to ensure every
            server powers green digital technology while warming homes and protecting nature:
          </p>

          {/* 4 Clean Visual Master Plan Commitments with Concrete Numeric Approvals */}
          <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 space-y-2 text-xs">
            <div className="flex justify-between border-b border-slate-200/70 pb-1.5 gap-4">
              <span className="font-medium text-slate-600 flex items-center gap-1.5 shrink-0">
                Clean Energy Campus:
              </span>
              <span className="text-slate-800 text-right font-medium">
                5–120 MW capacity, 3 wind turbines & solar microgrid
              </span>
            </div>
            <div className="flex justify-between border-b border-slate-200/70 pb-1.5 gap-4">
              <span className="font-medium text-slate-600 flex items-center gap-1.5 shrink-0">
                Citywide Heat Sharing:
              </span>
              <span className="text-emerald-700 text-right font-medium">
                4.5–90 MW waste heat piped into city homes
              </span>
            </div>
            <div className="flex justify-between border-b border-slate-200/70 pb-1.5 gap-4">
              <span className="font-medium text-slate-600 flex items-center gap-1.5 shrink-0">
                Natural Cold-Air Cooling:
              </span>
              <span className="text-slate-800 text-right font-medium">
                Free Arctic air cooling, 55 dB noise cap
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="font-medium text-slate-600 flex items-center gap-1.5 shrink-0">
                Forest Preservation:
              </span>
              <span className="text-slate-800 text-right font-medium">
                18.5 acres (85%) pine forest kept untouched
              </span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 italic text-center">
            Authorizes site preparation, forest protection, and construction of the zero-emission campus.
          </p>
        </div>

        {/* Approving Official Signature Block & Interactive Stamp Action */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t-2 border-slate-100">
          <div className="text-left">
            <p className="text-[9px] uppercase font-black tracking-wider text-slate-400">
              Approving Authority
            </p>
            <p className="text-base font-black text-slate-950 mt-0.5">
              {displayName}
            </p>
            <p className="text-[11px] text-emerald-800 font-extrabold">
              Chief Building Inspector (Johtava rakennustarkastaja)
            </p>
            <p className="text-[10px] text-slate-500 font-semibold">
              Building Control Department, City of Tampere
            </p>
          </div>

          {/* Duolingo-Styled Physical Stamp Action */}
          <div>
            {!isStamped ? (
              <button
                type="button"
                onClick={handleStamp}
                className="px-7 py-3.5 duo-btn-red text-white font-black text-xs rounded-2xl shadow-xl flex items-center gap-2 cursor-pointer transition-all select-none animate-bounce uppercase tracking-widest"
              >
                <Award className="w-5 h-5 stroke-[3]" />
                <span>Stamp & Approve Project</span>
              </button>
            ) : (
              <div className="px-5 py-2.5 border-4 border-red-600 rounded-2xl text-red-600 font-black tracking-widest uppercase transform -rotate-2 shadow-md bg-red-50 animate-in zoom-in-75 duration-200 flex flex-col items-center select-none">
                <div className="text-[8px] tracking-widest text-red-800 font-black">TAMPEREEN KAUPUNKI • RAKENNUSVALVONTA</div>
                <div className="text-sm font-black flex items-center gap-1.5 my-0.5">
                  <Check className="w-4 h-4 stroke-[3]" /> MASTER PROJECT APPROVED
                </div>
                <div className="text-[8px] text-red-700 font-bold">
                  DECISION § 42/2026 • {new Date().toLocaleDateString('en-GB')} • FULL CAMPUS PERMIT
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
