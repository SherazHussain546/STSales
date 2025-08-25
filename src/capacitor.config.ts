import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ie.synctech.admin',
  appName: 'SYNC Admin Portal',
  webDir: 'out',
  server: {
    preBuild: 'npm run build',
  },
};

export default config;
