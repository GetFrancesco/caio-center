# AGENTS.md

Sito marketing di caio.center, in italiano, pubblicato su Netlify. Tre pagine:

- `/` home per le aziende
- `/diventa-caio/` percorso per futuri CAIO
- `/selezione/` per le società di selezione

## Stato attuale

- Build con Vite multi-pagina; le pagine sono registrate in `vite.config.js`.
- Netlify esegue `npm run build` e pubblica `dist/`.
- `src/main.js` carica il CSS condiviso, i font (Fontsource) e le animazioni (`src/motion.js`).
- Meta, Open Graph, Twitter Card e JSON-LD sono scritti a mano nell'head di ogni pagina; `tests/pages.test.js` li verifica.
- Header (barra con logo e menu) e footer sono partial in `src/partials/site.js`: le pagine li richiamano con `<!-- partial:header -->` e `<!-- partial:footer -->` e il plugin in `vite.config.js` li inserisce in dev e in build.
- Tutti gli stili stanno in `src/styles.css`: token in `:root`, poi base, layout, componenti e in fondo poche utility (`row`, `stack`, `col basis-*`, `gap-*`, `fs-*`, `c-*`). Le pagine non usano `style` inline (lo verifica un test).
- Contatti, test gratuito e lettera settimanale passano dai moduli Netlify `contatti` e `newsletter` e da `info@indoostry.com`. Le notifiche email si attivano nel pannello Netlify (commento in `netlify.toml`): il destinatario non si può dichiarare nel file di build.
- Footer: Protezione dei dati (`/protezione-dei-dati/`) e informativa cookie (`/cookie/`). Il sito non imposta cookie di tracciamento e non ha un banner.

Ogni modifica deve avvicinare il sito alle regole qui sotto, senza riscritture non richieste.

## Regole

### Design KISS

- La soluzione più semplice che funziona. Niente dipendenze, astrazioni o configurazioni senza un bisogno concreto.
- HTML semantico prima di JavaScript. Una pagina di contenuto deve leggersi anche con JS disattivato.
- Niente `style` inline. Colori e font solo tramite i token di `src/styles.css`; prima un componente esistente, poi le utility, e solo dopo una classe nuova.

### Mobile first

- Si scrive il CSS per lo schermo stretto e si allarga con `min-width` media query.
- Nessuno scroll orizzontale a 320px. Aree di tocco di almeno 44x44px.
- Immagini responsive (`srcset`/`sizes`, `loading="lazy"` sotto la piega, `width` e `height` sempre presenti).

### Accessibile

- Obiettivo WCAG 2.2 AA.
- Un solo `<h1>` per pagina, gerarchia dei titoli senza salti, landmark (`header`, `nav`, `main`, `footer`).
- Contrasto minimo 4.5:1 per il testo, focus visibile, tutto usabile da tastiera.
- `alt` significativo sulle immagini di contenuto, `alt=""` su quelle decorative.
- Animazioni solo con `prefers-reduced-motion: no-preference`; il contenuto non dipende mai da un'animazione per diventare visibile.
- Form con `<label>` associate ed errori annunciati.

### Vite per la build

- Build con Vite in modalità multi-pagina: un input in `build.rollupOptions.input` per ogni `index.html`.
- Output in `dist/`; Netlify esegue `npm run build` e pubblica `dist`.
- Script: `dev`, `build`, `preview`, `test`, `lint`.
- Dipendenze da npm con versioni fissate, niente script da CDN quando si può fare il bundle.

### SEO oriented

- Ogni pagina ha `<title>` unico, `meta description`, `link rel="canonical"` e `lang="it"`.
- Contenuto principale nell'HTML servito, non generato solo lato client.
- Quando si aggiunge o rimuove una pagina: aggiornare `vite.config.js`, `public/sitemap.xml`, `public/llms.txt` e le immagini in `scripts/og-images.js`.
- URL brevi, in minuscolo, con trattini e slash finale come quelli esistenti.
- Core Web Vitals: niente layout shift da font o immagini, JS e CSS minimi sul percorso critico.

### GEO oriented

Ottimizzazione per i motori generativi (ChatGPT, Perplexity, Gemini, AI Overviews):

- Dati strutturati JSON-LD: `Organization` e `WebSite` in home, `Service` o `WebPage` per le altre pagine, `FAQPage` dove ci sono domande e risposte.
- Frasi autonome e citabili: definizioni chiare (cos'è un CAIO, cosa fa, per chi), numeri con la fonte accanto.
- Titoli che rispondono a domande reali; risposta nelle prime righe della sezione.
- Nomi coerenti per entità e norme (AI Act, ISO/IEC 42001, UNI 11621-8, Metodo Statera).
- `llms.txt` in radice con descrizione del sito e link alle pagine.

### Condivisibile sui social

- Ogni pagina ha Open Graph (`og:title`, `og:description`, `og:url`, `og:image`, `og:type`, `og:locale` = `it_IT`) e `twitter:card` = `summary_large_image`.
- Immagine di condivisione 1200x630, sotto i 300 KB, con URL assoluto.
- Verificare l'anteprima con i validatori di LinkedIn e Facebook prima di pubblicare.

### Software modulare e testabile

- Sezioni ripetute (header, footer, card, CTA) in partial o componenti riusabili, non copiate tra pagine.
- Logica JS in moduli ES piccoli con una sola responsabilità, senza effetti collaterali all'import.
- Test con Vitest per la logica; un test che controlla su ogni pagina buildata la presenza di title, description, canonical, OG e JSON-LD valido.
- Controllo accessibilità automatico (axe) nella suite di test.
- Lint e format con Biome.

## Prima di consegnare

1. `npm run build` e `npm test` passano.
2. Pagina controllata a 375px e a 1440px.
3. Navigazione da tastiera e contrasto verificati sulle parti toccate.
4. Meta, OG e JSON-LD presenti e coerenti con il contenuto.
