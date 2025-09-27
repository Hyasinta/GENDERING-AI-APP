// ...existing code...
// Root App bridge for Expo's AppEntry
// Re-export the real app implementation in /mobile so node_modules/expo/AppEntry.js can import '../../App'
let appModule;
try {
  // prefer compiled JS if present, fall back to TSX source
  appModule = require('./mobile/App');
} catch (err) {
  const e = new Error(
    `Failed to require ./mobile/App from root App.js. Ensure ./mobile/App(.js/.tsx) exists with correct casing. Original: ${err.message}`
  );
  e.stack = err.stack;
  throw e;
}

const App = appModule && appModule.default ? appModule.default : appModule;
export default App;
// ...existing code...