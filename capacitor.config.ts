import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ie.synctech.admin',
  appName: 'SYNCTECH Admin Portal',
  webDir: 'out',
  server: {
    // This is required for Next.js to work with Capacitor
    // It tells Capacitor to run the next build command before copying the assets
    preBuild: 'npm run build',
  },
};

export default config;
