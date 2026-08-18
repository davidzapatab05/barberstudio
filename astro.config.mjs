// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import AstroPWA from '@vite-pwa/astro';

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    AstroPWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      devOptions: {
        enabled: true,
        navigateFallbackAllowlist: [/^\/$/]
      },
      manifest: {
        name: 'Geferson Maldonado Barber Studio',
        short_name: 'Geferson Studio',
        description: 'Barber Studio Premium',
        theme_color: '#030303',
        background_color: '#030303',
        display: 'standalone',
        icons: [
          {
            src: '/logo.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/logo.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        navigateFallback: '/',
        globPatterns: ['**/*.{css,js,html,svg,png,ico,txt}']
      }
    })
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});