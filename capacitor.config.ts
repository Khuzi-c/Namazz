import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.namazz.app',
  appName: 'Namazz',
  webDir: 'out',
  server: {
    // ⚠️ CRITICAL: Replace this with your DEPLOYED Vercel URL (e.g., https://your-app.vercel.app)
    // for the app to work on phones (Middleware/Auth requires a real server).
    // For local dev, use http://10.0.2.2:3000 (Android Emulator)
    url: 'http://10.0.2.2:3000',
    cleartext: true
  }
};

export default config;
