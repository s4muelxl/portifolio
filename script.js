/* ==========================================================================
   PORTFÓLIO SAMUEL ALVES — INTERAÇÕES ESSENCIAIS
   Sem dependência da API do GitHub no cliente.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initScrollSpy();
  initProjectFilters();
  setCurrentYear();
});

function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('navMenu');

  if (!toggleBtn || !navMenu) return;

  const closeMenu = () => {
    navMenu.classList.remove('open');
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.textContent = '☰';
    toggleBtn.setAttribute('aria-label', 'Abrir menu de navegação');
  };

  toggleBtn.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    toggleBtn.setAttribute('aria-expanded', String(isOpen));
    toggleBtn.textContent = isOpen ? '✕' : '☰';
    toggleBtn.setAttribute('aria-label', isOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
  });

  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => closeMenu());
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });

  document.addEventListener('click', event => {
    if (!navMenu.classList.contains('open')) return;
    if (navMenu.contains(event.target) || toggleBtn.contains(event.target)) return;
    closeMenu();
  });
}

function initScrollSpy() {
  const navLinks = Array.from(document.querySelectorAll('.nav-link[href^="#"]'));
  const sections = navLinks
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if (!navLinks.length || !sections.length || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(entries => {
    const visible = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    navLinks.forEach(link => {
      const active = link.getAttribute('href') === `#${visible.target.id}`;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }, {
    rootMargin: '-25% 0px -60% 0px',
    threshold: [0.01, 0.15, 0.4]
  });

  sections.forEach(section => observer.observe(section));
}

function initProjectFilters() {
  const buttons = Array.from(document.querySelectorAll('[data-project-filter]'));
  const cards = Array.from(document.querySelectorAll('[data-project-card]'));

  if (!buttons.length || !cards.length) return;

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.dataset.projectFilter || 'all';

      buttons.forEach(item => {
        const isActive = item === button;
        item.classList.toggle('active', isActive);
        item.setAttribute('aria-pressed', String(isActive));
      });

      cards.forEach(card => {
        const categories = (card.dataset.projectCategory || '').split(/\s+/).filter(Boolean);
        const shouldShow = filter === 'all' || categories.includes(filter);
        card.hidden = !shouldShow;
      });
    });
  });

  const initiallyActive = buttons.find(button => button.classList.contains('active')) || buttons[0];
  buttons.forEach(button => button.setAttribute('aria-pressed', String(button === initiallyActive)));
}

function setCurrentYear() {
  const year = String(new Date().getFullYear());
  document.querySelectorAll('#currentYear').forEach(element => {
    element.textContent = year;
  });
}
