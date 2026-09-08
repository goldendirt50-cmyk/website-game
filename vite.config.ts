import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['@pixiv/three-vrm'],
  },
  assetsInclude: ['**/*.vrm', '**/*.glb', '**/*.gltf'],
})
