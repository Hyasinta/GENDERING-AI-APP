# Gendering AI Conference – Mobile (Expo React Native)

Runs on Android and iOS using Expo.

## Prereqs
- Node 18+
- Expo Go app on your phone (Android/iOS) for quick testing
- Optionally Android Studio (Android) or Xcode (iOS) for device simulators

## Install & run
```bash
cd mobile
npm install
npm run start
```
Then scan the QR in the terminal/Expo Dev Tools with the Expo Go app, or press `a` for Android emulator, `i` for iOS simulator (macOS required).

## Features
- Registration screen stored locally (AsyncStorage)
- Agenda list with "Add to Schedule"
- Personal schedule with countdown to next event

## Build (optional)
You can use EAS Build to create installable binaries:
```bash
npm i -g eas-cli
cd mobile
npx expo prebuild # optional, for native projects
eas build -p android
# On macOS for iOS builds:
eas build -p ios
```





