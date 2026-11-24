/**
 * Legge un numero in formato italiano all'inizio di un testo ("56%", "4,5x").
 * Restituisce null se il testo non inizia con un numero.
 */
export function parseStat(text) {
  const match = text.trim().match(/^(\d+)(?:,(\d+))?(.*)$/);
  if (!match) return null;
  const [, int, dec = '', suffix] = match;
  return {
    value: Number.parseFloat(dec ? `${int}.${dec}` : int),
    decimals: dec.length,
    suffix,
  };
}

/** Formatta un valore con i decimali richiesti e la virgola italiana. */
export function formatStat(value, decimals, suffix) {
  return value.toFixed(decimals).replace('.', ',') + suffix;
}
