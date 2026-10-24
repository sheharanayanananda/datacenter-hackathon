import React, { useState } from 'react'
import { useGame } from '../context/GameContext'
import { Trees, HardHat, Clock, Users, Zap, ArrowRight, Check, AlertCircle } from 'lucide-react'

export const StoryDialogueOverlay: React.FC = () => {
  const { user, character, gameStage, finishStoryDialogue } = useGame()
  const [step, setStep] = useState<'helmi' | 'matti' | 'summary'>('helmi')
  const [selectedResponse, setSelectedResponse] = useState<number | null>(null)

  if (!user || gameStage !== 'CONSTRUCTION_STORY') return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm pointer-events-auto animate-in fade-in duration-300">
      <div className="w-full max-w-xl bg-white border-4 border-white rounded-[32px] shadow-2xl p-6 sm:p-8 text-slate-800 relative overflow-hidden">
        {/* Step 1: Resident Helmi */}
        {step === 'helmi' && (
          <div className="animate-in fade-in duration-200">
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-13 h-13 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-amber-800 shadow-sm">
                <Trees className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                  Forest Resident
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-0.5">Helmi Lindholm</h3>
                <p className="text-xs text-slate-500 font-medium">Neighborhood Nature & Walking Club</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-4">
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-semibold">
                "Hello! You just cut down trees right beside our neighborhood jogging trail! Where will the owls go, and what about the constant humming from those giant server fans?!"
              </p>
            </div>

            {/* Response choices */}
            <div className="space-y-2 mb-5">
              <button
                type="button"
                onClick={() => setSelectedResponse(0)}
                className={`w-full text-left p-3 rounded-2xl border-2 text-xs font-bold transition-all cursor-pointer ${
                  selectedResponse === 0
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-950'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                "We cleared only Lot 1 and preserved 85% of the surrounding pine forest. Free Nordic cold air cools the servers naturally, keeping fan noise down to 55 dB!"
              </button>
              <button
                type="button"
                onClick={() => setSelectedResponse(1)}
                className={`w-full text-left p-3 rounded-2xl border-2 text-xs font-bold transition-all cursor-pointer ${
                  selectedResponse === 1
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-950'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                "I hear your concerns, Helmi. The data center will heat 350 nearby houses this winter, so your home will stay warmer with zero fossil fuels!"
              </button>
            </div>

            <button
              type="button"
              disabled={selectedResponse === null}
              onClick={() => {
                setSelectedResponse(null)
                setStep('matti')
              }}
              className="w-full py-2.5 px-4 rounded-2xl font-black text-xs text-white bg-emerald-600 hover:bg-emerald-500 border-b-4 border-emerald-800 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-md cursor-pointer"
            >
              <span>Address Helmi's Concerns & Visit Site</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: Foreman Matti */}
        {step === 'matti' && (
          <div className="animate-in fade-in duration-200">
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-13 h-13 rounded-2xl bg-blue-100 border-2 border-blue-300 flex items-center justify-center text-blue-800 shadow-sm">
                <HardHat className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full">
                  Lead Construction Foreman
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-0.5">Matti Korhonen</h3>
                <p className="text-xs text-slate-500 font-medium">Regional Builders & Electricians Union</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-4">
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-semibold">
                "Thank you Mayor! Thanks to this municipal permit, 125 local builders, electricians, and technicians got steady work for over a year. The high-voltage lines are connected, and the district heating pipes are laid!"
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3 mb-5 text-xs text-blue-900 font-bold flex items-center gap-2.5">
              <Zap className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                "125 construction jobs completed on schedule. 20 permanent server technicians are now arriving on site!"
              </span>
            </div>

            <button
              type="button"
              onClick={() => setStep('summary')}
              className="w-full py-2.5 px-4 rounded-2xl font-black text-xs text-white bg-blue-600 hover:bg-blue-500 border-b-4 border-blue-800 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <span>Inspect Finished Construction</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 3: Construction Elapsed Time Ticker Banner */}
        {step === 'summary' && (
          <div className="animate-in zoom-in-95 duration-200 text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white mx-auto flex items-center justify-center mb-3 shadow-md">
              <Zap className="w-7 h-7 stroke-[2.5]" />
            </div>

            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest inline-block mb-1.5">
              Construction Milestone Complete
            </span>

            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              Phase 1 Facility Commissioned!
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5 max-w-sm mx-auto">
              The municipal data center is now officially online and supplying green district warmth to local homes.
            </p>

            {/* Official Time Ticker Box */}
            <div className="my-5 bg-slate-50 rounded-2xl p-3.5 border border-slate-200 grid grid-cols-3 gap-2 text-center">
              <div className="p-1">
                <Clock className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                <div className="text-sm font-black text-slate-900">14 Months</div>
                <div className="text-[9px] text-slate-500 uppercase tracking-wider font-bold">
                  Duration
                </div>
              </div>

              <div className="p-1 border-x border-slate-200">
                <Users className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                <div className="text-sm font-black text-slate-900">125 Workers</div>
                <div className="text-[9px] text-slate-500 uppercase tracking-wider font-bold">
                  Local Builders
                </div>
              </div>

              <div className="p-1">
                <Zap className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
                <div className="text-sm font-black text-slate-900">5.0 MW</div>
                <div className="text-[9px] text-slate-500 uppercase tracking-wider font-bold">
                  Online Load
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={finishStoryDialogue}
              className="w-full py-3 px-4 rounded-2xl font-black text-xs text-white bg-emerald-600 hover:bg-emerald-500 border-b-4 border-emerald-800 active:border-b-0 active:translate-y-1 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Enter City Simulation (Level 1)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
