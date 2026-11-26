// Genera le immagini di condivisione 1200x630 in public/og/ con Chrome headless.
// Uso: npm run og
// CHROME: percorso del browser. OG_ONLY=contatti.png,cookie.png per generarne solo alcune.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const CHROME = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const root = resolve(import.meta.dirname, '..');
const font = (pkg, weight) =>
  pathToFileURL(join(root, 'node_modules/@fontsource', pkg, `files/${pkg}-latin-${weight}-normal.woff2`)).href;

const cards = [
  { file: 'home.png', eyebrow: 'Per le aziende', title: 'Il Chief AI Officer per la tua impresa' },
  { file: 'diventa-caio.png', eyebrow: 'Diventa CAIO', title: 'Diventa Chief AI Officer nella rete caio.center' },
  { file: 'selezione.png', eyebrow: 'Per i selezionatori', title: 'Valutiamo i candidati Chief AI Officer con voi' },
  { file: 'contatti.png', eyebrow: 'Contatti', title: 'Scrivi a caio.center' },
  { file: 'protezione-dei-dati.png', eyebrow: 'Protezione dei dati', title: 'Come trattiamo i dati personali' },
  { file: 'cookie.png', eyebrow: 'Cookie', title: 'Questo sito non usa cookie' },
];

const html = ({ eyebrow, title }) => `<!doctype html><html lang="it"><head><meta charset="utf-8"><style>
@font-face{font-family:Poppins;font-weight:600;src:url(${font('poppins', 600)})}
@font-face{font-family:Poppins;font-weight:700;src:url(${font('poppins', 700)})}
@font-face{font-family:Inter;font-weight:500;src:url(${font('inter', 500)})}
html,body{margin:0;width:1200px;height:630px;overflow:hidden}
body{background:#111827;color:#fff;font-family:Inter,sans-serif;display:flex;flex-direction:column;justify-content:space-between;padding:72px 80px;box-sizing:border-box;border-bottom:12px solid #FF6A3D}
.logo{font-family:Poppins;font-weight:700;font-size:44px;letter-spacing:-.01em}
.dot{color:#FF6A3D}
.eyebrow{font-weight:500;font-size:26px;color:#AEB6C4;margin:0 0 20px}
h1{font-family:Poppins;font-weight:600;font-size:72px;line-height:1.08;letter-spacing:-.02em;margin:0;max-width:1000px}
.foot{font-size:24px;color:#D5DAE3}
</style></head><body>
<div class="logo">caio<span class="dot">.</span>center</div>
<div><p class="eyebrow">${eyebrow}</p><h1>${title}<span class="dot">.</span></h1></div>
<div class="foot">Europa e Svizzera</div>
</body></html>`;

const only = process.env.OG_ONLY?.split(',').filter(Boolean);
const selected = only?.length ? cards.filter((card) => only.includes(card.file)) : cards;

const tmp = mkdtempSync(join(tmpdir(), 'og-'));
try {
  for (const card of selected) {
    const page = join(tmp, `${card.file}.html`);
    writeFileSync(page, html(card));
    execFileSync(CHROME, [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--hide-scrollbars',
      '--force-device-scale-factor=1',
      '--window-size=1200,630',
      `--user-data-dir=${join(tmp, 'profile')}`,
      `--screenshot=${join(root, 'public/og', card.file)}`,
      pathToFileURL(page).href,
    ]);
    console.log('og', card.file);
  }
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
