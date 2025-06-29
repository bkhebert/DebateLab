import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import path from 'path'; // Needed for proper aliases

export default defineConfig({
  base: '',
  plugins: [react(), ],
  build: {
    
    outDir: 'dist',
    sourcemap: false, // disable for production
    rollupOptions: { // Added for better asset handling
       input: 'src/main.tsx',
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
             entryFileNames: "assets/[name]-[hash].js", // Cache-busting hashes
      }
    }
  },
  server: {
    port: 5173,
    strictPort: true,
  },
  preview: {
    port: 4173,
  },
  esbuild: {
    tsconfigRaw: '{}',
  },
  resolve: {
    alias: {
      '@assets': path.resolve(__dirname, './src/assets'), // More reliable path resolution
      // Add other aliases you might need:
      
    },
  },
});