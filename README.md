# caio.center

Sito statico di caio.center, costruito con Vite e pubblicato su Netlify.

- `/` home per le aziende
- `/diventa-caio/` percorso per futuri CAIO
- `/selezione/` per le società di selezione
- `/contatti/` modulo e indirizzo email
- `/protezione-dei-dati/` informativa privacy
- `/cookie/` informativa cookie

I moduli `contatti` e `newsletter` sono Netlify Forms. L'invio finisce nel pannello del sito. La notifica a `info@indoostry.com` si attiva a mano: Forms → Submission notifications → Email notification. Se l'indirizzo non appartiene a un membro del team, Netlify chiede una conferma prima di inoltrare le mail. Il campo `email` del modulo imposta il Reply-to.

## Sviluppo

Serve Node 22 o successivo.

```bash
npm install
npm run dev
```

| Comando | Cosa fa |
| --- | --- |
| `npm run dev` | server di sviluppo |
| `npm run build` | build in `dist/` |
| `npm run preview` | serve la build |
| `npm test` | test su meta, JSON-LD, accessibilità e logica |
| `npm run lint` | controllo con Biome |
| `npm run og` | rigenera le immagini di condivisione in `public/og/` (serve Chrome) |

## Struttura

- `index.html`, `diventa-caio/index.html`, `selezione/index.html`, `contatti/index.html`, `protezione-dei-dati/index.html`, `cookie/index.html`: le pagine, registrate in `vite.config.js`. `grazie/index.html` è la conferma di invio (`noindex`, fuori dalla sitemap).
- `src/styles.css`: tutti gli stili (token, componenti, utility).
- `src/partials/site.js`: header e footer condivisi, inseriti da `<!-- partial:nome -->`.
- `src/motion.js`: animazioni (Motion).
- `public/`: file copiati così come sono (`robots.txt`, `sitemap.xml`, `llms.txt`, immagini OG, favicon).
- `tests/`: test Vitest.

Le regole di progetto sono in [AGENTS.md](AGENTS.md).
