import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/api/wiktionary': {
        target: 'https://en.wiktionary.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/wiktionary/, '/w/api.php')
      }
    }
  }
});