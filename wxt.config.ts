import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'Precap',
    version: '1.0.0',
    permissions: ['aiSummarizer' as any, 'languageModel' as any, 'storage'],
    host_permissions: ['https://www.youtube.com/*'],
  },
});
