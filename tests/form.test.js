import { describe, expect, it } from 'vitest';
import { fieldError } from '../src/form.js';

const field = ({ name, type = 'text', valueMissing = false, valid = false }) => ({
  name,
  type,
  validity: { valid, valueMissing },
});

describe('fieldError', () => {
  it('non segnala un campo valido', () => {
    expect(fieldError(field({ name: 'email', type: 'email', valid: true }))).toBe('');
  });

  it('chiede i campi obbligatori del modulo', () => {
    expect(fieldError(field({ name: 'nome', valueMissing: true }))).toBe('Inserisci il nome.');
    expect(fieldError(field({ name: 'email', type: 'email', valueMissing: true }))).toBe("Inserisci l'e-mail.");
    expect(fieldError(field({ name: 'messaggio', valueMissing: true }))).toBe('Scrivi un messaggio.');
    expect(fieldError(field({ name: 'richiesta', valueMissing: true }))).toBe('Scegli il motivo del messaggio.');
  });

  it('segnala un indirizzo e-mail non valido', () => {
    expect(fieldError(field({ name: 'email', type: 'email' }))).toBe('Inserisci un indirizzo e-mail valido.');
  });
});
