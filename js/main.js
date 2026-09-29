/* =========================================================
   Matheus Henrique Alves Silva — Portfólio
   Interações: menu, scroll, animações, filtros, formulário
   ========================================================= */
(function () {
  'use strict';

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------- 1. Menu mobile ---------- */
  const navToggle = $('#navToggle');
  const navMenu   = $('#navMenu');
  const backdrop  = document.createElement('div');
  backdrop.className = 'nav__backdrop';
  document.body.appendChild(backdrop);

  const closeMenu = () => {
    navMenu.classList.remove('is-open');
    backdrop.classList.remove('is-visible');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Abrir menu');
    document.body.style.overflow = '';
  };

  const openMenu = () => {
    navMenu.classList.add('is-open');
    backdrop.classList.add('is-visible');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Fechar menu');
    document.body.style.overflow = 'hidden';
  };

  navToggle.addEventListener('click', () => {
    navToggle.getAttribute('aria-expanded') === 'true' ? closeMenu() : openMenu();
  });

  backdrop.addEventListener('click', closeMenu);
  $$('.nav__link').forEach(link => link.addEventListener('click', closeMenu));

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });

  /* ---------- 2. Header com scroll + progresso ---------- */
  const header = $('#header');
  const progress = $('#scrollProgress');
  const toTop = $('#toTop');

  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 20);
    toTop.classList.toggle('is-visible', y > 500);

    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = max > 0 ? `${(y / max) * 100}%` : '0%';
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  toTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- 3. Link ativo conforme a seção ---------- */
  const sections = $$('main section[id]');
  const navLinks = $$('.nav__link');

  const spy = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(l => l.classList.toggle('is-active', l.getAttribute('href') === `#${id}`));
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  sections.forEach(s => spy.observe(s));

  /* ---------- 4. Reveal ao rolar ---------- */
  const revealEls = $$('.reveal');

  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const delay = (entry.target.dataset.delay || i * 60);
        setTimeout(() => entry.target.classList.add('is-visible'), delay);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- 5. Contadores ---------- */
  const counters = $$('[data-count]');

  const countObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 1500;
      const start = performance.now();

      const tick = now => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => countObserver.observe(c));

  /* ---------- 6. Barras de proficiência ---------- */
  const bars = $$('.bar__fill');

  const barObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.style.width = entry.target.dataset.width;
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.4 });

  bars.forEach(b => barObserver.observe(b));

  /* ---------- 7. Filtros de projetos ---------- */
  const filters = $$('.filter');
  const projects = $$('.project');

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      filters.forEach(b => {
        const active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-selected', String(active));
      });

      projects.forEach(p => {
        const match = filter === 'all' || p.dataset.category === filter;
        p.classList.toggle('is-hidden', !match);
      });
    });
  });

  /* ---------- 8. Efeito typewriter ---------- */
  const typeEl = $('#typewriter');
  const phrases = [
    'Suporte Técnico de TI',
    'Infraestrutura & Redes',
    'Análise de Dados com SQL',
    'Business Intelligence · Power BI',
    'Estudante de Ciência da Computação'
  ];

  let phraseIdx = 0, charIdx = 0, deleting = false;

  const type = () => {
    const current = phrases[phraseIdx];
    typeEl.textContent = deleting
      ? current.substring(0, charIdx--)
      : current.substring(0, charIdx++);

    let speed = deleting ? 40 : 80;

    if (!deleting && charIdx > current.length) {
      deleting = true;
      speed = 1600;
    } else if (deleting && charIdx < 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      speed = 350;
    }
    setTimeout(type, speed);
  };

  if (typeEl && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    setTimeout(type, 400);
  } else if (typeEl) {
    typeEl.textContent = phrases[0];
  }

 

  /* ---------- 10. Ano no footer ---------- */
  $('#year').textContent = new Date().getFullYear();
})();
