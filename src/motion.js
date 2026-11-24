import { animate, hover, inView, press, scroll, stagger } from 'motion';
import { formatStat, parseStat } from './stat.js';

/*
 * Animazioni della pagina con Motion.
 * Partono solo con prefers-reduced-motion: no-preference e, se qualcosa
 * fallisce, il contenuto nascosto torna visibile.
 */

const SPRING = { type: 'spring', visualDuration: 0.7, bounce: 0.1 };
const GESTURE = { type: 'spring', stiffness: 500, damping: 30 };

const hidden = [];

function show(els) {
  for (const el of [].concat(els)) {
    el.style.opacity = '';
    el.style.transform = '';
  }
}

function hide(els, y) {
  for (const el of els) {
    animate(el, { opacity: 0, y }, { duration: 0 });
    hidden.push(el);
  }
}

function reveal(els, delay) {
  try {
    animate(els, { opacity: 1, y: 0 }, { delay, ...SPRING });
  } catch {
    show(els);
  }
}

function isCard(el) {
  const cs = getComputedStyle(el);
  return (
    Number.parseFloat(cs.borderTopLeftRadius) > 0 ||
    cs.backgroundColor !== 'rgba(0, 0, 0, 0)' ||
    el.classList.contains('card')
  );
}

/** Raggruppa i figli di una sezione: le righe flex si animano insieme. */
function collect(el, depth, out) {
  for (const c of el.children) {
    if (c.tagName === 'STYLE' || c.tagName === 'SCRIPT') continue;
    const cs = getComputedStyle(c);
    const n = c.children.length;
    const flex = cs.display === 'flex';
    if (flex && cs.flexDirection === 'row' && n >= 2 && !isCard(c) && c.tagName !== 'NAV') {
      out.push([...c.children]);
    } else if (
      flex &&
      cs.flexDirection === 'column' &&
      n >= 3 &&
      depth < 2 &&
      !isCard(c) &&
      c.tagName !== 'UL' &&
      c.tagName !== 'FORM'
    ) {
      collect(c, depth + 1, out);
    } else {
      out.push([c]);
    }
  }
}

function progressBar() {
  const bar = document.createElement('div');
  bar.setAttribute('aria-hidden', 'true');
  bar.style.cssText =
    'position:fixed;top:0;left:0;right:0;height:3px;background:#FF6A3D;transform-origin:0 50%;transform:scaleX(0);z-index:1000;pointer-events:none';
  document.documentElement.appendChild(bar);
  scroll(animate(bar, { scaleX: [0, 1] }, { ease: 'linear' }));
}

function heroEntrance() {
  const hero = document.getElementById('top');
  if (!hero) return;
  const items = hero.firstElementChild ? [...hero.firstElementChild.children] : [];
  if (hero.children[1]) items.push(hero.children[1]);
  hide(items, 20);
  reveal(items, stagger(0.09, { startDelay: 0.1 }));
}

function sectionReveal() {
  for (const sec of document.querySelectorAll('section')) {
    if (sec.id === 'selezione') continue;
    if (sec.id === 'contatti') {
      const block = sec.querySelector('[data-contatti-block]');
      if (block) {
        hide([block], 16);
        inView(block, () => reveal([block], 0), { amount: 0.05 });
      }
      continue;
    }
    const first = sec.firstElementChild;
    const container =
      sec.children.length === 1 && first.tagName === 'DIV' && getComputedStyle(first).maxWidth !== 'none' ? first : sec;
    const groups = [];
    collect(container, 0, groups);
    groups.forEach((grp, gi) => {
      hide(grp, gi === 0 ? 28 : 16);
      inView(grp[0], () => reveal(grp, stagger(gi === 0 ? 0.05 : 0.07)), {
        amount: 0.1,
        margin: '0px 0px -8% 0px',
      });
    });
  }
}

/** Sezione "società di selezione": linea che si apre, testo da sinistra, CTA a molla. */
function selectionSection() {
  const sel = document.getElementById('selezione');
  if (!sel) return;
  const line = sel.querySelector('[data-sel-line]');
  const copy = [...sel.querySelectorAll('[data-sel-copy] > *')];
  const cta = sel.querySelector('[data-sel-cta]');
  if (line) animate(line, { scaleX: 0 }, { duration: 0 });
  for (const el of copy) {
    animate(el, { opacity: 0, x: -40 }, { duration: 0 });
    hidden.push(el);
  }
  if (cta) {
    animate(cta, { opacity: 0, scale: 0.85 }, { duration: 0 });
    hidden.push(cta);
  }
  inView(
    sel,
    () => {
      try {
        if (line) animate(line, { scaleX: 1 }, { duration: 0.9, ease: [0.22, 1, 0.36, 1] });
        animate(
          copy,
          { opacity: 1, x: 0 },
          { type: 'spring', visualDuration: 0.8, bounce: 0.15, delay: stagger(0.1, { startDelay: 0.15 }) },
        );
        if (cta) {
          animate(cta, { opacity: 1, scale: 1 }, { type: 'spring', visualDuration: 0.6, bounce: 0.35, delay: 0.5 });
        }
      } catch {
        show(copy);
        if (cta) show(cta);
        if (line) line.style.transform = '';
      }
    },
    { amount: 0.3 },
  );
}

/** Contatori in formato italiano con un leggero parallax. */
function counters() {
  for (const el of document.querySelectorAll('.stat-num')) {
    const text = el.textContent.trim();
    const stat = parseStat(text);
    if (!stat) continue;
    el.setAttribute('aria-label', text);
    el.textContent = formatStat(0, stat.decimals, stat.suffix);
    inView(
      el,
      () => {
        animate(0, stat.value, {
          duration: 1.4,
          ease: 'easeOut',
          onUpdate: (v) => {
            el.textContent = formatStat(v, stat.decimals, stat.suffix);
          },
          onComplete: () => {
            el.textContent = text;
          },
        });
      },
      { amount: 0.6 },
    );
    scroll(animate(el, { y: [10, -10] }, { ease: 'linear' }), {
      target: el,
      offset: ['start end', 'end start'],
    });
  }
}

/** Hover e press con molla (solo transform). */
function gestures() {
  const lift = (selector, from, to) =>
    hover(selector, (el) => {
      animate(el, to, GESTURE);
      return () => animate(el, from, GESTURE);
    });
  lift('.btn', { y: 0 }, { y: -2 });
  lift('.card', { y: 0, scale: 1 }, { y: -3, scale: 1.01 });
  lift('.text-link', { x: 0 }, { x: 3 });
  press('.btn', (el) => {
    animate(el, { scale: 0.97 }, GESTURE);
    return () => animate(el, { scale: 1 }, GESTURE);
  });
}

export function initMotion() {
  if (!window.matchMedia('(prefers-reduced-motion: no-preference)').matches) return;
  try {
    progressBar();
    heroEntrance();
    sectionReveal();
    selectionSection();
    counters();
    gestures();
  } catch {
    show(hidden);
  }
}
