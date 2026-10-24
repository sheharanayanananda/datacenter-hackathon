import { User, GameSave } from '../types/game'

const TOKEN_KEY = 'ecotown_jwt_token'

let inMemoryToken: string | null = null

export const getStoredToken = (): string | null => {
  return inMemoryToken || localStorage.getItem(TOKEN_KEY)
}

export const setStoredToken = (token: string | null, persist: boolean = true) => {
  inMemoryToken = token
  if (token && persist) {
    localStorage.setItem(TOKEN_KEY, token)
  } else {
    localStorage.removeItem(TOKEN_KEY)
  }
}

const getHeaders = () => {
  const token = getStoredToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}

export const api = {
  auth: {
    signUp: async (username: string, email: string, password: string, role?: string): Promise<{ token: string; user: User; save: GameSave }> => {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, role }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to sign up')
      setStoredToken(data.token, true)
      return data
    },

    signIn: async (identifier: string, password: string): Promise<{ token: string; user: User; save: GameSave }> => {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to sign in')
      setStoredToken(data.token, true)
      return data
    },

    guest: async (): Promise<{ token: string; user: User; save: GameSave }> => {
      const res = await fetch('/api/auth/guest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to start guest session')
      setStoredToken(data.token, false) // Ephemeral session in memory only; never saved to localStorage
      return data
    },

    getMe: async (): Promise<{ user: User; save: GameSave }> => {
      const res = await fetch('/api/auth/me', {
        method: 'GET',
        headers: getHeaders(),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to fetch user')
      return data
    },

    signOut: () => {
      setStoredToken(null)
    },
  },

  game: {
    getSave: async (): Promise<{ save: GameSave }> => {
      const res = await fetch('/api/game/save', {
        method: 'GET',
        headers: getHeaders(),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to fetch save')
      return data
    },

    updateSave: async (updateData: Partial<GameSave> & { addedPlaytimeSeconds?: number }): Promise<{ success: boolean; save: GameSave }> => {
      const res = await fetch('/api/game/save', {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updateData),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to update save')
      return data
    },

    resetSave: async (): Promise<{ success: boolean; save: GameSave }> => {
      const res = await fetch('/api/game/reset', {
        method: 'POST',
        headers: getHeaders(),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to reset save')
      return data
    },
  },
}
