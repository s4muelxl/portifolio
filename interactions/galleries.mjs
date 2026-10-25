import {galleryConfigs} from '../data/gallery-data.mjs';
import {setInert, trapFocus} from './focus.mjs';

/** Galleries and their shared lightbox own only media interaction state. */
export function initGalleries({closeNavigation = () => {}} = {}) {
  const $ = selector => document.querySelector(selector);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const header = $('.site-header');
  const main = $('main');
  const footer = $('.site-footer');
  const backToTop = $('.back-to-top');
  const mediaLightbox = $('#mediaLightbox');
  const lightboxStage = $('#lightboxStage');
  const lightboxClose = $('#lightboxClose');
  const lightboxTitle = $('#lightboxTitle');
  const lightboxCaption = $('#lightboxCaption');
  const lightboxCount = $('#lightboxCount');
  const lightboxDialog = $('.lightbox-dialog');
  let previousViewerFocus = null;
  let activeGallery = null;
  if (!mediaLightbox || !lightboxStage || !lightboxDialog || !lightboxClose) {
    return {isOpen: () => false};
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
    image.addEventListener('error', () => {
      if (image !== lightboxStage.firstElementChild) return;
      const message = document.createElement('p');
      message.className = 'media-error-message';
      message.setAttribute('role', 'status');
      message.textContent = 'Não foi possível carregar esta imagem. Use as setas para ver as outras telas.';
      lightboxStage.replaceChildren(message);
    }, {once: true});
    lightboxStage.replaceChildren(image);
    if (lightboxTitle) lightboxTitle.textContent = `${title} · ${mode === 'mobile' ? 'Mobile' : 'Desktop'}`;
    if (lightboxCaption) lightboxCaption.textContent = caption;
    if (lightboxCount) lightboxCount.textContent = `${String(index + 1).padStart(2,'0')} / ${String(count).padStart(2,'0')}`;
  };

  const openViewer = gallery => {
    if (!mediaLightbox || !lightboxStage) return;
    closeNavigation();
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
    const modes = Object.keys(galleryConfigs[type]).filter(key => key !== 'title');
    let mode = modes.includes(carousel.dataset.mode) ? carousel.dataset.mode : modes[0];
    if (!mode || !galleryConfigs[type][mode]?.files?.length
        || !(frame instanceof HTMLImageElement) || !(viewport instanceof HTMLButtonElement)) return;
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
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      if (!nearViewport || connection?.saveData || /^(slow-2g|2g)$/.test(connection?.effectiveType || '')) return;
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
      if (!modes.includes(button.dataset.galleryMode)) return;
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

  document.addEventListener('keydown', event => {
    if (!activeGallery) return;
    if (event.key === 'Escape') { closeViewer(); return; }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      activeGallery.move(event.key === 'ArrowLeft' ? -1 : 1);
    }
    if (event.key === 'Tab') trapFocus(event, [...lightboxDialog.querySelectorAll('button,a[href]')]);
  });
  window.addEventListener('pagehide', closeViewer);
  return {isOpen: () => activeGallery !== null};
}
