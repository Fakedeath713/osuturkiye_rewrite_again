// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import swup from '@swup/astro';

export default defineConfig({
  vite: {
      server: {
        allowedHosts: [ '' ],
      },
      plugins: [tailwindcss()],
  },

  output: "server",
  integrations: [swup({
    ignore: [
      '/logout'
    ]
  })],
});