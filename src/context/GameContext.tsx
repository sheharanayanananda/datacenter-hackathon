import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { User, GameSave, GameStage, DataCenterLevel, CharacterProfile, ImpactDimensionKey } from '../types/game'
import { api, getStoredToken } from '../services/api'
import { CHARACTERS } from '../data/characters'
import { LEVEL_STATS } from '../data/impacts'

interface GameContextType {
  user: User | null;
  save: GameSave | null;
  loading: boolean;
  gameStage: GameStage;
  level: DataCenterLevel;
  character: CharacterProfile | null;
  money: number;
  xp: number;
  xpNeeded: number;
  activeImpactKey: ImpactDimensionKey | null;
  isUpgradeModalOpen: boolean;
  isSevenImpactsOpen: boolean;
  activeCivilianScenarioId: string | null;
  
  // Actions
  signIn: (identifier: string, pass: string) => Promise<void>;
  signUp: (username: string, email: string, pass: string, role?: string) => Promise<void>;
  signInAsGuest: () => Promise<void>;
  signOut: () => void;
  resetGame: () => Promise<void>;
  
  // Progression
  selectCharacter: (characterId: string) => Promise<void>;
  signPermit: () => Promise<void>;
  finishStoryDialogue: () => Promise<void>;
  closeCivilianDialogue: () => void;
  triggerCivilianScenario: (scenarioId: string) => void;
  upgradeLevel: (targetLevel: DataCenterLevel) => Promise<void>;
  setDemoLevel: (targetLevel: DataCenterLevel) => Promise<void>;
  
  // UI Triggers
  setActiveImpactKey: (key: ImpactDimensionKey | null) => void;
  setIsUpgradeModalOpen: (open: boolean) => void;
  setIsSevenImpactsOpen: (open: boolean) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [save, setSave] = useState<GameSave | null>(null)
  const [loading, setLoading] = useState(true)

  const [gameStage, setGameStage] = useState<GameStage>('CHARACTER_SELECT')
  const [level, setLevel] = useState<DataCenterLevel>(1)
  const [character, setCharacter] = useState<CharacterProfile | null>(null)
  const [money, setMoney] = useState<number>(50000000)
  const [xp, setXp] = useState<number>(25)
  const [xpNeeded, setXpNeeded] = useState<number>(70)

  const [activeImpactKey, setActiveImpactKey] = useState<ImpactDimensionKey | null>(null)
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false)
  const [isSevenImpactsOpen, setIsSevenImpactsOpen] = useState(false)
  const [activeCivilianScenarioId, setActiveCivilianScenarioId] = useState<string | null>(null)

  const moneyRef = useRef(money)
  moneyRef.current = money
  const levelRef = useRef(level)
  levelRef.current = level
  const stageRef = useRef(gameStage)
  stageRef.current = gameStage

  // Apply save to active state
  const applySaveData = useCallback((saveData: GameSave) => {
    setSave(saveData)
    setGameStage(saveData.game_stage)
    setLevel(saveData.level)
    setMoney(saveData.money)
    setXp(saveData.xp)
    setXpNeeded(saveData.xp_needed)

    if (saveData.character_id) {
      const foundChar = CHARACTERS.find((c) => c.id === saveData.character_id)
      if (foundChar && foundChar.isPlayable) {
        setCharacter(foundChar)
      } else {
        // Fallback to active playable track if previously selected track is Coming Soon
        const playableChar = CHARACTERS.find((c) => c.isPlayable) || CHARACTERS[0]
        setCharacter(playableChar)
      }
    } else {
      setCharacter(null)
    }
  }, [])

  // Auto-authenticate on load if token exists or local demo profile exists
  useEffect(() => {
    const initAuth = async () => {
      const token = getStoredToken()
      if (!token) {
        // Check if there is an existing local demo profile
        const localUserStr = localStorage.getItem('ecotown_demo_user')
        const localSaveStr = localStorage.getItem('ecotown_demo_save')
        if (localUserStr && localSaveStr) {
          try {
            const parsedUser = JSON.parse(localUserStr)
            const parsedSave = JSON.parse(localSaveStr)
            setUser(parsedUser)
            applySaveData(parsedSave)
          } catch {
            // ignore malformed storage
          }
        }
        setLoading(false)
        return
      }

      try {
        const { user: fetchedUser, save: fetchedSave } = await api.auth.getMe()
        // If a stale guest token exists from previous runs, clear it out so guests always start fresh
        if (fetchedUser.isGuest || fetchedUser.username === 'guest_mayor') {
          api.auth.signOut()
          setUser(null)
          return
        }
        setUser(fetchedUser)
        applySaveData(fetchedSave)
      } catch (err) {
        console.warn('Backend unavailable, checking local demo profile:', err)
        const localUserStr = localStorage.getItem('ecotown_demo_user')
        const localSaveStr = localStorage.getItem('ecotown_demo_save')
        if (localUserStr && localSaveStr) {
          try {
            const parsedUser = JSON.parse(localUserStr)
            const parsedSave = JSON.parse(localSaveStr)
            setUser(parsedUser)
            applySaveData(parsedSave)
            return
          } catch {
            // ignore
          }
        }
        api.auth.signOut()
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [applySaveData])

  // Periodic passive income ticker (only during live simulation)
  useEffect(() => {
    if (!user || gameStage !== 'SIMULATION') return

    const timer = setInterval(() => {
      // Municipal income based on level: L1 = €85/tick, L2 = €320/tick, L3 = €1150/tick
      const rate = level === 1 ? 85 : level === 2 ? 320 : 1150
      setMoney((prev) => prev + rate)
    }, 2000)

    return () => clearInterval(timer)
  }, [user, gameStage, level])

  // Auto-save heartbeat to SQLite every 10 seconds (only for authenticated registered users)
  useEffect(() => {
    if (!user || user.isGuest) return

    const interval = setInterval(async () => {
      try {
        await api.game.updateSave({
          money: moneyRef.current,
          level: levelRef.current,
          game_stage: stageRef.current,
          addedPlaytimeSeconds: 10,
        })
      } catch (err) {
        console.warn('Auto-save heartbeat error:', err)
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [user])

  // Auth Handlers
  const signIn = async (identifier: string, pass: string) => {
    try {
      const data = await api.auth.signIn(identifier, pass)
      setUser(data.user)
      applySaveData(data.save)
    } catch (err) {
      console.warn('Backend unavailable, using local demo profile:', err)
      const localUser = {
        id: 1,
        username: identifier,
        email: `${identifier.toLowerCase()}@tampere.fi`,
        role: 'Municipal Climate Director',
      }
      const localSave: GameSave = {
        id: 1,
        user_id: 1,
        character_id: null,
        game_stage: 'CHARACTER_SELECT',
        level: 1,
        money: 50000000,
        xp: 25,
        xp_needed: 70,
        permit_approved: 0,
        permit_approved_at: null,
        story_dialog_seen: 0,
        unlocked_impacts: '[]',
        playtime_seconds: 0,
        updated_at: new Date().toISOString(),
      }
      localStorage.setItem('ecotown_demo_user', JSON.stringify(localUser))
      localStorage.setItem('ecotown_demo_save', JSON.stringify(localSave))
      setUser(localUser)
      applySaveData(localSave)
    }
  }

  const signUp = async (username: string, email: string, pass: string, role?: string) => {
    try {
      const data = await api.auth.signUp(username, email, pass, role)
      setUser(data.user)
      applySaveData(data.save)
    } catch (err) {
      console.warn('Backend unavailable, using local demo profile:', err)
      const localUser = {
        id: 1,
        username: username,
        email: email || `${username.toLowerCase()}@tampere.fi`,
        role: role || 'Municipal Climate Director',
      }
      const localSave: GameSave = {
        id: 1,
        user_id: 1,
        character_id: null,
        game_stage: 'CHARACTER_SELECT',
        level: 1,
        money: 50000000,
        xp: 25,
        xp_needed: 70,
        permit_approved: 0,
        permit_approved_at: null,
        story_dialog_seen: 0,
        unlocked_impacts: '[]',
        playtime_seconds: 0,
        updated_at: new Date().toISOString(),
      }
      localStorage.setItem('ecotown_demo_user', JSON.stringify(localUser))
      localStorage.setItem('ecotown_demo_save', JSON.stringify(localSave))
      setUser(localUser)
      applySaveData(localSave)
    }
  }

  const signInAsGuest = async () => {
    // Ephemeral initial save always starts at Step 1: CHARACTER_SELECT
    const guestInitialSave: GameSave = {
      id: -1,
      user_id: -1,
      character_id: null,
      game_stage: 'CHARACTER_SELECT',
      level: 1,
      money: 50000000,
      xp: 25,
      xp_needed: 70,
      permit_approved: 0,
      permit_approved_at: null,
      story_dialog_seen: 0,
      unlocked_impacts: '[]',
      playtime_seconds: 0,
      updated_at: new Date().toISOString(),
    }

    try {
      const data = await api.auth.guest()
      setUser({ ...data.user, isGuest: true })
      applySaveData(guestInitialSave)
    } catch (err) {
      console.warn('Guest login fallback to in-memory mode:', err)
      setUser({
        id: -1,
        username: 'Guest Mayor',
        email: 'guest@tampere.fi',
        role: 'Guest Mayor',
        isGuest: true,
      })
      applySaveData(guestInitialSave)
    }
  }

  const signOut = () => {
    api.auth.signOut()
    localStorage.removeItem('ecotown_demo_user')
    localStorage.removeItem('ecotown_demo_save')
    setUser(null)
    setSave(null)
    setGameStage('CHARACTER_SELECT')
    setLevel(1)
    setCharacter(null)
  }

  const resetGame = async () => {
    if (!user) return
    if (user.isGuest) {
      setLevel(1)
      setMoney(50000000)
      setXp(25)
      setGameStage('CHARACTER_SELECT')
      setCharacter(null)
      return
    }
    const { save: resetSave } = await api.game.resetSave()
    applySaveData(resetSave)
  }

  // Progression Handlers
  const selectCharacter = async (charId: string) => {
    const foundChar = CHARACTERS.find((c) => c.id === charId)
    // Strictly prevent selecting Coming Soon tracks
    if (!foundChar || !foundChar.isPlayable) return

    setCharacter(foundChar)
    setGameStage('PERMIT_STAMP')

    if (!user?.isGuest) {
      try {
        const { save: updated } = await api.game.updateSave({
          character_id: charId,
          game_stage: 'PERMIT_STAMP',
        })
        setSave(updated)
      } catch (err) {
        console.error('Failed to save character selection:', err)
      }
    }
  }

  const signPermit = async () => {
    const timestamp = new Date().toISOString()
    setGameStage('SIMULATION')
    setLevel(1)
    setActiveCivilianScenarioId('phase1')

    if (!user?.isGuest) {
      try {
        const { save: updated } = await api.game.updateSave({
          permit_approved: 1,
          permit_approved_at: timestamp,
          game_stage: 'SIMULATION',
          level: 1,
          story_dialog_seen: 1,
        })
        setSave(updated)
      } catch (err) {
        console.error('Failed to save permit signing:', err)
      }
    }
  }

  const finishStoryDialogue = async () => {
    setGameStage('SIMULATION')
    setLevel(1)
    // Open Phase 1 Clash-of-Clans civilian debate
    setActiveCivilianScenarioId('phase1')

    if (!user?.isGuest) {
      try {
        const { save: updated } = await api.game.updateSave({
          story_dialog_seen: 1,
          game_stage: 'SIMULATION',
          level: 1,
        })
        setSave(updated)
      } catch (err) {
        console.error('Failed to complete construction story:', err)
      }
    }
  }

  const triggerCivilianScenario = (scenarioId: string) => {
    setActiveCivilianScenarioId(scenarioId)
  }

  const closeCivilianDialogue = () => {
    setActiveCivilianScenarioId(null)
  }

  const upgradeLevel = async (targetLevel: DataCenterLevel) => {
    setLevel(targetLevel)
    const cost = targetLevel === 2 ? 15000 : 50000
    setMoney((prev) => Math.max(0, prev - cost))
    setXp((prev) => Math.min(xpNeeded, prev + 25))

    // Trigger debate between civilians for this upgrade
    const scenarioKey = targetLevel === 2 ? 'level2' : 'level3'
    setActiveCivilianScenarioId(scenarioKey)

    if (!user?.isGuest) {
      try {
        const { save: updated } = await api.game.updateSave({
          level: targetLevel,
          money: Math.max(0, moneyRef.current - cost),
        })
        setSave(updated)
      } catch (err) {
        console.error('Failed to save level upgrade:', err)
      }
    }
  }

  // Instant demo switcher for hackathon judges & presentations
  const setDemoLevel = async (targetLevel: DataCenterLevel) => {
    setLevel(targetLevel)
    setGameStage('SIMULATION')
    try {
      const { save: updated } = await api.game.updateSave({
        level: targetLevel,
        game_stage: 'SIMULATION',
      })
      setSave(updated)
    } catch (err) {
      console.error('Demo switch error:', err)
    }
  }

  return (
    <GameContext.Provider
      value={{
        user,
        save,
        loading,
        gameStage,
        level,
        character,
        money,
        xp,
        xpNeeded,
        activeImpactKey,
        isUpgradeModalOpen,
        isSevenImpactsOpen,
        activeCivilianScenarioId,
        signIn,
        signUp,
        signInAsGuest,
        signOut,
        resetGame,
        selectCharacter,
        signPermit,
        finishStoryDialogue,
        closeCivilianDialogue,
        triggerCivilianScenario,
        upgradeLevel,
        setDemoLevel,
        setActiveImpactKey,
        setIsUpgradeModalOpen,
        setIsSevenImpactsOpen,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

export const useGame = () => {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return context
}
