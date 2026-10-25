/** Enhance below-the-fold content once; never hide content in reduced motion. */
export function initReveals() {
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const inApp = document.documentElement.classList.contains('in-app-browser');
  const targets = [...document.querySelectorAll('.reveal')]
    .filter(element => !element.closest('.hero-grid, .projects-title-grid'));
  if (!('IntersectionObserver' in window) || preference.matches || inApp) return;

  const show = element => {
    element.classList.remove('reveal-pending');
    element.classList.add('is-visible');
  };
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      show(entry.target);
      observer.unobserve(entry.target);
    }
  }, {threshold: 0.03, rootMargin: '0px 0px 32px'});

  for (const element of targets) {
    element.classList.add('reveal-pending');
    observer.observe(element);
  }
  const finish = () => {
    observer.disconnect();
    targets.forEach(show);
    preference.removeEventListener('change', onPreferenceChange);
    window.removeEventListener('pagehide', finish);
  };
  const onPreferenceChange = event => { if (event.matches) finish(); };
  preference.addEventListener('change', onPreferenceChange);
  window.addEventListener('pagehide', finish, {once: true});
}
