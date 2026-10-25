/** Keep the mobile certificate disclosure independent of motion enhancement. */
export function initCertificates() {
  const grid = document.querySelector('#certGrid');
  const toggle = document.querySelector('.cert-mobile-toggle');
  if (!grid || !toggle) return;
  const cards = [...grid.querySelectorAll('.cert-card')];
  const compact = window.matchMedia('(max-width: 560px)');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let expanded = false;
  const sync = () => {
    toggle.hidden = !compact.matches;
    cards.forEach((card, index) => {
      card.classList.toggle('mobile-cert-hidden', compact.matches && !expanded && index >= 6);
    });
    toggle.setAttribute('aria-expanded', String(expanded));
    const label = toggle.querySelector('span');
    if (label) label.textContent = expanded ? 'Mostrar menos' : `Mostrar todas as ${cards.length} formações`;
  };
  toggle.addEventListener('click', () => {
    expanded = !expanded;
    sync();
    if (!expanded) grid.scrollIntoView({block: 'nearest', behavior: motion.matches ? 'auto' : 'smooth'});
  });
  compact.addEventListener('change', sync);
  sync();
}
