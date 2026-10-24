import React, { useState } from 'react'
import { useGame } from '../context/GameContext'
import { Building2, Check, Award, FileText } from 'lucide-react'

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm pointer-events-auto animate-in fade-in duration-300">
      <div className="w-full max-w-2xl bg-white text-slate-800 rounded-[32px] shadow-2xl p-6 sm:p-9 relative overflow-hidden border-4 border-white font-sans">
        {/* Header */}
        <div className="text-center border-b-2 border-slate-100 pb-4 mb-5">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <span className="text-xs font-black tracking-widest text-emerald-800 uppercase">
              Tampere Regional City Council
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Zoning & Building Permit #2026/FI
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Official Municipal Authorization for Phase 1 Data Center Facility
          </p>
        </div>

        {/* Body */}
        <div className="space-y-3.5 text-xs text-slate-700 leading-relaxed mb-6 font-medium">
          <p>
            Pursuant to the Finnish Land Use and Building Act, Youth Municipal Representative{' '}
            <strong className="text-emerald-800 font-black underline">
              {character?.name || 'Aino Virtanen'}
            </strong>{' '}
            hereby submits the official approval for the data center campus:
          </p>

          <div className="bg-amber-50 rounded-2xl p-3.5 border border-amber-200/80 space-y-2 text-xs">
            <div className="flex justify-between border-b border-amber-200/60 pb-1.5">
              <span className="font-bold text-slate-600">Initial Municipal Investment:</span>
              <span className="font-black text-slate-900">€50,000,000 (Phase 1)</span>
            </div>
            <div className="flex justify-between border-b border-amber-200/60 pb-1.5">
              <span className="font-bold text-slate-600">Power Allocation & Grid Load:</span>
              <span className="font-black text-slate-900">5.0 MW (Cold-air cooling enabled)</span>
            </div>
            <div className="flex justify-between border-b border-amber-200/60 pb-1.5">
              <span className="font-bold text-slate-600">Local Employment Guarantee:</span>
              <span className="font-black text-slate-900">125 Construction Workers • 20 Permanent Jobs</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold text-slate-600">District Waste Heat Commitment:</span>
              <span className="font-black text-emerald-700">4.5 MW redirected to warm 350 local homes</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 italic">
            "By stamping this document, the municipality authorizes site preparation, tree clearance on Lot 1, and foundation construction."
          </p>
        </div>

        {/* Stamp Area */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <div className="text-left">
            <p className="text-[10px] uppercase font-bold text-slate-400">Youth Municipal Planner</p>
            <p className="text-base font-black text-slate-900 italic mt-0.5">
              {character?.name || 'Aino Virtanen'}
            </p>
            <p className="text-[11px] text-emerald-700 font-bold">{character?.title}</p>
          </div>

          {/* Interactive Stamp Action */}
          <div>
            {!isStamped ? (
              <button
                type="button"
                onClick={handleStamp}
                className="px-6 py-3 bg-red-600 hover:bg-red-500 border-b-4 border-red-800 active:border-b-0 active:translate-y-1 text-white font-black text-xs rounded-2xl shadow-lg flex items-center gap-2 cursor-pointer transition-all animate-bounce"
              >
                <Award className="w-4 h-4" />
                <span>STAMP APPROVAL</span>
              </button>
            ) : (
              <div className="px-5 py-2.5 border-4 border-red-600 rounded-2xl text-red-600 font-black tracking-widest uppercase transform -rotate-3 shadow-md bg-red-50 animate-in zoom-in-75 duration-200 flex flex-col items-center">
                <div className="text-[9px] tracking-widest text-red-800 font-black">TAMPERE CITY COUNCIL</div>
                <div className="text-base font-black flex items-center gap-1.5">
                  <Check className="w-4 h-4 stroke-[3]" /> APPROVED
                </div>
                <div className="text-[9px] text-red-700 font-semibold">{new Date().toLocaleDateString('en-US')}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
