import React from 'react'
import { useGame } from '../context/GameContext'
import { CHARACTERS } from '../data/characters'
import { Leaf, Zap, Trees, ArrowRight, Award } from 'lucide-react'

export const CharacterSelectModal: React.FC = () => {
  const { user, gameStage, selectCharacter } = useGame()

  if (!user || gameStage !== 'CHARACTER_SELECT') return null

  const getCharacterIcon = (iconName: string) => {
    switch (iconName) {
      case 'Leaf': return Leaf
      case 'Zap': return Zap
      default: return Trees
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm pointer-events-auto animate-in fade-in duration-300">
      <div className="w-full max-w-4xl bg-white border-4 border-white rounded-[32px] shadow-2xl p-6 sm:p-8 text-slate-800 relative overflow-hidden flex flex-col items-center">
        <div className="text-center max-w-xl mb-6">
          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest inline-block mb-1.5">
            Step 1 of 3 • Youth City Council
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Choose Your Youth Municipal Planner
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Finland empowers youth climate leaders to guide municipal zoning. Select the leader who will champion Tampere’s data center project!
          </p>
        </div>

        {/* 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          {CHARACTERS.map((char) => {
            const Icon = getCharacterIcon(char.avatar)
            const isEmerald = char.color === 'emerald'
            const isSky = char.color === 'sky'

            return (
              <div
                key={char.id}
                onClick={() => selectCharacter(char.id)}
                className={`group relative rounded-3xl p-5 border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isEmerald
                    ? 'bg-emerald-50/50 hover:bg-emerald-50 border-emerald-300 hover:border-emerald-500 hover:shadow-lg'
                    : isSky
                    ? 'bg-sky-50/50 hover:bg-sky-50 border-sky-300 hover:border-sky-500 hover:shadow-lg'
                    : 'bg-amber-50/50 hover:bg-amber-50 border-amber-300 hover:border-amber-500 hover:shadow-lg'
                }`}
              >
                <div>
                  {/* Top Avatar badge */}
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform ${
                        isEmerald
                          ? 'bg-emerald-500 text-white'
                          : isSky
                          ? 'bg-sky-500 text-white'
                          : 'bg-amber-500 text-white'
                      }`}
                    >
                      <Icon className="w-6 h-6 stroke-[2.5]" />
                    </div>
                    <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-white text-slate-600 border border-slate-200 shadow-sm">
                      Age {char.age}
                    </span>
                  </div>

                  <span
                    className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md inline-block mb-1 ${
                      isEmerald
                        ? 'bg-emerald-100 text-emerald-800'
                        : isSky
                        ? 'bg-sky-100 text-sky-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {char.tag}
                  </span>

                  <h3 className="text-base font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {char.name}
                  </h3>
                  <p className="text-[11px] font-bold text-slate-500 mb-2">{char.title}</p>

                  <p className="text-xs text-slate-600 leading-relaxed mb-3 font-medium">
                    {char.bio}
                  </p>

                  {/* Quote */}
                  <div className="bg-white rounded-xl p-2.5 border border-slate-200/80 mb-4 shadow-sm">
                    <p className="text-[11px] italic text-slate-600 font-medium leading-snug">
                      "{char.quote}"
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className={`w-full py-2 px-3 rounded-xl font-black text-xs text-white transition-all flex items-center justify-center gap-1.5 shadow-sm border-b-2 active:border-b-0 active:translate-y-0.5 ${
                    isEmerald
                      ? 'bg-emerald-600 hover:bg-emerald-500 border-emerald-800'
                      : isSky
                      ? 'bg-sky-600 hover:bg-sky-500 border-sky-800'
                      : 'bg-amber-600 hover:bg-amber-500 border-amber-800'
                  }`}
                >
                  <span>Select {char.name.split(' ')[0]}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
