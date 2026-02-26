# Habit Tracker - Android Deployment Guide

## Backend Deployment (Phase 2)

### Option 1: Deploy to Render (Recommended - Free Tier)

1. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub account

2. **Connect Repository**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the habit-tracker repo

3. **Configure Service**
   - Name: `habit-tracker-api`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `node server/index.js`
   - Region: Choose closest to you

4. **Set Environment Variables**
   - In Render dashboard, go to Environment
   - Add variables:
     ```
     JWT_SECRET=your-secure-random-key-here
     NODE_ENV=production
     PORT=5000
     ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note the URL (e.g., `https://habit-tracker-api.onrender.com`)

### Option 2: Deploy to Railway

1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository
4. Add environment variables (same as above)
5. Railway auto-deploys on git push

### Option 3: Deploy to Heroku (Paid)

1. Install Heroku CLI: `brew install heroku`
2. Login: `heroku login`
3. Create app: `heroku create habit-tracker-api`
4. Set environment: `heroku config:set JWT_SECRET=your-key`
5. Deploy: `git push heroku main`

## Mobile App Configuration (Phase 3)

### Update API Endpoint

Edit `mobile/src/services/api.ts` and update the base URL:

```typescript
const API_BASE_URL = 'https://your-deployed-api.onrender.com';
```

Or use environment variable:
```bash
export REACT_APP_API_URL=https://your-deployed-api.onrender.com
```

## Build Android App (Phase 4)

### Prerequisites
- Android Studio installed
- Android SDK (API 33+)
- Java Development Kit (JDK 11+)

### Development Build

```bash
cd mobile
npm install
npx react-native run-android
```

### Production Release Build

1. **Generate Signing Key** (first time only)
   ```bash
   cd mobile/android/app
   keytool -genkey -v -keystore habit-tracker.keystore \
     -keyalg RSA -keysize 2048 -validity 10000 \
     -alias habit-tracker
   ```

2. **Create gradle.properties**
   ```bash
   cat > ~/.gradle/gradle.properties << EOF
   MYAPP_RELEASE_STORE_FILE=habit-tracker.keystore
   MYAPP_RELEASE_STORE_PASSWORD=your-password
   MYAPP_RELEASE_KEY_ALIAS=habit-tracker
   MYAPP_RELEASE_KEY_PASSWORD=your-password
   EOF
   ```

3. **Build Release APK**
   ```bash
   cd mobile
   ./gradlew assembleRelease
   ```

   APK location: `mobile/android/app/build/outputs/apk/release/app-release.apk`

4. **Build Release AAB** (for Google Play Store)
   ```bash
   ./gradlew bundleRelease
   ```

   AAB location: `mobile/android/app/build/outputs/bundle/release/app-release.aab`

## Testing

### Test Backend API
```bash
# Test registration
curl -X POST https://your-api.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Test login
curl -X POST https://your-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Test Mobile App
1. Connect Android device via USB or use emulator
2. Run: `cd mobile && npx react-native run-android`
3. Test user registration and habit creation
4. Verify streaks and completion stats

## Publishing to Google Play Store

1. Create Google Play Developer account ($25 one-time fee)
2. Create app listing in Play Console
3. Upload signed AAB file
4. Fill in app details, screenshots, description
5. Submit for review (typically 2-4 hours)

## Environment Variables Summary

### Backend (.env)
```
JWT_SECRET=your-secure-key
NODE_ENV=production
PORT=5000
```

### Mobile (mobile/src/services/api.ts)
```
API_BASE_URL=https://your-deployed-api.onrender.com
```

## Troubleshooting

### API Connection Issues
- Verify backend is running: `curl https://your-api.onrender.com/api/habits`
- Check CORS is enabled in server/index.js
- Ensure mobile app has internet permission in AndroidManifest.xml

### Build Errors
- Clear cache: `cd mobile && npm cache clean --force && rm -rf node_modules`
- Rebuild: `npm install && npx react-native run-android`

### Database Issues
- Backend uses SQLite (habits.db)
- On Render, database persists in app directory
- For production, consider migrating to PostgreSQL

## Next Steps

1. Deploy backend to Render/Railway
2. Update API URL in mobile app
3. Build and test on Android emulator
4. Test on physical device
5. Generate signing key and build release APK
6. Publish to Google Play Store (optional)
