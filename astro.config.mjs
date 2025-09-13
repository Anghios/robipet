import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [react(), tailwind({
    applyBaseStyles: false
  })],
  server: {
    port: 3000
  },
  vite: {
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:8081',
          changeOrigin: true,
          secure: false
        }
      }
    }
  }
});