import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const DB_PATH = path.resolve(__dirname, '../ecotown.db')

export const db = new Database(DB_PATH)

// Optimize for concurrency and safety
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'Municipal Climate Director',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS game_saves (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    character_id TEXT DEFAULT NULL,
    game_stage TEXT NOT NULL DEFAULT 'CHARACTER_SELECT',
    level INTEGER NOT NULL DEFAULT 1,
    money REAL NOT NULL DEFAULT 50000000,
    xp INTEGER NOT NULL DEFAULT 25,
    xp_needed INTEGER NOT NULL DEFAULT 70,
    permit_approved INTEGER NOT NULL DEFAULT 0,
    permit_approved_at DATETIME DEFAULT NULL,
    story_dialog_seen INTEGER NOT NULL DEFAULT 0,
    unlocked_impacts TEXT NOT NULL DEFAULT '[]',
    playtime_seconds INTEGER NOT NULL DEFAULT 0,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
  CREATE INDEX IF NOT EXISTS idx_game_saves_user_id ON game_saves(user_id);
`)

// Prepared queries for high performance
export const userQueries = {
  create: db.prepare(`
    INSERT INTO users (username, email, password_hash, role)
    VALUES (?, ?, ?, ?)
  `),
  findByUsername: db.prepare(`
    SELECT * FROM users WHERE username = ?
  `),
  findByEmail: db.prepare(`
    SELECT * FROM users WHERE email = ?
  `),
  findById: db.prepare(`
    SELECT id, username, email, role, created_at, last_login_at FROM users WHERE id = ?
  `),
  updateLastLogin: db.prepare(`
    UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?
  `),
}

export const saveQueries = {
  createInitialSave: db.prepare(`
    INSERT INTO game_saves (user_id, money, level, game_stage)
    VALUES (?, 50000000, 1, 'CHARACTER_SELECT')
  `),
  findByUserId: db.prepare(`
    SELECT * FROM game_saves WHERE user_id = ?
  `),
  updateSave: db.prepare(`
    UPDATE game_saves SET
      character_id = COALESCE(?, character_id),
      game_stage = COALESCE(?, game_stage),
      level = COALESCE(?, level),
      money = COALESCE(?, money),
      xp = COALESCE(?, xp),
      xp_needed = COALESCE(?, xp_needed),
      permit_approved = COALESCE(?, permit_approved),
      permit_approved_at = COALESCE(?, permit_approved_at),
      story_dialog_seen = COALESCE(?, story_dialog_seen),
      unlocked_impacts = COALESCE(?, unlocked_impacts),
      playtime_seconds = playtime_seconds + ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE user_id = ?
  `),
  resetSave: db.prepare(`
    UPDATE game_saves SET
      character_id = NULL,
      game_stage = 'CHARACTER_SELECT',
      level = 1,
      money = 50000000,
      xp = 25,
      xp_needed = 70,
      permit_approved = 0,
      permit_approved_at = NULL,
      story_dialog_seen = 0,
      unlocked_impacts = '[]',
      playtime_seconds = 0,
      updated_at = CURRENT_TIMESTAMP
    WHERE user_id = ?
  `),
}
