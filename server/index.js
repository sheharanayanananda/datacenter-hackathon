import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { initDb, checkHealth, userQueries, saveQueries } from './db.js'

const app = express()
const PORT = process.env.PORT || 3001
const JWT_SECRET = process.env.JWT_SECRET || 'nordic-datacenter-secret-key-2026'

app.use(cors())
app.use(express.json())

// Auth middleware to extract & verify JWT
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' })
  }

  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Token expired or invalid' })
  }
}

// 1. Healthcheck
app.get('/api/health', async (req, res) => {
  try {
    const dbStatus = await checkHealth()
    res.json({ status: 'ok', db: dbStatus, timestamp: new Date().toISOString() })
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message })
  }
})

// 2. Sign Up
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { username, email, password, role } = req.body
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' })
    }

    const cleanUsername = username.trim().toLowerCase()
    const cleanEmail = email.trim().toLowerCase()

    const existingUser = await userQueries.findByUsername(cleanUsername)
    if (existingUser) {
      return res.status(409).json({ error: 'Username already taken' })
    }
    const existingEmail = await userQueries.findByEmail(cleanEmail)
    if (existingEmail) {
      return res.status(409).json({ error: 'Email already registered' })
    }

    const salt = bcrypt.genSaltSync(10)
    const passwordHash = bcrypt.hashSync(password, salt)
    const assignedRole = role || 'Municipal Climate Director'

    const userId = await userQueries.create(cleanUsername, cleanEmail, passwordHash, assignedRole)

    // Create initial game save
    await saveQueries.createInitialSave(userId)

    const user = {
      id: userId,
      username: cleanUsername,
      email: cleanEmail,
      role: assignedRole,
    }

    const save = await saveQueries.findByUserId(userId)
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' })

    res.status(201).json({ token, user, save })
  } catch (err) {
    console.error('Signup error:', err)
    res.status(500).json({ error: 'Failed to create account: ' + err.message })
  }
})

// 3. Sign In
app.post('/api/auth/signin', async (req, res) => {
  try {
    const { identifier, password } = req.body
    if (!identifier || !password) {
      return res.status(400).json({ error: 'Username/Email and password are required' })
    }

    const cleanIdentifier = identifier.trim().toLowerCase()
    let userRow = await userQueries.findByUsername(cleanIdentifier)
    if (!userRow) {
      userRow = await userQueries.findByEmail(cleanIdentifier)
    }

    if (!userRow) {
      return res.status(401).json({ error: 'Invalid username or password' })
    }

    const isMatch = bcrypt.compareSync(password, userRow.password_hash)
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid username or password' })
    }

    await userQueries.updateLastLogin(userRow.id)
    const save = await saveQueries.findByUserId(userRow.id)

    const user = {
      id: userRow.id,
      username: userRow.username,
      email: userRow.email,
      role: userRow.role,
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' })

    res.json({ token, user, save })
  } catch (err) {
    console.error('Signin error:', err)
    res.status(500).json({ error: 'Failed to sign in: ' + err.message })
  }
})

// 4. Quick Guest Mayor Access (Ephemeral In-Memory Demo for Hackathon Evaluators)
app.post('/api/auth/guest', (req, res) => {
  try {
    const user = {
      id: -1,
      username: 'Guest Mayor',
      email: 'guest@tampere.fi',
      role: 'Guest Mayor',
      isGuest: true,
    }

    // Always start fresh at Step 1 (CHARACTER_SELECT)
    const save = {
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

    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '6h' })
    res.json({ token, user, save })
  } catch (err) {
    console.error('Guest login error:', err)
    res.status(500).json({ error: 'Failed to create guest session: ' + err.message })
  }
})

// 5. Get Current User Profile
app.get('/api/auth/me', authenticate, async (req, res) => {
  try {
    if (req.user.isGuest || req.user.id === -1) {
      const user = {
        id: -1,
        username: 'Guest Mayor',
        email: 'guest@tampere.fi',
        role: 'Guest Mayor',
        isGuest: true,
      }
      const save = {
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
      return res.json({ user, save })
    }

    const user = await userQueries.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    const save = await saveQueries.findByUserId(req.user.id)
    res.json({ user, save })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// 6. Get Game Save
app.get('/api/game/save', authenticate, async (req, res) => {
  try {
    if (req.user.isGuest || req.user.id === -1) {
      return res.json({
        save: {
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
        },
      })
    }

    let save = await saveQueries.findByUserId(req.user.id)
    if (!save) {
      await saveQueries.createInitialSave(req.user.id)
      save = await saveQueries.findByUserId(req.user.id)
    }
    res.json({ save })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// 7. Update Game Save (Auto-Save / Milestone Save)
app.put('/api/game/save', authenticate, async (req, res) => {
  try {
    // Guest sessions are strictly ephemeral: never write to database
    if (req.user.isGuest || req.user.id === -1) {
      return res.json({
        success: true,
        message: 'Guest session is ephemeral. No changes saved to database.',
      })
    }
    const characterId = req.body.characterId ?? req.body.character_id
    const gameStage = req.body.gameStage ?? req.body.game_stage
    const level = req.body.level
    const money = req.body.money
    const xp = req.body.xp
    const xpNeeded = req.body.xpNeeded ?? req.body.xp_needed
    const permitApproved = req.body.permitApproved ?? req.body.permit_approved
    const permitApprovedAt = req.body.permitApprovedAt ?? req.body.permit_approved_at
    const storyDialogSeen = req.body.storyDialogSeen ?? req.body.story_dialog_seen
    const unlockedImpacts = req.body.unlockedImpacts ?? req.body.unlocked_impacts
    const addedPlaytimeSeconds = req.body.addedPlaytimeSeconds ?? req.body.added_playtime_seconds ?? 0

    await saveQueries.updateSave({
      characterId,
      gameStage,
      level,
      money,
      xp,
      xpNeeded,
      permitApproved,
      permitApprovedAt,
      storyDialogSeen,
      unlockedImpacts,
      addedPlaytimeSeconds,
      userId: req.user.id,
    })

    const updated = await saveQueries.findByUserId(req.user.id)
    res.json({ success: true, save: updated })
  } catch (err) {
    console.error('Update save error:', err)
    res.status(500).json({ error: 'Failed to update save: ' + err.message })
  }
})

// 8. Reset Game Save
app.post('/api/game/reset', authenticate, async (req, res) => {
  try {
    await saveQueries.resetSave(req.user.id)
    const reset = await saveQueries.findByUserId(req.user.id)
    res.json({ success: true, save: reset })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Start server
app.listen(PORT, async () => {
  console.log(`⚡ [Nordic EcoTown API] Server running on http://localhost:${PORT}`)
  await initDb()
})
