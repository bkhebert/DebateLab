import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss'; // Changed from @tailwindcss/vite
import autoprefixer from 'autoprefixer'; // Missing import
import path from 'path'; // Needed for proper aliases

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        tailwindcss(), // Now using the standard Tailwind plugin
        autoprefixer(),
      ],
    },
    modules: {
      localsConvention: 'camelCase',
    },
    devSourcemap: false,
  },
  build: {
    assetsInlineLimit: 4096,
    emptyOutDir: true,
    rollupOptions: { // Added for better asset handling
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
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
      '@': path.resolve(__dirname, './src'),
    },
  },
});