import React, { useState } from 'react'
import { useGame } from '../context/GameContext'
import { Building2, User, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react'

export const AuthModal: React.FC = () => {
  const { user, signIn, signUp, signInAsGuest } = useGame()
  const [isSignUp, setIsSignUp] = useState(false)
  const [identifier, setIdentifier] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

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
        await signUp(identifier, email, password)
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm pointer-events-auto animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-white border-4 border-white rounded-[32px] shadow-2xl p-6 sm:p-8 text-slate-800 relative overflow-hidden">
        {/* Header Badge */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md mb-3">
            <Building2 className="w-7 h-7 stroke-[2.5]" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
            Datacenter Simulator
          </h2>
        </div>

        {/* Tab Switcher - Duolingo Segmented Style */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-100 rounded-2xl mb-5 gap-1.5 border-2 border-slate-200">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(false)
              setError(null)
            }}
            className={`py-2.5 text-xs font-black rounded-xl transition-all cursor-pointer ${
              !isSignUp
                ? 'bg-white text-slate-900 border-2 border-slate-200 border-b-4 border-b-slate-300 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
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
            className={`py-2.5 text-xs font-black rounded-xl transition-all cursor-pointer ${
              isSignUp
                ? 'bg-white text-slate-900 border-2 border-slate-200 border-b-4 border-b-slate-300 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-50 border-2 border-rose-200 border-b-4 border-b-rose-300 text-rose-700 text-xs font-black flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-[11px] font-black text-slate-600 uppercase tracking-wider mb-1">
              Username {isSignUp ? '' : 'or Email'}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={isSignUp ? 'e.g. city_mayor' : 'Username or email'}
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-2.5 pl-10 pr-3.5 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100 transition-all"
              />
            </div>
          </div>

          {isSignUp && (
            <div>
              <label className="block text-[11px] font-black text-slate-600 uppercase tracking-wider mb-1">
                Official Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="mayor@tampere.fi"
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-2.5 pl-10 pr-3.5 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100 transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-black text-slate-600 uppercase tracking-wider mb-1">
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
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-2.5 pl-10 pr-3.5 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100 transition-all"
              />
            </div>
          </div>

          {/* Duolingo 3D Primary Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-8 py-3 px-4 rounded-2xl font-black text-xs text-white duo-btn-green flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50 uppercase tracking-wider select-none"
          >
            {loading ? (
              <span>Loading...</span>
            ) : (
              <>
                <span>{isSignUp ? 'Create Official Profile' : 'Sign In to Council'}</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </>
            )}
          </button>
        </form>

        {/* Demo Mode Text Link */}
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={handleGuest}
            disabled={loading}
            className="text-xs font-black text-slate-400 hover:text-emerald-700 underline underline-offset-4 decoration-slate-300 hover:decoration-emerald-500 transition-colors cursor-pointer disabled:opacity-50 uppercase tracking-wider"
          >
            Enter Demo Mode
          </button>
        </div>
      </div>
    </div>
  )
}
