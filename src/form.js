const MISSING = {
  nome: 'Inserisci il nome.',
  email: "Inserisci l'e-mail.",
  messaggio: 'Scrivi un messaggio.',
  richiesta: 'Scegli il motivo del messaggio.',
};

/** Messaggio di errore per un campo non valido. Stringa vuota se il campo è valido. */
export function fieldError(field) {
  if (field.validity.valid) return '';
  if (field.validity.valueMissing) return MISSING[field.name] ?? 'Compila questo campo.';
  if (field.type === 'email') return 'Inserisci un indirizzo e-mail valido.';
  return 'Controlla questo campo.';
}

function fieldsOf(form) {
  return [...form.querySelectorAll('input, textarea, select')].filter(
    (el) => el.name && el.name !== 'bot-field' && el.type !== 'hidden' && !el.closest('[hidden]'),
  );
}

function clearFieldState(fields) {
  for (const el of fields) {
    el.removeAttribute('aria-invalid');
    el.removeAttribute('aria-describedby');
  }
}

function showErrors(form, alert, first) {
  const fields = fieldsOf(form);
  const invalid = fields.filter((el) => !el.validity.valid);
  clearFieldState(fields);
  for (const el of invalid) {
    el.setAttribute('aria-invalid', 'true');
    if (alert.id) el.setAttribute('aria-describedby', alert.id);
  }
  const message = fieldError(first);
  alert.textContent = invalid.length > 1 ? `${message} Controlla anche gli altri campi evidenziati.` : message;
  first.focus();
}

/**
 * Annuncia gli errori dei moduli. Il browser non emette submit se il modulo è invalido:
 * intercettiamo invalid e lasciamo la validazione nativa quando JavaScript non c'è.
 */
export function initForms() {
  for (const form of document.querySelectorAll('form')) {
    const alert = form.querySelector('[data-form-error]');
    if (!alert) continue;
    let pending = 0;
    form.addEventListener(
      'invalid',
      (event) => {
        event.preventDefault();
        if (pending) return;
        pending = setTimeout(() => {
          pending = 0;
          const first = fieldsOf(form).find((el) => !el.validity.valid);
          if (first) showErrors(form, alert, first);
        }, 0);
      },
      true,
    );
    form.addEventListener('submit', () => {
      alert.textContent = '';
      clearFieldState(fieldsOf(form));
    });
  }
}
