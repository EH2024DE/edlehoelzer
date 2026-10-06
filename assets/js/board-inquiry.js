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
    track('inquiry_reference_select');
    form.elements.reference.value = link.dataset.inquiryExample;
    form.querySelector('[data-reference-note]').textContent = `Deine Referenz: ${link.dataset.inquiryExample}`;
  }));
  document.querySelectorAll('.customProjects__gallery').forEach(gallery => {
    const nav = document.createElement('div');
    nav.className = 'customProjects__navigation';
    const previous = document.createElement('button');
    const next = document.createElement('button');
    const position = document.createElement('span');
    previous.type = next.type = 'button';
    previous.textContent = '←';
    next.textContent = '→';
    previous.setAttribute('aria-label', 'Vorheriges Projektfoto');
    next.setAttribute('aria-label', 'Nächstes Projektfoto');
    position.setAttribute('aria-live', 'polite');
    const images = [...gallery.querySelectorAll('img')];
    const index = () => Math.round(gallery.scrollLeft / (gallery.clientWidth + 12));
    const update = () => {
      const current = index();
      previous.disabled = current === 0;
      next.disabled = current >= images.length - 1;
      position.textContent = `${current + 1} / ${images.length}`;
    };
    previous.onclick = () => gallery.scrollBy({left: -(gallery.clientWidth + 12), behavior: 'smooth'});
    next.onclick = () => gallery.scrollBy({left: gallery.clientWidth + 12, behavior: 'smooth'});
    gallery.addEventListener('scroll', update, {passive: true});
    nav.append(previous, position, next);
    gallery.after(nav);
    update();
  });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (pending || !form.reportValidity()) return;
    pending = true;
    track('inquiry_form_submit');
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
      track('inquiry_form_error');
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
