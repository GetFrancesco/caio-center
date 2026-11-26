import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import axe from 'axe-core';
import { JSDOM } from 'jsdom';
import { describe, expect, it } from 'vitest';
import { NAV, pagePath, renderPartials } from '../src/partials/site.js';
import { pages } from '../vite.config.js';

const SITE = 'https://caio.center';
const root = resolve(import.meta.dirname, '..');
const sitemap = readFileSync(resolve(root, 'public/sitemap.xml'), 'utf8');

// Le pagine come le serve Vite: sorgente + partial.
const render = (file) => renderPartials(readFileSync(resolve(root, file), 'utf8'), pagePath(file));
const load = (file) => new JSDOM(render(file)).window.document;
const urlOf = (file) => `${SITE}/${file.replace(/index\.html$/, '')}`;

describe.each(Object.values(pages))('%s', (file) => {
  const doc = load(file);
  const meta = (key) =>
    doc.querySelector(`meta[name="${key}"], meta[property="${key}"]`)?.getAttribute('content') ?? '';

  it('ha lingua, title e description', () => {
    expect(doc.documentElement.lang).toBe('it');
    expect(doc.title.length).toBeGreaterThan(10);
    expect(doc.title.length).toBeLessThanOrEqual(70);
    expect(meta('description').length).toBeGreaterThan(50);
    expect(meta('description').length).toBeLessThanOrEqual(170);
  });

  it('ha canonical e og:url coerenti con il percorso', () => {
    const url = urlOf(file);
    expect(doc.querySelector('link[rel="canonical"]').href).toBe(url);
    expect(meta('og:url')).toBe(url);
    expect(sitemap).toContain(`<loc>${url}</loc>`);
  });

  it('è condivisibile sui social', () => {
    for (const key of ['og:type', 'og:title', 'og:description', 'og:image', 'og:image:alt', 'twitter:title']) {
      expect(meta(key), key).not.toBe('');
    }
    expect(meta('og:locale')).toBe('it_IT');
    expect(meta('og:image')).toMatch(/^https:\/\/caio\.center\/og\/.+\.png$/);
    expect(meta('twitter:card')).toBe('summary_large_image');
    const image = meta('og:image').replace(SITE, 'public');
    expect(() => readFileSync(resolve(root, image))).not.toThrow();
  });

  it('ha JSON-LD valido con schema.org', () => {
    const blocks = [...doc.querySelectorAll('script[type="application/ld+json"]')];
    expect(blocks.length).toBeGreaterThan(0);
    for (const block of blocks) {
      const data = JSON.parse(block.textContent);
      expect(data['@context']).toBe('https://schema.org');
      expect(data['@graph'].some((node) => node.url === urlOf(file))).toBe(true);
    }
  });

  it('ha una struttura accessibile', () => {
    expect(doc.querySelectorAll('h1')).toHaveLength(1);
    expect(doc.querySelectorAll('main')).toHaveLength(1);
    expect(doc.querySelector('header')).not.toBeNull();
    expect(doc.querySelector('footer')).not.toBeNull();
    for (const img of doc.querySelectorAll('img')) expect(img.hasAttribute('alt')).toBe(true);
  });

  it('non usa stili inline e include header e footer', () => {
    const source = readFileSync(resolve(root, file), 'utf8');
    expect(source).not.toMatch(/\sstyle="/);
    expect(doc.querySelectorAll('.topbar')).toHaveLength(1);
    expect(doc.querySelectorAll('footer')).toHaveLength(1);
    const path = pagePath(file);
    const inMenu = NAV.some((item) => item.href === path) || path === '/contatti/';
    const current = [...doc.querySelectorAll('[aria-current="page"]')].map((a) => a.getAttribute('href'));
    expect(current).toEqual(inMenu ? [path] : []);
  });

  it('non rimanda a LinkedIn, YouTube o a un test online', () => {
    const html = render(file);
    expect(html).not.toMatch(/linkedin|youtube/i);
    expect(html).not.toMatch(/href="#test"/);
    expect(html).not.toMatch(/Inizia il test/);
  });

  it('collega contatti, privacy, cookie e la mail', () => {
    const html = render(file);
    expect(html).toContain('href="/contatti/"');
    expect(html).toContain('href="/protezione-dei-dati/"');
    expect(html).toContain('href="/cookie/"');
    expect(html).toContain('href="mailto:info@indoostry.com"');
  });

  it('non ha violazioni axe', async () => {
    const { window } = new JSDOM(render(file), { runScripts: 'outside-only' });
    window.eval(axe.source);
    // jsdom non calcola il layout: il contrasto va verificato nel browser.
    const result = await window.axe.run(window.document, { rules: { 'color-contrast': { enabled: false } } });
    const violations = result.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(', ')}`);
    expect(violations).toEqual([]);
  });
});

describe('moduli', () => {
  const home = render('index.html');

  it('il test della home porta al modulo contatti', () => {
    expect(home).toContain('href="#contatti"');
    expect(home).toContain('Scrivici per ricevere il test e la valutazione gratuita');
    expect(home).toContain('name="contatti"');
    expect(home).toContain('value="Test e valutazione gratuita"');
    expect(home).toContain('data-netlify="true"');
    expect(home).toContain('action="/grazie/"');
    expect(home).toContain('name="newsletter"');
    expect(home).not.toContain('type="button"');
  });

  it.each(['diventa-caio/index.html', 'selezione/index.html', 'contatti/index.html'])(
    '%s invia il modulo contatti a Netlify',
    (file) => {
      const html = render(file);
      expect(html).toContain('name="contatti"');
      expect(html).toContain('data-netlify="true"');
      expect(html).toContain('name="email"');
      expect(html).toContain('action="/grazie/"');
    },
  );
});

describe('grazie', () => {
  const html = readFileSync(resolve(root, 'grazie/index.html'), 'utf8');

  it('conferma l’invio e non entra nella sitemap', () => {
    expect(html).toContain('noindex');
    expect(html).toContain('Messaggio inviato');
    expect(sitemap).not.toContain('/grazie/');
  });
});
