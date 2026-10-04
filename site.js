const emailLink = document.getElementById('email-link');
  const toast = document.getElementById('toast');
  emailLink.addEventListener('click', function() {
    const email = this.dataset.email;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).then(() => {
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2500);
      });
    }
  });

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
  }, { threshold: 0.12 });
  document.querySelectorAll('section, .milestone, .cv-row, .project, .thought').forEach((el) => {
    el.classList.add('reveal'); observer.observe(el);
  });
  document.querySelectorAll('.project').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });

  /* Recommendations carousel */
  (function () {
    const track = document.getElementById('carousel-track');
    if (!track) return;
    const cards = Array.from(track.querySelectorAll('.testimonial'));
    const prev = document.getElementById('carousel-prev');
    const next = document.getElementById('carousel-next');
    const count = document.getElementById('carousel-count');
    const bar = document.getElementById('carousel-progress');
    const pad = (n) => String(n).padStart(2, '0');
    const step = () => cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : track.clientWidth;
    const visible = () => Math.max(1, Math.round((track.clientWidth + 20) / step()));
    function update() {
      const max = track.scrollWidth - track.clientWidth;
      const idx = Math.min(cards.length - 1, Math.round(track.scrollLeft / step()));
      const end = Math.min(cards.length, idx + visible());
      count.textContent = visible() > 1 ? pad(idx + 1) + '-' + pad(end) + ' / ' + pad(cards.length) : pad(idx + 1) + ' / ' + pad(cards.length);
      const w = 100 * visible() / cards.length;
      bar.style.width = Math.min(100, w) + '%';
      bar.style.left = (max > 0 ? (track.scrollLeft / max) * (100 - Math.min(100, w)) : 0) + '%';
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= max - 2;
    }
    function go(dir) { track.scrollBy({ left: dir * step() * (visible() > 1 ? visible() - 0 : 1), behavior: 'smooth' }); }
    prev.addEventListener('click', () => go(-1));
    next.addEventListener('click', () => go(1));
    track.addEventListener('scroll', () => window.requestAnimationFrame(update), { passive: true });
    window.addEventListener('resize', update);
    track.addEventListener('keydown', (e) => {
      if (e.key === 'Home') { e.preventDefault(); track.scrollTo({ left: 0 }); }
      if (e.key === 'End') { e.preventDefault(); track.scrollTo({ left: track.scrollWidth }); }
    });
    /* mouse drag (touch and trackpad scroll natively) */
    let down = false, startX = 0, startLeft = 0, moved = false;
    track.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      down = true; moved = false; startX = e.clientX; startLeft = track.scrollLeft;
    });
    window.addEventListener('pointermove', (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 5) { moved = true; track.classList.add('dragging'); }
      if (moved) track.scrollLeft = startLeft - dx;
    });
    window.addEventListener('pointerup', () => {
      if (!down) return;
      down = false;
      if (moved) {
        track.classList.remove('dragging');
        const target = Math.round(track.scrollLeft / step()) * step();
        track.scrollTo({ left: target, behavior: 'smooth' });
      }
    });
    update();
  })();

  /* Logo marquee: endless loop. Slow JS auto-scroll that can also be swiped or dragged. */
  (function () {
    const box = document.querySelector('.marquee');
    if (!box) return;
    const track = box.querySelector('.marquee-track');
    const first = box.querySelector('.marquee-list');
    if (!track || !first) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const SPEED = 28;       // px per second
    const RESUME = 2500;    // ms to wait after the visitor stops touching or dragging
    let copies = 0, setW = 0;
    let pos = 0, lastSet = 0, last = 0, holdUntil = 0, hovering = false, focused = false, down = false, visible = true, raf = 0;
    const lists = () => box.querySelectorAll('.marquee-list');
    const hold = (ms) => { holdUntil = Math.max(holdUntil, performance.now() + ms); };

    /* Build as many identical, hidden copies of the logo set as needed so there are always
       at least one full set of logos behind and ahead of the visible window. */
    function measure() { const l = lists(); return l.length > 1 ? l[1].offsetLeft - l[0].offsetLeft : first.offsetWidth; }
    function buildCopies() {
      const w = first.offsetWidth;
      if (!w) return;
      const need = Math.max(4, Math.ceil(2.5 + box.clientWidth / w));
      while (lists().length < need) {
        const c = first.cloneNode(true);
        c.setAttribute('aria-hidden', 'true');
        c.querySelectorAll('a').forEach((a) => { a.setAttribute('tabindex', '-1'); a.removeAttribute('aria-label'); });
        c.querySelectorAll('img').forEach((img) => { img.alt = ''; });
        track.appendChild(c);
      }
      copies = lists().length;
      setW = measure();
    }
    /* Always keep scrollLeft inside the middle band [setW, 2 * setW). One set is identical to the next,
       so moving by exactly one set width is invisible. */
    function wrap() {
      if (!setW) return;
      let p = box.scrollLeft, moved = false;
      while (p >= 2 * setW) { p -= setW; moved = true; }
      while (p < setW) { p += setW; moved = true; }
      if (moved) { box.scrollLeft = p; pos = lastSet = p; }
    }
    function tick(t) {
      raf = window.requestAnimationFrame(tick);
      const dt = Math.min(64, t - last); last = t;
      if (reduce.matches || !visible || hovering || focused || down || t < holdUntil) return;
      pos += SPEED * dt / 1000;
      lastSet = pos;
      box.scrollLeft = pos;
      wrap();
    }
    function start() {
      if (reduce.matches) return;
      buildCopies();
      if (!setW) return;
      const frac = (box.scrollLeft % setW + setW) % setW;
      box.scrollLeft = setW + frac;
      pos = lastSet = box.scrollLeft;
      if (!raf) { last = performance.now(); raf = window.requestAnimationFrame(tick); }
    }
    function stop() { window.cancelAnimationFrame(raf); raf = 0; }
    reduce.addEventListener('change', () => { if (reduce.matches) { stop(); box.scrollLeft = 0; } else start(); });
    let rt = 0;
    window.addEventListener('resize', () => { window.clearTimeout(rt); rt = window.setTimeout(() => { if (!reduce.matches) start(); }, 150); });
    window.addEventListener('load', () => { if (!reduce.matches) start(); });

    /* any scroll we did not cause (touch swipe, momentum, trackpad, drag) pauses auto-scroll and re-syncs */
    box.addEventListener('scroll', () => {
      if (Math.abs(box.scrollLeft - lastSet) > 2) { hold(RESUME); pos = lastSet = box.scrollLeft; }
      if (!reduce.matches) wrap();
    }, { passive: true });
    box.addEventListener('touchstart', () => { down = true; }, { passive: true });
    const touchEnd = () => { down = false; hold(RESUME); };
    box.addEventListener('touchend', touchEnd, { passive: true });
    box.addEventListener('touchcancel', touchEnd, { passive: true });
    box.addEventListener('wheel', () => hold(RESUME), { passive: true });
    box.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') hovering = true; });
    box.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') { hovering = false; hold(600); } });
    box.addEventListener('focusin', (e) => { if (e.target.matches && e.target.matches(':focus-visible')) focused = true; });
    box.addEventListener('focusout', () => { focused = false; });
    /* mouse drag; a drag must never count as a click on a logo */
    let startX = 0, startLeft = 0, moved = false;
    box.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      down = true; moved = false; startX = e.clientX; startLeft = box.scrollLeft;
    });
    window.addEventListener('pointermove', (e) => {
      if (!down || e.pointerType !== 'mouse') return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 5) { moved = true; box.classList.add('dragging'); }
      if (moved) {
        box.scrollLeft = startLeft - dx;
        if (!reduce.matches && setW) { /* keep the drag origin consistent when the loop wraps */
          const p = box.scrollLeft; wrap();
          if (box.scrollLeft !== p) startLeft += box.scrollLeft - p;
        }
      }
    });
    window.addEventListener('pointerup', (e) => {
      if (e.pointerType !== 'mouse' || !down) return;
      down = false; hold(RESUME); box.classList.remove('dragging');
      pos = lastSet = box.scrollLeft;
    });
    box.addEventListener('click', (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
    box.addEventListener('dragstart', (e) => e.preventDefault());
    box.querySelectorAll('a, img').forEach((el) => el.setAttribute('draggable', 'false'));
    if ('IntersectionObserver' in window) {
      new IntersectionObserver((entries) => { visible = entries[0].isIntersecting; }, { threshold: 0 }).observe(box);
    }
    start();
  })();
