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
      const foundChar = CHARACTERS.find((c) => c.id === saveData.character_id) || CHARACTERS[0]
      setCharacter(foundChar)
    } else {
      setCharacter(null)
    }
  }, [])

  // Auto-authenticate on load if token exists
  useEffect(() => {
    const initAuth = async () => {
      const token = getStoredToken()
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const { user: fetchedUser, save: fetchedSave } = await api.auth.getMe()
        setUser(fetchedUser)
        applySaveData(fetchedSave)
      } catch (err) {
        console.warn('Session expired or server unavailable, logging out:', err)
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

  // Auto-save heartbeat to SQLite every 10 seconds
  useEffect(() => {
    if (!user) return

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
    const data = await api.auth.signIn(identifier, pass)
    setUser(data.user)
    applySaveData(data.save)
  }

  const signUp = async (username: string, email: string, pass: string, role?: string) => {
    const data = await api.auth.signUp(username, email, pass, role)
    setUser(data.user)
    applySaveData(data.save)
  }

  const signInAsGuest = async () => {
    const data = await api.auth.guest()
    setUser(data.user)
    applySaveData(data.save)
  }

  const signOut = () => {
    api.auth.signOut()
    setUser(null)
    setSave(null)
    setGameStage('CHARACTER_SELECT')
    setLevel(1)
    setCharacter(null)
  }

  const resetGame = async () => {
    if (!user) return
    const { save: resetSave } = await api.game.resetSave()
    applySaveData(resetSave)
  }

  // Progression Handlers
  const selectCharacter = async (charId: string) => {
    const foundChar = CHARACTERS.find((c) => c.id === charId) || CHARACTERS[0]
    setCharacter(foundChar)
    setGameStage('PERMIT_STAMP')

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

  const signPermit = async () => {
    const timestamp = new Date().toISOString()
    setGameStage('CONSTRUCTION_STORY')

    try {
      const { save: updated } = await api.game.updateSave({
        permit_approved: 1,
        permit_approved_at: timestamp,
        game_stage: 'CONSTRUCTION_STORY',
      })
      setSave(updated)
    } catch (err) {
      console.error('Failed to save permit signing:', err)
    }
  }

  const finishStoryDialogue = async () => {
    setGameStage('SIMULATION')
    setLevel(1)

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

  const upgradeLevel = async (targetLevel: DataCenterLevel) => {
    setLevel(targetLevel)
    const cost = targetLevel === 2 ? 15000 : 50000
    setMoney((prev) => Math.max(0, prev - cost))
    setXp((prev) => Math.min(xpNeeded, prev + 25))

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
        signIn,
        signUp,
        signInAsGuest,
        signOut,
        resetGame,
        selectCharacter,
        signPermit,
        finishStoryDialogue,
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
