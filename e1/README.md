# E1 Launcher (Bare React Native)

NO EXPO. Android primary (launcher), iOS secondary (Guided Access guidance).

## Quick start

```bash
yarn install
npx react-native run-android  # dev run on Android device/emulator
```

iOS:

```bash
cd ios && pod install
npx react-native run-ios
```

## Release build (Android APK)

```bash
cd android
./gradlew assembleRelease
# APK: android/app/build/outputs/apk/release/
```

## Make E1 the launcher (Android)
- Install APK
- Press Home → choose E1 → Always
- To switch back: Settings → Apps → Default apps → Home app

## Kiosk / Device Owner (advanced)
See `PROVISION.md` for adb provisioning and recovery steps. Use a factory-reset test device.

## Tech stack
- RN 0.74 + Hermes, TS
- Navigation: @react-navigation/native + native-stack
- Animations: react-native-reanimated
- DB: react-native-sqlcipher-storage (SQLCipher)
- Secure storage: react-native-keychain
- OAuth: react-native-app-auth (Google Tasks, Todoist)
- Notifications: notifee

## License
Proprietary.