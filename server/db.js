import mysql from 'mysql2/promise'

// Configure connection options from connection URL or individual environment variables
const poolConfig = process.env.MYSQL_URL || process.env.DATABASE_URL
  ? {
      uri: process.env.MYSQL_URL || process.env.DATABASE_URL,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    }
  : {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'ecotown',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    }

export const pool = mysql.createPool(poolConfig)

// Initialize MySQL tables on application startup
export async function initDb() {
  try {
    const connection = await pool.getConnection()
    console.log('🐬 [MySQL] Successfully connected to database pool.')

    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(191) NOT NULL UNIQUE,
        email VARCHAR(191) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(100) NOT NULL DEFAULT 'Municipal Climate Director',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `)

    await connection.query(`
      CREATE TABLE IF NOT EXISTS game_saves (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL UNIQUE,
        character_id VARCHAR(50) DEFAULT NULL,
        game_stage VARCHAR(50) NOT NULL DEFAULT 'CHARACTER_SELECT',
        level INT NOT NULL DEFAULT 1,
        money DOUBLE NOT NULL DEFAULT 50000000,
        xp INT NOT NULL DEFAULT 25,
        xp_needed INT NOT NULL DEFAULT 70,
        permit_approved TINYINT(1) NOT NULL DEFAULT 0,
        permit_approved_at TIMESTAMP NULL DEFAULT NULL,
        story_dialog_seen TINYINT(1) NOT NULL DEFAULT 0,
        unlocked_impacts TEXT NOT NULL,
        playtime_seconds INT NOT NULL DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_game_saves_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `)

    connection.release()
    console.log('🐬 [MySQL] Tables verified/initialized successfully (users, game_saves).')
  } catch (err) {
    console.error('❌ [MySQL] Connection/Initialization failed:', err.message)
    console.error('👉 Make sure MySQL is running or set MYSQL_URL in environment variables.')
  }
}

export const checkHealth = async () => {
  const [rows] = await pool.query('SELECT 1 as test')
  return rows[0]?.test === 1 ? 'connected' : 'error'
}

export const userQueries = {
  async create(username, email, passwordHash, role) {
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [username, email, passwordHash, role]
    )
    return result.insertId
  },

  async findByUsername(username) {
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ? LIMIT 1', [username])
    return rows[0] || null
  },

  async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email])
    return rows[0] || null
  },

  async findById(id) {
    const [rows] = await pool.query(
      'SELECT id, username, email, role, created_at, last_login_at FROM users WHERE id = ? LIMIT 1',
      [id]
    )
    return rows[0] || null
  },

  async updateLastLogin(id) {
    await pool.query('UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?', [id])
  },
}

export const saveQueries = {
  async createInitialSave(userId) {
    await pool.query(
      `INSERT INTO game_saves (user_id, money, level, game_stage, unlocked_impacts)
       VALUES (?, 50000000, 1, 'CHARACTER_SELECT', '[]')
       ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP`,
      [userId]
    )
  },

  async findByUserId(userId) {
    const [rows] = await pool.query('SELECT * FROM game_saves WHERE user_id = ? LIMIT 1', [userId])
    return rows[0] || null
  },

  async updateSave({
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
    addedPlaytimeSeconds = 0,
    userId,
  }) {
    await pool.query(
      `UPDATE game_saves SET
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
      WHERE user_id = ?`,
      [
        characterId !== undefined ? characterId : null,
        gameStage !== undefined ? gameStage : null,
        level !== undefined ? level : null,
        money !== undefined ? money : null,
        xp !== undefined ? xp : null,
        xpNeeded !== undefined ? xpNeeded : null,
        permitApproved !== undefined ? (permitApproved ? 1 : 0) : null,
        permitApprovedAt !== undefined ? permitApprovedAt : null,
        storyDialogSeen !== undefined ? (storyDialogSeen ? 1 : 0) : null,
        unlockedImpacts !== undefined
          ? (typeof unlockedImpacts === 'string' ? unlockedImpacts : JSON.stringify(unlockedImpacts))
          : null,
        addedPlaytimeSeconds,
        userId,
      ]
    )
  },

  async resetSave(userId) {
    await pool.query(
      `UPDATE game_saves SET
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
      WHERE user_id = ?`,
      [userId]
    )
  },
}
