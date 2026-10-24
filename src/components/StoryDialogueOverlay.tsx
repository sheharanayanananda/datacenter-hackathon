import React, { useState } from 'react'
import { useGame } from '../context/GameContext'
import { Trees, HardHat, Clock, Users, ArrowRight, Zap, CheckCircle2 } from 'lucide-react'

export const StoryDialogueOverlay: React.FC = () => {
  const { user, character, gameStage, finishStoryDialogue } = useGame()
  const [step, setStep] = useState<'helmi' | 'matti' | 'summary'>('helmi')
  const [selectedResponse, setSelectedResponse] = useState<number | null>(null)

  if (!user || gameStage !== 'CONSTRUCTION_STORY') return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md pointer-events-auto animate-in fade-in duration-300">
      <div className="w-full max-w-xl bg-slate-900 border-2 border-slate-700/80 rounded-3xl shadow-2xl p-6 sm:p-8 text-white relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Story Step 1: Resident Helmi complaining about forest cutting */}
        {step === 'helmi' && (
          <div className="animate-in fade-in duration-200">
            {/* Character Header */}
            <div className="flex items-center gap-4 mb-5">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border-2 border-amber-500/40 flex items-center justify-center text-3xl shadow-lg">
                👩‍🌾
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                  Local Forest Resident
                </span>
                <h3 className="text-xl font-black text-white mt-0.5">Helmi Lindholm</h3>
                <p className="text-xs text-slate-400">Neighborhood Nature & Walking Club</p>
              </div>
            </div>

            {/* Speech Bubble */}
            <div className="bg-slate-800/90 rounded-2xl p-4 sm:p-5 border border-slate-700 mb-5 relative">
              <p className="text-sm text-slate-200 leading-relaxed font-medium">
                "Hei! You just cut down trees right beside our neighborhood jogging trail! Where will the owls go, and what about the constant buzzing from those giant server fans?!"
              </p>
            </div>

            {/* Response choices */}
            <div className="space-y-2 mb-6">
              <button
                type="button"
                onClick={() => setSelectedResponse(0)}
                className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                  selectedResponse === 0
                    ? 'bg-emerald-600/30 border-emerald-400 text-white font-bold'
                    : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-800'
                }`}
              >
                🌲 "We cleared only Lot 1 and preserved 85% of the pine forest. Cold Finnish air cools the servers naturally, keeping fan noise down to 55 dB!"
              </button>
              <button
                type="button"
                onClick={() => setSelectedResponse(1)}
                className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                  selectedResponse === 1
                    ? 'bg-emerald-600/30 border-emerald-400 text-white font-bold'
                    : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-800'
                }`}
              >
                🏡 "I understand your concern, Helmi. The servers will actually heat 350 nearby houses this winter, so your home will stay warmer with zero fossil fuels!"
              </button>
            </div>

            <button
              type="button"
              disabled={selectedResponse === null}
              onClick={() => {
                setSelectedResponse(null)
                setStep('matti')
              }}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-emerald-600/30"
            >
              <span>Address Helmi's Concerns & Visit Building Site</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Story Step 2: Foreman Matti praising local jobs */}
        {step === 'matti' && (
          <div className="animate-in fade-in duration-200">
            {/* Character Header */}
            <div className="flex items-center gap-4 mb-5">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/20 border-2 border-blue-500/40 flex items-center justify-center text-3xl shadow-lg">
                👷‍♂️
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/30">
                  Lead Site Foreman
                </span>
                <h3 className="text-xl font-black text-white mt-0.5">Matti Korhonen</h3>
                <p className="text-xs text-slate-400">Finnish Construction & Electrical Union</p>
              </div>
            </div>

            {/* Speech Bubble */}
            <div className="bg-slate-800/90 rounded-2xl p-4 sm:p-5 border border-slate-700 mb-5">
              <p className="text-sm text-slate-200 leading-relaxed font-medium">
                "Kiitos pormestari! Thanks to this municipal stamp, 125 local builders, electricians, and pipefitters got steady work for over a year. The high-voltage connections are ready, and the heat exchange pipes are laid!"
              </p>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3.5 mb-6 text-xs text-blue-200 flex items-center gap-3">
              <Zap className="w-5 h-5 text-blue-400 shrink-0" />
              <span>
                "125 construction jobs completed on schedule. 20 permanent network and facility technicians are now arriving on site!"
              </span>
            </div>

            <button
              type="button"
              onClick={() => setStep('summary')}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-500 active:scale-98 text-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 cursor-pointer"
            >
              <span>Inspect Finished Construction</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Story Step 3: Construction Elapsed Time Ticker & Commissioning Banner */}
        {step === 'summary' && (
          <div className="animate-in zoom-in-95 duration-200 text-center">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-400/40 mx-auto flex items-center justify-center text-3xl mb-4 shadow-lg shadow-emerald-500/20">
              ⚡
            </div>

            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-500/40 inline-block mb-2">
              Construction Milestone Complete
            </span>

            <h3 className="text-2xl font-black text-white">
              Phase 1 Facility Commissioned!
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              The municipal data center is now officially online and connected to the Finnish power grid and local district heating.
            </p>

            {/* Official Time Ticker Box (matching user prompt requirement) */}
            <div className="my-6 bg-slate-800/90 rounded-2xl p-4 border border-slate-700 grid grid-cols-3 gap-2 text-center">
              <div className="p-2">
                <Clock className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                <div className="text-base font-black text-white">14 Months</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                  Const. Duration
                </div>
              </div>

              <div className="p-2 border-x border-slate-700">
                <Users className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                <div className="text-base font-black text-white">125 Workers</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                  Local Builders
                </div>
              </div>

              <div className="p-2">
                <Zap className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                <div className="text-base font-black text-white">5.0 MW</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                  Online Capacity
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={finishStoryDialogue}
              className="w-full py-3.5 px-4 rounded-xl font-black text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white transition-all shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <span>Enter Municipal Simulation (Level 1)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
