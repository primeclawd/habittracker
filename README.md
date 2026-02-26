# Habit Tracker

A full-stack habit tracking application with Node.js/Express backend and React Native Android mobile app.

## Features

✅ User authentication (JWT-based)
✅ Create and manage daily habits
✅ Track habit completion with daily logs
✅ View streaks and completion statistics
✅ Delete habits
✅ Native Android UI with React Native
✅ Persistent local storage (AsyncStorage)
✅ Production-ready deployment

## Quick Start - Web Development

### Prerequisites
- Node.js 14+
- npm

### Installation

1. Install dependencies:
```bash
npm install
cd client && npm install && cd ..
```

2. Start the development server:
```bash
npm run dev
```

This will start both the backend (port 5000) and frontend (port 3000) concurrently.

### Running Separately

Backend only:
```bash
npm run server
```

Frontend only:
```bash
cd client && npm start
```

## Android Mobile App

### Quick Start

```bash
cd mobile
npm install
npx react-native run-android
```

See `mobile/README.md` for detailed setup instructions.

## Project Structure

```
habit-tracker/
├── server/                 # Node.js/Express backend
│   └── index.js           # API routes
├── client/                # React web app
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── styles/        # CSS styles
│   │   └── App.js         # Main app
│   └── package.json
├── mobile/                # React Native Android app
│   ├── android/           # Android native code
│   ├── src/
│   │   ├── screens/       # Auth & Dashboard screens
│   │   ├── components/    # HabitCard, AddHabitModal
│   │   └── services/      # API client
│   ├── App.tsx            # Main app
│   └── package.json
├── Procfile               # PaaS deployment config
├── DEPLOYMENT.md          # Deployment guide
├── .env.example           # Environment template
└── package.json
```

## API Endpoints

All endpoints require `Authorization: Bearer {token}` header (except auth endpoints)

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Habits
- `GET /api/habits` - Get all user habits
- `POST /api/habits` - Create new habit
- `DELETE /api/habits/:id` - Delete habit

### Logs
- `POST /api/logs` - Log habit completion
- `GET /api/logs/:habitId` - Get logs for a habit

### Stats
- `GET /api/stats/:habitId` - Get habit statistics (streak, completion rate)

## Database

Uses SQLite with three tables:
- `users` - User accounts
- `habits` - User habits
- `logs` - Daily habit completion logs

## Deployment

### Deploy Backend to Free PaaS

See `DEPLOYMENT.md` for detailed instructions on deploying to:
- **Render** (recommended, free tier)
- **Railway** (free tier)
- **Heroku** (paid)

### Build Android App

```bash
cd mobile
./gradlew assembleRelease
```

See `DEPLOYMENT.md` for signing key generation and Google Play Store publishing.

## Environment Variables

Copy `.env.example` to `.env` and configure:

```
JWT_SECRET=your-secure-key
NODE_ENV=production
PORT=5000
REACT_APP_API_URL=https://your-deployed-api.onrender.com
```
