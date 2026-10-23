import {galleryConfigs} from './data/gallery-data.mjs?v=20261023b';
import {initReceiptDemos} from './receipt-demo.mjs?v=20261023b';

'use strict';

document.documentElement.classList.add('js');

// Cross-document transitions may be skipped by the browser (for example in an
// embedded preview). Cancellation must not become an unhandled rejection.
for (const eventName of ['pageswap', 'pagereveal']) {
  window.addEventListener(eventName, event => {
    const transition = event.viewTransition;
    if (!transition) return;
    transition.ready.catch(() => {});
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) transition.skipTransition();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initReceiptDemos();
  const $ = selector => document.querySelector(selector);
  const mobileViewport = window.matchMedia('(max-width: 1080px)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const navToggle = $('#navToggle');
  const navMenu = $('#navMenu');
  const navBackdrop = $('#navBackdrop');
  const header = $('.site-header');
  const main = $('main');
  const footer = $('.site-footer');
  const brand = $('.brand');
  const progress = $('#scrollProgress');
  const backToTop = $('.back-to-top');
  const navLabel = $('.nav-toggle-label');
  const mediaLightbox = $('#mediaLightbox');
  const lightboxStage = $('#lightboxStage');
  const lightboxClose = $('#lightboxClose');
  const lightboxTitle = $('#lightboxTitle');
  const lightboxCaption = $('#lightboxCaption');
  const lightboxCount = $('#lightboxCount');
  const lightboxDialog = $('.lightbox-dialog');
  const overlayExtras = [...document.querySelectorAll('.portfolio-build-note, .back-to-top, .skip-link')];
  let menuOpen = false;
  let previousMenuFocus = null;
  let previousViewerFocus = null;
  let activeGallery = null;

  // One shared overlay state prevents focus or scroll locks from leaking.
  const setInert = (elements, value) => new Set([...elements, ...overlayExtras]).forEach(element => {
    if (element instanceof HTMLElement) element.inert = value;
  });

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
    if (navLabel) navLabel.textContent = 'Menu';
    if (navBackdrop) navBackdrop.hidden = true;
    document.body.classList.remove('menu-open');
    setInert([main, footer, brand, $('.nav-cv')], false);
    if (restoreFocus && previousMenuFocus instanceof HTMLElement) previousMenuFocus.focus({preventScroll: true});
    syncMenuVisibility();
  };

  const openNav = () => {
    if (!mobileViewport.matches || !navMenu || !navToggle || activeGallery) return;
    previousMenuFocus = document.activeElement;
    menuOpen = true;
    syncMenuVisibility();
    navMenu.classList.add('open');
    navToggle.classList.add('active');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Fechar menu');
    if (navLabel) navLabel.textContent = 'Fechar';
    if (navBackdrop) navBackdrop.hidden = false;
    document.body.classList.add('menu-open');
    setInert([main, footer, brand, $('.nav-cv')], true);
    navMenu.querySelector('a')?.focus({preventScroll: true});
  };

  navToggle?.addEventListener('click', () => menuOpen ? closeNav(true) : openNav());
  navBackdrop?.addEventListener('click', () => closeNav(true));
  navMenu?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    const wasOpen = menuOpen;
    closeNav(false);
    // After following a menu anchor, keyboard navigation resumes at the section.
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
    if (!mobileViewport.matches) closeNav(false);
    syncMenuVisibility();
  });
  window.addEventListener('pagehide', () => closeNav(false));
  syncMenuVisibility();

  // Reading position is measured once per animation frame, including tall sections.
  const sectionLinks = [...document.querySelectorAll('.nav-link[href^="#"]')];
  const sections = sectionLinks.map(link => document.getElementById(link.hash.slice(1))).filter(Boolean);
  let scrollFrame = 0;
  const updateReadingPosition = () => {
    scrollFrame = 0;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
    if (backToTop) backToTop.hidden = window.scrollY < 720;
    const offset = (header?.offsetHeight || 84) + 72;
    let activeId = '';
    sections.forEach(section => { if (section.getBoundingClientRect().top <= offset) activeId = section.id; });
    if (max > 0 && window.scrollY >= max - 4 && sections.length) activeId = sections[sections.length - 1].id;
    sectionLinks.forEach(link => {
      const active = link.hash === '#' + activeId;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };
  const scheduleReadingPosition = () => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateReadingPosition);
  };
  window.addEventListener('scroll', scheduleReadingPosition, {passive: true});
  window.addEventListener('resize', scheduleReadingPosition, {passive: true});
  window.addEventListener('load', scheduleReadingPosition, {once: true});
  updateReadingPosition();

  const revealElements = [...document.querySelectorAll('.reveal')];
  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.remove('reveal-pending');
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }), {threshold: .03, rootMargin: '0px 0px 32px'});
    // The introduction is immediately readable, including on a slow connection.
    revealElements.filter(element => !element.closest('.hero-grid, .projects-title-grid')).forEach((element, index) => {
      element.style.setProperty('--reveal-delay', `${(index % 3) * 55}ms`);
      element.classList.add('reveal-pending');
      revealObserver.observe(element);
    });
    reducedMotion.addEventListener('change', event => {
      if (!event.matches) return;
      revealObserver.disconnect();
      revealElements.forEach(element => element.classList.remove('reveal-pending'));
    });
  }


  const closeViewer = () => {
    if (!activeGallery || !mediaLightbox) return;
    mediaLightbox.hidden = true;
    mediaLightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    setInert([header, main, footer, backToTop], false);
    activeGallery = null;
    lightboxStage?.replaceChildren();
    if (previousViewerFocus instanceof HTMLElement && previousViewerFocus.isConnected) {
      previousViewerFocus.focus({preventScroll: true});
    }
  };

  const renderViewer = () => {
    if (!activeGallery || !lightboxStage) return;
    const {file, caption, title, mode, index, count} = activeGallery.current();
    const image = document.createElement('img');
    image.className = 'lightbox-image';
    image.alt = caption;
    image.src = file;
    image.decoding = 'async';
    lightboxStage.replaceChildren(image);
    if (lightboxTitle) lightboxTitle.textContent = `${title} · ${mode === 'mobile' ? 'Mobile' : 'Desktop'}`;
    if (lightboxCaption) lightboxCaption.textContent = caption;
    if (lightboxCount) lightboxCount.textContent = `${String(index + 1).padStart(2,'0')} / ${String(count).padStart(2,'0')}`;
  };

  const openViewer = gallery => {
    if (!mediaLightbox || !lightboxStage) return;
    closeNav(false);
    previousViewerFocus = document.activeElement;
    activeGallery = gallery;
    renderViewer();
    mediaLightbox.hidden = false;
    mediaLightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    setInert([header, main, footer, backToTop], true);
    lightboxClose?.focus({preventScroll: true});
  };
  lightboxClose?.addEventListener('click', closeViewer);
  $('#lightboxBackdrop')?.addEventListener('click', closeViewer);
  $('#lightboxPrev')?.addEventListener('click', () => activeGallery?.move(-1));
  $('#lightboxNext')?.addEventListener('click', () => activeGallery?.move(1));

  document.querySelectorAll('[data-carousel]').forEach(carousel => {
    const type = carousel.dataset.carousel;
    if (!galleryConfigs[type]) return;
    const frame = carousel.querySelector('[data-carousel-frame]');
    const viewport = carousel.querySelector('[data-carousel-open]');
    const countElement = carousel.querySelector('[data-carousel-count]');
    const captionElement = carousel.querySelector('[data-carousel-caption]');
    const progressElement = carousel.querySelector('[data-carousel-progress]');
    const modeButtons = [...carousel.querySelectorAll('[data-gallery-mode]')];
    let index = 0;
    let mode = carousel.dataset.mode || 'mobile';
    let nearViewport = false;
    let pointerStart = null;
    let lastSwipeAt = 0;
    let animateFrame = false;
    let frameAnimation = null;
    const preloadedFiles = new Set();
    const config = () => galleryConfigs[type][mode];
    const current = () => ({
      file: config().files[index], caption: config().captions[index],
      title: galleryConfigs[type].title, mode, index, count: config().files.length
    });

    const preloadNeighbors = () => {
      if (!nearViewport || navigator.connection?.saveData) return;
      [-1, 1].forEach(delta => {
        const files = config().files;
        const file = files[(index + delta + files.length) % files.length];
        if (preloadedFiles.has(file)) return;
        preloadedFiles.add(file);
        const image = new Image();
        image.decoding = 'async';
        image.src = file;
      });
    };

    const render = () => {
      const {file, caption, title, count} = current();
      carousel.dataset.mode = mode;
      carousel.dataset.count = String(count);
      if (frame instanceof HTMLImageElement) {
        if (frame.getAttribute('src') !== file) {
          animateFrame = nearViewport;
          frame.src = file;
        }
        frame.alt = caption;
        frame.width = mode === 'mobile' ? 1170 : 1613;
        frame.height = mode === 'mobile' ? 2532 : 928;
      }
      if (viewport) {
        viewport.classList.toggle('gallery-phone', mode === 'mobile');
        viewport.classList.toggle('gallery-desktop', mode !== 'mobile');
        viewport.setAttribute('aria-label', `Ampliar ${title} — ${caption}`);
      }
      if (countElement) countElement.textContent = `${String(index + 1).padStart(2,'0')} / ${String(count).padStart(2,'0')}`;
      if (captionElement) captionElement.textContent = caption;
      if (progressElement) progressElement.style.width = `${(index + 1) / count * 100}%`;
      modeButtons.forEach(button => {
        const active = button.dataset.galleryMode === mode;
        button.classList.toggle('active', active);
        button.setAttribute('aria-pressed', String(active));
      });
      preloadNeighbors();
      if (activeGallery === gallery) renderViewer();
    };

    const gallery = {current, move(delta) {
      index = (index + delta + config().files.length) % config().files.length;
      render();
    }};
    frame?.addEventListener('error', () => carousel.classList.add('has-media-error'));
    frame?.addEventListener('load', () => {
      carousel.classList.remove('has-media-error');
      if (animateFrame && !reducedMotion.matches && typeof frame.animate === 'function') {
        frameAnimation?.cancel();
        frameAnimation = frame.animate([{opacity: .45, transform: 'translateX(6px)'}, {opacity: 1, transform: 'none'}], {duration: 260, easing: 'cubic-bezier(.22,.68,.2,1)'});
      }
      animateFrame = false;
    });
    carousel.querySelector('[data-carousel-prev]')?.addEventListener('click', () => gallery.move(-1));
    carousel.querySelector('[data-carousel-next]')?.addEventListener('click', () => gallery.move(1));
    modeButtons.forEach(button => button.addEventListener('click', () => {
      mode = button.dataset.galleryMode;
      index = 0;
      render();
    }));
    carousel.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        gallery.move(event.key === 'ArrowLeft' ? -1 : 1);
      }
    });
    viewport?.addEventListener('pointerdown', event => {
      if (!event.isPrimary || event.button !== 0) return;
      pointerStart = {x: event.clientX, y: event.clientY};
    });
    viewport?.addEventListener('pointercancel', () => { pointerStart = null; });
    viewport?.addEventListener('pointerup', event => {
      if (!pointerStart) return;
      const dx = event.clientX - pointerStart.x;
      const dy = event.clientY - pointerStart.y;
      pointerStart = null;
      if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.25) {
        lastSwipeAt = Date.now();
        gallery.move(dx < 0 ? 1 : -1);
      }
    });
    viewport?.addEventListener('click', event => {
      if (Date.now() - lastSwipeAt < 350) { event.preventDefault(); return; }
      openViewer(gallery);
    });
    if ('IntersectionObserver' in window) {
      const mediaObserver = new IntersectionObserver(entries => {
        if (!entries.some(entry => entry.isIntersecting)) return;
        nearViewport = true;
        preloadNeighbors();
        mediaObserver.disconnect();
      }, {rootMargin: '240px'});
      mediaObserver.observe(carousel);
    } else nearViewport = true;
    render();
  });

  const trapFocus = (event, elements) => {
    const focusable = elements.filter(element => element instanceof HTMLElement && element.getClientRects().length && !element.inert);
    if (!focusable.length) return;
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (event.shiftKey && (document.activeElement === first || !focusable.includes(document.activeElement))) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && (document.activeElement === last || !focusable.includes(document.activeElement))) {
      event.preventDefault(); first.focus();
    }
  };

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      if (activeGallery) closeViewer();
      else if (menuOpen) closeNav(true);
      return;
    }
    if (activeGallery) {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        activeGallery.move(event.key === 'ArrowLeft' ? -1 : 1);
      }
      if (event.key === 'Tab') trapFocus(event, [...lightboxDialog.querySelectorAll('button,a[href]')]);
    } else if (menuOpen && event.key === 'Tab') {
      trapFocus(event, [navToggle, ...navMenu.querySelectorAll('a[href],button')]);
    }
  });
});
