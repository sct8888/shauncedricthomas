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

  /* Logo marquee: CSS transform loop (one set width) plus swipe/drag by hand.
     The loop itself never depends on JS state: any pause from touch or drag ends on a timer. */
  (function () {
    const box = document.querySelector('.marquee');
    if (!box) return;
    const pan = box.querySelector('.marquee-pan');
    const track = box.querySelector('.marquee-track');
    const first = box.querySelector('.marquee-list');
    const toggle = document.getElementById('marquee-toggle');
    if (!pan || !track || !first) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const SPEED = 28, SPEED_REDUCED = 12;   // px per second
    const IDLE = 1500;                       // ms after the visitor lets go before the loop resumes
    const lists = () => track.querySelectorAll('.marquee-list');
    let setW = 0, panX = 0, holding = false, dragging = false, releaseAt = 0, lastMove = 0, userPaused = false;
    let startX = 0, startPan = 0, moved = false, vel = 0, lastX = 0, lastT = 0, momentum = 0;

    function layout() {
      const w = first.offsetWidth;
      if (!w) return;
      const need = Math.ceil(box.clientWidth / w) + 3;   // loop shift + pan shift + viewport, all covered
      while (lists().length < need) {
        const c = first.cloneNode(true);
        c.setAttribute('aria-hidden', 'true');
        c.querySelectorAll('a').forEach((a) => { a.setAttribute('tabindex', '-1'); a.removeAttribute('aria-label'); });
        c.querySelectorAll('img').forEach((img) => { img.alt = ''; });
        track.appendChild(c);
      }
      if (Math.abs(w - setW) > 0.5) {
        setW = w;
        box.style.setProperty('--marquee-shift', (-setW) + 'px');
        box.style.setProperty('--marquee-dur', (setW / (reduce.matches ? SPEED_REDUCED : SPEED)).toFixed(2) + 's');
        track.style.animation = 'none'; void track.offsetWidth; track.style.animation = '';  // restart with the new length
        setPan(panX);
      }
    }
    function setPan(x) {
      if (setW) { x = x % setW; if (x > 0) x -= setW; }
      panX = x;
      pan.style.transform = 'translate3d(' + panX + 'px,0,0)';
    }
    function hold() { holding = true; box.classList.add('is-held'); }
    function release() { holding = false; box.classList.remove('is-held'); }
    function releaseSoon() { releaseAt = Date.now() + IDLE; }

    /* Safety net: whatever happened (lost touchend, missed event), the loop always resumes. */
    window.setInterval(() => {
      if (holding && !dragging && Date.now() >= releaseAt) release();
      if (dragging && Date.now() - lastMove > 4000) { dragging = false; box.classList.remove('dragging'); releaseSoon(); }
    }, 300);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) { dragging = false; box.classList.remove('dragging'); release(); } });
    window.addEventListener('blur', () => { dragging = false; box.classList.remove('dragging'); releaseSoon(); });

    function down(e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      window.cancelAnimationFrame(momentum);
      dragging = true; moved = false; startX = lastX = e.clientX; startPan = panX; vel = 0; lastT = performance.now(); lastMove = Date.now();
    }
    function move(e) {
      if (!dragging) return;
      lastMove = Date.now();
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 5) { moved = true; hold(); box.classList.add('dragging'); }
      if (!moved) return;
      const now = performance.now();
      if (now > lastT) vel = 0.8 * vel + 0.2 * ((e.clientX - lastX) / (now - lastT));
      lastX = e.clientX; lastT = now;
      setPan(startPan + dx);
    }
    function up() {
      if (!dragging) return;
      dragging = false; box.classList.remove('dragging');
      if (!moved) return;
      releaseSoon();
      let v = vel * 16;   // px per frame
      if (Math.abs(v) < 1) return;
      (function glide() {
        v *= 0.94;
        setPan(panX + v);
        if (Math.abs(v) > 0.3) { momentum = window.requestAnimationFrame(glide); releaseSoon(); }
      })();
    }
    box.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    /* a drag must never count as a click on a logo */
    box.addEventListener('click', (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
    box.addEventListener('dragstart', (e) => e.preventDefault());
    box.querySelectorAll('a, img').forEach((el) => el.setAttribute('draggable', 'false'));
    /* trackpad / wheel sideways */
    box.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault(); hold(); setPan(panX - e.deltaX); releaseSoon();
    }, { passive: false });
    /* keyboard focus: bring the focused logo into view (the box does not scroll natively) */
    box.addEventListener('focusin', (e) => {
      box.scrollLeft = 0;
      const a = e.target.closest && e.target.closest('a'); if (!a) return;
      const r = a.getBoundingClientRect(), b = box.getBoundingClientRect();
      if (r.left < b.left + 40 || r.right > b.right - 40) setPan(panX + (b.left + 60 - r.left));
    });
    /* Pause / Play button */
    if (toggle) {
      toggle.addEventListener('click', () => {
        userPaused = !userPaused;
        box.classList.toggle('is-paused', userPaused);
        toggle.textContent = userPaused ? 'Play' : 'Pause';
        toggle.setAttribute('aria-pressed', String(userPaused));
        toggle.setAttribute('aria-label', userPaused ? 'Resume logo scrolling' : 'Pause logo scrolling');
      });
    }
    reduce.addEventListener('change', () => { setW = 0; layout(); });
    window.addEventListener('resize', () => { window.clearTimeout(layout.t); layout.t = window.setTimeout(layout, 120); });
    window.addEventListener('load', layout);
    layout();
  })();
