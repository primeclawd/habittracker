# Habit Tracker - Deployment Checklist

## Pre-Deployment Verification

### Backend Setup
- [x] Procfile created for PaaS deployment
- [x] .env.example with all required variables
- [x] CORS enabled in server/index.js
- [x] JWT authentication configured
- [x] SQLite database schema ready
- [x] All API endpoints functional

### Mobile App Structure
- [x] React Native project initialized
- [x] TypeScript configuration
- [x] Android native code (MainActivity, MainApplication)
- [x] Android manifest with permissions
- [x] Build configuration (gradle files)
- [x] App resources (strings, styles)

### Mobile App Components
- [x] AuthScreen - Login/Register
- [x] DashboardScreen - Habit list
- [x] HabitCard - Individual habit display
- [x] AddHabitModal - Create habit form
- [x] API service - Centralized client

### Documentation
- [x] DEPLOYMENT.md - Complete deployment guide
- [x] IMPLEMENTATION_SUMMARY.md - What was built
- [x] mobile/README.md - Mobile setup instructions
- [x] Updated README.md - Project overview
- [x] .env.example - Environment template

## Step-by-Step Deployment

### Step 1: Prepare Repository
```bash
cd /home/ubuntu/habit-tracker
git add .
git commit -m "Add React Native Android app and deployment configuration"
git push origin main
```

### Step 2: Deploy Backend to Render

1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect GitHub and select habit-tracker repo
4. Configure:
   - Name: `habit-tracker-api`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `node server/index.js`
   - Region: Choose closest to you
5. Add Environment Variables:
   - `JWT_SECRET`: Generate a secure random string
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
6. Click "Create Web Service"
7. Wait for deployment (2-3 minutes)
8. Note the URL: `https://habit-tracker-api-xxxxx.onrender.com`

### Step 3: Update Mobile App Configuration

Edit `mobile/src/services/api.ts`:
```typescript
const API_BASE_URL = 'https://habit-tracker-api-xxxxx.onrender.com';
```

### Step 4: Test Backend API

```bash
# Test registration
curl -X POST https://habit-tracker-api-xxxxx.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Should return: {"token":"...", "userId":1}
```

### Step 5: Build and Test Mobile App

```bash
cd mobile
npm install

# Test on Android emulator
npx react-native run-android

# Or test on physical device (USB debugging enabled)
npx react-native run-android
```

### Step 6: Test App Functionality

In the app:
1. Register with test email
2. Create a habit
3. Mark habit as done
4. Verify streak and completion stats
5. Delete habit
6. Logout

### Step 7: Generate Signing Key (for release)

```bash
cd mobile/android/app

keytool -genkey -v -keystore habit-tracker.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias habit-tracker

# Follow prompts to set password and key details
# Save the keystore file securely
```

### Step 8: Build Release APK

```bash
cd mobile

# Create gradle.properties with signing config
cat > ~/.gradle/gradle.properties << 'EOF'
MYAPP_RELEASE_STORE_FILE=habit-tracker.keystore
MYAPP_RELEASE_STORE_PASSWORD=your-keystore-password
MYAPP_RELEASE_KEY_ALIAS=habit-tracker
MYAPP_RELEASE_KEY_PASSWORD=your-key-password
EOF

# Build release APK
./gradlew assembleRelease

# Output: android/app/build/outputs/apk/release/app-release.apk
```

### Step 9: Test Release APK

```bash
# Install on device
adb install android/app/build/outputs/apk/release/app-release.apk

# Test all features
```

### Step 10: Publish to Google Play Store (Optional)

1. Create Google Play Developer account ($25 one-time)
2. Create app listing in Play Console
3. Build AAB for Play Store:
   ```bash
   ./gradlew bundleRelease
   # Output: android/app/build/outputs/bundle/release/app-release.aab
   ```
4. Upload AAB to Play Console
5. Fill in app details, screenshots, description
6. Submit for review (2-4 hours typically)

## File Checklist

### Root Level
- [x] Procfile
- [x] DEPLOYMENT.md
- [x] IMPLEMENTATION_SUMMARY.md
- [x] .env.example
- [x] .gitignore (updated)
- [x] README.md (updated)

### Mobile App
- [x] mobile/App.tsx
- [x] mobile/index.js
- [x] mobile/package.json
- [x] mobile/tsconfig.json
- [x] mobile/babel.config.js
- [x] mobile/jest.config.js
- [x] mobile/react-native.config.js
- [x] mobile/.gitignore
- [x] mobile/README.md

### Mobile Screens
- [x] mobile/src/screens/AuthScreen.tsx
- [x] mobile/src/screens/DashboardScreen.tsx

### Mobile Components
- [x] mobile/src/components/HabitCard.tsx
- [x] mobile/src/components/AddHabitModal.tsx

### Mobile Services
- [x] mobile/src/services/api.ts

### Android Configuration
- [x] mobile/android/build.gradle
- [x] mobile/android/settings.gradle
- [x] mobile/android/app/build.gradle
- [x] mobile/android/app/src/main/AndroidManifest.xml
- [x] mobile/android/app/src/main/java/com/habittracker/MainActivity.java
- [x] mobile/android/app/src/main/java/com/habittracker/MainApplication.java
- [x] mobile/android/app/src/main/res/values/strings.xml
- [x] mobile/android/app/src/main/res/values/styles.xml

## Environment Variables

### Backend (.env on Render)
```
JWT_SECRET=your-secure-random-key
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
- Verify API_BASE_URL is correct in api.ts

### Build Errors
```bash
# Clear cache and rebuild
cd mobile
npm cache clean --force
rm -rf node_modules
npm install
npx react-native run-android
```

### Gradle Build Issues
```bash
cd mobile
./gradlew clean
./gradlew assembleDebug
```

### Database Issues
- Backend uses SQLite (habits.db)
- On Render, database persists in app directory
- For production scale, consider migrating to PostgreSQL

## Support Resources

- React Native Docs: https://reactnative.dev
- Render Docs: https://render.com/docs
- Android Development: https://developer.android.com
- Google Play Console: https://play.google.com/console

## Success Criteria

✅ Backend deployed and accessible
✅ Mobile app connects to backend
✅ User registration works
✅ Habit creation works
✅ Daily tracking works
✅ Streaks calculate correctly
✅ Stats display correctly
✅ Release APK builds successfully
✅ App works on physical device

All systems ready for deployment!
