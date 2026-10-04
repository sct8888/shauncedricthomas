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
