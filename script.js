'use strict';

/* ---- LOADER ---- */
(function initLoader() {
  const loader   = document.getElementById('loader');
  const pctEl    = document.getElementById('loaderPct');
  let progress   = 0;

  const interval = setInterval(() => {
    progress += Math.random() * 12;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      if (pctEl) pctEl.textContent = '100%';
      setTimeout(() => {
        loader.classList.add('done');
        document.body.style.overflow = '';
        kickOffPageAnimations();
      }, 400);
    }
    if (pctEl) pctEl.textContent = Math.floor(progress) + '%';
  }, 80);

  document.body.style.overflow = 'hidden';
})();

/* ---- CANVAS PARTICLE NETWORK ---- */
(function initCanvas() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx    = canvas.getContext('2d');
  let W, H, particles = [];
  const COUNT  = 60;
  const DIST   = 140;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.r  = Math.random() * 1.5 + 0.5;
      this.alpha = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,229,255,${this.alpha})`;
      ctx.fill();
    }
  }

  function init() {
    resize();
    particles = Array.from({ length: COUNT }, () => new Particle());
  }

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < DIST) {
          const alpha = (1 - d / DIST) * 0.12;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,229,255,${alpha})`;
          ctx.lineWidth   = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', resize);
  init();
  loop();
})();

/* ---- CUSTOM CURSOR ---- */
(function initCursor() {
  const dot   = document.getElementById('cursorDot');
  const ring  = document.getElementById('cursorRing');
  const trail = document.getElementById('cursorTrail');
  if (!dot || !ring) return;

  let mx = 0, my = 0;
  let rx = 0, ry = 0;
  let tx = 0, ty = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  function animateCursor() {
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';

    tx += (mx - tx) * 0.07;
    ty += (my - ty) * 0.07;
    if (trail) {
      trail.style.left = tx + 'px';
      trail.style.top  = ty + 'px';
    }
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover effect on interactive elements
  const hoverEls = document.querySelectorAll('a, button, .skill-pill, .cert-card, .project-card');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
  });
})();

/* ---- NAVBAR SCROLL EFFECT ---- */
(function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScroll = y;
  });
})();

/* ---- HAMBURGER / MOBILE MENU ---- */
(function initHamburger() {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    menu.classList.toggle('open');
  });

  document.querySelectorAll('.mob-link').forEach(link => {
    link.addEventListener('click', () => {
      btn.classList.remove('open');
      menu.classList.remove('open');
    });
  });
})();

/* ---- TYPEWRITER ---- */
(function initTypewriter() {
  const el     = document.getElementById('typewriter');
  if (!el) return;
  const words  = [
    'intelligent systems.',
    'AI pipelines.',
    'smart APIs.',
    'full-stack apps.',
    'ML models.',
    'document intelligence.',
  ];
  let wi = 0, ci = 0, deleting = false;

  function tick() {
    const word    = words[wi];
    const current = deleting ? word.substring(0, ci--) : word.substring(0, ci++);
    el.textContent = current;

    let delay = deleting ? 60 : 100;

    if (!deleting && ci > word.length) {
      delay    = 1800;
      deleting = true;
    } else if (deleting && ci < 0) {
      deleting = false;
      ci       = 0;
      wi       = (wi + 1) % words.length;
      delay    = 400;
    }

    setTimeout(tick, delay);
  }
  setTimeout(tick, 2200); // start after loader
})();

/* ---- SCROLL REVEAL ---- */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const io  = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });

  els.forEach(el => io.observe(el));
})();

/* ---- METRIC COUNTER ANIMATION ---- */
function kickOffPageAnimations() {
  // Counters in hero
  const metrics = document.querySelectorAll('.metric-val[data-count]');
  const mio = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el  = entry.target;
      const end = parseFloat(el.dataset.count);
      const dec = parseInt(el.dataset.dec) || 0;
      animateNumber(el, 0, end, dec, 1800);
      mio.unobserve(el);
    });
  }, { threshold: 0.5 });
  metrics.forEach(m => mio.observe(m));
}

function animateNumber(el, from, to, decimals, duration) {
  const startTime = performance.now();
  function frame(now) {
    const elapsed  = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease     = 1 - Math.pow(1 - progress, 4);
    const val      = from + (to - from) * ease;
    el.textContent = val.toFixed(decimals);
    if (progress < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

/* ---- SKILL BAR ANIMATION ---- */
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill[data-width]');
  const bio  = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const bar  = entry.target;
      const w    = bar.dataset.width;
      bar.style.width = w + '%';
      bio.unobserve(bar);
    });
  }, { threshold: 0.5 });
  bars.forEach(b => bio.observe(b));
})();

/* ---- SMOOTH ANCHOR SCROLL ---- */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 72; // nav height
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ---- ACTIVE NAV LINK ON SCROLL ---- */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a');

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        links.forEach(l => {
          l.style.color = l.getAttribute('href') === '#' + id
            ? 'var(--accent)'
            : '';
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => io.observe(s));
})();

/* ---- CARD TILT EFFECT ---- */
(function initTilt() {
  const cards = document.querySelectorAll('.glass-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect  = card.getBoundingClientRect();
      const cx    = rect.left + rect.width  / 2;
      const cy    = rect.top  + rect.height / 2;
      const dx    = (e.clientX - cx) / (rect.width  / 2);
      const dy    = (e.clientY - cy) / (rect.height / 2);
      const tiltX = dy * -4;
      const tiltY = dx *  4;
      card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ---- PARALLAX HERO BG TEXT ---- */
(function initParallax() {
  const bgText = document.querySelector('.hero-bg-text');
  if (!bgText) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    bgText.style.transform = `translateY(${y * 0.3}px)`;
  }, { passive: true });
})();

/* ---- GLITCH EFFECT ON LOGO HOVER ---- */
(function initGlitch() {
  const logo = document.querySelector('.nav-logo');
  if (!logo) return;
  logo.addEventListener('mouseenter', () => {
    logo.style.animation = 'none';
    logo.style.textShadow = `
      2px 0 var(--accent2),
      -2px 0 var(--accent3)
    `;
    setTimeout(() => {
      logo.style.textShadow = '';
    }, 200);
  });
})();

/* ---- FOOTER YEAR ---- */
(function updateYear() {
  const el = document.querySelector('.footer-copy');
  if (el) {
    el.textContent = el.textContent.replace('2025', new Date().getFullYear());
  }
})();
