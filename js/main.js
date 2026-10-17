/* =========================================================
   Dr Dragana Radojković Šarić — interakcije
   ========================================================= */

/*
 * KONFIGURACIJA — popuniti pre objavljivanja.
 * Dok je endpoint prazan, forme NE prikazuju lažnu potvrdu,
 * već obaveštenje da integracija nije podešena.
 */
const CONFIG = {
  // URL servisa za e-mail marketing / CRM koji prima prijavu za vodič (npr. Zoho, MailerLite, Brevo).
  guideFormEndpoint: '',
  // URL za upit o konsultaciji (servis za forme ili sopstveni backend).
  contactFormEndpoint: '',
  // ID analitike (npr. GA4 "G-XXXXXXX"). Učitava se tek nakon pristanka na analitičke kolačiće.
  analyticsId: '',
  // Postojeća stranica na kojoj vodič trenutno može da se preuzme (rezervna opcija).
  guideFallbackUrl: 'https://razvojlica.ortodont.rs/#forma',
};

document.documentElement.classList.remove('no-js');

/* ---------- Analitika (samo uz pristanak) ---------- */
window.dataLayer = window.dataLayer || [];
function track(event, data = {}) {
  window.dataLayer.push({ event, ...data });
}

document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-track]');
  if (el) track(el.dataset.track, { label: el.textContent.trim().slice(0, 80), page: location.pathname });
});

function loadAnalytics() {
  if (!CONFIG.analyticsId || window.__analyticsLoaded) return;
  window.__analyticsLoaded = true;
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(CONFIG.analyticsId)}`;
  document.head.appendChild(s);
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', CONFIG.analyticsId, { anonymize_ip: true });
}

/* ---------- Kolačići ---------- */
const CONSENT_KEY = 'drs-consent-v1';
function readConsent() {
  try { return JSON.parse(localStorage.getItem(CONSENT_KEY)); } catch { return null; }
}
function saveConsent(value) {
  try { localStorage.setItem(CONSENT_KEY, JSON.stringify({ analytics: value, date: new Date().toISOString() })); } catch { /* bez skladišta */ }
  if (value) loadAnalytics();
}

function initCookies() {
  const banner = document.querySelector('[data-cookie]');
  if (!banner) return;
  const options = banner.querySelector('[data-cookie-options]');
  const analyticsBox = banner.querySelector('[data-cookie-analytics]');
  const current = readConsent();

  if (current === null) banner.hidden = false;
  else if (current.analytics) loadAnalytics();

  banner.addEventListener('click', (e) => {
    const action = e.target.closest('[data-cookie-action]')?.dataset.cookieAction;
    if (!action) return;
    if (action === 'accept') saveConsent(true);
    if (action === 'reject') saveConsent(false);
    if (action === 'save') saveConsent(!!analyticsBox?.checked);
    if (action === 'customize') { options.hidden = !options.hidden; return; }
    banner.hidden = true;
  });

  document.querySelectorAll('[data-open-cookies]').forEach((btn) =>
    btn.addEventListener('click', () => {
      const c = readConsent();
      if (analyticsBox) analyticsBox.checked = !!c?.analytics;
      options.hidden = false;
      banner.hidden = false;
      banner.querySelector('button')?.focus();
    })
  );
}

/* ---------- Header i meni ---------- */
function initHeader() {
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  const toggle = document.querySelector('.menu-toggle');
  const panel = document.getElementById('mobile-nav');
  if (!toggle || !panel) return;

  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('.menu-toggle__label').textContent = open ? 'Zatvori' : 'Meni';
    panel.hidden = !open;
    document.body.classList.toggle('menu-open', open);
    if (open) panel.querySelector('a')?.focus();
  };
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  panel.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { setOpen(false); toggle.focus(); }
  });
}

/* ---------- FAQ ---------- */
function initFaq() {
  document.querySelectorAll('.faq__q').forEach((btn) => {
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      document.getElementById(btn.getAttribute('aria-controls')).hidden = open;
    });
  });
}

/* ---------- Filter članaka ---------- */
function initFilters() {
  const filters = document.querySelectorAll('.filter');
  if (!filters.length) return;
  const cards = document.querySelectorAll('[data-category]');
  const apply = (cat) => {
    filters.forEach((f) => f.setAttribute('aria-pressed', String(f.dataset.filter === cat)));
    cards.forEach((c) => c.classList.toggle('is-hidden', cat !== 'sve' && !c.dataset.category.split(' ').includes(cat)));
  };
  filters.forEach((f) => f.addEventListener('click', () => {
    apply(f.dataset.filter);
    history.replaceState(null, '', f.dataset.filter === 'sve' ? location.pathname : `#${f.dataset.filter}`);
  }));
  const fromHash = location.hash.slice(1);
  if (fromHash && [...filters].some((f) => f.dataset.filter === fromHash)) apply(fromHash);
}

/* ---------- Forme ---------- */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validateField(field) {
  const input = field.querySelector('input, textarea');
  if (!input) return true;
  let ok = true;
  if (input.type === 'checkbox') ok = !input.required || input.checked;
  else if (input.required && !input.value.trim()) ok = false;
  else if (input.type === 'email' && input.value.trim() && !EMAIL_RE.test(input.value.trim())) ok = false;
  field.classList.toggle('has-error', !ok);
  input.setAttribute('aria-invalid', String(!ok));
  return ok;
}

function showStatus(form, type, html) {
  const box = form.querySelector('.form-status');
  if (!box) return;
  box.className = `form-status form-status--${type} is-visible`;
  box.innerHTML = html;
}

function showSuccess(form) {
  const wrap = form.closest('[data-form-wrap]');
  const success = wrap?.querySelector('.form-success');
  if (!success) return;
  form.hidden = true;
  wrap.querySelectorAll('[data-hide-on-success]').forEach((el) => (el.hidden = true));
  success.hidden = false;
  success.setAttribute('tabindex', '-1');
  success.focus();
}

function initForms() {
  const previewState = new URLSearchParams(location.search).get('stanje'); // pregled stanja: ?stanje=uspeh | greska | nepovezano

  document.querySelectorAll('form[data-form]').forEach((form) => {
    const kind = form.dataset.form; // "guide" | "contact"
    const endpoint = kind === 'guide' ? CONFIG.guideFormEndpoint : CONFIG.contactFormEndpoint;
    const fields = [...form.querySelectorAll('.field, .consent')];

    fields.forEach((f) => {
      const input = f.querySelector('input, textarea');
      input?.addEventListener('blur', () => { if (f.classList.contains('has-error') || input.value) validateField(f); });
      input?.addEventListener('change', () => { if (f.classList.contains('has-error')) validateField(f); });
    });

    if (previewState === 'uspeh') showSuccess(form);
    if (previewState === 'greska') showStatus(form, 'error', 'Došlo je do greške pri slanju. Proverite internet vezu i pokušajte ponovo za nekoliko trenutaka.');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const valid = fields.map(validateField).every(Boolean);
      if (!valid) {
        showStatus(form, 'error', 'Molimo proverite označena polja.');
        form.querySelector('.has-error input, .has-error textarea')?.focus();
        return;
      }

      // Bez povezanog servisa ne prikazujemo lažnu potvrdu.
      if (!endpoint) {
        const fallback = kind === 'guide'
          ? ` Do tada vodič možete preuzeti na <a href="${CONFIG.guideFallbackUrl}" data-track="guide_fallback_click">postojećoj stranici vodiča</a>.`
          : ' Do tada nas kontaktirajte telefonom ili e-poštom navedenim na ovoj stranici.';
        showStatus(form, 'info', `Forma još nije povezana sa servisom za slanje.${fallback}`);
        return;
      }

      const btn = form.querySelector('[type="submit"]');
      const label = btn.innerHTML;
      btn.disabled = true;
      btn.textContent = 'Šaljem…';

      try {
        const res = await fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
        if (!res.ok) throw new Error(res.status);
        track(kind === 'guide' ? 'guide_signup_success' : 'consultation_request_success', { page: location.pathname });
        showSuccess(form);
      } catch {
        showStatus(form, 'error', 'Došlo je do greške pri slanju. Proverite internet vezu i pokušajte ponovo za nekoliko trenutaka.');
      } finally {
        btn.disabled = false;
        btn.innerHTML = label;
      }
    });
  });
}

/* ---------- Suptilna pojava sekcija ---------- */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    els.forEach((el) => el.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
  els.forEach((el) => io.observe(el));
}

initHeader();
initFaq();
initFilters();
initForms();
initCookies();
initReveal();
document.querySelectorAll('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()));
