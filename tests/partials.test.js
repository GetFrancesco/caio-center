import { describe, expect, it } from 'vitest';
import { footer, header, NAV, pagePath, renderPartials } from '../src/partials/site.js';

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
});

describe('footer', () => {
  it('non segna pagine correnti', () => {
    expect(footer()).not.toContain('aria-current');
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
