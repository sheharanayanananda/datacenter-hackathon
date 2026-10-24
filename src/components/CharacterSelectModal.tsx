import React, { useState } from 'react'
import { useGame } from '../context/GameContext'
import { CHARACTERS } from '../data/characters'
import { CharacterProfile } from '../types/game'
import {
  Sparkles,
  Building2,
  Trees,
  ArrowRight,
  GraduationCap,
  Clock,
  CheckCircle,
} from 'lucide-react'

export const CharacterSelectModal: React.FC = () => {
  const { user, gameStage, selectCharacter } = useGame()
  const [comingSoonChar, setComingSoonChar] = useState<CharacterProfile | null>(null)

  if (!user || gameStage !== 'CHARACTER_SELECT') return null

  const getTrackIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return Sparkles
      case 'Building2':
        return Building2
      default:
        return Trees
    }
  }

  const handleCardClick = (char: CharacterProfile) => {
    if (!char.isPlayable) {
      setComingSoonChar(char)
      return
    }
    selectCharacter(char.id)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm pointer-events-auto animate-in fade-in duration-300">
      <div className="w-full max-w-4xl bg-white border-2 border-slate-200 border-b-6 rounded-[28px] shadow-2xl p-6 sm:p-8 text-slate-800 relative overflow-hidden flex flex-col items-center">
        {/* Header */}
        <div className="text-center max-w-xl mb-6">
          <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <GraduationCap className="w-3.5 h-3.5" />
            Adaptive Learning System
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Choose Your Learning Track
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
            Datacenter Simulator is designed to teach data centers and database persistence to all audiences.
            Select your track to calibrate the learning complexity!
          </p>
        </div>

        {/* 3 Active Age Group Cards: Young, Adult, Senior (All looking active for demo presentation) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          {CHARACTERS.map((char) => {
            const Icon = getTrackIcon(char.avatar)
            const isYoung = char.id === 'young'
            const isAdult = char.id === 'adult'

            // Visually active color scheme per track for the demo presentation
            const cardBorder = isYoung
              ? 'bg-white hover:bg-emerald-50/40 border-emerald-300 border-b-emerald-500 hover:border-emerald-400 cursor-pointer active:border-b-2 active:translate-y-[2px]'
              : isAdult
              ? 'bg-white hover:bg-sky-50/40 border-sky-300 border-b-sky-500 hover:border-sky-400 cursor-pointer active:border-b-2 active:translate-y-[2px]'
              : 'bg-white hover:bg-amber-50/40 border-amber-300 border-b-amber-500 hover:border-amber-400 cursor-pointer active:border-b-2 active:translate-y-[2px]'

            const iconBg = isYoung
              ? 'bg-emerald-500 text-white'
              : isAdult
              ? 'bg-sky-500 text-white'
              : 'bg-amber-500 text-white'

            const tagStyle = isYoung
              ? 'bg-emerald-100 text-emerald-800'
              : isAdult
              ? 'bg-sky-100 text-sky-800'
              : 'bg-amber-100 text-amber-800'

            const buttonClass = isYoung
              ? 'duo-btn-green'
              : isAdult
              ? 'duo-btn-blue'
              : 'duo-btn-amber'

            return (
              <div
                key={char.id}
                onClick={() => handleCardClick(char)}
                className={`group relative rounded-3xl p-5 border-2 border-b-6 transition-all duration-150 flex flex-col justify-between select-none shadow-sm cursor-pointer hover:-translate-y-1 ${cardBorder}`}
              >
                <div>
                  {/* Top Status */}
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 shadow-xs border-2 border-white ${iconBg}`}
                    >
                      <Icon className="w-6 h-6 stroke-[2.5]" />
                    </div>

                    {isYoung && (
                      <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border border-emerald-300 shadow-xs">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        Recommended
                      </span>
                    )}
                  </div>

                  {/* Role Title */}
                  <div className="mb-2">
                    <span
                      className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg inline-block mb-1 ${tagStyle}`}
                    >
                      {char.tag}
                    </span>
                    <h3 className="text-lg font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {char.name}
                    </h3>
                    <p className="text-xs font-bold text-slate-500">{char.title}</p>
                  </div>

                  {/* Bio */}
                  <p className="text-xs text-slate-600 leading-relaxed mb-3 font-medium">
                    {char.bio}
                  </p>

                  {/* Learning Focus Quote - Duolingo Speech Bubble */}
                  <div className="bg-slate-100 rounded-2xl p-3 border-2 border-slate-200 mb-4 relative">
                    <p className="text-[11px] italic text-slate-700 font-bold leading-snug">
                      "{char.quote}"
                    </p>
                  </div>
                </div>

                {/* Duolingo 3D Action Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCardClick(char)
                  }}
                  className={`w-full py-3 px-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${buttonClass}`}
                >
                  <span>Select {char.name} Track</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </button>
              </div>
            )
          })}
        </div>

        {/* Coming Soon Modal (Appears when clicking Adult or Senior) */}
        {comingSoonChar && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-white border-2 border-slate-200 border-b-6 rounded-[32px] shadow-2xl p-6 sm:p-7 text-slate-800 flex flex-col items-center text-center relative animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3.5 shadow-xs border-2 border-amber-300">
                <Clock className="w-8 h-8 stroke-[2.5]" />
              </div>

              <h3 className="text-xl font-black text-slate-900">
                {comingSoonChar.name} Track Coming Soon!
              </h3>
              <p className="text-xs font-semibold text-slate-500 mt-2 mb-5 leading-relaxed max-w-xs">
                {comingSoonChar.name} mode is tailored for advanced gameplay with full budget balancing. Please continue with the Young Track for now!
              </p>

              <button
                type="button"
                onClick={() => setComingSoonChar(null)}
                className="w-full py-3 px-4 rounded-2xl font-black text-xs text-white duo-btn-green cursor-pointer uppercase tracking-wider select-none"
              >
                Got It!
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
