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

tlItems.forEach(item => {
  item.style.opacity = '0';
  item.style.transform = 'translateY(14px)';
  item.style.transition = 'opacity .5s ease, transform .5s ease';
});

// Observe the section — reliably enters viewport as user scrolls
const tlSection = document.getElementById('timeline');
if (tlSection) {
  const tlIO = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      tlItems.forEach((item, i) => {
        setTimeout(() => {
          item.style.opacity = '1';
          item.style.transform = 'none';
        }, i * 70);
      });
      tlIO.disconnect();
    }
  }, { threshold: 0.05 });
  tlIO.observe(tlSection);
}

/* ── Press ticker: build logo items dynamically ─────────── */
const TICKER_PUBS = [
  { name: 'The New York Times',  domain: 'nytimes.com'          },
  { name: 'The Washington Post', domain: 'washingtonpost.com'   },
  { name: 'Forbes',              domain: 'forbes.com'           },
  { name: 'Vogue',               domain: 'vogue.com'            },
  { name: "Harper's Bazaar",     domain: 'harpersbazaar.com'    },
  { name: 'Teen Vogue',          domain: 'teenvogue.com'        },
  { name: 'Allure',              domain: 'allure.com'           },
  { name: 'People',              domain: 'people.com'           },
  { name: 'Cosmopolitan',        domain: 'cosmopolitan.com'     },
  { name: 'Refinery29',          domain: 'refinery29.com'       },
  { name: 'The Cut',             domain: 'thecut.com'           },
  { name: 'Glamour',             domain: 'glamour.com'          },
  { name: 'Elle',                domain: 'elle.com'             },
  { name: 'Hollywood Reporter',  domain: 'hollywoodreporter.com'},
  { name: 'Reuters',             domain: 'reuters.com'          },
  { name: 'USA Today',           domain: 'usatoday.com'         },
  { name: 'Vice',                domain: 'vice.com'             },
  { name: 'Bustle',              domain: 'bustle.com'           },
  { name: 'BUST',                domain: 'bust.com'             },
  { name: 'Marie Claire',        domain: 'marieclaire.com'      },
  { name: 'SXSW',                domain: 'sxsw.com'             },
  { name: 'NOLA.com',            domain: 'nola.com'             },
  { name: 'HelloGiggles',        domain: 'hellogiggles.com'     },
  { name: 'Brides',              domain: 'brides.com'           },
  { name: 'AIGA',                domain: 'aiga.org'             },
  { name: 'Cool Hunting',        domain: 'coolhunting.com'      },
  { name: 'Racked',              domain: 'racked.com'           },
  { name: 'Us Weekly',           domain: 'usmagazine.com'       },
  { name: 'Autostraddle',        domain: 'autostraddle.com'     },
  { name: 'UPROXX',              domain: 'uproxx.com'           },
  { name: 'Stylist',             domain: 'stylist.co.uk'        },
  { name: 'Yahoo!',              domain: 'yahoo.com'            },
  { name: 'Glossy',              domain: 'glossy.co'            },
  { name: 'Shape',               domain: 'shape.com'            },
  { name: 'Huffington Post',     domain: 'huffpost.com'         },
  { name: 'Elite Daily',         domain: 'elitedaily.com'       },
  { name: 'The Daily Wire',      domain: 'dailywire.com'        },
  { name: 'BuzzFeed',            domain: 'buzzfeed.com'         },
  { name: 'Out',                 domain: 'out.com'              },
];

function buildTickerItem({ name, domain }) {
  const span = document.createElement('span');
  span.className = 't-item';

  const img = document.createElement('img');
  img.className = 't-logo';
  img.src = `https://logo.clearbit.com/${domain}`;
  img.alt = name;
  img.setAttribute('aria-hidden', 'true');

  const fb = document.createElement('span');
  fb.className = 't-logo-fb';
  fb.textContent = name;
  fb.style.display = 'none';

  // If logo fails, hide img and show text fallback
  img.addEventListener('error', () => {
    img.style.display = 'none';
    fb.style.display = 'inline';
  });

  span.appendChild(img);
  span.appendChild(fb);
  return span;
}

const tickerTrack = document.querySelector('.ticker-track');
if (tickerTrack) {
  tickerTrack.innerHTML = '';
  // Two copies for seamless loop
  [0, 1].forEach(() => {
    TICKER_PUBS.forEach(pub => {
      tickerTrack.appendChild(buildTickerItem(pub));
    });
  });
}

/* ── Image fallbacks: hide broken img wrappers ───────────── */
document.querySelectorAll('img[data-fallback-hide]').forEach(img => {
  img.addEventListener('error', () => {
    const wrap = img.closest('[data-fallback-wrap]');
    if (wrap) wrap.style.display = 'none';
  });
});
