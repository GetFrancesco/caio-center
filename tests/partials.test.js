import { describe, expect, it } from 'vitest';
import { CONTACT_EMAIL, contactForm, footer, header, NAV, pagePath, renderPartials } from '../src/partials/site.js';

describe('pagePath', () => {
  it('ricava il percorso pubblico dal file', () => {
    expect(pagePath('index.html')).toBe('/');
    expect(pagePath('selezione/index.html')).toBe('/selezione/');
    expect(pagePath('/diventa-caio/index.html')).toBe('/diventa-caio/');
  });
});

describe('header', () => {
  it('segna solo la pagina corrente', () => {
    const html = header('/selezione/');
    expect(html.match(/aria-current="page"/g)).toHaveLength(1);
    expect(html).toContain('href="/selezione/" aria-current="page"');
  });

  it('contiene tutte le voci del menu', () => {
    for (const { href } of NAV) expect(header('/')).toContain(`href="${href}"`);
  });

  it('il pulsante Contatti apre la pagina contatti', () => {
    expect(header('/')).toContain('href="/contatti/"');
    expect(header('/contatti/')).toContain('href="/contatti/" aria-current="page"');
  });
});

describe('footer', () => {
  it('non segna pagine correnti', () => {
    expect(footer()).not.toContain('aria-current');
  });

  it('porta a contatti, privacy e cookie, senza social', () => {
    const html = footer();
    expect(CONTACT_EMAIL).toBe('info@indoostry.com');
    expect(html).toContain(`href="mailto:${CONTACT_EMAIL}"`);
    expect(html).toContain('href="/contatti/"');
    expect(html).toContain('href="/protezione-dei-dati/"');
    expect(html).toContain('href="/cookie/"');
    expect(html).not.toMatch(/linkedin|youtube/i);
    expect(html).not.toContain('href="#top"');
  });
});

describe('contactForm', () => {
  it('è un modulo Netlify con il motivo già scelto sulla home', () => {
    const html = contactForm('/');
    expect(html).toContain('data-netlify="true"');
    expect(html).toContain('name="email"');
    expect(html).toContain('value="Test e valutazione gratuita"');
    expect(html).not.toContain('<select');
  });

  it('sulla pagina contatti fa scegliere il motivo', () => {
    expect(contactForm('/contatti/')).toContain('<select');
  });
});

describe('renderPartials', () => {
  it('sostituisce i segnaposto', () => {
    const html = renderPartials('<!-- partial:header -->\n<!-- partial:footer -->', '/');
    expect(html).toContain('class="container topbar"');
    expect(html).toContain('<footer class="site-footer">');
  });

  it('segnala i partial sconosciuti', () => {
    expect(() => renderPartials('<!-- partial:sidebar -->', '/')).toThrow('sidebar');
  });
});
