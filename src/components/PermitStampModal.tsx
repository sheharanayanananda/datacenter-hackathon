import React, { useState } from 'react'
import { useGame } from '../context/GameContext'
import { FileText, CheckCircle2, Award, Zap, Shield, Sparkles } from 'lucide-react'

export const PermitStampModal: React.FC = () => {
  const { user, character, gameStage, signPermit } = useGame()
  const [isStamped, setIsStamped] = useState(false)
  const [stamping, setStamping] = useState(false)

  if (!user || gameStage !== 'PERMIT_STAMP') return null

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md pointer-events-auto animate-in fade-in duration-300">
      <div className="w-full max-w-2xl bg-[#fdfbf7] text-slate-800 rounded-3xl shadow-2xl p-6 sm:p-10 relative overflow-hidden border-8 border-amber-950/10 font-serif">
        {/* Decorative corner notches */}
        <div className="absolute top-2 left-2 text-amber-800/20 text-xs font-mono">FI-TRE-2026-DC1</div>
        <div className="absolute top-2 right-2 text-amber-800/20 text-xs font-mono">KUNTA.TAMPERE.FI</div>

        {/* Header */}
        <div className="text-center border-b-2 border-slate-300 pb-5 mb-6">
          <div className="flex items-center justify-center gap-2 mb-1.5">
            <span className="text-2xl">🏛️</span>
            <span className="text-xs font-black tracking-widest text-emerald-800 uppercase font-sans">
              Tampereen Seudun Kaupunginvaltuusto
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Kaavoitus- ja Rakennuslupapäätös #2026/FI
          </h2>
          <p className="text-xs text-slate-600 font-sans mt-1">
            Official Municipal Zoning & Environmental Permit for Phase 1 Data Center Facility
          </p>
        </div>

        {/* Document Body */}
        <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed font-sans mb-8">
          <p>
            Pursuant to the Finnish Land Use and Building Act (<em>Maankäyttö- ja rakennuslaki</em>), the Youth Climate Council representative{' '}
            <strong className="text-emerald-900 font-bold underline">
              {character?.name || 'Aino Virtanen'}
            </strong>{' '}
            hereby submits the final resolution regarding the proposed data center campus:
          </p>

          <div className="bg-amber-50/80 rounded-2xl p-4 border border-amber-200/80 space-y-2 text-xs">
            <div className="flex justify-between border-b border-amber-200/60 pb-1.5">
              <span className="font-semibold text-slate-600">Initial Municipal Investment:</span>
              <span className="font-black text-slate-900">€50,000,000 (Phase 1)</span>
            </div>
            <div className="flex justify-between border-b border-amber-200/60 pb-1.5">
              <span className="font-semibold text-slate-600">Power Allocation & Grid Load:</span>
              <span className="font-black text-slate-900">5.0 MW (Cold-air cooling enabled)</span>
            </div>
            <div className="flex justify-between border-b border-amber-200/60 pb-1.5">
              <span className="font-semibold text-slate-600">Local Employment Guarantee:</span>
              <span className="font-black text-slate-900">125 Construction Workers • 20 Permanent Jobs</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-slate-600">District Waste Heat Commitment:</span>
              <span className="font-black text-emerald-700">4.5 MW redirected to heat 350 local homes</span>
            </div>
          </div>

          <p className="text-xs text-slate-500 italic">
            "By stamping this document, the municipality authorizes site preparation, tree clearance on Lot 1, and immediate foundation pouring."
          </p>
        </div>

        {/* Stamp Area */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4 border-t border-slate-200 font-sans">
          {/* Signee signature */}
          <div className="text-left">
            <p className="text-[10px] uppercase font-bold text-slate-400">Youth Municipal Planner</p>
            <p className="text-base font-black text-slate-900 font-serif italic mt-0.5">
              {character?.name || 'Aino Virtanen'}
            </p>
            <p className="text-[11px] text-emerald-700 font-semibold">{character?.title}</p>
          </div>

          {/* Interactive Stamp Action */}
          <div className="relative">
            {!isStamped ? (
              <button
                type="button"
                onClick={handleStamp}
                className="group relative px-6 py-3.5 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 active:scale-95 text-white font-black text-sm rounded-2xl shadow-xl shadow-red-600/30 border-2 border-red-500 flex items-center gap-2 cursor-pointer transition-all animate-bounce"
              >
                <span className="text-xl">🔴</span>
                <span>STAMP APPROVAL (LEIMAA)</span>
              </button>
            ) : (
              /* Stamped seal animation */
              <div className="relative px-6 py-3 border-4 border-red-700 rounded-2xl text-red-700 font-black tracking-widest uppercase transform -rotate-6 shadow-md bg-red-100/40 animate-in zoom-in-75 duration-200 flex flex-col items-center">
                <div className="text-[10px] tracking-widest text-red-800">TAMPEREEN KAUPUNKI</div>
                <div className="text-xl font-black flex items-center gap-1.5">
                  <span>★</span> HYVÄKSYTTY <span>★</span>
                </div>
                <div className="text-[10px] text-red-600 font-mono">APPROVED • {new Date().toLocaleDateString('fi-FI')}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
