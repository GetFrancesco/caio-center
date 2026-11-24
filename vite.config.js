import { resolve } from 'node:path';
import { defineConfig } from 'vite';

// Una entry per pagina: aggiungere qui ogni nuovo index.html.
export const pages = {
  home: 'index.html',
  diventaCaio: 'diventa-caio/index.html',
  selezione: 'selezione/index.html',
};

export default defineConfig({
  build: {
    rollupOptions: {
      input: Object.fromEntries(
        Object.entries(pages).map(([name, file]) => [name, resolve(import.meta.dirname, file)]),
      ),
    },
  },
  test: {
    environment: 'node',
  },
});
