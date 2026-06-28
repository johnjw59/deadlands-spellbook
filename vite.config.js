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
      includeAssets: ['favicon.svg'],
      // TODO: add pwa-192x192.png, pwa-512x512.png, maskable-icon.png, apple-touch-icon.png
      manifest: {
        name: 'Deadlands Weird West Spellbook',
        short_name: 'DeadlandsSpellbook',
        description: 'Spellbook and character tracker for Savage Worlds Adventure Edition: Deadlands',
        theme_color: '#D5AA52',
        background_color: '#81652f',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          // TODO: add icons when assets are ready
        ]
      },
    }),
  ],
});
