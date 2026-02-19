import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

// Get all tj-*.js files from src/ as entry points
const entries = {};
const srcDir = resolve(__dirname, 'src');

fs.readdirSync(srcDir).forEach((folder) => {
  const folderPath = resolve(srcDir, folder);
  if (fs.statSync(folderPath).isDirectory()) {
    const indexPath = resolve(folderPath, 'index.js');
    if (fs.existsSync(indexPath)) {
      entries[folder] = indexPath;
    }
  }
});


export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    lib: {
      entry: entries,
      formats: ['es'],
    },
    rollupOptions: {
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
        manualChunks: undefined,
      },
    },
    assetsInlineLimit: 100000000, // Inline assets
  },
});
