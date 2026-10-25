import {setInert, trapFocus} from './focus.mjs';

/** Mobile menu owns its visibility, focus and background isolation. */
export function initNavigation({canOpen = () => true} = {}) {
  // Older browsers retain the visible, static navigation instead of hiding it.
  if (!window.matchMedia('(scripting: enabled)').matches) return {close() {}, isOpen: () => false};
  const $ = selector => document.querySelector(selector);
  const mobileViewport = window.matchMedia('(max-width: 1080px)');
  const navToggle = $('#navToggle');
  const navMenu = $('#navMenu');
  const navBackdrop = $('#navBackdrop');
  const main = $('main');
  const footer = $('.site-footer');
  const brand = $('.brand');
  let menuOpen = false;
  let previousMenuFocus = null;
  const syncMenuVisibility = () => {
    if (!navMenu) return;
    navMenu.inert = mobileViewport.matches && !menuOpen;
    if (mobileViewport.matches && !menuOpen) navMenu.setAttribute('aria-hidden', 'true');
    else navMenu.removeAttribute('aria-hidden');
  };

  const closeNav = (restoreFocus = false) => {
    if (!menuOpen) { syncMenuVisibility(); return; }
    menuOpen = false;
    navMenu?.classList.remove('open');
    navToggle?.classList.remove('active');
    navToggle?.setAttribute('aria-expanded', 'false');
    navToggle?.setAttribute('aria-label', 'Abrir menu');
    if (navBackdrop) navBackdrop.hidden = true;
    document.body.classList.remove('menu-open');
    setInert([main, footer, brand, $('.nav-cv')], false);
    if (restoreFocus && previousMenuFocus instanceof HTMLElement) previousMenuFocus.focus({preventScroll: true});
    syncMenuVisibility();
  };

  const openNav = () => {
    if (!mobileViewport.matches || !navMenu || !navToggle || !canOpen()) return;
    previousMenuFocus = document.activeElement;
    menuOpen = true;
    syncMenuVisibility();
    navMenu.classList.add('open');
    navToggle.classList.add('active');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Fechar menu');
    if (navBackdrop) navBackdrop.hidden = false;
    document.body.classList.add('menu-open');
    setInert([main, footer, brand, $('.nav-cv')], true);
    navMenu.querySelector('a')?.focus({preventScroll: true});
  };

  navToggle?.addEventListener('click', () => menuOpen ? closeNav(true) : openNav());
  navBackdrop?.addEventListener('click', () => closeNav(true));
  navMenu?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    const wasOpen = menuOpen;
    closeNav(wasOpen);
    if (wasOpen && link.hash && (link.pathname === window.location.pathname || link.getAttribute('href').startsWith('#'))) {
      const target = document.getElementById(decodeURIComponent(link.hash.slice(1)));
      if (target instanceof HTMLElement) {
        const hadTabindex = target.hasAttribute('tabindex');
        if (!hadTabindex) target.tabIndex = -1;
        target.focus({preventScroll: true});
        if (!hadTabindex) target.addEventListener('blur', () => target.removeAttribute('tabindex'), {once: true});
      }
    }
  }));
  mobileViewport.addEventListener('change', () => {
    const focused = document.activeElement;
    if (!mobileViewport.matches) closeNav(false);
    syncMenuVisibility();
    if (mobileViewport.matches && !menuOpen && navMenu?.contains(focused)) {
      navToggle?.focus({preventScroll: true});
    } else if (!mobileViewport.matches && focused === navToggle) {
      (navMenu?.querySelector('.nav-link[aria-current]') || navMenu?.querySelector('.nav-link'))?.focus({preventScroll: true});
    }
  });
  window.addEventListener('pagehide', () => closeNav(true));
  syncMenuVisibility();

  document.addEventListener('keydown', event => {
    if (!menuOpen) return;
    if (event.key === 'Escape') closeNav(true);
    if (event.key === 'Tab') trapFocus(event, [navToggle, ...navMenu.querySelectorAll('a[href],button')]);
  });
  return {close: closeNav, isOpen: () => menuOpen};
}
