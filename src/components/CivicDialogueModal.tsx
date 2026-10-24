import React, { useState, useEffect } from 'react'
import { useGame } from '../context/GameContext'
import { CIVILIAN_DIALOGUES } from '../data/civilianDialogues'
import { ArrowLeft, ArrowRight, Check, X, Sparkles } from 'lucide-react'

export const CivicDialogueModal: React.FC = () => {
  const { activeCivilianScenarioId, closeCivilianDialogue } = useGame()
  const [currentLineIndex, setCurrentLineIndex] = useState(0)

  // Reset dialogue index whenever a new scenario is triggered
  useEffect(() => {
    if (activeCivilianScenarioId) {
      setCurrentLineIndex(0)
    }
  }, [activeCivilianScenarioId])

  if (!activeCivilianScenarioId) return null

  const scenario = CIVILIAN_DIALOGUES[activeCivilianScenarioId]
  if (!scenario || scenario.lines.length === 0) return null

  const currentLine = scenario.lines[currentLineIndex]
  const isFirstLine = currentLineIndex === 0
  const isLastLine = currentLineIndex >= scenario.lines.length - 1
  const isSkepticSpeaking = currentLine.speaker === 'helmi'

  const handleNext = () => {
    if (isLastLine) {
      closeCivilianDialogue()
    } else {
      setCurrentLineIndex((prev) => prev + 1)
    }
  }

  const handlePrev = () => {
    if (!isFirstLine) {
      setCurrentLineIndex((prev) => prev - 1)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-auto bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-hidden">
      
      {/* LEFT CHARACTER: The Skeptic (Helmi) - Bottom Left */}
      <div
        className={`fixed left-2 sm:left-6 md:left-12 bottom-0 z-10 transition-all duration-300 pointer-events-none select-none ${
          isSkepticSpeaking
            ? 'opacity-100 scale-100 translate-y-0 filter-none'
            : 'opacity-40 scale-95 translate-y-4 brightness-75'
        }`}
      >
        <div className="relative">
          <img
            src="/assets/characters/civilian_skeptic.png"
            alt="Helmi Lindholm"
            className="w-48 sm:w-64 md:w-80 lg:w-96 object-contain drop-shadow-[0_16px_30px_rgba(0,0,0,0.6)]"
          />
          {/* Active Speaking Tag */}
          {isSkepticSpeaking && (
            <div className="absolute top-6 left-6 px-3 py-1 bg-amber-500/90 text-white rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg border border-amber-300 flex items-center gap-1.5 animate-bounce">
              <Sparkles className="w-3 h-3" />
              <span>Speaking</span>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT CHARACTER: The Supporter (Matti) - Bottom Right */}
      <div
        className={`fixed right-2 sm:right-6 md:right-12 bottom-0 z-10 transition-all duration-300 pointer-events-none select-none ${
          !isSkepticSpeaking
            ? 'opacity-100 scale-100 translate-y-0 filter-none'
            : 'opacity-40 scale-95 translate-y-4 brightness-75'
        }`}
      >
        <div className="relative">
          <img
            src="/assets/characters/civilian_supporter.png"
            alt="Matti Korhonen"
            className="w-48 sm:w-64 md:w-80 lg:w-96 object-contain drop-shadow-[0_16px_30px_rgba(0,0,0,0.6)]"
          />
          {/* Active Speaking Tag */}
          {!isSkepticSpeaking && (
            <div className="absolute top-6 right-6 px-3 py-1 bg-emerald-600/90 text-white rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg border border-emerald-300 flex items-center gap-1.5 animate-bounce">
              <Sparkles className="w-3 h-3" />
              <span>Speaking</span>
            </div>
          )}
        </div>
      </div>

      {/* CENTER DIALOGUE BOX (Clash of Clans Speech Bubble) */}
      <div className="relative z-20 w-full max-w-xl mx-4 mb-6 sm:mb-8 font-sans">
        <div className="bg-[#fffdfa] border-3 border-[#d9ba78] border-b-6 border-b-[#b89547] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.55)] p-5 sm:p-6 text-slate-800">
          
          {/* Speaker Header Info */}
          <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-amber-100">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  {currentLine.speakerName}
                </h3>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    isSkepticSpeaking
                      ? 'bg-amber-50 text-amber-900 border-amber-200'
                      : 'bg-emerald-50 text-emerald-900 border-emerald-200'
                  }`}
                >
                  {currentLine.role}
                </span>
              </div>
            </div>

            {/* Step Counter Indicator */}
            <div className="text-[11px] font-black text-amber-800/80 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200">
              {currentLineIndex + 1} / {scenario.lines.length}
            </div>
          </div>

          {/* Simple Clean Dialogue Text */}
          <div className="min-h-[70px] flex items-center py-2 px-1">
            <p className="text-sm sm:text-base font-bold text-slate-800 leading-relaxed">
              "{currentLine.text}"
            </p>
          </div>

          {/* Center-Aligned 3 Control Buttons: Previous - Skip - Next */}
          <div className="flex items-center justify-center gap-2.5 sm:gap-3 pt-3 border-t border-amber-100 mt-2">
            
            {/* 1. Previous Button */}
            <button
              type="button"
              onClick={handlePrev}
              disabled={isFirstLine}
              className="py-2 px-4 rounded-xl font-black text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 border-b-4 active:border-b-2 active:translate-y-[2px] transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed select-none"
            >
              <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Previous</span>
            </button>

            {/* 2. Skip Button */}
            <button
              type="button"
              onClick={closeCivilianDialogue}
              className="py-2 px-4 rounded-xl font-bold text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all flex items-center gap-1 cursor-pointer select-none"
            >
              <X className="w-3.5 h-3.5" />
              <span>Skip</span>
            </button>

            {/* 3. Next / Finish Button */}
            <button
              type="button"
              onClick={handleNext}
              className="py-2 px-5 rounded-xl font-black text-xs text-white bg-emerald-600 hover:bg-emerald-500 border-2 border-emerald-700 border-b-4 active:border-b-2 active:translate-y-[2px] transition-all flex items-center gap-1.5 cursor-pointer shadow-md select-none"
            >
              {isLastLine ? (
                <>
                  <span>Finish</span>
                  <Check className="w-4 h-4 stroke-[3]" />
                </>
              ) : (
                <>
                  <span>Next</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </>
              )}
            </button>

          </div>
        </div>
      </div>
    </div>
  )
}
