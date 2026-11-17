
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      manifest: {
        name: 'ShelfLife AI',
        short_name: 'ShelfLife',
        description: 'Grocery inventory and expiration date tracker',
        theme_color: '#174C39',
        background_color: '#F7F3E8',
        display: 'standalone',
        start_url: '/',
      },
    }),
  ],
})
