# Building the APK on Your Local Machine

Due to complex Android build environment requirements, the APK needs to be built on your local machine with Android Studio properly configured.

## Prerequisites

1. **Android Studio** - Download from https://developer.android.com/studio
2. **Android SDK** - API 33 or higher
3. **Java Development Kit (JDK)** - Version 11 or higher
4. **Node.js** - Version 16 or higher

## Steps to Build APK

### 1. Clone the Repository
```bash
git clone https://github.com/primeclawd/habittracker.git
cd habittracker/mobile
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Build the APK

**Option A: Using Android Studio (Recommended)**
1. Open Android Studio
2. Select "Open an Existing Project"
3. Navigate to `habittracker/mobile/android`
4. Wait for Gradle sync to complete
5. Go to Build → Build Bundle(s) / APK(s) → Build APK(s)
6. APK will be generated at: `android/app/build/outputs/apk/release/app-release.apk`

**Option B: Using Command Line**
```bash
cd mobile
npx react-native run-android --mode=release
```

Or directly with Gradle:
```bash
cd mobile/android
./gradlew assembleRelease
```

### 4. Install on Device
```bash
adb install android/app/build/outputs/apk/release/app-release.apk
```

## Troubleshooting

If you encounter build errors:

1. Run `npx react-native doctor` to check your environment
2. Ensure Android SDK is properly installed
3. Update Gradle: `./gradlew wrapper --gradle-version 8.3`
4. Clear cache: `./gradlew clean`

## APK Location

Once built, your APK will be at:
```
habittracker/mobile/android/app/build/outputs/apk/release/app-release.apk
```

## Testing the APK

1. Connect your Android device via USB
2. Enable USB debugging on your device
3. Run: `adb install app-release.apk`
4. Launch the app and test:
   - Register a new account
   - Create a habit
   - Mark habit as done
   - Check streaks and stats

## Backend Configuration

Make sure your backend is deployed to Render:
- API URL: https://habit-tracker-api-xp5g.onrender.com
- The mobile app is already configured to use this URL

## Support

For more information:
- React Native: https://reactnative.dev/docs/getting-started
- Android Development: https://developer.android.com/docs
- Gradle: https://gradle.org/

