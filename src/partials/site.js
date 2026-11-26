/*
 * Partial condivisi tra le pagine. Le pagine li richiamano con un commento
 * <!-- partial:nome --> e il plugin in vite.config.js li sostituisce in build e in dev.
 */

export const NAV = [
  { href: '/', label: 'Per le aziende' },
  { href: '/diventa-caio/', label: 'Diventa CAIO' },
  { href: '/selezione/', label: 'Per i selezionatori' },
];

/** Destinatario di mailto e delle notifiche Netlify. Non è configurabile dal toml. */
export const CONTACT_EMAIL = 'info@indoostry.com';

const LOGO = 'caio<span class="brand-dot">.</span>center';

const REQUESTS = {
  '/': 'Test e valutazione gratuita',
  '/diventa-caio/': 'Candidatura alla rete',
  '/selezione/': 'Valutazione candidati',
};

const PLACEHOLDERS = {
  '/': 'Vorrei il test e la valutazione gratuita.',
  '/diventa-caio/': 'Vorrei candidarmi alla rete.',
  '/selezione/': 'Vorrei una valutazione dei candidati.',
};

function escapeAttr(value) {
  return value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
}

/** Barra in alto con logo e menu; `current` è il percorso della pagina ("/", "/selezione/"). */
export function header(current) {
  const links = NAV.map(({ href, label }) => {
    const aria = href === current ? ' aria-current="page"' : '';
    return `<a class="nav-link" href="${href}"${aria}>${label}</a>`;
  }).join('\n');
  const contattiCurrent = current === '/contatti/' ? ' aria-current="page"' : '';
  return `<div class="container topbar">
<a class="logo" href="/" aria-label="caio.center, pagina per le aziende">${LOGO}</a>
<nav class="nav" aria-label="Menu principale">
${links}
<a class="btn btn-accent btn-sm" href="/contatti/"${contattiCurrent}>Contatti</a>
</nav>
</div>`;
}

export function footer() {
  const links = [...NAV, { href: '/contatti/', label: 'Contatti' }]
    .map(({ href, label }) => `<a class="nav-link footer-link" href="${href}">${label}</a>`)
    .join('\n');
  return `<footer class="site-footer">
<div class="container footer-inner">
<div class="col basis-300 stack gap-12">
<p class="footer-logo">${LOGO}</p>
<p>Chief AI Officer per la tua impresa</p>
<p>Un servizio di Indoostry Group SA, Lugano</p>
<p><a class="nav-link footer-link" href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a></p>
</div>
<div class="stack gap-4">
${links}
</div>
<div class="stack gap-4">
<a class="nav-link footer-link" href="/protezione-dei-dati/">Protezione dei dati</a>
<a class="nav-link footer-link" href="/cookie/">Informativa sui cookie</a>
</div>
<p class="footer-legal">I contenuti di questo sito sono informazione generale e non consulenza legale.</p>
</div>
</footer>`;
}

/** Modulo contatti Netlify. Su home, diventa-caio e selezione il motivo è già scelto. */
export function contactForm(current) {
  const preset = REQUESTS[current];
  const placeholder = PLACEHOLDERS[current] ?? '';
  const placeholderAttr = placeholder ? ` placeholder="${escapeAttr(placeholder)}"` : '';
  const requestField = preset
    ? `<input type="hidden" name="richiesta" value="${escapeAttr(preset)}">`
    : `<label class="font-display fw-500" for="contatti-richiesta">Motivo</label>
<select class="input" id="contatti-richiesta" name="richiesta" required>
<option value="">Scegli il motivo</option>
<option>Test e valutazione gratuita</option>
<option>Candidatura alla rete</option>
<option>Valutazione candidati</option>
<option>Protezione dei dati</option>
<option>Altra richiesta</option>
</select>`;

  return `<form class="col basis-380 stack gap-12" name="contatti" method="POST" action="/grazie/" data-netlify="true" netlify-honeypot="bot-field">
<input type="hidden" name="form-name" value="contatti">
<input type="hidden" name="subject" value="caio.center: nuova richiesta">
<input type="hidden" name="pagina" value="${escapeAttr(current)}">
<p hidden>
<label>Non compilare questo campo <input name="bot-field" tabindex="-1" autocomplete="off"></label>
</p>
<p class="form-error" id="contatti-error" data-form-error aria-live="assertive"></p>
<label class="font-display fw-500" for="contatti-nome">Nome</label>
<input class="input" id="contatti-nome" name="nome" type="text" autocomplete="name" required>
<label class="font-display fw-500" for="contatti-email">E-mail</label>
<input class="input" id="contatti-email" name="email" type="email" autocomplete="email" required>
<label class="font-display fw-500" for="contatti-azienda">Azienda (facoltativa)</label>
<input class="input" id="contatti-azienda" name="azienda" type="text" autocomplete="organization">
${requestField}
<label class="font-display fw-500" for="contatti-messaggio">Messaggio</label>
<textarea class="input" id="contatti-messaggio" name="messaggio" rows="4" required${placeholderAttr}></textarea>
<button class="btn btn-navy submit" type="submit">Invia la richiesta</button>
<p class="fs-14">Oppure scrivi a <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>. <a href="/protezione-dei-dati/">Protezione dei dati</a>.</p>
</form>`;
}

const PARTIALS = { header, footer, form: contactForm };

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
