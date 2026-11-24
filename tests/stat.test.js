import { describe, expect, it } from 'vitest';
import { formatStat, parseStat } from '../src/stat.js';

describe('parseStat', () => {
  it('legge interi con suffisso', () => {
    expect(parseStat('56%')).toEqual({ value: 56, decimals: 0, suffix: '%' });
  });

  it('legge decimali con la virgola', () => {
    expect(parseStat(' 4,5x ')).toEqual({ value: 4.5, decimals: 1, suffix: 'x' });
  });

  it('ignora testi che non iniziano con un numero', () => {
    expect(parseStat('circa 10')).toBeNull();
  });
});

describe('formatStat', () => {
  it('usa la virgola italiana', () => {
    expect(formatStat(4.5, 1, 'x')).toBe('4,5x');
    expect(formatStat(12.7, 0, '%')).toBe('13%');
  });
});
