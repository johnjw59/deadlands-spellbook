import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico'],
      // TODO: add pwa-192x192.png, pwa-512x512.png, maskable-icon.png, apple-touch-icon.png
      manifest: {
        name: 'Deadlands Weird West Spellbook',
        short_name: 'DeadlandsSpellbook',
        description: 'Spellbook and character tracker for Savage Worlds Adventure Edition: Deadlands',
        theme_color: '#D4A02A',
        background_color: '#160B05',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
    }),
  ],
});
