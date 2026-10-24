import React, { useState } from 'react'
import { useGame } from '../context/GameContext'
import { ShieldCheck, User, Lock, Mail, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react'

export const AuthModal: React.FC = () => {
  const { user, signIn, signUp, signInAsGuest } = useGame()
  const [isSignUp, setIsSignUp] = useState(false)
  const [identifier, setIdentifier] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('Municipal Climate Director')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Don't render if already logged in
  if (user) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (isSignUp) {
        if (!identifier || !email || !password) {
          throw new Error('Please fill in all required fields.')
        }
        await signUp(identifier, email, password, role)
      } else {
        if (!identifier || !password) {
          throw new Error('Please enter your username and password.')
        }
        await signIn(identifier, password)
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check credentials.')
    } finally {
      setLoading(false)
    }
  }

  const handleGuest = async () => {
    setError(null)
    setLoading(true)
    try {
      await signInAsGuest()
    } catch (err: any) {
      setError(err.message || 'Failed to start guest session.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md pointer-events-auto animate-in fade-in duration-300">
      {/* Background ambient light */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/95 border-2 border-slate-700/80 rounded-3xl shadow-2xl p-6 sm:p-8 text-white relative overflow-hidden">
        {/* Top Finnish Municipal Emblem */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-3 border border-emerald-400/40">
            <span className="text-3xl">🇫🇮</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            Tampereen Seutu
          </h2>
          <p className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mt-0.5">
            Municipal Planning & Microgrid Portal
          </p>
          <p className="text-xs text-slate-400 mt-1.5 max-w-xs">
            Sign in to direct Tampere’s green data center and district heating transition.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-slate-800/80 rounded-2xl border border-slate-700/60 mb-6">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(false)
              setError(null)
            }}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              !isSignUp ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(true)
              setError(null)
            }}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              isSignUp ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-semibold animate-in shake">
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
              Username {isSignUp ? '' : 'or Email'}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={isSignUp ? 'e.g. tampere_planner' : 'Username or email'}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl py-2.5 pl-10 pr-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>
          </div>

          {isSignUp && (
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                Official Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@tampere.fi"
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl py-2.5 pl-10 pr-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl py-2.5 pl-10 pr-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>
          </div>

          {isSignUp && (
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                Municipal Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all"
              >
                <option value="Municipal Climate Director">Municipal Climate Director</option>
                <option value="Energy & Infrastructure Lead">Energy & Infrastructure Lead</option>
                <option value="Urban Planning Commissioner">Urban Planning Commissioner</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-xl font-black text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-[0.98] shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-block animate-spin">⏳</span>
            ) : (
              <>
                <span>{isSignUp ? 'Create Official Profile' : 'Sign In to Council'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Evaluator Quick Access Divider */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-700/80" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-slate-900 px-3 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              Hackathon & Evaluator Access
            </span>
          </div>
        </div>

        {/* Quick Guest Mayor Button */}
        <button
          type="button"
          onClick={handleGuest}
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Enter as Guest Mayor (Instant One-Click Demo)</span>
        </button>
      </div>
    </div>
  )
}
