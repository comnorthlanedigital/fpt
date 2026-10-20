/* FPT Matchday Night: theme scripts. No build step; GSAP, ScrollTrigger and Lenis load before this file (all deferred). */
(() => {
  'use strict';

  const T = window.theme || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const inEditor = () => Boolean(window.Shopify && window.Shopify.designMode);
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const hasGsap = () => typeof window.gsap !== 'undefined';

  /* ---------- money ---------- */
  function formatMoney(cents, format) {
    const fmt = format || T.moneyFormat || '${{amount}}';
    const placeholder = /\{\{\s*(\w+)\s*\}\}/;
    const withDelimiters = (n, precision = 2, thousands = ',', decimal = '.') => {
      if (Number.isNaN(Number(n)) || n == null) return '0';
      const num = (Number(n) / 100).toFixed(precision).split('.');
      return num[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, `$1${thousands}`) + (num[1] ? decimal + num[1] : '');
    };
    const key = (fmt.match(placeholder) || [])[1];
    let value;
    switch (key) {
      case 'amount_no_decimals': value = withDelimiters(cents, 0); break;
      case 'amount_with_comma_separator': value = withDelimiters(cents, 2, '.', ','); break;
      case 'amount_no_decimals_with_comma_separator': value = withDelimiters(cents, 0, '.', ','); break;
      case 'amount_with_apostrophe_separator': value = withDelimiters(cents, 2, "'", '.'); break;
      default: value = withDelimiters(cents, 2);
    }
    return fmt.replace(placeholder, value);
  }
  const sized = (url, w) => (url ? `${url}${url.includes('?') ? '&' : '?'}width=${w}` : '');

  /* ---------- smooth scroll ---------- */
  let lenis = null;
  function initSmoothScroll() {
    if (!T.smoothScroll || reduceMotion || inEditor() || typeof window.Lenis === 'undefined' || lenis) return;
    lenis = new window.Lenis();
    if (hasGsap() && window.ScrollTrigger) {
      window.gsap.registerPlugin(window.ScrollTrigger);
      lenis.on('scroll', window.ScrollTrigger.update);
      window.gsap.ticker.add((time) => lenis.raf(time * 1000));
      window.gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }

  /* ---------- header ---------- */
  function initHeader(root = document) {
    $$('[data-menu-toggle]', root).forEach((btn) => {
      if (btn.dataset.init) return; btn.dataset.init = '1';
      const nav = $('#MobileNav');
      btn.addEventListener('click', () => {
        const open = btn.getAttribute('aria-expanded') !== 'true';
        btn.setAttribute('aria-expanded', String(open));
        if (nav) nav.hidden = !open;
      });
    });
    $$('[data-search-toggle]', root).forEach((btn) => {
      if (btn.dataset.init) return; btn.dataset.init = '1';
      const box = $('#HeaderSearch');
      btn.addEventListener('click', () => {
        const open = btn.getAttribute('aria-expanded') !== 'true';
        btn.setAttribute('aria-expanded', String(open));
        if (box) { box.hidden = !open; if (open) $('input[type=search]', box)?.focus(); }
      });
    });
  }

  /* ---------- reveal + counters ---------- */
  function initReveal(root = document) {
    const items = $$('[data-reveal]:not(.is-in)', root);
    if (!items.length) return;
    if (!T.animations || reduceMotion || inEditor() || !('IntersectionObserver' in window)) { items.forEach((el) => el.classList.add('is-in')); return; }
    const io = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    items.forEach((el) => io.observe(el));
  }
  function initCounters(root = document) {
    $$('[data-count]', root).forEach((el) => {
      if (el.dataset.init) return; el.dataset.init = '1';
      const end = Number(el.dataset.count) || 0;
      const plain = el.hasAttribute('data-plain');
      const show = (v) => { el.textContent = plain ? String(Math.round(v)) : Math.round(v).toLocaleString(); };
      if (!T.animations || reduceMotion || inEditor() || !hasGsap() || !('IntersectionObserver' in window)) { show(end); return; }
      show(0);
      const io = new IntersectionObserver((entries) => {
        if (!entries[0].isIntersecting) return; io.disconnect();
        const o = { v: 0 };
        window.gsap.to(o, { v: end, duration: 1.9, ease: 'power2.out', onUpdate: () => show(o.v) });
      }, { threshold: 0.4 });
      io.observe(el);
    });
  }

  /* ---------- hero + marquee + lookbook ---------- */
  function initHero(root = document) {
    $$('[data-hero]', root).forEach((hero) => {
      if (hero.dataset.init) return; hero.dataset.init = '1';
      hero.classList.add('is-ready');
      if (!T.animations || reduceMotion || inEditor() || !hasGsap()) return;
      const g = window.gsap;
      g.from($$('.line__in', hero), { yPercent: 110, duration: 1.1, stagger: 0.1, ease: 'expo.out' });
      g.from($$('[data-hero-in]:not(.line__in)', hero), { y: 24, opacity: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out', delay: 0.3 });
      g.from($$('.fan-card', hero), { y: 140, opacity: 0, duration: 1.1, stagger: 0.12, ease: 'expo.out', delay: 0.2 });
      g.from($$('.badge, .sticker', hero), { scale: 0, rotate: -90, duration: 0.8, stagger: 0.1, ease: 'back.out(1.7)', delay: 0.7 });
      if (window.ScrollTrigger) {
        g.registerPlugin(window.ScrollTrigger);
        $$('.fan-card', hero).forEach((c, i) => g.to(c, { yPercent: -10 - i * 8, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } }));
      }
    });
  }
  function initMarquee(root = document) {
    $$('[data-marquee]', root).forEach((m) => {
      if (m.dataset.init) return; m.dataset.init = '1';
      const track = $('[data-marquee-track]', m);
      if (!track || reduceMotion || !hasGsap()) return;
      const tween = window.gsap.to(track, { xPercent: -25, repeat: -1, duration: Number(m.dataset.speed) || 26, ease: 'none' });
      if (window.ScrollTrigger) window.ScrollTrigger.create({ onUpdate: (s) => { window.gsap.to(tween, { timeScale: 1 + Math.abs(s.getVelocity()) / 380, duration: 0.2, overwrite: true }); window.gsap.to(tween, { timeScale: 1, duration: 1, delay: 0.2 }); } });
    });
  }
  function initLookbook(root = document) {
    $$('[data-lookbook]', root).forEach((wall) => {
      if (wall.dataset.init) return; wall.dataset.init = '1';
      if (!T.animations || reduceMotion || inEditor() || !hasGsap() || !window.ScrollTrigger) return;
      window.gsap.registerPlugin(window.ScrollTrigger);
      $$('.polaroid', wall).forEach((c) => {
        const s = Number(c.dataset.speed) || 1;
        window.gsap.fromTo(c, { y: 70 * s }, { y: -70 * s, ease: 'none', scrollTrigger: { trigger: wall, start: 'top bottom', end: 'bottom top', scrub: true } });
      });
    });
  }

  /* ---------- jersey preview (home customizer + product personalization) ---------- */
  const JERSEY_THEMES = [
    { id: 'gold', label: 'Black & Gold', body: '#0c0c0b', trim: '#d6a93f', text: '#f0cf6a', stripe: '#d6a93f' },
    { id: 'green', label: 'El Tri Green', body: '#0f7a3a', trim: '#ffffff', text: '#ffffff', stripe: '#c8102e' },
    { id: 'sky', label: 'Albiceleste', body: '#6cb4e8', trim: '#ffffff', text: '#0d2a52', stripe: '#ffffff' },
    { id: 'yellow', label: 'Seleção', body: '#f7d117', trim: '#0a8a3c', text: '#0a3d91', stripe: '#0a8a3c' },
    { id: 'white', label: 'Clean White', body: '#f3f1ec', trim: '#111111', text: '#111111', stripe: '#111111' }
  ];
  function initJersey(root = document) {
    $$('[data-jersey-customizer]', root).forEach((box) => {
      if (box.dataset.init) return; box.dataset.init = '1';
      const svg = $('[data-jersey]', box);
      if (!svg) return;
      const nameIn = $('[data-jersey-name]', box), numIn = $('[data-jersey-number]', box), themesEl = $('[data-jersey-themes]', box);
      const nameEl = $('[data-j=name]', svg), numEl = $('[data-j=number]', svg);
      let theme = JERSEY_THEMES[0];
      const live = box.hasAttribute('data-jersey-live');
      const render = () => {
        const name = (nameIn?.value || (live ? '' : 'LEGEND')).toUpperCase().slice(0, 12) || (live ? 'YOUR NAME' : 'LEGEND');
        const num = (numIn?.value || '').replace(/\D/g, '').slice(0, 2) || (live ? '10' : '10');
        nameEl.textContent = name;
        nameEl.setAttribute('font-size', String(Math.min(44, (330 / Math.max(name.length, 1)) * 1.45)));
        numEl.textContent = num;
        $$('[data-j=body]', svg).forEach((n) => n.setAttribute('fill', theme.body));
        $$('[data-j=stripe]', svg).forEach((n) => n.setAttribute('fill', theme.stripe));
        $$('[data-j=trim]', svg).forEach((n) => n.setAttribute('fill', theme.trim));
        nameEl.setAttribute('fill', theme.text); numEl.setAttribute('fill', theme.text);
      };
      if (themesEl) {
        JERSEY_THEMES.forEach((t) => {
          const b = document.createElement('button');
          b.type = 'button'; b.className = 'swatch'; b.setAttribute('aria-pressed', String(t === theme));
          b.innerHTML = `<i style="background:linear-gradient(135deg,${t.body} 55%,${t.stripe} 55%)"></i><span>${esc(t.label)}</span>`;
          b.addEventListener('click', () => { theme = t; $$('.swatch', themesEl).forEach((x) => x.setAttribute('aria-pressed', String(x === b))); render(); });
          themesEl.appendChild(b);
        });
      }
      numIn?.addEventListener('input', () => { numIn.value = numIn.value.replace(/\D/g, '').slice(0, 2); render(); });
      nameIn?.addEventListener('input', render);
      render();
    });
  }

  /* ---------- cart ---------- */
  const drawer = () => $('[data-cart-drawer]');
  let lastFocus = null;
  async function getCart() { return (await fetch(T.routes.cartJson, { headers: { Accept: 'application/json' } })).json(); }
  function updateCount(cart) {
    $$('[data-cart-count]').forEach((el) => { el.textContent = cart.item_count; el.hidden = cart.item_count === 0; });
    const label = $('[data-cart-count-label]'); if (label) label.textContent = cart.item_count ? `(${cart.item_count})` : '';
  }
  function renderDrawer(cart) {
    const body = $('[data-cart-items]'), foot = $('[data-cart-footer]');
    if (!body || !foot) return;
    updateCount(cart);
    if (!cart.items.length) {
      body.innerHTML = `<div class="drawer__empty"><p>${esc(T.strings.emptyCart)}</p><a class="btn btn--gold" href="/collections/all">&rarr;</a></div>`;
      foot.hidden = true; return;
    }
    body.innerHTML = cart.items.map((item) => {
      const props = Object.entries(item.properties || {}).filter(([k, v]) => v && !k.startsWith('_')).map(([k, v]) => `<p class="dline__meta"><span>${esc(k)}:</span> ${esc(v)}</p>`).join('');
      const variant = item.variant_title && item.variant_title !== 'Default Title' ? `<p class="dline__meta">${esc(item.variant_title)}</p>` : '';
      const img = item.image ? `<img src="${esc(sized(item.image, 160))}" alt="${esc(item.product_title)}" width="78" height="78" loading="lazy">` : '';
      return `<div class="dline" data-line="${item.key}">
        <a class="dline__img" href="${esc(item.url)}">${img}</a>
        <div><a class="dline__title" href="${esc(item.url)}">${esc(item.product_title)}</a>${variant}${props}
          <div class="dline__qty"><button type="button" data-qty-change="-1" aria-label="-">&minus;</button><span>${item.quantity}</span><button type="button" data-qty-change="1" aria-label="+">+</button></div></div>
        <div><div class="dline__price">${formatMoney(item.final_line_price)}</div><button type="button" class="dline__remove" data-line-remove>${esc(T.strings.remove)}</button></div>
      </div>`;
    }).join('');
    $('[data-cart-subtotal]').textContent = formatMoney(cart.total_price);
    const note = $('[data-cart-note]'); if (note && document.activeElement !== note) note.value = cart.note || '';
    foot.hidden = false;
  }
  async function changeLine(key, quantity) {
    const res = await fetch(T.routes.cartChange + '.js', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ id: key, quantity }) });
    renderDrawer(await res.json());
  }
  async function refreshDrawer() { renderDrawer(await getCart()); }
  function openDrawer() {
    const d = drawer(); if (!d) return false;
    lastFocus = document.activeElement;
    const overlay = $('[data-drawer-overlay]');
    d.hidden = false; overlay.hidden = false;
    requestAnimationFrame(() => { d.classList.add('is-open'); overlay.classList.add('is-open'); });
    document.body.classList.add('no-scroll'); lenis?.stop();
    refreshDrawer(); d.focus(); return true;
  }
  function closeDrawer() {
    const d = drawer(); if (!d || d.hidden) return;
    const overlay = $('[data-drawer-overlay]');
    d.classList.remove('is-open'); overlay.classList.remove('is-open');
    document.body.classList.remove('no-scroll'); lenis?.start();
    setTimeout(() => { d.hidden = true; overlay.hidden = true; }, 400);
    lastFocus?.focus?.();
  }
  function initCart() {
    if (document.body.dataset.cartInit) return; document.body.dataset.cartInit = '1';
    document.addEventListener('click', (e) => {
      const toggle = e.target.closest('[data-cart-toggle]');
      if (toggle && T.cartType === 'drawer' && drawer()) { e.preventDefault(); openDrawer(); return; }
      if (e.target.closest('[data-drawer-close]') || e.target.matches('[data-drawer-overlay]')) { closeDrawer(); return; }
      const line = e.target.closest('[data-line]');
      if (line && e.target.closest('[data-qty-change]')) {
        const qty = Number($('.dline__qty span', line).textContent) + Number(e.target.closest('[data-qty-change]').dataset.qtyChange);
        changeLine(line.dataset.line, Math.max(0, qty));
      } else if (line && e.target.closest('[data-line-remove]')) changeLine(line.dataset.line, 0);
    });
    document.addEventListener('keydown', (e) => {
      const d = drawer(); if (!d || d.hidden) return;
      if (e.key === 'Escape') closeDrawer();
      if (e.key === 'Tab') {
        const f = $$('a[href],button:not([disabled]),textarea,input', d).filter((n) => n.offsetParent !== null);
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    let t;
    $('[data-cart-note]')?.addEventListener('input', (e) => { clearTimeout(t); t = setTimeout(() => fetch(T.routes.cartUpdate + '.js', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ note: e.target.value }) }), 600); });
  }

  /* ---------- product page ---------- */
  function initProduct(root = document) {
    $$('[data-product]', root).forEach((section) => {
      if (section.dataset.init) return; section.dataset.init = '1';
      const form = $('[data-product-form]', section), jsonEl = $('[data-product-json]', section);
      if (!form || !jsonEl) return;
      const product = JSON.parse(jsonEl.textContent);
      const idInput = $('[data-variant-id]', form), btn = $('[data-add-to-cart]', form), label = $('[data-add-label]', form), errorEl = $('[data-form-error]', form);
      const priceEl = $('[data-price]', section), compareEl = $('[data-compare-price]', section), priceWrap = $('[data-price-wrapper]', section);

      const slides = $$('.gallery__slide', section), thumbs = $$('[data-thumb]', section);
      const showMedia = (id) => {
        const target = slides.find((s) => s.dataset.mediaId === String(id)); if (!target) return;
        slides.forEach((s) => s.classList.toggle('is-active', s === target));
        thumbs.forEach((t) => t.setAttribute('aria-current', String(t.dataset.thumb === String(id))));
      };
      thumbs.forEach((t) => t.addEventListener('click', () => showMedia(t.dataset.thumb)));
      if (thumbs[0]) thumbs[0].setAttribute('aria-current', 'true');

      const selected = () => $$('.opt', form).map((fs) => ($('input:checked', fs) || {}).value);
      const onChange = () => {
        const opts = selected();
        const v = product.variants.find((x) => opts.every((o, i) => x.options[i] === o));
        if (!v) { btn.disabled = true; label.textContent = T.strings.unavailable; return; }
        idInput.value = v.id;
        const url = new URL(window.location.href); url.searchParams.set('variant', v.id); window.history.replaceState({}, '', url);
        if (priceEl) priceEl.textContent = formatMoney(v.price);
        if (compareEl) { const sale = v.compare_at_price > v.price; compareEl.hidden = !sale; compareEl.textContent = sale ? formatMoney(v.compare_at_price) : ''; priceWrap?.classList.toggle('price--sale', sale); }
        btn.disabled = !v.available; label.textContent = v.available ? T.strings.addToCart : T.strings.soldOut;
        if (v.featured_media?.id) showMedia(v.featured_media.id);
      };
      $$('.opt input', form).forEach((i) => i.addEventListener('change', onChange));

      const qty = $('[data-qty] input', form);
      $('[data-qty-minus]', form)?.addEventListener('click', () => { qty.value = Math.max(1, Number(qty.value || 1) - 1); });
      $('[data-qty-plus]', form)?.addEventListener('click', () => { qty.value = Number(qty.value || 1) + 1; });

      form.addEventListener('submit', async (e) => {
        if (!window.fetch) return;
        e.preventDefault();
        errorEl.textContent = ''; btn.disabled = true; btn.classList.add('is-loading');
        const data = new FormData(form);
        [...data.keys()].filter((k) => k.startsWith('options[')).forEach((k) => data.delete(k));
        try {
          const res = await fetch(T.routes.cartAdd + '.js', { method: 'POST', headers: { Accept: 'application/json' }, body: data });
          const json = await res.json();
          if (!res.ok) { errorEl.textContent = json.description || json.message || T.strings.errorMax; return; }
          if (T.cartType === 'drawer' && drawer()) { openDrawer(); } else { window.location.href = T.routes.cart; }
        } catch (err) { errorEl.textContent = T.strings.errorMax; } finally { btn.disabled = false; btn.classList.remove('is-loading'); }
      });
    });
  }

  /* ---------- recommendations + collection filters ---------- */
  function initRecs(root = document) {
    $$('[data-recs]', root).forEach(async (el) => {
      if (el.dataset.init || !el.dataset.url) return; el.dataset.init = '1';
      try {
        const html = await (await fetch(el.dataset.url)).text();
        const fresh = new DOMParser().parseFromString(html, 'text/html').querySelector('[data-recs]');
        if (fresh && fresh.innerHTML.trim()) { el.innerHTML = fresh.innerHTML; initReveal(el); }
      } catch (e) { /* recommendations are optional */ }
    });
  }
  function initFilters(root = document) {
    $$('[data-filters-form]', root).forEach((form) => {
      if (form.dataset.init) return; form.dataset.init = '1';
      form.addEventListener('change', (e) => { if (e.target.matches('input, select')) form.submit(); });
    });
  }

  /* ---------- boot ---------- */
  function init(root = document) {
    initHeader(root); initReveal(root); initCounters(root); initHero(root); initMarquee(root); initLookbook(root);
    initJersey(root); initProduct(root); initRecs(root); initFilters(root);
  }
  function boot() {
    initSmoothScroll(); initCart(); init();
    if (!inEditor() && T.cartType === 'drawer') getCart().then(updateCount).catch(() => {});
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
  document.addEventListener('shopify:section:load', (e) => init(e.target));
})();
