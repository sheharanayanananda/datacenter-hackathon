import React from 'react'
import { useGame } from '../context/GameContext'
import { CHARACTERS } from '../data/characters'
import { User, Sparkles, Check, ArrowRight } from 'lucide-react'

export const CharacterSelectModal: React.FC = () => {
  const { user, gameStage, selectCharacter } = useGame()

  if (!user || gameStage !== 'CHARACTER_SELECT') return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md pointer-events-auto animate-in fade-in duration-300">
      <div className="w-full max-w-4xl bg-slate-900/95 border-2 border-slate-700/80 rounded-3xl shadow-2xl p-6 sm:p-8 text-white relative overflow-hidden flex flex-col items-center">
        {/* Glow */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center max-w-xl mb-8">
          <span className="bg-emerald-500/20 text-emerald-300 text-xs font-black px-3 py-1 rounded-full border border-emerald-500/40 uppercase tracking-widest inline-block mb-2">
            Step 1 of 3 • Youth Municipality Council
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Choose Your Youth Municipal Lead
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Finland empowers youth climate leaders to guide municipal decisions. Select the teenager who will champion Tampere’s data center project!
          </p>
        </div>

        {/* 3 Character Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
          {CHARACTERS.map((char) => {
            const isEmerald = char.color === 'emerald'
            const isSky = char.color === 'sky'

            return (
              <div
                key={char.id}
                onClick={() => selectCharacter(char.id)}
                className={`group relative rounded-2xl p-5 border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isEmerald
                    ? 'bg-slate-800/80 hover:bg-slate-800 border-emerald-500/40 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/20'
                    : isSky
                    ? 'bg-slate-800/80 hover:bg-slate-800 border-sky-500/40 hover:border-sky-400 hover:shadow-lg hover:shadow-sky-500/20'
                    : 'bg-slate-800/80 hover:bg-slate-800 border-amber-500/40 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/20'
                }`}
              >
                <div>
                  {/* Top Avatar badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-slate-700/80 border border-slate-600 flex items-center justify-center text-3xl shadow-inner group-hover:scale-105 transition-transform">
                      {char.avatar}
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-700/60 text-slate-300 border border-slate-600">
                      Age {char.age}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md inline-block mb-1.5 ${
                      isEmerald
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : isSky
                        ? 'bg-sky-500/20 text-sky-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {char.tag}
                  </span>

                  <h3 className="text-lg font-black text-white group-hover:text-emerald-300 transition-colors">
                    {char.name}
                  </h3>
                  <p className="text-xs font-semibold text-slate-400 mb-3">{char.title}</p>

                  <p className="text-xs text-slate-300 leading-relaxed mb-4">{char.bio}</p>

                  {/* Character Quote */}
                  <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-700/60 mb-4">
                    <p className="text-[11px] italic text-slate-400 leading-snug">
                      "{char.quote}"
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="w-full py-2.5 px-3 rounded-xl font-bold text-xs bg-slate-700 group-hover:bg-emerald-600 text-white transition-all flex items-center justify-center gap-1.5 shadow-sm"
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
