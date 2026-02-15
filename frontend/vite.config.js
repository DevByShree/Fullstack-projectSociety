import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // ✅ Image assets fix for JPG imports
  assetsInclude: ['**/*.jpg', '**/*.jpeg', '**/*.png'],
  // ✅ Better asset handling
  build: {
    assetsInlineLimit: 4096, // Inline small assets
  },
  // ✅ Static assets from public folder
  publicDir: 'public',
  // ✅ Resolve aliases for assets
  resolve: {
    alias: {
      '@': '/src',
    }
  }
})
