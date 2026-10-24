import React from 'react'
import { useGame } from '../context/GameContext'
import { CHARACTERS } from '../data/characters'
import { CharacterProfile } from '../types/game'
import {
  Sparkles,
  Building2,
  Trees,
  ArrowRight,
  GraduationCap,
} from 'lucide-react'

export const CharacterSelectModal: React.FC = () => {
  const { user, gameStage, selectCharacter } = useGame()

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

        {/* 3 Active Age Group Cards: Young, Adult, Senior */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          {CHARACTERS.map((char) => {
            const Icon = getTrackIcon(char.avatar)
            const isYoung = char.id === 'young'
            const isAdult = char.id === 'adult'

            // Color scheme per track
            const cardBorder = isYoung
              ? 'bg-white hover:bg-emerald-50/40 border-emerald-300 border-b-emerald-500 hover:border-emerald-400'
              : isAdult
              ? 'bg-white hover:bg-sky-50/40 border-sky-300 border-b-sky-500 hover:border-sky-400'
              : 'bg-white hover:bg-amber-50/40 border-amber-300 border-b-amber-500 hover:border-amber-400'

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

            const buttonStyle = isYoung
              ? 'bg-emerald-500 hover:bg-emerald-400 text-white border-emerald-700'
              : isAdult
              ? 'bg-sky-500 hover:bg-sky-400 text-white border-sky-700'
              : 'bg-amber-500 hover:bg-amber-400 text-white border-amber-700'

            return (
              <div
                key={char.id}
                onClick={() => handleCardClick(char)}
                className={`group relative rounded-2xl p-5 border-2 border-b-4 transition-all duration-150 cursor-pointer flex flex-col justify-between select-none active:border-b-2 active:translate-y-[2px] shadow-sm ${cardBorder}`}
              >
                <div>
                  {/* Top Status */}
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 shadow-xs ${iconBg}`}
                    >
                      <Icon className="w-5 h-5 stroke-[2.5]" />
                    </div>
                  </div>

                  {/* Role Title */}
                  <div className="mb-2">
                    <span
                      className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md inline-block mb-1 ${tagStyle}`}
                    >
                      {char.tag}
                    </span>
                    <h3 className="text-lg font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {char.name}
                    </h3>
                    <p className="text-[11px] font-bold text-slate-500">{char.title}</p>
                  </div>

                  {/* Bio */}
                  <p className="text-xs text-slate-600 leading-relaxed mb-3 font-medium">
                    {char.bio}
                  </p>

                  {/* Learning Focus Quote */}
                  <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200/80 mb-4 shadow-2xs">
                    <p className="text-[11px] italic text-slate-600 font-medium leading-snug">
                      "{char.quote}"
                    </p>
                  </div>
                </div>

                {/* Duolingo Action Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCardClick(char)
                  }}
                  className={`w-full py-2.5 px-3 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer border-b-3 active:border-b-0 active:translate-y-0.5 shadow-sm ${buttonStyle}`}
                >
                  <span>Select {char.name} Track</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
