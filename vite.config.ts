import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      css: {
        // Configure PostCSS inline so Vite handles it natively.
        // This avoids ESM/CJS mismatch when postcss-load-config tries to require() the config file.
        postcss: {
          plugins: [
            tailwindcss({ config: './tailwind.config.js' }),
            autoprefixer(),
          ],
        },
      },
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        rollupOptions: {
          output: {
            manualChunks: {
              // Core React runtime — loads first
              'vendor-react': ['react', 'react-dom', 'react-router-dom'],
              // Chart library — only needed on dashboard pages
              'vendor-charts': ['recharts'],
              // Firebase SDK — large, lazy-load separately
              'vendor-firebase': ['firebase/app', 'firebase/firestore', 'firebase/storage', 'firebase/auth'],
            }
          }
        },
        chunkSizeWarningLimit: 800,
      }
    };
});
