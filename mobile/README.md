# Habit Tracker - Mobile App Setup

## Project Structure

```
mobile/
├── android/                 # Android native code
│   ├── app/
│   │   ├── build.gradle    # App build configuration
│   │   └── src/main/
│   │       ├── AndroidManifest.xml
│   │       ├── java/com/habittracker/
│   │       │   ├── MainActivity.java
│   │       │   └── MainApplication.java
│   │       └── res/
│   ├── build.gradle        # Project build configuration
│   └── settings.gradle
├── src/
│   ├── screens/
│   │   ├── AuthScreen.tsx      # Login/Register
│   │   └── DashboardScreen.tsx # Habit list
│   ├── components/
│   │   ├── HabitCard.tsx       # Individual habit display
│   │   └── AddHabitModal.tsx   # Add habit form
│   └── services/
│       └── api.ts             # API client
├── App.tsx                 # Main app component
├── index.js               # Entry point
├── package.json
├── tsconfig.json
├── babel.config.js
├── jest.config.js
└── react-native.config.js
```

## Installation

```bash
cd mobile
npm install
```

## Development

### Run on Android Emulator
```bash
npx react-native run-android
```

### Run on Physical Device
```bash
# Enable USB debugging on device
# Connect device via USB
npx react-native run-android
```

### Start Metro Bundler (if needed)
```bash
npx react-native start
```

## Configuration

### API Endpoint
Update `mobile/src/services/api.ts`:
```typescript
const API_BASE_URL = 'http://your-backend-url:5000';
```

## Building for Release

See DEPLOYMENT.md for detailed instructions on:
- Generating signing keys
- Building release APK/AAB
- Publishing to Google Play Store
