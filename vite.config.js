import { defineConfig } from 'vite';
import { minifyHtml } from 'vite-plugin-html';
import { join } from 'path';
import { fileURLToPath } from 'url';

const root = (...paths) => join(fileURLToPath(import.meta.url), '..', ...paths);

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        root: root('index.html'),
        resume: root('resume', 'index.html'),
      },
    },
  },
  plugins: [
    minifyHtml(),
  ],
});
