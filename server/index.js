const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cron = require('node-cron');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Database setup
const db = new sqlite3.Database('./habits.db', (err) => {
  if (err) console.error(err);
  else console.log('Connected to SQLite database');
});

// Initialize database tables
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS habits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      frequency TEXT DEFAULT 'daily',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      habit_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      completed BOOLEAN DEFAULT 0,
      FOREIGN KEY (habit_id) REFERENCES habits(id),
      UNIQUE(habit_id, date)
    )
  `);
});

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });
    req.userId = decoded.id;
    next();
  });
};

// Auth routes
app.post('/api/auth/register', (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  db.run(
    'INSERT INTO users (email, password) VALUES (?, ?)',
    [email, hashedPassword],
    function (err) {
      if (err) return res.status(400).json({ error: 'Email already exists' });
      const token = jwt.sign({ id: this.lastID }, JWT_SECRET);
      res.json({ token, userId: this.lastID });
    }
  );
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err || !user) return res.status(400).json({ error: 'User not found' });
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(400).json({ error: 'Invalid password' });
    }
    const token = jwt.sign({ id: user.id }, JWT_SECRET);
    res.json({ token, userId: user.id });
  });
});

// Habit routes
app.post('/api/habits', verifyToken, (req, res) => {
  const { name, description, frequency } = req.body;

  db.run(
    'INSERT INTO habits (user_id, name, description, frequency) VALUES (?, ?, ?, ?)',
    [req.userId, name, description, frequency],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ id: this.lastID, name, description, frequency });
    }
  );
});

app.get('/api/habits', verifyToken, (req, res) => {
  db.all('SELECT * FROM habits WHERE user_id = ?', [req.userId], (err, habits) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(habits);
  });
});

app.delete('/api/habits/:id', verifyToken, (req, res) => {
  db.run('DELETE FROM habits WHERE id = ? AND user_id = ?', [req.params.id, req.userId], (err) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ success: true });
  });
});

// Logging routes
app.post('/api/logs', verifyToken, (req, res) => {
  const { habitId, date, completed } = req.body;

  db.run(
    'INSERT OR REPLACE INTO logs (habit_id, date, completed) VALUES (?, ?, ?)',
    [habitId, date, completed ? 1 : 0],
    (err) => {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

app.get('/api/logs/:habitId', verifyToken, (req, res) => {
  db.all('SELECT * FROM logs WHERE habit_id = ?', [req.params.habitId], (err, logs) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(logs);
  });
});

// Stats route
app.get('/api/stats/:habitId', verifyToken, (req, res) => {
  db.all(
    `SELECT date, completed FROM logs WHERE habit_id = ? ORDER BY date DESC LIMIT 30`,
    [req.params.habitId],
    (err, logs) => {
      if (err) return res.status(400).json({ error: err.message });

      let streak = 0;
      let completionRate = 0;

      if (logs.length > 0) {
        let currentStreak = 0;
        const today = new Date();

        for (let i = 0; i < logs.length; i++) {
          if (logs[i].completed) {
            currentStreak++;
          } else {
            break;
          }
        }
        streak = currentStreak;
        completionRate = (logs.filter(l => l.completed).length / logs.length) * 100;
      }

      res.json({ streak, completionRate, totalLogs: logs.length });
    }
  );
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
