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
