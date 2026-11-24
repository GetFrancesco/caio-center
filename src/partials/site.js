/*
 * Partial condivisi tra le pagine. Le pagine li richiamano con un commento
 * <!-- partial:nome --> e il plugin in vite.config.js li sostituisce in build e in dev.
 */

export const NAV = [
  { href: '/', label: 'Per le aziende' },
  { href: '/diventa-caio/', label: 'Diventa CAIO' },
  { href: '/selezione/', label: 'Per i selezionatori' },
];

const LOGO = 'caio<span class="brand-dot">.</span>center';

/** Barra in alto con logo e menu; `current` è il percorso della pagina ("/", "/selezione/"). */
export function header(current) {
  const links = NAV.map(({ href, label }) => {
    const aria = href === current ? ' aria-current="page"' : '';
    return `<a class="nav-link" href="${href}"${aria}>${label}</a>`;
  }).join('\n');
  return `<div class="container topbar">
<a class="logo" href="/" aria-label="caio.center, pagina per le aziende">${LOGO}</a>
<nav class="nav" aria-label="Menu principale">
${links}
<a class="btn btn-accent btn-sm" href="#contatti">Contatti</a>
</nav>
</div>`;
}

export function footer() {
  const links = [...NAV, { href: '#contatti', label: 'Contatti' }]
    .map(({ href, label }) => `<a class="nav-link footer-link" href="${href}">${label}</a>`)
    .join('\n');
  return `<footer class="site-footer">
<div class="container footer-inner">
<div class="col basis-300 stack gap-12">
<p class="footer-logo">${LOGO}</p>
<p>Chief AI Officer per la tua impresa</p>
<p>Un servizio di Indoostry Group SA, Lugano</p>
</div>
<div class="stack gap-4">
${links}
</div>
<div class="stack gap-4">
<a class="nav-link footer-link" href="#top">LinkedIn</a>
<a class="nav-link footer-link" href="#top">YouTube</a>
<a class="nav-link footer-link" href="#top">Protezione dei dati</a>
</div>
<p class="footer-legal">I contenuti di questo sito sono informazione generale e non consulenza legale.</p>
</div>
</footer>`;
}

const PARTIALS = { header, footer };

/** Percorso pubblico di una pagina a partire dal file: "selezione/index.html" -> "/selezione/". */
export function pagePath(file) {
  return `/${file.replace(/^\/+/, '').replace(/index\.html$/, '')}`;
}

/** Sostituisce ogni <!-- partial:nome --> con il suo HTML. */
export function renderPartials(html, current) {
  return html.replace(/<!-- partial:([a-z]+) -->/g, (_match, name) => {
    const render = PARTIALS[name];
    if (!render) throw new Error(`Partial sconosciuto: ${name}`);
    return render(current);
  });
}
