(() => {
  const form = document.querySelector('[data-board-inquiry]');
  if (!form) return;
  const status = form.querySelector('[role="status"]');
  const submit = form.querySelector('[type="submit"]');
  let started = false;
  let pending = false;
  const track = name => window.EdleAnalytics?.track(name, {source: location.pathname, form_id: 'board_inquiry'});
  form.addEventListener('input', () => {
    if (!started) { started = true; track('inquiry_form_start'); }
  });
  document.querySelectorAll('[data-inquiry-example]').forEach(link => link.addEventListener('click', () => {
    form.elements.reference.value = link.dataset.inquiryExample;
    form.querySelector('[data-reference-note]').textContent = `Deine Referenz: ${link.dataset.inquiryExample}`;
  }));
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (pending || !form.reportValidity()) return;
    pending = true;
    submit.disabled = true;
    form.setAttribute('aria-busy', 'true');
    status.textContent = 'Deine Anfrage wird übermittelt …';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch(form.action, {method: 'POST', body: new FormData(form), headers: {Accept: 'application/json'}, signal: controller.signal});
      if (!response.ok) throw new Error('submission');
      // Provider acceptance confirms submission, not delivery into an inbox.
      track('inquiry_form_success');
      form.reset();
      form.querySelector('[data-reference-note]').textContent = '';
      status.textContent = 'Danke! Deine Anfrage wurde übermittelt. Wir melden uns per E-Mail zu Machbarkeit, Preisrahmen und Fertigungszeit.';
      started = false;
    } catch {
      status.textContent = 'Die Übermittlung konnte nicht bestätigt werden. Deine Eingaben bleiben erhalten. Bitte versuche es erneut oder schreibe uns per E-Mail.';
    } finally {
      clearTimeout(timeout);
      pending = false;
      submit.disabled = false;
      form.removeAttribute('aria-busy');
      status.focus();
    }
  });
})();
