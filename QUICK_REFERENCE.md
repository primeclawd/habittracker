# Habit Tracker - Quick Reference

## Essential Commands

### Backend Deployment (Render)
```bash
# 1. Push to GitHub
git add .
git commit -m "Add Android app and deployment config"
git push origin main

# 2. Go to https://render.com
# 3. Create Web Service from GitHub
# 4. Set environment variables and deploy
```

### Mobile App Development
```bash
# Install dependencies
cd mobile && npm install

# Run on Android emulator
npx react-native run-android

# Run on physical device (USB debugging)
npx react-native run-android

# Start Metro bundler (if needed)
npx react-native start
```

### Mobile App Release Build
```bash
cd mobile

# Generate signing key (first time only)
cd android/app
keytool -genkey -v -keystore habit-tracker.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias habit-tracker

# Build release APK
cd ../..
./gradlew assembleRelease

# Build for Google Play Store (AAB)
./gradlew bundleRelease
```

### Testing Backend API
```bash
# Register
curl -X POST https://your-api.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123"}'

# Login
curl -X POST https://your-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123"}'

# Get habits (replace TOKEN with actual token)
curl https://your-api.onrender.com/api/habits \
  -H "Authorization: Bearer TOKEN"
```

## Configuration Files

### Update API URL
**File**: `mobile/src/services/api.ts`
```typescript
const API_BASE_URL = 'https://your-deployed-api.onrender.com';
```

### Environment Variables
**File**: `.env` (copy from `.env.example`)
```
JWT_SECRET=your-secure-key
NODE_ENV=production
PORT=5000
```

## Project URLs

- **GitHub**: Your repository URL
- **Render Dashboard**: https://dashboard.render.com
- **Google Play Console**: https://play.google.com/console
- **React Native Docs**: https://reactnative.dev

## Key Files

| File | Purpose |
|------|---------|
| `Procfile` | PaaS deployment configuration |
| `DEPLOYMENT.md` | Detailed deployment guide |
| `DEPLOYMENT_CHECKLIST.md` | Step-by-step checklist |
| `IMPLEMENTATION_SUMMARY.md` | What was built |
| `mobile/src/services/api.ts` | API client configuration |
| `mobile/android/app/build.gradle` | Android build config |
| `mobile/App.tsx` | Main app component |

## Deployment Timeline

1. **Backend Deployment**: 5-10 minutes
2. **Mobile App Configuration**: 2 minutes
3. **Development Testing**: 10-15 minutes
4. **Release Build**: 5-10 minutes
5. **Google Play Publishing**: 2-4 hours (review time)

## Support

- **Issues**: Check DEPLOYMENT.md troubleshooting section
- **React Native**: https://reactnative.dev/docs/getting-started
- **Android**: https://developer.android.com/docs
- **Render**: https://render.com/docs

## Next Steps

1. ✅ Read DEPLOYMENT_CHECKLIST.md
2. ✅ Deploy backend to Render
3. ✅ Update API URL in mobile app
4. ✅ Test on Android emulator
5. ✅ Build release APK
6. ✅ Test on physical device
7. ✅ Publish to Google Play Store (optional)

Everything is ready to deploy!
