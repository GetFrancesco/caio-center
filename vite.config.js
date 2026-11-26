import { relative, resolve } from 'node:path';
import { defineConfig } from 'vite';
import { pagePath, renderPartials } from './src/partials/site.js';

// Una entry per pagina: aggiungere qui ogni nuovo index.html.
export const pages = {
  home: 'index.html',
  diventaCaio: 'diventa-caio/index.html',
  selezione: 'selezione/index.html',
  contatti: 'contatti/index.html',
  privacy: 'protezione-dei-dati/index.html',
  cookie: 'cookie/index.html',
};

/** Inserisce header e footer condivisi (src/partials) in ogni pagina. */
function partials() {
  return {
    name: 'caio-partials',
    transformIndexHtml: {
      order: 'pre',
      handler: (html, ctx) => renderPartials(html, pagePath(relative(import.meta.dirname, ctx.filename))),
    },
  };
}

export default defineConfig({
  plugins: [partials()],
  build: {
    rollupOptions: {
      input: {
        ...Object.fromEntries(Object.entries(pages).map(([name, file]) => [name, resolve(import.meta.dirname, file)])),
        grazie: resolve(import.meta.dirname, 'grazie/index.html'),
      },
    },
  },
  test: {
    environment: 'node',
  },
});
