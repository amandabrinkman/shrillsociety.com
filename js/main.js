/* ============================================================
   SHRILL SOCIETY — main.js
   ============================================================ */

/* ── Nav: scroll behavior + mobile toggle ──────────────── */
const nav = document.getElementById('nav');
const navLinks = document.querySelectorAll('.nav-link[data-section]');
const navToggle = document.querySelector('.nav-toggle');
const navLinksWrap = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
  updateActiveLink();
}, { passive: true });

// Initialize on load
if (window.scrollY > 60) nav.classList.add('scrolled');

navToggle?.addEventListener('click', () => {
  navLinksWrap.classList.toggle('open');
  const spans = navToggle.querySelectorAll('span');
  const isOpen = navLinksWrap.classList.contains('open');
  spans[0].style.cssText = isOpen ? 'transform:translateY(6px) rotate(45deg)' : '';
  spans[1].style.cssText = isOpen ? 'opacity:0' : '';
  spans[2].style.cssText = isOpen ? 'transform:translateY(-6px) rotate(-45deg)' : '';
});

// Close mobile nav on link click
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinksWrap.classList.remove('open');
    navToggle.querySelectorAll('span').forEach(s => s.style.cssText = '');
  });
});

/* ── Scroll-spy ─────────────────────────────────────────── */
function updateActiveLink() {
  const sections = document.querySelectorAll('section[id], header[id]');
  let current = '';
  sections.forEach(sec => {
    const top = sec.getBoundingClientRect().top;
    if (top <= 100) current = sec.id;
  });
  navLinks.forEach(l => {
    l.classList.toggle('active', l.dataset.section === current);
  });
}

/* ── Reveal on scroll ───────────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal, .reveal-l, .reveal-r');
const revealIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      revealIO.unobserve(e.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });
revealEls.forEach(el => revealIO.observe(el));

/* ── Animated counters ──────────────────────────────────── */
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const duration = 1600;
  const start = performance.now();
  const isFloat = target % 1 !== 0;

  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // ease out cubic
    const ease = 1 - Math.pow(1 - progress, 3);
    const val = target * ease;
    el.textContent = prefix + (isFloat ? val.toFixed(1) : Math.round(val)) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const counterIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounter(e.target);
      counterIO.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-counter]').forEach(el => counterIO.observe(el));

/* ── Cover parallax ─────────────────────────────────────── */
const coverEl = document.querySelector('.cover');
if (coverEl) {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      coverEl.style.setProperty('--parallax', `${scrolled * 0.3}px`);
    }
  }, { passive: true });
}

/* ── Timeline items: stagger fade-in left to right ──────── */
const tlItems = document.querySelectorAll('.tl-item');
const tlIO = new IntersectionObserver(entries => {
  // All items animate together when the track enters view
  if (entries.some(e => e.isIntersecting)) {
    tlItems.forEach((item, i) => {
      setTimeout(() => {
        item.style.opacity = '1';
        item.style.transform = 'none';
      }, i * 60);
    });
    tlIO.disconnect();
  }
}, { threshold: 0.1 });

tlItems.forEach(item => {
  item.style.opacity = '0';
  item.style.transform = 'translateY(12px)';
  item.style.transition = 'opacity .5s ease, transform .5s ease';
});
// Observe the track container, not individual items
const tlTrack = document.querySelector('.tl-track');
if (tlTrack) tlIO.observe(tlTrack);

/* ── Image fallbacks: hide broken img wrappers ───────────── */
document.querySelectorAll('img[data-fallback-hide]').forEach(img => {
  img.addEventListener('error', () => {
    const wrap = img.closest('[data-fallback-wrap]');
    if (wrap) wrap.style.display = 'none';
  });
});
